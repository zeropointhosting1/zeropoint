"use client"

import * as React from "react"
import { useInView } from "framer-motion"
import { useCountUp } from "@/lib/use-count-up"
import { HOMELAB_STATS } from "@/lib/homelab-data"

const STATS = [
  { label: "Nodes", value: HOMELAB_STATS.nodes },
  { label: "Services", value: HOMELAB_STATS.services },
  { label: "VLANs", value: HOMELAB_STATS.vlans },
  { label: "Clients", value: HOMELAB_STATS.clients },
]

function Stat({ label, value, start }: { label: string; value: number; start: boolean }) {
  const count = useCountUp(value, start)
  return (
    <div>
      <div className="font-mono text-3xl font-semibold text-foreground sm:text-4xl">{count}</div>
      <div className="mt-1 text-sm text-text-secondary">{label}</div>
    </div>
  )
}

export function InfraStats() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div ref={ref} className="mt-14 grid grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-4">
      {STATS.map((s) => (
        <Stat key={s.label} label={s.label} value={s.value} start={inView} />
      ))}
    </div>
  )
}
