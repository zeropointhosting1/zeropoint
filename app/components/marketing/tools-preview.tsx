"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen, Calculator, Check, Search, Server, ServerCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"
import { SectionIndex } from "./section-index"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"

const SAMPLE_WORKLOADS = [
  { name: "Home Assistant", ram: "2 GB" },
  { name: "Immich", ram: "4 GB" },
  { name: "Plex", ram: "4 GB" },
]

export function ToolsPreview() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_40%,var(--accent-glow),transparent_72%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={staggerContainer}>
          <motion.div variants={fadeUp}>
            <SectionIndex n="01" className="mb-3" />
            <Eyebrow>Learn + Tools</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Want to build it yourself?<br />We&rsquo;ll help you learn.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-md text-lg leading-relaxed text-text-secondary">
            Size the workloads, find suitable hardware, understand the network, and follow practical field notes from the Lab.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button render={<Link href="/tools" />}>
              Explore planning tools <ArrowUpRight className="size-4" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.2 }} className="overflow-hidden rounded-2xl border border-border bg-background/65">
          <div className="grid md:grid-cols-2">
            <div className="p-6 sm:p-7 md:border-r md:border-border">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Calculator className="size-5" /></span>
                <span className="rounded-full border border-success/20 bg-success/5 px-2.5 py-1 font-mono text-[8px] tracking-wider text-success uppercase">Available now</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">Workload Sizer</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">Choose the services you want to run and get a practical starting point for CPU, memory, and storage.</p>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {SAMPLE_WORKLOADS.map((workload) => (
                  <div key={workload.name} className="flex items-center justify-between py-2.5 text-xs">
                    <span className="flex items-center gap-2 text-text-secondary"><Check className="size-3 text-primary" />{workload.name}</span>
                    <span className="font-mono text-text-tertiary">{workload.ram}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-mono text-[9px] leading-relaxed tracking-wide text-text-tertiary uppercase">Small, sourced app catalog first. Expanded as the data earns trust.</p>
              <Link href="/sizer" className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary">Size your VM <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            </div>

            <div className="border-t border-border p-6 sm:p-7 md:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success"><Search className="size-5" /></span>
                <span className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success/5 px-2.5 py-1 font-mono text-[8px] tracking-wider text-success uppercase"><span className="size-1 rounded-full bg-success" />Available now</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">Hardware Deals</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">Current eBay listings for proven homelab hardware, filtered around machines and network gear worth considering.</p>
              <div className="mt-6 space-y-3">
                {["HP EliteDesk Minis", "UniFi network gear", "Cisco lab hardware"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs text-text-secondary"><Server className="size-3.5 text-text-tertiary" />{item}</div>
                ))}
              </div>
              <Link href="/deals" className="group mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary">See current listings <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            </div>
            <Link href="/deals#rack-concept" className="group flex items-center gap-4 border-t border-border p-5 transition-colors hover:bg-surface-raised/60 sm:p-6"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ServerCog className="size-5" /></span><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><strong className="text-sm">Rack Planner</strong><span className="rounded-full border border-warning/25 px-2 py-0.5 font-mono text-[8px] tracking-wider text-warning uppercase">Planned</span></span><span className="mt-1 block text-xs text-text-secondary">A complete rack layout and price breakdown.</span></span><ArrowUpRight className="size-4 text-text-tertiary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            <Link href="/docs" className="group flex items-center gap-4 border-t border-border p-5 transition-colors hover:bg-surface-raised/60 sm:p-6 md:border-l"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-cyan/10 text-brand-cyan"><BookOpen className="size-5" /></span><span className="min-w-0 flex-1"><strong className="text-sm">Guides + Field Notes</strong><span className="mt-1 block text-xs text-text-secondary">Networking and infrastructure explained from real builds.</span></span><ArrowUpRight className="size-4 text-text-tertiary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
