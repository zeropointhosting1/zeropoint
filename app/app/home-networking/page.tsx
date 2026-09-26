import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Baby, Camera, Check, HouseWifi, Network, Router, ShieldCheck, Signal, Warehouse, Wifi, X } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { NetworkSecurityComparison } from "@/components/services/network-security-comparison"
import { offeringsFor } from "@/lib/services"
import { PricingLink } from "@/components/services/pricing-links"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Home Networking — ZeroPoint",
  description: "Wi-Fi that reaches every room, a home network you understand, and smart devices kept away from what matters.",
  path: "/home-networking",
})

// Page flow: the problems people recognize -> what changes -> why
// separating devices matters (interactive diagram) -> the services ->
// other properties -> a button to the estimate page. Backgrounds alternate so each
// section reads as its own step.

const PROBLEMS = [
  "The Wi-Fi drops in the bedroom or the back of the house",
  "The TV upstairs keeps buffering",
  "Dozens of smart gadgets share a network with your laptop",
  "Nobody remembers the router password or how it's set up",
]

const OUTCOMES = [
  { icon: HouseWifi, title: "No more dead zones", copy: "We plan where the Wi-Fi equipment goes based on your home's actual layout, not a guess." },
  { icon: Wifi, title: "The right equipment for your house", copy: "Some homes just need a simple mesh kit. Others need more. We recommend what fits your home, not a one-size-fits-all box." },
  { icon: ShieldCheck, title: "Smart devices kept separate", copy: "Cameras, smart plugs, and other gadgets get their own network, away from your computers and private files." },
  { icon: Baby, title: "Parental controls that work", copy: "Screen-time and content limits set per person or per device, not one blunt switch for the whole house." },
  { icon: Camera, title: "Check your cameras from anywhere", copy: "See your cameras from your phone without leaving them open to the whole internet." },
  { icon: Router, title: "A tidy equipment setup", copy: "Equipment mounted, labeled, and cabled neatly instead of piled on a shelf." },
]

const SEPARATION_STEPS = [
  "Give your devices, smart gadgets, and guests their own networks",
  "Let each device reach only what it actually needs",
  "Write it all down so anyone can look after it later",
]

const PROPERTY_TYPES = [
  { name: "Cabin or camp", detail: "Coverage for seasonal use" },
  { name: "Short-term rental", detail: "A guest network that stays separate" },
  { name: "Workshop or outbuilding", detail: "Wi-Fi that reaches across the yard" },
  { name: "Backup internet", detail: "Stays online if the main connection drops" },
]

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "home-network-setup": Network,
  "wifi-planning": Signal,
  "iot-camera-separation": ShieldCheck,
}

export default function HomeNetworkingPage() {
  const offerings = offeringsFor("home")

  return (
    <>
      <TopNav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto grid min-h-[620px] max-w-6xl items-center gap-14 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <Eyebrow>Home Networking</Eyebrow>
              <h1 className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
                Wi-Fi that reaches<br />
                <span className="bg-gradient-to-r from-primary via-brand-pink to-brand-cyan bg-clip-text text-transparent">every room.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">We fix dead zones, keep smart gadgets away from your personal devices, and set up a home network you actually understand.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button size="lg" render={<Link href="/estimate?for=home" />}>Tell us about your home <ArrowRight className="size-4" /></Button>
                <Button size="lg" variant="outline" render={<Link href="/pricing/#home" />}>See pricing</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-[0_28px_90px_-46px_var(--accent-glow)] sm:p-8">
              <p className="text-sm font-semibold">Sound familiar?</p>
              <ul className="mt-5 space-y-4">
                {PROBLEMS.map((problem) => (
                  <li key={problem} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"><X className="size-3" /></span>
                    {problem}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-border pt-5 text-sm font-medium text-foreground">We can fix all of these.</p>
            </div>
          </div>
        </section>

        {/* What changes */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="max-w-2xl">
              <Eyebrow>What changes</Eyebrow>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">A network that just works in the background.</h2>
              <p className="mt-5 text-lg leading-relaxed text-text-secondary">We start by getting Wi-Fi into every room. Then we keep your devices safe and write down how everything is set up.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {OUTCOMES.map(({ icon: Icon, title, copy }) => (
                <article key={title} className="rounded-2xl border border-border bg-surface-raised p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why separation matters */}
        <section className="theme-dark relative overflow-hidden border-y border-border bg-background">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_20%_35%,var(--accent-glow),transparent_72%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
              <div>
                <Eyebrow>Keeping your home safe</Eyebrow>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">A hacked smart bulb shouldn&rsquo;t put your laptop at risk.</h2>
              </div>
              <p className="text-lg leading-relaxed text-text-secondary">Imagine a smart bulb gets hacked. If it shares a network with your laptop, it can try to connect to it. Keeping smart gadgets separate helps limit where the problem can spread. Try the two setups below.</p>
            </div>
            <NetworkSecurityComparison />
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {SEPARATION_STEPS.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-xl border border-border bg-surface/60 p-4 text-sm leading-relaxed text-text-secondary">
                  <span className="font-mono text-xs text-primary">0{index + 1}</span>{item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="max-w-2xl">
              <Eyebrow>Services</Eyebrow>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">Pick what you need.</h2>
              <p className="mt-5 text-lg leading-relaxed text-text-secondary">Choose one, or combine them. We&rsquo;ll help you figure out which fits on a free call.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {offerings.map((service) => {
                const Icon = SERVICE_ICONS[service.id] ?? Network
                return (
                  <article key={service.id} className="group flex flex-col rounded-2xl border border-border bg-surface-raised p-6 shadow-[0_14px_40px_-30px_var(--accent-glow)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></span>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.description}</p>
                    <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                      {service.includes.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-text-secondary"><Check className="mt-0.5 size-4 shrink-0 text-success" />{item}</li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
            <PricingLink audience="home" />
          </div>
        </section>

        {/* Other properties */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Eyebrow>Cabins, rentals, and workshops</Eyebrow>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance">Not just your main home.</h2>
              <p className="mt-4 text-lg leading-relaxed text-text-secondary">We do the same work for second homes, rentals, and outbuildings. For places nobody is at every day, we also make sure you&rsquo;ll know if the internet goes down, and that it can stay online without you there.</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-raised p-6">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <span className="text-sm font-semibold">Properties we help with</span>
                <Warehouse className="size-5 text-primary" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PROPERTY_TYPES.map((zone) => (
                  <div key={zone.name} className="rounded-xl border border-border bg-background/60 p-4">
                    <p className="font-medium text-foreground">{zone.name}</p>
                    <p className="mt-1 text-sm text-text-secondary">{zone.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Get an estimate */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" />
          <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
            <Eyebrow>Get started</Eyebrow>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">Tell us about your home.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-secondary">Answer a few quick questions and we&rsquo;ll get back to you with a free estimate. No sales pitch.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button size="lg" render={<Link href="/estimate?for=home" />}>Get an estimate <ArrowRight className="size-4" /></Button>
              <Button size="lg" variant="outline" render={<Link href="/pricing#home" />}>See pricing</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
