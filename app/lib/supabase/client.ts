import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Same two env vars lib/deals.ts already reads — one Supabase project
// backs both the eBay-deals Edge Function and everything under /admin.
export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

let client: SupabaseClient | null = null

// Lazy singleton: a static export has no server to construct this once at
// boot, so it's built on first use in the browser and reused after that.
export function getSupabaseClient(): SupabaseClient {
  if (!SUPABASE_CONFIGURED) {
    throw new Error("Supabase isn't configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }
  if (!client) {
    client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  }
  return client
}
