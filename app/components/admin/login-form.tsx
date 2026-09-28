"use client"

import * as React from "react"
import { Activity, Inbox, Loader2, LockKeyhole, MessagesSquare, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Wordmark } from "@/components/nav/wordmark"
import { adminInputClass } from "@/components/admin/ui"
import { getSupabaseClient } from "@/lib/supabase/client"

const FEATURES = [
  { icon: Inbox, title: "Leads", text: "Every contact and estimate request in one inbox." },
  { icon: MessagesSquare, title: "Live chat", text: "Reply to site visitors in real time." },
  { icon: Activity, title: "Client uptime", text: "Checks every 15 minutes, with history." },
]

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
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="theme-dark relative hidden overflow-hidden bg-background p-10 lg:flex lg:flex-col">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Wordmark className="relative" />
        <div className="relative mt-auto max-w-sm">
          <p className="text-2xl font-semibold tracking-tight text-foreground">Everything behind the site, in one place.</p>
          <ul className="mt-8 space-y-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-white/5 text-primary">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">{title}</span>
                  <span className="block text-sm text-text-secondary">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative mt-12 text-xs text-text-tertiary">Private area. Access is limited to authorized administrators.</p>
      </aside>

      <main className="flex items-center justify-center bg-muted/40 px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <Wordmark className="mb-10 text-foreground lg:hidden" />
          <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface-raised text-primary shadow-sm">
            <LockKeyhole className="size-4.5" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">Sign in to Admin</h1>
          <p className="mt-1 text-sm text-text-secondary">Use your administrator email and password.</p>

          <div className="mt-8 space-y-4">
            {status === "error" && (
              <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                Wrong email or password.
              </p>
            )}

            <label className="block">
              <span className="text-sm font-medium text-foreground">Email</span>
              <input type="email" required autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className={`${adminInputClass} mt-1.5 h-10`} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Password</span>
              <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${adminInputClass} mt-1.5 h-10`} />
            </label>

            <Button type="submit" size="lg" className="h-10 w-full" disabled={status === "submitting"}>
              {status === "submitting" && <Loader2 className="size-4 animate-spin" />}
              {status === "submitting" ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
