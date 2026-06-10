"use client"

import * as React from "react"
import {
  Bell,
  CalendarRange,
  ChartNoAxesColumn,
  ChevronsUpDown,
  LifeBuoy,
  Megaphone,
  PanelLeft,
  Plug,
  Search,
  Settings,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group"
import { KbdDisplay, KbdGroup } from "@/registry/hirael/ui/kbd"
import { Separator } from "@/registry/hirael/ui/separator"
import { cn } from "@/lib/utils"

const NAV: { icon: LucideIcon; label: string; current?: boolean }[] = [
  { icon: LayoutDashboard, label: "Overview", current: true },
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

function Slot({
  label,
  className,
}: {
  label: string
  className?: string
}) {
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
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex min-h-[640px] flex-col bg-background">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <a href="#" className="flex items-center gap-2.5" aria-label="Hirael — home">
            <span
              role="img"
              aria-hidden
              className="flex size-7 items-center justify-center rounded-md bg-foreground font-mono text-sm font-semibold text-background"
            >
              ◆
            </span>
            <span className="hidden text-sm font-semibold tracking-[-0.01em] sm:inline">
              Hirael
            </span>
          </a>

          <Separator orientation="vertical" className="h-4" />

          <button
            type="button"
            aria-label="Switch workspace"
            className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-accent"
          >
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted font-mono text-[10px] font-medium">
              PL
            </span>
            <span className="truncate text-sm">Plinth Labs</span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8"
            aria-label="Notifications · 3 unread"
          >
            <Bell className="size-4" />
            <span className="absolute right-1 top-1 flex min-w-3.5 items-center justify-center rounded-full bg-foreground px-0.5 font-mono text-[9px] leading-[14px] text-background">
              3
            </span>
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

      <div className="flex min-h-0 flex-1">
        <aside
          aria-label="Primary"
          className={cn(
            "hidden shrink-0 flex-col border-r border-border transition-all md:flex",
            collapsed ? "w-14" : "w-60"
          )}
        >
          <div className="p-3">
            {collapsed ? (
              <Button
                variant="outline"
                size="icon"
                className="size-8 w-full"
                aria-label="Search"
              >
                <Search className="size-3.5" />
              </Button>
            ) : (
              <InputGroup className="h-8">
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
            )}
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
            {NAV.map((item) => (
              <a
                key={item.label}
                href="#"
                aria-current={item.current ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
                  collapsed && "justify-center px-0",
                  item.current
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-0.5 border-t border-border p-3">
            {FOOTER_NAV.map((item) => (
              <a
                key={item.label}
                href="#"
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon className="size-3.5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </a>
            ))}
            <div
              className={cn(
                "mt-1 flex items-center",
                collapsed ? "justify-center" : "justify-between pl-2.5"
              )}
            >
              {!collapsed && (
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                  © Plinth Labs
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-pressed={collapsed}
              >
                <PanelLeft className="size-3.5" />
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="flex h-full flex-col gap-6 rounded-md border border-border bg-card/40 p-5 sm:p-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                Good morning, Maya.
              </h1>
              <p className="text-sm text-muted-foreground">
                Your workspace is ready — drop content into the slots below.
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
              <Slot label="slot · 06" className="col-span-2 min-h-56 md:col-span-1" />
              <Slot label="slot · 07" className="col-span-2 min-h-56 md:col-span-1" />
              <Slot
                label="slot · 08"
                className="col-span-2 min-h-56 md:col-span-3"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
