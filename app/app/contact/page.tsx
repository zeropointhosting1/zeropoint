import type { Metadata } from "next"
import { Suspense } from "react"
import { CalendarClock, Mail, MessageSquareText, FileCheck2 } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ContactForm } from "@/components/contact/contact-form"
import { BUSINESS_INFO } from "@/lib/business-info"
import { BOOKING_URL, RESPONSE_DAYS } from "@/lib/contact-config"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Contact — ZeroPoint",
  description: "Get in touch about a home network, small business technology, or a homelab build.",
  path: "/contact",
})

const NEXT_STEPS = [
  { icon: Mail, title: `Reply within ${RESPONSE_DAYS} business days`, copy: "I read every message myself — no ticket queue." },
  { icon: CalendarClock, title: "A free 15-minute scoping call", copy: "We talk through what you need before anything is scoped or priced." },
  { icon: FileCheck2, title: "A written quote", copy: "A clear scope and price before any work begins." },
]

export default function ContactPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto max-w-3xl px-6 pt-32 pb-16 text-center">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl">
              Let&rsquo;s talk about your <span className="text-primary">project.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
              Home Wi-Fi, an office network, a website, or a home server — send a message and I&rsquo;ll get back to you.
              On-site work is available in {BUSINESS_INFO.areaServed}; remote work anywhere.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
              <a href={`mailto:${BUSINESS_INFO.email}`} className="inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-foreground">
                <Mail className="size-4 text-primary" />
                {BUSINESS_INFO.email}
              </a>
              {BOOKING_URL && (
                <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-foreground">
                  <CalendarClock className="size-4 text-primary" />
                  Book a call
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-16 lg:grid-cols-[1fr_360px]">
              <div className="rounded-2xl border border-border bg-background p-8 shadow-[0_24px_70px_-38px_var(--accent-glow)] sm:p-10">
                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>
              </div>

              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">What happens next</p>
                <div className="mt-6 space-y-6">
                  {NEXT_STEPS.map(({ icon: Icon, title, copy }, index) => (
                    <div key={title} className="flex gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="flex items-center gap-2 font-semibold text-foreground">
                          <Icon className="size-4 text-primary" />
                          {title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex items-start gap-3 rounded-xl border border-border bg-background p-5">
                  <MessageSquareText className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-text-secondary">
                    Already have a project brief from the planner? Use its &ldquo;Send brief&rdquo; button — it comes straight here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
