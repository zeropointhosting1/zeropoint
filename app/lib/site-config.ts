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

// Real business facts used in structured data (JSON-LD) and the Contact
// page. Kept in one place so nothing has to be re-typed, and so it's
// obvious what's still a placeholder — see TODO-CONTENT.md.
export const BUSINESS_INFO = {
  name: "ZeroPoint",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  city: "Boca Raton, FL",
  areaServed: "Boca Raton and nearby South Florida communities",
  credentialLine: "Hands-on IT support and networking",
  certifications: [] as string[], // {{TODO: certifications, if any — leave empty to omit the row}}
  // Legal — used by /services (payment FAQ) and /terms, /privacy.
  paymentTerms: "Payment timing and any deposit are confirmed in your written quote before work begins.",
  liabilityLimitation: "",
  jurisdiction: "",
  legalPublishDate: "",
}

// Cal.com (or similar) scheduling link. Leave null to hide the booking
// link on the Contact page until you have one.
export const BOOKING_URL: string | null = null // {{TODO: booking link, e.g. Cal.com}}

// How many business days you commit to replying within — shown on the
// Contact page's "what happens next" block.
export const RESPONSE_DAYS: string | null = null

// Publish these only after adding real, approved client content.
export const SHOW_CLIENT_WORK = false
export const SHOW_TESTIMONIALS = false

export const OWNER = {
  name: "Harrison Lurgio",
  bio: "Harrison Lurgio started ZeroPoint to make professional technology help easier to get locally. His background spans hands-on IT support, networking, identity and device management, Windows systems, and Microsoft environments. He builds and tests ideas in the ZeroPoint Lab, bringing that practical experience and curiosity to each setup.",
  photoPlaceholder: "Harrison Lurgio · Owner",
}
export const TIKTOK = {
  handle: "",
  url: null as string | null, // {{TODO: TikTok profile URL}}
}
