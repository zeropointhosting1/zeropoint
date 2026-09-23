import type { LucideIcon } from "lucide-react"
import {
  Globe,
  Router,
  Monitor,
  Wifi,
  Waypoints,
  Lightbulb,
  Smartphone,
  Laptop,
  Lock,
  Fingerprint,
  LayoutDashboard,
  Server,
} from "lucide-react"
import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"
import { DiagramEdge } from "@/components/network-diagram/edge"
import { PacketPulse } from "@/components/network-diagram/packet-pulse"
import { cn } from "@/lib/utils"
import { SERVICES, NODES, VLANS } from "@/lib/homelab-data"

// A flowing, glowing multicolor dot-stream along the edge — the "data
// flowing through the wire" look from the reference screenshot, layered on
// top of the plain edge line. Three interleaved colors (phase-offset so
// they don't overlap) rather than one flat tone, on the same path via
// <use> instead of duplicating the `d` string. Drop-shadow for the glow —
// cheap relative to a real blur filter chain, and this diagram has ~20 of
// these edges.
const DOT_CLASS: Record<string, string> = {
  primary: "stroke-primary text-primary",
  success: "stroke-success text-success",
  warning: "stroke-warning text-warning",
  muted: "stroke-text-tertiary text-text-tertiary",
}

const STREAM_COLORS: (keyof typeof DOT_CLASS)[] = ["primary", "success", "warning"]

function PacketStream({
  pathId,
  duration = 1.6,
  reverse = false,
}: {
  pathId: string
  duration?: number
  reverse?: boolean
}) {
  const cycle = 12
  return (
    <>
      {STREAM_COLORS.map((tone, i) => {
        const phase = (i / STREAM_COLORS.length) * cycle
        return (
          <use
            key={tone}
            href={`#${pathId}`}
            className={cn("fill-none", DOT_CLASS[tone])}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={`0.1 ${cycle - 0.1}`}
            strokeDashoffset={reverse ? -phase : phase}
            style={{ filter: "drop-shadow(0 0 3px currentColor)" }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={reverse ? `${-phase}` : `${phase}`}
              to={reverse ? `${-phase - cycle}` : `${phase - cycle}`}
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          </use>
        )
      })}
    </>
  )
}

// Recreates the shape of the real UniFi topology map — same tree, same VLAN
// tags, same device count — but with generic device categories instead of
// real names, and no live bandwidth readouts (this site doesn't poll live
// telemetry from anything; showing precise-looking Kbps numbers here would
// be faking data the same way the rest of the site deliberately doesn't).
// The wired branch reuses the real, already-sanitized services/nodes from
// the Network page instead of inventing yet another set of fake names.

type Tone = "primary" | "success" | "warning" | "muted"

type Leaf = { id: string; label: string; tag?: string; tone: Tone; icon: LucideIcon }

// Grouped into one badge rather than one per device — individual device
// types and counts (which camera, how many pet feeders) aren't necessary
// to show the shape of the network, and are unnecessary detail about a
// private home to publish. The count comes from the same VLANS data the
// rest of the Network page uses, so it can't drift out of sync.
const IOT_COUNT = (VLANS.find((v) => v.id === "iot")?.wired ?? 0) + (VLANS.find((v) => v.id === "iot")?.wifi ?? 0)
const IOT_DEVICES: Leaf[] = [
  { id: "iot-group", label: `IoT ×${IOT_COUNT}`, tag: "Zero IoT", tone: "warning", icon: Lightbulb },
]

const TRUSTED_DEVICES: Leaf[] = [
  { id: "phone1", label: "Phone", tag: "Zero Trusted", tone: "success", icon: Smartphone },
  { id: "laptop", label: "Laptop", tag: "Zero Trusted", tone: "success", icon: Laptop },
  { id: "phone2", label: "Phone", tag: "Zero Trusted", tone: "success", icon: Smartphone },
]

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "internal-dashboard": LayoutDashboard,
  "mesh-vpn": Lock,
  "identity-sso": Fingerprint,
}

const WIRED_DEVICES: Leaf[] = [
  ...SERVICES.filter((s) => s.status === "Running").map((s) => ({
    id: s.id,
    label: s.label,
    tone: "primary" as Tone,
    icon: SERVICE_ICONS[s.id] ?? Server,
  })),
  ...NODES.map((n) => ({ id: n.id, label: n.name, tone: "primary" as Tone, icon: Server })),
]

const WIDTH = 1400
const HEIGHT = 560

