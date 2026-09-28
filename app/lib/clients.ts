import { getSupabaseClient } from "@/lib/supabase/client"

export type ClientStatus = "active" | "paused" | "cancelled"
export type UptimeStatus = "up" | "down" | "unknown"

export type Client = {
  id: string
  name: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  site_url: string
  notes: string | null
  status: ClientStatus
  last_status: UptimeStatus
  last_checked_at: string | null
  last_response_ms: number | null
  created_at: string
}

export type ClientCheck = {
  id: string
  client_id: string
  checked_at: string
  is_up: boolean
  status_code: number | null
  response_ms: number | null
  error: string | null
}

export type ClientInput = Pick<Client, "name" | "site_url"> &
  Partial<Pick<Client, "contact_name" | "contact_email" | "contact_phone" | "notes" | "status">>

export async function fetchClients(): Promise<Client[]> {
  const { data } = await getSupabaseClient().from("clients").select("*").order("name", { ascending: true })
  return (data as Client[]) ?? []
}

export async function fetchClientChecks(clientId: string, limit = 20): Promise<ClientCheck[]> {
  const { data } = await getSupabaseClient()
    .from("client_checks")
    .select("*")
    .eq("client_id", clientId)
    .order("checked_at", { ascending: false })
    .limit(limit)
  return (data as ClientCheck[]) ?? []
}

// Every client's checks since `sinceIso` in one query — the dashboard's
// uptime strips and fleet stats group these client-side rather than
// making one request per client. 15-minute cadence means ~96 rows per
// client per day, so the cap leaves headroom for a few dozen clients.
export async function fetchRecentChecks(sinceIso: string, limit = 5000): Promise<ClientCheck[]> {
  const { data } = await getSupabaseClient()
    .from("client_checks")
    .select("*")
    .gte("checked_at", sinceIso)
    .order("checked_at", { ascending: false })
    .limit(limit)
  return (data as ClientCheck[]) ?? []
}

// Named to avoid colliding with Supabase's own createClient (lib/supabase/client.ts)
export async function addClient(input: ClientInput): Promise<Client> {
  const { data, error } = await getSupabaseClient().from("clients").insert(input).select("*").single()
  if (error || !data) throw error ?? new Error("Couldn't create client")
  return data as Client
}

export async function updateClient(id: string, patch: Partial<ClientInput>): Promise<void> {
  await getSupabaseClient().from("clients").update(patch).eq("id", id)
}

export async function removeClient(id: string): Promise<void> {
  await getSupabaseClient().from("clients").delete().eq("id", id)
}
