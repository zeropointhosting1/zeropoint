import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"
import { DiagramNode } from "@/components/network-diagram/node"
import { DiagramEdge } from "@/components/network-diagram/edge"
import { PacketPulse } from "@/components/network-diagram/packet-pulse"

// Deliberately not another chain-into-a-switch diagram — this teaser's job
// is to say "two separate networks," so the composition itself is the
// point: two small independent clusters with a gap between them, no edge
// crossing it. The real topologies live on /homelab.
export function DualNetworkGlyph({ animated }: { animated: boolean }) {
  const home = { root: { x: 150, y: 90 }, leaves: [{ x: 90, y: 190 }, { x: 210, y: 190 }] }
  const lab = { root: { x: 530, y: 90 }, leaves: [{ x: 470, y: 190 }, { x: 590, y: 190 }] }

  return (
    <DiagramCanvas viewBox="0 0 680 260" className="h-full w-full" ariaLabel="Two separate networks, not connected to each other">
      <line x1={340} y1={20} x2={340} y2={230} className="stroke-border" strokeWidth={1} strokeDasharray="2 6" />

      <DiagramEdge id="home-a" d={`M${home.root.x},${home.root.y} L${home.leaves[0].x},${home.leaves[0].y}`} color="success" />
      <DiagramEdge id="home-b" d={`M${home.root.x},${home.root.y} L${home.leaves[1].x},${home.leaves[1].y}`} color="warning" />
      <DiagramEdge id="lab-a" d={`M${lab.root.x},${lab.root.y} L${lab.leaves[0].x},${lab.leaves[0].y}`} color="muted" />
      <DiagramEdge id="lab-b" d={`M${lab.root.x},${lab.root.y} L${lab.leaves[1].x},${lab.leaves[1].y}`} color="muted" />

      {animated && (
        <>
          <PacketPulse pathId="home-a" duration={2.2} delay={0} color="success" />
          <PacketPulse pathId="home-b" duration={2.2} delay={0.7} color="warning" />
          <PacketPulse pathId="lab-a" duration={2.4} delay={0.3} color="muted" />
          <PacketPulse pathId="lab-b" duration={2.4} delay={1} color="muted" />
        </>
      )}

      <DiagramNode x={home.root.x} y={home.root.y} size={9} emphasis animated={animated} />
      <DiagramNode x={home.leaves[0].x} y={home.leaves[0].y} size={6} tone="success" animated={animated} />
      <DiagramNode x={home.leaves[1].x} y={home.leaves[1].y} size={6} tone="warning" animated={animated} />
      <text x={home.root.x} y={235} textAnchor="middle" className="fill-text-secondary font-mono text-[11px] tracking-[0.15em] uppercase">
        Home
      </text>

      <DiagramNode x={lab.root.x} y={lab.root.y} size={9} tone="muted" emphasis animated={animated} />
      {lab.leaves.map((l, i) => (
        <DiagramNode key={i} x={l.x} y={l.y} size={6} tone="muted" animated={animated} />
      ))}
      <text x={lab.root.x} y={235} textAnchor="middle" className="fill-text-secondary font-mono text-[11px] tracking-[0.15em] uppercase">
        Lab
      </text>
    </DiagramCanvas>
  )
}
