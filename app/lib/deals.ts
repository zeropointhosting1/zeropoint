// Curated search terms for homelab starter hardware — kept in sync by hand
// with the KEYWORDS list in supabase/functions/ebay-deals/index.ts, since
// that runs on Deno and can't share a module with this Next.js bundle.
export const DEAL_KEYWORDS = [
  "HP EliteDesk 800",
  "HP EliteDesk 705",
  "HP EliteDesk 600",
  "HP EliteDesk Mini",
  "NUC Mini PC",
  "UniFi Flex Mini",
  "UniFi Cloud Gateway",
  "UniFi Switch",
  "Cisco Catalyst Switch",
  "10 Inch Server Rack",
  "10 Inch Rack Shelf",
  "10 Inch Patch Panel",
] as const

// The coarse groups the filter buttons on /deals switch between — several
// DEAL_KEYWORDS searches can share one category. Also kept in sync by hand
// with the `category` values in the Edge Function.
export const DEAL_CATEGORIES = ["HP EliteDesk", "Mini PCs", "UniFi", "Cisco", "10-inch Rack"] as const

export type Deal = {
  id: string
  title: string
  price: number
  currency: string
  condition: string
  imageUrl: string
  listingUrl: string
  shipping: string | null
  keyword: string
  category: string
  // Priced meaningfully below the median of this same search's other
  // current listings — a signal relative to what's on eBay right now for
  // that term, not a claim about "market value" from any external source.
  isHotDeal: boolean
}

export type DealsResponse = {
  deals: Deal[]
  updatedAt: string
}

// Title substrings that flag a listing as too weak or bundled to be worth
// showing here, even though it matched a search term — e.g. an EliteDesk
// listed with a low-end AMD APU, a listing padded out with a monitor, or a
// DDR3-era board that can't take the RAM these builds actually need.
// Applied client-side (case-insensitive) since the Edge Function's own
// exclusions are keyword/category based, not spec based.
export const WEAK_SPEC_PATTERNS = [
  "a6-", "a8-", "amd a6", "amd a8",
  "ddr3",
  "with monitor", "w/ monitor", "+ monitor", "and monitor",
]

export function isWeakListing(title: string): boolean {
  const lower = title.toLowerCase()
  return WEAK_SPEC_PATTERNS.some((pattern) => lower.includes(pattern))
}

// eBay's Browse API doesn't expose structured specs, only the listing
// title — so this is a best-effort regex read of a "16GB" / "16 GB"
// pattern, not a guaranteed-accurate spec. Used to link in from the sizer
// with a minimum RAM the visitor actually needs; a listing whose RAM
// can't be determined from its title is kept rather than hidden, since a
// failed guess shouldn't hide a real match.
export function listingRamGb(title: string): number | null {
  const match = title.match(/(\d{1,3})\s*gb\b/i)
  return match ? Number(match[1]) : null
}

export function meetsMinRam(title: string, minRamGb: number): boolean {
  const ram = listingRamGb(title)
  return ram === null || ram >= minRamGb
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Contract for the Edge Function once it's deployed:
//   GET {SUPABASE_URL}/functions/v1/ebay-deals -> { deals: Deal[], updatedAt: string }
// It reads real eBay Browse API results server-side (API key never touches
// the browser) and returns them filtered to DEAL_KEYWORDS. Until both env
// vars are set, DEALS_ENDPOINT is null and the page shows an honest
// "not connected yet" state instead of fabricated listings.
export const DEALS_ENDPOINT =
  SUPABASE_URL && SUPABASE_ANON_KEY ? `${SUPABASE_URL}/functions/v1/ebay-deals` : null
