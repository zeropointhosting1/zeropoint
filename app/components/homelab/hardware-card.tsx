import type { LucideIcon } from "lucide-react"
import { ProjectArt } from "@/components/projects/project-art"

// Same treatment as ProjectArt — an illustrated placeholder until a real
// product photo exists, deliberately not a manufacturer stock photo.
export function HardwareCard({
  icon,
  role,
  product,
  spec,
  photoSrc,
}: {
  icon: LucideIcon
  role: string
  product: string
  spec: string
  photoSrc?: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised">
      <ProjectArt icon={icon} label={role} photoSrc={photoSrc} className="aspect-[4/3]" />
      <div className="p-4">
        <p className="font-semibold text-foreground">{product}</p>
        <p className="mt-1 text-sm text-text-secondary">{spec}</p>
      </div>
    </div>
  )
}
