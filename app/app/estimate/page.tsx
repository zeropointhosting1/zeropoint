import type { Metadata } from "next"
import { Suspense } from "react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { EstimateForm } from "@/components/estimate/estimate-form"
import { pageMetadata } from "@/lib/metadata"

// Deliberately unlisted: not in the nav menus, footer, or sitemap, and not
// indexed. It's reached only through the "Get an estimate" button in the
// top nav and the buttons on each service page (which pass ?for=).
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Get an estimate — ZeroPoint",
    description: "Tell us what you need help with and get a free estimate.",
    path: "/estimate",
  }),
  robots: { index: false, follow: true },
}

export default function EstimatePage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-12">
            <Eyebrow>Free estimate</Eyebrow>
            <h1 className="mt-5 max-w-2xl text-4xl leading-[1.02] font-bold tracking-[-0.04em] text-balance sm:text-5xl">Tell us what you need.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">It takes about two minutes. We&rsquo;ll reply to set up a free call, then send a written quote. No obligation.</p>
          </div>
        </section>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <Suspense fallback={null}>
              <EstimateForm />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
