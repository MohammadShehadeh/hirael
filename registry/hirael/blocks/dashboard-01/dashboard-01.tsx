"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  Minus,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/registry/hirael/ui/avatar";
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
import { Tabs, TabsList, TabsTrigger } from "@/registry/hirael/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/hirael/ui/tooltip";

interface Metric {
  label: string;
  value: string;
  /** Change against the previous period; the sign carries the direction. */
  delta: number;
  unit: "%" | "pt" | "s";
  /** Which way this metric has to move to be good news. Churn falls. */
  goodWhen: "up" | "down";}

type Range = "1d" | "7d" | "30d" | "90d";

const RANGES: { value: Range; label: string }[] = [
  { value: "1d", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

const METRICS_BY_RANGE: Record<Range, readonly Metric[]> = {
  "1d": [
    { label: "MRR", value: "$48,510", delta: 0.5, unit: "%", goodWhen: "up" },
    { label: "Active orgs", value: "1,289", delta: 0.4, unit: "%", goodWhen: "up" },
    { label: "Churn", value: "1.9%", delta: 0, unit: "%", goodWhen: "down" },
    { label: "Avg. session", value: "4m 18s", delta: 6, unit: "s", goodWhen: "up" },
  ],
  "7d": [
    { label: "MRR", value: "$48,250", delta: 8.7, unit: "%", goodWhen: "up" },
    { label: "Active orgs", value: "1,284", delta: 4.1, unit: "%", goodWhen: "up" },
    { label: "Churn", value: "1.8%", delta: -0.4, unit: "%", goodWhen: "down" },
    { label: "Avg. session", value: "4m 12s", delta: 0, unit: "s", goodWhen: "up" },
  ],
  "30d": [
    { label: "MRR", value: "$46,180", delta: 18.2, unit: "%", goodWhen: "up" },
    { label: "Active orgs", value: "1,231", delta: 12.6, unit: "%", goodWhen: "up" },
    { label: "Churn", value: "2.1%", delta: -0.6, unit: "%", goodWhen: "down" },
    { label: "Avg. session", value: "4m 04s", delta: 14, unit: "s", goodWhen: "up" },
  ],
  "90d": [
    { label: "MRR", value: "$41,920", delta: 34.6, unit: "%", goodWhen: "up" },
    { label: "Active orgs", value: "1,096", delta: 26.3, unit: "%", goodWhen: "up" },
    { label: "Churn", value: "2.4%", delta: -1.1, unit: "%", goodWhen: "down" },
    { label: "Avg. session", value: "3m 51s", delta: 27, unit: "s", goodWhen: "up" },
  ],
};

const CHART_BY_RANGE: Record<
  Range,
  readonly { d: string; a: number; b: number }[]
> = {
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
};

const SIGNUPS_BY_RANGE: Record<Range, { count: string; conversion: string }> = {
  "1d": { count: "82", conversion: "3.91%" },
  "7d": { count: "486", conversion: "3.42%" },
  "30d": { count: "2,154", conversion: "3.18%" },
  "90d": { count: "6,820", conversion: "2.94%" },
};

interface Activity {
  initials: string;
  name: string;
  action: string;
  time: string;}

const ACTIVITY: readonly Activity[] = [
  {
    initials: "MR",
    name: "Maya Renner",
    action: "upgraded to Pro",
    time: "2m ago",
  },
  {
    initials: "JT",
    name: "Jules Tanaka",
    action: "invited 3 teammates",
    time: "14m ago",
  },
  {
    initials: "AO",
    name: "Adaeze Okafor",
    action: "exported 412 rows",
    time: "1h ago",
  },
  {
    initials: "SK",
    name: "Soren Kim",
    action: "rotated API keys",
    time: "3h ago",
  },
];

/** Tone follows intent, not sign: falling churn is good news, so it is green. */
const deltaTone = ({ delta, goodWhen }: Metric) => {
  if (delta === 0) return "bg-accent text-muted-foreground";
  const improving = delta > 0 === (goodWhen === "up");
  return improving ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive";
};

const DeltaChip = ({ metric }: { metric: Metric }) => {
  const { delta, unit, label } = metric;
  const Icon = delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "unchanged";
  const measure = unit === "%" ? "percent" : unit === "pt" ? "points" : "seconds";
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";

  return (
    <Badge
      dir="ltr"
      aria-label={`${label} ${direction} ${Math.abs(delta)} ${measure} against the previous period`}
      className={cn(
        "rounded-sm px-1.5 py-0.5 font-mono text-[11px] leading-none tabular-nums",
        deltaTone(metric),
      )}
    >
      <Icon className="size-3" aria-hidden />
      {sign}
      {Math.abs(delta)}
      {unit}
    </Badge>
  );
};

const Dashboard01 = () => {
  const [range, setRange] = React.useState<Range>("7d");
  const [refreshing, setRefreshing] = React.useState(false);
  const [status, setStatus] = React.useState("");

  const metrics = METRICS_BY_RANGE[range];
  const chart = CHART_BY_RANGE[range];
  const signups = SIGNUPS_BY_RANGE[range];
  const chartMax = Math.max(...chart.flatMap((c) => [c.a, c.b]));

  const onRefresh = async () => {
    setRefreshing(true);
    setStatus("Refreshing data");
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
    setStatus("Data refreshed");
  };

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              overview
            </Badge>
            <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
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
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Filter className="size-3.5" aria-hidden />
              All teams
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                aria-hidden
                className={cn(
                  "size-3.5",
                  refreshing && "motion-safe:animate-spin",
                )}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {status}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-2 bg-card p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {m.label}
              </span>
              <span className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">
                {m.value}
              </span>
              <DeltaChip metric={m} />
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                    sign-ups
                  </CardDescription>
                  <CardTitle className="text-lg">
                    {signups.count} new sign-ups
                  </CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-end">
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
                    <Download className="size-3.5" aria-hidden />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                role="group"
                aria-label={`Sign-ups and activations across ${chart.length} buckets`}
                className="grid h-56 items-end gap-2 sm:gap-3"
                style={{
                  gridTemplateColumns: `repeat(${chart.length}, minmax(0, 1fr))`,
                }}
              >
                {chart.map((row) => (
                  <Tooltip key={row.d}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={`${row.d}: ${row.a} sign-ups, ${row.b} activated`}
                        className="group/bar flex h-full cursor-default flex-col gap-1.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <span className="flex h-full items-end gap-1">
                          <span
                            aria-hidden
                            className="flex-1 rounded-t-xs bg-foreground/85 transition-colors group-hover/bar:bg-foreground group-focus-visible/bar:bg-foreground"
                            style={{ height: `${(row.a / chartMax) * 100}%` }}
                          />
                          <span
                            aria-hidden
                            className="flex-1 rounded-t-xs bg-muted-foreground/40 transition-colors group-hover/bar:bg-muted-foreground/60 group-focus-visible/bar:bg-muted-foreground/60"
                            style={{ height: `${(row.b / chartMax) * 100}%` }}
                          />
                        </span>
                        <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                          {row.d}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-mono tabular-nums">
                        {row.d} · {row.a} sign-ups · {row.b} activated
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span
                    aria-hidden
                    className="size-2 rounded-xs bg-foreground/85"
                  />
                  Sign-ups
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span
                    aria-hidden
                    className="size-2 rounded-xs bg-muted-foreground/40"
                  />
                  Activated
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.12em]">
                  recent activity
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
                    className={cn(
                      "flex items-center gap-3 px-6 py-3",
                      i < ACTIVITY.length - 1 && "border-b border-border",
                    )}
                  >
                    <Avatar aria-hidden>
                      <AvatarFallback className="bg-muted font-mono text-xs font-medium text-foreground">
                        {a.initials}
                      </AvatarFallback>
                    </Avatar>
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
  );
};

export default Dashboard01;
