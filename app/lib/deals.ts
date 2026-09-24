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
// listed with a low-end AMD APU, a listing padded out with a monitor, a
// DDR3-era board, or a full-size SFF/Tower desktop (as opposed to the
// Mini/USDT form factor these searches are meant to surface).
// Applied client-side (case-insensitive) since the Edge Function's own
// exclusions are keyword/category based, not spec based.
const WEAK_TITLE_REGEX =
  /\b(a4|a6|a8|a10)-\d{3,4}\b|\bamd a[468]\b|\bddr3\b|\bwith monitor\b|\bw\/ ?monitor\b|\+ ?monitor\b|\band monitor\b|\bsff\b|\bsmall form factor\b|\btower\b|\bcore 2 duo\b|\bpentium\b|\bceleron\b|\bamd fx-?\d|\bathlon\b/i

export function isWeakListing(title: string): boolean {
  return WEAK_TITLE_REGEX.test(title)
}

// eBay's Browse API doesn't expose structured specs, only the listing
// title — these are all best-effort regex reads, not guaranteed-accurate
// specs. RAM specifically prefers an explicit "<N>GB RAM/Memory" mention
// over a bare "<N>GB" match, since a bare match previously grabbed the
// first GB figure in the title regardless of context — on a title like
// "256GB SSD, 16GB RAM" that silently read the storage size as the RAM
// size, which is what let 8/16 GB machines pass a 70+ GB Sizer filter.
// Sizes RAM actually ships in for this class of hardware — used as a
// second signal alongside "not next to a storage keyword", since a bare
// number with no label at all ("i5-9500, 256GB,16Gb") still needs to pick
// the right one. 256 isn't a real SO-DIMM size for these machines even
// when nothing in the title flags it as storage; 16 is.
const RAM_TYPICAL_GB = new Set([4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128])
const STORAGE_CONTEXT = /\b(ssd|hdd|nvme|m\.2|emmc|storage|disk|drive)\b/i

export function listingRamGb(title: string): number | null {
  // An explicit "<N>GB RAM/Memory" or "RAM/Memory <N>GB" (or "<N>GB DDR..")
  // mention wins outright, regardless of what else is in the title.
  const explicit =
    title.match(/(\d{1,4})\s?gb\s?(ram|memory)\b/i) ??
    title.match(/\b(ram|memory)\s?:?\s?(\d{1,4})\s?gb/i) ??
    title.match(/(\d{1,4})\s?gb\s?ddr\d?/i)
  if (explicit) return Number(explicit[1] ?? explicit[2])

  // Otherwise, only a GB figure that's both away from a storage-type word
  // AND a size RAM actually comes in — a bare "256GB" is a drive even
  // with no "SSD" anywhere near it, because RAM doesn't come in 256GB
  // sticks for this hardware class. Evaluated per comma/slash-delimited
  // segment (not a fixed character window) so a neighboring spec's "SSD"
  // label can't bleed over onto this one, e.g. "8GB/256GB SSD" — the
  // window approach would see "SSD" near the 8 too and wrongly drop it.
  for (const segment of title.split(/[,/|]/)) {
    const nearStorage = STORAGE_CONTEXT.test(segment)
    for (const match of segment.matchAll(/(\d{1,4})\s?gb\b/gi)) {
      const value = Number(match[1])
      if (RAM_TYPICAL_GB.has(value) && !nearStorage) return value
    }
  }
  return null
}

// Strict on purpose: a listing whose RAM can't be determined from its
// title no longer silently passes a minimum-RAM filter — that ambiguity
// (plus not excluding non-compute categories) was the actual bug behind
// UniFi switches and low-RAM machines showing up under a 70+ GB filter.
export function meetsMinRam(title: string, minRamGb: number): boolean {
  const ram = listingRamGb(title)
  return ram !== null && ram >= minRamGb
}

// Categories a compute-driven RAM filter (e.g. arriving from the Sizer)
// should even consider — a switch or rack shelf never "has RAM" in the
// sense the filter means.
export const COMPUTE_CATEGORIES = ["HP EliteDesk", "Mini PCs"] as const

