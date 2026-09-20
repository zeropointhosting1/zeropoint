import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { getDocsByCategory } from "@/lib/docs"

export const metadata: Metadata = {
  title: "Docs — ZeroPoint",
  description: "Networking, infrastructure, and security notes from the ZeroPoint lab.",
}

export default function DocsIndexPage() {
  const groups = getDocsByCategory()

  return (
    <div>
      <Eyebrow>Field notes</Eyebrow>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Documentation</h1>
      <p className="mt-4 max-w-xl text-lg text-text-secondary">
        Networking, infrastructure, and security notes written while actually
        building the lab — not a manual, a record of what was learned.
      </p>

      <div className="mt-14 space-y-12">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
              {group.label}
            </h2>
            <ul className="mt-4 divide-y divide-border border-t border-border">
              {group.docs.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/docs/${doc.category}/${doc.slug}`}
                    className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {doc.title}
                      </h3>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
                        {doc.description}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
