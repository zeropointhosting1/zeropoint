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
  name: "{{TODO: your name or business name}}",
  email: "{{TODO: contact email}}",
  telephone: "{{TODO: contact phone number}}",
  city: "Boca Raton, FL",
  areaServed: "{{TODO: on-site service area — e.g. \"Boca Raton and X miles\" or a list of counties}}",
  yearsInIt: "1 year",
  credentialLine: "A year of hands-on IT help desk experience",
  certifications: [] as string[], // {{TODO: certifications, if any — leave empty to omit the row}}
  // Legal — used by /services (payment FAQ) and /terms, /privacy.
  paymentTerms: "{{TODO: deposit/invoice terms, e.g. \"A deposit is due before work begins, with the balance invoiced on completion.\"}}",
  liabilityLimitation: "{{TODO: a liability limitation appropriate for your business — e.g. \"ZeroPoint's liability for any engagement is limited to the amount paid for that engagement.\" A lawyer should confirm this is appropriate for your situation.}}",
  jurisdiction: "{{TODO: your state/jurisdiction, if you want to specify one}}",
  legalPublishDate: "{{TODO: date you publish the Privacy/Terms pages}}",
}

// Static export — form submissions go straight to a third-party endpoint
// from the browser, no backend of your own required. Formspree
// (https://formspree.io) and Web3Forms (https://web3forms.com) both work
// with a plain POST of JSON to a form-specific URL: sign up, create a
// form, and paste its endpoint below. See TODO-CONTENT.md.
export const FORM_ENDPOINT: string | null = null // {{TODO: Formspree/Web3Forms endpoint URL}}

// Named separately so the Privacy page can say which service processes
// submissions without hardcoding it — set this alongside FORM_ENDPOINT.
export const FORM_SERVICE_NAME: string | null = null
export const FORM_SERVICE_PLACEHOLDER = "{{TODO: form service name, e.g. Formspree or Web3Forms}}"

// Cal.com (or similar) scheduling link. Leave null to hide the booking
// link on the Contact page until you have one.
export const BOOKING_URL: string | null = null // {{TODO: booking link, e.g. Cal.com}}

// How many business days you commit to replying within — shown on the
// Contact page's "what happens next" block.
export const RESPONSE_DAYS = "{{TODO: reply time in business days, e.g. 1-2}}"

// Publish these only after adding real, approved client content.
export const SHOW_CLIENT_WORK = false
export const SHOW_TESTIMONIALS = false

export const OWNER = {
  name: "Harrison Lurgio",
  bio: "I've spent the past year working on an IT help desk, solving everyday tech problems for real people. I started ZeroPoint to bring that experience to my own business, and to build something that helps people get started in IT and keep growing in it.",
  photoPlaceholder: "{{TODO: add your photo at public/about/headshot.jpg}}",
}
export const TIKTOK = {
  handle: "{{TODO: TikTok handle}}",
  url: null as string | null, // {{TODO: TikTok profile URL}}
}
