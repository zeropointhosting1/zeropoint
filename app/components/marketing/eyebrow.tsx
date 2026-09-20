import { cn } from "@/lib/utils"

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs tracking-[0.2em] text-primary uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}
