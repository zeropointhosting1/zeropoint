"use client"

import { useId, useRef } from "react"
import { useReducedMotion, useInView } from "framer-motion"
import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"
import { DiagramEdge } from "@/components/network-diagram/edge"
import { PacketPulse } from "@/components/network-diagram/packet-pulse"

export function NetworkInstallDiagram() {
  const id = useId().replace(/:/g, "")
  const ref = useRef(null)
  const visible = useInView(ref)
  const reduced = useReducedMotion()
  return <figure ref={ref} className="min-w-0 rounded-2xl border border-border bg-surface-raised p-5 sm:p-7">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4"><p className="font-mono text-xs tracking-wider text-primary uppercase">One considered setup</p><span className="text-xs text-text-tertiary">Illustrative network</span></div>
    <DiagramCanvas ariaLabel="Example UniFi network with a gateway, wired switch, and separate home or staff, guest, and smart-device networks" viewBox="0 0 440 340" className="mt-5 w-full">
      {["M220 68 L220 115", "M220 165 L85 230", "M220 165 L220 230", "M220 165 L355 230"].map((d, i) => <g key={d}><DiagramEdge id={`${id}-${i}`} d={d} />{visible && !reduced && <PacketPulse pathId={`${id}-${i}`} duration={3} delay={i * 0.5} />}</g>)}
      {[{ x: 140, y: 18, w: 160, title: "UniFi gateway", sub: "Internet & network rules" }, { x: 140, y: 115, w: 160, title: "PoE switch", sub: "Wired connections" }, { x: 20, y: 230, w: 130, title: "Home / staff", sub: "Everyday devices" }, { x: 155, y: 230, w: 130, title: "Guest Wi-Fi", sub: "Internet access" }, { x: 290, y: 230, w: 130, title: "Smart devices", sub: "Separate access" }].map((node) => <g key={node.title}><rect x={node.x} y={node.y} width={node.w} height="54" rx="10" fill="var(--background)" stroke="var(--primary)" strokeOpacity="0.4" /><text x={node.x + node.w / 2} y={node.y + 22} textAnchor="middle" fill="var(--foreground)" fontSize="12" fontWeight="600">{node.title}</text><text x={node.x + node.w / 2} y={node.y + 40} textAnchor="middle" fill="var(--text-secondary)" fontSize="10">{node.sub}</text></g>)}
      <text x="220" y="323" textAnchor="middle" fill="var(--text-secondary)" fontSize="12">Access points placed where coverage is needed</text>
    </DiagramCanvas>
    <figcaption className="border-t border-border pt-4 text-xs leading-relaxed text-text-secondary">Gateway → wired switch → access points and devices. Network separation is configured to suit your space and equipment.</figcaption>
  </figure>
}
