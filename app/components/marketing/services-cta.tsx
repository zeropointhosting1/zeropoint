import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./eyebrow"

export function ServicesCta() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70" />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <Eyebrow>Get started</Eyebrow>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">Not sure what you need?</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">Tell us what&rsquo;s bugging you. We&rsquo;ll talk it through on a free call and tell you what we&rsquo;d do and what it would cost.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" render={<Link href="/contact" />}>Get a free consult <ArrowRight className="size-4" /></Button>
          <Button size="lg" variant="outline" render={<Link href="/pricing" />}>See pricing</Button>
        </div>
      </div>
    </section>
  )
}
