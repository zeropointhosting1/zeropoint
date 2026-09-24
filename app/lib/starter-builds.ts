// Rack Planner v1 — three fixed, real builds instead of a visual designer
// (that's still "planned", see components/deals/rack-builder-preview.tsx).
// Prices and idle-watt figures are ZeroPoint's own estimates based on
// typical used-market pricing and published idle-draw figures for this
// class of gear — not a live quote. Refresh by hand against /deals
// occasionally; a build's real total will drift with the used market.
export type BuildPart = {
  role: string
  item: string
  priceUsd: number
  idleWatts: number
}

export type StarterBuild = {
  id: string
  name: string
  targetPriceLabel: string
  tagline: string
  parts: BuildPart[]
  rackUnits: { unit: string; label: string }[]
  goodFor: string[]
  // Rough ceiling this build comfortably clears for the Sizer's "Total to
  // provision" RAM figure — used only to suggest a starting build, not a
  // hard rule.
  suggestedForRamGb: number
}

export const STARTER_BUILDS: StarterBuild[] = [
  {
    id: "starter-300",
    name: "Starter",
    targetPriceLabel: "~$300",
    tagline: "One node — enough to learn Proxmox and run a handful of light services.",
    parts: [
      { role: "Compute", item: "1x HP EliteDesk 800 G4 Mini (i5-8500T, 16 GB RAM, 256 GB SSD)", priceUsd: 170, idleWatts: 12 },
      { role: "Switch", item: "UniFi Flex Mini (5-port)", priceUsd: 30, idleWatts: 3 },
      { role: "Rack", item: "10-inch open-frame rack or shelf", priceUsd: 45, idleWatts: 0 },
      { role: "Cabling & misc", item: "Patch cables, power strip", priceUsd: 25, idleWatts: 0 },
    ],
    rackUnits: [
      { unit: "2U", label: "EliteDesk 800 G4 Mini" },
      { unit: "1U", label: "UniFi Flex Mini" },
    ],
    goodFor: ["Pi-hole or AdGuard Home", "Vaultwarden", "Uptime Kuma", "Learning Proxmox basics"],
    suggestedForRamGb: 16,
  },
  {
    id: "starter-600",
    name: "Core",
    targetPriceLabel: "~$600",
    tagline: "Two nodes for real redundancy and headroom — the same shape as the ZeroPoint lab.",
    parts: [
      { role: "Compute", item: "2x HP EliteDesk 800 G4 Mini (i5-8500T, 16 GB RAM, 256 GB SSD)", priceUsd: 340, idleWatts: 24 },
      { role: "Gateway", item: "UniFi Cloud Gateway Ultra", priceUsd: 130, idleWatts: 9 },
      { role: "Switch", item: "UniFi Flex Mini (5-port)", priceUsd: 30, idleWatts: 3 },
      { role: "Rack", item: "10-inch rack with shelf", priceUsd: 65, idleWatts: 0 },
      { role: "Cabling & misc", item: "Patch cables, power strip", priceUsd: 35, idleWatts: 0 },
    ],
    rackUnits: [
      { unit: "4U", label: "Patch + cabling" },
      { unit: "3U", label: "UniFi Cloud Gateway Ultra" },
      { unit: "2U", label: "EliteDesk 800 G4 Mini" },
      { unit: "1U", label: "EliteDesk 800 G4 Mini" },
    ],
    goodFor: ["A 2-node Proxmox cluster", "Home Assistant OS", "Immich at the recommended tier", "A couple of self-hosted apps at once"],
    suggestedForRamGb: 40,
  },
  {
    id: "starter-1000",
    name: "Expanded",
    targetPriceLabel: "~$1,000",
    tagline: "Three nodes plus dedicated storage — room to run media, photos, and automation together.",
    parts: [
      { role: "Compute", item: "3x HP EliteDesk 800 G4/G5 Mini (i5, 32 GB RAM, 512 GB NVMe)", priceUsd: 630, idleWatts: 36 },
      { role: "Storage", item: "USB3 HDD enclosure (bring your own drives)", priceUsd: 60, idleWatts: 6 },
      { role: "Gateway", item: "UniFi Cloud Gateway Ultra", priceUsd: 130, idleWatts: 9 },
      { role: "Switch", item: "UniFi Switch Lite 8 PoE", priceUsd: 110, idleWatts: 15 },
      { role: "Rack", item: "10-inch rack with shelf and patch panel", priceUsd: 95, idleWatts: 0 },
      { role: "Cabling & misc", item: "Patch cables, power strip, labels", priceUsd: 35, idleWatts: 0 },
    ],
    rackUnits: [
      { unit: "6U", label: "UniFi Switch Lite 8 PoE" },
      { unit: "5U", label: "UniFi Cloud Gateway Ultra" },
      { unit: "4U", label: "USB3 storage enclosure" },
      { unit: "3U", label: "EliteDesk Mini" },
      { unit: "2U", label: "EliteDesk Mini" },
      { unit: "1U", label: "EliteDesk Mini" },
    ],
    goodFor: ["A 3-node Proxmox cluster", "Plex or Jellyfin alongside Immich", "Frigate with an accelerator", "Several people's worth of self-hosted services"],
    suggestedForRamGb: Infinity,
  },
]

export function buildTotalUsd(build: StarterBuild): number {
  return build.parts.reduce((sum, part) => sum + part.priceUsd, 0)
}

export function buildIdleWatts(build: StarterBuild): number {
  return build.parts.reduce((sum, part) => sum + part.idleWatts, 0)
}

// Picks the smallest build whose ceiling covers the given RAM total —
// used to highlight a starting point coming from the Sizer's results.
export function suggestBuildForRamGb(ramGb: number): StarterBuild {
  return STARTER_BUILDS.find((build) => ramGb <= build.suggestedForRamGb) ?? STARTER_BUILDS[STARTER_BUILDS.length - 1]
}
