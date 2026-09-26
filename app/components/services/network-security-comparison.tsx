"use client"

import * as React from "react"
import { LayoutGroup, MotionConfig, motion } from "framer-motion"
import { ArrowDown, Cctv, HardDrive, Laptop, Lightbulb, ShieldCheck, Smartphone, TriangleAlert, Tv, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// Built from HTML boxes rather than a fixed-size SVG so labels wrap
// instead of clipping, and the zones stack on a phone. Each device keeps
// the same layoutId in both views, so toggling slides it into its new zone.

type Mode = "flat" | "separated"
type ZoneId = "personal" | "smart" | "guest"

const DEVICES: { id: string; name: string; icon: React.ElementType; zone: ZoneId; hacked?: boolean }[] = [
  { id: "laptop", name: "Laptop", icon: Laptop, zone: "personal" },
  { id: "phone", name: "Your phone", icon: Smartphone, zone: "personal" },
  { id: "photos", name: "Photo backup drive", icon: HardDrive, zone: "personal" },
  { id: "bulb", name: "Smart bulb", icon: Lightbulb, zone: "smart", hacked: true },
  { id: "camera", name: "Camera", icon: Cctv, zone: "smart" },
  { id: "tv", name: "Smart TV", icon: Tv, zone: "smart" },
  { id: "guest", name: "Guest's phone", icon: Users, zone: "guest" },
]

const ZONES: { id: ZoneId; title: string; copy: string; tone: "safe" | "warn" | "muted" }[] = [
  { id: "personal", title: "Your devices", copy: "The bulb cannot connect to these", tone: "safe" },
  { id: "smart", title: "Smart devices", copy: "A separate group on your home network", tone: "warn" },
  { id: "guest", title: "Guest Wi-Fi", copy: "A separate group on your home network", tone: "muted" },
]

const ZONE_TONES = {
  safe: "border-success/35 bg-success/5",
  warn: "border-warning/40 bg-warning/5",
  muted: "border-border bg-surface/60",
}

function DeviceChip({ device, mode }: { device: (typeof DEVICES)[number]; mode: Mode }) {
  const Icon = device.icon
  const status = device.hacked ? "hacked" : mode === "flat" ? "exposed" : device.zone === "smart" ? "contained" : "safe"
  const tag = { hacked: "Hacked bulb", exposed: "Bulb can reach this", contained: "Still with the bulb", safe: "Blocked from the bulb" }[status]
  return (
    <motion.div
      layoutId={device.id}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={cn(
        "relative grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1 rounded-xl border bg-background/80 px-3 py-2.5",
        status === "hacked" && "border-destructive/60",
        status === "exposed" && "border-destructive/30",
        status === "contained" && "border-warning/30",
        status === "safe" && "border-success/30"
      )}
    >
      {status === "hacked" && <span className="pointer-events-none absolute inset-0 motion-safe:animate-pulse rounded-xl ring-2 ring-destructive/40" />}
      <span className={cn(
        "row-span-2 flex size-8 shrink-0 items-center justify-center rounded-lg",
        status === "hacked" || status === "exposed" ? "bg-destructive/12 text-destructive" : status === "contained" ? "bg-warning/12 text-warning" : "bg-success/12 text-success"
      )}>
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{device.name}</span>
      <span className={cn(
        "col-start-2 text-xs font-medium",
        status === "hacked" || status === "exposed" ? "text-destructive" : status === "contained" ? "text-warning" : "text-success"
      )}>
        {tag}
      </span>
    </motion.div>
  )
}

export function NetworkSecurityComparison() {
  const [mode, setMode] = React.useState<Mode>("flat")
  const separated = mode === "separated"

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/85 shadow-[inset_0_1px_0_oklch(1_0_0/8%)]">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm font-medium text-foreground">What if a smart bulb gets hacked?</p>
          <div role="group" aria-label="Choose a network setup" className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-background/60 p-1">
            {([["flat", "All mixed together"], ["separated", "Kept separate"]] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => setMode(value)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  mode === value ? "bg-primary text-primary-foreground" : "text-text-secondary hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-border bg-background/60 p-5 text-center">
            <span className="flex items-center gap-2 text-sm font-semibold"><Lightbulb aria-hidden="true" className="size-5 text-warning" />One hacked smart bulb</span>
            <ArrowDown aria-hidden="true" className="size-5 text-text-tertiary" />
            <span className={cn("flex items-center gap-2 text-sm font-semibold", separated ? "text-success" : "text-destructive")}>
              {separated ? <ShieldCheck aria-hidden="true" className="size-5 shrink-0" /> : <TriangleAlert aria-hidden="true" className="size-5 shrink-0" />}
              {separated ? "Your router blocks its path to your personal devices" : "It can try to connect to your other devices"}
            </span>
          </div>
          <LayoutGroup>
            {separated ? (
              <div className="grid gap-4 lg:grid-cols-3">
                {ZONES.map((zone) => (
                  <div key={zone.id} className={cn("rounded-2xl border p-4", ZONE_TONES[zone.tone])}>
                    <p className="font-semibold text-foreground">{zone.title}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{zone.copy}</p>
                    <div className="mt-4 grid gap-2">
                      {DEVICES.filter((device) => device.zone === zone.id).map((device) => <DeviceChip key={device.id} device={device} mode={mode} />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-destructive/35 bg-destructive/5 p-4">
                <p className="font-semibold text-foreground">All your devices share the same space</p>
                <p className="mt-0.5 text-xs text-text-secondary">No network boundary between the bulb and your personal devices</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {DEVICES.map((device) => <DeviceChip key={device.id} device={device} mode={mode} />)}
                </div>
              </div>
            )}
          </LayoutGroup>

          <div
            aria-live="polite"
            className={cn(
              "mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed",
              separated ? "border-success/30 bg-success/5 text-foreground" : "border-destructive/30 bg-destructive/5 text-foreground"
            )}
          >
            {separated ? <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> : <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />}
            {separated
              ? "With rules set on your router, the bulb can use the internet but cannot connect to your personal devices or guest network. Other smart devices in its group may still be at risk."
              : "The bulb can try to reach your laptop, phone, or backup drive. That does not mean they are hacked too, but there is no network boundary to stop it."}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-text-secondary">Same internet connection, clearer boundaries. We set up the rules and allow the connections you need, like controlling your lights from your phone.</p>
        </div>
      </div>
    </MotionConfig>
  )
}
