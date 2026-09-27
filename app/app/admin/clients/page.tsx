"use client"

import { ClientsTable } from "@/components/admin/clients-table"

export default function AdminClientsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
      <p className="mt-1 text-sm text-text-secondary">Sites checked every 15 minutes by a scheduled GitHub Actions job.</p>
      <div className="mt-6">
        <ClientsTable />
      </div>
    </div>
  )
}
