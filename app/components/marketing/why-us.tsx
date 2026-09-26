import { FileText, KeyRound, MessageCircle } from "lucide-react"
import { Eyebrow } from "./eyebrow"

// Three promises, in the order a new customer worries about them:
// "will I understand it", "what will it cost", "am I locked in".
const PROMISES = [
  { icon: MessageCircle, title: "Plain English, no jargon", copy: "We explain what's wrong and what we'd change, in words that make sense. No pressure, no upsell." },
  { icon: FileText, title: "A clear price up front", copy: "You get a written quote before any work starts. The price we agree on is the price you pay." },
  { icon: KeyRound, title: "You own everything", copy: "Every password, account, and setting is handed over and written down. You're never stuck with us." },
]

export function WhyUs() {
  return (
    <section className="border-b border-border bg-surface-raised">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Why ZeroPoint</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">Honest help from someone who explains it.</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
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
