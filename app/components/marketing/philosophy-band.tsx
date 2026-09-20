"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionIndex } from "./section-index"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"

export function PhilosophyBand() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="relative mx-auto max-w-4xl px-6 py-28 text-center"
      >
        <motion.div variants={fadeUp} className="mb-6 flex justify-center">
          <SectionIndex n="06" />
        </motion.div>
        <motion.p
          variants={fadeUp}
          className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          &ldquo;Learning technology by actually building it.&rdquo;
        </motion.p>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-lg text-text-secondary">
          Networking, infrastructure, virtualization, and security — ZeroPoint
          exists because reading about a technology and running it in
          production are very different kinds of understanding.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8">
          <Button variant="outline" render={<Link href="/about" />}>
            About ZeroPoint
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
