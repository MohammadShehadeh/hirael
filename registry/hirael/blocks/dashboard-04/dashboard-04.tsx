"use client"

import * as React from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock4,
  CreditCard,
  MoreHorizontal,
  Package,
  RotateCcw,
  Settings2,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/registry/hirael/ui/badge"
import { Button } from "@/registry/hirael/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/hirael/ui/select"

type Stat = {
  icon: LucideIcon
  label: string
  value: string
  delta: string
  up: boolean
  good: boolean
}

const STATS: readonly Stat[] = [
  { icon: ShoppingCart, label: "Open orders", value: "36", delta: "+12.5%", up: true, good: true },
  { icon: Package, label: "Items sold", value: "1,482", delta: "+6.8%", up: true, good: true },
  { icon: Users, label: "Store sessions", value: "9,214", delta: "+4.1%", up: true, good: true },
  { icon: RotateCcw, label: "Refund rate", value: "0.8%", delta: "-0.2%", up: false, good: true },
]

const TODAY_SERIES = [12, 9, 14, 24, 46, 74, 92, 84, 102, 96, 71, 48, 31]
const YESTERDAY_SERIES = [10, 8, 11, 19, 39, 61, 78, 73, 84, 80, 64, 41, 26]
const HOUR_TICKS = ["00", "04", "08", "12", "16", "20", "24"] as const

const PEAK_BARS = [14, 18, 26, 41, 58, 92, 100, 86, 54, 38, 27, 19] as const

type WeekRange = "this" | "last"

const WEEK: Record<
  WeekRange,
  {
    orders: { value: string; delta: string; bars: readonly number[] }
    minis: readonly { label: string; value: string; delta: string; good: boolean; spark: readonly number[] }[]
  }
> = {
  this: {
    orders: {
      value: "1,318",
      delta: "+11.2%",
      bars: [148, 176, 162, 196, 228, 184, 224],
    },
    minis: [
      { label: "Gross revenue", value: "$24,820", delta: "+9.2%", good: true, spark: [30, 34, 31, 38, 44, 41, 48] },
      { label: "Returning buyers", value: "58.4%", delta: "+1.9%", good: true, spark: [52, 54, 53, 55, 56, 57, 58] },
      { label: "Checkout conversion", value: "3.1%", delta: "+0.4%", good: true, spark: [2.5, 2.7, 2.6, 2.9, 3.0, 2.9, 3.1] },
    ],
  },
  last: {
    orders: {
      value: "1,186",
      delta: "+4.6%",
      bars: [132, 158, 149, 171, 198, 166, 212],
    },
    minis: [
      { label: "Gross revenue", value: "$22,730", delta: "+5.8%", good: true, spark: [27, 30, 28, 33, 37, 35, 41] },
      { label: "Returning buyers", value: "56.5%", delta: "-0.3%", good: false, spark: [57, 56, 57, 56, 55, 56, 56] },
      { label: "Checkout conversion", value: "2.7%", delta: "+0.1%", good: true, spark: [2.4, 2.5, 2.4, 2.6, 2.7, 2.6, 2.7] },
    ],
  },
}

const BUDGET = { spent: 223.1, cap: 400 }

function linePath(values: readonly number[], max: number, h: number) {
  const step = 100 / (values.length - 1)
  return values
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)} ${(h - 2 - (v / max) * (h - 6)).toFixed(2)}`
    )
    .join(" ")
}

function DeltaChip({
  delta,
  up,
  good,
}: {
  delta: string
  up: boolean
  good: boolean
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[11px] leading-none ${
        good ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
      }`}
    >
      {up ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}
      {delta}
    </span>
  )
}

