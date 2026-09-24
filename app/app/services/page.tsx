import type { Metadata } from "next"
import { Check, FileText, Headset, KeyRound, MessageSquareText, Network, ShieldCheck, Users, Wifi, Building2 } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ConsultCta, PricingLink } from "@/components/services/pricing-links"
import { offeringsFor } from "@/lib/services"
import { BUSINESS_INFO } from "@/lib/business-info"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Small Business Networking and Technology — ZeroPoint",
  description: "Office Wi-Fi, guest and device separation, firewalls, backups, and account hygiene for small businesses.",
  path: "/services",
})

const PROCESS = [
  { n: "01", title: "Assess", copy: "Understand the office, current equipment, goals, constraints, and budget." },
  { n: "02", title: "Design", copy: "Create the hardware list, topology, implementation plan, and scope before changes begin." },
  { n: "03", title: "Build", copy: "Install on-site or work through the deployment together in a remote session." },
  { n: "04", title: "Document", copy: "Hand over the layout, configuration notes, ownership details, and sensible next steps." },
]

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "office-wifi": Wifi,
  "guest-device-separation": Network,
  "firewall-remote-access": ShieldCheck,
  backups: FileText,
  "onboarding-offboarding": KeyRound,
  "monthly-support": Headset,
}

const WHY = [
  { icon: KeyRound, title: "Labor-only pricing", copy: "Hardware is never marked up — you buy it, you own it." },
  { icon: ShieldCheck, title: "You keep every account", copy: "Every login and credential stays yours, with nothing locked to a device only ZeroPoint can access." },
  { icon: FileText, title: "Everything documented", copy: "Configuration notes and a network plan, handed over at the end of every project." },
  { icon: MessageSquareText, title: "Plain-language explanations", copy: "You leave understanding what was built and why, not just that it works." },
]

const BUSINESS_ZONES = [
  { icon: Users, name: "Staff", detail: "Work devices · full internal access" },
  { icon: Wifi, name: "Guest", detail: "Customer Wi-Fi · internet only" },
  { icon: Building2, name: "POS & Cameras", detail: "Payment and security systems · isolated" },
]

const FAQ = [
  { q: "Do I need to know networking already?", a: "No. Most people booking a project don't. Explaining the tradeoffs in plain language is part of the job — you leave understanding what was built and why." },
  { q: "I'm not near you — can this still work?", a: "Yes, for most services. Network configuration, Wi-Fi planning, and account/backup work can all be done remotely over screen share. Physical installation depends on service-area availability." },
  { q: "Do you sell hardware?", a: "No. Pricing is labor only. Bring your own hardware or use the Hardware Deals page to find gear, then bring the plan to a project." },
  { q: "What happens after the project ends?", a: "You keep the configuration notes, a network plan, and ownership of every account and credential involved — nothing stays locked to a device only ZeroPoint can access." },
  { q: "How are my credentials handled during the project?", a: "Access is scoped to what the project actually needs and handed back at completion. You should change shared passwords once the work is done, same as with any contractor." },
  { q: "What's not included?", a: "Hardware purchases, ongoing monitoring outside of Monthly Support, and anything outside the agreed scope — those are called out before work starts, not after." },
  { q: "How does payment work?", a: `${BUSINESS_INFO.paymentTerms} Confirmed in writing before work begins.` },
  { q: "What's your service area?", a: `On-site work is available in ${BUSINESS_INFO.areaServed}. Remote work is available anywhere.` },
]

export default function ServicesPage() {
  const offerings = offeringsFor("business")

  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto grid min-h-[650px] max-w-6xl items-center gap-14 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div><Eyebrow>Small Business</Eyebrow><h1 className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">Straightforward technology<br /><span className="text-primary">for small business.</span></h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">Office Wi-Fi, guest and device separation, firewalls, backups, and account hygiene — set up once, documented properly, and yours to keep.</p></div>
            <div className="border-y border-border py-6">
              <p className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">Why hire ZeroPoint</p>
              <div className="mt-5 divide-y divide-border">
                {WHY.map(({ icon: Icon, title, copy }) => <div key={title} className="flex items-center gap-3 py-4 text-sm text-text-secondary"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span><div><span className="block font-medium text-foreground">{title}</span><span className="block text-xs">{copy}</span></div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="theme-dark band-dark relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_20%_35%,var(--accent-glow),transparent_72%)]" />
          <div className="pointer-events-none absolute right-0 bottom-0 size-[28rem] rounded-full bg-brand-cyan/8 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <div className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
              <div><Eyebrow>Network separation</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">Customers, staff, and payment systems shouldn&rsquo;t share a network.</h2></div>
              <div><p className="text-lg leading-relaxed text-text-secondary">On a flat network, guest laptops, staff computers, point-of-sale terminals, and cameras can all reach one another. A compromised guest device or an unpatched camera becomes a path to the systems that actually matter.</p><p className="mt-4 text-sm leading-relaxed text-text-tertiary">Separate networks for staff, guests, and devices mean a guest network problem stays a guest network problem — it never reaches your POS system or staff files.</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {BUSINESS_ZONES.map(({ icon: Icon, name, detail }) => (
                <div key={name} className="rounded-2xl border border-border bg-surface-raised p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                  <p className="mt-5 font-semibold text-foreground">{name}</p>
                  <p className="mt-1 text-sm text-text-secondary">{detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              {["Separate staff, guest, and device traffic", "Allow only the connections each system actually needs", "Document the rules so the network stays maintainable"].map((item, index) => <div key={item} className="flex gap-3 text-sm leading-relaxed text-text-secondary"><span className="font-mono text-[11px] text-primary">0{index + 1}</span>{item}</div>)}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div className="pointer-events-none absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <div><Eyebrow>Services</Eyebrow><h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">Start with the <span className="text-primary">outcome</span> you need.</h2></div>
              <p className="max-w-lg text-base leading-relaxed text-text-secondary lg:justify-self-end">Choose a focused engagement or combine services into one documented project. Every project starts with a free consult and a written scope.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {offerings.map((service) => {
                const Icon = SERVICE_ICONS[service.id] ?? Network
                return <article key={service.id} className="group relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-6 shadow-[0_14px_40px_-30px_var(--accent-glow)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_55px_-28px_var(--accent-glow)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-4"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></span><span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[11px] tracking-[0.14em] text-text-tertiary uppercase">{service.delivery}</span></div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-2 min-h-16 text-sm leading-relaxed text-text-secondary">{service.description}</p>
                  <div className="mt-5 border-t border-border" />
                  <ul className="mt-5 space-y-2.5">{service.includes.map((item) => <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-text-secondary"><Check className="mt-0.5 size-3.5 shrink-0 text-success" />{item}</li>)}</ul>
                </article>
              })}
            </div>
            <PricingLink audience="business" />
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><Eyebrow>How it works</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">No mystery between the idea and the handoff.</h2></div><div className="border-t border-border">{PROCESS.map((step) => <div key={step.n} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border py-6"><span className="font-mono text-[11px] text-text-tertiary">{step.n}</span><div><h3 className="font-semibold">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.copy}</p></div></div>)}</div></div></div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><Eyebrow>Questions</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Common questions.</h2></div><div className="border-t border-border">{FAQ.map(({ q, a }) => <div key={q} className="border-b border-border py-6"><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{a}</p></div>)}</div></div></div>
        </section>

        <ConsultCta audience="business" />
      </main>
      <Footer />
    </>
  )
}
