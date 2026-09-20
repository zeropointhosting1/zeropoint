"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "framer-motion"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"

type DiagramNodeProps = {
  x: number
  y: number
  label: string
  sublabel: string
  tone?: "danger" | "warning" | "safe" | "muted"
}

const TONES = {
  danger: { border: "stroke-destructive/60", fill: "fill-destructive/10", dot: "fill-destructive" },
  warning: { border: "stroke-warning/50", fill: "fill-warning/10", dot: "fill-warning" },
  safe: { border: "stroke-success/40", fill: "fill-success/8", dot: "fill-success" },
  muted: { border: "stroke-border", fill: "fill-surface-raised", dot: "fill-text-tertiary" },
}

function SecurityNode({ x, y, label, sublabel, tone = "muted" }: DiagramNodeProps) {
  const colors = TONES[tone]
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="116" height="54" rx="10" className={`${colors.fill} ${colors.border}`} />
      <circle cx="15" cy="16" r="3" className={colors.dot} />
      <text x="25" y="19" className="fill-foreground text-[10px] font-semibold">{label}</text>
      <text x="14" y="39" className="fill-foreground/75 font-mono text-[8px] tracking-wide uppercase">{sublabel}</text>
    </g>
  )
}

function MovingPacket({ pathId, delay = 0 }: { pathId: string; delay?: number }) {
  return (
    <circle r="3" className="fill-destructive">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.88;1" dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
      <animateMotion dur="2s" begin={`${delay}s`} repeatCount="indefinite"><mpath href={`#${pathId}`} /></animateMotion>
    </circle>
  )
}

function FlatNetwork({ animated }: { animated: boolean }) {
  return (
    <DiagramCanvas viewBox="0 0 540 300" className="w-full" ariaLabel="A compromised smart bulb on a flat network reaching trusted devices">
      <path id="flat-entry" d="M116 54 L212 54 L276 54" className="fill-none stroke-destructive/45" strokeWidth="1.5" strokeDasharray="4 5" />
      <path id="flat-laptop" d="M334 108 C334 155 75 150 75 218" className="fill-none stroke-destructive/35" strokeWidth="1.5" />
      <path id="flat-server" d="M334 108 L334 218" className="fill-none stroke-destructive/35" strokeWidth="1.5" />
      <path id="flat-camera" d="M334 108 C334 155 464 150 464 218" className="fill-none stroke-destructive/35" strokeWidth="1.5" />
      {animated && <><MovingPacket pathId="flat-entry" /><MovingPacket pathId="flat-laptop" delay={0.7} /><MovingPacket pathId="flat-server" delay={1} /><MovingPacket pathId="flat-camera" delay={1.3} /></>}
      <SecurityNode x={0} y={27} label="Bad actor" sublabel="Internet" tone="danger" />
      <SecurityNode x={276} y={27} label="Smart bulb" sublabel="Compromised IoT" tone="warning" />
      <SecurityNode x={17} y={218} label="Laptop" sublabel="Trusted device" />
      <SecurityNode x={276} y={218} label="File server" sublabel="Private data" />
      <SecurityNode x={406} y={218} label="Camera" sublabel="More IoT" />
      <text x="270" y="176" textAnchor="middle" className="fill-destructive font-mono text-[8px] tracking-[0.14em] uppercase">Unrestricted lateral movement</text>
    </DiagramCanvas>
  )
}

function SegmentedNetwork({ animated }: { animated: boolean }) {
  return (
    <DiagramCanvas viewBox="0 0 540 300" className="w-full" ariaLabel="An IoT VLAN containing a compromised smart bulb and blocking access to trusted devices">
      <rect x="260" y="12" width="150" height="112" rx="14" className="fill-warning/5 stroke-warning/30" strokeDasharray="4 5" />
      <text x="335" y="22" textAnchor="middle" className="fill-warning font-mono text-[7px] tracking-[0.14em] uppercase">IoT VLAN</text>
      <path id="seg-entry" d="M116 64 L212 64 L276 64" className="fill-none stroke-destructive/45" strokeWidth="1.5" strokeDasharray="4 5" />
      <path id="seg-blocked" d="M334 118 L334 151" className="fill-none stroke-destructive/45" strokeWidth="1.5" />
      <path d="M75 232 L334 232 L464 232" className="fill-none stroke-success/20" strokeWidth="1.5" />
      {animated && <><MovingPacket pathId="seg-entry" /><MovingPacket pathId="seg-blocked" delay={0.9} /></>}
      <SecurityNode x={0} y={37} label="Bad actor" sublabel="Internet" tone="danger" />
      <SecurityNode x={276} y={37} label="Smart bulb" sublabel="Compromised IoT" tone="warning" />
      <g transform="translate(311 143)"><rect width="46" height="40" rx="9" className="fill-success/10 stroke-success/40" /><ShieldCheck x={14} y={11} width={18} height={18} className="text-success" /></g>
      <text x="334" y="196" textAnchor="middle" className="fill-success font-mono text-[8px] tracking-[0.14em] uppercase">Blocked by policy</text>
      <SecurityNode x={17} y={218} label="Laptop" sublabel="Trusted VLAN" tone="safe" />
      <SecurityNode x={276} y={218} label="File server" sublabel="Server VLAN" tone="safe" />
      <SecurityNode x={406} y={218} label="Camera" sublabel="IoT VLAN" tone="warning" />
    </DiagramCanvas>
  )
}

export function NetworkSecurityComparison() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.25 })
  const reduced = useReducedMotion()
  const animated = inView && !reduced

  return (
    <div ref={ref} className="grid gap-5 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-destructive/30 bg-surface/85 shadow-[inset_0_1px_0_oklch(1_0_0/8%)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-2"><ShieldAlert className="size-4 text-destructive" /><div><p className="text-sm font-semibold">Flat network</p><p className="text-[10px] text-text-tertiary">Every device shares the same trust zone</p></div></div><span className="font-mono text-[8px] tracking-wider text-destructive uppercase">High exposure</span></div>
        <div className="p-4"><FlatNetwork animated={animated} /></div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-success/30 bg-surface/85 shadow-[inset_0_1px_0_oklch(1_0_0/8%)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><div className="flex items-center gap-2"><ShieldCheck className="size-4 text-success" /><div><p className="text-sm font-semibold">Segmented network</p><p className="text-[10px] text-text-tertiary">VLANs separate devices by trust</p></div></div><span className="font-mono text-[8px] tracking-wider text-success uppercase">Contained</span></div>
        <div className="p-4"><SegmentedNetwork animated={animated} /></div>
      </div>
    </div>
  )
}
