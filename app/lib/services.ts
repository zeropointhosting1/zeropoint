import { NETWORK_CARE_FEATURES } from "./support-plans"

export type ServiceId =
  | "home-network-setup"
  | "wifi-planning"
  | "iot-camera-separation"
  | "office-wifi"
  | "guest-device-separation"
  | "firewall-remote-access"
  | "backups"
  | "onboarding-offboarding"
  | "monthly-support"
  | "remote-help"
  | "onsite-help"
  | "business-website"
  | "restaurant-website"
  | "business-dashboard"
  | "website-care"

export type ServiceAudience = "home" | "business" | "web" | "support"

export type PricingUnit = "project" | "hour" | "app" | "month"

export type ServicePricing = {
  // null means a starting price has not been set — show Quote on request,
  // never invent a number. See TODO-CONTENT.md.
  from: number | null
  unit: PricingUnit
  note: string
}

export type ServiceOffering = {
  id: ServiceId
  audience: ServiceAudience
  title: string
  short: string
  description: string
  signs: string[]
  includes: string[]
  delivery: "Local" | "Remote" | "Local or remote"
  pricing: ServicePricing
}

// Starting prices, not final quotes — actual scope (device count, property
// size, app count) moves the number. Shown as "From $X" everywhere, or a
// Quote on request where a starting price has not been set yet.
export const SERVICE_OFFERINGS: ServiceOffering[] = [
  // Home
  {
    id: "home-network-setup",
    audience: "home",
    title: "Home Network / UniFi Installation",
    short: "UniFi gateways, switches, and access points",
    description: "Plan and configure a home network around the property, devices, and security boundaries you actually need.",
    signs: ["Wi-Fi drops or needs constant rebooting", "You don't know what's actually connected to your network", "Smart devices and personal computers share the same network"],
    includes: ["Gateway and router setup", "Switch and access-point setup", "Guest and IoT separation", "Configuration handoff"],
    delivery: "Local or remote",
    pricing: { from: null, unit: "project", note: "Custom quote based on equipment, property size, cabling, and number of access points." },
  },
  {
    id: "wifi-planning",
    audience: "home",
    title: "Wi-Fi Assessment",
    short: "Coverage, placement, and troubleshooting",
    description: "Improve weak coverage, roaming, channel use, and access-point placement without buying hardware blindly.",
    signs: ["Dead zones in specific rooms or floors", "Video calls freeze or drop when you move around", "You're not sure if another access point would even help"],
    includes: ["Current-state review", "Access-point placement plan", "SSID and channel strategy", "Post-install validation"],
    delivery: "Local or remote",
    pricing: { from: 99, unit: "project", note: "Can be credited toward an installation. Final scope and pricing confirmed before work." },
  },
  {
    id: "iot-camera-separation",
    audience: "home",
    title: "Smart Device & Camera Safety",
    short: "Keep smart devices away from what matters",
    description: "Put smart plugs, cameras, and other IoT devices on their own network so they can't reach your personal computers and private files.",
    signs: ["Cheap smart devices sitting on the same network as your work laptop", "You want cameras without exposing them to the internet", "You don't know what a device could reach if it were compromised"],
    includes: ["Separate IoT and camera network", "Least-access firewall rules", "Remote camera access without public exposure", "Configuration handoff"],
    delivery: "Local or remote",
    pricing: { from: null, unit: "project", note: "Usually paired with Home Network Setup — priced after a quick scope review." },
  },
  // Small business
  {
    id: "office-wifi",
    audience: "business",
    title: "Office Network & Wi-Fi",
    short: "Reliable coverage for staff and customers",
    description: "Plan and set up office Wi-Fi and wired networking sized for how many people and devices actually use it.",
    signs: ["Wi-Fi that's fine for five people and terrible for fifteen", "Dead zones in parts of the office or floor", "No one remembers how the network was set up"],
    includes: ["Coverage and hardware plan", "Gateway, switch, and AP setup", "Wired drops where needed", "Configuration handoff"],
    delivery: "Local or remote",
    pricing: { from: null, unit: "project", note: "Scales with office size and device count — priced after a quick scope review." },
  },
  {
    id: "guest-device-separation",
    audience: "business",
    title: "Guest & Device Separation",
    short: "Staff, guests, and POS/cameras on separate networks",
    description: "Give customers guest Wi-Fi, keep staff devices separate, and isolate POS terminals and cameras from everything else.",
    signs: ["Customers are on the same network as your POS system", "You don't have a separate guest network at all", "A compromised device could reach files or payment systems it shouldn't"],
    includes: ["Staff / guest / device network separation", "POS and camera isolation", "Guest network with no internal access", "Firewall rules between segments"],
    delivery: "Local or remote",
    pricing: { from: null, unit: "project", note: "Priced after a quick scope review." },
  },
  {
    id: "firewall-remote-access",
    audience: "business",
    title: "Firewall & Remote Access",
    short: "Control what's exposed, and who can get in remotely",
    description: "Configure the firewall and a proper remote-access method so staff can connect without exposing the network to the internet.",
    signs: ["Something was port-forwarded years ago and no one remembers why", "Staff need remote access and are using something ad hoc", "You're not sure what's reachable from outside your network"],
    includes: ["Firewall rule review and cleanup", "VPN or remote-access setup", "Documented access list", "Configuration handoff"],
    delivery: "Local or remote",
    pricing: { from: null, unit: "project", note: "Priced after a quick scope review." },
  },
  {
    id: "backups",
    audience: "business",
    title: "Backups",
    short: "A real, tested backup plan",
    description: "Set up automated backups for the systems that would actually hurt to lose, and confirm they can be restored.",
    signs: ["Backups exist but no one has tested a restore", "Some machines are backed up and others aren't", "A single failed drive would set you back weeks"],
    includes: ["Backup scope and schedule", "Automated backup setup", "Restore test", "Documentation"],
    delivery: "Local or remote",
    pricing: { from: null, unit: "project", note: "Priced after a quick scope review." },
  },
  {
    id: "onboarding-offboarding",
    audience: "business",
    title: "Onboarding / Offboarding & Account Hygiene",
    short: "Microsoft 365 / Google Workspace account setup",
    description: "Set up a repeatable process for adding and removing staff accounts, and clean up access that should have been revoked already.",
    signs: ["Former employees might still have access to something", "Setting up a new hire's accounts takes longer than it should", "No one is sure who owns which admin accounts"],
    includes: ["Account audit", "Onboarding / offboarding checklist", "Admin and ownership review", "Documentation"],
    delivery: "Remote",
    pricing: { from: null, unit: "project", note: "Priced after a quick scope review." },
  },
  {
    id: "monthly-support",
    audience: "business",
    title: "Network Care",
    short: "Optional care after your network installation",
    description: "Optional network monitoring, updates, configuration backups, and scoped troubleshooting after ZeroPoint installs your network.",
    signs: ["You'd rather have an ongoing arrangement than one-off projects", "Small issues come up often enough to justify a standing plan", "You want a known monthly cost instead of surprise invoices"],
    includes: [...NETWORK_CARE_FEATURES],
    delivery: "Remote",
    pricing: { from: null, unit: "month", note: "Monthly scope and support time agreed before work. Additional work quoted separately." },
  },
  // On-demand support for homes and small businesses.
  {
    id: "remote-help", audience: "support", title: "Remote Tech Help", short: "Computer, email, printer, and software help",
    description: "For problems that can be solved without a visit, get focused help through a connection you authorize.",
    signs: ["Email or software stopped working", "You need help with a computer or account", "You want guidance setting up a device"],
    includes: ["Authorized remote session", "Focused troubleshooting", "Explanation and next steps"], delivery: "Remote",
    pricing: { from: 75, unit: "hour", note: "30-minute minimum. Final pricing confirmed before work begins." },
  },
  {
    id: "onsite-help", audience: "support", title: "On-Site Tech Help", short: "Hands-on help at your home or business",
    description: "Computer setup, printer problems, smart TVs, and everyday troubleshooting in the local service area.",
    signs: ["Your printer will not connect", "You bought a new computer or device", "The problem needs a hands-on visit"],
    includes: ["Local visit by appointment", "Device setup or troubleshooting", "Walkthrough of what changed"], delivery: "Local",
    pricing: { from: 100, unit: "hour", note: "1-hour minimum. Visit availability and final pricing confirmed before work." },
  },
  // Websites & dashboards
  {
    id: "restaurant-website",
    audience: "web",
    title: "Restaurant Website",
    short: "Menu, hours, location, and ordering links",
    description: "A fast, mobile-first site built around what diners actually look for: the menu, today's hours, where you are, and how to order or book.",
    signs: ["Your menu is a blurry PDF or a photo of the printed one", "Hours on Google, Yelp, and your site don't match", "Most visitors are on a phone and the site is hard to use on one"],
    includes: ["Menu page that's easy to update", "Hours, location, and map", "Online ordering and reservation links", "Domain, hosting, and Google Business Profile setup"],
    delivery: "Remote",
    pricing: { from: null, unit: "project", note: "Scales with page count and menu size — priced after a quick scope review." },
  },
  {
    id: "business-website",
    audience: "web",
    title: "Small Business Website",
    short: "A clean, fast site you actually own",
    description: "A straightforward site that explains what you do, where you are, and how to reach you — on a domain and hosting account in your name.",
    signs: ["You don't have a website, or it's years out of date", "The person who built it is gone and no one can log in", "Customers can't find your hours, services, or contact info"],
    includes: ["Page structure and copy help", "Mobile-first design", "Contact form or booking link", "Domain and hosting in your name"],
    delivery: "Remote",
    pricing: { from: null, unit: "project", note: "Scales with page count — priced after a quick scope review." },
  },
  {
    id: "business-dashboard",
    audience: "web",
    title: "Business Dashboard add-on",
    short: "Sales, labor, and inventory at a glance",
    description: "One screen that pulls the numbers you check every day out of your POS, spreadsheets, or other systems, so you're not piecing them together by hand.",
    signs: ["You export reports from three places to answer one question", "End-of-day numbers live in a spreadsheet someone updates manually", "You want to see today's sales or labor without logging into the POS"],
    includes: ["Data source review (POS, spreadsheets, etc.)", "Dashboard for owners and managers", "Access controls per person", "Documentation of where every number comes from"],
    delivery: "Remote",
    pricing: { from: null, unit: "project", note: "Depends on which systems the data comes from — priced after a quick scope review." },
  },
  {
    id: "website-care",
    audience: "web",
    title: "Website Care",
    short: "Menu changes, updates, and renewals handled",
    description: "An optional monthly arrangement for keeping the site current — menu and hours changes, updates, and making sure the domain never lapses.",
    signs: ["Menu or hours change often and updating the site is a chore", "You're worried the domain or hosting will quietly expire", "You'd rather send a text than log into a website editor"],
    includes: ["Menu, hours, and content updates", "Domain and hosting renewals tracked", "Uptime checks", "Dashboard tweaks as needs change"],
    delivery: "Remote",
    pricing: { from: null, unit: "month", note: "Optional — the site and dashboard are yours either way. Priced after a quick scope review." },
  },
]

export function offeringsFor(audience: ServiceAudience): ServiceOffering[] {
  return SERVICE_OFFERINGS.filter((service) => service.audience === audience)
}

export function formatServicePrice(pricing: ServicePricing): string {
  if (pricing.from === null) return "Custom quote"
  if (pricing.unit === "hour") return `Starting around $${pricing.from}/hr`
  if (pricing.unit === "app") return `Starting around $${pricing.from}/app`
  if (pricing.unit === "month") return `Starting around $${pricing.from}/mo`
  return `Starting around $${pricing.from}`
}
