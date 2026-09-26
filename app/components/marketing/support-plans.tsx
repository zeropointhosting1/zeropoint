import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SUPPORT_PLANS, SUPPORT_TERMS, formatPlanPrice } from "@/lib/support-plans"
import { Eyebrow } from "./eyebrow"

export function SupportPlans({ preview = false }: { preview?: boolean }) {
  return (
    <section id={preview ? undefined : "plans"} className="scroll-mt-24 border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Ongoing IT support</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Monthly Support Plans</h2>
        <p className="mt-4 max-w-2xl text-lg text-text-secondary">A local IT team to keep your business connected, maintained, and supported.</p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {SUPPORT_PLANS.map((plan) => (
            <article key={plan.id} className={`flex flex-col rounded-2xl border bg-surface-raised p-6 ${plan.popular ? "border-primary shadow-[0_14px_40px_-30px_var(--accent-glow)]" : "border-border"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {plan.popular && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Most popular</span>}
              </div>
              <p className="mt-5 text-3xl font-bold text-primary">{formatPlanPrice(plan)}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-text-secondary"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />{feature}</li>)}
              </ul>
              <Button className="mt-8" variant={plan.popular ? "default" : "outline"} render={<Link href={preview ? "/pricing/#plans" : `/contact/?help=${encodeURIComponent("Business IT & support")}&message=${encodeURIComponent(`I'd like to discuss the ${plan.name} monthly support plan.`)}`} />}>{preview ? "See monthly plans" : `Discuss ${plan.name}`}<ArrowRight className="size-4" /></Button>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-text-secondary">Additional time ${SUPPORT_TERMS.additionalHourlyRate}/hr · {SUPPORT_TERMS.commitment} · {SUPPORT_TERMS.hardware}</p>
      </div>
    </section>
  )
}
