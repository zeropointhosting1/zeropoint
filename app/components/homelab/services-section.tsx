"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ServiceList } from "./service-list"
import { SERVICES } from "@/lib/homelab-data"

export function ServicesSection() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="max-w-xl"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>Workloads</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Virtual machines &amp; containers
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-text-secondary">
            Shown by role rather than hostname — enough to see what the lab
            does without handing out a map of it.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10"
        >
          <ServiceList services={SERVICES} />
        </motion.div>
      </div>
    </section>
  )
}