const INTEL_CORE_PATTERN = /\bi([3579])-(\d{3,5})([a-z]{0,2})\b/i
// No trailing \b: NUC model codes run straight into a letter suffix (e.g.
// "NUC5i5RYH"), so there's no word boundary between the generation digit
// and the "i" that follows it.
const INTEL_NUC_PATTERN = /\bnuc\s?-?\s?(\d{1,2})i[3579]/i
const RYZEN_PATTERN = /\bryzen\s*([3579])\s*-?\s*(\d{4})([a-z]{0,2})\b/i

export function parseCpuLabel(title: string): string | null {
  const core = title.match(INTEL_CORE_PATTERN)
  if (core) return `i${core[1]}-${core[2]}${core[3] ? core[3].toUpperCase() : ""}`
  const ryzen = title.match(RYZEN_PATTERN)
  if (ryzen) return `Ryzen ${ryzen[1]} ${ryzen[2]}${ryzen[3] ? ryzen[3].toUpperCase() : ""}`
  return null
}

// Generation is what actually determines Quick Sync availability and
// general performance-per-watt — used both for the spec chip and the
// pre-8th-gen quality floor below.
export function parseCpuGeneration(title: string): number | null {
  const core = title.match(INTEL_CORE_PATTERN)
  if (core) {
    const digits = core[2]
    return digits.length === 5 ? Number(digits.slice(0, 2)) : Number(digits[0])
  }
  const nuc = title.match(INTEL_NUC_PATTERN)
  if (nuc) return Number(nuc[1])
  const ryzen = title.match(RYZEN_PATTERN)
  if (ryzen) return Math.floor(Number(ryzen[2]) / 1000)
  return null
}

export function parseStorageLabel(title: string): string | null {
  const match =
    title.match(/(\d{2,4})\s?(gb|tb)\s?(nvme|ssd|hdd|m\.2)/i) ?? title.match(/(nvme|ssd|hdd|m\.2)\s?(\d{2,4})\s?(gb|tb)/i)
  if (!match) return null
  const isTypeFirst = /^(nvme|ssd|hdd|m\.2)/i.test(match[0])
  const size = isTypeFirst ? match[2] : match[1]
  const unit = (isTypeFirst ? match[3] : match[2]).toUpperCase()
  const type = (isTypeFirst ? match[1] : match[3]).toUpperCase()
  return `${size}${unit} ${type}`
}

export function parsePowerAdapter(title: string): "included" | "not-included" | null {
  if (/\bno\s+(power\s+)?(adapter|charger|psu|power\s+supply)\b/i.test(title)) return "not-included"
  if (/(with|w\/|includes?)\s+(power\s+)?(adapter|charger|psu|power\s+supply)\b/i.test(title)) return "included"
  return null
}

export function isBarebonesListing(title: string): boolean {
  return /\bbare-?bones?\b/i.test(title) || /\bno\s+(hdd|ssd|ram|os|memory)\b/i.test(title)
}

// Same-generation-and-newer only — pre-8th-gen Intel and pre-Ryzen-2000
// AMD are excluded from the compute categories because they can't do
// Quick Sync (or the AMD equivalent) the way these builds assume.
export function isLegacyCpu(title: string): boolean {
  const generation = parseCpuGeneration(title)
  if (generation !== null) return generation < 8
  return /\bcore 2 duo\b|\bpentium\b|\bceleron\b|\bamd fx-?\d|\bathlon\b/i.test(title)
}

export function shippingCostUsd(shipping: string | null): number {
  if (!shipping) return 0
  if (/free/i.test(shipping)) return 0
  const match = shipping.match(/\$(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : 0
}

// Preferred over Ubiquiti's/Cisco's own enterprise gear: compact, fanless
// or near-silent switches that are actually reasonable in a home closet.
const CISCO_PREFERRED_PATTERN = /2960-?c\b|2960-?cx\b|3560-?cx\b/i
// Data-center gear that shows up in a "Cisco Catalyst Switch" search but
// isn't remotely homelab-sized — loud, power-hungry, and usually rack-only.
const CISCO_DATACENTER_PATTERN = /catalyst\s?9500\b|3850.{0,15}48[\s-]?port|48[\s-]?port.{0,15}3850/i

export function isDatacenterCiscoGear(title: string): boolean {
  return CISCO_DATACENTER_PATTERN.test(title)
}

export function isHomelabFriendlyCisco(title: string): boolean {
  return CISCO_PREFERRED_PATTERN.test(title)
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
