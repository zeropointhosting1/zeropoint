"use client"

import * as React from "react"
import { Check, CheckCheck, Clipboard, Loader2, MapPin, MonitorSmartphone, Send, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatServicePrice, offeringsFor, PROJECT_GOALS, SERVICE_OFFERINGS, type ServiceAudience, type ServiceId } from "@/lib/services"

const AUDIENCE_GROUPS: { audience: ServiceAudience; label: string }[] = [
  { audience: "home", label: "Home" },
  { audience: "business", label: "Small business" },
  { audience: "homelab", label: "Homelab" },
  { audience: "web", label: "Websites & dashboards" },
]
import { BUSINESS_INFO } from "@/lib/business-info"
import { submitForm, type SubmitResult } from "@/lib/submit-form"

type Delivery = "local" | "remote" | "unsure"
type SendStatus = "idle" | "sending" | SubmitResult

export function ServicePlanner() {
  const [services, setServices] = React.useState<ServiceId[]>([])
  const [goals, setGoals] = React.useState<string[]>([])
  const [delivery, setDelivery] = React.useState<Delivery>("unsure")
  const [notes, setNotes] = React.useState("")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const [sendStatus, setSendStatus] = React.useState<SendStatus>("idle")

  const selectedServices = SERVICE_OFFERINGS.filter((service) => services.includes(service.id))
  const pricedServices = selectedServices.filter((service) => service.pricing.from !== null)
  const hasUnpricedSelection = selectedServices.some((service) => service.pricing.from === null)
  const estimatedFrom = pricedServices.reduce((sum, service) => sum + (service.pricing.from ?? 0), 0)
  const brief = [
    "ZEROPOINT PROJECT BRIEF",
    "",
    `Services: ${selectedServices.length ? selectedServices.map((service) => `${service.title} (${formatServicePrice(service.pricing)})`).join(", ") : "Not selected"}`,
    `Delivery: ${delivery === "local" ? "On-site / local" : delivery === "remote" ? "Remote" : "Not sure yet"}`,
    `Goals: ${goals.length ? goals.join(", ") : "Not selected"}`,
    `Notes: ${notes.trim() || "None provided"}`,
    `Starting estimate: ${pricedServices.length ? `From $${estimatedFrom}${hasUnpricedSelection ? " + services still being priced" : ""} (final quote depends on scope)` : "N/A"}`,
  ].join("\n")

  const canSend = (services.length > 0 || goals.length > 0) && name.trim() && email.trim()

  function toggleService(id: ServiceId) {
    setServices((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function toggleGoal(goal: string) {
    setGoals((current) => current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal])
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
      _subject: "New project brief from zeropoint.dev",
    })
    setSendStatus(result)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-10">
        <fieldset>
          <legend className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">1 · What do you need help with?</legend>
          <div className="mt-4 space-y-6">
            {AUDIENCE_GROUPS.map(({ audience, label }) => (
              <div key={audience}>
                <p className="mb-3 text-xs font-medium text-text-tertiary">{label}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {offeringsFor(audience).map((service) => {
                    const active = services.includes(service.id)
                    return (
                      <button key={service.id} type="button" onClick={() => toggleService(service.id)} className={cn("rounded-xl border p-4 text-left transition-colors", active ? "border-primary/50 bg-primary/8" : "border-border bg-surface-raised hover:border-primary/25")}>
                        <span className="flex items-start justify-between gap-4"><span><strong className="text-sm text-foreground">{service.title}</strong><span className="mt-1 block text-xs text-text-secondary">{service.short}</span></span><span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border", active ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{active && <Check className="size-3" />}</span></span>
                        <span className="mt-3 block font-mono text-[10px] font-medium text-primary">{formatServicePrice(service.pricing)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">2 · How should we work together?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {([
              { id: "local", icon: MapPin, label: "On-site", copy: "Installation and local setup" },
              { id: "remote", icon: MonitorSmartphone, label: "Remote", copy: "Planning or guided setup" },
              { id: "unsure", icon: CheckCheck, label: "Not sure", copy: "Figure out the right format" },
            ] as const).map(({ id, icon: Icon, label, copy }) => (
              <button key={id} type="button" onClick={() => setDelivery(id)} className={cn("rounded-xl border p-4 text-left transition-colors", delivery === id ? "border-primary/50 bg-primary/8" : "border-border bg-surface-raised hover:border-primary/25")}><Icon className={cn("size-4", delivery === id ? "text-primary" : "text-text-tertiary")} /><strong className="mt-3 block text-sm text-foreground">{label}</strong><span className="mt-1 block text-xs text-text-secondary">{copy}</span></button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">3 · What should the project accomplish?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {PROJECT_GOALS.map((goal) => <button key={goal} type="button" onClick={() => toggleGoal(goal)} className={cn("rounded-full border px-3 py-2 text-xs transition-colors", goals.includes(goal) ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-text-secondary hover:text-foreground")}>{goal}</button>)}
          </div>
        </fieldset>

        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">4 · Anything else?</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} placeholder="Current hardware, property size, rough budget, timeline, or what is not working..." className="mt-4 w-full resize-y rounded-xl border border-input bg-surface-raised px-4 py-3 text-sm text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/50 focus:ring-3 focus:ring-primary/10" />
        </label>

        <fieldset>
          <legend className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">5 · Where should this go?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs text-text-secondary">Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} type="text" autoComplete="name" className="mt-2 w-full rounded-xl border border-input bg-surface-raised px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/50 focus:ring-3 focus:ring-primary/10" />
            </label>
            <label className="block">
              <span className="text-xs text-text-secondary">Email</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-input bg-surface-raised px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/50 focus:ring-3 focus:ring-primary/10" />
            </label>
          </div>
        </fieldset>
      </div>

      <aside className="sticky top-24 overflow-hidden rounded-2xl border border-primary/25 bg-surface/90 shadow-[0_24px_70px_-38px_var(--accent-glow),inset_0_1px_0_oklch(1_0_0/8%)]">
        <div className="border-b border-border px-6 py-5"><p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">Your project brief</p><p className="mt-1 text-xs text-text-tertiary">Updates as you make selections</p></div>
        <div className="space-y-5 px-6 py-5 text-sm">
          <Summary label="Services" value={selectedServices.map((service) => `${service.title} — ${formatServicePrice(service.pricing)}`)} />
          <Summary label="Delivery" value={[delivery === "local" ? "On-site / local" : delivery === "remote" ? "Remote" : "Not sure yet"]} />
          <Summary label="Goals" value={goals} />
          {notes.trim() && <div><p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">Notes</p><p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-text-secondary">{notes}</p></div>}
        </div>
        {pricedServices.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-xs font-medium text-foreground">Starting estimate</p>
            <p className="font-mono text-sm font-semibold text-primary">From ${estimatedFrom}{hasUnpricedSelection && "+"}</p>
          </div>
        )}
        <div className="space-y-3 border-t border-border px-6 py-5">
          {sendStatus === "sent" ? (
            <p className="flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"><Check className="size-4" />Sent — I&rsquo;ll follow up soon.</p>
          ) : (
            <>
              {sendStatus === "error" && (
                <p className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" />Couldn&rsquo;t send that — try again, or email {BUSINESS_INFO.email} directly.</p>
              )}
              {sendStatus === "not-configured" && (
                <p className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-xs text-warning"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" />Sending isn&rsquo;t connected yet — copy the brief and email it to {BUSINESS_INFO.email}.</p>
              )}
              <Button onClick={sendBrief} className="w-full" disabled={!canSend || sendStatus === "sending"}>
                {sendStatus === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {sendStatus === "sending" ? "Sending…" : "Send brief"}
              </Button>
              <Button onClick={copyBrief} variant="outline" className="w-full" disabled={!services.length && !goals.length}>{copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}{copied ? "Copied" : "Copy instead"}</Button>
              <p className="text-center text-[10px] leading-relaxed text-text-tertiary">Add your name and email above to send. Final pricing is confirmed after scope review.</p>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string[] }) {
  return <div><p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">{label}</p>{value.length ? <ul className="mt-2 space-y-1.5">{value.map((item) => <li key={item} className="flex gap-2 text-xs text-text-secondary"><span className="text-primary">·</span>{item}</li>)}</ul> : <p className="mt-2 text-xs text-text-tertiary">Nothing selected</p>}</div>
}
