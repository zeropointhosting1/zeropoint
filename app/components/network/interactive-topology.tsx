"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "framer-motion"
import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"
import { DiagramNode } from "@/components/network-diagram/node"
import { DiagramEdge } from "@/components/network-diagram/edge"
import { PacketPulse } from "@/components/network-diagram/packet-pulse"
import { cn } from "@/lib/utils"
import { NET_NODES, NET_EDGES, NET_VIEWBOX } from "@/lib/network-topology"

export function InteractiveTopology() {
  const [selected, setSelected] = React.useState(NET_NODES[0].id)
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.3 })
  const reduced = useReducedMotion()
  const animated = inView && !reduced

  const active = NET_NODES.find((n) => n.id === selected) ?? NET_NODES[0]
  const byId = Object.fromEntries(NET_NODES.map((n) => [n.id, n]))

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div ref={ref} className="rounded-2xl border border-primary/20 bg-surface/85 p-4 shadow-[inset_0_1px_0_oklch(1_0_0/8%)] sm:p-8">
        <DiagramCanvas viewBox={NET_VIEWBOX} className="h-full w-full" ariaLabel="Interactive network topology">
          {NET_EDGES.map((e) => {
            const from = byId[e.from]
            const to = byId[e.to]
            return (
              <DiagramEdge
                key={e.id}
                id={e.id}
                d={`M${from.x},${from.y} L${to.x},${to.y}`}
                color={e.tone ?? "border"}
              />
            )
          })}

          {animated &&
            NET_EDGES.map((e, i) => (
              <PacketPulse key={e.id} pathId={e.id} duration={2.4} delay={i * 0.35} color={e.tone} />
            ))}

          {NET_NODES.map((n) => (
            <g
              key={n.id}
              onClick={() => setSelected(n.id)}
              role="button"
              tabIndex={0}
              aria-label={`${n.label} — ${n.sublabel}`}
              aria-pressed={selected === n.id}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(n.id)
              }}
              className="cursor-pointer outline-none"
            >
              {selected === n.id && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.size + 8}
                  className="fill-none stroke-primary"
                  strokeWidth={1}
                  strokeDasharray="2 4"
                />
              )}
              <DiagramNode
                x={n.x}
                y={n.y}
                label={n.label}
                size={n.size}
                tone={n.tone}
                emphasis
                animated={animated}
              />
            </g>
          ))}
        </DiagramCanvas>
      </div>

      <div className="rounded-2xl border border-border bg-surface/85 p-6 shadow-[inset_0_1px_0_oklch(1_0_0/8%)]">
        <p className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary uppercase">
          {active.sublabel}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{active.label}</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{active.description}</p>

        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-4">
          {NET_NODES.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelected(n.id)}
              className={cn(
                "rounded-md border px-2 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors",
                selected === n.id
                  ? "border-primary/40 text-primary"
                  : "border-border text-text-tertiary hover:text-foreground"
              )}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
