import { ArrowUpRight, Cpu, Flame, HardDrive, MemoryStick, PlugZap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Deal } from "@/lib/deals"

export type EnrichedDeal = Deal & {
  cpuLabel: string | null
  cpuGeneration: number | null
  ramGb: number | null
  storageLabel: string | null
  powerAdapter: "included" | "not-included" | null
  isBarebones: boolean
  // Price + parsed shipping cost — what "good price" is actually compared
  // against, and what's shown as the real out-the-door total below.
  totalCost: number
  isGoodPrice: boolean
}

export function DealCard({ deal }: { deal: EnrichedDeal }) {
  const chips = [
    deal.cpuLabel ? { icon: Cpu, label: deal.cpuGeneration ? `${deal.cpuLabel} (${deal.cpuGeneration}th gen)` : deal.cpuLabel } : null,
    deal.ramGb ? { icon: MemoryStick, label: `${deal.ramGb} GB RAM` } : null,
    deal.storageLabel ? { icon: HardDrive, label: deal.storageLabel } : null,
    deal.powerAdapter ? { icon: PlugZap, label: deal.powerAdapter === "included" ? "Adapter included" : "No adapter" } : null,
  ].filter((c): c is { icon: typeof Cpu; label: string } => c !== null)

  return (
    // Not an affiliate link today — supabase/functions/ebay-deals/index.ts
    // passes eBay's itemWebUrl through untouched, with no campaign/partner
    // ID appended. If that changes, a visible disclosure belongs right
    // here, next to the link, not just on /terms.
    <a
      href={deal.listingUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group block overflow-hidden rounded-2xl border bg-surface-raised transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_var(--accent-glow)]",
        deal.isGoodPrice ? "border-warning/30 hover:border-warning/50" : "border-border hover:border-primary/30"
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote eBay image, not a local asset next/image can optimize on a static export */}
        <img src={deal.imageUrl} alt={deal.title} className="h-full w-full object-cover" loading="lazy" />
        {deal.isGoodPrice && (
          <span
            title="Priced well below other current listings with a similar CPU generation and RAM, shipping included"
            className="absolute top-2 left-2 flex items-center gap-1 rounded-full border border-warning/30 bg-background/85 px-2 py-1 font-mono text-[11px] tracking-wider text-warning uppercase backdrop-blur-sm"
          >
            <Flame className="size-3" />
            Good price
          </span>
        )}
        {deal.isBarebones && (
          <span className="absolute top-2 right-2 rounded-full border border-border bg-background/85 px-2 py-1 font-mono text-[11px] tracking-wider text-text-tertiary uppercase backdrop-blur-sm">
            Barebones
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

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px] text-text-secondary">
                <Icon className="size-3 text-text-tertiary" />
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-lg font-semibold text-foreground">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: deal.currency }).format(deal.price)}
          </span>
          <span className="font-mono text-[11px] tracking-wider text-text-tertiary uppercase">
            {deal.condition}
          </span>
        </div>
        {deal.shipping && (
          <p className="mt-1 text-xs text-text-tertiary">
            {deal.shipping}{deal.totalCost !== deal.price && ` · $${deal.totalCost.toFixed(0)} shipped`}
          </p>
        )}
        {deal.isGoodPrice && <p className="mt-2 text-xs leading-relaxed text-warning">Why this pick: priced well below similar current listings (same CPU generation and RAM tier), shipping included.</p>}
      </div>
    </a>
  )
}
