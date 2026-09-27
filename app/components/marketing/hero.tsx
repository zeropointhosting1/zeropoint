"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Building2, Globe, HouseWifi, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppMarquee } from "./app-marquee"

// Hidden state stays mostly visible (opacity 0.6, not 0) so the
// server-rendered HTML never paints a blank hero before hydration —
// only a subtle settle-in remains.
const enter = {
  hidden: { opacity: 0.6, y: 10 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const } }),
}

// Plain-language entry points — the first thing a visitor who doesn't know
// the jargon needs is "which of these is me?"
const HELP_WITH = [
  { icon: HouseWifi, title: "Home Wi-Fi", copy: "Better coverage, planned around your home", href: "/home-networking/" },
  { icon: Building2, title: "Business Networking", copy: "Staff, guest, POS, and device networks", href: "/services/" },
  { icon: Laptop, title: "Computer & Tech Help", copy: "On-site or remote, when you need a hand", href: "/tech-support/" },
  { icon: Globe, title: "Websites", copy: "Also available for local businesses", href: "/websites/" },
]

export function Hero() {
  const reduced = !!useReducedMotion()
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto grid min-h-[680px] max-w-6xl items-center gap-16 px-6 pt-32 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:pt-28">
        <div>
          <motion.p custom={0.04} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">Boca Raton, FL · Wi-Fi, networking &amp; tech help</motion.p>
          <motion.h1 custom={reduced ? 0 : 0.1} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="mt-5 text-[2.75rem] leading-[1.04] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-[4rem]">Wi-Fi that works.<br /><span className="bg-gradient-to-r from-primary via-brand-pink to-brand-cyan bg-clip-text text-transparent">Tech help when you need it.</span></motion.h1>
          <motion.p custom={reduced ? 0 : 0.24} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">Better Wi-Fi, UniFi networks, and help with computers, printers, devices, and everyday technology. For Boca Raton homes and small businesses, on-site or remote.</motion.p>
          <motion.div custom={reduced ? 0 : 0.35} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/contact" />}>Get Tech Help <ArrowRight className="size-4" /></Button>
            <Button size="lg" variant="outline" render={<Link href="/home-networking" />}>Improve My Wi-Fi</Button>
          </motion.div>
          <motion.p custom={reduced ? 0 : 0.44} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter} className="mt-6 font-mono text-[11px] tracking-wider text-text-tertiary uppercase">Local support · Clear pricing · You own everything</motion.p>
        </div>

        <motion.div custom={reduced ? 0 : 0.18} initial={reduced ? "visible" : "hidden"} animate="visible" variants={enter}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[0_28px_90px_-42px_var(--accent-glow)]">
            <p className="border-b border-border px-6 py-4 text-sm font-semibold">What do you need help with? <span className="font-normal text-text-secondary">Pick one to learn more.</span></p>
            <ul className="divide-y divide-border">
              {HELP_WITH.map(({ icon: Icon, title, copy, href }) => (
                <li key={href} className={title === "Websites" ? "bg-surface/60" : undefined}>
                  <Link href={href} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-primary/5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block font-medium text-foreground">{title}</span><span className="block text-sm text-text-secondary">{copy}</span></span>
                    <ArrowRight className="size-4 shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
      <AppMarquee label="Apps and equipment we work with" />
    </section>
  )
}
