import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calculator, Search, ServerCog } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { Button } from "@/components/ui/button"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Homelab Planning Tools — ZeroPoint",
  description: "Size self-hosted workloads, find suitable hardware, and plan a complete homelab before spending money.",
  path: "/tools",
})

const TOOLS = [
  { icon: Calculator, status: "Available", title: "VM Sizer", copy: "Choose common self-hosted apps and get a transparent CPU, memory, and system-storage starting point backed by official requirements.", href: "/sizer", action: "Size your workloads" },
  { icon: Search, status: "Available", title: "Hardware Deals", copy: "Search current eBay listings for proven mini PCs, network gear, and compact rack components without wading through unrelated parts.", href: "/deals", action: "Browse current deals" },
  { icon: ServerCog, status: "Planned", title: "Rack Designer", copy: "Turn workloads and hardware into a complete 10-inch rack layout with compatibility guidance and a full price breakdown.", href: "/deals#rack-concept", action: "See the rack concept" },
]

export default function ToolsPage() {
  return (
    <><TopNav /><main>
      <section className="relative overflow-hidden border-b border-border"><div className="pointer-events-none absolute inset-0 bg-hero-glow" /><div className="relative mx-auto max-w-6xl px-6 pt-36 pb-20"><Eyebrow>Planning tools</Eyebrow><h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">Plan the lab before you buy the hardware.</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">Start with what you want to run, understand the resources it needs, then find hardware that fits. ZeroPoint keeps the assumptions visible so the recommendation can be questioned—not blindly trusted.</p></div></section>
      <section className="border-b border-border"><div className="mx-auto max-w-6xl px-6 py-20"><div className="border-t border-border">{TOOLS.map(({ icon: Icon, status, title, copy, href, action }, index) => <Link key={title} href={href} className="group grid gap-5 border-b border-border py-8 sm:grid-cols-[64px_1fr_auto] sm:items-center"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span><span className="font-mono text-[9px] tracking-[0.16em] text-text-tertiary uppercase">0{index + 1} · {status}</span><strong className="mt-2 block text-2xl tracking-tight transition-colors group-hover:text-primary">{title}</strong><span className="mt-2 block max-w-2xl text-sm leading-relaxed text-text-secondary">{copy}</span></span><span className="inline-flex items-center gap-1.5 text-sm font-medium">{action}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div></div></section>
      <section className="bg-surface"><div className="mx-auto max-w-4xl px-6 py-20 text-center"><h2 className="text-3xl font-bold tracking-tight">Need help turning the plan into a build?</h2><p className="mx-auto mt-3 max-w-lg text-text-secondary">Use the tools yourself, ask the community, or bring the plan to ZeroPoint Services for guided setup and installation.</p><div className="mt-7"><Button render={<Link href="/services" />}>Explore services <ArrowRight className="size-4" /></Button></div></div></section>
    </main><Footer /></>
  )
}
