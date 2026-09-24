"use client"

import * as React from "react"
import { Check, Clipboard, Loader2, Send, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUSINESS_INFO } from "@/lib/business-info"
import { submitForm, type SubmitResult } from "@/lib/submit-form"

const PROPERTY_TYPES = ["Primary residence", "Cabin or camp", "Short-term rental", "Workshop or outbuilding", "Other"]
const NEEDS = ["Internet or Wi-Fi", "Coverage between buildings", "Cameras", "Remote monitoring", "IoT security", "Cellular backup"]

type SendStatus = "idle" | "sending" | SubmitResult

export function PropertyAssessment() {
  const [propertyType, setPropertyType] = React.useState(PROPERTY_TYPES[0])
  const [needs, setNeeds] = React.useState<string[]>([])
  const [details, setDetails] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const [sendStatus, setSendStatus] = React.useState<SendStatus>("idle")

  const brief = [
    "ZEROPOINT PROPERTY ASSESSMENT",
    `Property: ${propertyType}`,
    `Location: ${location || "Not provided"}`,
    `Needs: ${needs.length ? needs.join(", ") : "Not selected"}`,
    `Current setup / problems: ${details || "Not provided"}`,
  ].join("\n")

  const canSend = (needs.length > 0 || details.trim()) && name.trim() && email.trim()

  function toggleNeed(need: string) {
    setNeeds((current) => current.includes(need) ? current.filter((item) => item !== need) : [...current, need])
  }

  async function copyBrief() {
    await navigator.clipboard.writeText(brief)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function sendBrief() {
    setSendStatus("sending")
    const result = await submitForm({
      name,
      email,
      message: brief,
      _subject: "New property assessment from zeropoint.dev",
    })
    setSendStatus(result)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <fieldset>
          <legend className="font-mono text-xs tracking-[0.12em] text-text-secondary uppercase">1 · What kind of property is it?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((type) => <button key={type} type="button" onClick={() => setPropertyType(type)} className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${propertyType === type ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-primary/40"}`}>{type}</button>)}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono text-xs tracking-[0.12em] text-text-secondary uppercase">2 · What needs attention?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {NEEDS.map((need) => <button key={need} type="button" onClick={() => toggleNeed(need)} className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm transition-colors ${needs.includes(need) ? "border-primary/60 bg-primary/10 text-foreground" : "border-border bg-surface hover:border-primary/35"}`}><span>{need}</span><span className={`flex size-5 items-center justify-center rounded-full border ${needs.includes(need) ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{needs.includes(need) && <Check className="size-3" />}</span></button>)}
          </div>
        </fieldset>

        <label className="block"><span className="font-mono text-xs tracking-[0.12em] text-text-secondary uppercase">3 · General location</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Town, region, or service area" className="mt-4 w-full rounded-xl border border-input bg-surface px-4 py-3 text-base text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10" /></label>
        <label className="block"><span className="font-mono text-xs tracking-[0.12em] text-text-secondary uppercase">4 · What is working—or not working—today?</span><textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={5} placeholder="Current internet provider, number of buildings, dead zones, existing cameras or smart devices, and what you want to manage remotely…" className="mt-4 w-full resize-y rounded-xl border border-input bg-surface px-4 py-3 text-base leading-relaxed text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10" /></label>

        <fieldset>
          <legend className="font-mono text-xs tracking-[0.12em] text-text-secondary uppercase">5 · Where should this go?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block"><span className="text-sm text-text-tertiary">Name</span><input value={name} onChange={(event) => setName(event.target.value)} type="text" autoComplete="name" className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10" /></label>
            <label className="block"><span className="text-sm text-text-tertiary">Email</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10" /></label>
          </div>
        </fieldset>
      </div>

      <aside className="h-fit rounded-2xl border border-primary/25 bg-surface p-6 shadow-[0_24px_70px_-38px_var(--accent-glow)] lg:sticky lg:top-24">
        <p className="font-mono text-xs tracking-[0.12em] text-primary uppercase">Assessment brief</p>
        <h3 className="mt-3 text-xl font-semibold">Start with the property, not a shopping list.</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">This creates a short brief for an initial conversation. No equipment or final pricing is recommended until the property, connection options, and coverage needs are understood.</p>
        <dl className="mt-6 divide-y divide-border border-y border-border text-sm"><Summary label="Property" value={propertyType} /><Summary label="Location" value={location || "Not provided"} /><Summary label="Priorities" value={needs.length ? needs.join(", ") : "Not selected"} /></dl>
        {sendStatus === "sent" ? (
          <p className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"><Check className="size-4" />Sent — I&rsquo;ll follow up soon.</p>
        ) : (
          <>
            {sendStatus === "error" && (
              <p className="mt-6 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" />Couldn&rsquo;t send that — try again, or email {BUSINESS_INFO.email} directly.</p>
            )}
            {sendStatus === "not-configured" && (
              <p className="mt-6 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-xs text-warning"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" />Sending isn&rsquo;t connected yet — copy the brief and email it to {BUSINESS_INFO.email}.</p>
            )}
            <Button onClick={sendBrief} className="mt-6 w-full" disabled={!canSend || sendStatus === "sending"}>
              {sendStatus === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {sendStatus === "sending" ? "Sending…" : "Send brief"}
            </Button>
            <Button onClick={copyBrief} variant="outline" className="mt-3 w-full" disabled={!needs.length && !details.trim()}>{copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}{copied ? "Copied" : "Copy instead"}</Button>
            <p className="mt-3 text-center text-xs leading-relaxed text-text-tertiary">Add your name and email above to send.</p>
          </>
        )}
      </aside>
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="py-3"><dt className="text-xs text-text-tertiary">{label}</dt><dd className="mt-1 text-text-secondary">{value}</dd></div>
}
