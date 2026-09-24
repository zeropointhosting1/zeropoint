import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BarChart3, Check, Clock, FileText, Globe, KeyRound, LayoutDashboard, MapPin, MessageSquareText, RefreshCw, ShoppingBag, Smartphone, UtensilsCrossed } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { ServicePlanner } from "@/components/services/service-planner"
import { formatServicePrice, offeringsFor } from "@/lib/services"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Websites and Dashboards for Restaurants and Small Businesses — ZeroPoint",
  description: "Mobile-first websites for restaurants and small businesses, plus dashboards that put sales, labor, and inventory on one screen.",
  path: "/websites",
})

const WHY = [
  { icon: KeyRound, title: "You own everything", copy: "Domain, hosting, and every login are in your name — not locked to a builder or agency account." },
  { icon: Smartphone, title: "Built for phones first", copy: "Most diners and customers find you on a phone, so that's where the design starts." },
  { icon: RefreshCw, title: "Easy to keep current", copy: "Menu, hours, and specials can change without rebuilding anything." },
  { icon: MessageSquareText, title: "Plain-language handoff", copy: "You leave knowing how the site and dashboard work and where every number comes from." },
]

const DINER_NEEDS = [
  { icon: UtensilsCrossed, name: "The menu", detail: "Readable on a phone, searchable, and updated the same day prices change — not a blurry PDF." },
  { icon: Clock, name: "Hours & location", detail: "Today's hours, holiday changes, parking, and a map, matching what Google shows." },
  { icon: ShoppingBag, name: "Order or book", detail: "One tap to your online ordering, delivery apps, or reservations — whatever you already use." },
]

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "restaurant-website": UtensilsCrossed,
  "business-website": Globe,
  "business-dashboard": LayoutDashboard,
  "website-care": RefreshCw,
}

const PROCESS = [
  { n: "01", title: "Plan", copy: "Go over what customers need to find, what you check every day, and which systems (POS, spreadsheets, ordering) already hold the data." },
  { n: "02", title: "Build", copy: "Design the site and dashboard, with previews along the way so there are no surprises at launch." },
  { n: "03", title: "Launch", copy: "Connect the domain, set up Google Business Profile links, and confirm everything works on real phones." },
  { n: "04", title: "Hand off", copy: "Walk through updating the menu and reading the dashboard, and hand over every login and a short written guide." },
]

const FAQ = [
  { q: "Do I need a new website if I already have one?", a: "Not always. Sometimes the fix is cleaning up the menu page and hours on the site you already have. That gets looked at first, before recommending a rebuild." },
  { q: "Can I update the menu myself?", a: "Yes. Menu items, prices, and hours are set up so they can be changed without touching the design. If you'd rather not, Website Care covers updates for you." },
  { q: "Will this work with my POS or online ordering?", a: "The site links to whatever ordering, delivery, or reservation service you already use. For dashboards, what's possible depends on what your POS can export or connect to — that's checked during planning, before any work is quoted." },
  { q: "What does a dashboard actually show?", a: "Whatever you check most: daily sales, covers, average check, labor as a percentage of sales, top-selling items, or inventory counts. It's built around your questions, not a generic template." },
  { q: "Who owns the domain and site?", a: "You do. The domain and hosting are registered in your name, and you get every login at handoff. Nothing stays tied to an account only ZeroPoint controls." },
  { q: "Is this remote or in person?", a: "Mostly remote — planning calls and previews work well over screen share. An in-person visit can be arranged for local businesses when it helps." },
]

// Illustrative numbers only — this previews the kind of dashboard ZeroPoint
// builds, not any real client's data.
const SAMPLE_KPIS = [
  { label: "Sales today", value: "$4,812", delta: "+8% vs last Tue" },
  { label: "Covers", value: "163", delta: "+12 vs last Tue" },
  { label: "Avg check", value: "$29.52", delta: "−$0.40" },
  { label: "Labor", value: "24.1%", delta: "of sales" },
]
const SAMPLE_HOURLY = [
  { hour: "11a", pct: 28 }, { hour: "12p", pct: 72 }, { hour: "1p", pct: 64 }, { hour: "2p", pct: 30 }, { hour: "3p", pct: 18 },
  { hour: "4p", pct: 22 }, { hour: "5p", pct: 55 }, { hour: "6p", pct: 92 }, { hour: "7p", pct: 100 }, { hour: "8p", pct: 70 }, { hour: "9p", pct: 38 },
]
const SAMPLE_TOP_ITEMS = [
  { name: "Margherita pizza", count: 41 },
  { name: "Chicken parm", count: 33 },
  { name: "Caesar salad", count: 27 },
  { name: "Tiramisu", count: 19 },
]

