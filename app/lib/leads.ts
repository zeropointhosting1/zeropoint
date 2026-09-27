import { getSupabaseClient, SUPABASE_CONFIGURED } from "@/lib/supabase/client"

export type LeadSource = "contact" | "estimate"
export type LeadStatus = "new" | "contacted" | "won" | "lost"

export type Lead = {
  id: string
  source: LeadSource
  name: string
  email: string
  message: string
  help: string | null
  details: Record<string, unknown> | null
  status: LeadStatus
  notes: string | null
  created_at: string
}

export type SubmitLeadResult = "sent" | "not-configured" | "error"

export type NewLead = {
  source: LeadSource
  name: string
  email: string
  message: string
  help?: string
  details?: Record<string, unknown>
}

// Shared by the Contact and Estimate forms — inserts straight into
// Supabase so submissions show up in /admin/leads. RLS (see
// supabase/migrations/0001_admin.sql) allows this insert with no session;
// only an admin can read the table back.
export async function submitLead(lead: NewLead): Promise<SubmitLeadResult> {
  if (!SUPABASE_CONFIGURED) return "not-configured"
  try {
    const { error } = await getSupabaseClient().from("leads").insert({
      source: lead.source,
      name: lead.name,
      email: lead.email,
      message: lead.message,
      help: lead.help ?? null,
      details: lead.details ?? null,
    })
    return error ? "error" : "sent"
  } catch {
    return "error"
  }
}
