"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, MessagesSquare, Server } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Wordmark } from "@/components/nav/wordmark"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useAdminEmail } from "@/components/admin/admin-gate"

type Counts = { newLeads: number; openChats: number; clientsDown: number }

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, count: null },
  { href: "/admin/leads", label: "Leads", icon: Inbox, count: "newLeads" },
  { href: "/admin/chat", label: "Live chat", icon: MessagesSquare, count: "openChats" },
  { href: "/admin/clients", label: "Clients", icon: Server, count: "clientsDown" },
] as const

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/admin"
  return href === "/admin" ? path === "/admin" : path.startsWith(href)
}

// Sidebar badges. Refetched on navigation and window focus (cheap head-only
// count queries) and on a slow interval so a tab left open stays honest.
async function fetchCounts(): Promise<Counts> {
  const supabase = getSupabaseClient()
  const [leads, chats, clients] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("chat_conversations").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("last_status", "down").eq("status", "active"),
  ])
  return { newLeads: leads.count ?? 0, openChats: chats.count ?? 0, clientsDown: clients.count ?? 0 }
}

function useCounts(pathname: string) {
  const [counts, setCounts] = React.useState<Counts | null>(null)

  React.useEffect(() => {
    let cancelled = false
    const load = () => {
      fetchCounts().then((next) => {
        if (!cancelled) setCounts(next)
      })
    }
    load()
    window.addEventListener("focus", load)
    const interval = window.setInterval(load, 60_000)
    return () => {
      cancelled = true
      window.removeEventListener("focus", load)
      window.clearInterval(interval)
    }
  }, [pathname])

  return counts
}

function NavLinks({ pathname, counts, onNavigate }: { pathname: string; counts: Counts | null; onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5">
      <p className="px-3 pb-2 text-[11px] font-medium tracking-wider text-text-tertiary uppercase">Workspace</p>
      {LINKS.map(({ href, label, icon: Icon, count }) => {
        const active = isActive(pathname, href)
        const value = count && counts ? counts[count] : 0
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-white/8 text-foreground" : "text-text-secondary hover:bg-white/5 hover:text-foreground"
            )}
          >
            <Icon className={cn("size-4", active ? "text-primary" : "text-text-tertiary group-hover:text-text-secondary")} />
            <span className="flex-1">{label}</span>
            {value > 0 && (
              <span
                className={cn(
                  "min-w-5 rounded-full px-1.5 py-px text-center text-[11px] font-semibold tabular-nums",
                  count === "clientsDown" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                )}
              >
                {value}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function Account() {
  const email = useAdminEmail()
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white/3 p-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/25 text-xs font-semibold text-primary">
        {(email?.[0] ?? "A").toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground">{email ?? "Admin"}</p>
        <p className="text-[11px] text-text-tertiary">Administrator</p>
      </div>
      <button
        onClick={() => getSupabaseClient().auth.signOut()}
        title="Sign out"
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-white/8 hover:text-foreground"
      >
        <LogOut className="size-3.5" />
        <span className="sr-only">Sign out</span>
      </button>
    </div>
  )
}

function SidebarBody({ pathname, counts, onNavigate }: { pathname: string; counts: Counts | null; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 px-3 py-4">
      <Link href="/admin" onClick={onNavigate} className="group flex items-center justify-between px-2 py-1 text-foreground">
        <Wordmark />
        <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-text-tertiary uppercase">Admin</span>
      </Link>
      <NavLinks pathname={pathname} counts={counts} onNavigate={onNavigate} />
      <div className="mt-auto space-y-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <ExternalLink className="size-4 text-text-tertiary" />
          View live site
        </a>
        <Account />
      </div>
    </div>
  )
}

function SystemStatus({ counts }: { counts: Counts | null }) {
  if (!counts) return null
  const down = counts.clientsDown
  return (
    <Link
      href="/admin/clients"
      className="hidden items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:text-foreground sm:flex"
    >
      <span className="relative flex size-2">
        {down > 0 && <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-60" />}
        <span className={cn("relative inline-flex size-2 rounded-full", down > 0 ? "bg-destructive" : "bg-success")} />
      </span>
      {down > 0 ? `${down} client ${down === 1 ? "site" : "sites"} down` : "All client sites up"}
    </Link>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/admin"
  const counts = useCounts(pathname)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const current = LINKS.find((link) => isActive(pathname, link.href)) ?? LINKS[0]

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="theme-dark fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-background lg:block">
        <SidebarBody pathname={pathname} counts={counts} />
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="theme-dark w-72 bg-background p-0 sm:max-w-72">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarBody pathname={pathname} counts={counts} onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface-raised/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            onClick={() => setMenuOpen(true)}
            className="-ml-1 flex size-8 items-center justify-center rounded-md text-text-secondary hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="size-4.5" />
            <span className="sr-only">Open navigation</span>
          </button>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link href="/admin" className="text-text-tertiary hover:text-foreground">Admin</Link>
            <span className="text-text-tertiary">/</span>
            <span className="truncate font-medium text-foreground">{current.label}</span>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <SystemStatus counts={counts} />
          </div>
        </header>
        {/* Live chat is a workspace, not a page: it takes every pixel beside
            the sidebar and below the top bar, and scrolls inside its panes. */}
        {current.href === "/admin/chat" ? (
          <main className="h-[calc(100dvh-3.5rem)] overflow-hidden">{children}</main>
        ) : (
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        )}
      </div>
    </div>
  )
}
