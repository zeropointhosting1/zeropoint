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
