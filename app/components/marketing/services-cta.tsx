import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"

export function ServicesCta() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <Eyebrow>Boca Raton &amp; nearby South Florida</Eyebrow>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">Not sure what you need?</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">From a stubborn printer to a whole-home Wi-Fi upgrade, tell us what’s happening. We’ll recommend the next step and confirm the cost before work begins.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" render={<Link href="/contact" />}>Get Tech Help <ArrowRight className="size-4" /></Button>
          <Button size="lg" variant="outline" render={<Link href="/pricing" />}>See pricing</Button>
        </div>
      </div>
    </section>
  )
}
