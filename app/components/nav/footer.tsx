import Link from "next/link"
import { Mail } from "lucide-react"
import { Wordmark } from "./wordmark"
import { GithubIcon, LinkedinIcon, DiscordIcon } from "./brand-icons"
import { DISCORD_URL, SOCIAL_LINKS } from "@/lib/site-config"
import { BUSINESS_INFO } from "@/lib/business-info"
import { BOOKING_URL } from "@/lib/contact-config"

const EXPLORE = [
  { label: "Homelab", href: "/lab" },
  { label: "Home Networking", href: "/home-networking" },
  { label: "Business", href: "/services" },
  { label: "Websites", href: "/websites" },
  { label: "Contact", href: "/contact" },
]

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

const RESOURCES = [
  { label: "Learn", href: "/docs" },
  { label: "Projects", href: "/projects" },
  { label: "Community", href: "/community" },
  { label: "Tools & Deals", href: "/tools" },
  { label: "About", href: "/about" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm text-text-secondary">
              Homelab knowledge applied to better home networks, practical
              small-business technology, and builds you can understand.
            </p>
          </div>

          <FooterColumn title="Explore" links={EXPLORE} />
          <FooterColumn title="Resources" links={RESOURCES} />

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-text-tertiary uppercase">
              Connect
            </p>
            <a href={`mailto:${BUSINESS_INFO.email}`} className="mt-4 flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-foreground">
              <Mail className="size-4 text-primary" />
              {BUSINESS_INFO.email}
            </a>
            {BOOKING_URL && (
              <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-text-secondary transition-colors hover:text-foreground">
                Book a call
              </a>
            )}
            <div className="mt-4 flex items-center gap-3">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
                aria-label="Discord"
              >
                <DiscordIcon className="size-4" />
              </a>
              {SOCIAL_LINKS.github && (
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
                  aria-label="GitHub"
                >
                  <GithubIcon className="size-4" />
                </a>
              )}
              {SOCIAL_LINKS.linkedin && (
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 text-xs text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>© {new Date().getFullYear()} ZeroPoint Technology.</p>
            {LEGAL.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="font-mono tracking-wider uppercase">
            Built with Next.js · Hosted on GitHub Pages
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.2em] text-text-tertiary uppercase">
        {title}
      </p>
      <ul className="mt-4 grid gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
