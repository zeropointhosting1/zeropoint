"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, MessageCircle, MessagesSquare, Send, Sparkles, TriangleAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { parseSizerIntent, sizerUrlFor } from "@/lib/sizer-intent"
import { WORKLOADS } from "@/lib/workload-catalog"
import { HYPERVISORS } from "@/lib/hypervisor-catalog"
import { SUPABASE_CONFIGURED } from "@/lib/supabase/client"
import { getOrCreateConversation, fetchMessages, sendMessage, subscribeToConversation, type ChatMessageRow } from "@/lib/chat"

type ChatMessage = { id: number; role: "assistant" | "user"; text: string; href?: string; action?: string }
type Mode = "bot" | "live"

const QUICK_PROMPTS = ["My printer will not connect", "I need better home Wi-Fi", "Help with business networking", "What does tech help cost?"]

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

  if (/monthly|managed|support plan|network care/.test(text)) return { text: "Network Care is optional after a ZeroPoint network installation: monitoring, updates, backups, and scoped troubleshooting. Monthly scope and support time are agreed for your setup.", href: "/network-care", action: "Explore Network Care" }
  if (/computer|printer|email|account|software|smart tv|tech help|remote support/.test(text)) return { text: "Get on-demand help with computers, printers, email, software, and devices. Remote help starts around $75/hour with a 30-minute minimum; local visits around $100/hour with a 1-hour minimum. Pricing is confirmed first. Remote sessions only begin with your authorization.", href: "/tech-support", action: "Get Tech Help" }
  if (/deal|ebay|buy|hardware|elitedesk|mini pc/.test(text)) return { text: "The Deals page searches current eBay listings for proven homelab hardware, including EliteDesk Minis, network gear, and 10-inch rack parts.", href: "/deals", action: "Browse hardware deals" }
  if (/sizer|size|cpu|ram|memory|workload/.test(text)) return { text: "The Workload Sizer combines sourced requirements for common self-hosted apps and adds clearly labeled planning headroom for CPU, memory, and system storage. Name an app (Plex, Immich, Home Assistant...) and I'll preselect it for you.", href: "/sizer", action: "Open the Workload Sizer" }
  if (/discord|community|people|share|chat/.test(text)) return { text: "The ZeroPoint community is for sharing builds, troubleshooting problems, comparing hardware, and learning with other homelabbers.", href: "/community", action: "Visit the community" }
  if (/business|office|employee|guest network|workstation/.test(text)) return { text: "ZeroPoint Business focuses on straightforward Wi-Fi, UniFi networks, switching, employee and guest networks, device setup, and documentation for small businesses.", href: "/services", action: "Explore business services" }
  if (/topology|vlan|infrastructure|what.*running/.test(text)) return { text: "The Network page shows the full sanitized topology, hypervisors, workloads, VLANs, and the separation between the home network and lab.", href: "/network", action: "Explore the network" }
  if (/home network|house|residential|wifi|wi-fi|signal|coverage|access point|dead zone|iot/.test(text)) return { text: "ZeroPoint Home covers Wi-Fi, UniFi, IoT separation, cameras, network racks, and troubleshooting for homes and recreational properties.", href: "/home-networking", action: "Explore home networking" }
  if (/website|web site|restaurant|menu|dashboard|analytics|reporting/.test(text)) return { text: "ZeroPoint builds mobile-first websites for restaurants and small businesses — menu, hours, location, and ordering links — with hosting and ongoing updates available.", href: "/websites", action: "Explore websites" }
  if (/unifi|ubiquiti|gateway|dream machine|switch|camera/.test(text)) return { text: "UniFi Setup covers gateways, switches, access points, cameras, adoption, and network segmentation. Remote planning is available; local installation is available in Boca Raton and nearby South Florida communities by appointment.", href: "/contact", action: "Plan a UniFi project" }
  if (/homelab|proxmox|rack|server|virtual machine|\bvm\b/.test(text)) return { text: "The Lab is a free content and learning space with documented builds, planning tools, and the community. Homelab builds are not a paid service.", href: "/lab", action: "Explore The Lab" }
  if (/remote|location|local|travel|area|where/.test(text)) return { text: "Planning, troubleshooting, UniFi configuration, and guided deployments can be handled remotely. On-site work serves Boca Raton and nearby South Florida communities, with availability confirmed when you contact us.", href: "/services", action: "View services" }
  if (/price|pricing|cost|quote|rate|budget/.test(text)) return { text: "Starting prices for every service are on the Pricing page. Pricing is labor only, and every project starts with a free consult and a written quote.", href: "/pricing", action: "See pricing" }
  if (/learn|guide|docs|documentation/.test(text)) return { text: "Learn contains practical guides and field notes written while building networks, infrastructure, and homelabs.", href: "/docs", action: "Browse Learn" }
  if (/about|who|why|zeropoint/.test(text)) return { text: "ZeroPoint is Harrison’s owner-operated local technology service in Boca Raton: Wi-Fi, UniFi networks, computers, and everyday tech help. Websites are also available. The Lab supports the work through testing and learning.", href: "/about", action: "About ZeroPoint" }
  return { text: "I can help you find on-demand tech help, business networking, home Wi-Fi, or website services. You can also explore The Lab and its free tools. What do you need help with?" }
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
  const [mode, setMode] = React.useState<Mode>("bot")
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 1, role: "assistant", text: "Hi — I can point you to Wi-Fi help, computer support, business networking, websites, or The Lab. I match keywords to pages; I am not a live support agent." },
  ])
  const nextId = React.useRef(2)
  const logRef = React.useRef<HTMLDivElement>(null)

  const [conversationId, setConversationId] = React.useState<string | null>(null)
  const [liveMessages, setLiveMessages] = React.useState<ChatMessageRow[]>([])
  const [connecting, setConnecting] = React.useState(false)
  const [liveError, setLiveError] = React.useState<string | null>(null)

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, liveMessages])

  React.useEffect(() => {
    if (!conversationId) return
    return subscribeToConversation(conversationId, (message) =>
      setLiveMessages((current) => (current.some((m) => m.id === message.id) ? current : [...current, message]))
    )
  }, [conversationId])

  async function goLive() {
    setMode("live")
    if (conversationId || !SUPABASE_CONFIGURED) return
    setConnecting(true)
    setLiveError(null)
    try {
      const conversation = await getOrCreateConversation()
      setConversationId(conversation.id)
      setLiveMessages(await fetchMessages(conversation.id))
    } catch {
      setLiveError("Couldn't connect. Check your connection and try again.")
    } finally {
      setConnecting(false)
    }
  }

  function send(text: string) {
    const clean = text.trim()
    if (!clean) return
    setInput("")
    if (mode === "live") {
      if (!conversationId) {
        // Connection never succeeded (or hasn't been attempted yet) —
        // retry instead of silently dropping what was typed.
        setInput(clean)
        goLive()
        return
      }
      sendMessage(conversationId, "visitor", clean).catch(() => setLiveError("That message didn't send. Try again."))
      return
    }
    const userMessage = { id: nextId.current++, role: "user" as const, text: clean }
    const answer = answerFor(clean)
    const reply = { id: nextId.current++, role: "assistant" as const, ...answer }
    setMessages((current) => [...current, userMessage, reply])
  }

  return (
    <div className={cn("fixed right-4 z-50 sm:right-6", onSizer ? "bottom-20 lg:bottom-6" : "bottom-4 sm:bottom-6")}>
      {open && (
        <section aria-label="ZeroPoint site chat" className="mb-3 flex h-[min(580px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-primary/20 bg-background shadow-[0_24px_80px_-24px_var(--accent-glow)]">
          <header className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-3.5">
            <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">{mode === "live" ? <MessagesSquare className="size-4.5" /> : <Bot className="size-4.5" />}</span><div><h2 className="text-sm font-semibold">{mode === "live" ? "Message us" : "ZeroPoint quick links"}</h2><p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-text-tertiary uppercase"><span className={cn("size-1.5 rounded-full", mode === "live" ? "bg-primary" : "bg-success")} />{mode === "live" ? "Live agent · replies show up here" : "Keyword-matched · No live agent"}</p></div></div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="flex size-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface hover:text-foreground"><X className="size-4" /></button>
          </header>

          {mode === "bot" ? (
            <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((message) => <div key={message.id} className={message.role === "user" ? "ml-10" : "mr-8"}><p className={`rounded-xl px-3.5 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-surface-raised text-text-secondary"}`}>{message.text}</p>{message.href && <Link href={message.href} onClick={() => setOpen(false)} className="mt-2 inline-flex text-xs font-medium text-primary hover:underline">{message.action} →</Link>}</div>)}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_PROMPTS.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-text-secondary transition-colors hover:border-primary/30 hover:text-foreground">{prompt}</button>)}
                  {SUPABASE_CONFIGURED && <button onClick={goLive} className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"><Sparkles className="size-3" />Talk to a live agent</button>}
                </div>
              )}
            </div>
          ) : (
            <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {connecting && (
                <p className="mr-8 rounded-xl border border-border bg-surface-raised px-3.5 py-3 text-sm leading-relaxed text-text-secondary">Connecting…</p>
              )}
              {liveError && (
                <div className="mr-8 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p>{liveError}</p>
                    <button onClick={goLive} className="mt-1 text-xs font-medium underline underline-offset-2">Try again</button>
                  </div>
                </div>
              )}
              {liveMessages.length === 0 && !connecting && !liveError && (
                <p className="mr-8 rounded-xl border border-border bg-surface-raised px-3.5 py-3 text-sm leading-relaxed text-text-secondary">
                  You&rsquo;re talking to a live agent — send a message and we&rsquo;ll reply here as soon as we can.
                </p>
              )}
              {liveMessages.map((message) => (
                <div key={message.id} className={message.sender === "visitor" ? "ml-10" : "mr-8"}>
                  <p className={cn("rounded-xl px-3.5 py-3 text-sm leading-relaxed", message.sender === "visitor" ? "bg-primary text-primary-foreground" : "border border-border bg-surface-raised text-text-secondary")}>{message.body}</p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border bg-surface-raised/50 p-3">
            <form onSubmit={(event) => { event.preventDefault(); send(input) }} className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={mode === "live" ? "Type your message…" : "Try an app name, or ask about a project..."}
                aria-label="Chat message"
                autoComplete="off"
                disabled={mode === "live" && connecting}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || (mode === "live" && connecting)}><Send className="size-4" /><span className="sr-only">Send</span></Button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-3 px-1">
              {mode === "live" ? (
                <button onClick={() => setMode("bot")} className="text-[11px] font-medium text-text-tertiary hover:text-foreground">← Back to quick links</button>
              ) : (
                <p className="text-[11px] text-text-tertiary">Runs locally · No messages sent</p>
              )}
              <Link href="/contact" onClick={() => setOpen(false)} className="text-[11px] font-medium text-primary hover:underline">Get Tech Help</Link>
            </div>
          </div>
        </section>
      )}

      <button onClick={() => setOpen((current) => !current)} aria-label={open ? "Close service chat" : "Open service chat"} aria-expanded={open} className="ml-auto flex h-12 items-center gap-2.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_12px_36px_-12px_var(--accent-glow)] transition-transform hover:scale-[1.03]">
        {open ? <X className="size-4" /> : <MessageCircle className="size-4" />}<span>{open ? "Close" : "Ask ZeroPoint"}</span>
      </button>
    </div>
  )
}
