import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, BookOpen, Check, Boxes, Calculator, CircleHelp, ClipboardList, HardDrive, Network, PackageSearch, Radio, Search, Wrench } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { HomelabStrip } from "@/components/marketing/homelab-strip"
import { FullTopology } from "@/components/network/full-topology"
import { HardwareShowcase } from "@/components/homelab/hardware-showcase"
import { HARDWARE } from "@/lib/hardware-catalog"
import { localPhotoMap } from "@/lib/local-photo"
import { DiscordChatMock } from "@/components/marketing/discord-chat-mock"
import { DiscordIcon } from "@/components/nav/brand-icons"
import { DISCORD_URL } from "@/lib/site-config"
import { PROJECTS } from "@/lib/projects"
import { LAST_UPDATED } from "@/lib/homelab-data"
import { offeringsFor } from "@/lib/services"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Homelab — ZeroPoint Lab",
  description: "Learn to build a homelab, use practical planning tools, explore the real ZeroPoint Lab, join the community, or get help designing your own.",
  path: "/lab",
})

const START_PATHS = [
  { icon: BookOpen, label: "I want to learn", title: "Learn it and build it yourself.", copy: "Free guides, field notes, planning tools, infrastructure diagrams, and a community that understands the project.", action: "Start learning", href: "/docs" },
  { icon: ClipboardList, label: "Help me design it", title: "Turn the idea into a complete plan.", copy: "Work through goals, workloads, hardware, storage, networking, remote access, and the services the lab should run.", action: "Plan my lab", href: "/contact" },
  { icon: Wrench, label: "Help me build it", title: "Get hands-on setup help.", copy: "Guided, scoped sessions on the environment, networking, Proxmox, and selected self-hosted services.", action: "Build my lab", href: "/contact" },
]

const JOURNEY = [
  { icon: CircleHelp, title: "Decide what you want to run", copy: "Start with outcomes: media, photos, home automation, backups, learning, or private services." },
  { icon: Calculator, title: "Size the hardware", copy: "Estimate CPU, memory, storage, and growth before buying a pile of parts." },
  { icon: Network, title: "Design the network", copy: "Plan addressing, VLANs, Wi-Fi, remote access, and which systems should trust each other." },
  { icon: HardDrive, title: "Build the infrastructure", copy: "Install compute, storage, switching, power, and the hypervisor foundation." },
  { icon: Boxes, title: "Deploy services", copy: "Add VMs, containers, access controls, updates, and a backup approach." },
  { icon: Radio, title: "Learn and expand", copy: "Document what worked, fix what did not, and grow the lab deliberately." },
]

const TOOLS = [
  { icon: Calculator, status: "Available", title: "Workload Sizer", copy: "Estimate resources for common self-hosted workloads with visible assumptions.", href: "/sizer", action: "Size workloads" },
  { icon: Search, status: "Available", title: "Hardware Deals", copy: "Browse current listings for proven mini PCs, networking gear, and rack parts.", href: "/deals", action: "Find hardware" },
  { icon: PackageSearch, status: "Available", title: "Rack Planner", copy: "Three fixed 10-inch rack builds with parts, price, and power draw — a full visual designer is still planned.", href: "/deals#starter-builds", action: "See starter builds" },
]

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "homelab-build": Wrench,
  "self-hosted-apps": Boxes,
}

const CURRENT_PROJECTS = PROJECTS.filter((project) => project.status === "In Progress" && project.id !== "zeropoint-website").slice(0, 3)

