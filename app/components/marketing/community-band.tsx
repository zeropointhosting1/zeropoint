"use client"

import { motion } from "framer-motion"
import { DiscordChatMock } from "./discord-chat-mock"
import { DiscordIcon } from "@/components/nav/brand-icons"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"
import { SectionIndex } from "./section-index"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { DISCORD_URL } from "@/lib/site-config"

export function CommunityBand() {
  return (
    <section id="community" className="theme-dark relative scroll-mt-16 overflow-hidden border-b border-border bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="pointer-events-none absolute top-0 right-[8%] size-80 rounded-full bg-brand-pink/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[10%] size-72 rounded-full bg-brand-cyan/8 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-2 md:items-center md:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <SectionIndex n="02" className="mb-3" />
            <Eyebrow>Homelab Community</Eyebrow>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
          >
            You&rsquo;re not building this alone.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-md text-lg text-text-secondary">
            The Discord is one part of ZeroPoint Lab—a place for people running the same kind of setup to
            share what you&rsquo;re building, get a second opinion when
            something breaks, or just talk shop with people who actually
            care about VLANs.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button
              size="lg"
              className="shadow-[0_0_32px_-8px_var(--accent-glow)]"
              render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}
            >
              <DiscordIcon className="size-4" />
              Join the Discord
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.2 }}
        >
          <DiscordChatMock />
        </motion.div>
      </div>
    </section>
  )
}
