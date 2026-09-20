import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"
import { DiagramNode } from "@/components/network-diagram/node"
import { DiagramEdge } from "@/components/network-diagram/edge"
import { PacketPulse } from "@/components/network-diagram/packet-pulse"

// The Cisco lab: OPNsense -> Switch -> segments, arranged as a quadrant
// below the switch rather than a side-fan — deliberately a different shape
// from the home network's chain-and-fan, even though it's built from the
// same node/edge/packet vocabulary. Segments run muted/quiet rather than
// trust-colored, since (unlike the home VLANs) there's no live client count
// behind them — this is enterprise gear sitting idle for learning, not a
// production segment.
export function NetworkTeaserDiagram({ animated }: { animated: boolean }) {
  const gateway = { x: 340, y: 20 }
  const switching = { x: 340, y: 110 }
  const segments = [
    { x: 200, y: 210, label: "Users" },
    { x: 480, y: 210, label: "Servers" },
    { x: 200, y: 290, label: "Mgmt" },
    { x: 480, y: 290, label: "Security" },
  ]

  return (
    <DiagramCanvas viewBox="0 0 680 320" className="h-full w-full">
      <DiagramEdge id="teaser-gateway-switch" d={`M${gateway.x},${gateway.y} L${switching.x},${switching.y}`} />
      {segments.map((s, i) => (
        <DiagramEdge
          key={s.label}
          id={`teaser-switch-seg-${i}`}
          d={`M${switching.x},${switching.y} L${s.x},${s.y}`}
          color="muted"
        />
      ))}

      {animated && (
        <>
          <PacketPulse pathId="teaser-gateway-switch" duration={2.2} delay={0} />
          {segments.map((s, i) => (
            <PacketPulse
              key={s.label}
              pathId={`teaser-switch-seg-${i}`}
              duration={2.6}
              delay={1 + i * 0.4}
              color="muted"
            />
          ))}
        </>
      )}

      <DiagramNode x={gateway.x} y={gateway.y} label="OPNsense" size={9} emphasis animated={animated} />
      <DiagramNode x={switching.x} y={switching.y} label="Cisco Switch" emphasis animated={animated} />
      {segments.map((s) => (
        <DiagramNode key={s.label} x={s.x} y={s.y} label={s.label} size={6} tone="muted" animated={animated} />
      ))}
    </DiagramCanvas>
  )
}
