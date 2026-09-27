"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Lead, LeadStatus } from "@/lib/leads"

const STATUS_BADGE: Record<LeadStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  new: "default",
  contacted: "secondary",
  won: "outline",
  lost: "destructive",
}

const STATUSES: LeadStatus[] = ["new", "contacted", "won", "lost"]

export function LeadsTable() {
  const [leads, setLeads] = React.useState<Lead[] | null>(null)
  const [sourceFilter, setSourceFilter] = React.useState<"all" | "contact" | "estimate">("all")
  const [selected, setSelected] = React.useState<Lead | null>(null)

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

  const filtered = leads?.filter((lead) => sourceFilter === "all" || lead.source === sourceFilter) ?? []

  async function updateLead(id: string, patch: Partial<Pick<Lead, "status" | "notes">>) {
    await getSupabaseClient().from("leads").update(patch).eq("id", id)
    setLeads((current) => current?.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)) ?? null)
    setSelected((current) => (current && current.id === id ? { ...current, ...patch } : current))
  }

  if (!leads) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-text-tertiary" />
      </div>
    )
  }

  return (
    <>
      <Tabs value={sourceFilter} onValueChange={(v) => setSourceFilter(v as typeof sourceFilter)}>
        <TabsList>
          <TabsTrigger value="all">All ({leads.length})</TabsTrigger>
          <TabsTrigger value="contact">Contact ({leads.filter((l) => l.source === "contact").length})</TabsTrigger>
          <TabsTrigger value="estimate">Estimate ({leads.filter((l) => l.source === "estimate").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface-raised">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Help with</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-text-tertiary">No leads yet.</TableCell>
              </TableRow>
            )}
            {filtered.map((lead) => (
              <TableRow key={lead.id} onClick={() => setSelected(lead)} className="cursor-pointer">
                <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                <TableCell className="capitalize text-text-secondary">{lead.source}</TableCell>
                <TableCell className="text-text-secondary">{lead.help || "—"}</TableCell>
                <TableCell><Badge variant={STATUS_BADGE[lead.status]}>{lead.status}</Badge></TableCell>
                <TableCell className="text-text-tertiary">{new Date(lead.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <p className="text-xs text-text-tertiary">{new Date(selected.created_at).toLocaleString()}</p>
              </SheetHeader>
              <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 text-sm">
                <Field label="Email"><a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a></Field>
                <Field label="Source"><span className="capitalize">{selected.source}</span></Field>
                {selected.help && <Field label="Help with">{selected.help}</Field>}
                <Field label="Message"><p className="whitespace-pre-wrap text-text-secondary">{selected.message}</p></Field>
                {selected.details && (
                  <Field label="Details">
                    <pre className="overflow-x-auto rounded-lg bg-surface p-3 text-xs text-text-secondary">{JSON.stringify(selected.details, null, 2)}</pre>
                  </Field>
                )}

                <Field label="Status">
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((status) => (
                      <Button
                        key={status}
                        type="button"
                        size="sm"
                        variant={selected.status === status ? "default" : "outline"}
                        onClick={() => updateLead(selected.id, { status })}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </Field>

                <Field label="Notes">
                  <textarea
                    defaultValue={selected.notes ?? ""}
                    rows={4}
                    onBlur={(e) => updateLead(selected.id, { notes: e.target.value })}
                    placeholder="Internal notes…"
                    className="w-full resize-y rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                  />
                </Field>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}
