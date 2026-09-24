// Pure sizing math for the Workload Sizer — kept separate from the UI
// component so it can be unit tested directly with `node --test` (no
// framework needed, see sizing-math.test.ts).

// Summing every app's own vCPU allocation and treating the total as
// physical cores is what pushed a realistic 5-app "heavy" selection to 39
// vCPU — nowhere near what the ZeroPoint lab (two 6-core Minis) actually
// runs. VMs rarely peg their vCPUs simultaneously, so hosts are routinely
// oversubscribed; a documented 3.5x vCPU:physical-core ratio (the middle of
// the commonly cited 3-4x range for general-purpose workloads) converts the
// summed vCPU total into a realistic physical-core recommendation.
export const CPU_OVERCOMMIT_RATIO = 3.5

export function estimatePhysicalCores(cpus: number[]): number {
  if (cpus.length === 0) return 0
  const sum = cpus.reduce((total, cpu) => total + cpu, 0)
  return Math.max(2, Math.ceil(sum / CPU_OVERCOMMIT_RATIO))
}

export type RedundancyMode = "single" | "mirror"

// Photo/media libraries and their growth are user-provided, separate from
// the sourced per-app VM storage totals — mirroring simply doubles capacity
// (RAID1/ZFS mirror usable-space math), not a full backup strategy.
// appDrivenGb is the sum of selected workloads' own cache/recording
// buffers (Immich thumbnails, Plex/Jellyfin transcode cache, Frigate
// recordings — see WorkloadRequirement.dataPortionGb) — it grows the same
// way a media library does, so it goes through the same growth/redundancy
// math rather than sitting in the System disk total.
export function dataStorageNeededGb(photosGb: number, mediaGb: number, appDrivenGb: number, growthPct: number, redundancy: RedundancyMode): number {
  const base = (Math.max(0, photosGb) + Math.max(0, mediaGb) + Math.max(0, appDrivenGb)) * (1 + Math.max(0, growthPct) / 100)
  const withRedundancy = redundancy === "mirror" ? base * 2 : base
  return Math.ceil(withRedundancy)
}

// Sums the typical idle draw of every matched node — used together with
// yearlyPowerCostUsd() below.
export function totalIdleWatts(wattsPerNode: number, nodes: number): number {
  return Math.max(0, wattsPerNode) * Math.max(0, nodes)
}

export function yearlyPowerCostUsd(idleWatts: number, usdPerKwh: number): number {
  const kwhPerYear = (Math.max(0, idleWatts) / 1000) * 24 * 365
  return Math.round(kwhPerYear * Math.max(0, usdPerKwh) * 100) / 100
}

export type CompatWarning = { id: string; text: string }

export function compatibilityWarnings(
  selectedIds: string[],
  hypervisorId: string,
  accelerated: Record<string, boolean>
): CompatWarning[] {
  const warnings: CompatWarning[] = []

  if (selectedIds.includes("plex") && selectedIds.includes("jellyfin")) {
    warnings.push({
      id: "plex-jellyfin",
      text: "Plex and Jellyfin do the same job end to end — most people run one, not both.",
    })
  }

  if (selectedIds.includes("home-assistant") && hypervisorId === "none") {
    warnings.push({
      id: "haos-docker",
      text: "Home Assistant OS needs a VM or dedicated hardware to run its Supervisor and add-ons. \"Bare metal / Docker\" runs HA Container instead, which has no add-on store.",
    })
  }

  if (selectedIds.includes("frigate") && !accelerated.frigate) {
    warnings.push({
      id: "frigate-accel",
      text: "Frigate without a Coral TPU, Hailo, or GPU falls back to CPU-only detection, which struggles past a camera or two.",
    })
  }

  return warnings
}

export type DeploymentMode = "vm" | "lxc"
export type ResourceRequirement = { cpu: number; ramGb: number; storageGb: number }

// LXC shares the host kernel directly, so there's no separate guest-OS/init
// overhead the way a full VM has — these multipliers are ZeroPoint's own
// planning judgment, not an app-specific published figure.
export function applyDeploymentMode(requirement: ResourceRequirement, mode: DeploymentMode): ResourceRequirement {
  if (mode === "vm") return requirement
  return {
    cpu: requirement.cpu,
    ramGb: Math.max(1, Math.round(requirement.ramGb * 0.6)),
    storageGb: Math.max(4, Math.round(requirement.storageGb * 0.5)),
  }
}

export function transcodeGuidance(streams: number, has4k: boolean): string | null {
  if (streams <= 0) return null
  if (has4k) {
    return "At least one 4K stream needs real transcoding headroom — Intel 8th gen or newer with Quick Sync is strongly recommended over adding CPU cores."
  }
  if (streams >= 3) {
    return `${streams} simultaneous streams is enough load that Intel 8th gen+ with Quick Sync will handle it far more efficiently than raising CPU allocation.`
  }
  return "Intel 8th gen or newer with Quick Sync keeps even a stream or two nearly free on CPU — recommended over raising core count."
}