function NodeBadge({
  x,
  y,
  icon: Icon,
  label,
  tag,
  tone = "primary",
  size = 28,
  animated,
}: {
  x: number
  y: number
  icon: LucideIcon
  label: string
  tag?: string
  tone?: Tone
  size?: number
  animated: boolean
}) {
  const ringClass = {
    primary: "stroke-primary",
    success: "stroke-success",
    warning: "stroke-warning",
    muted: "stroke-text-tertiary",
  }[tone]
  const iconClass = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    muted: "text-text-tertiary",
  }[tone]

  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2})`}>
      <foreignObject width={size} height={size} className="overflow-visible">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg border bg-surface-raised",
            "border-border"
          )}
          style={{ width: size, height: size }}
        >
          <Icon className={cn(iconClass)} style={{ width: size * 0.5, height: size * 0.5 }} />
        </div>
      </foreignObject>
      {animated && (
        <rect
          x={-1}
          y={-1}
          width={size + 2}
          height={size + 2}
          rx={8}
          className={cn("fill-none", ringClass)}
          strokeWidth={1}
          opacity={0.5}
        >
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
        </rect>
      )}
      {tag && (
        <text
          x={size / 2}
          y={-8}
          textAnchor="middle"
          className={cn("font-mono text-[11px] tracking-wider uppercase", iconClass)}
        >
          {tag}
        </text>
      )}
      <text
        x={size / 2}
        y={size + 16}
        textAnchor="middle"
        className="fill-foreground font-mono text-[11px] font-medium tracking-wide uppercase"
      >
        {label}
      </text>
    </g>
  )
}

export function LiveTopology({ animated }: { animated: boolean }) {
  const internet = { x: WIDTH / 2, y: 30 }
  const gateway = { x: WIDTH / 2, y: 120 }
  const desktop = { x: 150, y: 230 }
  const ap = { x: 600, y: 230 }
  const uswitch = { x: 1150, y: 230 }

  const apChildren = [...IOT_DEVICES, ...TRUSTED_DEVICES].map((d, i, arr) => ({
    ...d,
    x: 40 + (i * (900 - 40)) / (arr.length - 1),
    y: 420,
  }))
  const switchChildren = WIRED_DEVICES.map((d, i, arr) => ({
    ...d,
    x: 1000 + (i * (1350 - 1000)) / (arr.length - 1),
    y: 420,
  }))

  return (
    <DiagramCanvas viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full">
      <DiagramEdge id="lt-internet-gateway" d={`M${internet.x},${internet.y} L${gateway.x},${gateway.y}`} color="ambient" />
      <DiagramEdge id="lt-gateway-desktop" d={`M${gateway.x},${gateway.y} L${desktop.x},${desktop.y}`} color="ambient" />
      <DiagramEdge id="lt-gateway-ap" d={`M${gateway.x},${gateway.y} L${ap.x},${ap.y}`} color="ambient" />
      <DiagramEdge id="lt-gateway-switch" d={`M${gateway.x},${gateway.y} L${uswitch.x},${uswitch.y}`} color="ambient" />

      {apChildren.map((c, i) => (
        <DiagramEdge
          key={c.id}
          id={`lt-ap-${i}`}
          d={`M${ap.x},${ap.y} C${ap.x},${(ap.y + c.y) / 2} ${c.x},${(ap.y + c.y) / 2} ${c.x},${c.y}`}
          color={c.tone}
        />
      ))}
      {switchChildren.map((c, i) => (
        <DiagramEdge
          key={c.id}
          id={`lt-sw-${i}`}
          d={`M${uswitch.x},${uswitch.y} C${uswitch.x},${(uswitch.y + c.y) / 2} ${c.x},${(uswitch.y + c.y) / 2} ${c.x},${c.y}`}
          color={c.tone}
        />
      ))}

      {animated && (
        <>
          <PacketStream pathId="lt-internet-gateway" duration={0.9} />
          <PacketStream pathId="lt-gateway-desktop" duration={1} />
          <PacketStream pathId="lt-gateway-ap" duration={1} />
          <PacketStream pathId="lt-gateway-switch" duration={1} />
          {apChildren.map((c, i) => (
            <PacketStream key={c.id} pathId={`lt-ap-${i}`} duration={1.4 + (i % 3) * 0.15} />
          ))}
          {switchChildren.map((c, i) => (
            <PacketStream key={c.id} pathId={`lt-sw-${i}`} duration={1.4 + (i % 3) * 0.15} />
          ))}

          <PacketPulse pathId="lt-internet-gateway" duration={2.4} delay={0} />
          <PacketPulse pathId="lt-gateway-desktop" duration={2.2} delay={0.5} />
          <PacketPulse pathId="lt-gateway-ap" duration={2.2} delay={0.8} />
          <PacketPulse pathId="lt-gateway-switch" duration={2.2} delay={1.1} />
          {apChildren.map((c, i) => (
            <PacketPulse key={c.id} pathId={`lt-ap-${i}`} duration={2.8} delay={1.4 + i * 0.25} color={c.tone} />
          ))}
          {switchChildren.map((c, i) => (
            <PacketPulse key={c.id} pathId={`lt-sw-${i}`} duration={2.8} delay={1.6 + i * 0.3} color={c.tone} />
          ))}
        </>
      )}

      <NodeBadge x={internet.x} y={internet.y} icon={Globe} label="ISP" size={36} animated={animated} />
      <NodeBadge x={gateway.x} y={gateway.y} icon={Router} label="Gateway" size={36} animated={animated} />
      <NodeBadge x={desktop.x} y={desktop.y} icon={Monitor} label="Desktop" size={30} animated={animated} />
      <NodeBadge x={ap.x} y={ap.y} icon={Wifi} label="Living Room AP" size={32} animated={animated} />
      <NodeBadge x={uswitch.x} y={uswitch.y} icon={Waypoints} label="Flex Mini" size={32} animated={animated} />

      {apChildren.map((c) => (
        <NodeBadge key={c.id} x={c.x} y={c.y} icon={c.icon} label={c.label} tag={c.tag} tone={c.tone} animated={animated} />
      ))}
      {switchChildren.map((c) => (
        <NodeBadge key={c.id} x={c.x} y={c.y} icon={c.icon} label={c.label} tone={c.tone} animated={animated} />
      ))}
    </DiagramCanvas>
  )
}
