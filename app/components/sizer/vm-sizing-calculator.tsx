"use client"

import * as React from "react"
import {
  Activity,
  Check,
  Cloud,
  Code2,
  ExternalLink,
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
  Server,
  ShieldCheck,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HYPERVISORS } from "@/lib/hypervisor-catalog"
import { PROFILE_LABELS, WORKLOADS, type UsageProfile } from "@/lib/workload-catalog"

const PROFILES = Object.keys(PROFILE_LABELS) as UsageProfile[]

const PROFILE_ICONS: Record<UsageProfile, React.ElementType> = {
  starter: Zap,
  recommended: Gauge,
  heavy: TrendingUp,
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
}
const DEFAULT_CATEGORY_META: CategoryMeta = { icon: Layers, text: "text-chart-5", bg: "bg-chart-5/12" }

function categoryMeta(category: string) {
  return CATEGORY_META[category] ?? DEFAULT_CATEGORY_META
}

// Assigned by selection order, not category — with 8 categories sharing 5
// chart hues, this is what actually keeps simultaneously-visible bar
// segments from colliding for the common case of a handful of picks.
const CHART_PALETTE = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]

const RESOURCE_META = [
  { key: "cpu" as const, label: "CPU", unit: "vCPU" },
  { key: "ramGb" as const, label: "Memory", unit: "GB" },
  { key: "storageGb" as const, label: "Disk", unit: "GB" },
]

