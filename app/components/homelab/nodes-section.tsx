"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { NodeCard } from "./node-card"
import { NODES } from "@/lib/homelab-data"

export function NodesSection() {
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
            <Eyebrow>Hypervisors</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Proxmox nodes
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-text-secondary">
            Two nodes, clustered, running the virtual machines and containers
            below.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-10 grid gap-6 sm:grid-cols-2"
        >
          {NODES.map((node) => (
            <motion.div key={node.id} variants={fadeUp}>
              <NodeCard node={node} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
