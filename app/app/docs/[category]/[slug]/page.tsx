import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypePrettyCode from "rehype-pretty-code"
import { ArrowLeft, ArrowRight, Clock, MessageCircleQuestion } from "lucide-react"
import { getAllDocs, getDocsByCategory, getDocSource, extractToc, categoryLabel, readingTime, formatHumanDate } from "@/lib/docs"
import { mdxComponents } from "@/components/docs/mdx-components"
import { Toc } from "@/components/docs/toc"
import { DiscordCallout } from "@/components/docs/discord-callout"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/metadata"
import { BUSINESS_INFO } from "@/lib/business-info"
import { withBasePath } from "@/lib/base-path"

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ category: doc.category, slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { category, slug } = await params
  const doc = getDocSource(category, slug)
  if (!doc) return {}
  return pageMetadata({
    title: `${doc.frontmatter.title} — ZeroPoint Learn`,
    description: doc.frontmatter.description,
    path: `/docs/${category}/${slug}`,
  })
}

export default async function DocArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const doc = getDocSource(category, slug)
  if (!doc) notFound()

  const toc = extractToc(doc.source)

  const sameCategory = getDocsByCategory().find((g) => g.category === category)?.docs ?? []
  const index = sameCategory.findIndex((d) => d.slug === slug)
  const prev = index > 0 ? sameCategory[index - 1] : null
  const next = index >= 0 && index < sameCategory.length - 1 ? sameCategory[index + 1] : null

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: doc.frontmatter.title,
          description: doc.frontmatter.description,
          datePublished: doc.frontmatter.date,
          author: { "@type": "Person", name: doc.frontmatter.author ?? BUSINESS_INFO.name },
        }}
      />
      <Link
        href="/docs"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Learn
      </Link>

      <div className="mt-6 grid gap-12 xl:grid-cols-[1fr_200px]">
        <div className="min-w-0">
          <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
            {categoryLabel(category)}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {doc.frontmatter.title}
          </h1>
          <p className="mt-3 text-text-secondary">{doc.frontmatter.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-text-tertiary">
            <span>{doc.frontmatter.author ?? BUSINESS_INFO.name}</span>
            <span aria-hidden="true">·</span>
            <span>{formatHumanDate(doc.frontmatter.date)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1"><Clock className="size-3" />{readingTime(doc.source)} min read</span>
          </div>

          {doc.frontmatter.heroDiagram && (
            <div className="relative mt-8 aspect-video max-w-2xl overflow-hidden rounded-xl border border-border">
              <Image src={withBasePath(doc.frontmatter.heroDiagram)} alt="" fill unoptimized className="object-cover" />
            </div>
          )}

          <div className="docs-prose mt-10 max-w-2xl">
            <MDXRemote
              source={doc.source}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypePrettyCode, { theme: "github-dark", keepBackground: false }],
                  ],
                },
              }}
            />
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <MessageCircleQuestion className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Dealing with this yourself?</p>
                <p className="text-sm text-text-secondary">Bring it to a project and get hands-on help.</p>
              </div>
            </div>
            <Button size="sm" className="w-full sm:w-auto" render={<Link href="/contact" />}>Get help with this</Button>
          </div>

          <DiscordCallout />

          {(prev || next) && (
            <div className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/docs/${prev.category}/${prev.slug}`}
                  className="group rounded-xl border border-border p-4 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_32px_-16px_var(--accent-glow)]"
                >
                  <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                    <ArrowLeft className="size-3.5" />
                    Previous
                  </span>
                  <span className="mt-1 block font-medium text-foreground">{prev.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/docs/${next.category}/${next.slug}`}
                  className="group rounded-xl border border-border p-4 text-right transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_32px_-16px_var(--accent-glow)]"
                >
                  <span className="flex items-center justify-end gap-1.5 text-xs text-text-tertiary">
                    Next
                    <ArrowRight className="size-3.5" />
                  </span>
                  <span className="mt-1 block font-medium text-foreground">{next.title}</span>
                </Link>
              )}
            </div>
          )}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <Toc items={toc} />
          </div>
        </aside>
      </div>
    </article>
  )
}
