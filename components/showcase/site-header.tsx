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
        "sticky top-0 z-40 w-full px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="glass-panel-strong flex h-14 items-center gap-3 rounded-full ps-4 pe-2 sm:ps-5">
          {withSidebarTrigger}

          <Link
            href="/"
            aria-label={`${SITE.name} | home`}
            className="group flex shrink-0 items-center gap-2 rounded-full py-1 transition-opacity hover:opacity-80"
          >
            <BrandLockup logoClassName="h-8" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] tracking-tight transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="ms-auto flex items-center gap-1.5 md:ms-0">
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
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-foreground/40 hover:bg-accent md:hidden"
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
                      className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-accent"
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
                          "rounded-xl px-3 py-2.5 text-sm transition-colors",
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
      </div>
    </header>
  )
}
