"use client"

import { LeadsTable } from "@/components/admin/leads-table"
import { PageHeader } from "@/components/admin/ui"

export default function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="Contact and estimate form submissions from the site." />
      <LeadsTable />
    </div>
  )
}
