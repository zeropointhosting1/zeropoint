import test from "node:test"
import assert from "node:assert/strict"
import { estimatePhysicalCores, applyDeploymentMode, transcodeGuidance, dataStorageNeededGb, yearlyPowerCostUsd, compatibilityWarnings } from "./sizing-math.ts"
import { matchHardware } from "./hardware-tiers.ts"
import { WORKLOADS } from "./workload-catalog.ts"

test("single light app floors to the 2-core minimum", () => {
  assert.equal(estimatePhysicalCores([2]), 2)
})

test("single heavy app (Immich, 8 vCPU) needs far fewer physical cores than its vCPU count", () => {
  const cores = estimatePhysicalCores([8])
  assert.equal(cores, 3)
  assert.ok(cores < 8)
})

test("5-app heavy case (HA + Immich + Plex + Nextcloud + Jellyfin) lands in realistic mini-PC territory", () => {
  // Heavy-tier vCPU and RAM requirements from lib/workload-catalog.ts as of
  // 2026-09-23 — re-check these against the catalog if either changes.
  // RAM: HA 8 + Immich 12 + Plex 8 + Nextcloud 8 + Jellyfin 12 = 48 raw,
  // *1.2 headroom = 58, +2 for Proxmox overhead = 60.
  const cores = estimatePhysicalCores([4, 8, 8, 6, 8])
  assert.equal(cores, 10)
  assert.ok(cores < 20, `expected well under the old linear-sum result (34), got ${cores}`)

  const match = matchHardware(cores, 60)
  assert.ok(match.nodes <= 2, `expected to fit on 1-2 mini PCs, got ${match.nodes} nodes of ${match.tier.name}`)
})

test("5-app heavy case system disk also lands realistic once cache/recording storage moves to Data storage", () => {
  const ids = ["home-assistant", "immich", "plex", "nextcloud", "jellyfin"]
  const apps = ids.map((id) => WORKLOADS.find((w) => w.id === id)!)
  const systemStorageRaw = apps.reduce((sum, w) => {
    const req = w.requirements.heavy
    return sum + (req.storageGb - (req.dataPortionGb ?? 0))
  }, 0)
  const systemStorageTotal = Math.ceil(systemStorageRaw * 1.15) + 32 // Proxmox boot-disk overhead
  // The reported bug was a 927 GB system disk for this exact selection.
  assert.ok(systemStorageTotal < 500, `expected well under the old 927 GB, got ${systemStorageTotal}`)

  const appDataStorage = apps.reduce((sum, w) => sum + (w.requirements.heavy.dataPortionGb ?? 0), 0)
  assert.ok(appDataStorage > 0, "expected the cache/recording storage to show up somewhere, not vanish")
})

test("LXC deployment reduces RAM and storage vs the same app as a VM", () => {
  const vm = { cpu: 1, ramGb: 2, storageGb: 16 }
  const lxc = applyDeploymentMode(vm, "lxc")
  assert.ok(lxc.ramGb < vm.ramGb)
  assert.ok(lxc.storageGb < vm.storageGb)
  assert.equal(lxc.cpu, vm.cpu)
})

test("VM deployment mode is a no-op", () => {
  const vm = { cpu: 2, ramGb: 4, storageGb: 32 }
  assert.deepEqual(applyDeploymentMode(vm, "vm"), vm)
})

test("transcode guidance recommends Quick Sync rather than more cores", () => {
  const guidance = transcodeGuidance(2, false)
  assert.ok(guidance && /Quick Sync/.test(guidance))
})

test("a single 4K stream still triggers Quick Sync guidance", () => {
  const guidance = transcodeGuidance(1, true)
  assert.ok(guidance && /Quick Sync/.test(guidance))
})

test("no streams selected means no transcode guidance", () => {
  assert.equal(transcodeGuidance(0, false), null)
})

test("data storage doubles under mirror redundancy", () => {
  const single = dataStorageNeededGb(500, 2000, 0, 20, "single")
  const mirror = dataStorageNeededGb(500, 2000, 0, 20, "mirror")
  assert.equal(mirror, single * 2)
})

test("app-driven data storage (Frigate recordings, transcode caches) adds to the same total", () => {
  const withoutApps = dataStorageNeededGb(0, 0, 0, 0, "single")
  const withApps = dataStorageNeededGb(0, 0, 300, 0, "single")
  assert.equal(withApps, withoutApps + 300)
})

test("compatibility warns when Plex and Jellyfin are both selected", () => {
  const warnings = compatibilityWarnings(["plex", "jellyfin"], "proxmox", {})
  assert.ok(warnings.some((w) => w.id === "plex-jellyfin"))
})

test("compatibility warns when Home Assistant OS is paired with bare metal/Docker", () => {
  const warnings = compatibilityWarnings(["home-assistant"], "none", {})
  assert.ok(warnings.some((w) => w.id === "haos-docker"))
})

test("no Home Assistant warning once a real hypervisor is selected", () => {
  const warnings = compatibilityWarnings(["home-assistant"], "proxmox", {})
  assert.equal(warnings.some((w) => w.id === "haos-docker"), false)
})

test("Frigate without an accelerator triggers a warning", () => {
  const warnings = compatibilityWarnings(["frigate"], "proxmox", {})
  assert.ok(warnings.some((w) => w.id === "frigate-accel"))
})

test("Frigate with an accelerator flagged true has no warning", () => {
  const warnings = compatibilityWarnings(["frigate"], "proxmox", { frigate: true })
  assert.equal(warnings.some((w) => w.id === "frigate-accel"), false)
})

test("power cost scales linearly with watts and rate", () => {
  // 20W * 24h * 365d / 1000 = 175.2 kWh * $0.15/kWh = $26.28/yr
  assert.equal(yearlyPowerCostUsd(20, 0.15), 26.28)
})

test("hardware match falls back to a small cluster when nothing fits on one node", () => {
  const match = matchHardware(10, 96)
  assert.ok(match.nodes >= 2)
})

test("hardware match returns a single node when the load actually fits", () => {
  const match = matchHardware(2, 8)
  assert.equal(match.nodes, 1)
})
