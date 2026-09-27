"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessagesSquare, Inbox, Server, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/client"

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/chat", label: "Chat", icon: MessagesSquare },
  { href: "/admin/clients", label: "Clients", icon: Server },
] as const

export function AdminNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-raised/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-6 py-3">
        <span className="mr-4 text-sm font-semibold text-foreground">ZeroPoint admin</span>
        <nav className="flex flex-1 items-center gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" || pathname === "/admin/" : pathname?.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-surface hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            )
          })}
        </nav>
        <button
          onClick={() => getSupabaseClient().auth.signOut()}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </header>
  )
}
