// Real business facts used in structured data (JSON-LD) and the Contact
// page. Kept in one place so nothing has to be re-typed, and so it's
// obvious what's still a placeholder — see TODO-CONTENT.md.
export const BUSINESS_INFO = {
  name: "{{TODO: your name or business name}}",
  email: "{{TODO: contact email}}",
  telephone: "{{TODO: phone (optional, leave blank to omit)}}",
  city: "Boca Raton, FL",
  areaServed: "{{TODO: on-site service area — e.g. \"Boca Raton and X miles\" or a list of counties}}",
  yearsInIt: "{{TODO: years of IT/networking experience}}",
  credentialLine: "{{TODO: a confident one-line credential — e.g. current role, years of experience, or what you've built}}",
  certifications: [] as string[], // {{TODO: certifications, if any — leave empty to omit the row}}
  // Legal — used by /services (payment FAQ) and /terms, /privacy.
  paymentTerms: "{{TODO: deposit/invoice terms, e.g. \"A deposit is due before work begins, with the balance invoiced on completion.\"}}",
  liabilityLimitation: "{{TODO: a liability limitation appropriate for your business — e.g. \"ZeroPoint's liability for any engagement is limited to the amount paid for that engagement.\" A lawyer should confirm this is appropriate for your situation.}}",
  jurisdiction: "{{TODO: your state/jurisdiction, if you want to specify one}}",
  legalPublishDate: "{{TODO: date you publish the Privacy/Terms pages}}",
}
