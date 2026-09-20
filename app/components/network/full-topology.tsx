"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { LiveTopology } from "@/components/marketing/live-topology"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { viewportOnce } from "@/lib/motion"

export function FullTopology() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.25 })
  const reduced = useReducedMotion()

  return (
    <section className="theme-dark relative overflow-hidden border-b border-border bg-background">
      <div className="bg-topology-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl"
        >
          <Eyebrow>Full topology</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            The whole network, end to end.
          </h2>
          <p className="mt-3 text-text-secondary">
            Internet edge, gateway, wireless clients, VLANs, switches, hosts,
            and running workloads in one sanitized view.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="overflow-x-auto rounded-2xl border border-primary/20 bg-surface/85 p-5 shadow-[0_28px_90px_-42px_var(--accent-glow),inset_0_1px_0_oklch(1_0_0/8%)] sm:p-8"
        >
          <div className="min-w-[760px] sm:min-w-[900px]">
            <LiveTopology animated={inView && !reduced} />
          </div>
        </motion.div>
        <p className="mt-4 text-xs text-text-tertiary sm:hidden">Swipe to explore the full diagram</p>
      </div>
    </section>
  )
}