export function VmSizingCalculator() {
  const [selected, setSelected] = React.useState<string[]>(["home-assistant"])
  const [profile, setProfile] = React.useState<UsageProfile>("recommended")
  const [hypervisorId, setHypervisorId] = React.useState(HYPERVISORS[0].id)

  const chosen = WORKLOADS.filter((workload) => selected.includes(workload.id))
  const hypervisor = HYPERVISORS.find((h) => h.id === hypervisorId) ?? HYPERVISORS[0]

  const raw = chosen.reduce(
    (sum, workload) => {
      const requirement = workload.requirements[profile]
      return {
        cpu: sum.cpu + requirement.cpu,
        ramGb: sum.ramGb + requirement.ramGb,
        storageGb: sum.storageGb + requirement.storageGb,
      }
    },
    { cpu: 0, ramGb: 0, storageGb: 0 }
  )
  const appTotal = {
    cpu: chosen.length ? Math.max(2, Math.ceil(raw.cpu * 1.1)) : 0,
    ramGb: chosen.length ? Math.ceil(raw.ramGb * 1.2) : 0,
    storageGb: chosen.length ? Math.ceil(raw.storageGb * 1.15) : 0,
  }
  const grandTotal = {
    cpu: chosen.length ? appTotal.cpu + hypervisor.overhead.cpu : 0,
    ramGb: chosen.length ? appTotal.ramGb + hypervisor.overhead.ramGb : 0,
    storageGb: chosen.length ? appTotal.storageGb + hypervisor.overhead.storageGb : 0,
  }

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
      <div>
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
                          <span className={cn("rounded-full px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase", meta.bg, meta.text)}>{workload.category}</span>
                        </span>
                        <span className="font-mono text-[10px] text-text-secondary">{req.cpu} vCPU · {req.ramGb} GB · {req.storageGb} GB</span>
                      </span>
                      <span className="mt-1 block text-sm text-text-secondary">{workload.description}</span>
                    </span>
                  </button>
                  {active && (
                    <div className="ml-11 mt-4 rounded-xl border border-border bg-surface-raised p-4 text-xs leading-relaxed text-text-secondary">
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
        </div>

        <div>
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
      </div>

      <aside className="sticky top-24 overflow-hidden rounded-2xl border border-primary/20 bg-surface-raised shadow-[0_0_40px_-24px_var(--accent-glow)]">
        <div className="border-b border-border px-6 py-5">
          <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">Suggested capacity</p>
          <p className="mt-1 text-xs text-text-tertiary">{chosen.length} workload{chosen.length === 1 ? "" : "s"} · {PROFILE_LABELS[profile].label} · {hypervisor.name}</p>
        </div>
        {chosen.length ? (
          <>
            <div className="grid grid-cols-3 divide-x divide-border">
              <Result icon={Server} value={grandTotal.cpu} unit="vCPU" />
              <Result icon={MemoryStick} value={grandTotal.ramGb} unit="GB RAM" />
              <Result icon={HardDrive} value={grandTotal.storageGb} unit="GB disk" />
            </div>

            <div className="border-t border-border px-6 py-5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase">Where it comes from</p>
              <div className="mt-4 space-y-4">
                {RESOURCE_META.map(({ key, label, unit }) => {
                  const headroomValue = appTotal[key] - raw[key]
                  return (
                    <div key={key}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-text-secondary">{label}</span>
                        <span className="font-mono text-[10px] text-text-tertiary">{raw[key]} {unit} apps + {headroomValue} {unit} headroom</span>
                      </div>
                      <div className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full bg-surface">
                        {chosen.map((workload, index) => {
                          const value = workload.requirements[profile][key]
                          if (value <= 0) return null
                          return <div key={workload.id} className={cn("h-full first:rounded-l-full", CHART_PALETTE[index % CHART_PALETTE.length])} style={{ width: `${(value / appTotal[key]) * 100}%` }} />
                        })}
                        {headroomValue > 0 && <div className="h-full bg-text-tertiary/30 last:rounded-r-full" style={{ width: `${(headroomValue / appTotal[key]) * 100}%` }} />}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                {chosen.map((workload, index) => (
                  <LegendChip key={workload.id} colorClass={CHART_PALETTE[index % CHART_PALETTE.length]} label={workload.name} />
                ))}
                <LegendChip colorClass="bg-text-tertiary/30" label="Headroom" />
              </div>
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">App subtotal</p>
                <p className="font-mono text-xs text-text-secondary">{appTotal.cpu} vCPU · {appTotal.ramGb} GB · {appTotal.storageGb} GB</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">+ {hypervisor.name}</p>
                <p className="font-mono text-xs text-text-secondary">
                  {hypervisor.overhead.cpu === 0 && hypervisor.overhead.ramGb === 0 && hypervisor.overhead.storageGb === 0
                    ? "+0"
                    : `+${hypervisor.overhead.cpu} vCPU · +${hypervisor.overhead.ramGb} GB · +${hypervisor.overhead.storageGb} GB`}
                </p>
              </div>
              {hypervisor.sourceUrl && (
                <p className="mt-2 text-[11px] leading-relaxed text-text-tertiary">
                  {hypervisor.sourceFact}{" "}
                  <a href={hypervisor.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">{hypervisor.sourceLabel}<ExternalLink className="size-3" /></a>
                </p>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <p className="text-xs font-semibold text-foreground">= Total to provision</p>
                <p className="font-mono text-xs font-semibold text-primary">{grandTotal.cpu} vCPU · {grandTotal.ramGb} GB · {grandTotal.storageGb} GB</p>
              </div>
            </div>

            <div className="border-t border-border px-6 py-5">
              <p className="flex items-center gap-2 text-xs font-medium text-foreground"><ShieldCheck className="size-3.5 text-primary" />Headroom included</p>
              <p className="mt-2 text-xs leading-relaxed text-text-tertiary">Colored segments above are each app&rsquo;s official requirement; the gray segment is ZeroPoint&rsquo;s 10% CPU / 20% RAM / 15% disk buffer. The hypervisor line is separate and comes from its own documented minimum.</p>
              <p className="mt-3 text-xs leading-relaxed text-warning">Media, photo libraries, synced files, backups, and redundancy are not included.</p>
            </div>
          </>
        ) : (
          <div className="px-6 py-12 text-center"><Minus className="mx-auto size-5 text-text-tertiary" /><p className="mt-3 text-sm text-text-secondary">Select at least one workload.</p></div>
        )}
      </aside>
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
    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-text-tertiary">
      <span className={cn("size-1.5 rounded-full", colorClass)} />
      {label}
    </span>
  )
}

function Result({ icon: Icon, value, unit }: { icon: React.ElementType; value: number; unit: string }) {
  return <div className="px-2 py-5 text-center"><Icon className="mx-auto size-4 text-text-tertiary" /><p className="mt-3 font-mono text-2xl font-semibold text-foreground">{value}</p><p className="mt-1 font-mono text-[8px] tracking-wider text-text-tertiary uppercase">{unit}</p></div>
}
