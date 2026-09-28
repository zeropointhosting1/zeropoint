"use client"

import * as React from "react"
import Link from "next/link"
import { Activity, CircleAlert, CircleCheck, Gauge, Inbox, MessagesSquare, ServerCrash } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { fetchClients, fetchRecentChecks, type Client, type ClientCheck } from "@/lib/clients"
import type { Lead } from "@/lib/leads"
import { averageResponse, countByDay, formatPercent, hourlySlots, timeAgo, uptimePercent, withinDays } from "@/lib/admin/metrics"
import { DailyBarChart, UptimeStrip } from "@/components/admin/charts"
import { EmptyState, InitialsAvatar, LeadStatusPill, PageHeader, Panel, PanelLink, StatCard, UptimePill } from "@/components/admin/ui"

type LeadRow = Pick<Lead, "id" | "name" | "email" | "source" | "status" | "help" | "created_at">

type Data = {
  leads: LeadRow[]
  openChats: number
  clients: Client[]
  checks: ClientCheck[]
}

function greeting() {
  const hour = new Date().getHours()
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
}

export default function AdminOverviewPage() {
  const [data, setData] = React.useState<Data | null>(null)

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = getSupabaseClient()
      const since60 = new Date(Date.now() - 60 * 86_400_000).toISOString()
      const since24h = new Date(Date.now() - 86_400_000).toISOString()
      const [leads, chats, clients, checks] = await Promise.all([
        supabase.from("leads").select("id, name, email, source, status, help, created_at").gte("created_at", since60).order("created_at", { ascending: false }),
        supabase.from("chat_conversations").select("id", { count: "exact", head: true }).eq("status", "open"),
        fetchClients(),
        fetchRecentChecks(since24h),
      ])
      if (!cancelled) {
        setData({ leads: (leads.data as LeadRow[]) ?? [], openChats: chats.count ?? 0, clients, checks })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const loading = !data
  const leads = data?.leads ?? []
  const leads30 = leads.filter((l) => withinDays(l.created_at, 30))
  const leadsPrev30 = leads.length - leads30.length
  const newLeads = leads.filter((l) => l.status === "new")
  const activeClients = (data?.clients ?? []).filter((c) => c.status === "active")
  const down = activeClients.filter((c) => c.last_status === "down")
  const checks = React.useMemo(() => data?.checks ?? [], [data])
  const activeIds = new Set(activeClients.map((c) => c.id))
  const activeChecks = checks.filter((c) => activeIds.has(c.client_id))
  const fleetUptime = uptimePercent(activeChecks)
  const fleetResponse = averageResponse(activeChecks)
  const byClient = React.useMemo(() => {
    const map = new Map<string, ClientCheck[]>()
    for (const check of checks) map.set(check.client_id, [...(map.get(check.client_id) ?? []), check])
    return map
  }, [checks])
  const chart = countByDay(leads30.map((l) => l.created_at), 30)

  const delta = leads30.length - leadsPrev30
  const leadsHint = loading ? undefined : leadsPrev30 === 0 && leads30.length === 0 ? "No leads in the last 60 days" : `${delta >= 0 ? "+" : ""}${delta} vs. previous 30 days`

  const attention: { key: string; href: string; icon: typeof CircleAlert; tone: string; text: string }[] = [
    ...down.map((c) => ({ key: `down-${c.id}`, href: "/admin/clients", icon: ServerCrash, tone: "text-destructive", text: `${c.name} is down${c.last_checked_at ? ` · checked ${timeAgo(c.last_checked_at)}` : ""}` })),
    ...(newLeads.length > 0 ? [{ key: "leads", href: "/admin/leads", icon: Inbox, tone: "text-primary", text: `${newLeads.length} new ${newLeads.length === 1 ? "lead" : "leads"} waiting for a reply` }] : []),
    ...(data && data.openChats > 0 ? [{ key: "chats", href: "/admin/chat", icon: MessagesSquare, tone: "text-primary", text: `${data.openChats} open ${data.openChats === 1 ? "conversation" : "conversations"}` }] : []),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={greeting()}
        description={new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) + " · Here's what's happening across ZeroPoint."}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leads · last 30 days" value={leads30.length} hint={leadsHint} icon={Inbox} href="/admin/leads" loading={loading} />
        <StatCard label="Open conversations" value={data?.openChats ?? 0} hint="Live chat from the site widget" icon={MessagesSquare} href="/admin/chat" loading={loading} />
        <StatCard
          label="Fleet uptime · 24h"
          value={formatPercent(fleetUptime)}
          hint={`${activeClients.length} active ${activeClients.length === 1 ? "client" : "clients"} monitored`}
          icon={down.length > 0 ? ServerCrash : Activity}
          tone={down.length > 0 ? "bad" : fleetUptime != null ? "good" : "neutral"}
          href="/admin/clients"
          loading={loading}
        />
        <StatCard label="Avg. response · 24h" value={fleetResponse != null ? `${fleetResponse}ms` : "—"} hint="Across successful checks" icon={Gauge} href="/admin/clients" loading={loading} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          title="Leads per day"
          description="Contact and estimate form submissions, last 30 days"
          action={<PanelLink href="/admin/leads">All leads</PanelLink>}
          className="xl:col-span-2"
          bodyClassName="px-5 pt-5 pb-3"
        >
          {loading ? <div className="h-[200px] animate-pulse rounded-lg bg-muted/60" /> : <DailyBarChart data={chart} label="Leads per day, last 30 days" />}
        </Panel>

        <Panel title="Needs attention" description="Things waiting on you" bodyClassName="p-2">
          {loading ? (
            <div className="space-y-2 p-3">{[0, 1, 2].map((i) => <div key={i} className="h-9 animate-pulse rounded-lg bg-muted/60" />)}</div>
          ) : attention.length === 0 ? (
            <EmptyState icon={CircleCheck} title="You're all caught up" description="No new leads, open chats, or sites down." />
          ) : (
            <ul>
              {attention.map(({ key, href, icon: Icon, tone, text }) => (
                <li key={key}>
                  <Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/60">
                    <Icon className={`size-4 shrink-0 ${tone}`} />
                    <span className="min-w-0 flex-1 truncate">{text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Recent leads" action={<PanelLink href="/admin/leads">View all</PanelLink>}>
          {loading ? (
            <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/60" />)}</div>
          ) : leads.length === 0 ? (
            <EmptyState icon={Inbox} title="No leads yet" description="Submissions from the contact and estimate forms land here." />
          ) : (
            <ul className="divide-y divide-border">
              {leads.slice(0, 6).map((lead) => (
                <li key={lead.id}>
                  <Link href="/admin/leads" className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40">
                    <InitialsAvatar name={lead.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="truncate text-xs text-text-tertiary">{lead.help || lead.email}</p>
                    </div>
                    <LeadStatusPill status={lead.status} />
                    <span className="hidden w-16 shrink-0 text-right text-xs text-text-tertiary sm:block">{timeAgo(lead.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Client health" description="Last 24 hours, one bar per hour" action={<PanelLink href="/admin/clients">Manage</PanelLink>}>
          {loading ? (
            <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/60" />)}</div>
          ) : activeClients.length === 0 ? (
            <EmptyState icon={Activity} title="No clients monitored" description="Add a client site to start uptime checks every 15 minutes." />
          ) : (
            <ul className="divide-y divide-border">
              {[...activeClients].sort((a, b) => Number(b.last_status === "down") - Number(a.last_status === "down")).slice(0, 6).map((client) => {
                const clientChecks = byClient.get(client.id) ?? []
                return (
                  <li key={client.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-foreground">{client.name}</p>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-xs text-text-tertiary tabular-nums">{formatPercent(uptimePercent(clientChecks))}</span>
                        <UptimePill status={client.last_status} />
                      </div>
                    </div>
                    <UptimeStrip slots={hourlySlots(clientChecks, 24)} className="mt-2.5" />
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}
