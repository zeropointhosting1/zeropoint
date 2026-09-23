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

export const metadata: Metadata = {
  title: "Projects — ZeroPoint",
  description: "Everything being built, broken, and documented in the ZeroPoint lab.",
}

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
  return (
    <>
      <TopNav />
      <main>
        <section className="relative border-b border-border bg-grid">
          <div className="bg-radial-fade absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-16">
            <Eyebrow>Selected work</Eyebrow>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Projects
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-secondary">
              The full scope of what&rsquo;s actually running, not a skills
              list. Some of these link to real documentation already; the
              rest are marked planned rather than padded out.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              The Troubleshooting Journal covers actual failures — symptoms,
              investigation, root cause, and what changed afterward.
            </p>
            <div className="mt-6">
              <Link
                href="/docs"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                Read the guides
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
