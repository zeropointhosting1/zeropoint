"use client"

import * as React from "react"
import { Loader2, LogIn, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus("submitting")
    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password })
    // No further action needed on success: useAdminSession's
    // onAuthStateChange listener picks up the new session and re-renders.
    setStatus(error ? "error" : "idle")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-surface-raised p-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Admin sign in</h1>
          <p className="mt-1 text-sm text-text-secondary">ZeroPoint dashboard — leads, chat, and clients.</p>
        </div>

        {status === "error" && (
          <p className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            Wrong email or password.
          </p>
        )}

        <label className="block">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
          />
        </label>

        <Button type="submit" className="w-full" disabled={status === "submitting"}>
          {status === "submitting" ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          {status === "submitting" ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
