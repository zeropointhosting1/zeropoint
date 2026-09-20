import { cn } from "@/lib/utils"

export function SectionIndex({ n, className }: { n: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="font-mono text-xs text-text-tertiary">{n}</span>
      <span className="h-px w-8 bg-border" />
    </span>
  )
}
