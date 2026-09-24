const TONES = {
  primary: { ring: "stroke-primary", dot: "fill-primary", emphasis: "stroke-primary/40" },
  success: { ring: "stroke-success", dot: "fill-success", emphasis: "stroke-success/40" },
  warning: { ring: "stroke-warning", dot: "fill-warning", emphasis: "stroke-warning/40" },
  muted: { ring: "stroke-text-tertiary", dot: "fill-text-tertiary", emphasis: "stroke-text-tertiary/40" },
} as const

// Native SVG SMIL for the idle pulse (cheap, GPU-friendly, no JS animation
// loop) — gated by `animated` so callers can honor prefers-reduced-motion.
export function DiagramNode({
  x,
  y,
  label,
  size = 7,
  animated = true,
  emphasis = false,
  tone = "primary",
}: {
  x: number
  y: number
  label?: string
  size?: number
  animated?: boolean
  emphasis?: boolean
  tone?: keyof typeof TONES
}) {
  const t = TONES[tone]
  return (
    <g transform={`translate(${x} ${y})`}>
      {animated && (
        <circle r={size} className={`fill-none ${t.ring}`} strokeWidth={1} opacity={0.45}>
          <animate
            attributeName="r"
            values={`${size};${size * 2.4};${size}`}
            dur="3.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.45;0;0.45"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      <circle
        r={size}
        className={emphasis ? `fill-surface-raised ${t.emphasis}` : "fill-surface-raised stroke-border"}
        strokeWidth={1}
      />
      <circle r={size * 0.42} className={t.dot} />
      {label && (
        <text
          y={size + 16}
          textAnchor="middle"
          className="fill-foreground/80 font-mono text-[11px] font-medium tracking-wider uppercase"
        >
          {label}
        </text>
      )}
    </g>
  )
}
