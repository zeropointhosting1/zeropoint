"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Wordmark } from "./wordmark"
import { NAV_LINKS } from "./nav-links"
import { GithubIcon, DiscordIcon } from "./brand-icons"
import { ScrollProgress } from "./scroll-progress"
import { DISCORD_URL } from "@/lib/site-config"

const GITHUB_URL = "https://github.com"

const NAV_GROUPS: Record<string, string[]> = {
  "/lab": ["/lab", "/community", "/tools", "/deals", "/sizer", "/network"],
}

export function TopNav() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24)
  })

  React.useEffect(() => {
    const id = setTimeout(() => setMobileOpen(false), 0)
    return () => clearTimeout(id)
  }, [pathname])

  return (
    <>
      <ScrollProgress />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-b border-primary/15 bg-background/85 shadow-[0_1px_24px_-8px_var(--accent-glow)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group text-foreground">
            <Wordmark />
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((link) => {
              const matchPaths = NAV_GROUPS[link.href] ?? [link.href]
              const active = link.href === "/" ? pathname === "/" : matchPaths.some((href) => pathname.startsWith(href))
              return (
                <li key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative block rounded-md px-2.5 py-2 text-[13px] transition-colors",
                      active ? "text-foreground" : "text-text-secondary hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {active ? (
                      <span className="absolute inset-x-0 -bottom-0.5 flex justify-center">
                        <span className="size-1 rounded-full bg-primary" />
                      </span>
                    ) : (
                      <span className="absolute inset-x-3 -bottom-px h-px scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden items-center gap-2 xl:flex">
            <Button variant="ghost" size="icon" render={<a href={GITHUB_URL} target="_blank" rel="noreferrer" />}>
              <GithubIcon className="size-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Button variant="ghost" size="icon" render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}>
              <DiscordIcon className="size-4" />
              <span className="sr-only">Discord</span>
            </Button>
            <Button size="sm" render={<Link href="/services#project-planner" />}>
              Start a Project
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-md text-foreground xl:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background xl:hidden"
          >
            <div className="flex h-16 items-center justify-end px-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex size-9 items-center justify-center rounded-md text-foreground"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
              }}
              className="flex flex-col gap-1 px-6 pt-4"
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className="block py-3 text-3xl font-semibold tracking-tight text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <div className="absolute inset-x-6 bottom-8 flex items-center justify-between border-t border-border pt-6">
              <div className="flex items-center gap-4">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <GithubIcon className="size-4" />
                  GitHub
                </a>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <DiscordIcon className="size-4" />
                  Discord
                </a>
              </div>
              <Button size="sm" render={<Link href="/services#project-planner" />}>
                Start a Project
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
