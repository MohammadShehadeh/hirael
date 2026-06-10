"use client"

import * as React from "react"
import { ArrowDownRight, ArrowUpRight, Minus, Share2 } from "lucide-react"

import { Badge } from "@/registry/hirael/ui/badge"
import { Button } from "@/registry/hirael/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/hirael/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/hirael/ui/select"
import { Separator } from "@/registry/hirael/ui/separator"

type Range = "7d" | "14d" | "28d"

const RANGES: { value: Range; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "28d", label: "Last 28 days" },
]

type Kpi = {
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
  spark: readonly number[]
}

const KPIS_BY_RANGE: Record<Range, readonly Kpi[]> = {
  "7d": [
    { label: "Visitors", value: "24,310", delta: "+12.4%", trend: "up", spark: [12, 18, 14, 22, 19, 26, 31] },
    { label: "Page views", value: "96,482", delta: "+8.1%", trend: "up", spark: [40, 52, 47, 58, 54, 66, 72] },
    { label: "Avg. time", value: "3m 42s", delta: "+9s", trend: "up", spark: [30, 28, 33, 31, 36, 34, 39] },
    { label: "Bounce rate", value: "38.2%", delta: "-1.8%", trend: "down", spark: [46, 44, 45, 42, 43, 40, 38] },
  ],
  "14d": [
    { label: "Visitors", value: "46,920", delta: "+9.6%", trend: "up", spark: [14, 16, 13, 19, 18, 24, 27] },
    { label: "Page views", value: "182,104", delta: "+6.4%", trend: "up", spark: [44, 49, 46, 55, 52, 61, 67] },
    { label: "Avg. time", value: "3m 31s", delta: "0s", trend: "flat", spark: [32, 31, 33, 32, 33, 32, 33] },
    { label: "Bounce rate", value: "39.6%", delta: "-0.9%", trend: "down", spark: [45, 44, 46, 43, 44, 41, 40] },
  ],
  "28d": [
    { label: "Visitors", value: "88,475", delta: "+21.2%", trend: "up", spark: [10, 13, 12, 17, 16, 22, 28] },
    { label: "Page views", value: "351,889", delta: "+17.8%", trend: "up", spark: [36, 42, 40, 51, 49, 60, 71] },
    { label: "Avg. time", value: "3m 24s", delta: "+18s", trend: "up", spark: [27, 29, 28, 32, 31, 35, 38] },
    { label: "Bounce rate", value: "40.4%", delta: "+0.6%", trend: "up", spark: [39, 40, 39, 41, 40, 42, 41] },
  ],
}

type ChartBucket = { label: string; visitors: number; views: number }

const CHART_BY_RANGE: Record<Range, readonly ChartBucket[]> = {
  "7d": [
    { label: "Mon", visitors: 2840, views: 11200 },
    { label: "Tue", visitors: 3120, views: 12400 },
    { label: "Wed", visitors: 2960, views: 11900 },
    { label: "Thu", visitors: 3480, views: 13800 },
    { label: "Fri", visitors: 3940, views: 15600 },
    { label: "Sat", visitors: 3260, views: 13100 },
    { label: "Sun", visitors: 4710, views: 18482 },
  ],
  "14d": [
    { label: "D2", visitors: 5410, views: 21400 },
    { label: "D4", visitors: 6180, views: 24300 },
    { label: "D6", visitors: 5890, views: 23200 },
    { label: "D8", visitors: 6720, views: 26800 },
    { label: "D10", visitors: 7240, views: 28900 },
    { label: "D12", visitors: 6950, views: 27600 },
    { label: "D14", visitors: 8530, views: 29904 },
  ],
  "28d": [
    { label: "D4", visitors: 10240, views: 40100 },
    { label: "D8", visitors: 11820, views: 46400 },
    { label: "D12", visitors: 11260, views: 44800 },
    { label: "D16", visitors: 12980, views: 52200 },
    { label: "D20", visitors: 13710, views: 55900 },
    { label: "D24", visitors: 13180, views: 53600 },
    { label: "D28", visitors: 15285, views: 58889 },
  ],
}

const TOP_PAGES = [
  { path: "/blocks", views: "18,204", share: 86 },
  { path: "/components", views: "14,911", share: 70 },
  { path: "/blocks/hero-01", views: "9,482", share: 45 },
  { path: "/theme", views: "6,150", share: 29 },
  { path: "/blocks/faq-02", views: "4,067", share: 19 },
] as const

const CHANNELS = [
  { label: "Organic search", share: 44 },
  { label: "Direct", share: 31 },
  { label: "Referral", share: 16 },
  { label: "Social", share: 9 },
] as const

