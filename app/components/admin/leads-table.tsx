"use client"

import * as React from "react"
import { Check, CircleDot, Copy, Handshake, Inbox, Loader2, Mail, Percent, Search, SearchX } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/client"
import { formatDateTime, timeAgo } from "@/lib/admin/metrics"
import type { Lead, LeadStatus } from "@/lib/leads"
import { EmptyState, InitialsAvatar, LEAD_STATUS_LABEL, LeadStatusPill, Segmented, StatCard, adminInputClass } from "@/components/admin/ui"

const STATUSES: LeadStatus[] = ["new", "contacted", "won", "lost"]
type SourceFilter = "all" | "contact" | "estimate"
type StatusFilter = "all" | LeadStatus

export function LeadsTable() {
  const [leads, setLeads] = React.useState<Lead[] | null>(null)
  const [sourceFilter, setSourceFilter] = React.useState<SourceFilter>("all")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    getSupabaseClient()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setLeads((data as Lead[]) ?? [])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const all = leads ?? []
  const search = query.trim().toLowerCase()
  const filtered = all.filter(
    (lead) =>
      (sourceFilter === "all" || lead.source === sourceFilter) &&
      (statusFilter === "all" || lead.status === statusFilter) &&
      (!search || [lead.name, lead.email, lead.help, lead.message].filter(Boolean).join(" ").toLowerCase().includes(search))
  )
  const selected = all.find((lead) => lead.id === selectedId) ?? null

  const counts = Object.fromEntries(STATUSES.map((s) => [s, all.filter((l) => l.status === s).length])) as Record<LeadStatus, number>
  const decided = counts.won + counts.lost
  const winRate = decided > 0 ? `${Math.round((counts.won / decided) * 100)}%` : "—"

  async function updateLead(id: string, patch: Partial<Pick<Lead, "status" | "notes">>) {
    await getSupabaseClient().from("leads").update(patch).eq("id", id)
    setLeads((current) => current?.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)) ?? null)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total leads" value={all.length} hint="All time" icon={Inbox} loading={!leads} />
        <StatCard label="Awaiting reply" value={counts.new} hint="Status: New" icon={CircleDot} loading={!leads} />
        <StatCard label="Won" value={counts.won} hint={`${counts.contacted} in conversation`} icon={Handshake} tone={counts.won > 0 ? "good" : "neutral"} loading={!leads} />
        <StatCard label="Win rate" value={winRate} hint="Won ÷ (won + lost)" icon={Percent} loading={!leads} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface-raised shadow-[0_1px_2px_oklch(0.2_0.03_282/4%)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-3">
          <div className="relative min-w-48 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-tertiary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, message…" aria-label="Search leads" className={cn(adminInputClass, "py-1.5 pl-8")} />
          </div>
          <Segmented
            value={sourceFilter}
            onChange={setSourceFilter}
            options={[
              { value: "all", label: "All sources" },
              { value: "contact", label: "Contact", count: all.filter((l) => l.source === "contact").length },
              { value: "estimate", label: "Estimate", count: all.filter((l) => l.source === "estimate").length },
            ]}
          />
          <Segmented
            value={statusFilter}
            onChange={setStatusFilter}
            className="max-w-full overflow-x-auto"
            options={[{ value: "all", label: "Any status" }, ...STATUSES.map((s) => ({ value: s, label: LEAD_STATUS_LABEL[s], count: counts[s] }))]}
          />
        </div>

        {!leads ? (
          <div className="flex justify-center py-20"><Loader2 className="size-5 animate-spin text-text-tertiary" /></div>
        ) : filtered.length === 0 ? (
          all.length === 0 ? (
            <EmptyState icon={Inbox} title="No leads yet" description="Submissions from the contact and estimate forms will show up here." />
          ) : (
            <EmptyState
              icon={SearchX}
              title="No leads match"
              description="Try a different search or clear the filters."
              action={<Button size="sm" variant="outline" onClick={() => { setQuery(""); setSourceFilter("all"); setStatusFilter("all") }}>Clear filters</Button>}
            />
          )
        ) : (
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-xs font-medium text-text-tertiary">Contact</TableHead>
                <TableHead className="hidden text-xs font-medium text-text-tertiary md:table-cell">Needs help with</TableHead>
                <TableHead className="hidden text-xs font-medium text-text-tertiary sm:table-cell">Source</TableHead>
                <TableHead className="text-xs font-medium text-text-tertiary">Status</TableHead>
                <TableHead className="pr-4 text-right text-xs font-medium text-text-tertiary">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lead) => (
                <TableRow
                  key={lead.id}
                  tabIndex={0}
                  onClick={() => setSelectedId(lead.id)}
                  onKeyDown={(e) => { if (e.key === "Enter") setSelectedId(lead.id) }}
                  className={cn("cursor-pointer", lead.status === "new" && "bg-primary/[0.025]")}
                >
                  <TableCell className="py-3 pl-4">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={lead.name} />
                      <div className="min-w-0">
                        <p className={cn("truncate text-sm text-foreground", lead.status === "new" ? "font-semibold" : "font-medium")}>{lead.name}</p>
                        <p className="truncate text-xs text-text-tertiary">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-64 truncate text-text-secondary md:table-cell">{lead.help || <span className="text-text-tertiary">—</span>}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-text-secondary capitalize">{lead.source}</span>
                  </TableCell>
                  <TableCell><LeadStatusPill status={lead.status} /></TableCell>
                  <TableCell className="pr-4 text-right text-xs text-text-tertiary tabular-nums" title={new Date(lead.created_at).toLocaleString()}>{timeAgo(lead.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {leads && filtered.length > 0 && (
          <div className="border-t border-border px-4 py-2.5 text-xs text-text-tertiary">
            Showing {filtered.length} of {all.length} {all.length === 1 ? "lead" : "leads"}
          </div>
        )}
      </div>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          {selected && <LeadDetail key={selected.id} lead={selected} onUpdate={(patch) => updateLead(selected.id, patch)} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function LeadDetail({ lead, onUpdate }: { lead: Lead; onUpdate: (patch: Partial<Pick<Lead, "status" | "notes">>) => Promise<void> }) {
  const [copied, setCopied] = React.useState(false)
  const [notes, setNotes] = React.useState(lead.notes ?? "")
  const [notesState, setNotesState] = React.useState<"idle" | "saving" | "saved">("idle")

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(lead.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard can be blocked (insecure origin, permissions) — the email is still visible to select.
    }
  }

  async function saveNotes() {
    if (notes === (lead.notes ?? "")) return
    setNotesState("saving")
    await onUpdate({ notes })
    setNotesState("saved")
  }

  const details = lead.details ? Object.entries(lead.details).filter(([, v]) => v != null && v !== "") : []

  return (
    <>
      <SheetHeader className="border-b border-border p-5 pr-12">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={lead.name} className="size-10 text-sm" />
          <div className="min-w-0">
            <SheetTitle className="truncate text-base font-semibold">{lead.name}</SheetTitle>
            <p className="text-xs text-text-tertiary">
              <span className="capitalize">{lead.source}</span> form · {formatDateTime(lead.created_at)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" render={<a href={`mailto:${lead.email}`} />}><Mail />Reply by email</Button>
          <Button size="sm" variant="outline" onClick={copyEmail}>{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy email"}</Button>
        </div>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
        <Section label="Status">
          <Segmented value={lead.status} onChange={(status) => onUpdate({ status })} className="w-full" options={STATUSES.map((s) => ({ value: s, label: LEAD_STATUS_LABEL[s] }))} />
        </Section>

        <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-2.5">
          <dt className="text-text-tertiary">Email</dt>
          <dd className="truncate text-foreground">{lead.email}</dd>
          {lead.help && (
            <>
              <dt className="text-text-tertiary">Help with</dt>
              <dd className="text-foreground">{lead.help}</dd>
            </>
          )}
          {details.map(([key, value]) => (
            <React.Fragment key={key}>
              <dt className="truncate text-text-tertiary capitalize">{key.replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}</dt>
              <dd className="break-words text-foreground">{typeof value === "object" ? JSON.stringify(value) : String(value)}</dd>
            </React.Fragment>
          ))}
        </dl>

        <Section label="Message">
          <p className="rounded-lg border border-border bg-muted/40 p-3.5 leading-relaxed whitespace-pre-wrap text-text-secondary">{lead.message}</p>
        </Section>

        <Section
          label="Internal notes"
          aside={notesState === "saving" ? "Saving…" : notesState === "saved" ? "Saved" : "Saves when you click away"}
        >
          <textarea
            value={notes}
            rows={5}
            onChange={(e) => { setNotes(e.target.value); setNotesState("idle") }}
            onBlur={saveNotes}
            placeholder="Call notes, quotes sent, follow-up dates…"
            className={cn(adminInputClass, "resize-y")}
          />
        </Section>
      </div>
    </>
  )
}

function Section({ label, aside, children }: { label: string; aside?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-text-tertiary">{label}</p>
        {aside && <p className="text-[11px] text-text-tertiary">{aside}</p>}
      </div>
      {children}
    </div>
  )
}
