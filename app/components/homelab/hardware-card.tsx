import type { LucideIcon } from "lucide-react"
import { ProjectArt } from "@/components/projects/project-art"

// Same treatment as ProjectArt — an illustrated placeholder, deliberately
// not a manufacturer product photo (copyrighted, and not this site's look).
export function HardwareCard({
  icon,
  role,
  product,
  spec,
}: {
  icon: LucideIcon
  role: string
  product: string
  spec: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised">
      <ProjectArt icon={icon} label={role} className="aspect-[4/3]" />
      <div className="p-4">
        <p className="font-semibold text-foreground">{product}</p>
        <p className="mt-1 text-sm text-text-secondary">{spec}</p>
      </div>
    </div>
  )
}
