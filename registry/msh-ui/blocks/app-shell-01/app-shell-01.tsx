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
import { KbdDisplay, KbdGroup } from "@/registry/msh-ui/ui/kbd"
import { Separator } from "@/registry/msh-ui/ui/separator"

type NavLink = {
  label: string
  icon: LucideIcon
  active?: boolean
  badge?: string
}

const PRIMARY: readonly NavLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Inbox", icon: Inbox, badge: "3" },
  { label: "Customers", icon: Users },
  { label: "Billing", icon: CreditCard },
  { label: "Explore", icon: Compass },
]

const SECONDARY: readonly NavLink[] = [
  { label: "Settings", icon: Settings },
  { label: "Support", icon: LifeBuoy },
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

function planBadge(plan: Account["plan"]) {
  const tone =
    plan === "Hobby"
      ? "outline"
      : plan === "Pro"
        ? "default"
        : "default"
  return (
    <Badge variant={tone as "outline" | "default"} className="font-mono">
      {plan}
    </Badge>
  )
}

function statusTone(status: Account["status"]) {
  if (status === "Active") return "text-emerald-500 bg-emerald-500"
  if (status === "Trial") return "text-yellow-500 bg-yellow-500"
  return "text-red-500 bg-red-500"
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
    <section className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-3 pb-10">
          <Badge variant="outline">· app shell</Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Sidebar, topbar, content — wired and searchable.
          </h2>
          <p className="max-w-xl text-base text-muted-foreground">
            A complete admin shell with breadcrumb chrome, command-palette
            shortcut, and a live-filtering accounts table. Drop into any Next
            App Router project.
          </p>
        </div>

        <Card
          className="overflow-hidden rounded-md p-0"
          style={{ boxShadow: "8px 8px 0 0 var(--border)" }}
        >
          <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
            </div>
            <div className="ml-2 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:flex">
              <span className="text-muted-foreground/60">~</span>
              app.msh-ui.dev / dashboard
            </div>
            <KbdGroup className="ml-auto">
              <KbdDisplay>
                <Command className="size-3" />
              </KbdDisplay>
              <KbdDisplay>K</KbdDisplay>
            </KbdGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            <aside className="hidden border-r border-border bg-card/40 p-3 md:flex md:flex-col">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span className="inline-flex size-6 items-center justify-center rounded-sm border border-border bg-background font-mono text-[10px] font-semibold">
                  ◆
                </span>
                <span className="text-sm font-semibold tracking-[-0.01em]">
                  MSH UI
                </span>
              </div>

              <InputGroup className="mt-3 h-8">
                <InputGroupAddon align="inline-start">
                  <Search className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search accounts"
                />
                <InputGroupAddon align="inline-end">
                  <KbdDisplay>⌘K</KbdDisplay>
                </InputGroupAddon>
              </InputGroup>

              <span className="mt-5 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Workspace
              </span>
              <ul className="mt-2 flex flex-col gap-0.5">
                {PRIMARY.map((n) => (
                  <NavRow key={n.label} item={n} />
                ))}
              </ul>

              <Separator className="my-4" />

              <span className="px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Account
              </span>
              <ul className="mt-2 flex flex-col gap-0.5">
                {SECONDARY.map((n) => (
                  <NavRow key={n.label} item={n} />
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-2 rounded-sm border border-border bg-background p-2">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-medium text-background">
                  MS
                </span>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-xs font-medium">
                    Mohammad Shehadeh
                  </span>
                  <span className="truncate font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    admin · plinth labs
                  </span>
                </div>
              </div>
            </aside>

            <div className="flex min-h-[560px] flex-col bg-background">
              <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
                <nav
                  aria-label="Breadcrumb"
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  <span>Workspace</span>
                  <ChevronRight className="size-3" aria-hidden />
                  <span className="text-foreground">Dashboard</span>
                </nav>
                <div className="ml-auto flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Notifications"
                    className="relative size-8"
                  >
                    <Bell className="size-3.5" />
                    <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-foreground" />
                  </Button>
                  <Button size="sm">
                    <Plus className="size-3" />
                    New customer
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-5 p-5">
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
                              <td className="px-4 py-2.5">{planBadge(r.plan)}</td>
                              <td className="hidden px-4 py-2.5 font-mono tabular-nums text-foreground sm:table-cell">
                                {r.mrr}
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]">
                                  <span
                                    className={`size-1.5 rounded-full ${statusTone(r.status).split(" ")[1]}`}
                                  />
                                  <span
                                    className={statusTone(r.status).split(" ")[0]}
                                  >
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
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

function NavRow({ item }: { item: NavLink }) {
  const Icon = item.icon
  return (
    <li>
      <a
        href="#"
        aria-current={item.active ? "page" : undefined}
        className={`group flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${
          item.active
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.badge && (
          <Badge variant="outline" className="ml-auto font-mono tabular-nums">
            {item.badge}
          </Badge>
        )}
      </a>
    </li>
  )
}
