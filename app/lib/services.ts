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
  | "homelab-build"
  | "self-hosted-apps"
  | "remote-help"

export type ServiceAudience = "home" | "business" | "homelab"

export type PricingUnit = "project" | "hour" | "app" | "month"

export type ServicePricing = {
  // null means a starting price hasn't been set yet — render as a TODO,
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
// TODO placeholder where a starting price hasn't been set yet.
export const SERVICE_OFFERINGS: ServiceOffering[] = [
  // Home
  {
    id: "home-network-setup",
    audience: "home",
    title: "Home Network Setup",
    short: "Gateway, switching, Wi-Fi, and cameras",
    description: "Plan and configure a home network around the property, devices, and security boundaries you actually need.",
    signs: ["Wi-Fi drops or needs constant rebooting", "You don't know what's actually connected to your network", "Smart devices and personal computers share the same network"],
    includes: ["Gateway and router setup", "Switch and access-point setup", "Guest and IoT separation", "Configuration handoff"],
    delivery: "Local or remote",
    pricing: { from: 400, unit: "project", note: "Labor only — hardware is separate. Scales with device count." },
  },
  {
    id: "wifi-planning",
    audience: "home",
    title: "Wi-Fi Planning",
    short: "Coverage, placement, and troubleshooting",
    description: "Improve weak coverage, roaming, channel use, and access-point placement without buying hardware blindly.",
    signs: ["Dead zones in specific rooms or floors", "Video calls freeze or drop when you move around", "You're not sure if another access point would even help"],
    includes: ["Current-state review", "Access-point placement plan", "SSID and channel strategy", "Post-install validation"],
    delivery: "Local or remote",
    pricing: { from: 150, unit: "project", note: "Remote review; on-site site survey starts from $300." },
  },
  {
    id: "iot-camera-separation",
    audience: "home",
    title: "IoT & Camera Separation",
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
    title: "Monthly Support",
    short: "Ongoing help, billed monthly",
    description: "An optional standing arrangement for businesses that want ongoing access to help instead of booking a new project every time.",
    signs: ["You'd rather have an ongoing arrangement than one-off projects", "Small issues come up often enough to justify a standing plan", "You want a known monthly cost instead of surprise invoices"],
    includes: ["Scoped monthly hours", "Priority scheduling", "Rollover terms defined upfront"],
    delivery: "Remote",
    pricing: { from: null, unit: "month", note: "Optional — not required to work together. Priced after a quick scope review." },
  },
  // Homelab
  {
    id: "homelab-build",
    audience: "homelab",
    title: "Homelab Build",
    short: "Mini PCs, racks, Proxmox, and networking",
    description: "Turn a list of goals into a documented, maintainable lab that has room to grow.",
    signs: ["Hardware sitting around still unconfigured", "You want to self-host but don't know where to start", "Your \"server\" is a laptop under a desk with no backup plan"],
    includes: ["Workload and hardware plan", "Rack and network layout", "Proxmox installation", "Build documentation"],
    delivery: "Local or remote",
    pricing: { from: 500, unit: "project", note: "Typical build runs 5–12 hours depending on scope." },
  },
  {
    id: "self-hosted-apps",
    audience: "homelab",
    title: "Self-Hosted Apps",
    short: "Deploy services without losing ownership",
    description: "Install common self-hosted services with sensible storage, access, update, and backup foundations.",
    signs: ["You want to run Immich, Nextcloud, or similar without fighting Docker all day", "You're not sure your VM is sized correctly", "You have no update or backup plan for what you're already running"],
    includes: ["Workload sizing", "Container or VM deployment", "Access and update plan", "Backup recommendations"],
    delivery: "Remote",
    pricing: { from: 75, unit: "app", note: "Per service deployed; bundles of 3+ apps cost less per app." },
  },
  // General
  {
    id: "remote-help",
    audience: "business",
    title: "Remote Help",
    short: "Planning and troubleshooting sessions",
    description: "Get a second set of eyes on a design, broken deployment, hardware decision, or upgrade path.",
    signs: ["You're stuck mid-project and need a second opinion", "You want a sanity check before buying hardware", "Something broke and you're not sure why"],
    includes: ["Pre-call project review", "Focused working session", "Written next steps", "Parts or topology notes"],
    delivery: "Remote",
    pricing: { from: 100, unit: "hour", note: "Most sessions run about an hour." },
  },
]

export function offeringsFor(audience: ServiceAudience): ServiceOffering[] {
  return SERVICE_OFFERINGS.filter((service) => service.audience === audience)
}

export function formatServicePrice(pricing: ServicePricing): string {
  if (pricing.from === null) return "Quote on request"
  if (pricing.unit === "hour") return `From $${pricing.from}/hr`
  if (pricing.unit === "app") return `From $${pricing.from}/app`
  if (pricing.unit === "month") return `From $${pricing.from}/mo`
  return `From $${pricing.from}`
}

export const PROJECT_GOALS = [
  "Better Wi-Fi coverage",
  "Secure guest and IoT networks",
  "Build a Proxmox server",
  "Create a 10-inch mini rack",
  "Deploy self-hosted apps",
  "Clean up an existing network",
  "Plan hardware before buying",
] as const
