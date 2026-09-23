import type { Metadata } from "next"
import { ArrowRight, Baby, Camera, Check, HouseWifi, Network, Router, ShieldCheck, Signal, Warehouse, Wifi } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { NetworkSecurityComparison } from "@/components/services/network-security-comparison"
import { PropertyAssessment } from "@/components/property/property-assessment"
import { formatServicePrice, offeringsFor } from "@/lib/services"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Home Networking — ZeroPoint",
  description: "Wi-Fi that reaches every room, a home network you understand, and smart devices kept away from what matters.",
  path: "/home-networking",
})

const OUTCOMES = [
  { icon: HouseWifi, title: "No more dead zones", copy: "Access-point placement planned around your home's actual layout, not a guess." },
  { icon: Wifi, title: "Mesh or UniFi — whichever fits", copy: "A simple mesh kit is right for some homes; a UniFi setup is right for others. The recommendation depends on the house, not a default answer." },
  { icon: ShieldCheck, title: "Smart devices kept in their lane", copy: "Cameras, smart plugs, and other IoT devices separated from your personal computers and private files." },
  { icon: Baby, title: "Parental controls that actually work", copy: "Content and time controls set up per device or per person, not a single blunt setting for the whole house." },
  { icon: Camera, title: "Remote camera access, done safely", copy: "See your cameras from anywhere without exposing them directly to the internet." },
  { icon: Router, title: "A tidy network cabinet", copy: "Equipment mounted, labeled, and cabled properly instead of a pile on a shelf." },
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
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto grid min-h-[650px] max-w-6xl items-center gap-14 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div><Eyebrow>Home Networking</Eyebrow><h1 className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">Wi-Fi that reaches<br /><span className="bg-gradient-to-r from-primary via-brand-pink to-brand-cyan bg-clip-text text-transparent">every room.</span></h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">Dead zones fixed, smart devices kept separate from what matters, and a network you actually understand — for the house you live in every day.</p><div className="mt-9 flex flex-wrap gap-3"><Button size="lg" render={<a href="#assessment" />}>Start an assessment <ArrowRight className="size-4" /></Button></div></div>
            <div className="border-y border-border py-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">Starting prices</p>
              <div className="mt-5 divide-y divide-border">
                {offerings.map((service) => <div key={service.id} className="flex items-center justify-between gap-4 py-4 text-sm"><span className="text-text-secondary">{service.title}</span><span className="font-mono text-xs font-medium text-primary">{formatServicePrice(service.pricing)}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><Eyebrow>What gets solved</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">The network should work without you thinking about it.</h2></div><p className="max-w-lg text-lg leading-relaxed text-text-secondary lg:justify-self-end">The work starts with coverage, then builds safe device separation, parental controls, and a system someone besides you could maintain.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{OUTCOMES.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-2xl border border-border bg-surface-raised p-6"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p></article>)}</div></div></section>

        <section className="relative overflow-hidden border-b border-border bg-surface"><div className="pointer-events-none absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" /><div className="relative mx-auto max-w-6xl px-6 py-24"><div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end"><div><Eyebrow>Services</Eyebrow><h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">Start with the <span className="text-primary">outcome</span> you need.</h2></div></div><div className="mt-12 grid gap-4 md:grid-cols-3">{offerings.map((service) => { const Icon = SERVICE_ICONS[service.id] ?? Network; return <article key={service.id} className="group relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-6 shadow-[0_14px_40px_-30px_var(--accent-glow)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/30"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></span><h3 className="mt-6 text-xl font-semibold tracking-tight">{service.title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.description}</p><div className="mt-5 border-y border-border py-4"><span className="font-mono text-[9px] tracking-wider text-text-tertiary uppercase">Starting at</span><p className="mt-1 text-lg font-semibold text-primary">{formatServicePrice(service.pricing)}</p></div><ul className="mt-5 space-y-2.5">{service.includes.map((item) => <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-text-secondary"><Check className="mt-0.5 size-3.5 shrink-0 text-success" />{item}</li>)}</ul><p className="mt-5 text-[11px] leading-relaxed text-text-tertiary">{service.pricing.note}</p></article> })}</div></div></section>

        <section className="theme-dark relative overflow-hidden border-b border-border bg-background">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_20%_35%,var(--accent-glow),transparent_72%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <div className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
              <div><Eyebrow>Home network security</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">One compromised bulb should not expose the whole house.</h2></div>
              <div><p className="text-lg leading-relaxed text-text-secondary">On a flat network, phones, laptops, cameras, speakers, and inexpensive smart devices can all reach one another. If one poorly secured device is compromised, that shared access opens the door to everything else.</p><p className="mt-4 text-sm leading-relaxed text-text-tertiary">A separate network for smart devices means a compromised camera or bulb stays contained — it can reach the internet, not your laptop or your files.</p></div>
            </div>
            <NetworkSecurityComparison />
            <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              {["Separate trusted, guest, and smart-device traffic", "Allow only the connections each device actually needs", "Document the setup so it stays maintainable"].map((item, index) => <div key={item} className="flex gap-3 text-sm leading-relaxed text-text-secondary"><span className="font-mono text-[9px] text-primary">0{index + 1}</span>{item}</div>)}
            </div>
          </div>
        </section>

        <section className="border-b border-border"><div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><Eyebrow>Cabins, rentals, and outbuildings</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance">Not every property is a primary home.</h2><p className="mt-4 text-lg leading-relaxed text-text-secondary">The same planning applies to cabins, short-term rentals, and workshops — often with the added question of what happens if the primary connection goes down while no one is there to check.</p><ul className="mt-7 space-y-3">{["Coverage across multiple buildings", "Cellular backup for properties that can't go offline", "Remote monitoring you can check from anywhere"].map((item) => <li key={item} className="flex items-center gap-3 text-sm text-text-secondary"><Check className="size-4 text-success" />{item}</li>)}</ul></div><div className="rounded-2xl border border-primary/20 bg-surface/85 p-6"><div className="flex items-center justify-between border-b border-border pb-5"><span className="font-mono text-xs tracking-[0.16em] text-text-secondary uppercase">Secondary properties</span><Warehouse className="size-5 text-primary" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[{ name: "Cabin / camp", detail: "Seasonal coverage" }, { name: "Rental", detail: "Guest-safe network" }, { name: "Workshop", detail: "Outbuilding coverage" }, { name: "Cellular backup", detail: "Stays online if the primary link drops" }].map((zone) => <div key={zone.name} className="rounded-xl border border-border bg-background/60 p-4"><p className="font-medium text-foreground">{zone.name}</p><p className="mt-1 text-sm text-text-secondary">{zone.detail}</p></div>)}</div></div></div></div></section>

        <section id="assessment" className="scroll-mt-20 border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-24"><div className="mb-12 max-w-2xl"><Eyebrow>Property assessment</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance">Tell us what the property needs to do.</h2><p className="mt-4 text-lg leading-relaxed text-text-secondary">Start with the current situation and desired outcome. The first step is understanding the property — not selling a predetermined box of hardware.</p></div><PropertyAssessment /></div></section>
      </main>
      <Footer />
    </>
  )
}
