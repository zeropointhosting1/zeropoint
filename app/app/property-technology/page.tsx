import type { Metadata } from "next"
import Link from "next/link"
import { withBasePath } from "@/lib/base-path"
import { pageMetadata } from "@/lib/metadata"

// This route moved to /home-networking/. Kept as a static-export-safe
// redirect (no server, so no redirects() config or 3xx response) so old
// links and bookmarks still land somewhere — a meta refresh plus a
// canonical pointed at the real page, which also tells search engines
// this URL isn't the one to index.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Home Networking — ZeroPoint",
    description: "This page moved to /home-networking/.",
    path: "/home-networking",
  }),
  robots: { index: false, follow: true },
}

export default function PropertyTechnologyRedirect() {
  const target = withBasePath("/home-networking/")
  return (
    <>
      {/* Server Components can render <meta>/<title>/<link> anywhere in the
          tree and Next hoists them into the document <head>. */}
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <p>
          This page moved to <Link href="/home-networking">/home-networking/</Link>.
        </p>
      </div>
    </>
  )
}
