import { Eyebrow } from "./eyebrow"

const PROCESS = [
  { n: "01", title: "Assess", copy: "Understand the property or office, current equipment, goals, constraints, and budget." },
  { n: "02", title: "Design", copy: "Create the hardware list, topology, implementation plan, and scope before changes begin." },
  { n: "03", title: "Build", copy: "Install on-site or work through the deployment together in a remote session." },
  { n: "04", title: "Document", copy: "Hand over the layout, configuration notes, ownership details, and sensible next steps." },
]

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">No mystery between the idea and the handoff.</h2>
          </div>
          <div className="border-t border-border">
            {PROCESS.map((step) => (
              <div key={step.n} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border py-6">
                <span className="font-mono text-[10px] text-text-tertiary">{step.n}</span>
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
