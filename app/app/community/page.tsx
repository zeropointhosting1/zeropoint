import type { Metadata } from "next"
import Link from "next/link"
import { MessageCircle, Wrench, Share2, ArrowRight, ArrowUpRight } from "lucide-react"
import { TopNav } from "@/components/nav/top-nav"
import { Footer } from "@/components/nav/footer"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/marketing/eyebrow"
import { DiscordChatMock } from "@/components/marketing/discord-chat-mock"
import { DiscordIcon } from "@/components/nav/brand-icons"
import { DISCORD_URL } from "@/lib/site-config"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Community — ZeroPoint",
  description:
    "Homelab, the ZeroPoint Discord — a place for people building, breaking, and troubleshooting their own homelabs.",
  path: "/community",
})

const WHAT = [
  {
    icon: Share2,
    title: "Share what you're building",
    description:
      "Post your rack, your rack diagram, your VLAN layout, your first Proxmox cluster — whatever stage it's at.",
  },
  {
    icon: Wrench,
    title: "Get a second opinion",
    description:
      "Stuck on something that should work and doesn't? Post it. Someone running the same gear has probably hit it.",
  },
  {
    icon: MessageCircle,
    title: "Talk shop",
    description:
      "Networking, self-hosting, virtualization, security — the stuff most people in your life don't want to hear about.",
  },
]

export default function CommunityPage() {
  return (
    <>
      <TopNav />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-grid">
          <div className="bg-hero-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-16">
            <Eyebrow>Community</Eyebrow>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Homelab.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-secondary">
              A Discord for people running the same kind of setup —
              segmented networks, self-hosted services, Proxmox clusters,
              and everything that breaks along the way. It&rsquo;s new and
              still small, which is a good time to be in it.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="shadow-[0_0_32px_-8px_var(--accent-glow)]"
                render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}
              >
                <DiscordIcon className="size-4" />
                Join the Discord
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:gap-16">
            <div className="grid gap-8">
              {WHAT.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <item.icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <DiscordChatMock />
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Want to see what I&rsquo;m running first?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-text-secondary">
              The Network page documents the actual infrastructure behind
              ZeroPoint — hardware, segmentation, the whole topology.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/network" />}>
                View the Network
                <ArrowRight className="size-4" />
              </Button>
              <Link
                href="/docs"
                className="group flex items-center gap-1.5 px-2 text-sm text-text-secondary transition-colors hover:text-foreground"
              >
                Read the guides
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
