import { cn } from "@/lib/utils"

type IconComponent = React.ComponentType<{ className?: string }>

// Placeholder "cover art" until real diagrams/screenshots exist per project
// — an abstract engineering-panel treatment, deliberately not a stock photo
// or a plain gray box. Also reused anywhere else that wants this same
// illustrated-icon treatment (e.g. the homepage community section).
export function ProjectArt({
  icon: Icon,
  label,
  className,
}: {
  icon: IconComponent
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "bg-grid relative overflow-hidden rounded-xl border border-border bg-surface-raised",
        className
      )}
    >
      <div className="absolute inset-0 bg-radial-fade opacity-60" />
      <Icon className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-primary/10" />
      <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] text-text-tertiary uppercase">
        {label}
      </span>
    </div>
  )
}
