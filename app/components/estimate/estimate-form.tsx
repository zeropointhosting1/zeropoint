"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Building2, Check, CheckCircle2, Clipboard, HouseWifi, Laptop, LayoutDashboard, Loader2, Send, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BUSINESS_INFO } from "@/lib/business-info"
import { SUPABASE_CONFIGURED } from "@/lib/supabase/client"
import { submitLead, type SubmitLeadResult } from "@/lib/leads"
import { formatServicePrice, offeringsFor, SERVICE_OFFERINGS, type ServiceAudience, type ServiceId } from "@/lib/services"

// The one estimate form on the site. Service pages link here with
// ?for=<audience> so the right category is already picked.

const CATEGORIES: { audience: ServiceAudience; icon: React.ElementType; label: string; copy: string; placeholder: string }[] = [
  { audience: "support", icon: Laptop, label: "Tech help", copy: "Computer, printer, email, or device", placeholder: "What device is involved? What happens when you try to use it?" },
  { audience: "home", icon: HouseWifi, label: "My home", copy: "Wi-Fi, dead zones, smart devices", placeholder: "How big is the home? Where does the Wi-Fi drop? Any cameras or smart devices?" },
  { audience: "business", icon: Building2, label: "My business", copy: "Staff, guest, POS, and device networks", placeholder: "What kind of business? How many staff and devices? What's not working?" },
  { audience: "web", icon: LayoutDashboard, label: "A website", copy: "For restaurants and small businesses", placeholder: "What's the business? Do you have a site today? What should customers be able to do?" },
]

const DELIVERY = [
  { id: "onsite", label: "In person" },
  { id: "remote", label: "Remote" },
  { id: "unsure", label: "Not sure" },
] as const

type Delivery = (typeof DELIVERY)[number]["id"]
type Status = "idle" | "sending" | SubmitLeadResult

const inputClass = "mt-2 w-full rounded-xl border border-input bg-surface-raised px-4 py-3 text-base text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10"

