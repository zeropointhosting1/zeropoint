// Public GET endpoint, called directly from the browser — this site is a
// static export with no server of its own. See app/lib/deals.ts for the
// frontend contract this returns: { deals: Deal[], updatedAt: string }.
//
// The eBay Client ID/Secret live only as Supabase function secrets
// (`supabase secrets set`) — never sent to or readable by the browser. The
// Supabase anon key the browser does send just identifies the project; it
// doesn't grant access to these secrets.

// Read lazily inside the request handler (not at module load) so a missing
// or malformed secret returns a normal JSON error instead of crashing the
// whole isolate before it can even respond — that crash looks like an
// opaque "WORKER_ERROR" with no detail, which is much harder to debug than
// a message naming the exact missing variable.
function requireEnv(name: string): string {
  const value = Deno.env.get(name)
  if (!value || !value.trim()) {
    throw new Error(`Missing "${name}" secret — run: supabase secrets set ${name}=...`)
  }
  // .trim() guards against a stray trailing newline/space sneaking in from
  // a copy-paste into `supabase secrets set` — that's silently invalid for
  // Basic Auth and shows up as eBay's "invalid_client" with no useful detail.
  return value.trim()
}

// Terms that show up on cables, adapters, RAM sticks, and other parts that
// happen to mention "EliteDesk" or "UniFi" in their title without being the
// actual device. Appended to every search as eBay exclusion tokens.
const EXCLUDE_TERMS = [
  "cable", "adapter", "charger", "bracket", "caddy", "bezel", "mount",
  "screw", "case", "cover", "sticker", "decal", "manual", "stand",
  "\"power supply\"", "ram", "memory", "\"for parts\"", "\"parts only\"",
  "heatsink", "fan", "faceplate", "keyboard", "mouse",
]

// Kept in sync by hand with DEAL_CATEGORIES in app/lib/deals.ts — this
// function runs on Deno (Supabase Edge Functions), the site is a separate
// Next.js bundle, so the two can't share a module directly.
//
// `category` is the coarse group the frontend filter buttons switch
// between (several search terms can share one, e.g. every EliteDesk
// generation). categoryIds is eBay's own category id and is what actually
// keeps cables/RAM/adapters out, since those live in entirely different
// eBay categories and can't match regardless of keywords — it only applies
// to full-machine searches; UniFi/Cisco gear has no single clean eBay
// category id, so those rely on the keyword exclusions + price floor.
const KEYWORDS: {
  term: string
  category: string
  categoryIds?: string
  minPrice: number
  limit: number
  omitExclusions?: string[]
}[] = [
  { term: "HP EliteDesk 800", category: "HP EliteDesk", categoryIds: "179", minPrice: 40, limit: 12 },
  { term: "HP EliteDesk 705", category: "HP EliteDesk", categoryIds: "179", minPrice: 40, limit: 12 },
  { term: "HP EliteDesk 600", category: "HP EliteDesk", categoryIds: "179", minPrice: 40, limit: 10 },
  { term: "HP EliteDesk Mini", category: "HP EliteDesk", categoryIds: "179", minPrice: 40, limit: 12 },
  { term: "NUC Mini PC", category: "Mini PCs", categoryIds: "179", minPrice: 40, limit: 8 },
  { term: "UniFi Flex Mini", category: "UniFi", minPrice: 15, limit: 6 },
  { term: "UniFi Cloud Gateway", category: "UniFi", minPrice: 50, limit: 6 },
  { term: "UniFi Switch", category: "UniFi", minPrice: 20, limit: 6 },
  { term: "Cisco Catalyst Switch", category: "Cisco", minPrice: 30, limit: 8 },
  // "case" and "cover" were still in the default exclusion list here even
  // though 10-inch rack cabinets and shelves are routinely titled "rack
  // case" or sold with a "dust cover" mention — that was excluding real,
  // relevant listings and is the likely cause of this category returning
  // zero results. "stand" is omitted too, since small racks are often
  // literally sold as a "rack stand".
  { term: "10 Inch Server Rack", category: "10-inch Rack", minPrice: 30, limit: 8, omitExclusions: ["mount", "bracket", "case", "cover", "stand"] },
  { term: "10 Inch Rack Shelf", category: "10-inch Rack", minPrice: 10, limit: 8, omitExclusions: ["mount", "bracket", "case", "cover", "stand"] },
  { term: "10 Inch Patch Panel", category: "10-inch Rack", minPrice: 12, limit: 8, omitExclusions: ["mount", "faceplate", "case", "cover"] },
]

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
}

