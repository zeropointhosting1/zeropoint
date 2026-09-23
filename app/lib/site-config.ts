export const DISCORD_URL = "https://discord.gg/tw6sCNMP2h"

// GitHub Pages serves a project site under /<repo>/ — this mirrors
// next.config.ts's basePath so metadata, robots.txt and the sitemap all
// resolve to real absolute URLs instead of Next's localhost dev default.
// Set NEXT_PUBLIC_SITE_URL in the deploy environment once a custom domain
// is in place, and it overrides this default.
const basePath = process.env.BASE_PATH ?? ""
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (basePath ? `https://zeropointhosting1.github.io${basePath}` : "http://localhost:3000")

// Social links: fill in a real profile URL to show that icon in the nav
// and footer; leave null to hide it rather than link to a placeholder.
// See TODO-CONTENT.md.
export const SOCIAL_LINKS = {
  github: null as string | null, // {{TODO: GitHub profile URL}}
  linkedin: null as string | null, // {{TODO: LinkedIn profile URL}}
}
