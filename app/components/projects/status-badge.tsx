import { cn } from "@/lib/utils"

const TONE: Record<string, string> = {
  "In Progress": "text-primary border-primary/30 bg-primary/10",
  Planned: "text-text-tertiary border-border bg-transparent",
  Archived: "text-text-tertiary border-border bg-transparent",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wider uppercase",
        TONE[status] ?? TONE.Archived
      )}
    >
      {status}
    </span>
  )
}
