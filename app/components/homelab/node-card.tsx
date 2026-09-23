import { cn } from "@/lib/utils"
import { RadialGauge } from "./radial-gauge"
import type { HypervisorNode } from "@/lib/homelab-data"

export function NodeCard({ node }: { node: HypervisorNode }) {
  const ramPct = (node.ramUsedGb / node.ramTotalGb) * 100
  const diskPct = (node.diskUsedGb / node.diskTotalGb) * 100
  const online = node.status === "Online"

  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-lg font-semibold text-foreground">{node.name}</span>
          <p className="text-xs text-text-tertiary">{node.hardware}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase",
            online ? "text-success" : "text-text-tertiary"
          )}
        >
          <span className={cn("size-1.5 rounded-full", online ? "bg-success" : "bg-text-tertiary")} />
          {node.status}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-around">
        <RadialGauge value={node.cpuPct} label="CPU" />
        <RadialGauge value={ramPct} label="RAM" />
        <RadialGauge value={diskPct} label="Disk" />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-y-2 border-t border-border pt-4 text-xs">
        <dt className="text-text-secondary">Cores</dt>
        <dd className="text-right font-mono text-foreground">{node.cores}c</dd>
        <dt className="text-text-secondary">Memory</dt>
        <dd className="text-right font-mono text-foreground">
          {node.ramUsedGb.toFixed(1)} / {node.ramTotalGb.toFixed(1)} GB
        </dd>
        <dt className="text-text-secondary">Guests</dt>
        <dd className="text-right font-mono text-foreground">
          {node.guests.running}/{node.guests.total} running
        </dd>
      </dl>
    </div>
  )
}
