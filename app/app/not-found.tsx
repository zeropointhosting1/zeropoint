import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative mx-auto flex min-h-[560px] max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
            <p className="font-mono text-xs tracking-[0.14em] text-primary uppercase">404</p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              This page doesn&rsquo;t exist.
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-text-secondary">
              The link might be old, or the page may have moved. Here are a few places to pick back up.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/" />}>
                Home <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/docs" />}>
                Learn
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/contact" />}>
                Contact
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
