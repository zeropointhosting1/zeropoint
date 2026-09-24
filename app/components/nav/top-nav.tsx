"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Wordmark } from "./wordmark"
import { NAV_LINKS, SERVICES_MENU, SERVICES_ACTIVE_PATHS } from "./nav-links"
import { GithubIcon, DiscordIcon } from "./brand-icons"
import { ScrollProgress } from "./scroll-progress"
import { DISCORD_URL, SOCIAL_LINKS } from "@/lib/site-config"

export function TopNav() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  const servicesActive = SERVICES_ACTIVE_PATHS.some((href) => pathname.startsWith(href))

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
            ? "border-b border-border bg-background/95 shadow-[0_1px_24px_-12px_var(--accent-glow)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group text-foreground">
            <Wordmark />
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
            <li className="group relative">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "relative flex items-center gap-1 rounded-md px-2.5 py-2 text-[13px] outline-none transition-colors",
                    servicesActive ? "text-foreground" : "text-text-secondary hover:text-foreground"
                  )}
                >
                  Services
                  <ChevronDown className="size-3.5" />
                  {servicesActive ? (
                    <span className="absolute inset-x-0 -bottom-0.5 flex justify-center">
                      <span className="size-1 rounded-full bg-primary" />
                    </span>
                  ) : (
                    <span className="absolute inset-x-3 -bottom-px h-px scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-1.5">
                  {SERVICES_MENU.map((item) => (
                    <DropdownMenuItem key={item.href} render={<Link href={item.href} />} className="flex-col items-start gap-0.5 rounded-lg px-3 py-2.5">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <span className="text-xs text-text-secondary">{item.description}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href)
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

          <div className="hidden items-center gap-2 lg:flex">
            {SOCIAL_LINKS.github && (
              <Button variant="ghost" size="icon" render={<a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" />}>
                <GithubIcon className="size-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}>
              <DiscordIcon className="size-4" />
              <span className="sr-only">Discord</span>
            </Button>
            <Button size="sm" render={<Link href="/contact" />}>
              Contact
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-md text-foreground lg:hidden"
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
            className="fixed inset-0 z-40 overflow-y-auto bg-background lg:hidden"
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
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
              className="mx-auto max-w-xl px-6 pt-2 pb-10"
            >
              <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Services</motion.p>
              <ul className="mt-3 grid gap-2">
                {SERVICES_MENU.map((item) => (
                  <motion.li key={item.href} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                    <Link href={item.href} className={cn("flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors", pathname.startsWith(item.href) ? "border-primary/40 bg-primary/8" : "border-border bg-surface-raised hover:border-primary/30")}>
                      <span>
                        <span className="block text-base font-semibold text-foreground">{item.label}</span>
                        <span className="mt-0.5 block text-sm text-text-secondary">{item.description}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-primary" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.ul variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="mt-6 divide-y divide-border border-y border-border">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={cn("flex items-center justify-between py-3.5 text-base font-semibold", pathname.startsWith(link.href) ? "text-primary" : "text-foreground")}>
                      {link.label}
                      <ArrowRight className="size-4 text-text-tertiary" />
                    </Link>
                  </li>
                ))}
              </motion.ul>
              <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="mt-8 grid gap-3">
                <Button size="lg" className="h-12 w-full text-base" render={<Link href="/contact" />}>
                  Get a free consult <ArrowRight className="size-4" />
                </Button>
                <div className="flex items-center justify-center gap-6 pt-2">
                  {SOCIAL_LINKS.github && (
                    <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground">
                      <GithubIcon className="size-4" />
                      GitHub
                    </a>
                  )}
                  <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-foreground">
                    <DiscordIcon className="size-4" />
                    Discord community
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
