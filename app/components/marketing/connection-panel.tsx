"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Check, LockKeyhole, ShieldQuestion } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ConnectionFlowDiagram } from "./connection-flow-diagram"
import { SectionIndex } from "./section-index"
import { fadeUp, fadeUpReduced, staggerContainer, viewportOnce } from "@/lib/motion"
import { parseUserAgent } from "@/lib/user-agent"

// Sized to match LocationBeacon's own rendered aspect ratio (the map's
// viewBox) so mounting it doesn't visibly jump the page height.
function LocationBeaconPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-surface-raised p-6 shadow-[0_0_40px_-16px_var(--accent-glow)]">
      <div className="aspect-[980/500] w-full" />
      <div className="mt-4 border-t border-border pt-4">
        <span className="animate-pulse font-mono text-xs tracking-wider text-text-tertiary uppercase">
          {label}
        </span>
      </div>
    </div>
  )
}

const LocationBeacon = dynamic(() => import("./location-beacon"), {
  ssr: false,
  loading: () => <LocationBeaconPlaceholder label="Locating…" />,
})

// Fully static site (GitHub Pages) — there's no server to parse the request,
// so everything here is read from the browser after mount instead.
type Detected = {
  device: string
  os: string
  browser: string
  language: string
  isSecure: boolean
  screen: string
}

const EXPLAINERS: { label: string; source: string }[] = [
  {
    label: "Device / OS / Browser",
    source:
      "Read from your browser's navigator.userAgent — the same string every website receives, parsed here in JavaScript rather than on a server (this site is static and has no server).",
  },
  {
    label: "Screen",
    source:
      "Read locally by your browser once the page loads. It never leaves your device unless a script explicitly sends it — this page doesn't.",
  },
  {
    label: "Language",
    source:
      "Your browser's language setting (navigator.language) — the same signal sites use to offer the right language automatically.",
  },
  {
    label: "Connection",
    source:
      "Whether this page loaded over HTTPS (encrypted) or plain HTTP, read from the page's own URL.",
  },
  {
    label: "Session",
    source:
      "A simple indicator that this page load is active — not a persistent identifier, and nothing is stored about this visit.",
  },
  {
    label: "Approximate Location",
    source:
      "Your browser calls a third-party geolocation lookup (ipapi.co) directly to estimate a city from your IP address. That lookup happens entirely in your browser — this site has no server, so your IP never touches ZeroPoint's own infrastructure at any point.",
  },
]

const NOT_COLLECTED = [
  "Your exact public IP address isn't shown on this page",
  "No canvas/font/GPU fingerprinting",
  "No hardware serials, usernames, or MAC addresses — browsers don't expose these anyway",
  "No persistent cross-visit tracking identifier",
]

