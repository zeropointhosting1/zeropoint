const COLORS = {
  border: "stroke-border",
  ambient: "stroke-foreground/25",
  primary: "stroke-primary/45",
  success: "stroke-success/45",
  warning: "stroke-warning/45",
  muted: "stroke-text-tertiary/40",
} as const

export function DiagramEdge({
  id,
  d,
  dashed = false,
  color = "border",
}: {
  id: string
  d: string
  dashed?: boolean
  color?: keyof typeof COLORS
}) {
  return (
    <path
      id={id}
      d={d}
      className={COLORS[color]}
      strokeWidth={1}
      strokeDasharray={dashed ? "3 5" : undefined}
    />
  )
}
