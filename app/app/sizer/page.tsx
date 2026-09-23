import type { Metadata } from "next"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { VmSizingCalculator } from "@/components/sizer/vm-sizing-calculator"
import { HYPERVISORS } from "@/lib/hypervisor-catalog"
import { WORKLOADS } from "@/lib/workload-catalog"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Workload Sizer — ZeroPoint",
  description: "Estimate CPU, memory, and storage for common self-hosted workloads and hypervisors using documented requirements and transparent assumptions.",
  path: "/sizer",
})

export default function SizerPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
          <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-16">
            <Eyebrow>Workload Sizer</Eyebrow>
            <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">Start with the workloads, not the shopping list.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">Pick what you want to self-host and a hypervisor to run it on, and get a transparent starting point for compute, memory, and system storage. Every app and hypervisor links back to an official source, and every ZeroPoint assumption is labeled.</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[9px] tracking-wider text-text-tertiary uppercase">
              <span>{WORKLOADS.length} curated apps</span><span>{HYPERVISORS.length} hypervisors</span><span>Official sources</span><span>Updated Sep 19, 2026</span><span>Planning guidance—not a guarantee</span>
            </div>
          </div>
        </section>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20"><VmSizingCalculator /></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
