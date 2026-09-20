"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DualNetworkGlyph } from "./dual-network-glyph"
import { Eyebrow } from "./eyebrow"
import { SectionIndex } from "./section-index"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"

export function NetworkTeaser() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.4 })
  const reduced = useReducedMotion()

  return (
    <section className="theme-dark relative overflow-hidden border-b border-border bg-background">
      <div className="pointer-events-none absolute inset-0 bg-topology-glow" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-28 md:grid-cols-2 md:items-center md:gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <SectionIndex n="05" className="mb-3" />
            <Eyebrow>Interactive</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
          >
            The network, mapped.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-md text-lg text-text-secondary">
            Two networks with two different jobs — the house runs on UniFi,
            the Cisco lab gets its own routing domain off OPNsense. One
            never trusts the other.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button render={<Link href="/network" />}>
              View the Network
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-primary/20 bg-surface/85 p-6 shadow-[0_24px_70px_-38px_var(--accent-glow),inset_0_1px_0_oklch(1_0_0/8%)]"
        >
          <DualNetworkGlyph animated={inView && !reduced} />
        </motion.div>
      </div>
    </section>
  )
}
