"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { HardwareCard } from "./hardware-card"
import { HARDWARE } from "@/lib/hardware-catalog"

// `photos` is resolved server-side (fs.existsSync can't run in a "use
// client" file) and handed down as a plain id -> url map.
export function HardwareShowcase({ photos = {} }: { photos?: Record<string, string> }) {
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
            <HardwareCard icon={h.icon} role={h.role} product={h.product} spec={h.spec} photoSrc={photos[h.id]} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
