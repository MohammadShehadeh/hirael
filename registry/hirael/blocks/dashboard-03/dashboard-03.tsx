"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/hirael/ui/card";
import { Separator } from "@/registry/hirael/ui/separator";

type PlanName = "Pro" | "Team" | "Enterprise";
type InvoiceState = "Paid" | "Open" | "Overdue";

/**
 * Colour lives in one lookup per scale, keyed by what the value means.
 * Nothing in the data below carries a class name.
 */
const PLAN_TONE: Record<PlanName, { stroke: string; swatch: string }> = {
  Pro: { stroke: "stroke-foreground/85", swatch: "bg-foreground/85" },
  Team: {
    stroke: "stroke-muted-foreground/50",
    swatch: "bg-muted-foreground/50",
  },
  Enterprise: {
    stroke: "stroke-muted-foreground/20",
    swatch: "bg-muted-foreground/20",
  },
};

const INVOICE_TONE: Record<InvoiceState, string> = {
  Paid: "bg-success",
  Open: "bg-muted-foreground/50",
  Overdue: "bg-destructive",
};

interface PlanSlice { plan: PlanName; share: number; mrr: number}

interface MonthData {
  label: string;
  total: number;
  /** Percent change against the month before; the sign carries direction. */
  delta: number;
  comparedWith: string;
  plans: readonly PlanSlice[];
  invoices: readonly { state: InvoiceState; count: number; amount: number }[];}

const MONTHS: readonly MonthData[] = [
  {
    label: "February 2025",
    total: 38410,
    delta: 6.1,
    comparedWith: "Jan",
    plans: [
      { plan: "Pro", share: 48, mrr: 18436 },
      { plan: "Team", share: 33, mrr: 12675 },
      { plan: "Enterprise", share: 19, mrr: 7299 },
    ],
    invoices: [
      { state: "Paid", count: 212, amount: 36180 },
      { state: "Open", count: 18, amount: 1940 },
      { state: "Overdue", count: 4, amount: 290 },
    ],
  },
  {
    label: "March 2025",
    total: 41260,
    delta: 7.4,
    comparedWith: "Feb",
    plans: [
      { plan: "Pro", share: 46, mrr: 18980 },
      { plan: "Team", share: 34, mrr: 14028 },
      { plan: "Enterprise", share: 20, mrr: 8252 },
    ],
    invoices: [
      { state: "Paid", count: 231, amount: 39410 },
      { state: "Open", count: 14, amount: 1620 },
      { state: "Overdue", count: 3, amount: 230 },
    ],
  },
  {
    label: "April 2025",
    total: 44892,
    delta: 8.8,
    comparedWith: "Mar",
    plans: [
      { plan: "Pro", share: 44, mrr: 19752 },
      { plan: "Team", share: 35, mrr: 15712 },
      { plan: "Enterprise", share: 21, mrr: 9428 },
    ],
    invoices: [
      { state: "Paid", count: 247, amount: 42950 },
      { state: "Open", count: 16, amount: 1780 },
      { state: "Overdue", count: 2, amount: 162 },
    ],
  },
];

interface Txn {
  initials: string;
  name: string;
  email: string;
  status: "paid" | "open" | "refunded";
  date: string;
  /** Signed, so a refund is negative in the data and not only in the label. */
  amount: number;}

const TRANSACTIONS: readonly Txn[] = [
  {
    initials: "LV",
    name: "Lena Voss",
    email: "lena@northbeam.io",
    status: "paid",
    date: "Apr 28",
    amount: 249,
  },
  {
    initials: "DR",
    name: "Dario Reyes",
    email: "dario@quantfold.com",
    status: "paid",
    date: "Apr 27",
    amount: 1188,
  },
  {
    initials: "PB",
    name: "Priya Banerjee",
    email: "priya@helioslab.dev",
    status: "open",
    date: "Apr 27",
    amount: 96,
  },
  {
    initials: "TW",
    name: "Tomas Weber",
    email: "tomas@arcadia.app",
    status: "refunded",
    date: "Apr 26",
    amount: -249,
  },
  {
    initials: "AK",
    name: "Amara Keita",
    email: "amara@stackline.co",
    status: "paid",
    date: "Apr 25",
    amount: 468,
  },
  {
    initials: "HS",
    name: "Hana Suzuki",
    email: "hana@driftwork.com",
    status: "paid",
    date: "Apr 24",
    amount: 96,
  },
];

const TXN_STATUS: Record<
  Txn["status"],
  { label: string; dot: string; amount: string }
> = {
  paid: { label: "Paid", dot: "bg-success", amount: "text-foreground" },
  open: {
    label: "Open",
    dot: "bg-muted-foreground/50",
    amount: "text-muted-foreground",
  },
  refunded: {
    label: "Refunded",
    dot: "bg-destructive",
    amount: "text-destructive",
  },
};

const PAGE_SIZE = 3;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const signedUsd = (amount: number) => {
  const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
  return `${sign}${usdCents.format(Math.abs(amount))}`;
};

