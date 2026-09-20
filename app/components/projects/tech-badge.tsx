export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface-raised px-2 py-0.5 font-mono text-[11px] text-text-secondary">
      {children}
    </span>
  )
}
