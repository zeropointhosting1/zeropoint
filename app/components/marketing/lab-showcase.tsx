"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowRight, Boxes, Network, Server, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DualNetworkGlyph } from "./dual-network-glyph"
import { Eyebrow } from "./eyebrow"
import { viewportOnce } from "@/lib/motion"

const AREAS = [
  { icon: Server, label: "Home servers", value: "Small computers running our own apps" },
  { icon: Network, label: "Separate networks", value: "Trusted devices, smart gadgets, and guests kept apart" },
  { icon: Boxes, label: "Our own apps", value: "Photos, files, and passwords hosted at home" },
  { icon: Workflow, label: "Written down", value: "Every piece documented and diagrammed" },
]

export function LabShowcase() {
  const diagramRef = React.useRef<HTMLDivElement>(null)
  const inView = useInView(diagramRef, { once: false, amount: 0.3 })
  const reduced = useReducedMotion()
  return <section className="theme-dark band-dark relative overflow-hidden"><div className="pointer-events-none absolute inset-0 bg-topology-glow" /><div className="relative mx-auto max-w-6xl px-6 py-28"><div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end"><div><Eyebrow>Tested here first</Eyebrow><motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-6xl">We run our own network, too.</motion.h2></div><div><p className="max-w-xl text-lg leading-relaxed text-text-secondary">Before recommending anything, we try it on our own equipment. The ZeroPoint Lab is a real, working setup — below is a simplified map of how it&rsquo;s wired.</p><div className="mt-7"><Button render={<Link href="/lab" />}>See how it&rsquo;s built <ArrowRight className="size-4" /></Button></div></div></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{AREAS.map(({ icon: Icon, label, value }) => <div key={label} className="rounded-xl border border-border bg-surface/80 p-5"><Icon className="size-4 text-primary" /><p className="mt-5 font-mono text-xs tracking-[0.14em] text-primary uppercase">{label}</p><p className="mt-1 text-sm text-text-secondary">{value}</p></div>)}</div><motion.div ref={diagramRef} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportOnce} transition={{ duration: 0.2 }} className="mt-5 overflow-hidden rounded-2xl border border-primary/20 bg-surface/80 p-4 shadow-[0_28px_90px_-46px_var(--accent-glow)] sm:p-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><div><p className="font-mono text-xs tracking-[0.12em] text-primary uppercase">Current build · Network map</p><p className="mt-1 text-sm text-text-secondary">Access points, connected devices, VLANs, and the isolated lab edge</p></div><Link href="/projects" className="text-sm text-text-secondary transition-colors hover:text-foreground">Latest projects →</Link></div><DualNetworkGlyph animated={inView && !reduced} /></motion.div></div></section>
}
