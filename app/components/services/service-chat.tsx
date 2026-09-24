"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, MessageCircle, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { parseSizerIntent, sizerUrlFor } from "@/lib/sizer-intent"
import { WORKLOADS } from "@/lib/workload-catalog"
import { HYPERVISORS } from "@/lib/hypervisor-catalog"

type ChatMessage = { id: number; role: "assistant" | "user"; text: string; href?: string; action?: string }

const QUICK_PROMPTS = ["Help me plan a homelab", "I need better home Wi-Fi", "Help with a business network", "Show me hardware deals"]

function appName(id: string): string {
  return WORKLOADS.find((w) => w.id === id)?.name ?? id
}

function hypervisorName(id: string): string {
  return HYPERVISORS.find((h) => h.id === id)?.name ?? id
}

function answerFor(input: string): Pick<ChatMessage, "text" | "href" | "action"> {
  const text = input.toLowerCase()

  // Checked first and takes priority over the generic keyword matches
  // below: if the message actually names an app or hypervisor, deep-link
  // into the Sizer with it preselected instead of a generic blurb.
  const intent = parseSizerIntent(text)
  if (intent && intent.appIds.length > 0) {
    const apps = intent.appIds.map(appName).join(" + ")
    const hv = intent.hypervisorId ? ` on ${hypervisorName(intent.hypervisorId)}` : ""
    return {
      text: `Here's the Workload Sizer with ${apps}${hv} already selected — the CPU, RAM, and storage estimate updates from there.`,
      href: sizerUrlFor(intent),
      action: "Open your preselected Sizer results",
    }
  }

  if (/deal|ebay|buy|hardware|elitedesk|mini pc/.test(text)) return { text: "The Deals page searches current eBay listings for proven homelab hardware, including EliteDesk Minis, network gear, and 10-inch rack parts.", href: "/deals", action: "Browse hardware deals" }
  if (/sizer|size|cpu|ram|memory|workload/.test(text)) return { text: "The Workload Sizer combines sourced requirements for common self-hosted apps and adds clearly labeled planning headroom for CPU, memory, and system storage. Name an app (Plex, Immich, Home Assistant...) and I'll preselect it for you.", href: "/sizer", action: "Open the Workload Sizer" }
  if (/discord|community|people|share|chat/.test(text)) return { text: "The ZeroPoint community is for sharing builds, troubleshooting problems, comparing hardware, and learning with other homelabbers.", href: "/community", action: "Visit the community" }
  if (/network|topology|vlan|infrastructure|what.*running/.test(text)) return { text: "The Network page shows the full sanitized topology, hypervisors, workloads, VLANs, and the separation between the home network and lab.", href: "/network", action: "Explore the network" }
  if (/home network|house|residential|wifi|wi-fi|signal|coverage|access point|dead zone|iot/.test(text)) return { text: "ZeroPoint Home covers Wi-Fi, UniFi, IoT separation, cameras, network racks, and troubleshooting for homes and recreational properties.", href: "/home-networking", action: "Explore home networking" }
  if (/website|web site|restaurant|menu|dashboard|analytics|reporting/.test(text)) return { text: "ZeroPoint builds mobile-first websites for restaurants and small businesses — menu, hours, location, and ordering links — plus dashboards that put sales, labor, and top items on one screen.", href: "/websites", action: "Explore websites & dashboards" }
  if (/business|office|employee|guest network|workstation/.test(text)) return { text: "ZeroPoint Business focuses on straightforward Wi-Fi, UniFi networks, switching, employee and guest networks, device setup, and documentation for small businesses.", href: "/services", action: "Explore business services" }
  if (/unifi|ubiquiti|gateway|dream machine|switch|camera/.test(text)) return { text: "UniFi Setup covers gateways, switches, access points, cameras, adoption, and network segmentation. Remote planning is available; physical installation depends on future service-area availability.", href: "/services#project-planner", action: "Plan a UniFi project" }
  if (/homelab|proxmox|rack|server|virtual machine|\bvm\b/.test(text)) return { text: "ZeroPoint Lab brings together homelab builds, planning tools, hardware deals, the community, and the documented infrastructure behind ZeroPoint.", href: "/lab", action: "Explore the homelab" }
  if (/remote|location|local|travel|area|where/.test(text)) return { text: "Planning, troubleshooting, UniFi configuration, and guided deployments can be handled remotely. Physical installation will only be offered within a defined service area once availability is finalized.", href: "/services", action: "View services" }
  if (/price|pricing|cost|quote|rate|budget/.test(text)) return { text: "Service pricing is not published yet because project boundaries and the service area are still being finalized. The project planner gathers the details needed for an accurate quote later.", href: "/services#project-planner", action: "Create a project brief" }
  if (/learn|guide|docs|documentation/.test(text)) return { text: "Learn contains practical guides and field notes written while building networks, infrastructure, and homelabs.", href: "/docs", action: "Browse Learn" }
  if (/about|who|why|zeropoint/.test(text)) return { text: "ZeroPoint is an enthusiast-driven technology brand with four areas: homelabs, home networking, straightforward technology setup for small businesses, and websites and dashboards for restaurants and small businesses.", href: "/about", action: "About ZeroPoint" }
  return { text: "I can guide you to ZeroPoint Lab, home networking, small-business services, Learn, projects, hardware deals, or the Workload Sizer. What are you trying to build?" }
}

