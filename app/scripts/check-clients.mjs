// Run on a schedule by .github/workflows/uptime-check.yml. Reads every
// row in `clients`, fetches its site_url, and records the result — both
// a client_checks history row and the clients.last_* summary columns the
// admin dashboard's table reads.
//
// Uses the service-role key (SUPABASE_SERVICE_ROLE_KEY), which bypasses
// RLS entirely — that's expected here (this job is the one legitimate
// writer of client_checks other than the dashboard itself) and is why
// that key must only ever live as a GitHub Actions secret, never in the
// browser bundle or committed to the repo.
import { createClient } from "@supabase/supabase-js"
import { checkSite } from "./uptime-probe.mjs"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("check-clients: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are both required.")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const { data: clients, error } = await supabase.from("clients").select("id, site_url").eq("status", "active")
if (error) {
  console.error("check-clients: couldn't load clients:", error.message)
  process.exit(1)
}

for (const client of clients ?? []) {
  const result = await checkSite(client.site_url)
  const checkedAt = new Date().toISOString()

  const { error: historyError } = await supabase.from("client_checks").insert({
    client_id: client.id,
    checked_at: checkedAt,
    is_up: result.isUp,
    status_code: result.statusCode,
    response_ms: result.responseMs,
    error: result.error,
  })

  if (historyError) {
    console.error(`check-clients: history write failed for ${client.id}: ${historyError.message}`)
    process.exitCode = 1
    continue
  }

  const { error: summaryError } = await supabase
    .from("clients")
    .update({
      last_status: result.isUp ? "up" : "down",
      last_checked_at: checkedAt,
      last_response_ms: result.responseMs,
    })
    .eq("id", client.id)

  if (summaryError) {
    console.error(`check-clients: summary write failed for ${client.id}: ${summaryError.message}`)
    process.exitCode = 1
  }

  console.log(`${result.isUp ? "UP  " : "DOWN"} ${client.site_url} (${result.responseMs}ms)${result.error ? ` — ${result.error}` : ""}`)
}
