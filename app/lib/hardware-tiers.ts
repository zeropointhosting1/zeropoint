// Curated mini-PC tiers the Sizer matches results against — the same
// families already surfaced on /deals. maxRamGb is each model's official
// spec-sheet ceiling (verified 2026-09-23, sources cited per tier below);
// several are known to run more with a BIOS update and unofficial 32GB
// SO-DIMMs, but that's not the number used here since it isn't guaranteed
// to work on every unit. nvmeSlots counts slots that are actually usable
// for storage on a stock unit — several of these models have a second M.2
// slot that's WLAN-only or unpopulated by default, not a second drive bay.
// All five share a 6-core/6-thread CPU class, which is what actually caps
// how much fits on a single node.
export type HardwareTier = {
  id: string
  name: string
  cpu: string
  cores: number
  maxRamGb: number
  nvmeSlots: number
  quickSync: string
  // Which /deals filter category actually surfaces this family — HP
  // EliteDesk and Lenovo/Dell aren't the same eBay search category.
  dealsCategory: "HP EliteDesk" | "Mini PCs"
  // ZeroPoint's own idle-draw estimate for this class of mini PC, in watts
  // — not a manufacturer figure. Used only for the Sizer's power-cost
  // estimate, and it's a rough number: actual draw depends on drives,
  // idle-vs-loaded VM count, and BIOS power settings.
  typicalIdleWatts: number
  // One sentence on why this family specifically, for /deals' "Why this
  // model" cards — shared with the Sizer so the pitch stays consistent.
  whyItWorks: string
  note?: string
}

export const HARDWARE_TIERS: HardwareTier[] = [
  {
    id: "elitedesk-800-g4-mini",
    name: "HP EliteDesk 800 G4 Mini",
    cpu: "Intel i5-8500T",
    cores: 6,
    // 32GB per HP's Maintenance and Service Guide (c06063157). It has a
    // second M.2 socket (2230 form factor), but that's the WLAN slot on a
    // stock unit — https://www.servethehome.com/hp-elitedesk-800-g4-mini-tinyminimicro-guide-review/
    maxRamGb: 32,
    nvmeSlots: 1,
    quickSync: "8th-gen UHD 630",
    dealsCategory: "HP EliteDesk",
    typicalIdleWatts: 12,
    whyItWorks: "The default pick — cheap and plentiful on the used market, and exactly what runs the ZeroPoint lab.",
    note: "What pve01 and pve02 run in the ZeroPoint lab.",
  },
  {
    id: "elitedesk-800-g5-mini",
    name: "HP EliteDesk 800 G5 Mini",
    cpu: "Intel i5-9500T",
    cores: 6,
    // Same layout as the G4 — one usable NVMe M.2 slot, second M.2 socket
    // is WLAN. https://h30434.www3.hp.com (HP Support Community, EliteDesk
    // 800 G5 M.2 specs thread) and hardware-corner.net's G5 Mini spec page.
    maxRamGb: 32,
    nvmeSlots: 1,
    quickSync: "9th-gen UHD 630",
    dealsCategory: "HP EliteDesk",
    typicalIdleWatts: 12,
    whyItWorks: "A newer CPU generation than the G4 for close to the same used price, when you can find one.",
  },
  {
    id: "lenovo-m720q",
    name: "Lenovo ThinkCentre M720q",
    cpu: "Intel i5-8500T",
    cores: 6,
    // Ships with one populated NVMe M.2 slot; a second slot exists on the
    // board but is unpopulated/needs a resistor mod to use, so it isn't
    // counted here. Shares its Tiny5 chassis (and PCIe x4 riser slot) with
    // the M920q below, not exclusive to this model as an earlier version
    // of this file claimed. https://www.servethehome.com/lenovo-thinkcentre-m720q-tinyminimicro-feature/
    maxRamGb: 32,
    nvmeSlots: 1,
    quickSync: "8th-gen UHD 630",
    dealsCategory: "Mini PCs",
    typicalIdleWatts: 11,
    whyItWorks: "The one to pick if you want a 2.5GbE NIC or capture card later via its PCIe riser slot — same option the M920q has, but the EliteDesks and OptiPlex don't.",
    note: "Has a spare low-profile PCIe x4 slot (via riser) most Minis don't.",
  },
  {
    id: "lenovo-m920q",
    name: "Lenovo ThinkCentre M920q",
    cpu: "Intel i5-9500T",
    cores: 6,
    // Corrected from an earlier, wrong 64GB/2-slot claim in this file.
    // Lenovo's own spec sheet lists 32GB max (two SO-DIMM slots, one
    // 16GB stick each); the second M.2 socket is WLAN-reserved, same as
    // the EliteDesks. Some units run 64GB with a BIOS update and
    // unofficial 32GB SO-DIMMs, but that's not guaranteed across units,
    // so it's not what's shown here. Same PCIe x4 riser slot as the
    // M720q (shared Tiny5 chassis). Sources: Lenovo PSREF ThinkCentre
    // M920 Tiny spec sheet; pcsupport.lenovo.com memory reference guide;
    // servethehome.com M920/M920q guide.
    maxRamGb: 32,
    nvmeSlots: 1,
    quickSync: "9th-gen UHD 630",
    dealsCategory: "Mini PCs",
    typicalIdleWatts: 13,
    whyItWorks: "Same PCIe riser option as the M720q, with a newer CPU generation — some units run 64 GB RAM with a BIOS update, though that's not the guaranteed spec.",
    note: "Shares the M720q's PCIe x4 riser slot.",
  },
  {
    id: "optiplex-micro",
    name: "Dell OptiPlex 7060 Micro",
    cpu: "Intel i5-8500T",
    cores: 6,
    // One M.2 PCIe NVMe slot, 32GB DDR4 max — Dell's own OptiPlex 7060
    // Micro Setup and Specifications Guide (dell.com/support/manuals).
    maxRamGb: 32,
    nvmeSlots: 1,
    quickSync: "8th-gen UHD 630",
    dealsCategory: "Mini PCs",
    typicalIdleWatts: 10,
    whyItWorks: "Usually the cheapest of the five on the used market, with the same core spec as the EliteDesk G4.",
  },
]

export type HardwareMatch = { tier: HardwareTier; nodes: number }

// Picks the smallest single unit that fits; if nothing fits on one node,
// falls back to the highest-capacity tier and estimates a small cluster —
// the same shape as the real lab (two EliteDesk Minis), not a single huge box.
export function matchHardware(cores: number, ramGb: number): HardwareMatch {
  const fit = HARDWARE_TIERS.find((tier) => cores <= tier.cores && ramGb <= tier.maxRamGb)
  if (fit) return { tier: fit, nodes: 1 }

  const largest = HARDWARE_TIERS.reduce((a, b) => (b.maxRamGb > a.maxRamGb ? b : a))
  const nodesForRam = Math.ceil(ramGb / largest.maxRamGb)
  const nodesForCores = Math.ceil(cores / largest.cores)
  return { tier: largest, nodes: Math.max(2, nodesForRam, nodesForCores) }
}
