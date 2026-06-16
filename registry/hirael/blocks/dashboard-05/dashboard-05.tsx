"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  GitBranch,
  MoonStar,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/hirael/ui/select";

type Range = "4h" | "24h" | "7d";

const RANGES: { value: Range; label: string }[] = [
  { value: "4h", label: "Last 4 hours" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
];

type Kpi = {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  good: boolean;
  spark: readonly number[];
};

const KPIS_BY_RANGE: Record<Range, readonly Kpi[]> = {
  "4h": [
    {
      label: "Requests",
      value: "248.6K",
      delta: "+8.4%",
      up: true,
      good: true,
      spark: [42, 48, 45, 56, 52, 61, 68],
    },
    {
      label: "Errors",
      value: "212",
      delta: "-22.1%",
      up: false,
      good: true,
      spark: [38, 32, 35, 26, 22, 18, 14],
    },
    {
      label: "P95 latency",
      value: "184 ms",
      delta: "-6.3%",
      up: false,
      good: true,
      spark: [52, 49, 50, 46, 44, 45, 41],
    },
    {
      label: "Compute",
      value: "96.4 GB-s",
      delta: "+3.1%",
      up: true,
      good: false,
      spark: [30, 32, 31, 35, 34, 37, 39],
    },
  ],
  "24h": [
    {
      label: "Requests",
      value: "1.42M",
      delta: "+11.9%",
      up: true,
      good: true,
      spark: [36, 44, 41, 52, 49, 58, 66],
    },
    {
      label: "Errors",
      value: "1,894",
      delta: "-9.6%",
      up: false,
      good: true,
      spark: [44, 40, 42, 36, 33, 30, 27],
    },
    {
      label: "P95 latency",
      value: "201 ms",
      delta: "-2.4%",
      up: false,
      good: true,
      spark: [55, 53, 54, 51, 50, 49, 48],
    },
    {
      label: "Compute",
      value: "612 GB-s",
      delta: "+5.8%",
      up: true,
      good: false,
      spark: [26, 29, 28, 33, 32, 36, 40],
    },
  ],
  "7d": [
    {
      label: "Requests",
      value: "9.81M",
      delta: "+19.2%",
      up: true,
      good: true,
      spark: [28, 36, 33, 46, 42, 55, 64],
    },
    {
      label: "Errors",
      value: "11.2K",
      delta: "-14.8%",
      up: false,
      good: true,
      spark: [52, 46, 49, 40, 36, 31, 26],
    },
    {
      label: "P95 latency",
      value: "196 ms",
      delta: "-4.1%",
      up: false,
      good: true,
      spark: [58, 55, 56, 52, 50, 48, 46],
    },
    {
      label: "Compute",
      value: "4.1 TB-s",
      delta: "+9.4%",
      up: true,
      good: false,
      spark: [22, 26, 25, 31, 30, 35, 41],
    },
  ],
};

const CACHE_SERIES = [88, 91, 90, 93, 92, 95, 96];
const DURATION_SERIES = [31, 28, 29, 26, 27, 24, 23];

const LATENCY = [
  { label: "P50", value: "92 ms", pct: 28 },
  { label: "P95", value: "184 ms", pct: 58 },
  { label: "P99", value: "412 ms", pct: 86 },
] as const;

type Deploy = {
  version: string;
  env: string;
  branch: string;
  message: string;
  date: string;
  status: "live" | "stable" | "canary";
  cache: "warm" | "cold";
};

const DEPLOYS: readonly Deploy[] = [
  {
    version: "v4.2.1",
    env: "Production",
    branch: "main",
    message: "Tighten cache key normalization for query params",
    date: "Jun 9",
    status: "live",
    cache: "warm",
  },
  {
    version: "v4.2.0",
    env: "Production",
    branch: "release/4.2",
    message: "Retry webhook delivery with jittered backoff",
    date: "Jun 7",
    status: "stable",
    cache: "warm",
  },
  {
    version: "v4.3.0-rc.2",
    env: "Staging",
    branch: "release/4.3",
    message: "Stream build logs over server-sent events",
    date: "Jun 6",
    status: "canary",
    cache: "cold",
  },
  {
    version: "v5.0.0-alpha.1",
    env: "Preview",
    branch: "next/isolates",
    message: "Spike: per-request sandbox isolation",
    date: "Jun 2",
    status: "stable",
    cache: "cold",
  },
];

const STATUS_META: Record<
  Deploy["status"],
  { label: string; dot: string; ping: boolean }
> = {
  live: { label: "Live", dot: "bg-success", ping: true },
  stable: { label: "Stable", dot: "bg-muted-foreground/50", ping: false },
  canary: { label: "Canary", dot: "bg-warning", ping: true },
};

function DeltaChip({
  delta,
  up,
  good,
}: {
  delta: string;
  up: boolean;
  good: boolean;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[11px] leading-none ${
        good
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {up ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}
      {delta}
    </span>
  );
}

function StatusDot({ status }: { status: Deploy["status"] }) {
  const meta = STATUS_META[status];
  return (
    <Badge
      variant="outline"
      className="w-fit gap-1.5 font-normal text-muted-foreground"
    >
      <span className="relative flex size-2">
        {meta.ping && (
          <span
            className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${meta.dot}`}
          />
        )}
        <span
          className={`relative inline-flex size-2 rounded-full ${meta.dot}`}
        />
      </span>
      {meta.label}
    </Badge>
  );
}

function Spark({ points, h = 28 }: { points: readonly number[]; h?: number }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = 100 / (points.length - 1);
  const line = points
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(h - 3 - ((v - min) / span) * (h - 8)).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg
      viewBox={`0 0 100 ${h}`}
      preserveAspectRatio="none"
      aria-hidden
      className="w-full"
      style={{ height: `${h * 2}px` }}
    >
      <path d={`${line} L100 ${h} L0 ${h} Z`} className="fill-foreground/6" />
      <path
        d={line}
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeWidth="1.5"
        className="stroke-foreground/60"
      />
    </svg>
  );
}

function CellHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
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
  );
}

export default function Dashboard05() {
  const [range, setRange] = React.useState<Range>("4h");
  const kpis = KPIS_BY_RANGE[range];

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
          <div className="flex flex-col gap-4 bg-card p-5 sm:flex-row sm:items-center sm:justify-between md:col-span-4">
            <div className="flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <MoonStar className="size-3.5" />
                good evening
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight">
                All systems steady.
              </h2>
            </div>
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger
                size="sm"
                className="w-[150px]"
                aria-label="Time range"
              >
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
          </div>

          {kpis.map((k) => (
            <div
              key={k.label}
              className="flex flex-col justify-between gap-3 bg-card p-5"
            >
              <div className="flex flex-col gap-2">
                <CellHeader label={k.label} />
                <div className="flex items-end justify-between gap-2">
                  <span className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">
                    {k.value}
                  </span>
                  <DeltaChip delta={k.delta} up={k.up} good={k.good} />
                </div>
              </div>
              <Spark points={k.spark} h={20} />
            </div>
          ))}

          <div className="flex flex-col gap-3 bg-card p-5 md:col-span-2">
            <CellHeader label="Edge cache hit rate" />
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">
                96.2%
              </span>
              <DeltaChip delta="+1.8%" up good />
            </div>
            <Spark points={CACHE_SERIES} h={34} />
          </div>

          <div className="flex flex-col gap-3 bg-card p-5 md:col-span-2">
            <CellHeader label="Avg. request duration" />
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">
                23.4 ms
              </span>
              <DeltaChip delta="-6.3%" up={false} good />
            </div>
            <Spark points={DURATION_SERIES} h={34} />
          </div>

          <div className="flex flex-col justify-between gap-5 bg-card p-5 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <Sparkles className="size-3.5" />
                insight
              </span>
              <Button variant="outline" size="sm">
                View traces
              </Button>
            </div>
            <p className="max-w-md text-balance text-lg font-medium leading-snug tracking-[-0.01em] sm:text-xl">
              Cold starts dropped{" "}
              <span className="underline decoration-success/60 decoration-2 underline-offset-4">
                21% this window
              </span>{" "}
              after the v4.2.1 cache changes rolled out.
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Generated from 248K spans · confidence high
            </span>
          </div>

          <div className="flex flex-col gap-4 bg-card p-5 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Latency distribution
                <Badge
                  variant="outline"
                  className="font-mono text-[9px] uppercase"
                >
                  p95 target · 200ms
                </Badge>
              </span>
              <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <a href="#">Open metrics</a>
              </Button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3">
              {LATENCY.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-8 shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {row.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-accent">
                    <div
                      className={`h-full rounded-full ${
                        row.label === "P99"
                          ? "bg-warning/70"
                          : "bg-foreground/70"
                      }`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-end font-mono text-xs tabular-nums">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Sampled across all regions
            </span>
          </div>

          <div className="flex flex-col bg-card md:col-span-4">
            <div className="flex items-center justify-between gap-2 p-5 pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Active deployments
              </span>
              <Button variant="link" size="sm" className="h-auto p-0" asChild>
                <a href="#">View all</a>
              </Button>
            </div>
            <ul className="flex flex-col">
              {DEPLOYS.map((d, i) => (
                <li
                  key={d.version}
                  className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3 md:grid-cols-[140px_110px_1fr_70px_70px_auto] ${
                    i < DEPLOYS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-mono text-xs font-medium">
                      {d.version}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                      {d.env}
                    </span>
                  </div>
                  <div className="justify-self-end md:justify-self-start">
                    <StatusDot status={d.status} />
                  </div>
                  <div className="col-span-2 flex min-w-0 flex-col md:col-span-1">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                      <GitBranch className="size-3" />
                      {d.branch}
                    </span>
                    <span className="truncate text-xs text-foreground">
                      {d.message}
                    </span>
                  </div>
                  <span className="hidden font-mono text-xs tabular-nums text-muted-foreground md:inline">
                    {d.date}
                  </span>
                  <span
                    className={`hidden font-mono text-[10px] uppercase tracking-[0.08em] md:inline ${
                      d.cache === "warm"
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  >
                    {d.cache}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden size-7 text-muted-foreground md:inline-flex"
                    aria-label={`${d.version} actions`}
                  >
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
