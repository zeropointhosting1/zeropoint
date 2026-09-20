import { Info, TriangleAlert, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const TONES = {
  info: { icon: Info, cls: "border-primary/30 bg-primary/[0.06] text-primary" },
  warning: { icon: TriangleAlert, cls: "border-warning/30 bg-warning/[0.06] text-warning" },
  danger: { icon: ShieldAlert, cls: "border-destructive/30 bg-destructive/[0.06] text-destructive" },
} as const

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof TONES
  title?: string
  children: React.ReactNode
}) {
  const { icon: Icon, cls } = TONES[tone]
  return (
    <div className={cn("my-6 flex gap-3 rounded-xl border p-4", cls)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="text-sm leading-relaxed text-foreground/90">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="[&>p]:m-0 [&>p+p]:mt-2">{children}</div>
      </div>
    </div>
  )
}
