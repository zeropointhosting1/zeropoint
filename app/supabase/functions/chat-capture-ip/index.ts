// Records the real request IP against a chat conversation — the one
// piece of visitor info a static site with no server of its own genuinely
// can't see client-side (a browser has no API for its own public IP).
// No geolocation lookup and no third party involved: this reads the IP
// Supabase's edge network attaches to the request and writes it straight
// to Postgres.
//
// Deliberately does NOT use the service-role key. verify_jwt stays on
// (see supabase/config.toml), so only a request carrying a real Supabase
// session JWT reaches this code at all, and the Supabase client below is
// built with that same incoming JWT — every query it makes runs as that
// visitor, under the same chat_conversations_visitor RLS policy the
// browser itself is bound by (supabase/migrations/0001_admin.sql). That
// means a visitor can only ever set the IP on a conversation they already
// own; there is no elevated-privilege path here to misuse.
import { createClient } from "npm:@supabase/supabase-js@2"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// Supabase's edge network sits in front of every function call and
// appends the real client address here — checked in rough order of how
// commonly a given proxy layer sets it. x-forwarded-for can carry a
// comma-separated chain (client, then each hop); the first entry is the
// original client.
function clientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? req.headers.get("cf-connecting-ip")
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS })
  }

  try {
    const { conversation_id } = await req.json()
    if (!conversation_id || typeof conversation_id !== "string") {
      return new Response(JSON.stringify({ error: "conversation_id is required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      })
    }

    const ip = clientIp(req)
    if (!ip) {
      return new Response(JSON.stringify({ error: "Couldn't determine request IP" }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    )

    const { error } = await supabase.from("chat_conversations").update({ ip }).eq("id", conversation_id)
    if (error) throw error

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    })
  }
})
