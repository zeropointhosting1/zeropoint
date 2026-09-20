const COLORS = {
  primary: "fill-primary",
  success: "fill-success",
  warning: "fill-warning",
  muted: "fill-text-tertiary",
} as const

// A packet traveling along a previously-rendered <DiagramEdge id={pathId} />.
// Uses SMIL <animateMotion> — no per-frame JS, so many of these stay cheap.
// Callers should skip rendering this entirely when prefers-reduced-motion.
export function PacketPulse({
  pathId,
  duration = 3,
  delay = 0,
  reverse = false,
  tone = "request",
  color,
}: {
  pathId: string
  duration?: number
  delay?: number
  reverse?: boolean
  tone?: "request" | "response"
  color?: keyof typeof COLORS
}) {
  const fill = color ? COLORS[color] : tone === "request" ? "fill-primary" : "fill-text-secondary"
  return (
    <circle r={tone === "request" ? 3 : 2} className={fill}>
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.05;0.9;1"
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        keyPoints={reverse ? "1;0" : "0;1"}
        keyTimes="0;1"
        calcMode="linear"
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  )
}
