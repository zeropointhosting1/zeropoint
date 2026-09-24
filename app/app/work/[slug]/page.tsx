import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import { ArrowLeft, Send } from "lucide-react"
import { getAllCaseStudies, getCaseStudy } from "@/lib/work"
import { mdxComponents } from "@/components/docs/mdx-components"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/seo/json-ld"
import { withBasePath } from "@/lib/base-path"
import { pageMetadata } from "@/lib/metadata"
import { BUSINESS_INFO } from "@/lib/business-info"

export function generateStaticParams() {
  const studies = getAllCaseStudies()
  // output: "export" requires at least one generated route for a dynamic
  // segment — with zero real case studies yet, this generates a single
  // slug that resolves to nothing (getCaseStudy returns null for it,
  // triggering notFound() below) purely to satisfy that constraint. It's
  // never linked to from anywhere on the site.
  if (studies.length === 0) return [{ slug: "_none" }]
  return studies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return {}
  return pageMetadata({
    title: `${study.frontmatter.title} — ZeroPoint Work`,
    description: study.frontmatter.summary,
    path: `/work/${slug}`,
  })
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) notFound()

  const { frontmatter, source } = study

  return (
    <>
      <TopNav />
      <main>
        <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Article",
              headline: frontmatter.title,
              description: frontmatter.summary,
              datePublished: frontmatter.date,
              author: { "@type": "Person", name: BUSINESS_INFO.name },
            }}
          />
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            Work
          </Link>

          <span className="mt-6 block font-mono text-xs tracking-[0.14em] text-primary uppercase">Case study</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{frontmatter.title}</h1>
          <p className="mt-3 text-text-secondary">{frontmatter.summary}</p>
          {frontmatter.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] tracking-wider text-text-tertiary uppercase">{tag}</span>
              ))}
            </div>
          )}

          <div className="docs-prose mt-10">
            <MDXRemote
              source={source}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
            />
          </div>

          {frontmatter.photos && frontmatter.photos.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {frontmatter.photos.map((photo) => (
                <div key={photo} className="relative aspect-video overflow-hidden rounded-xl border border-border">
                  <Image src={withBasePath(`/${photo}`)} alt="" fill unoptimized className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {frontmatter.clientQuote && (
            <blockquote className="mt-10 rounded-2xl border border-primary/25 bg-primary/5 p-6">
              <p className="text-lg leading-relaxed text-foreground">&ldquo;{frontmatter.clientQuote.quote}&rdquo;</p>
              <cite className="mt-3 block text-sm not-italic text-text-tertiary">— {frontmatter.clientQuote.author}</cite>
            </blockquote>
          )}

          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface-raised p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-foreground">Want something like this?</p>
              <p className="text-sm text-text-secondary">Start with what you want the technology to do.</p>
            </div>
            <Button size="sm" className="w-full sm:w-auto" render={<Link href="/contact" />}>
              <Send className="size-4" />
              Get in touch
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
