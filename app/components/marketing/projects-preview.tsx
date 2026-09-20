"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Home } from "lucide-react"
import { ProjectArt } from "@/components/projects/project-art"
import { StatusBadge } from "@/components/projects/status-badge"
import { TechBadge } from "@/components/projects/tech-badge"
import { Eyebrow } from "./eyebrow"
import { SectionIndex } from "./section-index"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { PROJECTS } from "@/lib/projects"

const FEATURED = PROJECTS.find((p) => p.id === "home-network")!
const FEATURED_ICON = Home

export function ProjectsPreview() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mb-14 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <motion.div variants={fadeUp}>
              <SectionIndex n="04" className="mb-3" />
              <Eyebrow>Selected work</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Projects
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/projects"
              className="group flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground"
            >
              View all projects
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <Link
            href={FEATURED.href ?? "/projects"}
            className="group grid gap-8 rounded-2xl border border-border p-2 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_-16px_var(--accent-glow)] md:grid-cols-2 md:items-center md:gap-12 md:p-8"
          >
            <ProjectArt icon={FEATURED_ICON} label="Featured" className="aspect-[4/3]" />
            <div>
              <div className="flex items-center gap-3">
                <StatusBadge status={FEATURED.status} />
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                {FEATURED.title}
              </h3>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {FEATURED.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {FEATURED.tags.map((t) => (
                  <TechBadge key={t}>{t}</TechBadge>
                ))}
              </div>
              <span className="mt-6 flex items-center gap-1.5 text-sm font-medium text-foreground">
                See the full network
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
