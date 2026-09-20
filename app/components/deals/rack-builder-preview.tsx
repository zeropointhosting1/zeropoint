import Link from "next/link"
import { ArrowRight, Calculator, Network, PackageSearch, Server, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"

const RACK_UNITS = [
  { unit: "6U", label: "Patch panel", tone: "border-text-tertiary/30 bg-text-tertiary/5" },
  { unit: "5U", label: "Managed switch", tone: "border-primary/30 bg-primary/8" },
  { unit: "4U", label: "Gateway", tone: "border-success/30 bg-success/8" },
  { unit: "3U", label: "EliteDesk compute", tone: "border-primary/30 bg-primary/8" },
  { unit: "2U", label: "EliteDesk compute", tone: "border-primary/30 bg-primary/8" },
  { unit: "1U", label: "Power + shelf", tone: "border-warning/30 bg-warning/8" },
]

const STEPS = [
  { icon: Server, label: "Choose compute", detail: "Mini PCs and nodes" },
  { icon: Network, label: "Add networking", detail: "Gateway, switch, patching" },
  { icon: Wrench, label: "Fit the rack", detail: "Shelves, mounts, and power" },
  { icon: Calculator, label: "See the total", detail: "One complete price breakdown" },
]

export function RackBuilderPreview() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute right-0 top-0 size-[520px] rounded-full bg-primary/5 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24">
        <div>
          <Eyebrow>Coming next</Eyebrow>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">From individual deals to a complete lab.</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-text-secondary">
            The long-term goal is a visual homelab designer: choose a 10-inch rack, add EliteDesk nodes, networking, shelves, patching, and power, then see compatibility notes and a full price breakdown in one place.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {STEPS.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-3.5" /></span>
                <div><p className="text-sm font-medium text-foreground">{label}</p><p className="mt-0.5 text-xs text-text-tertiary">{detail}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="outline" render={<Link href="/sizer" />}>Start with VM sizing <ArrowRight className="size-4" /></Button>
            <span className="font-mono text-[9px] tracking-wider text-warning uppercase">Rack designer · Planned</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-10 bg-[radial-gradient(circle,var(--accent-glow),transparent_68%)]" />
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-background/80 p-5 shadow-[0_28px_80px_-40px_var(--accent-glow)]">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div><p className="font-mono text-[10px] tracking-[0.16em] text-foreground uppercase">10-inch mini rack</p><p className="mt-1 text-xs text-text-tertiary">Sample 6U layout</p></div>
              <span className="flex items-center gap-1.5 rounded-full border border-warning/20 bg-warning/5 px-2.5 py-1 font-mono text-[8px] tracking-wider text-warning uppercase"><PackageSearch className="size-3" />Concept</span>
            </div>
            <div className="mt-5 rounded-xl border-x-4 border-y border-border bg-surface-raised p-3 shadow-inner">
              <div className="space-y-1.5">
                {RACK_UNITS.map((item) => (
                  <div key={item.unit} className={`grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-md border px-3 py-2.5 ${item.tone}`}>
                    <span className="font-mono text-[8px] text-text-tertiary">{item.unit}</span>
                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                    <span className="size-1.5 rounded-full bg-success" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[8px] tracking-wider text-text-tertiary uppercase"><span>Compute · Network · Power</span><span>Illustrative layout</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
