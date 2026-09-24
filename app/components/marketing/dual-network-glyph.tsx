import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"
import { DiagramNode } from "@/components/network-diagram/node"
import { DiagramEdge } from "@/components/network-diagram/edge"
import { PacketPulse } from "@/components/network-diagram/packet-pulse"

type Tone = "primary" | "success" | "warning" | "muted"

const CLIENTS: Array<{ id: string; x: number; y: number; label: string; zone: string; tone: Tone }> = [
  { id: "laptop", x: 28, y: 378, label: "Laptop", zone: "Trusted", tone: "success" },
  { id: "phone", x: 150, y: 378, label: "Phone", zone: "Trusted", tone: "success" },
  { id: "camera", x: 272, y: 378, label: "Camera", zone: "IoT", tone: "warning" },
  { id: "sensor", x: 404, y: 378, label: "Sensor", zone: "IoT", tone: "warning" },
  { id: "workshop-camera", x: 526, y: 378, label: "Camera", zone: "IoT", tone: "warning" },
]

const TONE_CLASSES: Record<Tone, { border: string; fill: string; dot: string; text: string }> = {
  primary: { border: "stroke-primary/45", fill: "fill-primary/8", dot: "fill-primary", text: "fill-primary" },
  success: { border: "stroke-success/45", fill: "fill-success/8", dot: "fill-success", text: "fill-success" },
  warning: { border: "stroke-warning/45", fill: "fill-warning/8", dot: "fill-warning", text: "fill-warning" },
  muted: { border: "stroke-border", fill: "fill-surface", dot: "fill-text-tertiary", text: "fill-text-secondary" },
}

function DeviceCard({ x, y, label, zone, tone }: { x: number; y: number; label: string; zone: string; tone: Tone }) {
  const colors = TONE_CLASSES[tone]
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="98" height="54" rx="11" className={`${colors.fill} ${colors.border}`} />
      <circle cx="15" cy="17" r="3" className={colors.dot} />
      <text x="25" y="20" className="fill-foreground text-[10px] font-semibold">{label}</text>
      <text x="14" y="40" className={`${colors.text} font-mono text-[10px] tracking-wide uppercase`}>{zone}</text>
    </g>
  )
}

function AccessPointCard({ x, y, label, detail, animated }: { x: number; y: number; label: string; detail: string; animated: boolean }) {
  return (
    <g transform={`translate(${x - 62} ${y - 27})`}>
      <rect width="124" height="58" rx="13" className="fill-surface-raised stroke-primary/45" />
      <circle cx="20" cy="22" r="3" className="fill-primary" />
      <path d="M13 18 Q20 11 27 18" className="fill-none stroke-primary" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 14 Q20 3 31 14" className="fill-none stroke-primary/60" strokeWidth="1.5" strokeLinecap="round" />
      <text x="39" y="22" className="fill-foreground text-[10px] font-semibold">{label}</text>
      <text x="14" y="44" className="fill-text-secondary font-mono text-[10px] tracking-wide uppercase">{detail}</text>
      {animated && <rect x="-2" y="-2" width="128" height="62" rx="15" className="fill-none stroke-primary/35" strokeWidth="1"><animate attributeName="opacity" values="0.65;0.12;0.65" dur="2.6s" repeatCount="indefinite" /></rect>}
    </g>
  )
}

export function DualNetworkGlyph({ animated }: { animated: boolean }) {
  const mainAp = { x: 200, y: 266 }
  const workshopAp = { x: 492, y: 266 }
  const lab = { x: 778, y: 266 }

  return (
    <DiagramCanvas viewBox="0 0 900 455" className="h-full w-full" ariaLabel="Live network preview showing devices connected beneath two access points and an isolated lab network">
      <text x="24" y="25" className="fill-text-secondary font-mono text-[10px] tracking-[0.16em] uppercase">Home network · live flow</text>
      <circle cx="870" cy="21" r="3" className="fill-success">{animated && <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />}</circle>
      <text x="860" y="25" textAnchor="end" className="fill-success font-mono text-[10px] tracking-[0.14em] uppercase">Online</text>

      <rect x="14" y="216" width="628" height="226" rx="16" className="fill-primary/3 stroke-primary/15" strokeDasharray="4 7" />
      <text x="30" y="238" className="fill-primary font-mono text-[10px] tracking-[0.14em] uppercase">Wireless coverage + client VLANs</text>

      <DiagramEdge id="preview-wan" d="M450,52 L450,100" color="primary" />
      <DiagramEdge id="preview-core" d="M450,115 L450,170" color="primary" />
      <DiagramEdge id="preview-main-ap" d={`M450,178 C400,205 ${mainAp.x},202 ${mainAp.x},${mainAp.y - 27}`} color="primary" />
      <DiagramEdge id="preview-workshop-ap" d={`M450,178 C460,205 ${workshopAp.x},202 ${workshopAp.x},${workshopAp.y - 27}`} color="primary" />
      <DiagramEdge id="preview-lab" d={`M450,178 C570,190 ${lab.x},205 ${lab.x},${lab.y}`} color="muted" />

      {CLIENTS.map((client, index) => {
        const parent = index < 3 ? mainAp : workshopAp
        return <DiagramEdge key={client.id} id={`preview-${client.id}`} d={`M${parent.x},${parent.y + 31} C${parent.x},330 ${client.x + 49},320 ${client.x + 49},${client.y}`} color={client.tone} />
      })}
      <DiagramEdge id="preview-lab-host" d={`M${lab.x},${lab.y + 8} L${lab.x},378`} color="muted" />

      {animated && <>
        <PacketPulse pathId="preview-wan" duration={1.4} color="primary" />
        <PacketPulse pathId="preview-core" duration={1.4} delay={0.35} color="primary" />
        <PacketPulse pathId="preview-main-ap" duration={1.8} delay={0.2} color="primary" />
        <PacketPulse pathId="preview-workshop-ap" duration={1.9} delay={0.65} color="primary" />
        <PacketPulse pathId="preview-lab" duration={2.2} delay={0.45} color="muted" />
        {CLIENTS.map((client, index) => <PacketPulse key={client.id} pathId={`preview-${client.id}`} duration={1.8 + (index % 3) * 0.25} delay={index * 0.32} color={client.tone} />)}
        <PacketPulse pathId="preview-lab-host" duration={2.2} delay={1} color="muted" />
      </>}

      <DiagramNode x={450} y={52} size={7} label="Internet" emphasis animated={animated} />
      <DiagramNode x={450} y={112} size={8} label="Gateway" emphasis animated={animated} />
      <DiagramNode x={450} y={178} size={8} label="Core switch" emphasis animated={animated} />

      <AccessPointCard x={mainAp.x} y={mainAp.y} label="Main AP" detail="Trusted + IoT" animated={animated} />
      <AccessPointCard x={workshopAp.x} y={workshopAp.y} label="Workshop AP" detail="IoT coverage" animated={animated} />

      <line x1="660" y1="216" x2="660" y2="442" className="stroke-border" strokeWidth="1" strokeDasharray="3 6" />
      <text x="678" y="238" className="fill-text-tertiary font-mono text-[10px] tracking-[0.14em] uppercase">Isolated boundary</text>
      <DiagramNode x={lab.x} y={lab.y} size={9} tone="muted" label="Lab firewall" emphasis animated={animated} />
      <DeviceCard x={729} y={378} label="Lab hosts" zone="Separate domain" tone="muted" />

      {CLIENTS.map((client) => <DeviceCard key={client.id} x={client.x} y={client.y} label={client.label} zone={client.zone} tone={client.tone} />)}
    </DiagramCanvas>
  )
}
