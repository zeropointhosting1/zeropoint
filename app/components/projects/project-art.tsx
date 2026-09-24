import Image from "next/image"
import { cn } from "@/lib/utils"
import { withBasePath } from "@/lib/base-path"

type IconComponent = React.ComponentType<{ className?: string }>

// Placeholder "cover art" until a real photo exists for this item — an
// abstract engineering-panel treatment, deliberately not a stock photo or
// a plain gray box. When `photoSrc` is set (a real file exists under
// public/, checked at build time by the caller), it renders that instead.
export function ProjectArt({
  icon: Icon,
  label,
  photoSrc,
  className,
}: {
  icon: IconComponent
  label: string
  photoSrc?: string
  className?: string
}) {
  if (photoSrc) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl border border-border bg-surface-raised", className)}>
        <Image src={withBasePath(photoSrc)} alt="" fill unoptimized className="object-cover" />
        <span className="absolute top-4 left-4 rounded-full bg-background/80 px-2 py-1 font-mono text-[11px] tracking-[0.14em] text-text-tertiary uppercase backdrop-blur-sm">
          {label}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "bg-grid relative overflow-hidden rounded-xl border border-border bg-surface-raised",
        className
      )}
    >
      <div className="absolute inset-0 bg-radial-fade opacity-60" />
      <Icon className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-primary/10" />
      <span className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.14em] text-text-tertiary uppercase">
        {label}
      </span>
    </div>
  )
}
