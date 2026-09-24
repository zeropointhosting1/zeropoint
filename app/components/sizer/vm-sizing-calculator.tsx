"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Activity,
  Boxes,
  Camera,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  FileText,
  Gauge,
  HardDrive,
  Home,
  Image as ImageIcon,
  KeyRound,
  Layers,
  MemoryStick,
  Minus,
  PlayCircle,
  Router,
  Search,
  Send,
  Server,
  Terminal,
  TriangleAlert,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HYPERVISORS } from "@/lib/hypervisor-catalog"
import { PROFILE_LABELS, WORKLOADS, SIZER_PRESETS, type UsageProfile } from "@/lib/workload-catalog"
import {
  estimatePhysicalCores,
  applyDeploymentMode,
  transcodeGuidance,
  dataStorageNeededGb,
  totalIdleWatts,
  yearlyPowerCostUsd,
  compatibilityWarnings,
  type DeploymentMode,
  type RedundancyMode,
} from "@/lib/sizing-math"
import { matchHardware } from "@/lib/hardware-tiers"
import { NODES } from "@/lib/homelab-data"

const PROFILES = Object.keys(PROFILE_LABELS) as UsageProfile[]

const PROFILE_ICONS: Record<UsageProfile, React.ElementType> = {
  starter: Zap,
  recommended: Gauge,
  heavy: Activity,
}

const HYPERVISOR_ICONS: Record<string, React.ElementType> = {
  none: Terminal,
  proxmox: Server,
  esxi: Server,
  "truenas-scale": HardDrive,
}

type CategoryMeta = { icon: React.ElementType; text: string; bg: string }

const CATEGORY_META: Record<string, CategoryMeta> = {
  Automation: { icon: Home, text: "text-chart-1", bg: "bg-chart-1/12" },
  Photos: { icon: ImageIcon, text: "text-chart-2", bg: "bg-chart-2/12" },
  Media: { icon: PlayCircle, text: "text-chart-3", bg: "bg-chart-3/12" },
  Cloud: { icon: Cloud, text: "text-chart-4", bg: "bg-chart-4/12" },
  Networking: { icon: Router, text: "text-chart-5", bg: "bg-chart-5/12" },
  Security: { icon: KeyRound, text: "text-chart-3", bg: "bg-chart-3/12" },
  Monitoring: { icon: Activity, text: "text-chart-2", bg: "bg-chart-2/12" },
  Development: { icon: Code2, text: "text-chart-1", bg: "bg-chart-1/12" },
  Documents: { icon: FileText, text: "text-chart-4", bg: "bg-chart-4/12" },
  Storage: { icon: Database, text: "text-chart-5", bg: "bg-chart-5/12" },
  Cameras: { icon: Camera, text: "text-chart-1", bg: "bg-chart-1/12" },
}
const DEFAULT_CATEGORY_META: CategoryMeta = { icon: Layers, text: "text-chart-5", bg: "bg-chart-5/12" }

function categoryMeta(category: string) {
  return CATEGORY_META[category] ?? DEFAULT_CATEGORY_META
}

// Assigned by selection order, not category — with many categories sharing
// 5 chart hues, this is what actually keeps simultaneously-visible bar
// segments from colliding for the common case of a handful of picks.
const CHART_PALETTE = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]

function parseListParam(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : []
}

