import Link from "next/link"
import { ArrowRight, Building2, FlaskConical, HouseWifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"

const PROJECT_TYPES = [
  { icon: FlaskConical, title: "Homelab", copy: "Plan it together or get help turning the parts into a documented build." },
  { icon: HouseWifi, title: "Home Networking", copy: "Improve Wi-Fi, UniFi, smart-device separation, racks, and reliability." },
  { icon: Building2, title: "Small Business", copy: "Set up practical networks, guest access, devices, and documentation." },
]

export function ServicesCta() {
  return <section className="relative overflow-hidden border-b border-border bg-surface"><div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" /><div className="relative mx-auto max-w-6xl px-6 py-28"><div className="mx-auto max-w-3xl text-center"><Eyebrow>Work with ZeroPoint</Eyebrow><h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-6xl">Want help building yours?</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">Start with what you want the technology to do. We&rsquo;ll turn that into a clear scope, practical plan, and documented next step.</p></div><div className="mx-auto mt-12 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">{PROJECT_TYPES.map(({ icon: Icon, title, copy }) => <div key={title} className="bg-surface-raised p-6 text-left"><Icon className="size-5 text-primary" /><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p></div>)}</div><div className="mt-10 flex justify-center"><Button size="lg" render={<Link href="/services#project-planner" />}>Start a project <ArrowRight className="size-4" /></Button></div></div></section>
}
