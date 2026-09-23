"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Building2, FlaskConical, HouseWifi } from "lucide-react"
import { viewportOnce } from "@/lib/motion"

const PATHS = [
  { icon: FlaskConical, label: "Homelab", title: "Build your own infrastructure.", copy: "Proxmox, networking, self-hosting, storage, remote access, and custom homelab builds.", action: "Explore Homelab", href: "/lab", accent: "from-primary/18" },
  { icon: HouseWifi, label: "Home Networking", title: "Make your home network actually work.", copy: "Reliable Wi-Fi, UniFi, smart-device networking, network racks, and troubleshooting.", action: "Explore Home Networking", href: "/property-technology", accent: "from-brand-cyan/15" },
  { icon: Building2, label: "Small Business", title: "Straightforward technology for small businesses.", copy: "Reliable networks, Wi-Fi, devices, guest networks, and practical office technology.", action: "Explore Business", href: "/services", accent: "from-brand-pink/13" },
]

export function BrandPaths() {
  return <section className="border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-20"><p className="mb-8 font-mono text-xs tracking-[0.18em] text-text-tertiary uppercase">Choose where you&rsquo;re building</p><div className="grid gap-4 lg:grid-cols-3">{PATHS.map(({ icon: Icon, label, title, copy, action, href, accent }, index) => <motion.div key={label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.2, delay: index * 0.08 }}><Link href={href} className="group relative flex h-full min-h-[330px] flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_24px_60px_-38px_var(--accent-glow)]"><div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} via-transparent to-transparent opacity-70`} /><div className="relative flex items-start justify-between"><span className="flex size-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="font-mono text-xs text-text-tertiary">0{index + 1}</span></div><div className="relative mt-auto pt-12"><p className="font-mono text-xs tracking-[0.16em] text-primary uppercase">{label}</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">{title}</h2><p className="mt-3 text-sm leading-relaxed text-text-secondary">{copy}</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground">{action}<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></div></Link></motion.div>)}</div></div></section>
}
