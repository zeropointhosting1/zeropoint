import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ClipboardCheck, FileSignature, MessagesSquare, PackageOpen } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ServicePlanner } from "@/components/services/service-planner"
import { formatServicePrice, offeringsFor, type ServiceAudience } from "@/lib/services"
import { BUSINESS_INFO } from "@/lib/business-info"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Pricing — ZeroPoint",
  description: "Starting prices for home networking, small-business technology, websites and dashboards, and homelab help. Labor only, with a written quote before any work.",
  path: "/pricing",
})

// Same order as the Services menu. Each group's id is the anchor the
// service pages link to (/pricing#home, #business, …).
const GROUPS: { audience: ServiceAudience; label: string; href: string }[] = [
  { audience: "home", label: "Home Networking", href: "/home-networking" },
  { audience: "business", label: "Small Business", href: "/services" },
  { audience: "web", label: "Websites & Dashboards", href: "/websites" },
  { audience: "homelab", label: "Homelab", href: "/lab" },
]

const HOW = [
  { icon: MessagesSquare, title: "Free consult first", copy: "A short call to understand what you need. No charge, no obligation." },
  { icon: FileSignature, title: "Written quote before work", copy: "Scope and price confirmed in writing before anything starts." },
  { icon: PackageOpen, title: "Labor only", copy: "Hardware is never marked up. You buy it, you own it." },
  { icon: ClipboardCheck, title: "No surprise invoices", copy: "Anything outside the agreed scope is raised before it's done, not after." },
]

const FAQ = [
  { q: "Why do some services say “Quote on request”?", a: "Their cost depends heavily on size: how many devices, rooms, pages, or systems are involved. Rather than publish a number that's wrong for most people, they're priced after a quick scope review." },
  { q: "Are these final prices?", a: "They're starting points. Your written quote reflects your actual scope, and it's confirmed before any work begins." },
  { q: "Is hardware included?", a: "No. Pricing is labor only, and hardware is never marked up. Bring your own, or use the Hardware Deals page to find gear." },
  { q: "How does payment work?", a: `${BUSINESS_INFO.paymentTerms} Confirmed in writing before work begins.` },
]

export default function PricingPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div>
              <Eyebrow>Pricing</Eyebrow>
              <h1 className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">Clear pricing,<br /><span className="text-primary">in one place.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">Starting prices for every service, and how a project goes from first call to a written quote.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button size="lg" render={<Link href="/contact" />}>Get a free consult <ArrowRight className="size-4" /></Button>
                <Button size="lg" variant="outline" render={<a href="#project-planner" />}>Build an estimate</Button>
              </div>
            </div>
            <div className="border-y border-border py-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">How pricing works</p>
              <div className="mt-5 divide-y divide-border">
                {HOW.map(({ icon: Icon, title, copy }) => <div key={title} className="flex items-center gap-3 py-4 text-sm text-text-secondary"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span><div><span className="block font-medium text-foreground">{title}</span><span className="block text-xs">{copy}</span></div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl space-y-14 px-6 py-24">
            {GROUPS.map(({ audience, label, href }) => (
              <div key={audience} id={audience} className="scroll-mt-24">
                <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{label}</h2>
                  <Link href={href} className="group flex shrink-0 items-center gap-1 text-sm text-text-secondary transition-colors hover:text-foreground">What&rsquo;s included <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
                </div>
                <div className="divide-y divide-border">
                  {offeringsFor(audience).map((service) => (
                    <div key={service.id} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-10">
                      <div>
                        <h3 className="font-semibold">{service.title}</h3>
                        <p className="mt-1 text-sm text-text-secondary">{service.short}</p>
                      </div>
                      <div className="sm:max-w-xs sm:text-right">
                        <p className="text-lg font-semibold text-primary">{formatServicePrice(service.pricing)}</p>
                        <p className="mt-1 text-xs leading-relaxed text-text-tertiary">{service.pricing.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="project-planner" className="scroll-mt-20 border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24"><div className="mb-12 max-w-2xl"><Eyebrow>Optional</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Build a rough estimate.</h2><p className="mt-3 text-text-secondary">Pick the services you&rsquo;re considering to see a starting total, then send it over as a brief if you like. It&rsquo;s not required — a free consult works just as well.</p></div><ServicePlanner /></div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><Eyebrow>Questions</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Pricing questions.</h2></div><div className="border-t border-border">{FAQ.map(({ q, a }) => <div key={q} className="border-b border-border py-6"><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{a}</p></div>)}</div></div></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
