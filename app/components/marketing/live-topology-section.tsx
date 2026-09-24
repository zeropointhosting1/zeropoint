"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { LiveTopology } from "./live-topology"
import { SectionIndex } from "./section-index"
import { viewportOnce } from "@/lib/motion"

export function LiveTopologySection() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.3 })
  const reduced = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-topology-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <div className="mb-3 flex justify-center"><SectionIndex n="03" /></div>
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex size-1.5">{!reduced && <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />}<span className="relative inline-flex size-1.5 rounded-full bg-primary" /></span>
            <p className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">The actual home network</p>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Not a concept. The real topology.</h2>
          <p className="mt-3 text-text-secondary">A sanitized view of the hardware, workloads, and segmented networks running behind ZeroPoint.</p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.2 }}
          className="overflow-x-auto rounded-2xl border border-primary/15 bg-surface-raised p-5 shadow-[0_0_50px_-18px_var(--accent-glow)] sm:p-8"
        >
          <div className="min-w-[760px] sm:min-w-[900px]">
            <LiveTopology animated={inView && !reduced} />
          </div>
        </motion.div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary sm:hidden">Swipe to explore the full diagram</p>
          <Link href="/network" className="group ml-auto inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground">Explore the network <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
        </div>
      </div>
    </section>
  )
}
