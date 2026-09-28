"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, Headset, Loader2, Monitor, MessageCircle, Search, Send, Smartphone, Tablet, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useVariants } from "@/lib/motion"
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  setConversationStatus,
  subscribeToAllMessages,
  type ChatConversation,
  type ChatMessageRow,
} from "@/lib/chat"

const DEVICE_ICON = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet } as const

function deviceSummary(c: ChatConversation): string | null {
  const parts = [c.os, c.browser].filter(Boolean)
  return parts.length ? parts.join(" · ") : c.device
}

// Short, cheap relative-time label — this console redraws often enough
// (every realtime message) that timestamps stay fresh without a ticking
// interval of their own.
function timeAgo(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 5) return "just now"
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function Avatar({ conversation, size = "md" }: { conversation: Pick<ChatConversation, "device">; size?: "sm" | "md" }) {
  const Icon = (conversation.device && DEVICE_ICON[conversation.device as keyof typeof DEVICE_ICON]) || User
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary", size === "sm" ? "size-6" : "size-9")}>
      <Icon className={size === "sm" ? "size-3" : "size-4"} />
    </span>
  )
}

export function ChatConsole() {
  const reducedMotion = useReducedMotion()
  const variants = useVariants(reducedMotion ?? null)
  const [conversations, setConversations] = React.useState<ChatConversation[] | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [messages, setMessages] = React.useState<ChatMessageRow[]>([])
  const [previews, setPreviews] = React.useState<Record<string, ChatMessageRow>>({})
  const [unread, setUnread] = React.useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = React.useState<"all" | "open" | "closed">("all")
  const [query, setQuery] = React.useState("")
  const [input, setInput] = React.useState("")
  const logRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    fetchConversations().then(setConversations)
  }, [])

  React.useEffect(() => {
    if (!selectedId) return
    fetchMessages(selectedId).then((data) => {
      setMessages(data)
      const last = data.at(-1)
      if (last) setPreviews((current) => ({ ...current, [selectedId]: last }))
      setUnread((current) => {
        if (!current.has(selectedId)) return current
        const next = new Set(current)
        next.delete(selectedId)
        return next
      })
    })
  }, [selectedId])

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" })
  }, [messages, reducedMotion])

  React.useEffect(() => {
    return subscribeToAllMessages((message) => {
      setConversations((current) =>
        current
          ?.map((c) => (c.id === message.conversation_id ? { ...c, last_message_at: message.created_at } : c))
          .sort((a, b) => b.last_message_at.localeCompare(a.last_message_at)) ?? null
      )
      setPreviews((current) => ({ ...current, [message.conversation_id]: message }))
      setMessages((current) =>
        message.conversation_id === selectedId && !current.some((m) => m.id === message.id) ? [...current, message] : current
      )
      if (message.sender === "visitor" && message.conversation_id !== selectedId) {
        setUnread((current) => new Set(current).add(message.conversation_id))
      }
    })
  }, [selectedId])

  const selected = conversations?.find((c) => c.id === selectedId) ?? null

  const filtered = (conversations ?? []).filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false
    if (!query.trim()) return true
    const haystack = `${c.visitor_name ?? ""} ${deviceSummary(c) ?? ""} ${c.ip ?? ""}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })

  async function send() {
    const clean = input.trim()
    if (!clean || !selectedId) return
    setInput("")
    await sendMessage(selectedId, "admin", clean)
  }

  async function toggleStatus() {
    if (!selected) return
    const next = selected.status === "open" ? "closed" : "open"
    await setConversationStatus(selected.id, next)
    setConversations((current) => current?.map((c) => (c.id === selected.id ? { ...c, status: next } : c)) ?? null)
  }

  if (!conversations) {
    return (
      <div className="grid h-full bg-surface-raised md:grid-cols-[320px_1fr]">
        <div className="space-y-1 border-r border-border p-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
              <span className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
              <span className="h-3 flex-1 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="hidden items-center justify-center bg-muted/30 md:flex"><Loader2 className="size-5 animate-spin text-text-tertiary" /></div>
      </div>
    )
  }

  const openCount = conversations.filter((c) => c.status === "open").length

  return (
    <div className="grid h-full bg-surface-raised md:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_300px]">
      {/* Inbox — on phones it's the whole screen until a thread is picked. */}
      <div className={cn("min-h-0 flex-col border-r border-border", selected ? "hidden md:flex" : "flex")}>
        <div className="space-y-3 border-b border-border p-4">
          <div className="flex items-baseline justify-between">
            <h1 className="text-base font-semibold text-foreground">Inbox</h1>
            <span className="text-xs text-text-tertiary">{openCount} open</span>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations…"
              aria-label="Search conversations"
              className="w-full rounded-lg border border-input bg-surface-raised py-1.5 pr-3 pl-8 text-sm text-foreground outline-none placeholder:text-text-tertiary focus:border-primary/60 focus:ring-3 focus:ring-primary/10"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="open" className="flex-1">Open</TabsTrigger>
              <TabsTrigger value="closed" className="flex-1">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
              <MessageCircle className="size-6 text-text-tertiary" />
              <p className="text-sm text-text-tertiary">{conversations.length === 0 ? "No conversations yet." : "Nothing matches."}</p>
            </div>
          )}
          {filtered.map((c) => {
            const preview = previews[c.id]
            const isUnread = unread.has(c.id)
            const active = selectedId === c.id
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  "relative flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                  active && "bg-primary/5 hover:bg-primary/5"
                )}
              >
                {active && <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                <Avatar conversation={c} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-sm text-foreground", isUnread ? "font-semibold" : "font-medium")}>
                      {c.visitor_name || `Visitor ${c.id.slice(0, 8)}`}
                    </span>
                    <span className="shrink-0 text-[11px] text-text-tertiary">{timeAgo(c.last_message_at)}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <span className={cn("block truncate text-xs", isUnread ? "text-foreground" : "text-text-tertiary")}>
                      {preview ? `${preview.sender === "admin" ? "You: " : ""}${preview.body}` : deviceSummary(c) ?? "New conversation"}
                    </span>
                    {isUnread && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                    {c.status === "closed" && !isUnread && <span className="shrink-0 text-[10px] font-medium tracking-wide text-text-tertiary uppercase">Closed</span>}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Thread */}
      <div className={cn("min-h-0 min-w-0 flex-col bg-muted/30", selected ? "flex" : "hidden md:flex")}>
        {!selected ? (
          <div className="m-auto flex flex-col items-center gap-2 px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Headset className="size-5" /></span>
            <p className="mt-1 text-sm font-medium text-foreground">No conversation selected</p>
            <p className="text-sm text-text-tertiary">Pick one from the inbox to read and reply.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-raised px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Button size="icon-sm" variant="ghost" className="-ml-1 md:hidden" onClick={() => setSelectedId(null)}>
                  <ChevronLeft /><span className="sr-only">Back to inbox</span>
                </Button>
                <Avatar conversation={selected} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{selected.visitor_name || `Visitor ${selected.id.slice(0, 8)}`}</p>
                  <p className="mt-0.5 truncate text-xs text-text-tertiary">
                    {[deviceSummary(selected), selected.ip].filter(Boolean).join(" · ") || `Started ${timeAgo(selected.created_at)}`}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {selected.status === "open" ? <Badge>Open</Badge> : <Badge variant="outline">Closed</Badge>}
                <Button size="sm" variant="outline" onClick={toggleStatus}>
                  {selected.status === "open" ? <><X className="size-3.5" />Close</> : "Reopen"}
                </Button>
              </div>
            </div>

            <div ref={logRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
              <div className="mx-auto max-w-3xl space-y-1">
                <p className="pb-2 text-center text-[11px] text-text-tertiary">Conversation started {new Date(selected.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                <AnimatePresence initial={false}>
                  {messages.map((m, i) => {
                    const prev = messages[i - 1]
                    const grouped = prev && prev.sender === m.sender
                    return (
                      <motion.div
                        key={m.id}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        className={cn("flex items-end gap-2", m.sender === "admin" ? "flex-row-reverse" : "", grouped ? "mt-0.5" : "mt-3")}
                      >
                        {!grouped && m.sender === "visitor" ? <Avatar conversation={selected} size="sm" /> : <span className="size-6 shrink-0" />}
                        <p
                          title={new Date(m.created_at).toLocaleString()}
                          className={cn(
                            "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                            m.sender === "admin" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border bg-surface-raised text-foreground"
                          )}
                        >
                          {m.body}
                        </p>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send() }} className="border-t border-border bg-surface-raised p-3 sm:px-8">
              <div className="mx-auto flex max-w-3xl gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={selected.status === "open" ? "Write a reply…" : "Reopen the conversation to reply"}
                  aria-label="Reply"
                  autoComplete="off"
                  disabled={selected.status !== "open"}
                  className="h-10 rounded-full px-4"
                />
                <Button type="submit" size="icon-lg" className="size-10 shrink-0 rounded-full" disabled={!input.trim() || selected.status !== "open"}>
                  <Send className="size-4" /><span className="sr-only">Send</span>
                </Button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Visitor details — only where there's room for a third column. */}
      <aside className="hidden min-h-0 overflow-y-auto border-l border-border xl:block">
        {selected ? (
          <div className="p-5">
            <div className="flex flex-col items-center text-center">
              <Avatar conversation={selected} />
              <p className="mt-3 text-sm font-semibold text-foreground">{selected.visitor_name || `Visitor ${selected.id.slice(0, 8)}`}</p>
              <p className="text-xs text-text-tertiary">Active {timeAgo(selected.last_message_at)}</p>
            </div>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Status", selected.status === "open" ? "Open" : "Closed"],
                ["Started", new Date(selected.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })],
                ["Messages", String(messages.length)],
                ["Device", selected.device],
                ["OS", selected.os],
                ["Browser", selected.browser],
                ["IP address", selected.ip],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-text-tertiary">{label}</dt>
                  <dd className="truncate text-right text-foreground">{value || "—"}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-border pt-4 text-[11px] break-all text-text-tertiary">ID {selected.id}</p>
          </div>
        ) : (
          <p className="p-5 text-sm text-text-tertiary">Visitor details appear here.</p>
        )}
      </aside>
    </div>
  )
}
