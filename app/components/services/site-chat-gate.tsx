"use client"

import { usePathname } from "next/navigation"
import { SiteChat } from "@/components/services/service-chat"

// The visitor chat bubble belongs on the public site only — inside /admin
// it would sit on top of the dashboard (and the admin's own live chat).
export function SiteChatGate() {
  const pathname = usePathname() ?? ""
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null
  return <SiteChat />
}
