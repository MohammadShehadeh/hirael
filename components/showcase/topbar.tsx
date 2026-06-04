"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { NAV_LINKS } from "@/lib/site"
import { BrandLockup } from "@/components/showcase/logo"
import { ThemeToggle } from "@/components/showcase/theme-toggle"
import { Separator } from "@/registry/new-york/ui/separator"
import { SidebarTrigger } from "@/registry/new-york/ui/sidebar"

export function ShowcaseTopbar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <Link
        href="/"
        className="flex items-center gap-2 rounded-sm py-1 transition-colors md:hidden"
        aria-label="MSH UI — home"
      >
        <BrandLockup logoClassName="h-5" textClassName="text-[10px]" />
      </Link>

      <nav className="hidden flex-1 items-center gap-0.5 md:flex">
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-sm px-2.5 py-1 text-[13px] tracking-tight transition-colors",
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

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
      </div>
    </header>
  )
}
