import { FileText, KeyRound, MessageCircle, MapPin, Wrench } from "lucide-react"
import { Eyebrow } from "./eyebrow"

// Practical reasons to choose a local, owner-operated service.
const PROMISES = [
  { icon: MapPin, title: "Local", copy: "Work directly with Harrison, someone nearby who gets to know your setup." },
  { icon: Wrench, title: "Built properly", copy: "Reliable, maintainable setups, with careful configuration and testing." },
  { icon: MessageCircle, title: "Explained clearly", copy: "We explain what's wrong and what we'd change, in words that make sense. No pressure, no upsell." },
  { icon: FileText, title: "Transparent pricing", copy: "You get a written quote before any work starts. Any change in scope or cost is discussed before going ahead." },
  { icon: KeyRound, title: "You own everything", copy: "Your equipment, accounts, passwords, and configuration information stay yours, with documentation for larger setups." },
]

export function WhyUs() {
  return (
    <section className="border-b border-border bg-surface-raised">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Why ZeroPoint</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">Honest help from someone who explains it.</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-2xl border border-border bg-background p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
