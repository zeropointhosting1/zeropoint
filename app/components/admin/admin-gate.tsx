"use client"

import * as React from "react"
import { Loader2, ShieldAlert } from "lucide-react"
import { useAdminSession } from "@/lib/admin/use-admin-session"
import { LoginForm } from "@/components/admin/login-form"
import { getSupabaseClient } from "@/lib/supabase/client"

// Gates every /admin route. There's no server here to hold a session or
// hide this decision — it's enforced for real by the RLS policies in
// supabase/migrations/0001_admin.sql (an `is_admin()` check on every
// table). This component only decides what to render; it grants no access
// on its own.
export function AdminGate({ children }: { children: React.ReactNode }) {
  const state = useAdminSession()

  switch (state.status) {
    case "not-configured":
      return (
        <Centered>
          <p className="text-sm text-text-secondary">
            Supabase isn&rsquo;t configured — set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </p>
        </Centered>
      )
    case "loading":
      return (
        <Centered>
          <Loader2 className="size-5 animate-spin text-text-tertiary" />
        </Centered>
      )
    case "signed-out":
      return <LoginForm />
    case "unauthorized":
      return (
        <Centered>
          <ShieldAlert className="size-8 text-destructive" />
          <p className="text-sm text-text-secondary">
            Signed in as {state.session.user.email}, but this account isn&rsquo;t an admin.
          </p>
          <button
            onClick={() => getSupabaseClient().auth.signOut()}
            className="text-sm font-medium text-primary hover:underline"
          >
            Sign out
          </button>
        </Centered>
      )
    case "admin":
      return <AdminUserContext.Provider value={state.session.user.email ?? null}>{children}</AdminUserContext.Provider>
  }
}

const AdminUserContext = React.createContext<string | null>(null)

// The signed-in admin's email, for the shell's account menu.
export function useAdminEmail() {
  return React.useContext(AdminUserContext)
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-muted/40 px-6 text-center">{children}</div>
}
