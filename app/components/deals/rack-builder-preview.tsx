import Link from "next/link"
import { ArrowRight, Calculator, Network, PackageSearch, Server, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"

const STEPS = [
  { icon: Server, label: "Choose compute", detail: "Mini PCs and nodes" },
  { icon: Network, label: "Add networking", detail: "Gateway, switch, patching" },
  { icon: Wrench, label: "Fit the rack", detail: "Shelves, mounts, and power" },
  { icon: Calculator, label: "See the total", detail: "One complete price breakdown" },
]

// v1 of the Rack Planner is the three fixed builds above
// (components/deals/starter-builds.tsx) — this is what's still ahead: a
// drag-and-drop designer for a custom layout instead of picking one of three.
export function RackBuilderPreview() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute right-0 top-0 size-[520px] rounded-full bg-primary/5 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><PackageSearch className="size-5" /></div>
        <Eyebrow className="mt-5">Coming next</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">Beyond the three fixed builds: a visual designer.</h2>
        <p className="mx-auto mt-4 max-w-lg text-text-secondary">
          The starter builds above cover the common cases. The longer-term goal is a full designer: pick any compute, networking, shelving, and power combination and get compatibility notes and a price breakdown for that exact layout.
        </p>
        <div className="mx-auto mt-8 grid max-w-xl gap-4 text-left sm:grid-cols-2">
          {STEPS.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-3.5" /></span>
              <div><p className="text-sm font-medium text-foreground">{label}</p><p className="mt-0.5 text-xs text-text-tertiary">{detail}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" render={<Link href="/sizer" />}>Start with VM sizing <ArrowRight className="size-4" /></Button>
          <span className="font-mono text-[11px] tracking-wider text-warning uppercase">Visual designer · Planned</span>
        </div>
      </div>
    </section>
  )
}
