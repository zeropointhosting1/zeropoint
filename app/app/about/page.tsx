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
import { GithubIcon, LinkedinIcon, DiscordIcon } from "@/components/nav/brand-icons"
import { DISCORD_URL, SOCIAL_LINKS } from "@/lib/site-config"
import { BUSINESS_INFO } from "@/lib/business-info"
import { withBasePath } from "@/lib/base-path"
import { pageMetadata } from "@/lib/metadata"

// Checked at build time — static export, so no runtime way to know if the
// photo has been added. Falls back to the initials badge below until
// public/about/headshot.jpg exists.
const HAS_HEADSHOT = fs.existsSync(path.join(process.cwd(), "public/about/headshot.jpg"))

export const metadata: Metadata = pageMetadata({
  title: "About — ZeroPoint",
  description: "Why ZeroPoint exists — practical technology services backed by hands-on learning, documentation, and a community that shares the work.",
  path: "/about",
})

const STORY = [
  {
    n: "01",
    icon: BriefcaseBusiness,
    label: "Where it started",
    title: "From the help desk to the home lab.",
    copy: "I work in IT support and wanted a deeper, practical understanding of networking. Homelabbing gave me somewhere to work with infrastructure and enterprise technology beyond tickets, textbooks, and tutorials.",
  },
  {
    n: "02",
    icon: Wrench,
    label: "How I learn",
    title: "Build it. Break it. Fix it properly.",
    copy: "Nothing worked perfectly the first time—and that is the point. Troubleshooting routing, virtualization, services, and security is where the concepts stop being abstract and start becoming real skills.",
  },
  {
    n: "03",
    icon: Share2,
    label: "Why I wanted a community",
    title: "Homelabbing is better when we share the work.",
    copy: "ZeroPoint began as my own technical notes, but I wanted a place where people could share their labs, compare ideas, troubleshoot together, and learn from both successful builds and frustrating mistakes.",
  },
  {
    n: "04",
    icon: ShieldCheck,
    label: "Why services matter",
    title: "A home network should be convenient and secure.",
    copy: "Homes now contain cameras, speakers, appliances, and other IoT devices that may not deserve access to everything else on the network. I want ZeroPoint to help people install and segment their networks properly, understand what they own, and leave with documentation they can actually use.",
  },
]

const PATHS = [
  { icon: Users, eyebrow: "Community", title: "Build alongside us", copy: "Join people sharing setups, solving problems, and learning the same technology.", href: "/community" },
  { icon: Search, eyebrow: "Hardware", title: "Know what to buy", copy: "Find real listings for useful homelab gear and learn what belongs in a practical build.", href: "/deals" },
  { icon: ShieldCheck, eyebrow: "Services", title: "Get help setting it up", copy: "Plan a safer home network, UniFi deployment, homelab, or self-hosted environment.", href: "/services" },
  { icon: Network, eyebrow: "Infrastructure", title: "See a working example", copy: "Explore a sanitized topology with real workloads, hardware, and segmented VLANs.", href: "/network" },
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
                Built in the lab.<br /><span className="text-primary">Applied in the real world.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">
                I&rsquo;m {BUSINESS_INFO.name}, based in {BUSINESS_INFO.city}. ZeroPoint grew from hands-on homelabbing into a larger mission: help property owners and small businesses build reliable, secure technology—and share what I learn with the community.
              </p>
            </div>

            <div className="relative border-y border-border py-7">
              <div className="pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
              <p className="relative font-mono text-[10px] tracking-[0.18em] text-primary uppercase">Current chapter</p>
              <div className="relative mt-6 flex items-center gap-4">
                {HAS_HEADSHOT ? (
                  <Image src={withBasePath("/about/headshot.jpg")} alt={BUSINESS_INFO.name} width={56} height={56} unoptimized className="size-14 shrink-0 rounded-2xl border border-primary/20 object-cover" />
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 font-mono text-xl font-semibold text-primary">ZP</span>
                )}
                <div><p className="font-semibold text-foreground">{BUSINESS_INFO.credentialLine}</p><p className="mt-1 text-sm text-text-secondary">Still learning, out loud, in public</p></div>
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
                “The failures are not edited out. They are usually where the best documentation begins.”
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>The story</Eyebrow>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">Why I started building.</h2>
                <p className="mt-4 text-text-secondary">A lab is a safe place to be curious, make mistakes, and understand the systems behind the screen.</p>
              </div>
              <div className="border-t border-border">
                {STORY.map(({ n, icon: Icon, label, title, copy }) => (
                  <article key={n} className="grid gap-5 border-b border-border py-9 sm:grid-cols-[64px_1fr]">
                    <div><span className="font-mono text-xs text-text-tertiary">{n}</span><span className="mt-4 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span></div>
                    <div><p className="font-mono text-[10px] tracking-[0.16em] text-primary uppercase">{label}</p><h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h3><p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">{copy}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-5"><div><Eyebrow>Go deeper</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">See what ZeroPoint is becoming.</h2></div><p className="max-w-sm text-sm leading-relaxed text-text-secondary">One working lab, the lessons it produces, and a community built around learning in public.</p></div>
            <div className="grid border-t border-border md:grid-cols-2">
              {PATHS.map(({ icon: Icon, eyebrow, title, copy, href }) => (
                <Link key={href} href={href} className="group border-b border-border py-7 md:px-7 md:odd:border-r md:odd:pl-0 md:even:pr-0">
                  <div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span><ArrowUpRight className="size-4 text-text-tertiary transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></div>
                  <p className="mt-6 font-mono text-[9px] tracking-[0.16em] text-text-tertiary uppercase">{eyebrow}</p><h3 className="mt-2 text-lg font-semibold transition-colors group-hover:text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60" />
          <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-28">
            <Eyebrow>Connect</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">Build something. Share what you learn.</h2>
            <p className="mx-auto mt-4 max-w-lg text-text-secondary">Join the Discord, follow the code, or connect with me professionally.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="shadow-[0_0_32px_-8px_var(--accent-glow)]" render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}><DiscordIcon className="size-4" />Join the Discord</Button>
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
