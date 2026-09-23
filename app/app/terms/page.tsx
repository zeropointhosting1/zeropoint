import type { Metadata } from "next"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ReviewBanner } from "@/components/legal/review-banner"
import { LegalProse } from "@/components/legal/legal-prose"
import { BUSINESS_INFO } from "@/lib/business-info"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service — ZeroPoint",
  description: "The basics of working with ZeroPoint — scope, payment, and liability.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 pt-32 pb-24">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
            <p className="mt-4 text-sm text-text-tertiary">Last updated: {"{{TODO: date you publish this}}"}</p>

            <div className="mt-10">
              <ReviewBanner />
            </div>

            <LegalProse>
              <h2>Scope of work</h2>
              <p>
                Any paid engagement with ZeroPoint is scoped in writing before work begins — the service
                pages describe starting prices and what&rsquo;s typically included, but the actual scope,
                timeline, and final price for a specific project are confirmed with you directly, usually
                through the project planner or a follow-up conversation.
              </p>

              <h2>What&rsquo;s not included</h2>
              <p>
                Unless it&rsquo;s explicitly part of the agreed scope, engagements don&rsquo;t include
                hardware purchases (pricing is labor only), ongoing monitoring or support after the
                project ends, or work outside what was scoped. Anything extra is scoped and priced
                separately before it starts.
              </p>

              <h2>Payment</h2>
              <p>
                {"{{TODO: deposit/invoice terms — e.g. \"A deposit is due before work begins, with the balance invoiced on completion.\"}}"}
              </p>

              <h2>Your accounts and credentials</h2>
              <p>
                Any account access needed during a project is scoped to what the work actually requires.
                You keep ownership of every account and credential involved — nothing is left locked to a
                device or login only ZeroPoint can access — and you should change any shared passwords
                once the work is complete.
              </p>

              <h2>No warranty on guidance</h2>
              <p>
                Guides, field notes, and planning tools on this site (the Workload Sizer, Hardware Deals,
                and similar) are offered as practical starting points, not guarantees — actual results
                depend on your specific hardware, network, and environment. They&rsquo;re not a substitute
                for a scoped, paid engagement when the stakes are higher than a home lab experiment.
              </p>

              <h2>Liability</h2>
              <p>
                {"{{TODO: a liability limitation appropriate for your business — e.g. \"ZeroPoint's liability for any engagement is limited to the amount paid for that engagement.\" A lawyer should confirm this is appropriate for your situation.}}"}
              </p>

              <h2>Service area</h2>
              <p>
                On-site work is available in {BUSINESS_INFO.areaServed}. Remote work is available anywhere.
              </p>

              <h2>Affiliate and partner links</h2>
              <p>
                Some links on this site may be affiliate or partner links that earn a commission at no
                extra cost to you — any page with links like that says so plainly near the links
                themselves.
              </p>

              <h2>Governing law</h2>
              <p>{"{{TODO: your state/jurisdiction, if you want to specify one}}"}</p>

              <h2>Contact</h2>
              <p>
                Questions about these terms: <a href={`mailto:${BUSINESS_INFO.email}`}>{BUSINESS_INFO.email}</a>.
              </p>
            </LegalProse>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
