import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-config"
import { getAllDocs } from "@/lib/docs"

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
  "/projects/",
  "/services/",
  "/sizer/",
  "/tools/",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs().map((doc) => ({
    url: `${SITE_URL}/docs/${doc.category}/${doc.slug}/`,
    lastModified: doc.date,
  }))

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }))

  return [...staticEntries, ...docs]
}
