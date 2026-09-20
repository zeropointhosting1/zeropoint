"use client"

import { Router, Waypoints, Wifi } from "lucide-react"
import { motion } from "framer-motion"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { HardwareCard } from "./hardware-card"

const HARDWARE = [
  {
    id: "gateway",
    role: "Gateway",
    product: "UniFi Cloud Gateway Ultra",
    spec: "Routing, firewall, and the UniFi OS console",
    icon: Router,
  },
  {
    id: "switch",
    role: "Switch",
    product: "UniFi Flex Mini",
    spec: "Compact managed switch feeding the AP",
    icon: Waypoints,
  },
  {
    id: "ap",
    role: "Access Point",
    product: "UniFi U7 Lite",
    spec: "Broadcasts the Trusted, IoT & Guest SSIDs",
    icon: Wifi,
  },
]

export function HardwareShowcase() {
  return (
    <div>
      <p className="mb-4 font-mono text-[11px] tracking-[0.2em] text-text-tertiary uppercase">
        Hardware
      </p>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="grid gap-4 sm:grid-cols-3"
      >
        {HARDWARE.map((h) => (
          <motion.div key={h.id} variants={fadeUp}>
            <HardwareCard icon={h.icon} role={h.role} product={h.product} spec={h.spec} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
