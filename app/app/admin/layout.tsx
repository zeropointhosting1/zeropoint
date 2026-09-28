import type { Metadata } from "next"
import { AdminGate } from "@/components/admin/admin-gate"
import { AdminShell } from "@/components/admin/admin-shell"

// Kept out of search entirely, like /estimate — but unlike /estimate this
// is never linked from anywhere on the public site either.
export const metadata: Metadata = {
  title: "Admin — ZeroPoint",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  )
}
