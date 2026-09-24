"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight, Box, Network, Radio, Server } from "lucide-react"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { useCountUp } from "@/lib/use-count-up"
import { Eyebrow } from "./eyebrow"
import { SectionIndex } from "./section-index"
import { HOMELAB_STATS, LAST_UPDATED } from "@/lib/homelab-data"

const TECH = [
  { label: "UniFi", detail: "Network" },
  { label: "Proxmox", detail: "Compute" },
  { label: "Cisco", detail: "Lab" },
  { label: "Linux", detail: "Systems" },
  { label: "Docker", detail: "Containers" },
  { label: "OPNsense", detail: "Firewall" },
]

const STATS = [
  { label: "Nodes", value: HOMELAB_STATS.nodes, icon: Server },
  { label: "Services", value: HOMELAB_STATS.services, icon: Box },
  { label: "VLANs", value: HOMELAB_STATS.vlans, icon: Network },
  { label: "Clients", value: HOMELAB_STATS.clients, icon: Radio },
]

function Stat({ label, value, start, icon: Icon }: { label: string; value: number; start: boolean; icon: React.ElementType }) {
  const count = useCountUp(value, start)
  return (
    <div className="group relative p-5 sm:p-6">
      <Icon className="size-4 text-text-tertiary transition-colors group-hover:text-primary" />
      <div className="mt-5 font-mono text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{count}</div>
      <div className="mt-1 text-sm text-text-secondary">{label}</div>
    </div>
  )
}

export function HomelabStrip() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_20%_50%,var(--accent-glow),transparent_70%)]" />
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="relative"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionIndex n="01" className="mb-3" />
              <Eyebrow>Running right now</Eyebrow>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">The lab, at a glance.</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary">
                Real infrastructure behind ZeroPoint—from the network edge to the workloads running on it.
              </p>
              <p className="mt-2 font-mono text-[9px] tracking-wider text-text-tertiary uppercase">Updated by hand · As of {LAST_UPDATED}</p>
            </div>
            <Link
              href="/network"
              className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Explore the network
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <div ref={ref} className="mt-12 grid grid-cols-2 divide-x divide-y divide-border border-y border-border sm:grid-cols-4 sm:divide-y-0">
            {STATS.map((s) => <Stat key={s.label} {...s} start={inView} />)}
          </div>

          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-[9px] tracking-[0.18em] text-text-tertiary uppercase">Stack</span>
            {TECH.map((tech) => (
              <span key={tech.label} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="font-mono text-[11px] text-foreground">{tech.label}</span>
                <span className="hidden text-[10px] text-text-tertiary sm:inline">{tech.detail}</span>
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
