"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, Mail, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUSINESS_INFO } from "@/lib/business-info"
import { RESPONSE_DAYS } from "@/lib/contact-config"
import { submitForm, type SubmitResult } from "@/lib/submit-form"

const HELP_OPTIONS = [
  { value: "home", label: "Home network" },
  { value: "business", label: "Small business" },
  { value: "homelab", label: "Homelab" },
  { value: "other", label: "Other" },
]

type Status = "idle" | "submitting" | SubmitResult

export function ContactForm() {
  const searchParams = useSearchParams()
  const prefillMessage = searchParams.get("message") ?? ""
  const prefillHelp = searchParams.get("help") ?? ""
  const [status, setStatus] = React.useState<Status>("idle")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot: real visitors never fill in a field they can't see. A
    // bot that fills every field trips this instead of reaching the
    // endpoint at all.
    if (String(data.get("company") ?? "").trim()) {
      setStatus("sent")
      return
    }

    setStatus("submitting")
    const result = await submitForm({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      help: String(data.get("help") ?? ""),
      message: String(data.get("message") ?? ""),
      referral: String(data.get("referral") ?? ""),
      _subject: "New message from zeropoint.dev contact form",
    })
    setStatus(result)
    if (result === "sent") form.reset()
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-6 py-16 text-center">
        <CheckCircle2 className="size-8 text-primary" />
        <p className="text-lg font-semibold text-foreground">Message sent.</p>
        <p className="max-w-sm text-sm text-text-secondary">
          Thanks — I&rsquo;ll reply within {RESPONSE_DAYS} business days. If it&rsquo;s urgent, email me directly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>Something went wrong sending that. Try again, or email <a href={`mailto:${BUSINESS_INFO.email}`} className="underline underline-offset-2">{BUSINESS_INFO.email}</a> directly.</p>
        </div>
      )}
      {status === "not-configured" && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>The contact form isn&rsquo;t connected yet. Email <a href={`mailto:${BUSINESS_INFO.email}`} className="underline underline-offset-2">{BUSINESS_INFO.email}</a> directly for now.</p>
        </div>
      )}

      {/* Honeypot — hidden from sighted and screen-reader users, left
          empty by real visitors, off the normal tab order. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Name</span>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-foreground">I need help with</span>
        <select
          id="help"
          name="help"
          required
          defaultValue={HELP_OPTIONS.some((o) => o.label === prefillHelp) ? prefillHelp : ""}
          className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground outline-none focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
        >
          <option value="" disabled>
            Choose one
          </option>
          {HELP_OPTIONS.map((option) => (
            <option key={option.value} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Message</span>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          defaultValue={prefillMessage}
          placeholder="What's going on, and what would you like to happen?"
          className="mt-2 w-full resize-y rounded-xl border border-input bg-surface px-4 py-3 text-base leading-relaxed text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">How did you hear about ZeroPoint? <span className="font-normal text-text-tertiary">(optional)</span></span>
        <input
          id="referral"
          name="referral"
          type="text"
          className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
        />
      </label>

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  )
}
