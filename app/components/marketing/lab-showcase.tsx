import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LabSocialLink } from "./lab-social-link"
import { Eyebrow } from "./eyebrow"

// Proof, kept short: the full network map and hardware tour live on /lab.
export function LabShowcase() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 rounded-2xl border border-border bg-surface-raised p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Eyebrow>Tested here first</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">Built and tested in the ZeroPoint Lab.</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-secondary">Networking equipment, servers, self-hosted software, and monitoring systems: the Lab is where we test ideas before bringing them into client environments. Explore practical guides on networking, UniFi, homelabs, and IT.</p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:justify-self-end">
            <Button size="lg" variant="outline" render={<Link href="/lab" />}>See the lab <ArrowRight className="size-4" /></Button>
            <LabSocialLink />
          </div>
        </div>
      </div>
    </section>
  )
}
