import Link from "next/link"
import { ArrowRight, BarChart3, Check, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"

const POINTS = [
  "Mobile-first sites for restaurants and small businesses",
  "Menu, hours, and ordering links customers find in seconds",
  "Dashboards that put sales, labor, and top items on one screen",
  "Domain, hosting, and every login in your name",
]

// A generic mock of the kind of site ZeroPoint builds — placeholder
// business name and example menu, not a real client's site.
const MENU = [
  { name: "Margherita pizza", price: "$16" },
  { name: "Chicken parm", price: "$21" },
  { name: "Caesar salad", price: "$12" },
]

function SiteMock() {
  return (
    <div className="relative pb-36 sm:pr-10">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[0_28px_90px_-46px_var(--accent-glow)]">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
          <span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 flex-1 truncate rounded-md bg-surface-raised px-3 py-1 font-mono text-[11px] text-text-tertiary">yourrestaurant.com</span>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between"><p className="font-semibold tracking-tight">Your Restaurant</p><div className="hidden gap-4 text-xs text-text-tertiary sm:flex"><span>Menu</span><span>Hours</span><span>Visit</span></div></div>
          <div className="mt-6 rounded-xl bg-gradient-to-br from-primary/15 via-brand-pink/10 to-brand-cyan/10 p-5">
            <p className="text-xl font-bold tracking-tight">Fresh pasta, wood-fired pizza.</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-secondary"><span className="flex items-center gap-1.5"><Clock className="size-3.5 text-primary" />Open today 11a–10p</span><span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" />Directions</span></div>
            <span className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Order online</span>
          </div>
          <p className="mt-6 font-mono text-[11px] tracking-[0.14em] text-text-tertiary uppercase">Menu</p>
          <ul className="mt-2 divide-y divide-border">{MENU.map(({ name, price }) => <li key={name} className="flex justify-between py-2.5 text-sm"><span className="text-text-secondary">{name}</span><span className="font-medium">{price}</span></li>)}</ul>
        </div>
      </div>
      <div className="theme-dark absolute right-0 bottom-0 w-52 rounded-xl border border-primary/25 bg-background p-4 shadow-[0_20px_50px_-20px_var(--accent-glow)]">
        <div className="flex items-center gap-2"><BarChart3 className="size-3.5 text-primary" /><p className="font-mono text-[11px] tracking-[0.14em] text-text-tertiary uppercase">Sales today</p></div>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">$4,812</p>
        <div className="mt-3 flex h-10 items-end gap-1">{[30, 70, 55, 25, 45, 90, 100, 60].map((pct, index) => <div key={index} className="flex-1 rounded-t-sm bg-primary/80" style={{ height: `${pct}%` }} />)}</div>
        <p className="mt-2 text-[11px] text-text-tertiary">Example dashboard</p>
      </div>
    </div>
  )
}

export function WebsitesBand() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute -right-40 top-10 size-[30rem] rounded-full bg-brand-pink/8 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <Eyebrow>Websites &amp; Dashboards</Eyebrow>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">We build websites for <span className="text-primary">businesses, too.</span></h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">A clean, fast site that shows customers what they came for, and a dashboard that shows you how the business is doing, without digging through three different reports.</p>
          <ul className="mt-7 space-y-3">{POINTS.map((point) => <li key={point} className="flex gap-3 text-sm leading-relaxed text-text-secondary"><Check className="mt-0.5 size-4 shrink-0 text-success" />{point}</li>)}</ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/websites" />}>See websites &amp; dashboards <ArrowRight className="size-4" /></Button>
            <Button size="lg" variant="outline" render={<Link href="/contact" />}>Get a free consult</Button>
          </div>
        </div>
        <SiteMock />
      </div>
    </section>
  )
}
