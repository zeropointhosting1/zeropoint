import Link from "next/link"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { NetworkCare } from "@/components/marketing/local-services"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata({ title: "Network Care in Boca Raton — ZeroPoint", description: "Optional network monitoring, updates, configuration backups, and scoped troubleshooting after a ZeroPoint network installation.", path: "/network-care" })
export default function Page() { return <><TopNav /><main><section className="relative overflow-hidden border-b border-border"><div className="pointer-events-none absolute inset-0 bg-hero-glow" /><div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20"><Eyebrow>Optional network maintenance</Eyebrow><h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">Your network, cared for.<br /><span className="text-primary">Your setup, still yours.</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">Once ZeroPoint has installed your network, add a little ongoing maintenance if it makes sense for you. Network Care keeps the focus on the equipment and configuration we know.</p><div className="mt-8 flex flex-wrap gap-3"><Button render={<Link href="/contact?help=Network%20Care" />}>Ask about Network Care</Button><Button variant="outline" render={<Link href="/pricing#plans" />}>See pricing</Button></div></div></section><NetworkCare full /><HowItWorks /></main><Footer /></> }
