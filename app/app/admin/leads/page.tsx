"use client"

import { LeadsTable } from "@/components/admin/leads-table"

export default function AdminLeadsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
      <p className="mt-1 text-sm text-text-secondary">Contact and estimate form submissions.</p>
      <div className="mt-6">
        <LeadsTable />
      </div>
    </div>
  )
}