export function SiteChat() {
  const pathname = usePathname()
  // The Sizer shows its own fixed bottom summary bar on small/medium
  // screens (lg:hidden — see components/sizer/vm-sizing-calculator.tsx)
  // whenever at least one workload is selected. Lifting the launcher a
  // little higher on that page avoids the two stacking/overlapping —
  // matched to the same lg breakpoint the sizer bar itself uses.
  const onSizer = pathname === "/sizer"
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 1, role: "assistant", text: "Hi — I match keywords to the right page, I'm not a live agent. Name an app or two (Plex, Immich, Home Assistant...) and I'll deep-link the Sizer with them preselected; otherwise ask what you want to build, buy, or understand." },
  ])
  const nextId = React.useRef(2)
  const logRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function send(text: string) {
    const clean = text.trim()
    if (!clean) return
    const userMessage = { id: nextId.current++, role: "user" as const, text: clean }
    const answer = answerFor(clean)
    const reply = { id: nextId.current++, role: "assistant" as const, ...answer }
    setMessages((current) => [...current, userMessage, reply])
    setInput("")
  }

  return (
    <div className={cn("fixed right-4 z-50 sm:right-6", onSizer ? "bottom-20 lg:bottom-6" : "bottom-4 sm:bottom-6")}>
      {open && (
        <section aria-label="ZeroPoint site chat" className="mb-3 flex h-[min(580px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-primary/20 bg-background shadow-[0_24px_80px_-24px_var(--accent-glow)]">
          <header className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-3.5">
            <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Bot className="size-4.5" /></span><div><h2 className="text-sm font-semibold">ZeroPoint quick links</h2><p className="mt-0.5 flex items-center gap-1.5 font-mono text-[8px] tracking-wider text-text-tertiary uppercase"><span className="size-1.5 rounded-full bg-success" />Keyword-matched · No live agent</p></div></div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="flex size-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface hover:text-foreground"><X className="size-4" /></button>
          </header>

          <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((message) => <div key={message.id} className={message.role === "user" ? "ml-10" : "mr-8"}><p className={`rounded-xl px-3.5 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-surface-raised text-text-secondary"}`}>{message.text}</p>{message.href && <Link href={message.href} onClick={() => setOpen(false)} className="mt-2 inline-flex text-xs font-medium text-primary hover:underline">{message.action} →</Link>}</div>)}
            {messages.length === 1 && <div className="flex flex-wrap gap-2 pt-1">{QUICK_PROMPTS.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-text-secondary transition-colors hover:border-primary/30 hover:text-foreground">{prompt}</button>)}</div>}
          </div>

          <div className="border-t border-border bg-surface-raised/50 p-3">
            <form onSubmit={(event) => { event.preventDefault(); send(input) }} className="flex gap-2"><Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Try an app name, or ask about a project..." aria-label="Chat message" autoComplete="off" /><Button type="submit" size="icon" disabled={!input.trim()}><Send className="size-4" /><span className="sr-only">Send</span></Button></form>
            <div className="mt-2 flex items-center justify-between gap-3 px-1"><p className="text-[9px] text-text-tertiary">Runs locally · No messages sent</p><Link href="/services#project-planner" onClick={() => setOpen(false)} className="text-[10px] font-medium text-primary hover:underline">Plan a project</Link></div>
          </div>
        </section>
      )}

      <button onClick={() => setOpen((current) => !current)} aria-label={open ? "Close service chat" : "Open service chat"} aria-expanded={open} className="ml-auto flex h-12 items-center gap-2.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_12px_36px_-12px_var(--accent-glow)] transition-transform hover:scale-[1.03]">
        {open ? <X className="size-4" /> : <MessageCircle className="size-4" />}<span>{open ? "Close" : "Ask ZeroPoint"}</span>
      </button>
    </div>
  )
}
