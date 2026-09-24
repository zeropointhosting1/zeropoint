import Link from "next/link"
import { ArrowRight, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import type { ServiceAudience } from "@/lib/services"

// Service pages describe what's included; the numbers live on /pricing only,
// so prices are maintained (and read) in one place. These two pieces are how
// every service page points there.

export function PricingLink({ audience, label = "Starting prices for these services are on the pricing page." }: { audience: ServiceAudience; label?: string }) {
  return (
    <Link href={`/pricing#${audience}`} className="group mt-8 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-raised px-6 py-4 text-sm transition-colors hover:border-primary/30">
      <span className="flex items-center gap-3 text-text-secondary"><Tag className="size-4 shrink-0 text-primary" />{label}</span>
      <span className="flex shrink-0 items-center gap-1.5 font-medium text-primary">See pricing <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
    </Link>
  )
}

export function ConsultCta({ audience, title = "Talk it through first." }: { audience: ServiceAudience; title?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <Eyebrow>Next step</Eyebrow>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-secondary">Start with a free consult to scope the project. You get a written quote before any work begins.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button size="lg" render={<Link href="/contact" />}>Get a free consult <ArrowRight className="size-4" /></Button>
          <Button size="lg" variant="outline" render={<Link href={`/pricing#${audience}`} />}>See pricing</Button>
        </div>
      </div>
    </section>
  )
}
