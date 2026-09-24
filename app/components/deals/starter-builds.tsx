"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Send, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ToolFlowSteps } from "@/components/tools/step-flow"
import { STARTER_BUILDS, buildTotalUsd, buildIdleWatts, suggestBuildForRamGb, type StarterBuild } from "@/lib/starter-builds"

function briefFor(build: StarterBuild): string {
  return [
    `Starter build brief: ${build.name} (${build.targetPriceLabel})`,
    "",
    "Parts:",
    ...build.parts.map((p) => `- ${p.role}: ${p.item} (~$${p.priceUsd})`),
    "",
    `Estimated total: ~$${buildTotalUsd(build)} · Idle draw: ~${buildIdleWatts(build)}W`,
    "",
    "I'd like help turning this into a build: ",
  ].join("\n")
}

export function StarterBuilds() {
  const searchParams = useSearchParams()
  const minRam = Number(searchParams.get("minRam")) || null
  const recommendedId = minRam ? suggestBuildForRamGb(minRam).id : null

  return (
    <section id="starter-builds" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Rack Planner v1 — Starter builds</Eyebrow>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Three real builds, not a shopping list.</h2>
            <p className="mt-3 max-w-2xl text-text-secondary">Parts, an estimated total, and idle power draw for each — based on the same hardware running the ZeroPoint lab. A full visual rack designer is still planned; these are real enough to actually buy against today.</p>
          </div>
          <ToolFlowSteps current="builds" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {STARTER_BUILDS.map((build) => {
            const total = buildTotalUsd(build)
            const watts = buildIdleWatts(build)
            const recommended = build.id === recommendedId
            return (
              <article key={build.id} className={`flex flex-col rounded-2xl border p-6 ${recommended ? "border-primary/50 bg-primary/5" : "border-border bg-surface-raised"}`}>
                {recommended && <p className="mb-3 font-mono text-[11px] tracking-wider text-primary uppercase">Matches your Sizer results</p>}
                <p className="font-mono text-xs tracking-[0.12em] text-primary uppercase">{build.targetPriceLabel}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{build.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{build.tagline}</p>

                <div className="mt-5 flex items-center gap-4 font-mono text-xs text-text-tertiary">
                  <span>~${total} total</span>
                  <span className="flex items-center gap-1"><Zap className="size-3" />~{watts}W idle</span>
                </div>

                <div className="mt-5 overflow-hidden rounded-xl border-x-4 border-y border-border bg-background/60 p-2.5">
                  {build.rackUnits.map((unit) => (
                    <div key={unit.unit} className="mb-1 grid grid-cols-[28px_1fr] items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-2 last:mb-0">
                      <span className="font-mono text-[11px] text-text-tertiary">{unit.unit}</span>
                      <span className="text-[11px] font-medium text-foreground">{unit.label}</span>
                    </div>
                  ))}
                </div>

                <ul className="mt-5 space-y-2 border-t border-border pt-5 text-xs text-text-secondary">
                  {build.parts.map((part) => (
                    <li key={part.item} className="flex justify-between gap-3">
                      <span>{part.role}: {part.item}</span>
                      <span className="shrink-0 font-mono text-text-tertiary">${part.priceUsd}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {build.goodFor.map((item) => (
                    <span key={item} className="rounded-full border border-border px-2 py-1 font-mono text-[11px] text-text-tertiary">{item}</span>
                  ))}
                </div>

                <Button size="sm" className="mt-6 w-full" render={<Link href={`/contact?message=${encodeURIComponent(briefFor(build))}`} />}>
                  <Send className="size-3.5" />
                  Send this build as a brief
                </Button>
              </article>
            )
          })}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-text-tertiary">Prices and idle-draw figures are ZeroPoint&rsquo;s own estimates from typical used-market pricing, refreshed by hand — not a live quote. Check <Link href="/deals" className="text-primary hover:underline">current listings</Link> for what&rsquo;s actually available right now.</p>
      </div>
    </section>
  )
}