export default function LabPage() {
  const hardwarePhotos = localPhotoMap(HARDWARE.map((h) => h.id), "lab/hardware")

  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto max-w-6xl px-6 pt-40 pb-24">
            <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-24">
              <div><Eyebrow>ZeroPoint Lab</Eyebrow><h1 className="mt-5 max-w-4xl text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">Build the lab<br /><span className="text-primary">you keep thinking about.</span></h1><p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary">Explore a real working homelab, learn how the pieces fit together, use the planning tools, or get help turning your own idea into a build.</p><div className="mt-9 flex flex-wrap gap-3"><Button size="lg" render={<a href="#build-your-own" />}>Build your own <ArrowRight className="size-4" /></Button><Button size="lg" variant="outline" render={<Link href="/network" />}>Explore the real Lab</Button></div></div>
              <div className="theme-dark overflow-hidden rounded-2xl border border-primary/20 bg-background p-5 shadow-[0_28px_90px_-42px_var(--accent-glow)]"><div className="flex items-center justify-between border-b border-border pb-4"><div><p className="font-mono text-xs tracking-[0.12em] text-primary uppercase">Current physical build</p><p className="mt-1 text-sm text-text-secondary">Compact hardware · real workloads</p></div><span className="flex items-center gap-2 font-mono text-[11px] text-text-tertiary uppercase">As of {LAST_UPDATED}</span></div><div className="mt-5 rounded-xl border-x-4 border-y border-border bg-background/60 p-3"><LabUnit unit="4U" label="Patch + switching" tone="text-text-secondary" /><LabUnit unit="3U" label="UniFi gateway" tone="text-primary" /><LabUnit unit="2U" label="HP EliteDesk · pve01" tone="text-success" /><LabUnit unit="1U" label="HP EliteDesk · pve02" tone="text-success" /></div><p className="mt-4 text-xs leading-relaxed text-text-tertiary">A simplified view of the current compute and network stack, updated by hand.</p></div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-20"><p className="mb-8 font-mono text-xs tracking-[0.14em] text-text-tertiary uppercase">Choose how you want to start</p><div className="grid gap-4 lg:grid-cols-3">{START_PATHS.map(({ icon: Icon, label, title, copy, action, href }, index) => <Link key={label} href={href} className="group flex min-h-[300px] flex-col rounded-2xl border border-border bg-surface-raised p-7 transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_24px_60px_-38px_var(--accent-glow)]"><div className="flex items-start justify-between"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="font-mono text-xs text-text-tertiary">0{index + 1}</span></div><div className="mt-auto pt-10"><p className="font-mono text-xs tracking-[0.15em] text-primary uppercase">{label}</p><h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2><p className="mt-3 text-sm leading-relaxed text-text-secondary">{copy}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">{action}<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></div></Link>)}</div></div></section>

        <HomelabStrip />

        <section className="border-b border-border"><div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-20"><div><Eyebrow>Inside the build</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance">Real hardware. Real constraints. Real documentation.</h2><p className="mt-4 text-lg leading-relaxed text-text-secondary">The Lab combines compact compute, managed networking, segmented VLANs, self-hosted workloads, remote access, and monitoring. The sanitized diagrams show how it actually fits together.</p><div className="mt-7"><Button variant="outline" render={<Link href="/projects" />}>View all projects <ArrowRight className="size-4" /></Button></div></div><div><HardwareShowcase photos={hardwarePhotos} /><div className="mt-8 grid gap-3 sm:grid-cols-3">{CURRENT_PROJECTS.map((project) => <Link key={project.id} href={project.href ?? "/projects"} className="group rounded-xl border border-border bg-surface-raised p-5"><p className="font-mono text-[11px] tracking-wider text-primary uppercase">Running in the lab</p><h3 className="mt-3 font-semibold group-hover:text-primary">{project.title}</h3><p className="mt-2 text-xs leading-relaxed text-text-secondary">{project.description}</p></Link>)}</div></div></div></div></section>

        <FullTopology />

        <section id="build-your-own" className="scroll-mt-20 border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-24"><div className="max-w-2xl"><Eyebrow>Build your own</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">From “I want a server” to a lab you understand.</h2></div><div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">{JOURNEY.map(({ icon: Icon, title, copy }, index) => <article key={title} className="bg-surface-raised p-6"><div className="flex items-center justify-between"><Icon className="size-5 text-primary" /><span className="font-mono text-xs text-text-tertiary">0{index + 1}</span></div><h3 className="mt-8 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p></article>)}</div></div></section>

        <section className="border-b border-border"><div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"><div><Eyebrow>Tools</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight">Plan before you buy.</h2><p className="mt-4 text-lg leading-relaxed text-text-secondary">Use the free planning tools first. If you still want another set of eyes, bring the results into a design session.</p></div><div className="border-t border-border">{TOOLS.map(({ icon: Icon, status, title, copy, href, action }) => <Link key={title} href={href} className="group grid gap-4 border-b border-border py-6 sm:grid-cols-[48px_1fr_auto] sm:items-center"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span><span className="font-mono text-[11px] tracking-wider text-text-tertiary uppercase">{status}</span><strong className="mt-1 block text-lg group-hover:text-primary">{title}</strong><span className="mt-1 block text-sm text-text-secondary">{copy}</span></span><span className="inline-flex items-center gap-1.5 text-sm font-medium">{action}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div></div></div></section>

        <section className="theme-dark band-dark relative overflow-hidden"><div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center lg:gap-20"><div><Eyebrow>Learn + Community</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance">Free knowledge from builds that actually happened.</h2><p className="mt-4 text-lg leading-relaxed text-text-secondary">Read practical guides and field notes, follow build videos as they are published, and ask the Discord community when your result does not match the tutorial.</p><div className="mt-8 flex flex-wrap gap-3"><Button render={<Link href="/docs" />}>Explore Learn <BookOpen className="size-4" /></Button><Button variant="outline" render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}><DiscordIcon className="size-4" />Join Discord</Button></div></div><DiscordChatMock /></div></section>

        <section className="border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-24"><div className="mx-auto max-w-3xl text-center"><Eyebrow>Homelab services</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">Use the free resources—or bring ZeroPoint into the build.</h2><p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-secondary">Paid help is focused and scoped — not a managed service or an emergency line.</p></div><div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">{offeringsFor("homelab").map((service) => { const Icon = SERVICE_ICONS[service.id] ?? Wrench; return <article key={service.id} className="rounded-2xl border border-border bg-surface-raised p-6"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-6 text-xl font-semibold">{service.title}</h3><p className="mt-3 text-sm leading-relaxed text-text-secondary">{service.description}</p><ul className="mt-5 space-y-2 border-t border-border pt-5">{service.includes.map((item) => <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-text-secondary"><Check className="mt-0.5 size-3.5 shrink-0 text-success" />{item}</li>)}</ul></article> })}</div><div className="mt-10 flex flex-wrap justify-center gap-3"><Button size="lg" render={<Link href="/contact" />}>Get a free consult <ArrowRight className="size-4" /></Button><Button size="lg" variant="outline" render={<Link href="/pricing#homelab" />}>See homelab pricing</Button></div></div></section>
      </main>
      <Footer />
    </>
  )
}

function LabUnit({ unit, label, tone }: { unit: string; label: string; tone: string }) {
  return <div className="mb-1.5 grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5 last:mb-0"><span className="font-mono text-[11px] text-text-tertiary">{unit}</span><span className="text-sm font-medium text-foreground">{label}</span><span className={`size-1.5 rounded-full bg-current ${tone}`} /></div>
}
