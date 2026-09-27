"use client"

import * as React from "react"
import type { Session } from "@supabase/supabase-js"
import { getSupabaseClient, SUPABASE_CONFIGURED } from "@/lib/supabase/client"

type AdminSessionState =
  | { status: "not-configured" }
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "unauthorized"; session: Session }
  | { status: "admin"; session: Session }

// Checked once per sign-in (not on every render): membership in `admins`
// is what RLS actually gates on, so a session alone doesn't mean the
// signed-in user is you — it could be a visitor's anonymous chat session.
async function checkIsAdmin(session: Session): Promise<boolean> {
  const { data, error } = await getSupabaseClient()
    .from("admins")
    .select("id")
    .eq("id", session.user.id)
    .maybeSingle()
  return !error && Boolean(data)
}

export function useAdminSession(): AdminSessionState {
  const [state, setState] = React.useState<AdminSessionState>(
    SUPABASE_CONFIGURED ? { status: "loading" } : { status: "not-configured" }
  )

  React.useEffect(() => {
    if (!SUPABASE_CONFIGURED) return
    let cancelled = false
    const supabase = getSupabaseClient()

    async function resolve(session: Session | null) {
      if (!session) {
        if (!cancelled) setState({ status: "signed-out" })
        return
      }
      const admin = await checkIsAdmin(session)
      if (!cancelled) setState(admin ? { status: "admin", session } : { status: "unauthorized", session })
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session))
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => resolve(session))

    return () => {
      cancelled = true
      subscription.subscription.unsubscribe()
    }
  }, [])

  return state
}
