"use client"

import * as React from "react"
import {
  Bell,
  ChevronRight,
  Command,
  Compass,
  CreditCard,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/registry/msh-ui/ui/badge"
import { Button } from "@/registry/msh-ui/ui/button"
import { Card } from "@/registry/msh-ui/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/msh-ui/ui/input-group"
import { KbdDisplay } from "@/registry/msh-ui/ui/kbd"
import { Separator } from "@/registry/msh-ui/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/registry/msh-ui/ui/sidebar"

type NavLink = {
  label: string
  icon: LucideIcon
  href: string
  active?: boolean
  badge?: string
}

const PRIMARY: readonly NavLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#", active: true },
  { label: "Inbox", icon: Inbox, href: "#", badge: "3" },
  { label: "Customers", icon: Users, href: "#" },
  { label: "Billing", icon: CreditCard, href: "#" },
  { label: "Explore", icon: Compass, href: "#" },
]

const SECONDARY: readonly NavLink[] = [
  { label: "Settings", icon: Settings, href: "#" },
  { label: "Support", icon: LifeBuoy, href: "#" },
]

type Account = {
  name: string
  plan: "Hobby" | "Pro" | "Team"
  mrr: string
  status: "Active" | "Trial" | "Past due"
  initials: string
}

const ROWS: readonly Account[] = [
  { name: "Plinth Labs", plan: "Pro", mrr: "$2,480", status: "Active", initials: "PL" },
  { name: "Helix", plan: "Team", mrr: "$6,120", status: "Active", initials: "HX" },
  { name: "Brella", plan: "Hobby", mrr: "$0", status: "Trial", initials: "BR" },
  { name: "Verbit", plan: "Pro", mrr: "$1,860", status: "Past due", initials: "VB" },
  { name: "Mercado", plan: "Team", mrr: "$5,400", status: "Active", initials: "MC" },
]

const METRICS = [
  { l: "Customers", v: "1,284", d: "+4.1%" },
  { l: "MRR", v: "$48.2k", d: "+8.7%" },
  { l: "Churn", v: "1.8%", d: "-0.4%" },
  { l: "NPS", v: "62", d: "+2" },
] as const

function statusDot(status: Account["status"]) {
  if (status === "Active") return "bg-emerald-500"
  if (status === "Trial") return "bg-yellow-500"
  return "bg-red-500"
}

function statusText(status: Account["status"]) {
  if (status === "Active") return "text-emerald-500"
  if (status === "Trial") return "text-yellow-500"
  return "text-red-500"
}

export default function AppShell01() {
  const [query, setQuery] = React.useState("")
  const filteredRows = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ROWS
    return ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.plan.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm border border-sidebar-border bg-sidebar-accent font-mono text-[10px] font-semibold text-sidebar-accent-foreground">
              ◆
            </span>
            <span className="truncate text-sm font-semibold tracking-[-0.01em] group-data-[collapsible=icon]:hidden">
              MSH UI
            </span>
            <Badge
              variant="outline"
              className="ml-auto group-data-[collapsible=icon]:hidden"
            >
              Pro
            </Badge>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {PRIMARY.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      tooltip={item.label}
                    >
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SECONDARY.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <a href={item.href}>
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
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                tooltip="Mohammad Shehadeh"
                className="group-data-[collapsible=icon]:p-1.5!"
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary font-mono text-[10px] font-medium text-sidebar-primary-foreground">
                  MS
                </span>
                <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-xs font-medium">
                    Mohammad Shehadeh
                  </span>
                  <span className="truncate font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    admin · plinth labs
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />
          <nav
            aria-label="Breadcrumb"
            className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:flex"
          >
            <span>Workspace</span>
            <ChevronRight className="size-3" aria-hidden />
            <span className="text-foreground">Dashboard</span>
          </nav>

          <InputGroup className="ml-auto h-8 max-w-xs">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search accounts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search accounts"
            />
            <InputGroupAddon align="inline-end" className="hidden sm:flex">
              <KbdDisplay>
                <Command className="size-3" />
              </KbdDisplay>
              <KbdDisplay>K</KbdDisplay>
            </InputGroupAddon>
          </InputGroup>

          <Button
            variant="outline"
            size="icon"
            aria-label="Notifications"
            className="relative size-8"
          >
            <Bell className="size-3.5" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-foreground" />
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">
            <Plus className="size-3" />
            New customer
          </Button>
          <Button size="icon" className="size-8 sm:hidden" aria-label="New customer">
            <Plus className="size-3.5" />
          </Button>
        </header>

        <div className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              An overview of customers, revenue, and recent activity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METRICS.map((m) => (
              <Card key={m.l} className="gap-1 p-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  {m.l}
                </span>
                <span className="text-lg font-semibold tabular-nums">
                  {m.v}
                </span>
                <span className="font-mono text-[10px] tabular-nums text-emerald-500">
                  {m.d}
                </span>
              </Card>
            ))}
          </div>

          <Card className="gap-0 overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                · recent accounts
                {query && (
                  <span className="ml-2 text-foreground">
                    ({filteredRows.length} of {ROWS.length})
                  </span>
                )}
              </span>
              <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <a href="#">View all</a>
              </Button>
            </div>

            {filteredRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <p className="text-sm font-medium">No matches</p>
                <p className="text-xs text-muted-foreground">
                  Nothing matched{" "}
                  <span className="font-mono text-foreground">
                    &ldquo;{query}&rdquo;
                  </span>
                  . Clear the search to see all accounts.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setQuery("")}
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      <th className="px-4 py-2 font-normal">Account</th>
                      <th className="px-4 py-2 font-normal">Plan</th>
                      <th className="hidden px-4 py-2 font-normal sm:table-cell">
                        MRR
                      </th>
                      <th className="px-4 py-2 font-normal">Status</th>
                      <th className="px-4 py-2 text-right font-normal">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((r) => (
                      <tr
                        key={r.name}
                        className="border-t border-border text-sm transition-colors hover:bg-accent/30"
                      >
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium text-foreground">
                              {r.initials}
                            </span>
                            <span className="font-medium">{r.name}</span>
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            variant={r.plan === "Hobby" ? "outline" : "default"}
                            className="font-mono"
                          >
                            {r.plan}
                          </Badge>
                        </td>
                        <td className="hidden px-4 py-2.5 font-mono tabular-nums text-foreground sm:table-cell">
                          {r.mrr}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]">
                            <span className={`size-1.5 rounded-full ${statusDot(r.status)}`} />
                            <span className={statusText(r.status)}>
                              {r.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label={`Actions for ${r.name}`}
                          >
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