export function ConnectionPanel() {
  const [detected, setDetected] = React.useState<Detected | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const diagramRef = React.useRef<HTMLDivElement>(null)
  const inView = useInView(diagramRef, { once: false, amount: 0.4 })
  // Separate from `inView` above (once: false) — that one intentionally
  // toggles so the diagram animation pauses off-screen. The map should only
  // ever load once; tying it to a toggling flag made it unmount/remount
  // (and refetch, and restart its animation) every time you scrolled past
  // the section boundary in either direction.
  const locationVisible = useInView(diagramRef, { once: true, amount: 0.2 })
  const reduced = useReducedMotion()
  const isReduced = !!reduced
  const variants = isReduced ? fadeUpReduced : fadeUp

  React.useEffect(() => {
    const id = setTimeout(() => {
      const ua = parseUserAgent(navigator.userAgent)
      setDetected({
        device: ua.device,
        os: ua.os,
        browser: ua.browser,
        language: navigator.language || "Unknown",
        isSecure: window.location.protocol === "https:",
        screen: `${window.screen.width} × ${window.screen.height}`,
      })
    }, 0)
    return () => clearTimeout(id)
  }, [])

  const rows: { label: string; value: string }[] = [
    { label: "Device", value: detected?.device ?? "Detecting…" },
    { label: "Operating System", value: detected?.os ?? "Detecting…" },
    { label: "Browser", value: detected?.browser ?? "Detecting…" },
    { label: "Screen", value: detected?.screen ?? "Detecting…" },
    { label: "Language", value: detected?.language ?? "Detecting…" },
    {
      label: "Connection",
      value: detected ? (detected.isSecure ? "HTTPS · Encrypted" : "HTTP") : "Detecting…",
    },
    { label: "Session", value: "Active — this visit" },
  ]

  return (
    <section id="connection" className="relative scroll-mt-16 overflow-hidden border-b border-border bg-surface">
      <div className="bg-connection-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mb-14 max-w-2xl"
        >
          <motion.div variants={variants}>
            <SectionIndex n="04" className="mb-3" />
          </motion.div>
          <motion.p
            variants={variants}
            className="mb-4 font-mono text-xs tracking-[0.2em] text-primary uppercase"
          >
            Live, not tracked
          </motion.p>
          <motion.h2
            variants={variants}
            className="text-4xl font-bold tracking-tight text-balance sm:text-5xl"
          >
            You&rsquo;re connected to ZeroPoint.
          </motion.h2>
          <motion.p variants={variants} className="mt-4 text-lg text-text-secondary">
            Right now, your browser is holding a real connection to this
            server. Here&rsquo;s what that connection looks like — and
            exactly what it does (and doesn&rsquo;t) expose.
          </motion.p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="rounded-2xl border border-primary/15 bg-surface-raised p-6 shadow-[0_0_40px_-16px_var(--accent-glow)]"
          >
            <motion.p
              variants={variants}
              className="mb-5 font-mono text-[11px] tracking-[0.2em] text-text-tertiary uppercase"
            >
              Your Connection
            </motion.p>
            <dl className="divide-y divide-border">
              {rows.map((row) => (
                <motion.div
                  key={row.label}
                  variants={variants}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <dt className="text-sm text-text-secondary">{row.label}</dt>
                  <dd className="font-mono text-sm text-foreground">{row.value}</dd>
                </motion.div>
              ))}
            </dl>

            <motion.div variants={variants} className="mt-6">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setDialogOpen(true)}
              >
                <ShieldQuestion className="size-3.5" />
                What can this website see?
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            ref={diagramRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.2 }}
            className="relative flex min-w-0 flex-col justify-center overflow-hidden rounded-2xl border border-primary/20 bg-surface-raised shadow-[0_0_40px_-16px_var(--accent-glow)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,var(--accent-glow),transparent_70%)]" />
            <div className="relative flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">Request / Response</p>
                <p className="mt-1.5 text-sm text-text-secondary">One secure round trip, visualized live.</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3 py-1.5 font-mono text-[10px] tracking-wider text-success uppercase">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                Live
              </div>
            </div>
            <div className="relative px-4 py-5 sm:px-6">
              <ConnectionFlowDiagram animated={inView && !isReduced} idPrefix="detail-connection" />
            </div>
            <div className="relative grid grid-cols-2 border-t border-border bg-background/20 sm:grid-cols-3">
              <div className="flex items-center gap-2.5 border-r border-border px-4 py-3.5 sm:px-5">
                <LockKeyhole className="size-3.5 shrink-0 text-primary" />
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">Protocol</p>
                  <p className="mt-0.5 text-xs font-medium">{detected?.isSecure ? "HTTPS" : "HTTP"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3.5 sm:border-r sm:border-border sm:px-5">
                <Check className="size-3.5 shrink-0 text-success" />
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">Status</p>
                  <p className="mt-0.5 text-xs font-medium">200 OK</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2.5 border-t border-border px-4 py-3.5 sm:col-span-1 sm:border-t-0 sm:px-5">
                <span className="size-3.5 shrink-0 rounded-full border border-primary/40 bg-primary/10 p-1"><span className="block size-full rounded-full bg-primary" /></span>
                <div>
                  <p className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">Connection</p>
                  <p className="mt-0.5 text-xs font-medium">Active now</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.2 }}
          className="mt-8"
        >
          <p className="mb-4 font-mono text-[11px] tracking-[0.2em] text-text-tertiary uppercase">
            Approximate Location
          </p>
          {locationVisible ? (
            <LocationBeacon />
          ) : (
            <LocationBeaconPlaceholder label="Scroll to load" />
          )}
        </motion.div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>What this website can see</DialogTitle>
            <DialogDescription>
              Every website sees some of this automatically — it&rsquo;s part
              of how the web works, not something ZeroPoint specifically
              collects.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {EXPLAINERS.map((e) => (
              <div key={e.label}>
                <div className="text-sm font-medium text-foreground">{e.label}</div>
                <p className="mt-1 text-sm text-text-secondary">{e.source}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-border pt-4">
            <div className="text-sm font-medium text-foreground">
              What ZeroPoint deliberately doesn&rsquo;t do
            </div>
            <ul className="mt-2 grid gap-1.5">
              {NOT_COLLECTED.map((item) => (
                <li key={item} className="text-sm text-text-secondary">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
