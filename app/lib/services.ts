export type ServiceId = "unifi" | "wifi" | "homelab" | "self-hosting" | "consulting"

export type PricingUnit = "project" | "hour" | "app"

export type ServicePricing = {
  from: number
  unit: PricingUnit
  note: string
}

export type ServiceOffering = {
  id: ServiceId
  title: string
  short: string
  description: string
  signs: string[]
  includes: string[]
  delivery: "Local" | "Remote" | "Local or remote"
  pricing: ServicePricing
}

// Starting prices, not final quotes — actual scope (device count, property
// size, app count) moves the number. Shown as "From $X" everywhere.
export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    id: "unifi",
    title: "UniFi Setup",
    short: "Gateway, switching, Wi-Fi, and cameras",
    description: "Plan and configure a UniFi environment around the property, devices, and security boundaries you actually need.",
    signs: ["Wi-Fi drops or needs constant rebooting", "You don't know what's actually connected to your network", "Smart devices and personal computers share the same broadcast domain"],
    includes: ["Controller and gateway setup", "Switch and access-point adoption", "Guest and IoT segmentation", "Configuration handoff"],
    delivery: "Local or remote",
    pricing: { from: 400, unit: "project", note: "Labor only — hardware is separate. Scales with device count." },
  },
  {
    id: "wifi",
    title: "Wi-Fi Planning",
    short: "Coverage, placement, and troubleshooting",
    description: "Improve weak coverage, roaming, channel use, and access-point placement without buying hardware blindly.",
    signs: ["Dead zones in specific rooms or floors", "Video calls freeze or drop when you move around", "You're not sure if another access point would even help"],
    includes: ["Current-state review", "Access-point placement plan", "SSID and channel strategy", "Post-install validation"],
    delivery: "Local or remote",
    pricing: { from: 150, unit: "project", note: "Remote review; on-site site survey starts from $300." },
  },
  {
    id: "homelab",
    title: "Homelab Build",
    short: "Mini PCs, racks, Proxmox, and networking",
    description: "Turn a list of goals into a documented, maintainable lab that has room to grow.",
    signs: ["Hardware sitting around still unconfigured", "You want to self-host but don't know where to start", "Your \"server\" is a laptop under a desk with no backup plan"],
    includes: ["Workload and hardware plan", "Rack and network layout", "Proxmox installation", "Build documentation"],
    delivery: "Local or remote",
    pricing: { from: 500, unit: "project", note: "Typical build runs 5–12 hours depending on scope." },
  },
  {
    id: "self-hosting",
    title: "Self-Hosted Apps",
    short: "Deploy services without losing ownership",
    description: "Install common self-hosted services with sensible storage, access, update, and backup foundations.",
    signs: ["You want to run Immich, Nextcloud, or similar without fighting Docker all day", "You're not sure your VM is sized correctly", "You have no update or backup plan for what you're already running"],
    includes: ["Workload sizing", "Container or VM deployment", "Access and update plan", "Backup recommendations"],
    delivery: "Remote",
    pricing: { from: 75, unit: "app", note: "Per service deployed; bundles of 3+ apps cost less per app." },
  },
  {
    id: "consulting",
    title: "Remote Help",
    short: "Planning and troubleshooting sessions",
    description: "Get a second set of eyes on a design, broken deployment, hardware decision, or upgrade path.",
    signs: ["You're stuck mid-project and need a second opinion", "You want a sanity check before buying hardware", "Something broke and you're not sure why"],
    includes: ["Pre-call project review", "Focused working session", "Written next steps", "Parts or topology notes"],
    delivery: "Remote",
    pricing: { from: 100, unit: "hour", note: "Most sessions run about an hour." },
  },
]

export function formatServicePrice(pricing: ServicePricing): string {
  if (pricing.unit === "hour") return `From $${pricing.from}/hr`
  if (pricing.unit === "app") return `From $${pricing.from}/app`
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