function DashboardPreview() {
  const topMax = Math.max(...SAMPLE_TOP_ITEMS.map((item) => item.count))
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/20 bg-surface/80 shadow-[0_28px_90px_-46px_var(--accent-glow)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5"><BarChart3 className="size-4 text-primary" /><p className="text-sm font-semibold">Tonight at a glance</p></div>
        <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-text-tertiary uppercase">Example · sample data</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {SAMPLE_KPIS.map(({ label, value, delta }) => (
          <div key={label} className="bg-surface-raised p-4 sm:p-5">
            <p className="font-mono text-[9px] tracking-[0.14em] text-text-tertiary uppercase">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-text-secondary">{delta}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-px bg-border lg:grid-cols-[1.4fr_1fr]">
        <div className="bg-surface-raised p-5 sm:p-6">
          <p className="font-mono text-[9px] tracking-[0.14em] text-text-tertiary uppercase">Sales by hour</p>
          <div className="mt-5 flex h-36 items-end gap-1.5 sm:gap-2" role="img" aria-label="Example bar chart of sales by hour, peaking at 7pm">
            {SAMPLE_HOURLY.map(({ hour, pct }) => (
              <div key={hour} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full rounded-t-sm bg-primary/80" style={{ height: `${pct}%` }} />
                <span className="font-mono text-[9px] text-text-tertiary">{hour}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface-raised p-5 sm:p-6">
          <p className="font-mono text-[9px] tracking-[0.14em] text-text-tertiary uppercase">Top items</p>
          <ul className="mt-5 space-y-3.5">
            {SAMPLE_TOP_ITEMS.map(({ name, count }) => (
              <li key={name}>
                <div className="flex items-baseline justify-between gap-3 text-sm"><span className="text-text-secondary">{name}</span><span className="font-mono text-xs text-foreground">{count}</span></div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-brand-cyan/80" style={{ width: `${(count / topMax) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function WebsitesPage() {
  const offerings = offeringsFor("web")

  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto grid min-h-[650px] max-w-6xl items-center gap-14 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div>
              <Eyebrow>Websites &amp; Dashboards</Eyebrow>
              <h1 className="mt-5 text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">Websites and dashboards<br /><span className="text-primary">for restaurants and small businesses.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary">A site that shows customers the menu, hours, and how to order in seconds, plus a dashboard that puts your sales, labor, and top items on one screen.</p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary"><span className="size-1.5 rounded-full bg-success" />Currently building a website and dashboard for a local restaurant</p>
            </div>
            <div className="border-y border-border py-6">
              <p className="font-mono text-[10px] tracking-[0.18em] text-primary uppercase">What you get</p>
              <div className="mt-5 divide-y divide-border">
                {WHY.map(({ icon: Icon, title, copy }) => <div key={title} className="flex items-center gap-3 py-4 text-sm text-text-secondary"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span><div><span className="block font-medium text-foreground">{title}</span><span className="block text-xs">{copy}</span></div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="theme-dark relative overflow-hidden border-b border-border bg-background">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_20%_35%,var(--accent-glow),transparent_72%)]" />
          <div className="pointer-events-none absolute right-0 bottom-0 size-[28rem] rounded-full bg-brand-cyan/8 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <div className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
              <div><Eyebrow>Restaurant websites</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">Diners are looking for three things.</h2></div>
              <div><p className="text-lg leading-relaxed text-text-secondary">Most people who visit a restaurant&rsquo;s site are standing on a sidewalk or sitting in a car, on a phone, trying to decide where to eat. If the menu, the hours, or the order button takes more than a few seconds to find, they go somewhere else.</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {DINER_NEEDS.map(({ icon: Icon, name, detail }) => (
                <div key={name} className="rounded-2xl border border-border bg-surface-raised p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                  <p className="mt-5 font-semibold text-foreground">{name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              {[{ icon: MapPin, text: "Google Business Profile and site kept in sync" }, { icon: Smartphone, text: "Tested on real phones before launch" }, { icon: FileText, text: "Menu changes without redesigning anything" }].map(({ icon: Icon, text }) => <div key={text} className="flex gap-3 text-sm leading-relaxed text-text-secondary"><Icon className="mt-0.5 size-4 shrink-0 text-primary" />{text}</div>)}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
              <div><Eyebrow>Dashboards</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-5xl">Your numbers, <span className="text-primary">on one screen.</span></h2></div>
              <div><p className="text-lg leading-relaxed text-text-secondary">Instead of exporting reports from the POS, the scheduling app, and a spreadsheet to answer &ldquo;how did tonight go?&rdquo;, a dashboard pulls them together and keeps them current.</p><p className="mt-4 text-sm leading-relaxed text-text-tertiary">What it shows depends on the questions you ask every day. The example below is how a restaurant might look at a single night.</p></div>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div className="pointer-events-none absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <div><Eyebrow>Services</Eyebrow><h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">Pick what you need, or <span className="text-primary">combine them.</span></h2></div>
              <p className="max-w-lg text-base leading-relaxed text-text-secondary lg:justify-self-end">A website and a dashboard work well as one project, but each can be done on its own. Every option starts with a clear scope before work begins.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {offerings.map((service) => {
                const Icon = SERVICE_ICONS[service.id] ?? Globe
                return <article key={service.id} className="group relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-6 shadow-[0_14px_40px_-30px_var(--accent-glow)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_55px_-28px_var(--accent-glow)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-4"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" /></span><span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[8px] tracking-[0.14em] text-text-tertiary uppercase">{service.delivery}</span></div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.description}</p>
                  <div className="mt-5 border-y border-border py-4"><span className="font-mono text-[9px] tracking-wider text-text-tertiary uppercase">Starting at</span><p className="mt-1 text-lg font-semibold text-primary">{formatServicePrice(service.pricing)}</p></div>
                  <ul className="mt-5 space-y-2.5">{service.includes.map((item) => <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-text-secondary"><Check className="mt-0.5 size-3.5 shrink-0 text-success" />{item}</li>)}</ul>
                  <p className="mt-5 text-[11px] leading-relaxed text-text-tertiary">{service.pricing.note}</p>
                </article>
              })}
            </div>
            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/6 px-6 py-5 sm:flex-row sm:items-center"><div><p className="font-semibold">Not sure where to start?</p><p className="mt-1 text-sm text-text-secondary">Send a quick brief about your business and what you&rsquo;d like to see.</p></div><Link href="#project-planner" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">Plan your project <ArrowRight className="size-4" /></Link></div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><Eyebrow>How it works</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">From first call to a site you can update yourself.</h2></div><div className="border-t border-border">{PROCESS.map((step) => <div key={step.n} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border py-6"><span className="font-mono text-[10px] text-text-tertiary">{step.n}</span><div><h3 className="font-semibold">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.copy}</p></div></div>)}</div></div></div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><Eyebrow>Questions</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Common questions.</h2></div><div className="border-t border-border">{FAQ.map(({ q, a }) => <div key={q} className="border-b border-border py-6"><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{a}</p></div>)}</div></div></div>
        </section>

        <section id="project-planner" className="theme-dark relative scroll-mt-20 overflow-hidden border-b border-border bg-background">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_50%_at_85%_20%,var(--accent-glow),transparent_75%)] opacity-70" />
          <div className="relative mx-auto max-w-6xl px-6 py-24"><div className="mb-12 max-w-2xl"><Eyebrow>Project planner</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Tell us about your business.</h2><p className="mt-3 text-text-secondary">Pick the website and dashboard options that fit and send a structured summary. Quotes depend on scope and are confirmed before any work begins.</p></div><ServicePlanner /></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