function PanelCard({
  icon: Icon,
  label,
  children,
  className = "",
}: {
  icon: LucideIcon
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-md border border-border bg-card p-2.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <Icon className="size-3.5" />
          {label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 text-muted-foreground"
          aria-label={`${label} options`}
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>
      <div className="flex flex-1 flex-col rounded-sm border border-border bg-background p-4">
        {children}
      </div>
    </div>
  )
}

export default function Dashboard04() {
  const [range, setRange] = React.useState<WeekRange>("this")
  const week = WEEK[range]

  const chartMax = Math.max(...TODAY_SERIES, ...YESTERDAY_SERIES)
  const todayLine = linePath(TODAY_SERIES, chartMax, 46)
  const yesterdayLine = linePath(YESTERDAY_SERIES, chartMax, 46)
  const barMax = Math.max(...week.orders.bars)
  const budgetPct = Math.round((BUDGET.spent / BUDGET.cap) * 100)

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 md:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              · storefront
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Today at the counter.
            </h2>
          </div>
          <Button variant="outline" size="sm">
            <Settings2 className="size-3.5" />
            Customize
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <PanelCard key={s.label} icon={s.icon} label={s.label}>
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">
                  {s.value}
                </span>
                <div className="flex items-center gap-1.5">
                  <DeltaChip delta={s.delta} up={s.up} good={s.good} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                    vs yesterday
                  </span>
                </div>
              </div>
            </PanelCard>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-[-0.02em]">Today</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Live · updates every minute
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <PanelCard
            icon={CreditCard}
            label="Gross revenue"
            className="lg:col-span-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-8">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    <span className="size-2 rounded-xs bg-foreground/85" />
                    Today
                  </span>
                  <span className="text-xl font-semibold tabular-nums tracking-[-0.02em]">
                    $1,284.50
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    <span className="size-2 rounded-xs bg-muted-foreground/45" />
                    Yesterday
                  </span>
                  <span className="text-xl font-semibold tabular-nums tracking-[-0.02em] text-muted-foreground">
                    $1,092.20
                  </span>
                </div>
              </div>
              <DeltaChip delta="+17.6%" up good />
            </div>
            <div className="mt-4 flex flex-1 flex-col justify-end">
              <svg
                viewBox="0 0 100 46"
                preserveAspectRatio="none"
                role="img"
                aria-label="Revenue by hour, today versus yesterday"
                className="h-44 w-full sm:h-56"
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
                  d={`${todayLine} L100 46 L0 46 Z`}
                  className="fill-foreground/8"
                />
                <path
                  d={todayLine}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  strokeWidth="1.5"
                  className="stroke-foreground/85"
                />
                <path
                  d={yesterdayLine}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  className="stroke-muted-foreground/60"
                />
              </svg>
              <div className="mt-2 flex justify-between">
                {HOUR_TICKS.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] tabular-nums uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </PanelCard>

          <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:grid-rows-2">
            <PanelCard icon={CreditCard} label="Ad budget">
              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      Spent today
                    </span>
                    <span className="text-xl font-semibold tabular-nums tracking-[-0.02em]">
                      ${BUDGET.spent.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-right">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      Daily cap
                    </span>
                    <span className="text-xl font-semibold tabular-nums tracking-[-0.02em] text-muted-foreground">
                      ${BUDGET.cap.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div
                    role="img"
                    aria-label={`${budgetPct} percent of daily ad budget used`}
                    className="h-2 w-full overflow-hidden rounded-full bg-accent"
                  >
                    <div
                      className="h-full rounded-full bg-foreground/80"
                      style={{ width: `${budgetPct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {budgetPct}% used · resets 00:00 UTC
                  </span>
                </div>
              </div>
            </PanelCard>

            <PanelCard icon={Clock4} label="Peak hours">
              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-semibold tracking-[-0.02em]">
                    12 PM – 2 PM
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    31% of today&apos;s orders
                  </span>
                </div>
                <div
                  role="img"
                  aria-label="Orders by hour"
                  className="flex h-16 items-end gap-1"
                >
                  {PEAK_BARS.map((h, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-t-xs ${
                        h >= 86 ? "bg-foreground/85" : "bg-muted-foreground/30"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </PanelCard>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-[-0.02em]">
            Week in review
          </h3>
          <Select value={range} onValueChange={(v) => setRange(v as WeekRange)}>
            <SelectTrigger size="sm" className="w-[130px]" aria-label="Week range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this">This week</SelectItem>
              <SelectItem value="last">Last week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4">
          <PanelCard icon={ShoppingCart} label="Orders">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-3xl font-semibold tabular-nums tracking-[-0.035em]">
                  {week.orders.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Orders completed
                </span>
              </div>
              <DeltaChip delta={week.orders.delta} up good />
            </div>
            <div
              role="img"
              aria-label="Orders per day"
              className="mt-4 grid h-32 items-end gap-2"
              style={{
                gridTemplateColumns: `repeat(${week.orders.bars.length}, minmax(0, 1fr))`,
              }}
            >
              {week.orders.bars.map((b, i) => (
                <div key={i} className="flex h-full flex-col justify-end gap-1.5">
                  <div
                    className="rounded-t-xs bg-foreground/80 transition-all duration-300 ease-out"
                    style={{ height: `${(b / barMax) * 100}%` }}
                  />
                  <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </PanelCard>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {week.minis.map((m) => {
              const max = Math.max(...m.spark)
              const min = Math.min(...m.spark)
              const span = max - min || 1
              const step = 100 / (m.spark.length - 1)
              const pts = m.spark
                .map(
                  (v, i) =>
                    `${(i * step).toFixed(1)},${(22 - ((v - min) / span) * 16).toFixed(1)}`
                )
                .join(" ")
              return (
                <PanelCard key={m.label} icon={CreditCard} label={m.label}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-2xl font-semibold tabular-nums tracking-[-0.03em]">
                      {m.value}
                    </span>
                    <DeltaChip
                      delta={m.delta}
                      up={m.delta.startsWith("+")}
                      good={m.good}
                    />
                  </div>
                  <svg
                    viewBox="0 0 100 26"
                    preserveAspectRatio="none"
                    aria-hidden
                    className="mt-3 h-12 w-full"
                  >
                    <polyline
                      points={pts}
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                      strokeWidth="1.5"
                      className="stroke-foreground/45"
                    />
                  </svg>
                </PanelCard>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
