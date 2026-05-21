"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { NAV_LINKS, SITE } from "@/lib/site"
import { GitHubStars } from "@/components/showcase/github-stars"
import { BrandLockup } from "@/components/showcase/logo"
import { ThemeToggle } from "@/components/showcase/theme-toggle"

export function SiteHeader({
  className,
  withSidebarTrigger,
}: {
  className?: string
  withSidebarTrigger?: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {withSidebarTrigger}

        <Link
          href="/"
          aria-label={`${SITE.name} — home`}
          className="group flex items-center gap-2 rounded-sm py-1 pr-1 transition-colors"
        >
          <BrandLockup
            logoClassName="size-10"
            textClassName="hidden text-xl sm:inline"
          />
          <span
            aria-hidden
            className="ml-1 hidden rounded-sm border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground sm:inline"
          >
            v{SITE.version}
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 px-2 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-sm px-2.5 py-1.5 text-[13px] tracking-tight transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <GitHubStars />
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="site-mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-accent md:hidden"
          >
            {mobileOpen ? (
              <X className="size-3.5" />
            ) : (
              <Menu className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="site-mobile-nav"
          className="border-t border-border bg-background/95 backdrop-blur-md md:hidden"
        >
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-0.5 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
