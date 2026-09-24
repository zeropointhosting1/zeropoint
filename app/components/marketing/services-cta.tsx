import Link from "next/link"
import { ArrowRight, Building2, FlaskConical, HouseWifi, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"

const PROJECT_TYPES = [
  { icon: FlaskConical, title: "Homelab", copy: "Plan a home server together, or get hands-on help building it." },
  { icon: HouseWifi, title: "Home Networking", copy: "Wi-Fi that reaches every room and keeps smart devices in their lane." },
  { icon: Building2, title: "Small Business", copy: "Reliable office Wi-Fi, a separate guest network, and backups that work." },
  { icon: LayoutDashboard, title: "Websites & Dashboards", copy: "Build a site customers can use on a phone and a dashboard for your numbers." },
]

export function ServicesCta() {
  return <section className="relative overflow-hidden border-b border-border bg-surface"><div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" /><div className="relative mx-auto max-w-6xl px-6 py-28"><div className="mx-auto max-w-3xl text-center"><Eyebrow>Work with ZeroPoint</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-6xl">Not sure where to start?</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">Tell us what&rsquo;s frustrating you or what you&rsquo;d like to have. We&rsquo;ll explain the options in plain English and give you a clear price before any work begins.</p></div><div className="mx-auto mt-12 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">{PROJECT_TYPES.map(({ icon: Icon, title, copy }) => <div key={title} className="bg-surface-raised p-6 text-left"><Icon className="size-5 text-primary" /><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p></div>)}</div><div className="mt-10 flex justify-center"><Button size="lg" render={<Link href="/contact" />}>Get a free consult <ArrowRight className="size-4" /></Button></div></div></section>
}
