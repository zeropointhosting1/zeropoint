import { HARDWARE_TIERS } from "@/lib/hardware-tiers"
import { Eyebrow } from "@/components/marketing/eyebrow"

// Shares its data with the Sizer's hardware-match card (lib/hardware-tiers.ts)
// so the two pages never disagree about what these machines can actually do.
export function WhyThisModel() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>Why this model</Eyebrow>
        <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">The families worth watching for.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HARDWARE_TIERS.map((tier) => (
            <article key={tier.id} className="rounded-2xl border border-border bg-surface-raised p-6">
              <h3 className="text-sm font-semibold text-foreground">{tier.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">{tier.whyItWorks}</p>
              <dl className="mt-4 space-y-1.5 border-t border-border pt-4 font-mono text-[10px] text-text-tertiary">
                <div className="flex justify-between"><dt>CPU</dt><dd className="text-text-secondary">{tier.cpu}</dd></div>
                <div className="flex justify-between"><dt>Max RAM</dt><dd className="text-text-secondary">{tier.maxRamGb} GB</dd></div>
                <div className="flex justify-between"><dt>NVMe</dt><dd className="text-text-secondary">{tier.nvmeSlots} slot{tier.nvmeSlots === 1 ? "" : "s"}</dd></div>
                <div className="flex justify-between"><dt>Quick Sync</dt><dd className="text-text-secondary">{tier.quickSync}</dd></div>
              </dl>
              {tier.note && <p className="mt-3 text-[11px] font-medium text-primary">{tier.note}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
