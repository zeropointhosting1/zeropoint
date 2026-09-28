import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, CircleCheck, CircleDashed, CircleX, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { initials } from "@/lib/admin/metrics"
import type { LeadStatus } from "@/lib/leads"
import type { UptimeStatus } from "@/lib/clients"

// Shared building blocks for every /admin page, so the overview, leads,
// clients and chat screens read as one product rather than four.

export function PageHeader({ title, description, actions }: { title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ title, description, action, className, bodyClassName, children }: {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("flex flex-col rounded-xl border border-border bg-surface-raised shadow-[0_1px_2px_oklch(0.2_0.03_282/4%)]", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </section>
  )
}

export function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-text-secondary transition-colors hover:text-primary">
      {children}
      <ArrowUpRight className="size-3.5" />
    </Link>
  )
}

export function StatCard({ label, value, hint, icon: Icon, href, tone = "neutral", loading }: {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  icon: LucideIcon
  href?: string
  tone?: "neutral" | "good" | "bad"
  loading?: boolean
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-md",
            tone === "bad" ? "bg-destructive/10 text-destructive" : tone === "good" ? "bg-success/10 text-success" : "bg-primary/8 text-primary"
          )}
        >
          <Icon className="size-3.5" />
        </span>
      </div>
      {loading ? (
        <span className="mt-3 block h-8 w-16 animate-pulse rounded-md bg-muted" />
      ) : (
        <p className="mt-3 text-[1.75rem] leading-8 font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      )}
      {hint && <p className="mt-1 truncate text-xs text-text-tertiary">{hint}</p>}
    </>
  )
  const className = "block rounded-xl border border-border bg-surface-raised p-4 shadow-[0_1px_2px_oklch(0.2_0.03_282/4%)]"
  return href ? (
    <Link href={href} className={cn(className, "transition-colors hover:border-primary/30")}>{body}</Link>
  ) : (
    <div className={className}>{body}</div>
  )
}

const LEAD_STATUS_STYLE: Record<LeadStatus, { dot: string; label: string }> = {
  new: { dot: "bg-primary", label: "New" },
  contacted: { dot: "bg-brand-cyan", label: "Contacted" },
  won: { dot: "bg-success", label: "Won" },
  lost: { dot: "bg-text-tertiary", label: "Lost" },
}

export function LeadStatusPill({ status }: { status: LeadStatus }) {
  const style = LEAD_STATUS_STYLE[status]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2 py-0.5 text-xs font-medium text-foreground">
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  )
}

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  won: "Won",
  lost: "Lost",
}

// Status always ships with an icon + label, never color alone.
const UPTIME_STYLE: Record<UptimeStatus, { icon: LucideIcon; label: string; className: string }> = {
  up: { icon: CircleCheck, label: "Operational", className: "bg-success/10 text-success" },
  down: { icon: CircleX, label: "Down", className: "bg-destructive/10 text-destructive" },
  unknown: { icon: CircleDashed, label: "Pending", className: "bg-muted text-text-secondary" },
}

export function UptimePill({ status }: { status: UptimeStatus }) {
  const { icon: Icon, label, className } = UPTIME_STYLE[status]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", className)}>
      <Icon className="size-3" />
      {label}
    </span>
  )
}

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground", className)}>
      {initials(name)}
    </span>
  )
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/60 text-text-tertiary">
        <Icon className="size-4.5" />
      </span>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-text-tertiary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Segmented filter — one row of mutually exclusive options, with counts.
export function Segmented<T extends string>({ value, onChange, options, className }: {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; count?: number }[]
  className?: string
}) {
  return (
    <div role="radiogroup" className={cn("inline-flex rounded-lg border border-border bg-muted/50 p-0.5", className)}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
              active ? "bg-surface-raised text-foreground shadow-sm ring-1 ring-border" : "text-text-secondary hover:text-foreground"
            )}
          >
            {option.label}
            {option.count !== undefined && <span className={cn("tabular-nums", active ? "text-text-secondary" : "text-text-tertiary")}>{option.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export const adminInputClass =
  "w-full rounded-lg border border-input bg-surface-raised px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
