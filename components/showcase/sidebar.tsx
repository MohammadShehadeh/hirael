"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutTemplate, Sparkles } from "lucide-react"

import { ThemeSheetTrigger } from "@/components/showcase/theme-sheet"
import {
  CATEGORY_LABELS,
  REGISTRY_BY_CATEGORY,
  type ComponentCategory,
} from "@/registry/sabk/registry-meta"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/sabk/ui/sidebar"

const CATEGORY_ORDER: ComponentCategory[] = [
  "inputs",
  "pickers",
  "files",
  "data",
  "display",
]

export function ShowcaseSidebar() {
  const pathname = usePathname()
  const blockCount = REGISTRY_BY_CATEGORY.blocks.length

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader>
        <Link
          href="/"
          className="group/brand flex items-center gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-sidebar-accent"
        >
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm bg-sidebar-primary font-mono text-[11px] font-semibold text-sidebar-primary-foreground">
            ◆
          </span>
          <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-[-0.02em]">
              sabk
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              shadcn&apos;s missing pieces
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/theme")}
                  tooltip="Theme playground"
                >
                  <Link href="/theme">
                    <Sparkles />
                    <span>Theme playground</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/blocks")}
                  tooltip="Blocks"
                >
                  <Link href="/blocks">
                    <LayoutTemplate />
                    <span>Blocks</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>{blockCount}</SidebarMenuBadge>
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
                    const href = `/${entry.name}`
                    const active = isActive(href)
                    return (
                      <SidebarMenuItem key={entry.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={entry.title}
                        >
                          <Link href={href}>
                            <span>{entry.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {entry.status === "planned" && (
                          <SidebarMenuBadge>soon</SidebarMenuBadge>
                        )}
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
        <div className="flex items-center justify-between gap-2 rounded-sm border border-sidebar-border bg-sidebar-accent/30 px-2 py-1.5 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-data-[collapsible=icon]:hidden">
            v0.1 · peer of shadcn
          </span>
          <ThemeSheetTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
