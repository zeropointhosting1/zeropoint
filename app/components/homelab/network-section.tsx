"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { HomeNetworkTopology } from "./home-network-topology"
import { VlanLegend } from "./vlan-legend"
import { HardwareShowcase } from "./hardware-showcase"
import { CiscoLabPanel } from "./cisco-lab-panel"
import { HOME_CHAIN, VLANS } from "@/lib/homelab-data"

export function NetworkSection() {
  const homeRef = React.useRef<HTMLDivElement>(null)
  const labRef = React.useRef<HTMLDivElement>(null)
  const homeInView = useInView(homeRef, { once: false, amount: 0.4 })
  const labInView = useInView(labRef, { once: false, amount: 0.4 })
  const reduced = useReducedMotion()

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="max-w-xl"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>Two networks, on purpose</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Home network &amp; Cisco lab
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-text-secondary">
            The house runs on UniFi. The Cisco lab hangs off a dedicated
            link, but OPNsense gives it its own routing domain and firewall
            policy — used purely for learning, and never trusted by the
            home VLANs.
          </motion.p>
        </motion.div>

        {/* Home network */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="mt-14 flex items-center gap-2"
        >
          <h3 className="text-lg font-semibold text-foreground">Home Network</h3>
          <span className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
            AT&amp;T → UniFi
          </span>
        </motion.div>

        <motion.div
          ref={homeRef}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mt-5 rounded-2xl border border-border bg-surface-raised p-6 sm:p-8"
        >
          <HomeNetworkTopology chain={HOME_CHAIN} vlans={VLANS} animated={homeInView && !reduced} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <HardwareShowcase />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10"
        >
          <VlanLegend vlans={VLANS} />
        </motion.div>

        {/* Cisco lab */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="mt-20 flex items-center gap-2"
        >
          <h3 className="text-lg font-semibold text-foreground">Cisco Lab</h3>
          <span className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
            Own routing domain · Enterprise gear
          </span>
        </motion.div>

        <motion.div
          ref={labRef}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mt-5"
        >
          <CiscoLabPanel animated={labInView && !reduced} />
        </motion.div>
      </div>
    </section>
  )
}
