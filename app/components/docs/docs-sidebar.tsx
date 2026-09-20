"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { DocMeta } from "@/lib/docs"

export function DocsSidebar({
  groups,
}: {
  groups: { category: string; label: string; docs: DocMeta[] }[]
}) {
  const pathname = usePathname()

  return (
    <nav aria-label="Documentation categories" className="text-sm">
      <ul className="space-y-6">
        {groups.map((group) => (
          <li key={group.category}>
            <p className="font-mono text-[11px] tracking-[0.15em] text-text-tertiary uppercase">
              {group.label}
            </p>
            <ul className="mt-2 space-y-1 border-l border-border pl-3">
              {group.docs.map((doc) => {
                const href = `/docs/${doc.category}/${doc.slug}`
                const active = pathname === href
                return (
                  <li key={doc.slug}>
                    <Link
                      href={href}
                      className={cn(
                        "block py-1 leading-snug transition-colors",
                        active ? "text-primary" : "text-text-secondary hover:text-foreground"
                      )}
                    >
                      {doc.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
