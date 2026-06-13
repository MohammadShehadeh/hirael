"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"

import { Badge } from "@/registry/hirael/ui/badge"
import { Button } from "@/registry/hirael/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/hirael/ui/card"
import { Separator } from "@/registry/hirael/ui/separator"

type PlanSlice = {
  label: string
  share: number
  mrr: string
  tone: string
  dot: string
}

type MonthData = {
  label: string
  total: string
  delta: string
  plans: readonly PlanSlice[]
  invoices: readonly { label: string; count: number; amount: string; dot: string }[]
}

const MONTHS: readonly MonthData[] = [
  {
    label: "February 2025",
    total: "$38,410",
    delta: "+6.1% vs Jan",
    plans: [
      { label: "Pro", share: 48, mrr: "$18,436", tone: "stroke-foreground/85", dot: "bg-foreground/85" },
      { label: "Team", share: 33, mrr: "$12,675", tone: "stroke-muted-foreground/50", dot: "bg-muted-foreground/50" },
      { label: "Enterprise", share: 19, mrr: "$7,299", tone: "stroke-muted-foreground/20", dot: "bg-muted-foreground/20" },
    ],
    invoices: [
      { label: "Paid", count: 212, amount: "$36,180", dot: "bg-emerald-500" },
      { label: "Open", count: 18, amount: "$1,940", dot: "bg-muted-foreground/50" },
      { label: "Overdue", count: 4, amount: "$290", dot: "bg-red-500" },
    ],
  },
  {
    label: "March 2025",
    total: "$41,260",
    delta: "+7.4% vs Feb",
    plans: [
      { label: "Pro", share: 46, mrr: "$18,980", tone: "stroke-foreground/85", dot: "bg-foreground/85" },
      { label: "Team", share: 34, mrr: "$14,028", tone: "stroke-muted-foreground/50", dot: "bg-muted-foreground/50" },
      { label: "Enterprise", share: 20, mrr: "$8,252", tone: "stroke-muted-foreground/20", dot: "bg-muted-foreground/20" },
    ],
    invoices: [
      { label: "Paid", count: 231, amount: "$39,410", dot: "bg-emerald-500" },
      { label: "Open", count: 14, amount: "$1,620", dot: "bg-muted-foreground/50" },
      { label: "Overdue", count: 3, amount: "$230", dot: "bg-red-500" },
    ],
  },
  {
    label: "April 2025",
    total: "$44,892",
    delta: "+8.8% vs Mar",
    plans: [
      { label: "Pro", share: 44, mrr: "$19,752", tone: "stroke-foreground/85", dot: "bg-foreground/85" },
      { label: "Team", share: 35, mrr: "$15,712", tone: "stroke-muted-foreground/50", dot: "bg-muted-foreground/50" },
      { label: "Enterprise", share: 21, mrr: "$9,428", tone: "stroke-muted-foreground/20", dot: "bg-muted-foreground/20" },
    ],
    invoices: [
      { label: "Paid", count: 247, amount: "$42,950", dot: "bg-emerald-500" },
      { label: "Open", count: 16, amount: "$1,780", dot: "bg-muted-foreground/50" },
      { label: "Overdue", count: 2, amount: "$162", dot: "bg-red-500" },
    ],
  },
]

type Txn = {
  initials: string
  name: string
  email: string
  status: "paid" | "open" | "refunded"
  date: string
  amount: string
}

const TRANSACTIONS: readonly Txn[] = [
  { initials: "LV", name: "Lena Voss", email: "lena@northbeam.io", status: "paid", date: "Apr 28", amount: "+$249.00" },
  { initials: "DR", name: "Dario Reyes", email: "dario@quantfold.com", status: "paid", date: "Apr 27", amount: "+$1,188.00" },
  { initials: "PB", name: "Priya Banerjee", email: "priya@helioslab.dev", status: "open", date: "Apr 27", amount: "$96.00" },
  { initials: "TW", name: "Tomas Weber", email: "tomas@arcadia.app", status: "refunded", date: "Apr 26", amount: "−$249.00" },
  { initials: "AK", name: "Amara Keita", email: "amara@stackline.co", status: "paid", date: "Apr 25", amount: "+$468.00" },
  { initials: "HS", name: "Hana Suzuki", email: "hana@driftwork.com", status: "paid", date: "Apr 24", amount: "+$96.00" },
]

const STATUS_META: Record<Txn["status"], { label: string; dot: string }> = {
  paid: { label: "Paid", dot: "bg-emerald-500" },
  open: { label: "Open", dot: "bg-muted-foreground/50" },
  refunded: { label: "Refunded", dot: "bg-red-500" },
}

