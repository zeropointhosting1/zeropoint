import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import GithubSlugger from "github-slugger"

const CONTENT_DIR = path.join(process.cwd(), "content/docs")

export type DocFrontmatter = {
  title: string
  description: string
  date: string
}

export type DocMeta = DocFrontmatter & {
  slug: string
  category: string
}

export type TocItem = { depth: 2 | 3; text: string; slug: string }

// Only the categories from the original sitemap that currently have at
// least one article get a sidebar entry — an empty category reads as an
// unfinished page, not a promise of more to come.
const CATEGORY_LABELS: Record<string, string> = {
  networking: "Networking",
  cisco: "Cisco",
  proxmox: "Proxmox",
  linux: "Linux",
  unifi: "UniFi",
  opnsense: "OPNsense",
  docker: "Docker",
  security: "Security",
  "self-hosting": "Self Hosting",
  troubleshooting: "Troubleshooting",
}

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug
}

function readCategories(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
}

export function getAllDocs(): DocMeta[] {
  const docs: DocMeta[] = []
  for (const category of readCategories()) {
    const dir = path.join(CONTENT_DIR, category)
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8")
      const { data } = matter(raw)
      docs.push({
        slug: file.replace(/\.mdx$/, ""),
        category,
        title: data.title,
        description: data.description,
        date: data.date,
      })
    }
  }
  return docs.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getDocsByCategory(): { category: string; label: string; docs: DocMeta[] }[] {
  const all = getAllDocs()
  const byCategory = new Map<string, DocMeta[]>()
  for (const doc of all) {
    const list = byCategory.get(doc.category) ?? []
    list.push(doc)
    byCategory.set(doc.category, list)
  }
  return Array.from(byCategory.entries())
    .map(([category, docs]) => ({ category, label: categoryLabel(category), docs }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function getDocSource(
  category: string,
  slug: string
): { source: string; frontmatter: DocFrontmatter } | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(raw)
  return {
    source: content,
    frontmatter: { title: data.title, description: data.description, date: data.date },
  }
}

// Matches rehype-slug's own algorithm (both are backed by github-slugger),
// so these ids line up with the anchors actually rendered in the article.
export function extractToc(source: string): TocItem[] {
  const slugger = new GithubSlugger()
  const items: TocItem[] = []
  for (const line of source.split("\n")) {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim())
    if (!match) continue
    const depth = match[1].length === 2 ? 2 : 3
    const text = match[2].trim()
    items.push({ depth, text, slug: slugger.slug(text) })
  }
  return items
}
