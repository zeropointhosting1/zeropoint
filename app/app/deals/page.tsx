import type { Metadata } from "next"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { DealsGrid } from "@/components/deals/deals-grid"
import { RackBuilderPreview } from "@/components/deals/rack-builder-preview"

export const metadata: Metadata = {
  title: "Deals — ZeroPoint",
  description:
    "Homelab starter hardware, pulled live from eBay's own search API — no scraping, no fabricated listings.",
}

export default function DealsPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative border-b border-border bg-grid">
          <div className="bg-radial-fade absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-16">
            <Eyebrow>Starter hardware</Eyebrow>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Gear worth buying.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-secondary">
              Used listings for the kind of hardware that actually gets a
              homelab off the ground — the same EliteDesk Minis and UniFi
              gear running this site. Pulled live from eBay&rsquo;s search
              API, not scraped, and not padded out with anything fake while
              that&rsquo;s not live yet.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t border-border pt-5 font-mono text-[9px] tracking-wider text-text-tertiary uppercase">
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-success" />Live eBay data</span>
              <span>5 hardware categories</span>
              <span>No scraped inventory</span>
              <span>No fabricated listings</span>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-10">
              <Eyebrow>Live listings</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Find the parts to start building.</h2>
              <p className="mt-3 max-w-2xl text-text-secondary">Current searches now include compact 10-inch rack components alongside compute and networking gear.</p>
            </div>
            <DealsGrid />
          </div>
        </section>

        <RackBuilderPreview />
      </main>
      <Footer />
    </>
  )
}
