// Shared pricing guidance. Confirm final scope and pricing before work.
export const STARTING_PRICES = [
  { id: "remote", name: "Remote Tech Help", price: "Starting around $75/hour", note: "30-minute minimum", href: "/tech-support#remote" },
  { id: "onsite", name: "On-Site Tech Help", price: "Starting around $100/hour", note: "1-hour minimum", href: "/tech-support#onsite" },
  { id: "assessment", name: "Wi-Fi Assessment", price: "Starting around $99", note: "Can be credited toward an installation", href: "/home-networking" },
] as const
export const NETWORK_CARE_FEATURES = ["Network health monitoring", "Firmware and update management", "Configuration backups", "Remote troubleshooting", "Periodic network checkups", "Documentation updates"]
