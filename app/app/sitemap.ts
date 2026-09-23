import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-config"
import { getAllDocs } from "@/lib/docs"
import { getAllCaseStudies } from "@/lib/work"

export const dynamic = "force-static"

// trailingSlash is on (next.config.ts), so every route below matches what
// the static export actually generates.
const STATIC_ROUTES = [
  "/",
  "/about/",
  "/community/",
  "/contact/",
  "/deals/",
  "/docs/",
  "/home-networking/",
  "/lab/",
  "/network/",
  "/privacy/",
  "/projects/",
  "/services/",
  "/sizer/",
  "/terms/",
  "/tools/",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs().map((doc) => ({
    url: `${SITE_URL}/docs/${doc.category}/${doc.slug}/`,
    lastModified: doc.date,
  }))

  const caseStudies = getAllCaseStudies().map((study) => ({
    url: `${SITE_URL}/work/${study.slug}/`,
    lastModified: study.date,
  }))

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }))

  return [...staticEntries, ...docs, ...caseStudies]
}
