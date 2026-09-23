import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Eyebrow } from "./eyebrow"
import { getAllCaseStudies } from "@/lib/work"

// Hidden entirely until a real case study exists — see content/work/.
export function CaseStudiesSlot() {
  const caseStudies = getAllCaseStudies()
  if (caseStudies.length === 0) return null

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Case studies</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Real projects, start to finish.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
  )
}
