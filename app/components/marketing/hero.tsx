"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, ArrowUpRight, Calculator, Network, Users, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DiscordIcon } from "@/components/nav/brand-icons"
import { DISCORD_URL } from "@/lib/site-config"
import { WORKLOADS } from "@/lib/workload-catalog"

// Logo files live in /public/logos, sourced from each project's own brand
// assets (or simple-icons for the plain single-color marks).
const WORKLOAD_LOGOS: Record<string, string> = {
  "home-assistant": "home-assistant",
  immich: "immich",
  plex: "plex",
  nextcloud: "nextcloud",
  jellyfin: "jellyfin",
  pihole: "pihole",
  vaultwarden: "vaultwarden",
  grafana: "grafana",
  gitea: "gitea",
}

// What we help people set up — the sizer's app catalog, plus the network
// platforms Services covers that aren't self-hosted apps.
const STACK = [
  ...WORKLOADS.map((workload) => ({ name: workload.name, logo: WORKLOAD_LOGOS[workload.id] })),
  { name: "UniFi", logo: "ubiquiti" },
  { name: "Cisco", logo: "cisco" },
]

// One copy of STACK renders far narrower than the full-bleed marquee
// container on wide viewports, so two copies alone leave the tail end
// scrolling into empty space before the loop resets. Repeating it enough
// times keeps trailing content on screen at every point in the cycle — the
// keyframe's -20% (1/MARQUEE_COPIES) travels exactly one STACK-width either
// way, so the loop speed is unaffected by the extra copies.
const MARQUEE_COPIES = 5
const MARQUEE_TRACK = Array.from({ length: MARQUEE_COPIES }, () => STACK).flat()

const enter = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const } }),
}

const PATHS = [
  { icon: Users, title: "Community", copy: "Talk shop with people building the same stack.", href: "/community" },
  { icon: Calculator, title: "Tools", copy: "Size workloads, find hardware, plan the rack.", href: "/tools" },
  { icon: Wrench, title: "Services", copy: "UniFi, homelab, and self-hosted setups—done for you.", href: "/services" },
  { icon: Network, title: "The Lab", copy: "See the real infrastructure behind ZeroPoint.", href: "/network" },
]

export function Hero() {
  const reduced = !!useReducedMotion()
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto grid min-h-[760px] max-w-6xl items-center gap-16 px-6 pt-32 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:pt-28">
        <div>
          <motion.p custom={0.04} initial="hidden" animate="visible" variants={enter} className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">A home for homelabbers</motion.p>
          <motion.h1 custom={reduced ? 0 : 0.1} initial="hidden" animate="visible" variants={enter} className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">Your homelab.<br /><span className="bg-gradient-to-r from-primary via-brand-pink to-brand-cyan bg-clip-text text-transparent">Done properly.</span></motion.h1>
          <motion.p custom={reduced ? 0 : 0.24} initial="hidden" animate="visible" variants={enter} className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">ZeroPoint is the community, the tools, and the hands-on help for planning, building, and securing a homelab you actually understand—not just one that works until it doesn&rsquo;t.</motion.p>
          <motion.div custom={reduced ? 0 : 0.35} initial="hidden" animate="visible" variants={enter} className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}><DiscordIcon className="size-4" />Join the Discord</Button>
            <Button size="lg" variant="outline" render={<Link href="/services" />}>Get services <ArrowRight className="size-4" /></Button>
          </motion.div>
          <motion.p custom={reduced ? 0 : 0.44} initial="hidden" animate="visible" variants={enter} className="mt-6 font-mono text-[9px] tracking-wider text-text-tertiary uppercase">Real requirements · Real listings · Real infrastructure</motion.p>
        </div>

        <motion.div custom={reduced ? 0 : 0.18} initial="hidden" animate="visible" variants={enter}>
          <p className="mb-4 font-mono text-[10px] tracking-[0.18em] text-primary uppercase">Where to start</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {PATHS.map(({ icon: Icon, title, copy, href }) => (
              <Link key={title} href={href} className="group flex flex-col justify-between gap-8 bg-surface-raised p-6 transition-colors hover:bg-surface">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span>
                <div>
                  <span className="flex items-center justify-between gap-2">
                    <strong className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">{title}</strong>
                    <ArrowUpRight className="size-4 shrink-0 text-text-tertiary transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-text-secondary">{copy}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="theme-dark relative border-t border-border bg-background py-6">
        <p className="mx-auto max-w-6xl px-6 font-mono text-[9px] tracking-wider text-text-tertiary uppercase">Setup support for</p>
        <div className="relative mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max gap-3 animate-marquee">
            {MARQUEE_TRACK.map((item, index) => <StackPill key={index} {...item} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function StackPill({ name, logo }: { name: string; logo?: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-surface-raised py-1.5 pr-3.5 pl-1.5 text-xs text-text-secondary">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/95">
        {logo && <Image src={`/logos/${logo}.svg`} alt="" width={16} height={16} className="size-4 object-contain" />}
      </span>
      {name}
    </span>
  )
}
