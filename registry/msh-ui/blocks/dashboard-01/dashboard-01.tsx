"use client"

import * as React from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Minus,
  RefreshCcw,
} from "lucide-react"

type Metric = {
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
}

const METRICS: readonly Metric[] = [
  { label: "MRR", value: "$48,250", delta: "+8.7%", trend: "up" },
  { label: "Active orgs", value: "1,284", delta: "+4.1%", trend: "up" },
  { label: "Churn", value: "1.8%", delta: "-0.4%", trend: "down" },
  { label: "Avg. session", value: "4m 12s", delta: "0.0%", trend: "flat" },
]

const CHART = [
  { d: "Mon", a: 38, b: 22 },
  { d: "Tue", a: 52, b: 35 },
  { d: "Wed", a: 47, b: 30 },
  { d: "Thu", a: 64, b: 41 },
  { d: "Fri", a: 78, b: 55 },
  { d: "Sat", a: 60, b: 48 },
  { d: "Sun", a: 72, b: 58 },
] as const

const ACTIVITY = [
  {
    initials: "MR",
    name: "Maya Renner",
    action: "upgraded to Pro",
    time: "2m ago",
    tone: "primary",
  },
  {
    initials: "JT",
    name: "Jules Tanaka",
    action: "invited 3 teammates",
    time: "14m ago",
    tone: "default",
  },
  {
    initials: "AO",
    name: "Adaeze Okafor",
    action: "exported 412 rows",
    time: "1h ago",
    tone: "default",
  },
  {
    initials: "SK",
    name: "Soren Kim",
    action: "rotated API keys",
    time: "3h ago",
    tone: "muted",
  },
] as const

function TrendIcon({ trend }: { trend: Metric["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="size-3" />
  if (trend === "down") return <ArrowDownRight className="size-3" />
  return <Minus className="size-3" />
}

export default function Dashboard01() {
  const chartMax = Math.max(...CHART.flatMap((c) => [c.a, c.b]))

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              · overview
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Last 7 days · operations.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Filter className="size-3.5" />
              All teams
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Refresh"
            >
              <RefreshCcw className="size-3.5" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="flex flex-col gap-2 bg-card p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {m.label}
              </span>
              <span className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">
                {m.value}
              </span>
              <span
                className={`inline-flex w-fit items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[11px] leading-none ${
                  m.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : m.trend === "down"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-accent text-muted-foreground"
                }`}
              >
                <TrendIcon trend={m.trend} />
                {m.delta}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-5 rounded-md border border-border bg-card p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  · sign-ups · this week
                </span>
                <h3 className="text-lg font-semibold tracking-[-0.01em]">
                  486 new sign-ups
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Conversion
                </span>
                <span className="font-mono text-lg font-semibold tabular-nums">
                  3.42%
                </span>
              </div>
            </div>

            <div className="grid h-56 grid-cols-7 items-end gap-2 sm:gap-4">
              {CHART.map((row) => (
                <div key={row.d} className="flex h-full flex-col gap-1">
                  <div className="flex h-full items-end gap-1">
                    <div
                      className="flex-1 rounded-t-xs bg-foreground/85 transition-all duration-300 ease-out hover:bg-foreground"
                      style={{ height: `${(row.a / chartMax) * 100}%` }}
                      title={`Sign-ups · ${row.a}`}
                    />
                    <div
                      className="flex-1 rounded-t-xs bg-muted-foreground/40 transition-all duration-300 ease-out hover:bg-muted-foreground/60"
                      style={{ height: `${(row.b / chartMax) * 100}%` }}
                      title={`Activated · ${row.b}`}
                    />
                  </div>
                  <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {row.d}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5 border-t border-border pt-4">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <span className="size-2 rounded-xs bg-foreground/85" />
                Sign-ups
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <span className="size-2 rounded-xs bg-muted-foreground/40" />
                Activated
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                · recent activity
              </span>
              <a
                href="#"
                className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                View all
              </a>
            </div>
            <ul className="mt-3 flex flex-col">
              {ACTIVITY.map((a, i) => (
                <li
                  key={a.name}
                  className={`flex items-center gap-3 py-3 ${i < ACTIVITY.length - 1 ? "border-b border-border" : ""}`}
                >
                  <span
                    className={`inline-flex size-8 items-center justify-center rounded-full font-mono text-xs font-medium ${
                      a.tone === "primary"
                        ? "bg-foreground text-background"
                        : a.tone === "muted"
                          ? "border border-border bg-card text-muted-foreground"
                          : "bg-muted text-foreground"
                    }`}
                  >
                    {a.initials}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm">
                      <span className="font-medium text-foreground">
                        {a.name}
                      </span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      {a.time}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
