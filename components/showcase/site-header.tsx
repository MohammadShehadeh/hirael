"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { NAV_LINKS, SITE } from "@/lib/site"
import { CommandMenu } from "@/components/showcase/command-menu"
import { BrandLockup } from "@/components/showcase/logo"
import { ThemeToggle } from "@/components/showcase/theme-toggle"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/hirael/ui/drawer"

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
        "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-gradient-to-r after:from-transparent after:via-accent-cool/30 after:to-transparent",
        className
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {withSidebarTrigger}

        <Link
          href="/"
          aria-label={`${SITE.name} | home`}
          className="group flex items-center gap-2 rounded-sm py-1 transition-colors"
        >
          <BrandLockup logoClassName="h-9" />
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
          <CommandMenu />
          <ThemeToggle />
          <Drawer
            direction="bottom"
            open={mobileOpen}
            onOpenChange={setMobileOpen}
          >
            <DrawerTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-accent md:hidden"
              >
                <Menu className="size-3.5" />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex flex-row items-center justify-between border-b border-border text-start">
                <DrawerTitle className="flex items-center">
                  <BrandLockup logoClassName="h-8" />
                  <span className="sr-only">Navigation</span>
                </DrawerTitle>
                <DrawerClose asChild>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-accent"
                  >
                    <X className="size-3.5" />
                  </button>
                </DrawerClose>
              </DrawerHeader>
              <nav className="flex flex-col gap-0.5 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-sm px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}
