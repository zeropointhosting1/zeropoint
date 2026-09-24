"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Hash, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// Illustrative only: generic handles, no timestamps, member count, or claims
// of real activity. The panel communicates the kind of conversation the
// community is for without impersonating a live Discord feed.
const MESSAGES = [
  { id: "segmentation", name: "pixelrack", tone: "success", text: "finally got VLANs segmented on my UniFi setup 🎉" },
  { id: "isolation", name: "vlan_victor", tone: "warning", text: "nice — IoT isolated from trusted, or just tagged?" },
  { id: "guest", name: "pixelrack", tone: "success", text: "fully isolated, guest too. wish I'd done this years ago" },
  { id: "gateway", name: "vm_hoarder", tone: "primary", text: "anyone's Proxmox node lose the gateway after a reboot?" },
] as const

const AVATAR_TONE = {
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  primary: "border-primary/20 bg-primary/10 text-primary",
} as const

const container = {
  hidden: {},
  visible: { transition: { delayChildren: 0.2, staggerChildren: 0.16 } },
}

const message = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const } },
}

function Avatar({ name, tone }: { name: string; tone: keyof typeof AVATAR_TONE }) {
  return (
    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-semibold uppercase", AVATAR_TONE[tone])}>
      {name[0]}
    </span>
  )
}

function TypingDots({ animate }: { animate: boolean }) {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="size-1 rounded-full bg-text-tertiary"
          animate={animate ? { opacity: [0.25, 1, 0.25], y: [0, -2, 0] } : undefined}
          transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.14, ease: "easeInOut" }}
        />
      ))}
    </span>
  )
}

export function DiscordChatMock({ className }: { className?: string }) {
  const reduced = !!useReducedMotion()

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-background/70 shadow-2xl", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,var(--accent-glow),transparent_48%)]" />

      <div className="relative flex items-center justify-between border-b border-border bg-surface-raised/80 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary"><Hash className="size-3.5" /></span>
          <div>
            <p className="text-xs font-semibold text-foreground">homelab-chat</p>
            <p className="mt-0.5 font-mono text-[11px] tracking-wider text-text-tertiary uppercase">Example conversation</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-text-tertiary uppercase"><Users className="size-3" />Community</span>
      </div>

      <motion.div
        initial={reduced ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={container}
        className="relative min-h-[300px] space-y-5 px-5 py-6"
      >
        {MESSAGES.map((item) => (
          <motion.div key={item.id} variants={message} className="flex items-start gap-3">
            <Avatar name={item.name} tone={item.tone} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] font-medium text-foreground">{item.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="relative flex items-center gap-3 border-t border-border bg-surface-raised/45 px-5 py-3.5">
        <span className="flex size-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-mono text-[11px] font-semibold text-primary">n</span>
        <div className="flex flex-1 items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
          <span className="text-xs text-text-tertiary">net_newbie is typing</span>
          <TypingDots animate={!reduced} />
        </div>
      </div>
    </div>
  )
}
