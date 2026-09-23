import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Camera, Check, HouseWifi, RadioTower, Router, ShieldCheck, Signal, ThermometerSun, Warehouse } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { PropertyAssessment } from "@/components/property/property-assessment"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Home Networking — ZeroPoint",
  description: "Wi-Fi, UniFi, home networks, IoT separation, network racks, and troubleshooting for homes and recreational properties.",
  path: "/property-technology",
})

const OUTCOMES = [
  { icon: Signal, title: "Internet that reaches the property", copy: "Evaluate available wired, fixed-wireless, satellite, and cellular options before choosing the network around them." },
  { icon: HouseWifi, title: "Wi-Fi where people need it", copy: "Plan coverage for the main building, outdoor areas, workshops, garages, and nearby structures without guessing at access-point placement." },
  { icon: Camera, title: "Remote visibility without unsafe exposure", copy: "Set up cameras and monitoring with controlled remote access instead of casually exposing devices to the public internet." },
  { icon: ShieldCheck, title: "Smart devices kept in their lane", copy: "Separate cameras, speakers, thermostats, and other IoT devices from trusted computers and private services." },
  { icon: RadioTower, title: "A backup when the primary link fails", copy: "Plan cellular failover for properties where losing connectivity means losing visibility and control." },
  { icon: Router, title: "A system someone can maintain", copy: "Keep a network map, equipment inventory, account ownership, and configuration notes with the property." },
]

export default function PropertyTechnologyPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto grid min-h-[690px] max-w-6xl items-center gap-14 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div><Eyebrow>ZeroPoint Home</Eyebrow><h1 className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">A home network<br /><span className="bg-gradient-to-r from-primary via-brand-pink to-brand-cyan bg-clip-text text-transparent">built properly.</span></h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">Better Wi-Fi, UniFi networks, IoT separation, cameras, compact racks, and practical troubleshooting for primary homes and recreational properties.</p><div className="mt-9 flex flex-wrap gap-3"><Button size="lg" render={<a href="#assessment" />}>Start an assessment <ArrowRight className="size-4" /></Button><Button size="lg" variant="outline" render={<Link href="/services" />}>Business services</Button></div></div>
            <div className="theme-dark overflow-hidden rounded-2xl border border-primary/20 bg-background p-6 shadow-[0_28px_90px_-42px_var(--accent-glow)]"><div className="flex items-center justify-between border-b border-border pb-5"><div><p className="font-mono text-xs tracking-[0.16em] text-primary uppercase">Property status</p><p className="mt-2 text-lg font-semibold">Connected and documented</p></div><span className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success"><HouseWifi className="size-5" /></span></div><div className="mt-6 grid grid-cols-2 gap-3">{[{ icon: Signal, label: "Primary link", value: "Online" }, { icon: RadioTower, label: "Cellular backup", value: "Ready" }, { icon: Camera, label: "Remote cameras", value: "Protected" }, { icon: ThermometerSun, label: "Property sensors", value: "Isolated" }].map(({ icon: Icon, label, value }) => <div key={label} className="rounded-xl border border-border bg-surface p-4"><Icon className="size-4 text-primary" /><p className="mt-4 text-xs text-text-tertiary">{label}</p><p className="mt-1 text-sm font-medium text-foreground">{value}</p></div>)}</div><p className="mt-5 text-xs leading-relaxed text-text-tertiary">Illustrative system view. Recommendations depend on the property and available connectivity.</p></div>
          </div>
        </section>

        <section className="border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><Eyebrow>What gets solved</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">The property should not become unreachable when you leave.</h2></div><p className="max-w-lg text-lg leading-relaxed text-text-secondary lg:justify-self-end">The work begins with connectivity and coverage, then builds safe access, monitoring, resilience, and documentation around the property&rsquo;s real constraints.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{OUTCOMES.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-2xl border border-border bg-surface-raised p-6"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p></article>)}</div></div></section>

        <section className="theme-dark relative overflow-hidden border-b border-border bg-background"><div className="pointer-events-none absolute inset-0 bg-topology-glow" /><div className="relative mx-auto max-w-6xl px-6 py-24"><div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><Eyebrow>A maintainable design</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance">One property. Separate trust zones.</h2><p className="mt-4 text-lg leading-relaxed text-text-secondary">Personal devices, guests, cameras, and smart equipment should not all have the same access. The design keeps useful connections working while reducing unnecessary exposure.</p><ul className="mt-7 space-y-3">{["Trusted devices and work systems", "Guest internet access", "Cameras and IoT equipment", "Management and remote support"].map((item) => <li key={item} className="flex items-center gap-3 text-sm text-text-secondary"><Check className="size-4 text-success" />{item}</li>)}</ul></div><div className="rounded-2xl border border-primary/20 bg-surface/85 p-6"><div className="flex items-center justify-between border-b border-border pb-5"><span className="font-mono text-xs tracking-[0.16em] text-text-secondary uppercase">Example property network</span><Warehouse className="size-5 text-primary" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[{ name: "Trusted", detail: "Owner devices · Work" }, { name: "Guest", detail: "Internet only" }, { name: "Cameras", detail: "Recorder access only" }, { name: "IoT", detail: "Approved services only" }].map((zone) => <div key={zone.name} className="rounded-xl border border-border bg-background/60 p-4"><p className="font-medium text-foreground">{zone.name}</p><p className="mt-1 text-sm text-text-secondary">{zone.detail}</p></div>)}</div></div></div></div></section>

        <section id="assessment" className="scroll-mt-20 border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-24"><div className="mb-12 max-w-2xl"><Eyebrow>Property assessment</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance">Tell us what the property needs to do.</h2><p className="mt-4 text-lg leading-relaxed text-text-secondary">Start with the current situation and desired outcome. The first step is understanding the property—not selling a predetermined box of hardware.</p></div><PropertyAssessment /></div></section>
      </main>
      <Footer />
    </>
  )
}
