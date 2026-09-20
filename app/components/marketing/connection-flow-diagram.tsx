import { DiagramCanvas } from "@/components/network-diagram/diagram-canvas"
import { PacketPulse } from "@/components/network-diagram/packet-pulse"

const nodes = [
  { x: 24, width: 150, eyebrow: "SOURCE", label: "Your browser", detail: "This device" },
  { x: 265, width: 150, eyebrow: "ROUTE", label: "The internet", detail: "Encrypted transit" },
  { x: 506, width: 150, eyebrow: "DESTINATION", label: "ZeroPoint", detail: "Static site" },
]

// A literal round trip: the upper lane carries the browser request to
// ZeroPoint and the lower lane carries the response back to the browser.
export function ConnectionFlowDiagram({ animated, idPrefix = "connection" }: { animated: boolean; idPrefix?: string }) {
  const requestId = `${idPrefix}-request`
  const responseId = `${idPrefix}-response`
  const requestGradientId = `${idPrefix}-request-line`
  const responseGradientId = `${idPrefix}-response-line`
  const glowId = `${idPrefix}-packet-glow`
  return (
    <DiagramCanvas
      viewBox="0 0 680 245"
      className="h-full w-full"
      ariaLabel="Your browser sends an encrypted request through the internet to ZeroPoint, which returns a response"
    >
      <defs>
        <linearGradient id={requestGradientId} x1="0" x2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="var(--primary)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={responseGradientId} x1="1" x2="0">
          <stop offset="0" stopColor="var(--foreground)" stopOpacity="0.08" />
          <stop offset="0.5" stopColor="var(--foreground)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.08" />
        </linearGradient>
        <filter id={glowId} x="-300%" y="-300%" width="600%" height="600%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <path id={requestId} d="M99,100 C205,57 475,57 581,100" stroke={`url(#${requestGradientId})`} strokeWidth="1.5" />
      <path id={responseId} d="M581,144 C475,187 205,187 99,144" stroke={`url(#${responseGradientId})`} strokeWidth="1.5" />

      <g className="fill-primary font-mono text-[9px] tracking-[0.16em]">
        <text x="340" y="61" textAnchor="middle">REQUEST →</text>
      </g>
      <g className="fill-text-tertiary font-mono text-[9px] tracking-[0.16em]">
        <text x="340" y="192" textAnchor="middle">← RESPONSE</text>
      </g>

      {animated && (
        <g filter={`url(#${glowId})`}>
          <PacketPulse pathId={requestId} duration={2.25} delay={0} tone="request" />
          <PacketPulse pathId={requestId} duration={2.25} delay={1.1} tone="request" />
          <PacketPulse pathId={responseId} duration={2.25} delay={2.35} tone="response" />
          <PacketPulse pathId={responseId} duration={2.25} delay={3.45} tone="response" />
        </g>
      )}

      {nodes.map((node, index) => (
        <g key={node.label} transform={`translate(${node.x} 89)`}>
          {index !== 1 && animated && (
            <rect x="-3" y="-3" width={node.width + 6} height="72" rx="15" className="fill-none stroke-primary/15">
              <animate attributeName="opacity" values=".25;.7;.25" dur="3.2s" repeatCount="indefinite" />
            </rect>
          )}
          <rect width={node.width} height="66" rx="12" className="fill-surface stroke-border" />
          <circle cx="17" cy="18" r="3" className={index === 1 ? "fill-text-tertiary" : "fill-primary"} />
          <text x="28" y="21" className="fill-text-tertiary font-mono text-[8px] tracking-[0.14em]">{node.eyebrow}</text>
          <text x="16" y="43" className="fill-foreground text-[12px] font-semibold">{node.label}</text>
          <text x="16" y="57" className="fill-text-tertiary font-mono text-[8px]">{node.detail}</text>
        </g>
      ))}
    </DiagramCanvas>
  )
}
