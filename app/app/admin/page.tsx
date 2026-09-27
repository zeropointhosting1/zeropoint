"use client"

import * as React from "react"
import Link from "next/link"
import { Inbox, MessagesSquare, ServerCrash } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"

type Counts = { newLeads: number; openChats: number; clientsDown: number }

export default function AdminOverviewPage() {
  const [counts, setCounts] = React.useState<Counts | null>(null)

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = getSupabaseClient()
      const [leads, chats, clients] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("chat_conversations").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("clients").select("id", { count: "exact", head: true }).eq("last_status", "down"),
      ])
      if (!cancelled) {
        setCounts({
          newLeads: leads.count ?? 0,
          openChats: chats.count ?? 0,
          clientsDown: clients.count ?? 0,
        })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const cards = [
    { href: "/admin/leads", label: "New leads", value: counts?.newLeads, icon: Inbox, tone: "text-primary" },
    { href: "/admin/chat", label: "Open conversations", value: counts?.openChats, icon: MessagesSquare, tone: "text-primary" },
    { href: "/admin/clients", label: "Clients down", value: counts?.clientsDown, icon: ServerCrash, tone: counts && counts.clientsDown > 0 ? "text-destructive" : "text-success" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(({ href, label, value, icon: Icon, tone }) => (
          <Link key={href} href={href} className="rounded-2xl border border-border bg-surface-raised p-6 transition-colors hover:border-primary/30">
            <Icon className={`size-5 ${tone}`} />
            <p className="mt-4 text-3xl font-semibold text-foreground">{value ?? "—"}</p>
            <p className="mt-1 text-sm text-text-secondary">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
