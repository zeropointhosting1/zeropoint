import { cn } from "@/lib/utils"
import type { VlanSegment, VlanTone } from "@/lib/homelab-data"

const DOT: Record<VlanTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  muted: "bg-text-tertiary",
}

const TEXT: Record<VlanTone, string> = {
  success: "text-success",
  warning: "text-warning",
  muted: "text-text-tertiary",
}

export function VlanLegend({ vlans }: { vlans: VlanSegment[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
      {vlans.map((v) => {
        const total = v.wired + v.wifi
        return (
          <div key={v.id} className="bg-surface-raised p-5">
            <div className="flex items-center gap-2">
              <span className={cn("size-1.5 rounded-full", DOT[v.tone])} />
              <span className="font-mono text-[11px] tracking-wider text-text-tertiary uppercase">
                VLAN {v.vlanId}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-semibold text-foreground">{v.label}</span>
              <span className={cn("font-mono text-sm", TEXT[v.tone])}>
                {total > 0 ? `${total} client${total === 1 ? "" : "s"}` : "idle"}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-text-secondary">{v.description}</p>
            <div className="mt-3 flex gap-4 font-mono text-xs text-text-tertiary">
              <span>{v.wired} wired</span>
              <span>{v.wifi} Wi-Fi</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
