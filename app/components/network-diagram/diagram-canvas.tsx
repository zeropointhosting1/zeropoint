import { cn } from "@/lib/utils"

// Pure SVG shell — no client JS needed just to render a <svg>.
export function DiagramCanvas({
  viewBox,
  className,
  children,
  ariaLabel,
}: {
  viewBox: string
  className?: string
  children: React.ReactNode
  ariaLabel?: string
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("overflow-visible", className)}
    >
      {children}
    </svg>
  )
}
