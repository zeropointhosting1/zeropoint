import type { Metadata } from "next"
import fs from "node:fs"
import path from "node:path"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Network, Search, ShieldCheck, Share2, Users, Wrench } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { GithubIcon, LinkedinIcon } from "@/components/nav/brand-icons"
import { SOCIAL_LINKS, OWNER } from "@/lib/site-config"
import { BUSINESS_INFO } from "@/lib/business-info"
import { withBasePath } from "@/lib/base-path"
import { pageMetadata } from "@/lib/metadata"

// Checked at build time — static export, so no runtime way to know if the
// photo has been added. Falls back to the initials badge below until
// public/about/headshot.jpg exists.
const HAS_HEADSHOT = fs.existsSync(path.join(process.cwd(), "public/about/headshot.jpg"))

export const metadata: Metadata = pageMetadata({
  title: "About — ZeroPoint",
  description: "Meet the person behind ZeroPoint, a local IT support business in Boca Raton helping small businesses and homes.",
  path: "/about",
})

const STORY = [
  { n: "01", icon: BriefcaseBusiness, label: "Small business", title: "Your local IT team.", copy: "Monthly support keeps networking, updates, and everyday technology help in one place. Start with a clear plan that fits your business." },
  { n: "02", icon: ShieldCheck, label: "Clear scope", title: "Know what you are paying for.", copy: "We explain the work in plain English and confirm the price up front. Your accounts, equipment, and documentation stay yours." },
  { n: "03", icon: Wrench, label: "Websites", title: "One team for your IT and your website.", copy: "Add a practical website for your small business or restaurant to the support relationship you already have." },
  { n: "04", icon: Share2, label: "At home", title: "Reliable Wi-Fi beyond the office.", copy: "Home networking gets the same careful setup, straightforward explanations, and documented handoff." },
]

const PATHS = [
  { icon: ShieldCheck, eyebrow: "Business IT", title: "Support for your business", copy: "Office networks, Wi-Fi, and monthly managed support.", href: "/services" },
  { icon: Search, eyebrow: "Pricing", title: "See monthly plans", copy: "Compare inclusions and choose the support you need.", href: "/pricing/#plans" },
  { icon: Network, eyebrow: "The Lab", title: "See the work behind the work", copy: "Documented builds, experiments, and lessons shared openly.", href: "/lab" },
  { icon: Users, eyebrow: "Contact", title: "Talk to ZeroPoint", copy: "Start with a free consult and a clear scope.", href: "/contact" },
]

export default function AboutPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto grid min-h-[680px] max-w-6xl items-center gap-14 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div>
              <Eyebrow>About ZeroPoint</Eyebrow>
              <h1 className="mt-5 max-w-3xl text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
                Local IT support.<br /><span className="text-primary">A person you can talk to.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">
                I&rsquo;m {OWNER.name}, based in {BUSINESS_INFO.city}. {OWNER.bio}
              </p>
            </div>

            <div className="relative border-y border-border py-7">
              <div className="pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
              <p className="relative font-mono text-[11px] tracking-[0.14em] text-primary uppercase">Behind ZeroPoint</p>
              <div className="relative mt-6 flex items-center gap-4">
                {HAS_HEADSHOT ? (
                  <Image src={withBasePath("/about/headshot.jpg")} alt={OWNER.name} width={56} height={56} unoptimized className="size-14 shrink-0 rounded-2xl border border-primary/20 object-cover" />
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 font-mono text-xl font-semibold text-primary">ZP</span>
                )}
                <div><p className="font-semibold text-foreground">{BUSINESS_INFO.credentialLine}</p><p className="mt-1 text-sm text-text-secondary">Small-business IT, websites, and home networking</p></div>
              </div>
              <dl className="relative mt-7 divide-y divide-border border-t border-border">
                <ProfileRow label="Based in" value={BUSINESS_INFO.city} />
                <ProfileRow label="Experience" value={`${BUSINESS_INFO.yearsInIt} in IT`} />
                <ProfileRow label="Environment" value="UniFi · Proxmox · Cisco" />
                {BUSINESS_INFO.certifications.length > 0 && (
                  <ProfileRow label="Certifications" value={BUSINESS_INFO.certifications.join(", ")} />
                )}
              </dl>
              <p className="relative mt-6 border-l border-primary/50 pl-4 text-sm leading-relaxed text-text-secondary">
                Clear scope, plain-English explanations, and technology you own.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>The story</Eyebrow>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">How ZeroPoint helps.</h2>
                <p className="mt-4 text-text-secondary">Reliable day-to-day support for your business, with websites and home networking when you need them.</p>
              </div>
              <div className="border-t border-border">
                {STORY.map(({ n, icon: Icon, label, title, copy }) => (
                  <article key={n} className="grid gap-5 border-b border-border py-9 sm:grid-cols-[64px_1fr]">
                    <div><span className="font-mono text-xs text-text-tertiary">{n}</span><span className="mt-4 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span></div>
                    <div><p className="font-mono text-[11px] tracking-[0.12em] text-primary uppercase">{label}</p><h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h3><p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">{copy}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-5"><div><Eyebrow>Go deeper</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Find the help you need.</h2></div><p className="max-w-sm text-sm leading-relaxed text-text-secondary">Business IT is the core. The Lab is where we test ideas and share what we learn.</p></div>
            <div className="grid border-t border-border md:grid-cols-2">
              {PATHS.map(({ icon: Icon, eyebrow, title, copy, href }) => (
                <Link key={href} href={href} className="group border-b border-border py-7 md:px-7 md:odd:border-r md:odd:pl-0 md:even:pr-0">
                  <div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span><ArrowUpRight className="size-4 text-text-tertiary transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></div>
                  <p className="mt-6 font-mono text-[11px] tracking-[0.12em] text-text-tertiary uppercase">{eyebrow}</p><h3 className="mt-2 text-lg font-semibold transition-colors group-hover:text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60" />
          <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-28">
            <Eyebrow>Connect</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">Let’s talk about your business.</h2>
            <p className="mx-auto mt-4 max-w-lg text-text-secondary">Tell us what is working, what is not, and where you need support.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/contact/" />}>Get a free consult <ArrowRight className="size-4" /></Button>
              {SOCIAL_LINKS.github && (
                <Button size="lg" variant="outline" render={<a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" />}><GithubIcon className="size-4" />GitHub</Button>
              )}
              {SOCIAL_LINKS.linkedin && (
                <Button size="lg" variant="outline" render={<a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" />}><LinkedinIcon className="size-4" />LinkedIn</Button>
              )}
            </div>
            <Link href="/network" className="group mt-10 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground">See the infrastructure <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-5 py-3 text-sm"><dt className="text-text-tertiary">{label}</dt><dd className="font-mono text-xs text-foreground">{value}</dd></div>
}
