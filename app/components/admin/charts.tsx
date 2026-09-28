"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { DayBucket, HourSlot } from "@/lib/admin/metrics"

// Hand-rolled SVG charts — each is a single series, so one brand hue plus
// recessive axes is all they need, and it keeps a chart library out of the
// static bundle. Every chart has a hover tooltip; status colors (success /
// destructive) are only used for up/down, never as a series color.

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [width, setWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    setWidth(el.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

function niceMax(value: number): number {
  if (value <= 4) return 4
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude * 4 >= value) ?? 10
  return step * magnitude * 4
}

function Tooltip({ x, width, children }: { x: number; width: number; children: React.ReactNode }) {
  // Flip to the left of the cursor near the right edge so it never clips.
  const flip = x > width - 140
  return (
    <div
      className="pointer-events-none absolute top-0 z-10 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap text-popover-foreground shadow-md"
      style={{ left: x, transform: flip ? "translateX(calc(-100% - 10px))" : "translateX(10px)" }}
    >
      {children}
    </div>
  )
}

const AXIS = { left: 28, bottom: 22, top: 8 }

export function DailyBarChart({ data, height = 200, label }: { data: DayBucket[]; height?: number; label: string }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = React.useState<number | null>(null)
  const max = niceMax(Math.max(0, ...data.map((d) => d.count)))
  const plotW = Math.max(0, width - AXIS.left)
  const plotH = height - AXIS.bottom - AXIS.top
  const slot = data.length ? plotW / data.length : 0
  const barW = Math.max(2, Math.min(18, slot - 2))
  const ticks = [0, max / 2, max]
  const y = (v: number) => AXIS.top + plotH - (v / max) * plotH
  const hovered = hover != null ? data[hover] : null

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={AXIS.left} x2={width} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray={t === 0 ? undefined : "2 3"} />
              <text x={AXIS.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-text-tertiary text-[10px] tabular-nums">{Number.isInteger(t) ? t : t.toFixed(1)}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = AXIS.left + slot * i + slot / 2
            const h = d.count === 0 ? 0 : Math.max(3, (d.count / max) * plotH)
            const top = AXIS.top + plotH - h
            const r = Math.min(4, barW / 2, h)
            return (
              <g key={d.date}>
                {h > 0 && (
                  <path
                    d={`M${cx - barW / 2},${AXIS.top + plotH} V${top + r} Q${cx - barW / 2},${top} ${cx - barW / 2 + r},${top} H${cx + barW / 2 - r} Q${cx + barW / 2},${top} ${cx + barW / 2},${top + r} V${AXIS.top + plotH} Z`}
                    fill="var(--primary)"
                    opacity={hover == null || hover === i ? 1 : 0.45}
                  />
                )}
                {/* Hit target spans the full slot and plot height, bigger than the bar. */}
                <rect x={cx - slot / 2} y={AXIS.top} width={slot} height={plotH} fill="transparent" onMouseEnter={() => setHover(i)} />
              </g>
            )
          })}
          {data.map((d, i) => {
            const every = Math.ceil(data.length / Math.max(2, Math.floor(plotW / 64)))
            if ((data.length - 1 - i) % every !== 0) return null
            return (
              <text key={d.date} x={AXIS.left + slot * i + slot / 2} y={height - 6} textAnchor="middle" className="fill-text-tertiary text-[10px]">
                {new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </text>
            )
          })}
        </svg>
      )}
      {hovered && hover != null && (
        <Tooltip x={AXIS.left + slot * hover + slot / 2} width={width}>
          <p className="text-text-tertiary">{new Date(hovered.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p>
          <p className="mt-0.5 font-medium tabular-nums">{hovered.count} {hovered.count === 1 ? "lead" : "leads"}</p>
        </Tooltip>
      )}
    </div>
  )
}

export type ResponsePoint = { at: string; ms: number | null; up: boolean }

