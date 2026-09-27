"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { addClient, updateClient, type Client, type ClientStatus } from "@/lib/clients"

const inputClass = "mt-1.5 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-3 focus:ring-primary/10"

export function ClientForm({
  open,
  onOpenChange,
  client,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
  onSaved: (client: Client) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Keyed by client identity so each open (or switching between add/
            edit different clients) mounts fresh field state instead of
            needing an effect to reset it. */}
        {open && <ClientFormBody key={client?.id ?? "new"} client={client} onSaved={onSaved} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function ClientFormBody({
  client,
  onSaved,
  onDone,
}: {
  client: Client | null
  onSaved: (client: Client) => void
  onDone: () => void
}) {
  const [name, setName] = React.useState(client?.name ?? "")
  const [siteUrl, setSiteUrl] = React.useState(client?.site_url ?? "")
  const [contactName, setContactName] = React.useState(client?.contact_name ?? "")
  const [contactEmail, setContactEmail] = React.useState(client?.contact_email ?? "")
  const [contactPhone, setContactPhone] = React.useState(client?.contact_phone ?? "")
  const [status, setStatus] = React.useState<ClientStatus>(client?.status ?? "active")
  const [notes, setNotes] = React.useState(client?.notes ?? "")
  const [saving, setSaving] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    const input = {
      name: name.trim(),
      site_url: siteUrl.trim(),
      contact_name: contactName.trim() || undefined,
      contact_email: contactEmail.trim() || undefined,
      contact_phone: contactPhone.trim() || undefined,
      notes: notes.trim() || undefined,
      status,
    }
    try {
      if (client) {
        await updateClient(client.id, input)
        onSaved({ ...client, ...input, contact_name: input.contact_name ?? null, contact_email: input.contact_email ?? null, contact_phone: input.contact_phone ?? null, notes: input.notes ?? null })
      } else {
        onSaved(await addClient(input))
      }
      onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{client ? "Edit client" : "Add client"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-2">
        <label className="block text-sm"><span className="font-medium text-foreground">Name</span><input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></label>
        <label className="block text-sm"><span className="font-medium text-foreground">Site URL</span><input required type="url" placeholder="https://example.com" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className={inputClass} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm"><span className="font-medium text-foreground">Contact name</span><input value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm">
            <span className="font-medium text-foreground">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)} className={inputClass}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm"><span className="font-medium text-foreground">Contact email</span><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClass} /></label>
          <label className="block text-sm"><span className="font-medium text-foreground">Contact phone</span><input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputClass} /></label>
        </div>
        <label className="block text-sm"><span className="font-medium text-foreground">Notes</span><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass + " resize-y"} /></label>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="size-4 animate-spin" />}{client ? "Save" : "Add client"}</Button>
      </DialogFooter>
    </form>
  )
}
