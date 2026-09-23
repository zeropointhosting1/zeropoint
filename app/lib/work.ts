import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content/work")

export type CaseStudyFrontmatter = {
  title: string
  summary: string
  date: string
  tags: string[]
  // Optional — a client quote to close the case study with. Never
  // invented; omit the field entirely rather than filling it with a
  // placeholder quote.
  clientQuote?: { quote: string; author: string }
  // Optional photo paths under public/, shown in a gallery at the end.
  photos?: string[]
}

export type CaseStudyMeta = CaseStudyFrontmatter & { slug: string }

// Files starting with "_" (e.g. _TEMPLATE.mdx) are reference material, not
// published case studies — excluded here so the template can live next to
// real entries without appearing on the site.
function readSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""))
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  return readSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8")
      const { data } = matter(raw)
      return {
        slug,
        title: data.title,
        summary: data.summary,
        date: data.date,
        tags: data.tags ?? [],
        clientQuote: data.clientQuote,
        photos: data.photos ?? [],
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getCaseStudy(slug: string): { source: string; frontmatter: CaseStudyFrontmatter } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath) || slug.startsWith("_")) return null
  const raw = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(raw)
  return {
    source: content,
    frontmatter: {
      title: data.title,
      summary: data.summary,
      date: data.date,
      tags: data.tags ?? [],
      clientQuote: data.clientQuote,
      photos: data.photos ?? [],
    },
  }
}