export function ResponseTimeChart({ data, height = 160 }: { data: ResponsePoint[]; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = React.useState<number | null>(null)
  const values = data.map((d) => d.ms ?? 0)
  const max = niceMax(Math.max(0, ...values))
  const left = 40
  const plotW = Math.max(0, width - left - 4)
  const plotH = height - AXIS.bottom - AXIS.top
  const x = (i: number) => left + (data.length <= 1 ? plotW / 2 : (i / (data.length - 1)) * plotW)
  const y = (v: number) => AXIS.top + plotH - (v / max) * plotH

  // Break the line at failed checks rather than drawing a misleading dip to zero.
  const segments: string[] = []
  let current = ""
  data.forEach((d, i) => {
    if (!d.up || d.ms == null) {
      if (current) segments.push(current)
      current = ""
      return
    }
    current += `${current ? "L" : "M"}${x(i).toFixed(1)},${y(d.ms).toFixed(1)}`
  })
  if (current) segments.push(current)

  function onMove(event: React.MouseEvent<SVGSVGElement>) {
    if (data.length === 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - rect.left
    const i = data.length <= 1 ? 0 : Math.round(((px - left) / plotW) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }

  const hovered = hover != null ? data[hover] : null

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Response time per check" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          {[0, max / 2, max].map((t) => (
            <g key={t}>
              <line x1={left} x2={left + plotW} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray={t === 0 ? undefined : "2 3"} />
              <text x={left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-text-tertiary text-[10px] tabular-nums">{Math.round(t)}ms</text>
            </g>
          ))}
          {data.map((d, i) => !d.up && <rect key={d.at} x={x(i) - 1.5} y={AXIS.top} width={3} height={plotH} rx={1.5} fill="var(--destructive)" opacity={0.35} />)}
          {segments.map((d) => <path key={d} d={d} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />)}
          {hovered && hover != null && (
            <>
              <line x1={x(hover)} x2={x(hover)} y1={AXIS.top} y2={AXIS.top + plotH} stroke="var(--foreground)" strokeOpacity={0.2} />
              {hovered.up && hovered.ms != null && <circle cx={x(hover)} cy={y(hovered.ms)} r={4} fill="var(--primary)" stroke="var(--surface-raised)" strokeWidth={2} />}
            </>
          )}
          {data.length > 1 && (
            <>
              <text x={left} y={height - 6} className="fill-text-tertiary text-[10px]">{new Date(data[0].at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric" })}</text>
              <text x={left + plotW} y={height - 6} textAnchor="end" className="fill-text-tertiary text-[10px]">Now</text>
            </>
          )}
        </svg>
      )}
      {hovered && hover != null && (
        <Tooltip x={x(hover)} width={width}>
          <p className="text-text-tertiary">{new Date(hovered.at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
          <p className="mt-0.5 font-medium tabular-nums">{hovered.up ? (hovered.ms != null ? `${hovered.ms}ms` : "Up") : "Down"}</p>
        </Tooltip>
      )}
    </div>
  )
}

// Status-page style strip: one bar per hour, green when every check in
// that hour passed, red when any failed, gray when none ran.
export function UptimeStrip({ slots, className }: { slots: HourSlot[]; className?: string }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = React.useState<number | null>(null)
  const hovered = hover != null ? slots[hover] : null
  const slotW = slots.length ? width / slots.length : 0

  return (
    <div ref={ref} className={cn("relative", className)} onMouseLeave={() => setHover(null)}>
      <div className="flex h-6 gap-[2px]">
        {slots.map((slot, i) => (
          <span
            key={slot.start}
            onMouseEnter={() => setHover(i)}
            className={cn(
              "flex-1 rounded-[2px] transition-opacity",
              slot.total === 0 ? "bg-muted" : slot.down > 0 ? "bg-destructive" : "bg-success/80",
              hover != null && hover !== i && "opacity-50"
            )}
          />
        ))}
      </div>
      {hovered && hover != null && (
        <div
          className="pointer-events-none absolute bottom-full z-10 mb-1.5 -translate-x-1/2 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap text-popover-foreground shadow-md"
          style={{ left: Math.min(Math.max(slotW * hover + slotW / 2, 70), width - 70) }}
        >
          <p className="text-text-tertiary">
            {new Date(hovered.start).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric" })}
          </p>
          <p className="mt-0.5 font-medium">
            {hovered.total === 0 ? "No checks" : hovered.down === 0 ? `All ${hovered.total} checks passed` : `${hovered.down} of ${hovered.total} checks failed`}
          </p>
        </div>
      )}
    </div>
  )
}
