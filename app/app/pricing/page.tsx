import Link from "next/link"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { StartingPricing } from "@/components/marketing/support-plans"
import { ServicesCta } from "@/components/marketing/services-cta"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({ title: "Tech Support & Wi-Fi Pricing in Boca Raton — ZeroPoint", description: "Remote tech help starting around $75/hour, local on-site help around $100/hour, and Wi-Fi assessments around $99. Clear quotes for installations and websites.", path: "/pricing" })
const PROJECTS = [
  { id: "home", name: "Home Network / UniFi Installation", copy: "Based on equipment, property size, cabling, and number of access points.", href: "/home-networking" },
  { id: "business", name: "Business Networking", copy: "Sized around your staff, guests, POS systems, cameras, and devices.", href: "/services" },
  { id: "web", name: "Websites", copy: "Local business and restaurant websites, with hosting and ongoing updates available.", href: "/websites" },
  { id: "plans", name: "Network Care", copy: "Optional monthly monitoring and maintenance after installation. Scope and support time agreed for your network.", href: "/network-care" },
]
export default function PricingPage() {
  return <><TopNav /><main><section className="relative overflow-hidden border-b border-border"><div className="pointer-events-none absolute inset-0 bg-hero-glow" /><div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20"><Eyebrow>Pricing</Eyebrow><h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">Clear costs.<br /><span className="text-primary">Help that fits the job.</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">A one-off fix or a complete network installation: we agree on the work and price before getting started. No support subscription required.</p></div></section>
  <div id="support" className="scroll-mt-24"><StartingPricing /></div>
  <section className="border-b border-border"><div className="mx-auto max-w-6xl px-6 py-20"><Eyebrow>Projects &amp; optional care</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight">Quoted for your setup.</h2><div className="mt-8 divide-y divide-border border-y border-border">{PROJECTS.map((item) => <article id={item.id} key={item.id} className="grid scroll-mt-24 gap-3 py-7 sm:grid-cols-[1fr_auto]"><div><h3 className="text-lg font-semibold"><Link href={item.href} className="hover:text-primary hover:underline">{item.name}</Link></h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{item.copy}</p></div><p className="font-semibold text-primary">Custom quote</p></article>)}</div><div className="mt-10 grid gap-8 sm:grid-cols-2"><div><h3 className="font-semibold">What does the quote include?</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">The agreed work, labor, and any equipment costs shown separately. Hardware pricing is transparent, and you own the equipment, accounts, and configuration information.</p></div><div><h3 className="font-semibold">What if the job changes?</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">We discuss any extra work and its cost before proceeding. Payment timing and any deposit are confirmed in writing. No surprise charges.</p></div></div></div></section><ServicesCta /></main><Footer /></>
}
