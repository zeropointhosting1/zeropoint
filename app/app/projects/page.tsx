import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { getAllCaseStudies } from "@/lib/work"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Client Work — ZeroPoint",
  description: "Real client case studies from ZeroPoint: the problem, the work, and the outcome.",
  path: "/projects",
})

export default function ProjectsPage() {
  const caseStudies = getAllCaseStudies()
  return (
    <><TopNav /><main>
      <section className="relative border-b border-border bg-grid">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-16">
          <Eyebrow>Client Work</Eyebrow><h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">Real problems. Documented results.</h1>
          <p className="mt-5 max-w-2xl text-lg text-text-secondary">Client case studies covering the starting point, the work, and what changed.</p>
        </div>
      </section>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          {caseStudies.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{caseStudies.map((study) => (
            <Link key={study.slug} href={`/work/${study.slug}/`} className="group rounded-2xl border border-border bg-surface-raised p-6 hover:border-primary/30">
              <h2 className="text-xl font-semibold group-hover:text-primary">{study.title}</h2><p className="mt-3 text-sm text-text-secondary">{study.summary}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">Read the case study <ArrowUpRight className="size-4" /></span>
            </Link>
          ))}</div> : <div className="rounded-2xl border border-border bg-surface-raised p-8 sm:p-12">
            <h2 className="text-2xl font-semibold">Case studies are coming.</h2><p className="mt-3 max-w-xl text-text-secondary">There are no published client case studies yet. In the meantime, explore the working lab behind ZeroPoint.</p><Link href="/lab/#projects" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Explore The Lab →</Link>
          </div>}
        </div>
      </section>
    </main><Footer /></>
  )
}
