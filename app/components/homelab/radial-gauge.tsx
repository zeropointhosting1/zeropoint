// Thin stroke-based arc gauge — deliberately not a filled donut/progress-bar
// widget, to keep node cards reading as ZeroPoint rather than a NetBox panel.
export function RadialGauge({
  value,
  label,
  size = 64,
}: {
  value: number
  label: string
  size?: number
}) {
  const stroke = 3
  const r = size / 2 - stroke
  const circumference = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = circumference * (1 - pct / 100)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="fill-none stroke-border"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-foreground font-mono text-[13px] font-medium"
        >
          {Math.round(pct)}%
        </text>
      </svg>
      <span className="font-mono text-[11px] tracking-wider text-text-tertiary uppercase">
        {label}
      </span>
    </div>
  )
}
