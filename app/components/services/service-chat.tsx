"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUp, ArrowUpRight, Building2, CircleDollarSign, Laptop, LayoutGrid, Loader2, MessageCircle, ShieldCheck, Sparkles, TriangleAlert, Wifi, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Wordmark } from "@/components/nav/wordmark"
import { cn } from "@/lib/utils"
import { parseSizerIntent, sizerUrlFor } from "@/lib/sizer-intent"
import { WORKLOADS } from "@/lib/workload-catalog"
import { HYPERVISORS } from "@/lib/hypervisor-catalog"
import { SUPABASE_CONFIGURED } from "@/lib/supabase/client"
import { getOrCreateConversation, fetchMessages, sendMessage, subscribeToConversation, type ChatMessageRow } from "@/lib/chat"

type ChatMessage = { id: number; role: "assistant" | "user"; text: string; href?: string; action?: string }
type Mode = "bot" | "live"

const QUICK_PROMPTS = [
  { title: "Better Wi-Fi", detail: "Dead zones & dropouts", prompt: "I need better home Wi-Fi", icon: Wifi },
  { title: "Fix a tech issue", detail: "Computers & printers", prompt: "I need computer or printer help", icon: Laptop },
  { title: "My business", detail: "Reliable connections", prompt: "Help with business networking", icon: Building2 },
  { title: "What does it cost?", detail: "Clear starting prices", prompt: "Show me pricing", icon: CircleDollarSign },
]

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

  if (/price|pricing|cost|quote|rate|budget/.test(text)) return { text: "Remote help starts around $75/hour (30-minute minimum). On-site help starts around $100/hour (1-hour minimum), and Wi-Fi assessments around $99. Installations get a custom quote. We confirm the price before work starts.", href: "/pricing", action: "Find the right starting point" }
  if (/^(hi|hello|hey)[!. ]*$/.test(text)) return { text: "Hi! What?s giving you trouble ? Wi-Fi, a computer, or something else? You can describe the problem in your own words." }
  if (/printer/.test(text)) return { text: "A printer that won?t connect is something we can help with. Harrison can work out whether it needs remote troubleshooting or a visit. Tell us the printer model and what happens when you try to print.", href: "/contact?help=Computer%20%26%20tech%20help&message=I%20need%20help%20with%20my%20printer.%20", action: "Get help with my printer" }
  if (/monthly|managed|support plan|network care/.test(text)) return { text: "Network Care is optional after a ZeroPoint network installation: monitoring, updates, backups, and scoped troubleshooting. Monthly scope and support time are agreed for your setup.", href: "/network-care", action: "Explore Network Care" }
  if (/computer|printer|email|account|software|smart tv|tech help|remote support/.test(text)) return { text: "Let?s get it working again. We help with computers, email, software, accounts, and new devices ? remotely or at your place. You approve the price first, and any remote connection starts with your permission.", href: "/tech-support", action: "Get Tech Help" }
  if (/deal|ebay|buy|hardware|elitedesk|mini pc/.test(text)) return { text: "The Deals page searches current eBay listings for proven homelab hardware, including EliteDesk Minis, network gear, and 10-inch rack parts.", href: "/deals", action: "Browse hardware deals" }
  if (/sizer|size|cpu|ram|memory|workload/.test(text)) return { text: "The Workload Sizer combines sourced requirements for common self-hosted apps and adds clearly labeled planning headroom for CPU, memory, and system storage. Name an app (Plex, Immich, Home Assistant...) and I'll preselect it for you.", href: "/sizer", action: "Open the Workload Sizer" }
  if (/discord|community|people|share|chat/.test(text)) return { text: "The ZeroPoint community is for sharing builds, troubleshooting problems, comparing hardware, and learning with other homelabbers.", href: "/community", action: "Visit the community" }
  if (/business|office|employee|guest network|workstation/.test(text)) return { text: "Keep staff, guests, and business devices connected with a network designed for your space. We help with UniFi, guest Wi-Fi, POS and camera networks, and document the setup so it stays yours.", href: "/services", action: "Explore business services" }
  if (/topology|vlan|infrastructure|what.*running/.test(text)) return { text: "The Network page shows the full sanitized topology, hypervisors, workloads, VLANs, and the separation between the home network and lab.", href: "/network", action: "Explore the network" }
  if (/home network|house|residential|wifi|wi-fi|signal|coverage|access point|dead zone|iot/.test(text)) return { text: "Dead zones or dropped connections? We plan Wi-Fi around your rooms and devices, from fixing the current setup to installing a UniFi network. A Wi-Fi assessment starts around $99 and can be credited toward an installation.", href: "/home-networking", action: "Explore home networking" }
  if (/website|web site|restaurant|menu|dashboard|analytics|reporting/.test(text)) return { text: "ZeroPoint builds mobile-first websites for restaurants and small businesses — menu, hours, location, and ordering links — with hosting and ongoing updates available.", href: "/websites", action: "Explore websites" }
  if (/unifi|ubiquiti|gateway|dream machine|switch|camera/.test(text)) return { text: "UniFi Setup covers gateways, switches, access points, cameras, adoption, and network segmentation. Remote planning is available; local installation is available in Boca Raton and nearby South Florida communities by appointment.", href: "/contact", action: "Plan a UniFi project" }
  if (/homelab|proxmox|rack|server|virtual machine|\bvm\b/.test(text)) return { text: "The Lab is a free content and learning space with documented builds, planning tools, and the community. Homelab builds are not a paid service.", href: "/lab", action: "Explore The Lab" }
  if (/remote|location|local|travel|area|where/.test(text)) return { text: "Planning, troubleshooting, UniFi configuration, and guided deployments can be handled remotely. On-site work serves Boca Raton and nearby South Florida communities, with availability confirmed when you contact us.", href: "/services", action: "View services" }
  if (/learn|guide|docs|documentation/.test(text)) return { text: "Learn contains practical guides and field notes written while building networks, infrastructure, and homelabs.", href: "/docs", action: "Browse Learn" }
  if (/about|who|why|zeropoint/.test(text)) return { text: "ZeroPoint is Harrison’s owner-operated local technology service in Boca Raton: Wi-Fi, UniFi networks, computers, and everyday tech help. Websites are also available. The Lab supports the work through testing and learning.", href: "/about", action: "About ZeroPoint" }
  return { text: "I?m best at finding the right service or guide. For something specific, send Harrison a little detail about the problem and the device involved ? he can help work out the next step.", href: `/contact?message=${encodeURIComponent(input)}`, action: "Share this with Harrison" }
}

