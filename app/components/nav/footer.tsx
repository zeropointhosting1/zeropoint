import Link from "next/link"
import { Wordmark } from "./wordmark"
import { GithubIcon, LinkedinIcon, DiscordIcon } from "./brand-icons"
import { DISCORD_URL } from "@/lib/site-config"

const EXPLORE = [
  { label: "Community", href: "/community" },
  { label: "Planning Tools", href: "/tools" },
  { label: "Services", href: "/services" },
  { label: "The Lab", href: "/network" },
]

const RESOURCES = [
  { label: "Docs", href: "/docs" },
  { label: "Projects", href: "/projects" },
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
              Helping people plan, build, secure, and understand better
              homelabs.
            </p>
          </div>

          <FooterColumn title="Explore" links={EXPLORE} />
          <FooterColumn title="Resources" links={RESOURCES} />

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-text-tertiary uppercase">
              Connect
            </p>
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
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
                aria-label="GitHub"
              >
                <GithubIcon className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex size-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-primary/40 hover:text-foreground"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ZeroPoint. Self-hosted, naturally.</p>
          <p className="font-mono tracking-wider uppercase">
            Built with Next.js · Deployed from the lab
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
