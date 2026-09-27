import type { Metadata } from "next"
import { AdminGate } from "@/components/admin/admin-gate"
import { AdminNav } from "@/components/admin/admin-nav"

// Kept out of search entirely, like /estimate — but unlike /estimate this
// is never linked from anywhere on the public site either.
export const metadata: Metadata = {
  title: "Admin — ZeroPoint",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="min-h-screen bg-surface">
        <AdminNav />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </div>
    </AdminGate>
  )
}
