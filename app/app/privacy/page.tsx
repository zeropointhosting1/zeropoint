import Link from "next/link"
import type { Metadata } from "next"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ReviewBanner } from "@/components/legal/review-banner"
import { LegalProse } from "@/components/legal/legal-prose"
import { BUSINESS_INFO } from "@/lib/business-info"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy — ZeroPoint",
  description: "What information this site collects and how it's used.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 pt-32 pb-24">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
            {BUSINESS_INFO.legalPublishDate && <p className="mt-4 text-sm text-text-tertiary">Last updated: {BUSINESS_INFO.legalPublishDate}</p>}

            <div className="mt-10">
              <ReviewBanner />
            </div>

            <LegalProse>
              <h2>What this site collects</h2>
              <p>
                ZeroPoint (&ldquo;this site&rdquo;) collects information only when you choose to give it —
                by submitting the contact form, the estimate form, or a message through the site chat.
                That includes your name, email address, and whatever you write in the message or request.
                The site chat also creates an anonymous, random identifier (no name or email required) so
                a reply can find its way back to your conversation. Nothing is collected just from
                browsing the site.
              </p>

              <h2>How it&rsquo;s used</h2>
              <p>
                Submitted information is used only to respond to you about the project or question you
                raised — never sold, and never used for marketing you didn&rsquo;t ask for.
              </p>

              <h2>Where submissions go</h2>
              <p>
                This site is a static export with no server of its own, so contact and estimate form
                submissions are sent directly from your browser to Supabase, the database and
                authentication service ZeroPoint uses to store and reply to them. Only ZeroPoint can
                read submitted messages.
              </p>

              <h2>Cookies and analytics</h2>
              <p>
                This site does not use tracking cookies or an analytics platform. Browser storage
                (like <code>localStorage</code>) is only ever used, if at all, for small per-visitor
                conveniences on this device — never to identify or track you, and never sent anywhere.
              </p>

              <h2>Other third-party services</h2>
              <p>
                The Hardware Deals page fetches live listings from eBay&rsquo;s public search API through
                a small proxy function, using only a search term — no personal information is sent or
                received through that request. The site itself is hosted on GitHub Pages, which may keep
                standard server access logs as part of operating its infrastructure; ZeroPoint doesn&rsquo;t
                control or access those logs.
              </p>

              <h2>Affiliate and partner links</h2>
              <p>
                Some links on this site (for example, hardware listings) may in the future be affiliate
                or partner links that earn a commission at no extra cost to you. Any page with links like
                that will say so plainly near the links themselves.
              </p>

              <h2>Your information</h2>
              <p>
                To ask about information you have shared with ZeroPoint, {BUSINESS_INFO.email ? <a href={`mailto:${BUSINESS_INFO.email}`}>email {BUSINESS_INFO.email}</a> : <Link href="/contact/">see contact options</Link>}.
              </p>

              <h2>Changes</h2>
              <p>
                This policy may be updated as the site changes. Check back here for the current version.
              </p>
            </LegalProse>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
