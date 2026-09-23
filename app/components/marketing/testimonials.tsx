import { Eyebrow } from "./eyebrow"
import { TESTIMONIALS } from "@/lib/testimonials"

// Hidden entirely until a real testimonial exists — see lib/testimonials.ts.
// Never populated with invented quotes.
export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow>What people say</Eyebrow>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.author} className="rounded-2xl border border-border bg-surface-raised p-6">
              <blockquote className="text-sm leading-relaxed text-text-secondary">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-xs text-text-tertiary"><span className="font-medium text-foreground">{t.author}</span> · {t.context}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
