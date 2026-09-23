"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { Activity, ArrowRight, Boxes, Network, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WORKLOADS } from "@/lib/workload-catalog"
import { withBasePath } from "@/lib/base-path"
import { LAST_UPDATED } from "@/lib/homelab-data"

// Logo files live in /public/logos, sourced from each project's own brand
// assets (or simple-icons for the plain single-color marks).
const WORKLOAD_LOGOS: Record<string, string> = {
  "home-assistant": "home-assistant",
  immich: "immich",
  plex: "plex",
  nextcloud: "nextcloud",
  jellyfin: "jellyfin",
  pihole: "pihole",
  vaultwarden: "vaultwarden",
  grafana: "grafana",
  gitea: "gitea",
}

// What we help people set up — the sizer's app catalog, plus the network
// platforms Services covers that aren't self-hosted apps.
const STACK = [
  ...WORKLOADS.map((workload) => ({ name: workload.name, logo: WORKLOAD_LOGOS[workload.id] })),
  { name: "UniFi", logo: "ubiquiti" },
  { name: "Cisco", logo: "cisco" },
]

// One copy of STACK renders far narrower than the full-bleed marquee
// container on wide viewports, so two copies alone leave the tail end
// scrolling into empty space before the loop resets. Repeating it enough
// times keeps trailing content on screen at every point in the cycle — the
// keyframe's -20% (1/MARQUEE_COPIES) travels exactly one STACK-width either
// way, so the loop speed is unaffected by the extra copies.
const MARQUEE_COPIES = 5
const MARQUEE_TRACK = Array.from({ length: MARQUEE_COPIES }, () => STACK).flat()

// Hidden state stays mostly visible (opacity 0.6, not 0) so the
// server-rendered HTML never paints a blank hero before hydration —
// only a subtle settle-in remains.
const enter = {
  hidden: { opacity: 0.6, y: 10 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const } }),
}

const LAB_SIGNALS = [
  { icon: Server, label: "Compute", value: "Proxmox cluster" },
  { icon: Network, label: "Network", value: "UniFi + Cisco lab" },
  { icon: Boxes, label: "Services", value: "Self-hosted stack" },
  { icon: Activity, label: "Approach", value: "Built and documented" },
]

export function Hero() {
  const reduced = !!useReducedMotion()
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto grid min-h-[760px] max-w-6xl items-center gap-16 px-6 pt-32 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:pt-28">
        <div>
          <motion.p custom={0.04} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">Homelabs · Home Networks · Small Business</motion.p>
          <motion.h1 custom={reduced ? 0 : 0.1} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">Build better<br /><span className="bg-gradient-to-r from-primary via-brand-pink to-brand-cyan bg-clip-text text-transparent">technology.</span></motion.h1>
          <motion.p custom={reduced ? 0 : 0.24} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">From your first homelab to your home network and small business, ZeroPoint helps you plan, build, and understand the technology you rely on.</motion.p>
          <motion.div custom={reduced ? 0 : 0.35} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/contact" />}>Book a free consult <ArrowRight className="size-4" /></Button>
            <Button size="lg" variant="outline" render={<Link href="/lab" />}>Explore the lab</Button>
          </motion.div>
          <motion.p custom={reduced ? 0 : 0.44} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="mt-6 font-mono text-[9px] tracking-wider text-text-tertiary uppercase">Built hands-on · Explained clearly · Documented properly</motion.p>
        </div>

        <motion.div custom={reduced ? 0 : 0.18} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter}>
          <div className="theme-dark overflow-hidden rounded-2xl border border-primary/20 bg-background shadow-[0_28px_90px_-42px_var(--accent-glow)]">
            <div className="flex items-center justify-between border-b border-border px-6 py-5"><div><p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">Inside ZeroPoint Lab</p><p className="mt-1 text-sm text-text-secondary">The infrastructure behind the brand</p></div><span className="font-mono text-[9px] tracking-wider text-text-tertiary uppercase">As of {LAST_UPDATED}</span></div>
            <div className="grid grid-cols-2 gap-px bg-border">{LAB_SIGNALS.map(({ icon: Icon, label, value }) => <div key={label} className="bg-surface p-5"><Icon className="size-4 text-primary" /><p className="mt-6 font-mono text-[9px] tracking-wider text-text-tertiary uppercase">{label}</p><p className="mt-1 text-sm font-medium text-foreground">{value}</p></div>)}</div>
            <Link href="/network" className="group flex items-center justify-between px-6 py-4 text-sm text-text-secondary transition-colors hover:text-foreground"><span>View the working infrastructure</span><ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
          </div>
        </motion.div>
      </div>

      <div className="theme-dark relative border-t border-border bg-background py-6">
        <p className="mx-auto max-w-6xl px-6 font-mono text-xs tracking-[0.16em] text-text-secondary uppercase">Platforms we work with</p>
        <div className="relative mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max gap-3 animate-marquee">
            {MARQUEE_TRACK.map((item, index) => <StackPill key={index} {...item} duplicate={index >= STACK.length} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function StackPill({ name, logo, duplicate }: { name: string; logo: string; duplicate?: boolean }) {
  return (
    <span aria-hidden={duplicate} className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-surface-raised py-2 pr-4 pl-2 text-sm font-medium text-foreground shadow-[inset_0_1px_0_oklch(1_0_0/6%)]">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
        <Image
          src={withBasePath(`/logos/${logo}.svg`)}
          alt={`${name} logo`}
          width={22}
          height={22}
          unoptimized
          className="size-[22px] object-contain"
        />
      </span>
      {name}
    </span>
  )
}
