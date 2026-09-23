import { ArrowUpRight, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Deal } from "@/lib/deals"

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <a
      href={deal.listingUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group block overflow-hidden rounded-2xl border bg-surface-raised transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_var(--accent-glow)]",
        deal.isHotDeal ? "border-warning/30 hover:border-warning/50" : "border-border hover:border-primary/30"
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote eBay image, not a local asset next/image can optimize on a static export */}
        <img src={deal.imageUrl} alt={deal.title} className="h-full w-full object-cover" loading="lazy" />
        {deal.isHotDeal && (
          <span
            title="Priced well below other current listings for this search"
            className="absolute top-2 left-2 flex items-center gap-1 rounded-full border border-warning/30 bg-background/85 px-2 py-1 font-mono text-[10px] tracking-wider text-warning uppercase backdrop-blur-sm"
          >
            <Flame className="size-3" />
            Good price
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-foreground">
            {deal.title}
          </h3>
          <ArrowUpRight className="size-4 shrink-0 text-text-tertiary transition-colors group-hover:text-primary" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-lg font-semibold text-foreground">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: deal.currency }).format(deal.price)}
          </span>
          <span className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
            {deal.condition}
          </span>
        </div>
        {deal.shipping && <p className="mt-1 text-xs text-text-tertiary">{deal.shipping}</p>}
        {deal.isHotDeal && <p className="mt-2 text-xs leading-relaxed text-warning">Why this pick: priced below other current listings for this search.</p>}
      </div>
    </a>
  )
}
