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
  Plus,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

type NavLink = { label: string; icon: LucideIcon; active?: boolean; badge?: string }

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

const ROWS = [
  {
    name: "Plinth Labs",
    plan: "Pro",
    mrr: "$2,480",
    status: "Active",
    tone: "ok",
  },
  {
    name: "Helix",
    plan: "Team",
    mrr: "$6,120",
    status: "Active",
    tone: "ok",
  },
  {
    name: "Brella",
    plan: "Hobby",
    mrr: "$0",
    status: "Trial",
    tone: "warn",
  },
  {
    name: "Verbit",
    plan: "Pro",
    mrr: "$1,860",
    status: "Past due",
    tone: "bad",
  },
  {
    name: "Mercado",
    plan: "Team",
    mrr: "$5,400",
    status: "Active",
    tone: "ok",
  },
] as const

export default function AppShell01() {
  return (
    <section className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-3 pb-10 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            · app shell
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Sidebar, topbar, content — wired.
          </h2>
        </div>

        <div
          className="relative overflow-hidden rounded-md border border-border bg-background shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)]"
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
            <div className="ml-auto inline-flex items-center gap-1 rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              <Command className="size-2.5" />
              K
            </div>
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

              <button
                type="button"
                className="mt-3 inline-flex items-center gap-2 rounded-sm border border-border bg-background px-2.5 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <Search className="size-3.5" />
                Search…
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">
                  ⌘K
                </span>
              </button>

              <span className="mt-5 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Workspace
              </span>
              <ul className="mt-2 flex flex-col gap-0.5">
                {PRIMARY.map((n) => (
                  <NavRow key={n.label} item={n} />
                ))}
              </ul>

              <span className="mt-5 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
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

            <div className="flex min-h-[520px] flex-col bg-background">
              <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
                <nav className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span>Workspace</span>
                  <ChevronRight className="size-3" />
                  <span className="text-foreground">Dashboard</span>
                </nav>
                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="relative inline-flex size-8 items-center justify-center rounded-sm border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Bell className="size-3.5" />
                    <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-foreground" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-foreground px-2.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    <Plus className="size-3" />
                    New customer
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-5 p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { l: "Customers", v: "1,284", d: "+4.1%" },
                    { l: "MRR", v: "$48.2k", d: "+8.7%" },
                    { l: "Churn", v: "1.8%", d: "-0.4%" },
                    { l: "NPS", v: "62", d: "+2" },
                  ].map((m) => (
                    <div
                      key={m.l}
                      className="flex flex-col gap-1 rounded-md border border-border bg-card px-3 py-2.5"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                        {m.l}
                      </span>
                      <span className="text-lg font-semibold tabular-nums">
                        {m.v}
                      </span>
                      <span className="font-mono text-[10px] tabular-nums text-emerald-500">
                        {m.d}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 rounded-md border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      · recent accounts
                    </span>
                    <a
                      href="#"
                      className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      View all
                    </a>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        <th className="px-4 py-2 font-normal">Account</th>
                        <th className="px-4 py-2 font-normal">Plan</th>
                        <th className="hidden px-4 py-2 font-normal sm:table-cell">
                          MRR
                        </th>
                        <th className="px-4 py-2 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ROWS.map((r) => (
                        <tr
                          key={r.name}
                          className="border-t border-border text-sm"
                        >
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium text-foreground">
                                {r.name.slice(0, 2).toUpperCase()}
                              </span>
                              <span className="font-medium">{r.name}</span>
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                              {r.plan}
                            </span>
                          </td>
                          <td className="hidden px-4 py-2.5 font-mono tabular-nums text-foreground sm:table-cell">
                            {r.mrr}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
                                r.tone === "ok"
                                  ? "text-emerald-500"
                                  : r.tone === "warn"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  r.tone === "ok"
                                    ? "bg-emerald-500"
                                    : r.tone === "warn"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                              />
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        className={`group flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${
          item.active
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.badge && (
          <span className="ml-auto rounded-sm border border-border bg-background px-1.5 font-mono text-[10px] tabular-nums text-foreground">
            {item.badge}
          </span>
        )}
      </a>
    </li>
  )
}
