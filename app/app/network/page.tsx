import type { Metadata } from "next"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { InfraStats } from "@/components/homelab/infra-stats"
import { InteractiveTopology } from "@/components/network/interactive-topology"
import { FullTopology } from "@/components/network/full-topology"
import { NodesSection } from "@/components/homelab/nodes-section"
import { ServicesSection } from "@/components/homelab/services-section"
import { NetworkSection } from "@/components/homelab/network-section"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "The Lab — ZeroPoint",
  description:
    "The full ZeroPoint infrastructure: hypervisor nodes, running services, and the topology tying them together — the UniFi home network and the isolated Cisco lab.",
  path: "/network",
})

export default function NetworkPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative border-b border-border bg-grid">
          <div className="bg-radial-fade absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-20">
            <Eyebrow>The ZeroPoint Lab</Eyebrow>
            <h1 className="mt-4 max-w-2xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              A real lab, documented in full.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-secondary">
              This is the working example behind the advice: every hop from
              the ISP to a VM, plus the hypervisors, services, and segmented
              networks actually running here. Updated by hand and deliberately
              public-safe.
            </p>
            <InfraStats />
          </div>
        </section>

        <FullTopology />

        <section className="theme-dark band-dark relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_85%_30%,var(--accent-glow),transparent_72%)] opacity-60" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <Eyebrow>Centerpiece</Eyebrow>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              Click any node for detail.
            </h2>
            <div className="mt-10">
              <InteractiveTopology />
            </div>
          </div>
        </section>

        <NodesSection />
        <ServicesSection />
        <NetworkSection />
      </main>
      <Footer />
    </>
  )
}
