import type { Metadata } from "next"
import Link from "next/link"
import {
  Home,
  Server,
  Network,
  Globe,
  Fingerprint,
  Lock,
  LayoutDashboard,
  KeyRound,
  Radar,
  Building2,
  ArrowUpRight,
} from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ProjectCard } from "@/components/projects/project-card"
import { PROJECTS } from "@/lib/projects"
import { getAllCaseStudies } from "@/lib/work"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Work — ZeroPoint",
  description: "Lab projects: what's running in the ZeroPoint lab today, what's been built and broken along the way, and what's next.",
  path: "/projects",
})

const ICONS: Record<string, typeof Home> = {
  "home-network": Home,
  "proxmox-cluster": Server,
  "enterprise-network-lab": Network,
  "zeropoint-website": Globe,
  sso: Fingerprint,
  "remote-access": Lock,
  "internal-dashboard": LayoutDashboard,
  vaultwarden: KeyRound,
  siem: Radar,
  "windows-lab": Building2,
}

export default function ProjectsPage() {
  const caseStudies = getAllCaseStudies()

  return (
    <>
      <TopNav />
      <main>
        <section className="relative border-b border-border bg-grid">
          <div className="bg-radial-fade absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-16">
            <Eyebrow>Selected work</Eyebrow>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Work
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-secondary">
              Lab projects: what&rsquo;s actually running in the ZeroPoint
              lab today, what&rsquo;s been built and broken along the way,
              and what&rsquo;s next.
            </p>
          </div>
        </section>

        {caseStudies.length > 0 && (
          <section className="border-b border-border">
            <div className="mx-auto max-w-6xl px-6 py-16">
              <Eyebrow>Case studies</Eyebrow>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {caseStudies.map((study) => (
                  <Link key={study.slug} href={`/work/${study.slug}`} className="group rounded-2xl border border-border bg-surface-raised p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30">
                    <h3 className="text-lg font-semibold group-hover:text-primary">{study.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{study.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">Read the case study <ArrowUpRight className="size-3.5" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            {caseStudies.length > 0 && <Eyebrow>Lab projects</Eyebrow>}
            <div className={caseStudies.length > 0 ? "mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
              {PROJECTS.map((project) => (
                <ProjectCard key={project.id} project={project} icon={ICONS[project.id]} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Prefer real incidents to project summaries?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-text-secondary">
              Field notes cover actual failures — symptoms, investigation,
              root cause, and what changed afterward.
            </p>
            <div className="mt-6">
              <Link
                href="/docs"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                Read the field notes
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
