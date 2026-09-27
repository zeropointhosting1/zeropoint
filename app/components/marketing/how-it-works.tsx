import { Eyebrow } from "./eyebrow"

const PROCESS = [
  { n: "01", title: "Tell us what’s wrong", copy: "Call, message, or submit the form. A simple description is all you need to start." },
  { n: "02", title: "Find the best approach", copy: "We work out whether you need remote help, an on-site visit, or a network assessment, and confirm the price." },
  { n: "03", title: "Fix or build it", copy: "Troubleshoot the immediate problem or complete the agreed installation, then check it with you." },
  { n: "04", title: "Leave you with the details", copy: "Get a clear explanation of the work. Larger setups include documentation, configuration notes, and account ownership information." },
]

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">From a quick fix to a fresh setup.</h2>
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
