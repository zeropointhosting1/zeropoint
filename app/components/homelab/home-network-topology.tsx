import { Fragment } from "react"
import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"
import { DiagramNode } from "@/components/network-diagram/node"
import { DiagramEdge } from "@/components/network-diagram/edge"
import { PacketPulse } from "@/components/network-diagram/packet-pulse"
import type { ChainNode, VlanSegment } from "@/lib/homelab-data"

const WIDTH = 900
const HEIGHT = 360

// ISP -> gateway -> switch -> AP, then the AP's own SSIDs fan out into the
// VLANs below. This is the actual home network path — a separate physical
// network from the Cisco lab, not a stand-in for it.
export function HomeNetworkTopology({
  chain,
  vlans,
  animated,
}: {
  chain: ChainNode[]
  vlans: VlanSegment[]
  animated: boolean
}) {
  const chainSpacing = 210
  const chainNodes = chain.map((c, i) => ({
    ...c,
    x: 70 + i * chainSpacing,
    y: HEIGHT / 2,
  }))
  const ap = chainNodes[chainNodes.length - 1]

  const margin = 64
  const spread = vlans.length > 1 ? (HEIGHT - margin * 2) / (vlans.length - 1) : 0
  const segments = vlans.map((v, i) => {
    const total = v.wired + v.wifi
    return {
      ...v,
      x: 820,
      y: vlans.length === 1 ? HEIGHT / 2 : margin + i * spread,
      size: 6 + Math.sqrt(total) * 2,
      active: total > 0,
    }
  })

  return (
    <DiagramCanvas viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full">
      {chainNodes.slice(1).map((n, i) => (
        <DiagramEdge
          key={n.id}
          id={`home-chain-${i}`}
          d={`M${chainNodes[i].x},${chainNodes[i].y} L${n.x},${n.y}`}
          color="ambient"
        />
      ))}
      {segments.map((s, i) => (
        <DiagramEdge
          key={s.id}
          id={`home-fanout-${i}`}
          d={`M${ap.x},${ap.y} C${ap.x + 130},${ap.y} ${s.x - 130},${s.y} ${s.x},${s.y}`}
          color={s.active ? s.tone : "border"}
        />
      ))}

      {animated && (
        <>
          {chainNodes.slice(1).map((_, i) => (
            <Fragment key={`chain-packet-${i}`}>
              <PacketPulse pathId={`home-chain-${i}`} duration={2.2} delay={i * 0.5} />
              <PacketPulse pathId={`home-chain-${i}`} duration={2.2} delay={i * 0.5 + 1.1} reverse tone="response" />
            </Fragment>
          ))}
          {segments
            .filter((s) => s.active)
            .map((s, i) => (
              <Fragment key={s.id}>
                <PacketPulse
                  pathId={`home-fanout-${segments.indexOf(s)}`}
                  duration={2.4 + i * 0.3}
                  delay={0.8 + i * 0.6}
                  color={s.tone}
                />
                <PacketPulse
                  pathId={`home-fanout-${segments.indexOf(s)}`}
                  duration={2.4 + i * 0.3}
                  delay={0.8 + i * 0.6 + 1.2}
                  reverse
                  tone="response"
                  color={s.tone}
                />
              </Fragment>
            ))}
        </>
      )}

      {chainNodes.map((n, i) => (
        <DiagramNode
          key={n.id}
          x={n.x}
          y={n.y}
          label={n.label}
          size={i === 0 ? 9 : 7}
          emphasis
          animated={animated}
        />
      ))}

      {segments.map((s) => (
        <DiagramNode
          key={s.id}
          x={s.x}
          y={s.y}
          label={`${s.label} · VLAN ${s.vlanId}`}
          size={s.size}
          tone={s.tone}
          emphasis={s.active}
          animated={animated && s.active}
        />
      ))}
    </DiagramCanvas>
  )
}
