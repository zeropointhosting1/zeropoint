"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { ArrowDownUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { DealCard } from "./deal-card"
import { DEALS_ENDPOINT, DEAL_CATEGORIES, SUPABASE_ANON_KEY, isWeakListing, meetsMinRam, type Deal } from "@/lib/deals"

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

export function DealsGrid() {
  const searchParams = useSearchParams()
  const minRam = Number(searchParams.get("minRam")) || null

  const [state, setState] = React.useState<State>(
    DEALS_ENDPOINT ? { status: "loading" } : { status: "not-connected" }
  )
  const [sort, setSort] = React.useState<SortMode>("relevance")
  const [category, setCategory] = React.useState<string>("All")
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

  const strongListings = state.deals
    .filter((d) => !isWeakListing(d.title))
    .filter((d) => (minRam ? meetsMinRam(d.title, minRam) : true))
  const filtered = category === "All" ? strongListings : strongListings.filter((d) => d.category === category)
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price
    if (sort === "price-desc") return b.price - a.price
    return 0
  })
  const visible = sorted.slice(0, visibleCount)

  return (
    <div>
      {minRam && (
        <p className="mb-4 rounded-lg border border-primary/25 bg-primary/5 px-4 py-2.5 text-xs text-text-secondary">
          Filtered to listings that fit {minRam} GB RAM or more, from your Workload Sizer results.
        </p>
      )}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["All", ...DEAL_CATEGORIES].map((c) => (
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
