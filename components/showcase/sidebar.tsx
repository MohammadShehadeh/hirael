"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, LayoutTemplate, Sparkles } from "lucide-react"

import { LogoMarkM } from "@/components/showcase/logo"
import { ThemeSheetTrigger } from "@/components/showcase/theme-sheet"
import { SITE } from "@/lib/site"
import {
  CATEGORY_LABELS,
  REGISTRY_BY_CATEGORY,
  type ComponentCategory,
} from "@/registry/hirael/registry-meta"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/hirael/ui/sidebar"

const CATEGORY_ORDER: ComponentCategory[] = [
  "inputs",
  "pickers",
  "files",
  "data",
  "display",
  "navigation",
]

export function ShowcaseSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const blockCount = REGISTRY_BY_CATEGORY.blocks.length

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // The mobile sidebar is an off-canvas sheet; close it when the route
  // changes so a tapped link doesn't leave it covering the page.
  React.useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader>
        <Link
          href="/"
          className="group/brand flex items-center gap-3 rounded-sm px-2 py-2 transition-colors hover:bg-sidebar-accent"
          aria-label={`${SITE.name} | home`}
        >
          <LogoMarkM className="size-8 shrink-0" />
          <span
            className="truncate whitespace-nowrap text-xl leading-none text-foreground"
            style={{
              fontFamily: "var(--font-cormorant), ui-serif, serif",
              fontWeight: 500,
              letterSpacing: "0.22em",
            }}
          >
            HIRAEL
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/components")}>
                  <Link href="/components">
                    <Boxes />
                    <span>All components</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/blocks")}>
                  <Link href="/blocks">
                    <LayoutTemplate />
                    <span>Blocks</span>
                    <span className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground">
                      {blockCount}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/theme")}>
                  <Link href="/theme">
                    <Sparkles />
                    <span>Theme playground</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {CATEGORY_ORDER.map((cat) => {
          const items = REGISTRY_BY_CATEGORY[cat]
          if (!items.length) return null
          return (
            <SidebarGroup key={cat}>
              <SidebarGroupLabel>{CATEGORY_LABELS[cat]}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((entry) => {
                    const href = `/components/${entry.name}`
                    const active = isActive(href)
                    return (
                      <SidebarMenuItem key={entry.name}>
                        <SidebarMenuButton asChild isActive={active}>
                          <Link href={href}>
                            <span>{entry.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 rounded-sm border border-sidebar-border bg-sidebar-accent/30 px-2 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            peer of shadcn
          </span>
          <ThemeSheetTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
