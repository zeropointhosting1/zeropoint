"use client"

import { ClientsTable } from "@/components/admin/clients-table"

// The header (with its "Add client" action) lives in ClientsTable, since
// that's where the add/edit form state is.
export default function AdminClientsPage() {
  return <ClientsTable />
}