export function EstimateForm() {
  const searchParams = useSearchParams()
  const prefill = searchParams.get("for")
  const [categories, setCategories] = React.useState<ServiceAudience[]>(() => CATEGORIES.some((c) => c.audience === prefill) ? [prefill as ServiceAudience] : [])
  const [services, setServices] = React.useState<ServiceId[]>([])
  const [delivery, setDelivery] = React.useState<Delivery>("unsure")
  const [location, setLocation] = React.useState("")
  const [details, setDetails] = React.useState("")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [honeypot, setHoneypot] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const [status, setStatus] = React.useState<Status>("idle")

  // Only services under a still-selected category count.
  const selectedServices = SERVICE_OFFERINGS.filter((service) => services.includes(service.id) && categories.includes(service.audience))
  // Only one-off project prices add up into a total — hourly and monthly
  // prices are listed on their own rather than summed with them.
  const projectPriced = selectedServices.filter((service) => service.pricing.unit === "project" && service.pricing.from !== null)
  const total = projectPriced.reduce((sum, service) => sum + (service.pricing.from ?? 0), 0)
  const hasOtherPricing = selectedServices.length > projectPriced.length

  const categoryLabels = CATEGORIES.filter((c) => categories.includes(c.audience)).map((c) => c.label)
  const placeholder = categories.length === 1 ? CATEGORIES.find((c) => c.audience === categories[0])!.placeholder : "What's going on, and what would you like to happen?"

  const brief = [
    "ZEROPOINT ESTIMATE REQUEST",
    `Help with: ${categoryLabels.join(", ") || "Not selected"}`,
    `Services: ${selectedServices.length ? selectedServices.map((s) => `${s.title} (${formatServicePrice(s.pricing)})`).join(", ") : "Not sure yet"}`,
    `Location: ${location.trim() || "Not provided"}`,
    `Work style: ${DELIVERY.find((d) => d.id === delivery)!.label}`,
    `Details: ${details.trim() || "Not provided"}`,
    projectPriced.length ? `Starting estimate: from $${total}${hasOtherPricing ? " + other items" : ""}` : "",
  ].filter(Boolean).join("\n")

  const canSend = categories.length > 0 && name.trim() && email.trim()

  function toggleCategory(audience: ServiceAudience) {
    setCategories((current) => current.includes(audience) ? current.filter((a) => a !== audience) : [...current, audience])
  }

  function toggleService(id: ServiceId) {
    setServices((current) => current.includes(id) ? current.filter((s) => s !== id) : [...current, id])
  }

  async function copyBrief() {
    await navigator.clipboard.writeText(brief)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function send(event: React.FormEvent) {
    event.preventDefault()
    if (!canSend) return
    // Honeypot: real visitors never see or fill this field.
    if (honeypot.trim()) return setStatus("sent")
    setStatus("sending")
    setStatus(await submitLead({
      source: "estimate",
      name,
      email,
      message: brief,
      help: categoryLabels.join(", "),
      details: {
        categories,
        services: selectedServices.map((s) => s.id),
        delivery,
        location: location.trim(),
      },
    }))
  }

  if (status === "sent") {
    return (
      <div role="status" className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-primary/25 bg-primary/5 px-6 py-16 text-center">
        <CheckCircle2 className="size-8 text-primary" />
        <p className="text-lg font-semibold text-foreground">Request sent.</p>
        <p className="max-w-sm text-sm text-text-secondary">Thanks! Harrison will get back to you to discuss the next step and availability.</p>
      </div>
    )
  }

  return (
    <form onSubmit={send} className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="space-y-10">
        <Step n={1} title="What do you need help with?" hint="Pick one or more.">
          <div className="grid gap-3 sm:grid-cols-2">
            {CATEGORIES.map(({ audience, icon: Icon, label, copy }) => {
              const active = categories.includes(audience)
              return (
                <button key={audience} type="button" aria-pressed={active} onClick={() => toggleCategory(audience)} className={cn("flex items-center gap-4 rounded-xl border p-4 text-left transition-colors", active ? "border-primary/60 bg-primary/8" : "border-border bg-surface-raised hover:border-primary/30")}>
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")}><Icon className="size-5" /></span>
                  <span className="min-w-0 flex-1"><span className="block font-medium text-foreground">{label}</span><span className="block text-sm text-text-secondary">{copy}</span></span>
                  <CheckDot active={active} />
                </button>
              )
            })}
          </div>
        </Step>

        {categories.length > 0 && (
          <Step n={2} title="Any of these in mind?" hint="Optional. Skip it if you're not sure, and we'll help you figure it out.">
            <div className="space-y-6">
              {CATEGORIES.filter((c) => categories.includes(c.audience)).map(({ audience, label }) => (
                <div key={audience}>
                  {categories.length > 1 && <p className="mb-3 text-sm font-medium text-text-secondary">{label}</p>}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {offeringsFor(audience).map((service) => {
                      const active = services.includes(service.id)
                      return (
                        <button key={service.id} type="button" aria-pressed={active} onClick={() => toggleService(service.id)} className={cn("flex items-start justify-between gap-4 rounded-xl border p-4 text-left transition-colors", active ? "border-primary/60 bg-primary/8" : "border-border bg-surface-raised hover:border-primary/30")}>
                          <span>
                            <span className="block text-sm font-medium text-foreground">{service.title}</span>
                            <span className="mt-1 block text-xs text-text-secondary">{service.short}</span>
                            <span className="mt-2 block text-xs font-medium text-primary">{formatServicePrice(service.pricing)}</span>
                          </span>
                          <CheckDot active={active} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Step>
        )}

        <Step n={categories.length > 0 ? 3 : 2} title="Tell us a bit more">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="text-sm font-medium text-foreground">Town or area</span><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Boca Raton" className={inputClass} /></label>
            <fieldset>
              <legend className="text-sm font-medium text-foreground">How should we work?</legend>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-border bg-surface-raised p-1">
                {DELIVERY.map(({ id, label }) => (
                  <button key={id} type="button" aria-pressed={delivery === id} onClick={() => setDelivery(id)} className={cn("rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm", delivery === id ? "bg-primary text-primary-foreground" : "text-text-secondary hover:text-foreground")}>{label}</button>
                ))}
              </div>
            </fieldset>
          </div>
          <label className="mt-4 block"><span className="text-sm font-medium text-foreground">What&rsquo;s going on?</span><textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={5} placeholder={placeholder} className={cn(inputClass, "resize-y leading-relaxed")} /></label>
        </Step>

        <Step n={categories.length > 0 ? 4 : 3} title="Where should we reply?">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="text-sm font-medium text-foreground">Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required className={inputClass} /></label>
            <label className="block"><span className="text-sm font-medium text-foreground">Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required className={inputClass} /></label>
          </div>
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="estimate-company">Company</label>
            <input id="estimate-company" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
        </Step>
      </div>

      <aside className="h-fit overflow-hidden rounded-2xl border border-primary/25 bg-surface-raised shadow-[0_24px_70px_-38px_var(--accent-glow)] lg:sticky lg:top-24">
        <div className="border-b border-border px-6 py-5">
          <p className="font-semibold">Your request</p>
          <p className="mt-1 text-xs text-text-tertiary">Updates as you fill it in</p>
        </div>
        <dl className="space-y-4 px-6 py-5 text-sm">
          <SummaryRow label="Help with" value={categoryLabels.join(", ")} />
          <SummaryRow label="Services" value={selectedServices.map((s) => s.title).join(", ")} empty="Not sure yet" />
          <SummaryRow label="Location" value={location.trim()} />
        </dl>
        {projectPriced.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-sm font-medium">Starting estimate</p>
            <p className="font-semibold text-primary">From ${total}{hasOtherPricing && "+"}</p>
          </div>
        )}
        <div className="space-y-3 border-t border-border px-6 py-5">
          {status === "error" && <Notice tone="error">Couldn’t send that. Please try again.{BUSINESS_INFO.email && <> Or email {BUSINESS_INFO.email}.</>}</Notice>}
          {(!SUPABASE_CONFIGURED || status === "not-configured") && <Notice tone="warn">Online requests are currently unavailable. You can copy your request for later.{BUSINESS_INFO.email && <> Email it to {BUSINESS_INFO.email}.</>}</Notice>}
          <Button type="submit" className="w-full" disabled={!SUPABASE_CONFIGURED || !canSend || status === "sending"}>
            {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {status === "sending" ? "Sending…" : "Send request"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={copyBrief} disabled={categories.length === 0}>
            {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}{copied ? "Copied" : "Copy instead"}
          </Button>
          <p className="text-center text-xs leading-relaxed text-text-tertiary">
            {canSend ? "Free and no obligation. The final price is confirmed in a written quote." : "Pick what you need help with and add your name and email to send."}
          </p>
        </div>
      </aside>
    </form>
  )
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{n}</span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {hint && <p className="mt-0.5 text-sm text-text-secondary">{hint}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function CheckDot({ active }: { active: boolean }) {
  return <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border", active ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{active && <Check className="size-3" />}</span>
}

function SummaryRow({ label, value, empty = "Not provided" }: { label: string; value: string; empty?: string }) {
  return <div><dt className="text-xs text-text-tertiary">{label}</dt><dd className={cn("mt-1", value ? "text-foreground" : "text-text-tertiary")}>{value || empty}</dd></div>
}

function Notice({ tone, children }: { tone: "error" | "warn"; children: React.ReactNode }) {
  return <p className={cn("flex items-start gap-2 rounded-xl border px-4 py-3 text-xs", tone === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-warning/30 bg-warning/10 text-warning")}><TriangleAlert className="mt-0.5 size-3.5 shrink-0" />{children}</p>
}
