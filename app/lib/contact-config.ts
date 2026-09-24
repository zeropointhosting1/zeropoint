// Static export — form submissions go straight to a third-party endpoint
// from the browser, no backend of your own required. Formspree
// (https://formspree.io) and Web3Forms (https://web3forms.com) both work
// with a plain POST of JSON to a form-specific URL: sign up, create a
// form, and paste its endpoint below. See TODO-CONTENT.md.
export const FORM_ENDPOINT: string | null = null // {{TODO: Formspree/Web3Forms endpoint URL}}

// Named separately so the Privacy page can say which service processes
// submissions without hardcoding it — set this alongside FORM_ENDPOINT.
export const FORM_SERVICE_NAME: string | null = null // {{TODO: e.g. "Formspree" or "Web3Forms"}}

// Cal.com (or similar) scheduling link. Leave null to hide the booking
// link on the Contact page until you have one.
export const BOOKING_URL: string | null = null // {{TODO: booking link, e.g. Cal.com}}

// How many business days you commit to replying within — shown on the
// Contact page's "what happens next" block.
export const RESPONSE_DAYS = "{{TODO: reply time in business days, e.g. 1-2}}"
