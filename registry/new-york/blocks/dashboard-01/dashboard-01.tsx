"use client"

import * as React from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  Minus,
  RefreshCw,
} from "lucide-react"

import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import { Separator } from "@/registry/new-york/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"

type Metric = {
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
}

type Range = "1d" | "7d" | "30d" | "90d"

const RANGES: { value: Range; label: string }[] = [
  { value: "1d", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
]

const METRICS_BY_RANGE: Record<Range, readonly Metric[]> = {
  "1d": [
    { label: "MRR", value: "$48,510", delta: "+0.5%", trend: "up" },
    { label: "Active orgs", value: "1,289", delta: "+5", trend: "up" },
    { label: "Churn", value: "1.9%", delta: "0.0%", trend: "flat" },
    { label: "Avg. session", value: "4m 18s", delta: "+6s", trend: "up" },
  ],
  "7d": [
    { label: "MRR", value: "$48,250", delta: "+8.7%", trend: "up" },
    { label: "Active orgs", value: "1,284", delta: "+4.1%", trend: "up" },
    { label: "Churn", value: "1.8%", delta: "-0.4%", trend: "down" },
    { label: "Avg. session", value: "4m 12s", delta: "0.0%", trend: "flat" },
  ],
  "30d": [
    { label: "MRR", value: "$46,180", delta: "+18.2%", trend: "up" },
    { label: "Active orgs", value: "1,231", delta: "+12.6%", trend: "up" },
    { label: "Churn", value: "2.1%", delta: "-0.6%", trend: "down" },
    { label: "Avg. session", value: "4m 04s", delta: "+14s", trend: "up" },
  ],
  "90d": [
    { label: "MRR", value: "$41,920", delta: "+34.6%", trend: "up" },
    { label: "Active orgs", value: "1,096", delta: "+26.3%", trend: "up" },
    { label: "Churn", value: "2.4%", delta: "-1.1%", trend: "down" },
    { label: "Avg. session", value: "3m 51s", delta: "+27s", trend: "up" },
  ],
}

const CHART_BY_RANGE: Record<Range, readonly { d: string; a: number; b: number }[]> = {
  "1d": [
    { d: "00", a: 6, b: 3 },
    { d: "04", a: 4, b: 2 },
    { d: "08", a: 18, b: 10 },
    { d: "12", a: 32, b: 22 },
    { d: "16", a: 28, b: 18 },
    { d: "20", a: 14, b: 9 },
    { d: "24", a: 8, b: 5 },
  ],
  "7d": [
    { d: "Mon", a: 38, b: 22 },
    { d: "Tue", a: 52, b: 35 },
    { d: "Wed", a: 47, b: 30 },
    { d: "Thu", a: 64, b: 41 },
    { d: "Fri", a: 78, b: 55 },
    { d: "Sat", a: 60, b: 48 },
    { d: "Sun", a: 72, b: 58 },
  ],
  "30d": [
    { d: "W1", a: 210, b: 142 },
    { d: "W2", a: 268, b: 188 },
    { d: "W3", a: 312, b: 224 },
    { d: "W4", a: 346, b: 252 },
    { d: "W5", a: 298, b: 211 },
    { d: "W6", a: 384, b: 281 },
    { d: "W7", a: 412, b: 306 },
  ],
  "90d": [
    { d: "M1", a: 920, b: 612 },
    { d: "M2", a: 1080, b: 752 },
    { d: "M3", a: 1240, b: 882 },
    { d: "M4", a: 1180, b: 856 },
    { d: "M5", a: 1320, b: 968 },
    { d: "M6", a: 1480, b: 1102 },
    { d: "M7", a: 1620, b: 1224 },
  ],
}

const SIGNUPS_BY_RANGE: Record<Range, { count: string; conversion: string }> = {
  "1d": { count: "82", conversion: "3.91%" },
  "7d": { count: "486", conversion: "3.42%" },
  "30d": { count: "2,154", conversion: "3.18%" },
  "90d": { count: "6,820", conversion: "2.94%" },
}

type Activity = {
  initials: string
  name: string
  action: string
  time: string
  tone: "primary" | "default" | "muted"
}

const ACTIVITY: readonly Activity[] = [
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
]

function TrendIcon({ trend }: { trend: Metric["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="size-3" />
  if (trend === "down") return <ArrowDownRight className="size-3" />
  return <Minus className="size-3" />
}

function deltaTone(trend: Metric["trend"]) {
  if (trend === "up") return "bg-emerald-500/10 text-emerald-500"
  if (trend === "down") return "bg-red-500/10 text-red-500"
  return "bg-accent text-muted-foreground"
}

export default function Dashboard01() {
  const [range, setRange] = React.useState<Range>("7d")
  const [refreshing, setRefreshing] = React.useState(false)

  const metrics = METRICS_BY_RANGE[range]
  const chart = CHART_BY_RANGE[range]
  const signups = SIGNUPS_BY_RANGE[range]
  const chartMax = Math.max(...chart.flatMap((c) => [c.a, c.b]))

  const onRefresh = async () => {
    setRefreshing(true)
    await new Promise((r) => setTimeout(r, 600))
    setRefreshing(false)
  }

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              · overview
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Operations · {RANGES.find((r) => r.value === range)?.label}.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              value={range}
              onValueChange={(v) => setRange(v as Range)}
              className="w-fit"
            >
              <TabsList>
                {RANGES.map((r) => (
                  <TabsTrigger key={r.value} value={r.value}>
                    {r.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <Filter className="size-3.5" />
              All teams
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh data"
            >
              <RefreshCw
                className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-2 bg-card p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {m.label}
              </span>
              <span className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">
                {m.value}
              </span>
              <span
                className={`inline-flex w-fit items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[11px] leading-none ${deltaTone(m.trend)}`}
              >
                <TrendIcon trend={m.trend} />
                {m.delta}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                    · sign-ups
                  </CardDescription>
                  <CardTitle className="text-lg">
                    {signups.count} new sign-ups
                  </CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      Conversion
                    </span>
                    <span className="font-mono text-lg font-semibold tabular-nums">
                      {signups.conversion}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Export sign-ups"
                  >
                    <Download className="size-3.5" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                role="img"
                aria-label={`Sign-ups and activations across ${chart.length} buckets`}
                className="grid h-56 items-end gap-2 sm:gap-3"
                style={{ gridTemplateColumns: `repeat(${chart.length}, minmax(0, 1fr))` }}
              >
                {chart.map((row) => (
                  <div key={row.d} className="flex h-full flex-col gap-1.5">
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

              <Separator className="my-4" />

              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span className="size-2 rounded-xs bg-foreground/85" />
                  Sign-ups
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span className="size-2 rounded-xs bg-muted-foreground/40" />
                  Activated
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                  · recent activity
                </CardDescription>
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <a href="#">View all</a>
                </Button>
              </div>
              <CardTitle className="sr-only">Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <ul className="flex flex-col">
                {ACTIVITY.map((a, i) => (
                  <li
                    key={a.name}
                    className={`flex items-center gap-3 px-6 py-3 ${
                      i < ACTIVITY.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span
                      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${
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
                        <span className="text-muted-foreground">
                          {a.action}
                        </span>
                      </p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        {a.time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
