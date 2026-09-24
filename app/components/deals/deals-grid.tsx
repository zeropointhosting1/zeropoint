"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { ArrowDownUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { DealCard } from "./deal-card"
import {
  DEALS_ENDPOINT,
  DEAL_CATEGORIES,
  COMPUTE_CATEGORIES,
  SUPABASE_ANON_KEY,
  isWeakListing,
  isLegacyCpu,
  isDatacenterCiscoGear,
  isHomelabFriendlyCisco,
  isBarebonesListing,
  meetsMinRam,
  parseCpuLabel,
  parseCpuGeneration,
  parseStorageLabel,
  parsePowerAdapter,
  listingRamGb,
  shippingCostUsd,
  type Deal,
} from "@/lib/deals"
import { HARDWARE_TIERS } from "@/lib/hardware-tiers"
import type { EnrichedDeal } from "./deal-card"

const PAGE_SIZE = 12

type State =
  | { status: "not-connected" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "empty" }
  | { status: "ready"; deals: Deal[]; updatedAt: string }

type SortMode = "relevance" | "price-asc" | "price-desc"

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-raised p-12 text-center">
      <p className="font-mono text-sm tracking-wider text-text-tertiary uppercase">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">{body}</p>
    </div>
  )
}

function enrich(deal: Deal): EnrichedDeal {
  return {
    ...deal,
    cpuLabel: parseCpuLabel(deal.title),
    cpuGeneration: parseCpuGeneration(deal.title),
    ramGb: listingRamGb(deal.title),
    storageLabel: parseStorageLabel(deal.title),
    powerAdapter: parsePowerAdapter(deal.title),
    isBarebones: isBarebonesListing(deal.title),
    totalCost: deal.price + shippingCostUsd(deal.shipping),
    isGoodPrice: false,
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

// Replaces the Edge Function's naive "median within this one keyword
// search" flag with a same-config comparison: same category, same CPU
// generation bucket, same rough RAM tier — priced-below-median only counts
// as a good price against listings that are actually comparable, and
// shipping is folded into the compared total. Never awarded to a barebones
// listing, however cheap.
function flagGoodPrices(deals: EnrichedDeal[]): EnrichedDeal[] {
  const groups = new Map<string, EnrichedDeal[]>()
  for (const deal of deals) {
    const key = `${deal.category}|${deal.cpuGeneration ?? "?"}|${deal.ramGb ? Math.round(deal.ramGb / 4) * 4 : "?"}`
    const group = groups.get(key) ?? []
    group.push(deal)
    groups.set(key, group)
  }
  return deals.map((deal) => {
    if (deal.isBarebones) return deal
    const key = `${deal.category}|${deal.cpuGeneration ?? "?"}|${deal.ramGb ? Math.round(deal.ramGb / 4) * 4 : "?"}`
    const group = groups.get(key)!
    if (group.length < 3) return deal
    const typical = median(group.map((d) => d.totalCost))
    return { ...deal, isGoodPrice: deal.totalCost <= typical * 0.8 }
  })
}

export function DealsGrid() {
  const searchParams = useSearchParams()
  // minRam here is per-node (the Sizer divides its total by the node count
  // before linking here) — see components/sizer/vm-sizing-calculator.tsx.
  const minRam = Number(searchParams.get("minRam")) || null
  const nodesNeeded = Number(searchParams.get("nodes")) || null
  const modelTier = HARDWARE_TIERS.find((t) => t.id === searchParams.get("model")) ?? null

  const [state, setState] = React.useState<State>(
    DEALS_ENDPOINT ? { status: "loading" } : { status: "not-connected" }
  )
  const [sort, setSort] = React.useState<SortMode>("relevance")
  const [category, setCategory] = React.useState<string>(modelTier?.dealsCategory ?? "All")
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)

  React.useEffect(() => {
    if (!DEALS_ENDPOINT) return
    let cancelled = false
    fetch(DEALS_ENDPOINT, {
      headers: {
        apikey: SUPABASE_ANON_KEY ?? "",
        Authorization: `Bearer ${SUPABASE_ANON_KEY ?? ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`bad response: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        if (!Array.isArray(data.deals) || data.deals.length === 0) {
          setState({ status: "empty" })
          return
        }
        setState({ status: "ready", deals: data.deals, updatedAt: data.updatedAt })
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" })
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === "not-connected") {
    return (
      <EmptyPanel
        title="Not connected yet"
        body="Live listings go up once the eBay developer application is approved and the search function is deployed. Nothing here is faked in the meantime."
      />
    )
  }

  if (state.status === "loading") {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl border border-border bg-surface-raised" />
        ))}
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <EmptyPanel
        title="Listings unavailable right now"
        body="The search function didn't respond. This refreshes directly from eBay's search API, not a cached list, so try again shortly."
      />
    )
  }

  if (state.status === "empty") {
    return (
      <EmptyPanel
        title="No matching listings right now"
        body="Nothing matched the tracked keywords at the moment. Check back later."
      />
    )
  }

  // Quality floor: weak/bundled specs everywhere, legacy (pre-8th-gen
  // Intel / pre-Ryzen-2000 AMD) CPUs in the compute categories only, and
  // data-center-scale Cisco gear that isn't sized for a home closet.
  const qualityFiltered = state.deals
    .filter((d) => !isWeakListing(d.title))
    .filter((d) => !(COMPUTE_CATEGORIES.includes(d.category as (typeof COMPUTE_CATEGORIES)[number]) && isLegacyCpu(d.title)))
    .filter((d) => !(d.category === "Cisco" && isDatacenterCiscoGear(d.title)))

  // A compute-driven RAM filter (arriving from the Sizer) only makes sense
  // against compute hardware, and only against listings whose RAM is
  // actually known — see meetsMinRam's doc comment for why that changed.
  const ramFiltered = minRam
    ? qualityFiltered.filter((d) => COMPUTE_CATEGORIES.includes(d.category as (typeof COMPUTE_CATEGORIES)[number])).filter((d) => meetsMinRam(d.title, minRam))
    : qualityFiltered

  const enriched = flagGoodPrices(ramFiltered.map(enrich))
  const availableCategories = DEAL_CATEGORIES.filter((c) => enriched.some((d) => d.category === c))

  if (minRam && enriched.length === 0) {
    return (
      <EmptyPanel
        title={`Nothing fits ${minRam} GB right now`}
        body={
          modelTier
            ? `No current ${modelTier.name}-class listing covers ${minRam} GB RAM per unit. Check back later, or browse the full ${modelTier.dealsCategory} category for something close.`
            : "No current listing in these compute categories covers that much RAM on its own. Consider a two-node cluster instead of a single higher-RAM machine, or check back later as listings refresh."
        }
      />
    )
  }

  const filtered = category === "All" ? enriched : enriched.filter((d) => d.category === category)
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.totalCost - b.totalCost
    if (sort === "price-desc") return b.totalCost - a.totalCost
    const aPref = a.category === "Cisco" && isHomelabFriendlyCisco(a.title) ? 0 : 1
    const bPref = b.category === "Cisco" && isHomelabFriendlyCisco(b.title) ? 0 : 1
    return aPref - bPref
  })
  const visible = sorted.slice(0, visibleCount)

  return (
    <div>
      {minRam && (
        <p className="mb-4 rounded-lg border border-primary/25 bg-primary/5 px-4 py-2.5 text-xs text-text-secondary">
          {modelTier && nodesNeeded ? (
            <>
              Your Sizer results fit <strong className="text-foreground">{nodesNeeded > 1 ? `${nodesNeeded}× ` : ""}{modelTier.name}</strong>-class hardware — you&rsquo;ll need {nodesNeeded} of these, each with at least {minRam} GB RAM. Networking and rack gear are hidden while this filter is active.
            </>
          ) : (
            <>Filtered to compute hardware with at least {minRam} GB RAM, from your Workload Sizer results. Networking and rack gear are hidden while this filter is active.</>
          )}
        </p>
      )}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["All", ...availableCategories].map((c) => (
          <button
            key={c}
            onClick={() => { setCategory(c); setVisibleCount(PAGE_SIZE) }}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wider whitespace-nowrap uppercase transition-colors",
              category === c
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-text-tertiary hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {category === "Cisco" && (
        <p className="mb-5 rounded-lg border border-warning/25 bg-warning/5 px-4 py-2.5 text-xs text-warning">
          Rack-mount Cisco switches run fan-cooled and pull more power than homelab gear — fine in a garage or closet, less fine under a desk. Compact models (2960-C/CX, 3560-CX) sort first below.
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-wider text-text-tertiary uppercase">
          {sorted.length} listing{sorted.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          <ArrowDownUp className="size-3.5 text-text-tertiary" />
          <div className="flex overflow-hidden rounded-md border border-border">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={cn(
                  "px-3 py-1.5 font-mono text-[10px] tracking-wider whitespace-nowrap uppercase transition-colors",
                  sort === opt.value
                    ? "bg-primary/10 text-primary"
                    : "text-text-tertiary hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyPanel title="No listings in this category" body="Try a different filter, or check back later." />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
          {sorted.length > visible.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
              >
                Load more ({sorted.length - visible.length} remaining)
              </button>
            </div>
          )}
        </>
      )}
      <p className="mt-6 font-mono text-[11px] tracking-wider text-text-tertiary uppercase">
        Updated {new Date(state.updatedAt).toLocaleString()}
      </p>
    </div>
  )
}
