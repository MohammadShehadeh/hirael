"use client"

import * as React from "react"
import {
  Bell,
  CalendarRange,
  ChartNoAxesColumn,
  ChevronsUpDown,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Plug,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/registry/hirael/ui/badge"
import { Button } from "@/registry/hirael/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group"
import { KbdDisplay, KbdGroup } from "@/registry/hirael/ui/kbd"
import { Separator } from "@/registry/hirael/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/hirael/ui/sidebar"
import { cn } from "@/lib/utils"

const NAV: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: CalendarRange, label: "Planner" },
  { icon: Megaphone, label: "Campaigns" },
  { icon: ChartNoAxesColumn, label: "Reports" },
  { icon: Users, label: "Audience" },
  { icon: Plug, label: "Connections" },
]

const FOOTER_NAV: { icon: LucideIcon; label: string }[] = [
  { icon: LifeBuoy, label: "Support" },
  { icon: Settings, label: "Settings" },
]

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M5 18v-8a7 7 0 0 1 14 0v8" />
      <path d="M12 8 L12.8 10.2 L15 11 L12.8 11.8 L12 14 L11.2 11.8 L9 11 L11.2 10.2 Z" />
    </svg>
  )
}

function Slot({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md border border-dashed border-border bg-card/30",
        className
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
        {label}
      </span>
    </div>
  )
}

export default function AppShell04() {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Plinth Labs">
                <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <BrandMark className="size-4" />
                </span>
                <div className="grid flex-1 text-start leading-tight">
                  <span className="truncate text-sm font-semibold tracking-[-0.01em]">
                    Plinth Labs
                  </span>
                  <span className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                    Pro workspace
                  </span>
                </div>
                <ChevronsUpDown className="size-3.5 text-muted-foreground" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <InputGroup className="h-8 group-data-[collapsible=icon]:hidden">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search…"
              aria-label="Search"
              className="text-sm"
            />
            <InputGroupAddon align="inline-end">
              <KbdGroup>
                <KbdDisplay>⌘</KbdDisplay>
                <KbdDisplay>K</KbdDisplay>
              </KbdGroup>
            </InputGroupAddon>
          </InputGroup>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      tooltip={item.label}
                    >
                      <a href="#">
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {FOOTER_NAV.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild tooltip={item.label} className="h-7">
                  <a href="#">
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <span className="px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-data-[collapsible=icon]:hidden">
            © Plinth Labs
          </span>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-[640px]">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <span className="truncate text-sm font-medium tracking-[-0.01em]">
              Overview
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8"
              aria-label="Notifications · 3 unread"
            >
              <Bell className="size-4" />
              <Badge className="absolute -end-1 -top-1 size-4 justify-center rounded-full p-0 font-mono text-[9px]">
                3
              </Badge>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <button
              type="button"
              aria-label="Account menu"
              className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card font-mono text-[11px] font-medium transition-colors hover:border-foreground"
            >
              MS
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
              Good morning, Maya.
            </h1>
            <p className="text-sm text-muted-foreground">
              Your workspace is ready. Drop content into the slots below.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
            {["slot · 01", "slot · 02", "slot · 03", "slot · 04"].map(
              (label) => (
                <Slot key={label} label={label} className="min-h-28" />
              )
            )}
            <Slot
              label="slot · 05"
              className="col-span-2 min-h-56 md:col-span-3"
            />
            <Slot
              label="slot · 06"
              className="col-span-2 min-h-56 md:col-span-1"
            />
            <Slot
              label="slot · 07"
              className="col-span-2 min-h-56 md:col-span-1"
            />
            <Slot
              label="slot · 08"
              className="col-span-2 min-h-56 md:col-span-3"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
