"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Network, HardDrive, ServerCog, KeyRound, Headset } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"
import { SectionIndex } from "./section-index"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { formatServicePrice, SERVICE_OFFERINGS } from "@/lib/services"

const OFFERING_ICONS: Record<string, React.ElementType> = {
  unifi: Network,
  wifi: HardDrive,
  homelab: ServerCog,
  "self-hosting": KeyRound,
  consulting: Headset,
}

export function ServicesBand() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_20%_30%,var(--accent-glow),transparent_72%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <motion.div variants={fadeUp}>
            <SectionIndex n="03" className="mb-3" />
            <Eyebrow>ZeroPoint Business</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Practical IT without<br />an internal IT department.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-md text-lg leading-relaxed text-text-secondary">
            Networks, Wi-Fi, device security, backups, and focused support for small organizations that need reliable technology without unnecessary complexity.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button render={<Link href="/services" />}>
              Explore business services <ArrowUpRight className="size-4" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.2 }} className="overflow-hidden rounded-2xl border border-border bg-background/65">
          <div className="divide-y divide-border">
            {SERVICE_OFFERINGS.map((service) => {
              const Icon = OFFERING_ICONS[service.id] ?? ServerCog
              return (
                <Link key={service.id} href="/services" className="group flex items-center gap-4 p-5 transition-colors hover:bg-surface-raised/60 sm:p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <strong className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{service.title}</strong>
                      <span className="font-mono text-xs text-primary">{formatServicePrice(service.pricing)}</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-text-secondary">{service.short}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-text-tertiary transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
