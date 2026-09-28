"use client"

import * as React from "react"
import { Activity, ExternalLink, Gauge, Loader2, Mail, Pencil, Phone, Plus, Search, SearchX, Server, ServerCrash, Trash2, User } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { fetchClientChecks, fetchClients, fetchRecentChecks, removeClient, type Client, type ClientCheck } from "@/lib/clients"
import { averageResponse, formatDateTime, formatPercent, hourlySlots, timeAgo, uptimePercent } from "@/lib/admin/metrics"
import { ClientForm } from "@/components/admin/client-form"
import { ResponseTimeChart, UptimeStrip } from "@/components/admin/charts"
import { EmptyState, PageHeader, Segmented, StatCard, UptimePill, adminInputClass } from "@/components/admin/ui"

type Filter = "all" | "down" | "active" | "inactive"

export function ClientsTable() {
  const [clients, setClients] = React.useState<Client[] | null>(null)
  const [checks, setChecks] = React.useState<ClientCheck[]>([])
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Client | null>(null)
  const [detailId, setDetailId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState<Client | null>(null)
  const [filter, setFilter] = React.useState<Filter>("all")
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    Promise.all([fetchClients(), fetchRecentChecks(new Date(Date.now() - 86_400_000).toISOString())]).then(([clientRows, checkRows]) => {
      if (cancelled) return
      setClients(clientRows)
      setChecks(checkRows)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  const byClient = React.useMemo(() => {
    const map = new Map<string, ClientCheck[]>()
    for (const check of checks) map.set(check.client_id, [...(map.get(check.client_id) ?? []), check])
    return map
  }, [checks])

  function openEdit(client: Client) {
    setEditing(client)
    setFormOpen(true)
  }

  function handleSaved(client: Client) {
    setClients((current) => {
      if (!current) return [client]
      const exists = current.some((c) => c.id === client.id)
      return exists ? current.map((c) => (c.id === client.id ? client : c)) : [...current, client].sort((a, b) => a.name.localeCompare(b.name))
    })
  }

  async function confirmDelete() {
    if (!deleting) return
    const id = deleting.id
    await removeClient(id)
    setClients((current) => current?.filter((c) => c.id !== id) ?? null)
    setDeleting(null)
    setDetailId((current) => (current === id ? null : current))
  }

  const all = clients ?? []
  const active = all.filter((c) => c.status === "active")
  const down = active.filter((c) => c.last_status === "down")
  const activeChecks = checks.filter((c) => active.some((a) => a.id === c.client_id))
  const search = query.trim().toLowerCase()
  const filtered = all.filter((c) => {
    if (filter === "down" && !(c.status === "active" && c.last_status === "down")) return false
    if (filter === "active" && c.status !== "active") return false
    if (filter === "inactive" && c.status === "active") return false
    return !search || [c.name, c.site_url, c.contact_name, c.contact_email].filter(Boolean).join(" ").toLowerCase().includes(search)
  })
  const detail = all.find((c) => c.id === detailId) ?? null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Client sites checked every 15 minutes by a scheduled GitHub Actions job."
        actions={<Button onClick={openAdd}><Plus />Add client</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monitored sites" value={active.length} hint={`${all.length - active.length} paused or cancelled`} icon={Server} loading={!clients} />
        <StatCard label="Currently down" value={down.length} hint={down.length ? down.map((c) => c.name).join(", ") : "Everything is responding"} icon={ServerCrash} tone={down.length ? "bad" : "good"} loading={!clients} />
        <StatCard label="Uptime · 24h" value={formatPercent(uptimePercent(activeChecks))} hint={`${activeChecks.length} checks`} icon={Activity} loading={!clients} />
        <StatCard label="Avg. response · 24h" value={(() => { const avg = averageResponse(activeChecks); return avg != null ? `${avg}ms` : "—" })()} hint="Successful checks only" icon={Gauge} loading={!clients} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface-raised shadow-[0_1px_2px_oklch(0.2_0.03_282/4%)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-3">
          <div className="relative min-w-48 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-tertiary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clients or sites…" aria-label="Search clients" className={cn(adminInputClass, "py-1.5 pl-8")} />
          </div>
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: all.length },
              { value: "down", label: "Down", count: down.length },
              { value: "active", label: "Active", count: active.length },
              { value: "inactive", label: "Inactive", count: all.length - active.length },
            ]}
          />
        </div>

        {!clients ? (
          <div className="flex justify-center py-20"><Loader2 className="size-5 animate-spin text-text-tertiary" /></div>
        ) : filtered.length === 0 ? (
          all.length === 0 ? (
            <EmptyState
              icon={Server}
              title="No clients yet"
              description="Add a client's site and it'll be checked every 15 minutes."
              action={<Button size="sm" onClick={openAdd}><Plus />Add client</Button>}
            />
          ) : (
            <EmptyState icon={SearchX} title="No clients match" description="Try a different search or filter." />
          )
        ) : (
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-xs font-medium text-text-tertiary">Client</TableHead>
                <TableHead className="text-xs font-medium text-text-tertiary">Status</TableHead>
                <TableHead className="hidden w-[34%] text-xs font-medium text-text-tertiary lg:table-cell">Last 24 hours</TableHead>
                <TableHead className="hidden text-right text-xs font-medium text-text-tertiary md:table-cell">Response</TableHead>
                <TableHead className="hidden text-right text-xs font-medium text-text-tertiary sm:table-cell">Checked</TableHead>
                <TableHead className="w-20 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => {
                const clientChecks = byClient.get(client.id) ?? []
                const inactive = client.status !== "active"
                return (
                  <TableRow
                    key={client.id}
                    tabIndex={0}
                    className={cn("cursor-pointer", inactive && "opacity-60")}
                    onClick={() => setDetailId(client.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") setDetailId(client.id) }}
                  >
                    <TableCell className="py-3 pl-4">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 truncate text-sm font-medium text-foreground">
                          {client.name}
                          {inactive && <span className="rounded bg-muted px-1.5 py-px text-[10px] font-medium tracking-wide text-text-secondary uppercase">{client.status}</span>}
                        </p>
                        <a
                          href={client.site_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex max-w-full items-center gap-1 truncate text-xs text-text-tertiary hover:text-primary"
                        >
                          {client.site_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell><UptimePill status={client.last_status} /></TableCell>
                    <TableCell className="hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <UptimeStrip slots={hourlySlots(clientChecks, 24)} className="flex-1" />
                        <span className="w-12 shrink-0 text-right text-xs text-text-secondary tabular-nums">{formatPercent(uptimePercent(clientChecks))}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-right text-xs text-text-secondary tabular-nums md:table-cell">{client.last_response_ms != null ? `${client.last_response_ms}ms` : "—"}</TableCell>
                    <TableCell className="hidden text-right text-xs text-text-tertiary sm:table-cell">{client.last_checked_at ? timeAgo(client.last_checked_at) : "Never"}</TableCell>
                    <TableCell className="pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-0.5">
                        <Button size="icon-sm" variant="ghost" onClick={() => openEdit(client)} title="Edit"><Pencil /><span className="sr-only">Edit {client.name}</span></Button>
                        <Button size="icon-sm" variant="ghost" onClick={() => setDeleting(client)} title="Remove" className="hover:text-destructive"><Trash2 /><span className="sr-only">Remove {client.name}</span></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <ClientForm open={formOpen} onOpenChange={setFormOpen} client={editing} onSaved={handleSaved} />

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This stops monitoring and permanently deletes the client&rsquo;s check history. To keep the history, set the client to paused instead.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>Remove client</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={detail !== null} onOpenChange={(open) => !open && setDetailId(null)}>
        <SheetContent className="w-full gap-0 sm:max-w-lg">
          {detail && <ClientDetail key={detail.id} client={detail} onEdit={() => openEdit(detail)} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ClientDetail({ client, onEdit }: { client: Client; onEdit: () => void }) {
  const [checks, setChecks] = React.useState<ClientCheck[] | null>(null)

  React.useEffect(() => {
    let cancelled = false
    // ~24h at the 15-minute cadence.
    fetchClientChecks(client.id, 96).then((data) => {
      if (!cancelled) setChecks(data)
    })
    return () => {
      cancelled = true
    }
  }, [client.id])

  const chronological = checks ? [...checks].reverse() : []

  return (
    <>
      <SheetHeader className="border-b border-border p-5 pr-12">
        <div className="flex items-center gap-2">
          <SheetTitle className="truncate text-base font-semibold">{client.name}</SheetTitle>
          <UptimePill status={client.last_status} />
        </div>
        <a href={client.site_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-primary">
          {client.site_url}
          <ExternalLink className="size-3" />
        </a>
        <div className="mt-3">
          <Button size="sm" variant="outline" onClick={onEdit}><Pencil />Edit client</Button>
        </div>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
        <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
          {[
            { label: "Uptime", value: checks ? formatPercent(uptimePercent(checks)) : "…" },
            { label: "Avg. response", value: checks ? (averageResponse(checks) != null ? `${averageResponse(checks)}ms` : "—") : "…" },
            { label: "Checks", value: checks ? String(checks.length) : "…" },
          ].map((stat) => (
            <div key={stat.label} className="px-3 py-3">
              <p className="text-[11px] text-text-tertiary">{stat.label}</p>
              <p className="mt-0.5 text-base font-semibold text-foreground tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-text-tertiary">Response time · last {checks?.length ?? 0} checks</p>
          {!checks ? (
            <div className="h-40 animate-pulse rounded-lg bg-muted/60" />
          ) : checks.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-text-tertiary">No checks recorded yet — they run every 15 minutes.</p>
          ) : (
            <ResponseTimeChart data={chronological.map((c) => ({ at: c.checked_at, ms: c.response_ms, up: c.is_up }))} />
          )}
        </div>

        {(client.contact_name || client.contact_email || client.contact_phone) && (
          <div>
            <p className="mb-2 text-xs font-medium text-text-tertiary">Contact</p>
            <ul className="space-y-1.5">
              {client.contact_name && <li className="flex items-center gap-2 text-foreground"><User className="size-3.5 text-text-tertiary" />{client.contact_name}</li>}
              {client.contact_email && <li className="flex items-center gap-2"><Mail className="size-3.5 text-text-tertiary" /><a href={`mailto:${client.contact_email}`} className="text-primary hover:underline">{client.contact_email}</a></li>}
              {client.contact_phone && <li className="flex items-center gap-2"><Phone className="size-3.5 text-text-tertiary" /><a href={`tel:${client.contact_phone}`} className="text-foreground hover:text-primary">{client.contact_phone}</a></li>}
            </ul>
          </div>
        )}

        {client.notes && (
          <div>
            <p className="mb-2 text-xs font-medium text-text-tertiary">Notes</p>
            <p className="rounded-lg border border-border bg-muted/40 p-3.5 leading-relaxed whitespace-pre-wrap text-text-secondary">{client.notes}</p>
          </div>
        )}

        {checks && checks.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-text-tertiary">Recent checks</p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-border">
                  {checks.slice(0, 12).map((check) => (
                    <tr key={check.id}>
                      <td className="px-3 py-2">
                        <span className={cn("inline-flex items-center gap-1.5 font-medium", check.is_up ? "text-success" : "text-destructive")}>
                          <span className={cn("size-1.5 rounded-full", check.is_up ? "bg-success" : "bg-destructive")} />
                          {check.is_up ? "Up" : "Down"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-text-secondary tabular-nums">{check.status_code ?? "—"}</td>
                      <td className="max-w-40 truncate px-3 py-2 text-text-secondary tabular-nums" title={check.error ?? undefined}>{check.error ?? (check.response_ms != null ? `${check.response_ms}ms` : "—")}</td>
                      <td className="px-3 py-2 text-right text-text-tertiary">{formatDateTime(check.checked_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
