import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { STARTING_PRICES } from "@/lib/support-plans"
import { Eyebrow } from "./eyebrow"

export function StartingPricing({ preview = false }: { preview?: boolean }) {
  return <section id="pricing" className="scroll-mt-24 border-b border-border bg-surface"><div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
    <Eyebrow>Clear pricing</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">A straightforward place to start.</h2>
    <p className="mt-4 max-w-2xl text-lg text-text-secondary">Book help for the problem you have. Final pricing is confirmed before work begins.</p>
    <div className="mt-10 grid gap-4 md:grid-cols-3">{STARTING_PRICES.map((item) => <article key={item.id} className="flex flex-col rounded-2xl border border-border bg-surface-raised p-6"><h3 className="text-lg font-semibold">{item.name}</h3><p className="mt-5 text-2xl font-bold tracking-tight text-primary">{item.price}</p><p className="mt-2 flex-1 text-sm text-text-secondary">{item.note}</p><Link href={item.href} className="mt-6 inline-flex items-center gap-2 py-2 text-sm font-medium text-primary hover:underline">Explore this service <ArrowRight className="size-4" /></Link></article>)}</div>
    <p className="mt-6 text-sm leading-relaxed text-text-secondary">Clear written quotes. No surprise charges. Hardware costs are listed separately and transparently. Your equipment and accounts stay yours.</p>
    {preview && <Link href="/pricing" className="mt-6 inline-flex items-center gap-2 font-medium text-primary hover:underline">Installation, website &amp; Network Care pricing <ArrowRight className="size-4" /></Link>}
  </div></section>
}
