"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Camera, HouseWifi, RadioTower, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"

const CAPABILITIES = [
  { icon: HouseWifi, title: "Property-wide Wi-Fi", copy: "Coverage planned around buildings, outdoor areas, and the available internet connection." },
  { icon: Camera, title: "Cameras and monitoring", copy: "See what is happening without exposing devices carelessly to the public internet." },
  { icon: RadioTower, title: "Connection resilience", copy: "Primary internet and cellular-backup planning for properties that cannot simply go offline." },
  { icon: ShieldCheck, title: "Secure device separation", copy: "Keep guests, cameras, smart devices, and trusted computers in appropriate network zones." },
]

export function PropertyBand() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_80%_20%,var(--accent-glow),transparent_74%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-28 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-20">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <motion.div variants={fadeUp}><Eyebrow>ZeroPoint Home</Eyebrow></motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">A better network for every part of the property.</motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-md text-lg leading-relaxed text-text-secondary">Wi-Fi, UniFi, IoT separation, cameras, racks, and troubleshooting for homes, cabins, rentals, workshops, and connected outbuildings.</motion.p>
          <motion.div variants={fadeUp} className="mt-8"><Button render={<Link href="/property-technology" />}>Explore home networking <ArrowUpRight className="size-4" /></Button></motion.div>
        </motion.div>
        <div className="grid gap-3 sm:grid-cols-2">{CAPABILITIES.map(({ icon: Icon, title, copy }, index) => <motion.article key={title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.2, delay: index * 0.07 }} className="rounded-2xl border border-border bg-surface-raised p-6"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p></motion.article>)}</div>
      </div>
    </section>
  )
}