const Donut = ({ plans }: { plans: readonly PlanSlice[] }) => {
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
          25 - plans.slice(0, i).reduce((sum, prev) => sum + prev.share, 0);
        return (
          <circle
            key={p.plan}
            cx="21"
            cy="21"
            r="15.9155"
            fill="none"
            strokeWidth="4"
            strokeDasharray={`${p.share - 1} ${100 - p.share + 1}`}
            strokeDashoffset={offset}
            className={PLAN_TONE[p.plan].stroke}
          />
        );
      })}
    </svg>
  );
};

const Dashboard03 = () => {
  const [monthIndex, setMonthIndex] = React.useState(MONTHS.length - 1);
  const [page, setPage] = React.useState(0);

  const month = MONTHS[monthIndex];
  const pageCount = Math.ceil(TRANSACTIONS.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const pageRows = TRANSACTIONS.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              revenue
            </Badge>
            <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
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
                <ChevronLeft className="size-3.5 rtl:rotate-180" aria-hidden />
              </Button>
              <span
                aria-live="polite"
                className="w-32 text-center font-mono text-xs tabular-nums"
              >
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
                <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                  plan mix
                </CardDescription>
                <CardTitle className="sr-only">Plan mix</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-5">
                <div className="relative">
                  <Donut plans={month.plans} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                    <span className="text-2xl font-semibold tracking-[-0.035em] tabular-nums">
                      {usd.format(month.total)}
                    </span>
                    <span
                      dir="ltr"
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-[0.1em]",
                        month.delta === 0
                          ? "text-muted-foreground"
                          : month.delta > 0
                            ? "text-success"
                            : "text-destructive",
                      )}
                    >
                      {month.delta > 0 ? "+" : month.delta < 0 ? "−" : ""}
                      {Math.abs(month.delta)}% vs {month.comparedWith}
                    </span>
                  </div>
                </div>
                <ul className="flex w-full flex-col gap-2.5">
                  {month.plans.map((p) => (
                    <li key={p.plan} className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className={cn(
                          "size-2 rounded-xs",
                          PLAN_TONE[p.plan].swatch,
                        )}
                      />
                      <span className="text-xs text-foreground">{p.plan}</span>
                      <span className="ms-auto font-mono text-xs tabular-nums text-muted-foreground">
                        {p.share}%
                      </span>
                      <span className="w-16 text-end font-mono text-xs tabular-nums">
                        {usd.format(p.mrr)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                  invoices
                </CardDescription>
                <CardTitle className="sr-only">Invoices</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {month.invoices.map((inv, i) => (
                  <React.Fragment key={inv.state}>
                    {i > 0 && <Separator />}
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 rounded-full",
                          INVOICE_TONE[inv.state],
                        )}
                      />
                      <span className="text-xs text-foreground">
                        {inv.state}
                      </span>
                      <span className="ms-auto font-mono text-xs tabular-nums text-muted-foreground">
                        {inv.count}
                      </span>
                      <span className="w-20 text-end font-mono text-xs tabular-nums">
                        {usd.format(inv.amount)}
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
                    transactions
                  </CardDescription>
                  <CardTitle className="text-lg">Latest activity</CardTitle>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <a href="#">View all</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div
                aria-hidden
                className="hidden grid-cols-[1fr_110px_70px_110px] gap-3 border-b border-border px-6 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:grid"
              >
                <span>Customer</span>
                <span>Status</span>
                <span>Date</span>
                <span className="text-end">Amount</span>
              </div>
              <ul className="flex flex-col">
                {pageRows.map((t, i) => {
                  const status = TXN_STATUS[t.status];
                  return (
                    <li
                      key={t.email}
                      className={cn(
                        "grid grid-cols-[1fr_auto] items-center gap-3 px-6 py-3 sm:grid-cols-[1fr_110px_70px_110px]",
                        i < pageRows.length - 1 && "border-b border-border",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          aria-hidden
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium"
                        >
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
                          aria-hidden
                          className={cn("size-1.5 rounded-full", status.dot)}
                        />
                        {status.label}
                      </Badge>
                      <span className="hidden font-mono text-xs tabular-nums text-muted-foreground sm:inline">
                        {t.date}
                      </span>
                      <span
                        dir="ltr"
                        className={cn(
                          "text-end font-mono text-sm tabular-nums",
                          status.amount,
                        )}
                      >
                        <span className="sr-only">{status.label}, </span>
                        {signedUsd(t.amount)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Separator />
              <div className="flex items-center justify-between px-6 pt-4">
                <span
                  dir="ltr"
                  aria-live="polite"
                  className="font-mono text-[10px] uppercase tracking-[0.1em] tabular-nums text-muted-foreground"
                >
                  {pageStart + 1}–{pageStart + pageRows.length} of{" "}
                  {TRANSACTIONS.length}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="size-3.5 rtl:rotate-180" aria-hidden />
                    Prev
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(pageCount - 1, p + 1))
                    }
                    disabled={page >= pageCount - 1}
                  >
                    Next
                    <ChevronRight
                      className="size-3.5 rtl:rotate-180"
                      aria-hidden
                    />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard03;
