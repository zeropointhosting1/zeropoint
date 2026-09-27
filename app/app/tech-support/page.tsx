import Link from "next/link"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { TechSupportSection } from "@/components/marketing/local-services"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata({ title: "Boca Raton Computer Help & Remote Tech Support — ZeroPoint", description: "On-demand computer, printer, email, software, and device help in Boca Raton. Local on-site visits and authorized remote support.", path: "/tech-support" })
export default function Page() { return <><TopNav /><main><section className="relative overflow-hidden border-b border-border"><div className="pointer-events-none absolute inset-0 bg-hero-glow" /><div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20"><Eyebrow>Boca Raton · On-site & remote</Eyebrow><h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">Everyday tech.<br /><span className="text-primary">A real person to help.</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">Computers, printers, email, accounts, and new devices. Get practical technology help for your home or small business, without a monthly support plan.</p><div className="mt-8 flex flex-wrap gap-3"><Button render={<Link href="/contact?help=Computer%20%26%20tech%20help" />}>Get Tech Help</Button><Button variant="outline" render={<Link href="/pricing#support" />}>See pricing</Button></div></div></section><TechSupportSection /><HowItWorks /></main><Footer /></> }