// Module-level cache — survives for the life of a warm Deno isolate, which
// is enough to avoid re-authenticating on every request without needing a
// database. A cold start just fetches a fresh token; eBay app tokens are
// good for ~2 hours so this isn't wasteful either way.
let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(host: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value
  }
  const clientId = requireEnv("EBAY_CLIENT_ID")
  const clientSecret = requireEnv("EBAY_CLIENT_SECRET")
  const credentials = btoa(`${clientId}:${clientSecret}`)
  const res = await fetch(`https://${host}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
  })
  if (!res.ok) {
    throw new Error(`eBay token request failed: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cachedToken.value
}

type EbayItem = {
  itemId: string
  title: string
  price?: { value: string; currency: string }
  image?: { imageUrl: string }
  itemWebUrl: string
  condition?: string
  shippingOptions?: { shippingCost?: { value: string; currency: string } }[]
}

async function searchKeyword(
  host: string,
  token: string,
  spec: { term: string; categoryIds?: string; minPrice: number; limit: number; omitExclusions?: string[] }
): Promise<EbayItem[]> {
  const url = new URL(`https://${host}/buy/browse/v1/item_summary/search`)
  // Sorting by price surfaces the cheapest keyword match regardless of
  // relevance — a $7 HDD cable that mentions "EliteDesk" in its title beats
  // an actual EliteDesk out of the listing. Leaving sort unset uses eBay's
  // relevance ranking instead; the price floor and exclusion terms do the
  // actual filtering, and categoryIds (when set) makes accessories
  // structurally unable to match at all.
  const exclusions = EXCLUDE_TERMS.filter((term) => !spec.omitExclusions?.includes(term))
  const q = `${spec.term} ${exclusions.map((t) => `-${t}`).join(" ")}`
  url.searchParams.set("q", q)
  url.searchParams.set("limit", String(spec.limit))
  url.searchParams.set(
    "filter",
    `buyingOptions:{FIXED_PRICE},price:[${spec.minPrice}..],priceCurrency:USD`
  )
  if (spec.categoryIds) url.searchParams.set("category_ids", spec.categoryIds)

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    },
  })
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data.itemSummaries) ? data.itemSummaries : []
}

function shippingLabel(item: EbayItem): string | null {
  const cost = item.shippingOptions?.[0]?.shippingCost
  if (!cost) return null
  return Number(cost.value) === 0 ? "Free shipping" : `+$${cost.value} shipping`
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS })
  }

  try {
    const env = (Deno.env.get("EBAY_ENV") ?? "production").trim() // "production" | "sandbox"
    const host = env === "sandbox" ? "api.sandbox.ebay.com" : "api.ebay.com"
    const token = await getAccessToken(host)
    const results = await Promise.all(
      KEYWORDS.map(async (spec) => {
        const items = await searchKeyword(host, token, spec)
        const prices = items.map((item) => (item.price ? Number(item.price.value) : 0)).filter((p) => p > 0)
        // "Hot deal" is relative to this same search's own current
        // listings, not an external price guide — with only a handful of
        // results per term that's the honest amount of signal available,
        // so it only fires with enough listings to make a median mean
        // anything, and only for a real gap, not noise.
        const typical = prices.length >= 3 ? median(prices) : null

        return items.map((item) => {
          const price = item.price ? Number(item.price.value) : 0
          return {
            id: item.itemId,
            title: item.title,
            price,
            currency: item.price?.currency ?? "USD",
            condition: item.condition ?? "Used",
            imageUrl: item.image?.imageUrl ?? "",
            listingUrl: item.itemWebUrl,
            shipping: shippingLabel(item),
            keyword: spec.term,
            category: spec.category,
            isHotDeal: typical !== null && price > 0 && price <= typical * 0.8,
          }
        })
      })
    )

    // Several search terms can legitimately match the same physical
    // listing (e.g. "HP EliteDesk 800" and "HP EliteDesk Mini" both hit an
    // 800-series Mini) — eBay returns the same itemId either way, so
    // without this it'd render as a duplicate card. First match wins.
    const seen = new Set<string>()
    const deals = results
      .flat()
      .filter((d) => d.imageUrl && d.price > 0)
      .filter((d) => (seen.has(d.id) ? false : (seen.add(d.id), true)))

    return new Response(JSON.stringify({ deals, updatedAt: new Date().toISOString() }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    })
  }
})