function Donut({ plans }: { plans: readonly PlanSlice[] }) {
  return (
    <svg viewBox="0 0 42 42" aria-hidden className="size-44">
      <circle
        cx="21"
        cy="21"
        r="15.9155"
        fill="none"
        strokeWidth="4"
        className="stroke-accent"
      />
      {plans.map((p, i) => {
        // Each slice starts where the previous ones ended; 25 rotates the
        // first slice to 12 o'clock.
        const offset =
          25 - plans.slice(0, i).reduce((sum, prev) => sum + prev.share, 0)
        return (
          <circle
            key={p.label}
            cx="21"
            cy="21"
            r="15.9155"
            fill="none"
            strokeWidth="4"
            strokeDasharray={`${p.share - 1} ${100 - p.share + 1}`}
            strokeDashoffset={offset}
            className={p.tone}
          />
        )
      })}
    </svg>
  )
}

export default function Dashboard03() {
  const [monthIndex, setMonthIndex] = React.useState(MONTHS.length - 1)
  const month = MONTHS[monthIndex]

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              · revenue
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Where the money lands.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-sm border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-e-none"
                onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
                disabled={monthIndex === 0}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <span className="w-32 text-center font-mono text-xs tabular-nums">
                {month.label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-s-none"
                onClick={() =>
                  setMonthIndex((i) => Math.min(MONTHS.length - 1, i + 1))
                }
                disabled={monthIndex === MONTHS.length - 1}
                aria-label="Next month"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                  · plan mix
                </CardDescription>
                <CardTitle className="sr-only">Plan mix</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-5">
                <div className="relative">
                  <Donut plans={month.plans} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                    <span className="text-2xl font-semibold tracking-[-0.035em] tabular-nums">
                      {month.total}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-500">
                      {month.delta}
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2.5">
                  {month.plans.map((p) => (
                    <div key={p.label} className="flex items-center gap-2.5">
                      <span
                        className={`size-2 rounded-xs ${p.dot}`}
                      />
                      <span className="text-xs text-foreground">{p.label}</span>
                      <span className="ms-auto font-mono text-xs tabular-nums text-muted-foreground">
                        {p.share}%
                      </span>
                      <span className="w-16 text-end font-mono text-xs tabular-nums">
                        {p.mrr}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                  · invoices
                </CardDescription>
                <CardTitle className="sr-only">Invoices</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {month.invoices.map((inv, i) => (
                  <React.Fragment key={inv.label}>
                    {i > 0 && <Separator />}
                    <div className="flex items-center gap-2.5">
                      <span className={`size-1.5 rounded-full ${inv.dot}`} />
                      <span className="text-xs text-foreground">{inv.label}</span>
                      <span className="ms-auto font-mono text-xs tabular-nums text-muted-foreground">
                        {inv.count}
                      </span>
                      <span className="w-20 text-end font-mono text-xs tabular-nums">
                        {inv.amount}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                    · transactions
                  </CardDescription>
                  <CardTitle className="text-lg">Latest activity</CardTitle>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <a href="#">View all</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="hidden grid-cols-[1fr_110px_70px_110px] gap-3 border-b border-border px-6 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:grid">
                <span>Customer</span>
                <span>Status</span>
                <span>Date</span>
                <span className="text-end">Amount</span>
              </div>
              <ul className="flex flex-col">
                {TRANSACTIONS.map((t, i) => {
                  const status = STATUS_META[t.status]
                  return (
                    <li
                      key={t.email}
                      className={`grid grid-cols-[1fr_auto] items-center gap-3 px-6 py-3 sm:grid-cols-[1fr_110px_70px_110px] ${
                        i < TRANSACTIONS.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium">
                          {t.initials}
                        </span>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">
                            {t.name}
                          </span>
                          <span className="truncate font-mono text-[11px] text-muted-foreground">
                            {t.email}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="hidden w-fit gap-1.5 font-normal text-muted-foreground sm:inline-flex"
                      >
                        <span
                          className={`size-1.5 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </Badge>
                      <span className="hidden font-mono text-xs tabular-nums text-muted-foreground sm:inline">
                        {t.date}
                      </span>
                      <span
                        className={`text-end font-mono text-sm tabular-nums ${
                          t.status === "refunded"
                            ? "text-red-500"
                            : t.status === "open"
                              ? "text-muted-foreground"
                              : "text-foreground"
                        }`}
                      >
                        {t.amount}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <Separator />
              <div className="flex items-center justify-between px-6 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  6 of 248 transactions
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" disabled>
                    <ChevronLeft className="size-3.5" />
                    Prev
                  </Button>
                  <Button variant="ghost" size="sm">
                    Next
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
