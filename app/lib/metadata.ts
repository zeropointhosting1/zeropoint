import type { Metadata } from "next"

const SITE_NAME = "ZeroPoint"

// Resolved against the root layout's metadataBase — a plain public/ asset
// rather than a generated opengraph-image route, since GitHub Pages doesn't
// reliably set a Content-Type for the extensionless files that route
// convention produces.
const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "ZeroPoint — homelabs, home networking, and small business technology" }

// Wraps a page's title/description with the Open Graph and Twitter Card
// fields social previews and messaging apps read.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  }
}
