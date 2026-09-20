import { cn } from "@/lib/utils"
import type { TocItem } from "@/lib/docs"

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="font-mono text-[11px] tracking-[0.15em] text-text-tertiary uppercase">
        On this page
      </p>
      <ul className="mt-3 space-y-2 border-l border-border pl-3">
        {items.map((item) => (
          <li key={item.slug} className={cn(item.depth === 3 && "pl-3")}>
            <a
              href={`#${item.slug}`}
              className="block text-text-secondary transition-colors hover:text-foreground"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
