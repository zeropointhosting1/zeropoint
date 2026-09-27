"use client"

import * as React from "react"
import { Loader2, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  setConversationStatus,
  subscribeToAllMessages,
  type ChatConversation,
  type ChatMessageRow,
} from "@/lib/chat"

export function ChatConsole() {
  const [conversations, setConversations] = React.useState<ChatConversation[] | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [messages, setMessages] = React.useState<ChatMessageRow[]>([])
  const [input, setInput] = React.useState("")
  const logRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    fetchConversations().then(setConversations)
  }, [])

  React.useEffect(() => {
    if (!selectedId) return
    fetchMessages(selectedId).then(setMessages)
  }, [selectedId])

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  React.useEffect(() => {
    return subscribeToAllMessages((message) => {
      setConversations((current) =>
        current
          ?.map((c) => (c.id === message.conversation_id ? { ...c, last_message_at: message.created_at } : c))
          .sort((a, b) => b.last_message_at.localeCompare(a.last_message_at)) ?? null
      )
      setMessages((current) =>
        message.conversation_id === selectedId && !current.some((m) => m.id === message.id) ? [...current, message] : current
      )
    })
  }, [selectedId])

  const selected = conversations?.find((c) => c.id === selectedId) ?? null

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
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-text-tertiary" />
      </div>
    )
  }

  return (
    <div className="grid overflow-hidden rounded-2xl border border-border bg-surface-raised md:grid-cols-[280px_1fr]" style={{ height: "min(70vh, 640px)" }}>
      <div className="overflow-y-auto border-b border-border md:border-b-0 md:border-r">
        {conversations.length === 0 && <p className="p-6 text-center text-sm text-text-tertiary">No conversations yet.</p>}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={cn(
              "flex w-full items-center justify-between gap-2 border-b border-border px-4 py-3 text-left text-sm transition-colors hover:bg-surface",
              selectedId === c.id && "bg-primary/5"
            )}
          >
            <span className="min-w-0">
              <span className="block truncate font-medium text-foreground">{c.visitor_name || `Visitor ${c.id.slice(0, 8)}`}</span>
              <span className="block text-xs text-text-tertiary">{new Date(c.last_message_at).toLocaleString()}</span>
            </span>
            {c.status === "open" ? <Badge>open</Badge> : <Badge variant="outline">closed</Badge>}
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        {!selected ? (
          <p className="m-auto text-sm text-text-tertiary">Select a conversation.</p>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-medium text-foreground">{selected.visitor_name || `Visitor ${selected.id.slice(0, 8)}`}</p>
              <Button size="sm" variant="outline" onClick={toggleStatus}>
                {selected.status === "open" ? <><X className="size-3.5" />Close</> : "Reopen"}
              </Button>
            </div>
            <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={m.sender === "admin" ? "ml-10" : "mr-10"}>
                  <p className={cn("rounded-xl px-3.5 py-2.5 text-sm leading-relaxed", m.sender === "admin" ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-text-secondary")}>{m.body}</p>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex gap-2 border-t border-border p-3">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Reply…" aria-label="Reply" autoComplete="off" />
              <Button type="submit" size="icon" disabled={!input.trim()}><Send className="size-4" /><span className="sr-only">Send</span></Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
