"use client"

import * as React from "react"
import { CircleCheck, CircleX, HelpCircle, Loader2, Plus, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { fetchClients, fetchClientChecks, removeClient, type Client, type ClientCheck } from "@/lib/clients"
import { ClientForm } from "@/components/admin/client-form"

const STATUS_ICON: Record<Client["last_status"], React.ElementType> = {
  up: CircleCheck,
  down: CircleX,
  unknown: HelpCircle,
}
const STATUS_TONE: Record<Client["last_status"], string> = {
  up: "text-success",
  down: "text-destructive",
  unknown: "text-text-tertiary",
}

export function ClientsTable() {
  const [clients, setClients] = React.useState<Client[] | null>(null)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Client | null>(null)
  const [detail, setDetail] = React.useState<Client | null>(null)

  React.useEffect(() => {
    let cancelled = false
    fetchClients().then((data) => {
      if (!cancelled) setClients(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

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

  async function handleDelete(client: Client) {
    if (!window.confirm(`Remove ${client.name}? This deletes its check history too.`)) return
    await removeClient(client.id)
    setClients((current) => current?.filter((c) => c.id !== client.id) ?? null)
  }

  if (!clients) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-text-tertiary" />
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openAdd}><Plus className="size-4" />Add client</Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface-raised">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last checked</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 && (
              <TableRow><TableCell colSpan={5} className="py-10 text-center text-text-tertiary">No clients yet.</TableCell></TableRow>
            )}
            {clients.map((client) => {
              const Icon = STATUS_ICON[client.last_status]
              return (
                <TableRow key={client.id} className="cursor-pointer" onClick={() => setDetail(client)}>
                  <TableCell className="font-medium text-foreground">{client.name}{client.status !== "active" && <Badge variant="outline" className="ml-2">{client.status}</Badge>}</TableCell>
                  <TableCell><a href={client.site_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-primary hover:underline">{client.site_url.replace(/^https?:\/\//, "")}</a></TableCell>
                  <TableCell><span className={cn("flex items-center gap-1.5 text-sm", STATUS_TONE[client.last_status])}><Icon className="size-4" />{client.last_status}{client.last_response_ms != null && ` · ${client.last_response_ms}ms`}</span></TableCell>
                  <TableCell className="text-text-tertiary">{client.last_checked_at ? new Date(client.last_checked_at).toLocaleString() : "Never"}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEdit(client)}>Edit</Button>
                      <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(client)}><Trash2 className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <ClientForm open={formOpen} onOpenChange={setFormOpen} client={editing} onSaved={handleSaved} />

      <Sheet open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent>
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>{detail.name}</SheetTitle>
                <p className="text-xs text-text-tertiary">{detail.site_url}</p>
              </SheetHeader>
              <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 text-sm">
                {detail.notes && <p className="text-text-secondary whitespace-pre-wrap">{detail.notes}</p>}
                <ClientCheckHistory key={detail.id} clientId={detail.id} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function ClientCheckHistory({ clientId }: { clientId: string }) {
  const [checks, setChecks] = React.useState<ClientCheck[] | null>(null)

  React.useEffect(() => {
    let cancelled = false
    fetchClientChecks(clientId).then((data) => {
      if (!cancelled) setChecks(data)
    })
    return () => {
      cancelled = true
    }
  }, [clientId])

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Check history</p>
      {!checks ? (
        <Loader2 className="mt-3 size-4 animate-spin text-text-tertiary" />
      ) : checks.length === 0 ? (
        <p className="mt-2 text-text-tertiary">No checks recorded yet — runs every 15 minutes.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {checks.map((check) => (
            <li key={check.id} className="flex items-center justify-between gap-2 text-xs">
              <span className={check.is_up ? "text-success" : "text-destructive"}>{check.is_up ? "Up" : "Down"}</span>
              <span className="text-text-tertiary">{new Date(check.checked_at).toLocaleString()}</span>
              <span className="text-text-tertiary">{check.error ?? (check.response_ms != null ? `${check.response_ms}ms` : "—")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