function TrendIcon({ trend }: { trend: Kpi["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="size-3" />
  if (trend === "down") return <ArrowDownRight className="size-3" />
  return <Minus className="size-3" />
}

function deltaTone(kpi: Kpi) {
  const improving =
    kpi.label === "Bounce rate" ? kpi.trend === "down" : kpi.trend === "up"
  if (kpi.trend === "flat") return "bg-accent text-muted-foreground"
  return improving
    ? "bg-emerald-500/10 text-emerald-500"
    : "bg-red-500/10 text-red-500"
}

function Sparkline({ points }: { points: readonly number[] }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const step = 100 / (points.length - 1)
  const coords = points
    .map((p, i) => `${(i * step).toFixed(1)},${(26 - ((p - min) / span) * 20).toFixed(1)}`)
    .join(" ")
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      aria-hidden
      className="h-7 w-full"
    >
      <polyline
        points={coords}
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeWidth="1.5"
        className="stroke-foreground/40"
      />
    </svg>
  )
}

function linePath(values: number[], max: number) {
  const step = 100 / (values.length - 1)
  return values
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)} ${(44 - (v / max) * 38).toFixed(2)}`
    )
    .join(" ")
}

export default function Dashboard02() {
  const [range, setRange] = React.useState<Range>("7d")

  const kpis = KPIS_BY_RANGE[range]
  const chart = CHART_BY_RANGE[range]
  const max = Math.max(...chart.map((b) => b.views))
  const viewsLine = linePath(chart.map((b) => b.views), max)
  const visitorsLine = linePath(chart.map((b) => b.visitors), max)

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              · analytics
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Traffic, end to end.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger size="sm" className="w-[150px]" aria-label="Date range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Share2 className="size-3.5" />
              <span className="hidden sm:inline">Share report</span>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="flex flex-col gap-2 bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {k.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[11px] leading-none ${deltaTone(k)}`}
                >
                  <TrendIcon trend={k.trend} />
                  {k.delta}
                </span>
              </div>
              <span className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">
                {k.value}
              </span>
              <Sparkline points={k.spark} />
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                    · page views vs visitors
                  </CardDescription>
                  <CardTitle className="text-lg">
                    {RANGES.find((r) => r.value === range)?.label}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <span className="size-2 rounded-xs bg-foreground/85" />
                    Views
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <span className="size-2 rounded-xs bg-muted-foreground/45" />
                    Visitors
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                role="img"
                aria-label={`Page views and visitors across ${chart.length} buckets`}
              >
                <svg
                  viewBox="0 0 100 46"
                  preserveAspectRatio="none"
                  aria-hidden
                  className="h-56 w-full"
                >
                  {[11, 22, 33].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="100"
                      y1={y}
                      y2={y}
                      vectorEffect="non-scaling-stroke"
                      className="stroke-border"
                      strokeDasharray="2 3"
                    />
                  ))}
                  <path
                    d={`${viewsLine} L100 46 L0 46 Z`}
                    className="fill-foreground/10"
                  />
                  <path
                    d={`${visitorsLine} L100 46 L0 46 Z`}
                    className="fill-foreground/5"
                  />
                  <path
                    d={viewsLine}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    strokeWidth="1.5"
                    className="stroke-foreground/85"
                  />
                  <path
                    d={visitorsLine}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="stroke-muted-foreground/60"
                  />
                </svg>
                <div className="mt-2 flex justify-between">
                  {chart.map((b) => (
                    <span
                      key={b.label}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                Peak ·{" "}
                {chart.reduce((a, b) => (b.views > a.views ? b : a)).label} ·{" "}
                {max.toLocaleString("en-US")} views
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                    · top pages
                  </CardDescription>
                  <Button variant="link" size="sm" className="h-auto p-0" asChild>
                    <a href="#">View all</a>
                  </Button>
                </div>
                <CardTitle className="sr-only">Top pages</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3.5">
                {TOP_PAGES.map((p) => (
                  <div key={p.path} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate font-mono text-xs text-foreground">
                        {p.path}
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {p.views}
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-accent">
                      <div
                        className="h-full rounded-full bg-foreground/70"
                        style={{ width: `${p.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                  · channels
                </CardDescription>
                <CardTitle className="sr-only">Channels</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {CHANNELS.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-xs text-muted-foreground">
                      {c.label}
                    </span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-accent">
                      <div
                        className="h-full rounded-full bg-foreground/70"
                        style={{ width: `${c.share}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {c.share}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