function parseNumberParam(value: string | null, fallback: number): number {
  if (!value) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function VmSizingCalculator() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [selected, setSelected] = React.useState<string[]>(() => {
    const fromUrl = parseListParam(searchParams.get("apps"))
    return fromUrl.length ? fromUrl : ["home-assistant"]
  })
  const [profile, setProfile] = React.useState<UsageProfile>(() => (searchParams.get("tier") as UsageProfile) ?? "recommended")
  const [hypervisorId, setHypervisorId] = React.useState(() => searchParams.get("hv") ?? HYPERVISORS[0].id)
  const [lxcApps, setLxcApps] = React.useState<Set<string>>(() => new Set(parseListParam(searchParams.get("lxc"))))
  const [accelerated, setAccelerated] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(parseListParam(searchParams.get("accel")).map((id) => [id, true]))
  )
  const [streams, setStreams] = React.useState(() => parseNumberParam(searchParams.get("streams"), 0))
  const [has4k, setHas4k] = React.useState(() => searchParams.get("k4") === "1")
  const [photosGb, setPhotosGb] = React.useState(() => parseNumberParam(searchParams.get("photos"), 0))
  const [mediaGb, setMediaGb] = React.useState(() => parseNumberParam(searchParams.get("media"), 0))
  const [growthPct, setGrowthPct] = React.useState(() => parseNumberParam(searchParams.get("growth"), 20))
  const [redundancy, setRedundancy] = React.useState<RedundancyMode>(() => (searchParams.get("redund") as RedundancyMode) ?? "single")
  const [kwhRate, setKwhRate] = React.useState(() => parseNumberParam(searchParams.get("kwh"), 0.16))
  const [expandedSources, setExpandedSources] = React.useState<Set<string>>(new Set())
  const [copied, setCopied] = React.useState(false)

  // Keeps the URL shareable/bookmarkable without spamming browser history —
  // debounced so typing in a number field doesn't fire a replace per keystroke.
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      const params = new URLSearchParams()
      if (selected.length) params.set("apps", selected.join(","))
      params.set("tier", profile)
      params.set("hv", hypervisorId)
      if (lxcApps.size) params.set("lxc", [...lxcApps].join(","))
      const accelIds = Object.keys(accelerated).filter((id) => accelerated[id])
      if (accelIds.length) params.set("accel", accelIds.join(","))
      if (streams) params.set("streams", String(streams))
      if (has4k) params.set("k4", "1")
      if (photosGb) params.set("photos", String(photosGb))
      if (mediaGb) params.set("media", String(mediaGb))
      if (growthPct !== 20) params.set("growth", String(growthPct))
      if (redundancy !== "single") params.set("redund", redundancy)
      if (kwhRate !== 0.16) params.set("kwh", String(kwhRate))
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)
    return () => window.clearTimeout(id)
  }, [selected, profile, hypervisorId, lxcApps, accelerated, streams, has4k, photosGb, mediaGb, growthPct, redundancy, kwhRate, pathname, router])

  const chosen = WORKLOADS.filter((workload) => selected.includes(workload.id))
  const hypervisor = HYPERVISORS.find((h) => h.id === hypervisorId) ?? HYPERVISORS[0]
  const isProxmox = hypervisorId === "proxmox"

  const perApp = chosen.map((workload) => {
    const base = workload.requirements[profile]
    const mode: DeploymentMode = workload.lxcCapable && isProxmox && lxcApps.has(workload.id) ? "lxc" : "vm"
    // Only the true system-disk portion goes through the VM/LXC overhead
    // adjustment — a cache/recording buffer doesn't shrink just because
    // the app runs in a lighter container.
    const dataPortionGb = base.dataPortionGb ?? 0
    const systemOnly = { cpu: base.cpu, ramGb: base.ramGb, storageGb: base.storageGb - dataPortionGb }
    return { workload, mode, effective: applyDeploymentMode(systemOnly, mode), dataPortionGb }
  })

  const ramRaw = perApp.reduce((sum, p) => sum + p.effective.ramGb, 0)
  const sysStorageRaw = perApp.reduce((sum, p) => sum + p.effective.storageGb, 0)
  const appDataStorageRaw = perApp.reduce((sum, p) => sum + p.dataPortionGb, 0)
  const physicalCores = estimatePhysicalCores(perApp.map((p) => p.effective.cpu))

  const appTotal = {
    ramGb: chosen.length ? Math.ceil(ramRaw * 1.2) : 0,
    storageGb: chosen.length ? Math.ceil(sysStorageRaw * 1.15) : 0,
  }
  const grandTotal = {
    cpu: chosen.length ? physicalCores + hypervisor.overhead.cpu : 0,
    ramGb: chosen.length ? appTotal.ramGb + hypervisor.overhead.ramGb : 0,
    storageGb: chosen.length ? appTotal.storageGb + hypervisor.overhead.storageGb : 0,
  }

  const dataStorageGb = dataStorageNeededGb(photosGb, mediaGb, appDataStorageRaw, growthPct, redundancy)
  const hasTranscodeApp = selected.includes("plex") || selected.includes("jellyfin")
  const transcodeNote = hasTranscodeApp ? transcodeGuidance(streams, has4k) : null
  const warnings = compatibilityWarnings(selected, hypervisorId, accelerated)
  const hwMatch = chosen.length ? matchHardware(grandTotal.cpu, grandTotal.ramGb) : null
  const yearlyPowerCost = hwMatch ? yearlyPowerCostUsd(totalIdleWatts(hwMatch.tier.typicalIdleWatts, hwMatch.nodes), kwhRate) : 0

  const labCores = NODES.reduce((sum, n) => sum + n.cores, 0)
  const labRamUsed = NODES.reduce((sum, n) => sum + n.ramUsedGb, 0)
  const labRamTotal = NODES.reduce((sum, n) => sum + n.ramTotalGb, 0)

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  function toggleSource(id: string) {
    setExpandedSources((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function setLxcMode(id: string, mode: DeploymentMode) {
    setLxcApps((current) => {
      const next = new Set(current)
      if (mode === "lxc") next.add(id)
      else next.delete(id)
      return next
    })
  }

  function applyPreset(appIds: string[]) {
    setSelected(appIds)
    setExpandedSources(new Set())
  }

  const sizingSummary = chosen.length
    ? [
        "Workload Sizer results:",
        `Apps: ${chosen.map((w) => w.name).join(", ")}`,
        `Usage level: ${PROFILE_LABELS[profile].label}`,
        `Hypervisor: ${hypervisor.name}`,
        `Estimated: ${grandTotal.cpu} physical cores / ${grandTotal.ramGb} GB RAM / ${grandTotal.storageGb} GB system disk`,
        dataStorageGb > 0 ? `Data storage needed: ${dataStorageGb} GB (${redundancy === "mirror" ? "mirrored" : "single drive"})` : null,
        hwMatch ? `Suggested hardware: ${hwMatch.nodes > 1 ? `${hwMatch.nodes}x ` : ""}${hwMatch.tier.name}` : null,
        transcodeNote ? `Transcoding note: ${transcodeNote}` : null,
        "",
        "I'd like help turning this into a build: ",
      ]
        .filter((line) => line !== null)
        .join("\n")
    : ""

  async function copySummary() {
    await navigator.clipboard.writeText(sizingSummary)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="grid gap-8 pb-20 lg:grid-cols-[1fr_360px] lg:items-start lg:pb-0">
      <div>
        <div className="mb-8">
          <p className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">Start from a preset</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZER_PRESETS.map((preset) => (
              <button key={preset.id} onClick={() => applyPreset(preset.appIds)} title={preset.description} className="rounded-full border border-border bg-surface-raised px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-primary/35 hover:text-foreground">
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <StepLabel n={1}>Choose a usage level</StepLabel>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {PROFILES.map((key) => {
              const Icon = PROFILE_ICONS[key]
              const active = profile === key
              return (
                <button key={key} onClick={() => setProfile(key)} className={cn("rounded-xl border p-4 text-left transition-colors", active ? "border-primary/50 bg-primary/8" : "border-border bg-surface-raised hover:border-primary/25")}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn("flex size-8 items-center justify-center rounded-lg", active ? "bg-primary/15 text-primary" : "bg-surface text-text-tertiary")}>
                      <Icon className="size-4" />
                    </span>
                    <span className={cn("mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border", active ? "border-primary bg-primary" : "border-border")}>
                      {active && <Check className="size-2.5 text-primary-foreground" />}
                    </span>
                  </div>
                  <span className={cn("mt-3 block text-sm font-medium", active ? "text-primary" : "text-foreground")}>{PROFILE_LABELS[key].label}</span>
                  <span className="mt-1 block text-xs text-text-tertiary">{PROFILE_LABELS[key].description}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-8">
          <StepLabel n={2}>Select workloads</StepLabel>
          <div className="mt-3 divide-y divide-border border-y border-border">
            {WORKLOADS.map((workload) => {
              const active = selected.includes(workload.id)
              const req = workload.requirements[profile]
              const meta = categoryMeta(workload.category)
              const Icon = meta.icon
              const sourceOpen = expandedSources.has(workload.id)
              const mode: DeploymentMode = workload.lxcCapable && isProxmox && lxcApps.has(workload.id) ? "lxc" : "vm"
              return (
                <div key={workload.id} className={cn("py-5 transition-colors", active && "bg-surface-raised/40")}>
                  <button onClick={() => toggle(workload.id)} className="flex w-full items-start gap-4 text-left">
                    <span className={cn("relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors", active ? "border-transparent bg-primary" : cn("border-border", meta.bg))}>
                      <Icon className={cn("size-4", active ? "text-primary-foreground" : meta.text)} />
                      {active && (
                        <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full border-2 border-background bg-primary">
                          <Check className="size-2.5 text-primary-foreground" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <strong className="text-sm text-foreground">{workload.name}</strong>
                          <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase", meta.bg, meta.text)}>{workload.category}</span>
                        </span>
                        <span className="font-mono text-[10px] text-text-secondary">{req.cpu} vCPU · {req.ramGb} GB · {req.storageGb} GB</span>
                      </span>
                      <span className="mt-1 block text-sm text-text-secondary">{workload.description}</span>
                    </span>
                  </button>

                  {active && workload.lxcCapable && isProxmox && (
                    <div className="ml-11 mt-3 flex items-center gap-2">
                      <span className="text-xs text-text-tertiary">Run as:</span>
                      <div className="flex overflow-hidden rounded-md border border-border">
                        <button onClick={() => setLxcMode(workload.id, "vm")} className={cn("px-2.5 py-1 text-[11px] font-medium transition-colors", mode === "vm" ? "bg-primary/10 text-primary" : "text-text-tertiary hover:text-foreground")}>VM</button>
                        <button onClick={() => setLxcMode(workload.id, "lxc")} className={cn("px-2.5 py-1 text-[11px] font-medium transition-colors", mode === "lxc" ? "bg-primary/10 text-primary" : "text-text-tertiary hover:text-foreground")}>LXC</button>
                      </div>
                      {mode === "lxc" && <span className="text-[11px] text-text-tertiary">Shares the host kernel — lighter than a full VM.</span>}
                    </div>
                  )}

                  {active && workload.needsAccelerator && (
                    <label className="ml-11 mt-3 flex items-center gap-2 text-xs text-text-secondary">
                      <input type="checkbox" checked={!!accelerated[workload.id]} onChange={(e) => setAccelerated((current) => ({ ...current, [workload.id]: e.target.checked }))} className="size-3.5 rounded border-border" />
                      I have a Coral TPU, Hailo, or GPU for detection
                    </label>
                  )}

                  {active && (
                    <button onClick={() => toggleSource(workload.id)} className="ml-11 mt-3 flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary transition-colors hover:text-foreground">
                      <ChevronDown className={cn("size-3.5 transition-transform", sourceOpen && "rotate-180")} />
                      {sourceOpen ? "Hide source" : "Where these numbers come from"}
                    </button>
                  )}

                  {active && sourceOpen && (
                    <div className="ml-11 mt-3 rounded-xl border border-border bg-surface-raised p-4 text-xs leading-relaxed text-text-secondary">
                      <p><strong className="font-medium text-foreground">Source fact:</strong> {workload.sourceFact}</p>
                      <p className="mt-2"><strong className="font-medium text-foreground">How we use it:</strong> {workload.methodology}</p>
                      <p className="mt-2 text-text-tertiary">{workload.storageNote}</p>
                      <a href={workload.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-primary hover:underline">{workload.sourceLabel}<ExternalLink className="size-3" /></a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {hasTranscodeApp && (
            <div className="mt-5 rounded-xl border border-border bg-surface-raised p-5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">Transcoding</p>
              <div className="mt-3 flex flex-wrap items-center gap-5">
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  Simultaneous streams
                  <input type="number" min={0} max={20} value={streams} onChange={(e) => setStreams(Math.max(0, Number(e.target.value) || 0))} className="w-16 rounded-lg border border-input bg-surface px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary/50" />
                </label>
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input type="checkbox" checked={has4k} onChange={(e) => setHas4k(e.target.checked)} className="size-3.5 rounded border-border" />
                  Any of those are 4K
                </label>
              </div>
              {transcodeNote && <p className="mt-3 text-xs leading-relaxed text-primary">{transcodeNote}</p>}
            </div>
          )}
        </div>

        <div className="mb-8">
          <StepLabel n={3}>Choose a host / hypervisor</StepLabel>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">The hypervisor itself needs resources before any app runs. We add its documented minimum on top of your app total.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {HYPERVISORS.map((hv) => {
              const Icon = HYPERVISOR_ICONS[hv.id] ?? Server
              const active = hypervisorId === hv.id
              return (
                <button key={hv.id} onClick={() => setHypervisorId(hv.id)} className={cn("rounded-xl border p-4 text-left transition-colors", active ? "border-primary/50 bg-primary/8" : "border-border bg-surface-raised hover:border-primary/25")}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn("flex size-8 items-center justify-center rounded-lg", active ? "bg-primary/15 text-primary" : "bg-surface text-text-tertiary")}>
                      <Icon className="size-4" />
                    </span>
                    <span className={cn("mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border", active ? "border-primary bg-primary" : "border-border")}>
                      {active && <Check className="size-2.5 text-primary-foreground" />}
                    </span>
                  </div>
                  <span className={cn("mt-3 block text-sm font-medium", active ? "text-primary" : "text-foreground")}>{hv.name}</span>
                  <span className="mt-1 block text-xs text-text-tertiary">{hv.description}</span>
                  <span className="mt-2 block font-mono text-[10px] text-text-tertiary">
                    {hv.overhead.cpu === 0 && hv.overhead.ramGb === 0 && hv.overhead.storageGb === 0
                      ? "No added overhead"
                      : `+${hv.overhead.cpu} vCPU · +${hv.overhead.ramGb} GB · +${hv.overhead.storageGb} GB`}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="mb-8 space-y-2">
            {warnings.map((w) => (
              <div key={w.id} className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/8 px-4 py-3 text-xs leading-relaxed text-warning">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        )}

        <div>
          <StepLabel n={4}>Photo &amp; media storage</StepLabel>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            Separate from the system-disk totals above — your actual library, plus any cache or recording buffer the selected apps need (Immich thumbnails, Plex/Jellyfin transcode cache, Frigate recordings).
            {appDataStorageRaw > 0 && <> Selected apps already add <strong className="text-foreground">{appDataStorageRaw} GB</strong> here on their own.</>}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs text-text-secondary">Photo library (GB)</span>
              <input type="number" min={0} value={photosGb || ""} onChange={(e) => setPhotosGb(Math.max(0, Number(e.target.value) || 0))} placeholder="0" className="mt-2 w-full rounded-xl border border-input bg-surface-raised px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="text-xs text-text-secondary">Media library (GB)</span>
              <input type="number" min={0} value={mediaGb || ""} onChange={(e) => setMediaGb(Math.max(0, Number(e.target.value) || 0))} placeholder="0" className="mt-2 w-full rounded-xl border border-input bg-surface-raised px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="text-xs text-text-secondary">Expected growth (% per year)</span>
              <input type="number" min={0} max={200} value={growthPct} onChange={(e) => setGrowthPct(Math.max(0, Number(e.target.value) || 0))} className="mt-2 w-full rounded-xl border border-input bg-surface-raised px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
            </label>
            <div>
              <span className="text-xs text-text-secondary">Redundancy</span>
              <div className="mt-2 flex overflow-hidden rounded-xl border border-border">
                <button onClick={() => setRedundancy("single")} className={cn("flex-1 px-4 py-2.5 text-sm font-medium transition-colors", redundancy === "single" ? "bg-primary/10 text-primary" : "text-text-tertiary hover:text-foreground")}>Single drive</button>
                <button onClick={() => setRedundancy("mirror")} className={cn("flex-1 px-4 py-2.5 text-sm font-medium transition-colors", redundancy === "mirror" ? "bg-primary/10 text-primary" : "text-text-tertiary hover:text-foreground")}>Mirror</button>
              </div>
            </div>
          </div>
          {(photosGb > 0 || mediaGb > 0 || appDataStorageRaw > 0) && (
            <p className="mt-4 rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-text-secondary">
              Drives needed: <strong className="text-foreground">{dataStorageGb} GB</strong> {redundancy === "mirror" ? "across a mirrored pair" : "on a single drive"} — separate from the {grandTotal.storageGb} GB system disk above.
            </p>
          )}
        </div>
      </div>

      <aside id="sizer-results" className="scroll-mt-24 sticky top-24 overflow-hidden rounded-2xl border border-primary/20 bg-surface-raised shadow-[0_0_40px_-24px_var(--accent-glow)]">
        <div className="border-b border-border px-6 py-5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">Suggested capacity</p>
          <p className="mt-1 text-xs text-text-tertiary">{chosen.length} workload{chosen.length === 1 ? "" : "s"} · {PROFILE_LABELS[profile].label} · {hypervisor.name}</p>
        </div>
        {chosen.length ? (
          <>
            <div className="grid grid-cols-3 divide-x divide-border">
              <Result icon={Server} value={grandTotal.cpu} unit="Cores" />
              <Result icon={MemoryStick} value={grandTotal.ramGb} unit="GB RAM" />
              <Result icon={HardDrive} value={grandTotal.storageGb} unit="GB system disk" />
            </div>

            <div className="border-t border-border px-6 py-5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">Where the core count comes from</p>
              <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                Summed vCPU across your apps ({perApp.reduce((s, p) => s + p.effective.cpu, 0)}) ÷ a 3.5x overcommit ratio — VMs rarely peak simultaneously, so physical cores don&rsquo;t need to match summed vCPU 1:1.{hypervisor.overhead.cpu > 0 ? ` Plus ${hypervisor.overhead.cpu} vCPU for ${hypervisor.name}.` : ""}
              </p>
            </div>

            <div className="border-t border-border px-6 py-5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">RAM &amp; system disk</p>
              <div className="mt-4 space-y-4">
                <ResourceBar label="RAM" unit="GB" raw={ramRaw} withHeadroom={appTotal.ramGb} chosen={chosen} perApp={perApp} field="ramGb" />
                <ResourceBar label="System disk" unit="GB" raw={sysStorageRaw} withHeadroom={appTotal.storageGb} chosen={chosen} perApp={perApp} field="storageGb" />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-text-tertiary">Gray segments are ZeroPoint&rsquo;s 20% RAM / 15% disk planning buffer. Media, photo libraries, and backups are covered separately above, not in this total.</p>
            </div>

            {hwMatch && (
              <div className="border-t border-border px-6 py-5">
                <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">Fits on</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{hwMatch.nodes > 1 ? `${hwMatch.nodes}× ` : "1× "}{hwMatch.tier.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">{hwMatch.tier.cpu} · up to {hwMatch.tier.maxRamGb} GB RAM · {hwMatch.tier.nvmeSlots} NVMe slot{hwMatch.tier.nvmeSlots === 1 ? "" : "s"} · {hwMatch.tier.quickSync} Quick Sync</p>
                {hwMatch.tier.note && <p className="mt-2 text-xs font-medium text-primary">{hwMatch.tier.note}</p>}
              </div>
            )}

            <div className="border-t border-border px-6 py-5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">ZeroPoint lab actual usage</p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                pve01 + pve02 run <strong className="text-foreground">{labCores} cores</strong> and use <strong className="text-foreground">{labRamUsed.toFixed(1)} of {labRamTotal.toFixed(1)} GB RAM</strong> right now — updated by hand, see <Link href="/network" className="text-primary hover:underline">the Lab</Link>.
              </p>
            </div>

            {yearlyPowerCost > 0 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-5">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-foreground"><Zap className="size-3.5 text-primary" />Est. yearly power</p>
                  <label className="mt-2 flex items-center gap-1.5 text-[11px] text-text-tertiary">
                    $<input type="number" min={0} step={0.01} value={kwhRate} onChange={(e) => setKwhRate(Math.max(0, Number(e.target.value) || 0))} className="w-14 rounded-md border border-input bg-surface px-1.5 py-1 text-[11px] text-foreground outline-none focus:border-primary/50" />/kWh
                  </label>
                </div>
                <p className="font-mono text-lg font-semibold text-primary">${yearlyPowerCost.toFixed(0)}</p>
              </div>
            )}

            <div className="space-y-2.5 border-t border-border px-6 py-5">
              <Button
                variant="outline"
                className="w-full"
                render={
                  <Link
                    href={
                      hwMatch
                        ? `/deals?minRam=${Math.ceil(grandTotal.ramGb / hwMatch.nodes)}&model=${hwMatch.tier.id}&nodes=${hwMatch.nodes}`
                        : `/deals?minRam=${grandTotal.ramGb}`
                    }
                  />
                }
              >
                <Search className="size-4" />
                Find hardware that fits
              </Button>
              <Button className="w-full" render={<Link href={`/contact?message=${encodeURIComponent(sizingSummary)}`} />}>
                <Send className="size-4" />
                Bring this to a project
              </Button>
              <button onClick={copySummary} className="flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium text-text-tertiary transition-colors hover:text-foreground">
                {copied ? <Check className="size-3.5" /> : <Boxes className="size-3.5" />}
                {copied ? "Copied" : "Copy summary"}
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-12 text-center"><Minus className="mx-auto size-5 text-text-tertiary" /><p className="mt-3 text-sm text-text-secondary">Select at least one workload.</p></div>
        )}
      </aside>

      {chosen.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.3)] backdrop-blur lg:hidden">
          <a href="#sizer-results" className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-foreground">{grandTotal.cpu} cores · {grandTotal.ramGb} GB RAM · {grandTotal.storageGb} GB disk</span>
            <span className="shrink-0 text-xs font-medium text-primary">Details ↓</span>
          </a>
        </div>
      )}
    </div>
  )
}

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-[10px] text-primary">{n}</span>
      <p className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">{children}</p>
    </div>
  )
}

function LegendChip({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-text-tertiary">
      <span className={cn("size-1.5 rounded-full", colorClass)} />
      {label}
    </span>
  )
}

function Result({ icon: Icon, value, unit }: { icon: React.ElementType; value: number; unit: string }) {
  return <div className="px-2 py-5 text-center"><Icon className="mx-auto size-4 text-text-tertiary" /><p className="mt-3 font-mono text-2xl font-semibold text-foreground">{value}</p><p className="mt-1 font-mono text-[10px] tracking-wider text-text-tertiary uppercase">{unit}</p></div>
}

function ResourceBar({
  label,
  unit,
  raw,
  withHeadroom,
  chosen,
  perApp,
  field,
}: {
  label: string
  unit: string
  raw: number
  withHeadroom: number
  chosen: { id: string; name: string }[]
  perApp: { workload: { id: string; name: string }; effective: { ramGb: number; storageGb: number } }[]
  field: "ramGb" | "storageGb"
}) {
  const headroomValue = withHeadroom - raw
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="font-mono text-[10px] text-text-tertiary">{raw} {unit} apps + {headroomValue} {unit} headroom</span>
      </div>
      <div className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full bg-surface">
        {perApp.map((p, index) => {
          const value = p.effective[field]
          if (value <= 0) return null
          return <div key={p.workload.id} className={cn("h-full first:rounded-l-full", CHART_PALETTE[index % CHART_PALETTE.length])} style={{ width: `${(value / withHeadroom) * 100}%` }} />
        })}
        {headroomValue > 0 && <div className="h-full bg-text-tertiary/30 last:rounded-r-full" style={{ width: `${(headroomValue / withHeadroom) * 100}%` }} />}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
        {chosen.map((workload, index) => (
          <LegendChip key={workload.id} colorClass={CHART_PALETTE[index % CHART_PALETTE.length]} label={workload.name} />
        ))}
        <LegendChip colorClass="bg-text-tertiary/30" label="Headroom" />
      </div>
    </div>
  )
}
