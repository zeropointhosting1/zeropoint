// Pure helpers behind the admin dashboard's numbers and charts — no
// Supabase or React here, so `npm test` can cover them directly.

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function timeAgo(iso: string, now = Date.now()): string {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000)
  if (seconds < 45) return "just now"
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0][0] ?? ""
  const last = parts.length > 1 ? parts.at(-1)?.[0] ?? "" : ""
  return (first + last).toUpperCase()
}

function startOfDay(ms: number): number {
  const d = new Date(ms)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export type DayBucket = { date: number; count: number }

// One bucket per local calendar day, oldest first, ending today — days
// with nothing in them still get a zero bucket so the chart has no gaps.
export function countByDay(timestamps: string[], days: number, now = Date.now()): DayBucket[] {
  const today = startOfDay(now)
  const buckets: DayBucket[] = []
  for (let i = days - 1; i >= 0; i--) {
    // Step via Date rather than `today - i * DAY` so DST days stay aligned.
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    buckets.push({ date: d.getTime(), count: 0 })
  }
  const index = new Map(buckets.map((b, i) => [b.date, i]))
  for (const ts of timestamps) {
    const i = index.get(startOfDay(new Date(ts).getTime()))
    if (i !== undefined) buckets[i].count++
  }
  return buckets
}

export type CheckLike = { checked_at: string; is_up: boolean; response_ms: number | null }

export type HourSlot = { start: number; total: number; down: number }

// Hourly slots over the last `hours`, oldest first — what the uptime
// strip draws. A slot with any failed check counts as degraded.
export function hourlySlots(checks: CheckLike[], hours: number, now = Date.now()): HourSlot[] {
  const currentHour = Math.floor(now / HOUR) * HOUR
  const slots: HourSlot[] = Array.from({ length: hours }, (_, i) => ({ start: currentHour - (hours - 1 - i) * HOUR, total: 0, down: 0 }))
  const first = slots[0].start
  for (const check of checks) {
    const i = Math.floor((new Date(check.checked_at).getTime() - first) / HOUR)
    if (i < 0 || i >= hours) continue
    slots[i].total++
    if (!check.is_up) slots[i].down++
  }
  return slots
}

export function uptimePercent(checks: CheckLike[]): number | null {
  if (checks.length === 0) return null
  return (checks.filter((c) => c.is_up).length / checks.length) * 100
}

export function averageResponse(checks: CheckLike[]): number | null {
  const times = checks.filter((c) => c.is_up && c.response_ms != null).map((c) => c.response_ms as number)
  if (times.length === 0) return null
  return Math.round(times.reduce((sum, t) => sum + t, 0) / times.length)
}

export function formatPercent(value: number | null): string {
  if (value == null) return "—"
  if (value === 100) return "100%"
  return `${value.toFixed(value >= 99 ? 2 : 1)}%`
}

export function withinDays(iso: string, days: number, now = Date.now()): boolean {
  return now - new Date(iso).getTime() <= days * DAY
}