export function SiteChat() {
  const pathname = usePathname()
  const onSizer = pathname.replace(/\/$/, "") === "/sizer"
  const reducedMotion = useReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<Mode>("bot")
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [showTopics, setShowTopics] = React.useState(false)
  const nextId = React.useRef(1)
  const logRef = React.useRef<HTMLDivElement>(null)
  const launcherRef = React.useRef<HTMLButtonElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const sendingRef = React.useRef(false)
  const connectingRef = React.useRef(false)
  const [sending, setSending] = React.useState(false)
  const [conversationId, setConversationId] = React.useState<string | null>(null)
  const [liveMessages, setLiveMessages] = React.useState<ChatMessageRow[]>([])
  const [connecting, setConnecting] = React.useState(false)
  const [liveError, setLiveError] = React.useState<string | null>(null)
  const panelId = React.useId()
  const welcome = messages.length === 0

  React.useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true })
  }, [open])

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reducedMotion ? "instant" : "smooth" })
  }, [messages, liveMessages, reducedMotion])

  React.useEffect(() => {
    if (!conversationId) return
    return subscribeToConversation(conversationId, (message) =>
      setLiveMessages((current) => current.some((m) => m.id === message.id) ? current : [...current, message])
    )
  }, [conversationId])

  function close() {
    setOpen(false)
    launcherRef.current?.focus({ preventScroll: true })
  }

  async function goLive() {
    setMode("live")
    if (conversationId || !SUPABASE_CONFIGURED || connectingRef.current) return
    connectingRef.current = true
    setConnecting(true)
    setLiveError(null)
    try {
      const conversation = await getOrCreateConversation()
      const history = await fetchMessages(conversation.id)
      setConversationId(conversation.id)
      setLiveMessages((current) => [...history, ...current.filter((message) => !history.some((item) => item.id === message.id))])
    } catch {
      setLiveError("We couldn’t connect. Please try again, or use the contact form.")
    } finally {
      connectingRef.current = false
      setConnecting(false)
    }
  }

  async function send(text: string) {
    const clean = text.trim()
    if (!clean || sendingRef.current) return
    if (mode === "live") {
      if (!conversationId) { await goLive(); return }
      sendingRef.current = true
      setSending(true)
      setLiveError(null)
      let delivered = false
      try {
        await sendMessage(conversationId, "visitor", clean)
        delivered = true
        setInput("")
        // Refresh after sending so the message appears even if Realtime is delayed.
        const history = await fetchMessages(conversationId)
        setLiveMessages((current) => [...history, ...current.filter((message) => !history.some((item) => item.id === message.id))])
      } catch {
        setLiveError(delivered
          ? "Your message was sent, but we couldn’t refresh the conversation. Replies will appear when the connection returns."
          : "That message didn’t send. Your text is still below so you can try again.")
      } finally {
        sendingRef.current = false
        setSending(false)
      }
      return
    }
    setInput("")
    setShowTopics(false)
    const question: ChatMessage = { id: nextId.current++, role: "user", text: clean }
    const reply: ChatMessage = { id: nextId.current++, role: "assistant", ...answerFor(clean) }
    setMessages((current) => [...current, question, reply])
  }

  return (
    <div className={cn("fixed right-3 z-50 sm:right-6", onSizer ? "bottom-20 lg:bottom-6" : "bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-6")}>
      <AnimatePresence>
        {open && (
          <motion.section
            key="chat"
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-label="ZeroPoint help"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
            onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close() } }}
            className={cn("mb-3 flex w-[min(410px,calc(100vw-1.5rem))] origin-bottom-right flex-col overflow-hidden rounded-[1.5rem] border border-primary/20 bg-background shadow-[0_24px_90px_-24px_#18142e66,0_0_0_1px_#ffffff40]", onSizer ? "h-[min(650px,calc(100dvh-11rem))] lg:h-[min(650px,calc(100dvh-7.5rem))]" : "h-[min(650px,calc(100dvh-7.5rem))]")}
          >
            <header className="theme-dark relative shrink-0 overflow-hidden bg-background px-5 pt-5 pb-4">
              <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-8 size-56 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div><Wordmark /><p className="mt-2 text-xs text-text-secondary">Local help. Less tech trouble.</p></div>
                <button ref={closeRef} type="button" onClick={close} aria-label="Close chat" className="-mt-1 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-white/10 hover:text-foreground"><X className="size-5" /></button>
              </div>
              <div className="relative mt-5 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                <button type="button" aria-pressed={mode === "bot"} onClick={() => setMode("bot")} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium transition-colors", mode === "bot" ? "bg-white text-[#211a35] shadow-sm" : "text-text-secondary hover:bg-white/5 hover:text-foreground")}><Sparkles className="size-4" />Quick help</button>
                {SUPABASE_CONFIGURED ? <button type="button" aria-pressed={mode === "live"} onClick={goLive} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium transition-colors", mode === "live" ? "bg-white text-[#211a35] shadow-sm" : "text-text-secondary hover:bg-white/5 hover:text-foreground")}><MessageCircle className="size-4" />Message Harrison</button> : <Link href="/contact" onClick={close} className="flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-foreground"><MessageCircle className="size-4 shrink-0" />Contact Harrison</Link>}
              </div>
            </header>

            <div ref={logRef} className="min-h-0 flex-1 overscroll-contain overflow-y-auto bg-gradient-to-b from-primary/[0.035] to-transparent px-5 py-5">
              {mode === "bot" ? <>
                {welcome && <div className="pb-1">
                  <p className="text-xs font-medium text-primary">A good place to start</p>
                  <h2 className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-tight">What’s giving you<br />tech trouble?</h2>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">Pick a topic or tell me what’s happening. I’ll point you toward the right help.</p>
                </div>}
                <div role="log" aria-live="polite" aria-label="Quick help conversation" className="space-y-5">
                  {messages.map((message) => <div key={message.id} className={message.role === "user" ? "ml-8" : "mr-3"}>
                    <p className={cn("mb-1.5 text-[11px] font-medium", message.role === "user" ? "text-right text-text-tertiary" : "text-primary")}>{message.role === "user" ? "You" : "ZeroPoint guide"}</p>
                    <div className={cn("overflow-hidden rounded-2xl text-sm leading-relaxed", message.role === "user" ? "rounded-tr-md bg-primary text-primary-foreground" : "rounded-tl-md border border-border bg-surface-raised shadow-sm")}>
                      <p className="whitespace-pre-wrap break-words px-4 py-3.5">{message.text}</p>
                      {message.href && <Link href={message.href} onClick={close} className="group flex min-h-12 items-center justify-between gap-3 border-t border-primary/10 bg-primary/5 px-4 py-3 font-medium text-primary transition-colors hover:bg-primary/10">{message.action}<ArrowUpRight className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" /></Link>}
                    </div>
                  </div>)}
                </div>
                {(welcome || showTopics) && <div className="mt-5 grid grid-cols-2 gap-2.5" aria-label="Suggested topics">
                  {QUICK_PROMPTS.map(({ title, detail, prompt, icon: Icon }) => <button key={title} type="button" onClick={() => void send(prompt)} className="group min-w-0 rounded-2xl border border-border bg-surface-raised p-3.5 text-left shadow-sm transition-[border-color,background-color,transform] hover:border-primary/40 hover:bg-primary/5 motion-safe:hover:-translate-y-0.5"><span className="mb-3 flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary"><Icon className="size-[18px]" /></span><span className="block text-sm font-semibold">{title}</span><span className="mt-1 block text-xs leading-relaxed text-text-secondary">{detail}</span></button>)}
                </div>}
                {welcome && <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-text-tertiary"><ShieldCheck className="mt-0.5 size-3.5 shrink-0" />An automated guide to our services. For personal help, contact Harrison.</p>}
                {!welcome && <button type="button" aria-expanded={showTopics} onClick={() => setShowTopics((value) => !value)} className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-primary hover:underline"><LayoutGrid className="size-3.5" />{showTopics ? "Hide topics" : "Explore another topic"}</button>}
              </> : <>
                <div className="mb-5 rounded-2xl border border-border bg-surface-raised p-4">
                  <div className="flex items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">HL</span><div><h2 className="text-sm font-semibold">A message for Harrison</h2><p className="mt-0.5 text-xs text-text-secondary">Owner · ZeroPoint</p></div></div>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">Tell me what’s happening and which device is involved. I’ll reply here when I’m available.</p>
                  <p className="mt-3 border-t border-border pt-3 text-xs text-text-tertiary">Replies aren’t instant. Please don’t share passwords or access codes.</p>
                </div>
                {connecting && <p role="status" className="flex items-center gap-2 py-3 text-sm text-text-secondary"><Loader2 className="size-4 motion-safe:animate-spin" />Opening your conversation…</p>}
                {liveError && <div role="alert" className="mb-4 flex gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"><TriangleAlert className="mt-0.5 size-4 shrink-0" /><div><p>{liveError}</p>{!conversationId && <button type="button" onClick={goLive} disabled={connecting} className="mt-1 min-h-11 font-medium underline">Try connecting again</button>}<Link href="/contact" onClick={close} className="mt-2 block py-1 font-medium underline">Use the contact form</Link></div></div>}
                <div role="log" aria-live="polite" aria-label="Conversation with Harrison" className="space-y-4">
                  {liveMessages.map((message) => <div key={message.id} className={message.sender === "visitor" ? "ml-8" : "mr-3"}><p className={cn("mb-1.5 text-[11px] font-medium text-text-tertiary", message.sender === "visitor" && "text-right")}>{message.sender === "visitor" ? "You" : "Harrison · ZeroPoint"}</p><p className={cn("whitespace-pre-wrap break-words rounded-2xl px-4 py-3.5 text-sm leading-relaxed", message.sender === "visitor" ? "rounded-tr-md bg-primary text-primary-foreground" : "rounded-tl-md border border-border bg-surface-raised shadow-sm")}>{message.body}</p></div>)}
                </div>
              </>}
            </div>

            <div className="shrink-0 border-t border-border bg-surface-raised px-4 pt-3 pb-3">
              <form onSubmit={(event) => { event.preventDefault(); void send(input) }} className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-1.5 transition-shadow focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === "live" ? "Your message to Harrison…" : "Tell me what’s not working…"} aria-label={mode === "live" ? "Message to Harrison" : "Ask the ZeroPoint guide"} autoComplete="off" maxLength={4000} disabled={mode === "live" && (connecting || sending)} className="h-11 min-w-0 flex-1 border-0 bg-transparent px-2 text-base outline-none placeholder:text-text-tertiary focus-visible:outline-none disabled:opacity-60 sm:text-sm" />
                <Button type="submit" aria-label={sending ? "Sending message" : "Send message"} disabled={!input.trim() || (mode === "live" && (connecting || sending))} className="size-11 shrink-0 rounded-xl p-0">{sending ? <Loader2 className="size-4 motion-safe:animate-spin" /> : <ArrowUp className="size-5" />}</Button>
              </form>
              <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[10px] leading-relaxed text-text-tertiary"><span>{mode === "live" ? "Messages are sent to ZeroPoint" : "Quick help stays in your browser"}</span><Link href="/pricing" onClick={close} className="shrink-0 py-1 text-xs font-medium text-primary hover:underline">View pricing</Link></div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <button ref={launcherRef} type="button" onClick={() => open ? close() : setOpen(true)} aria-label={open ? "Close ZeroPoint help" : "Open ZeroPoint help"} aria-expanded={open} aria-controls={open ? panelId : undefined} className="group ml-auto flex min-h-14 items-center gap-3 rounded-full border border-white/15 bg-[#211a35] py-2 pr-5 pl-2 text-white shadow-[0_8px_32px_-8px_#211a3570] transition-[transform,box-shadow] hover:shadow-[0_12px_40px_-8px_var(--accent-glow)] motion-safe:hover:-translate-y-0.5">
        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#c545ac] text-white">{open ? <X className="size-5" /> : <MessageCircle className="size-5" />}</span>
        <span className="text-left"><span className="block text-[10px] leading-tight text-white/65">{open ? "Here when you need us" : "A little help goes a long way"}</span><span className="mt-0.5 block text-sm font-semibold">{open ? "Close chat" : "Let’s talk tech"}</span></span>
      </button>
    </div>
  )
}
