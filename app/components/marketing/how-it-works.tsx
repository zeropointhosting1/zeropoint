import { Eyebrow } from "./eyebrow"

const PROCESS = [
  { n: "01", title: "Assess", copy: "A free call to understand your home or business, what you already have, what you want, and your budget." },
  { n: "02", title: "Design", copy: "A written plan and price — including a parts list if you need equipment — before anything changes." },
  { n: "03", title: "Build", copy: "Set up in person, or together over a video call." },
  { n: "04", title: "Document", copy: "A walkthrough of what was done, plus the notes and every password, so it&rsquo;s fully yours." },
]

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">How a project works.</h2>
          </div>
          <div className="border-t border-border">
            {PROCESS.map((step) => (
              <div key={step.n} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border py-6">
                <span className="font-mono text-[11px] text-text-tertiary">{step.n}</span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
