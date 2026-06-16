"use client";

import * as React from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleSlash,
  Clock,
  GitBranch,
  Hash,
} from "lucide-react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/hirael/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/registry/hirael/ui/chart";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/hirael/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/hirael/ui/tooltip";

type RunState = "success" | "failure" | "skipped" | "running";

type Run = {
  id: string;
  number: number;
  attempt: number;
  pipeline: string;
  branch: string;
  state: RunState;
  durationSec: number;
  startedLabel: string;
  steps: { name: string; state: RunState; durationLabel: string }[];
};

const STATE_TOKEN: Record<RunState, string> = {
  success: "var(--success)",
  failure: "var(--destructive)",
  skipped: "var(--muted-foreground)",
  running: "var(--accent-cool)",
};

const STATE_LABEL: Record<RunState, string> = {
  success: "Passed",
  failure: "Failed",
  skipped: "Skipped",
  running: "Running",
};

const LEGEND: { state: RunState; label: string }[] = [
  { state: "success", label: "Passed" },
  { state: "failure", label: "Failed" },
  { state: "skipped", label: "Skipped" },
  { state: "running", label: "Running" },
];

const RUNS: Run[] = [
  {
    id: "r-118",
    number: 118,
    attempt: 1,
    pipeline: "Build & test",
    branch: "main",
    state: "success",
    durationSec: 94,
    startedLabel: "2 min ago",
    steps: [
      { name: "Install deps", state: "success", durationLabel: "21s" },
      { name: "Lint", state: "success", durationLabel: "9s" },
      { name: "Unit tests", state: "success", durationLabel: "48s" },
      { name: "Build", state: "success", durationLabel: "16s" },
    ],
  },
  {
    id: "r-117",
    number: 117,
    attempt: 1,
    pipeline: "Deploy preview",
    branch: "feat/inline-edit",
    state: "running",
    durationSec: 62,
    startedLabel: "5 min ago",
    steps: [
      { name: "Install deps", state: "success", durationLabel: "20s" },
      { name: "Build", state: "success", durationLabel: "18s" },
      { name: "Upload", state: "running", durationLabel: "—" },
    ],
  },
  {
    id: "r-116",
    number: 116,
    attempt: 2,
    pipeline: "Build & test",
    branch: "fix/date-range",
    state: "failure",
    durationSec: 71,
    startedLabel: "18 min ago",
    steps: [
      { name: "Install deps", state: "success", durationLabel: "22s" },
      { name: "Lint", state: "success", durationLabel: "8s" },
      { name: "Unit tests", state: "failure", durationLabel: "41s" },
      { name: "Build", state: "skipped", durationLabel: "—" },
    ],
  },
  {
    id: "r-115",
    number: 115,
    attempt: 1,
    pipeline: "Nightly e2e",
    branch: "main",
    state: "success",
    durationSec: 188,
    startedLabel: "42 min ago",
    steps: [
      { name: "Provision", state: "success", durationLabel: "31s" },
      { name: "Browser tests", state: "success", durationLabel: "2m 18s" },
      { name: "Teardown", state: "success", durationLabel: "19s" },
    ],
  },
  {
    id: "r-114",
    number: 114,
    attempt: 1,
    pipeline: "Build & test",
    branch: "chore/deps",
    state: "skipped",
    durationSec: 4,
    startedLabel: "1 hr ago",
    steps: [{ name: "Path filter", state: "skipped", durationLabel: "4s" }],
  },
  {
    id: "r-113",
    number: 113,
    attempt: 1,
    pipeline: "Build & test",
    branch: "main",
    state: "success",
    durationSec: 88,
    startedLabel: "2 hr ago",
    steps: [
      { name: "Install deps", state: "success", durationLabel: "20s" },
      { name: "Unit tests", state: "success", durationLabel: "52s" },
      { name: "Build", state: "success", durationLabel: "16s" },
    ],
  },
  {
    id: "r-112",
    number: 112,
    attempt: 1,
    pipeline: "Deploy production",
    branch: "main",
    state: "success",
    durationSec: 142,
    startedLabel: "3 hr ago",
    steps: [
      { name: "Build", state: "success", durationLabel: "1m 04s" },
      { name: "Migrate", state: "success", durationLabel: "11s" },
      { name: "Release", state: "success", durationLabel: "27s" },
    ],
  },
  {
    id: "r-111",
    number: 111,
    attempt: 1,
    pipeline: "Build & test",
    branch: "feat/year-picker",
    state: "failure",
    durationSec: 57,
    startedLabel: "4 hr ago",
    steps: [
      { name: "Install deps", state: "success", durationLabel: "21s" },
      { name: "Lint", state: "failure", durationLabel: "6s" },
      { name: "Unit tests", state: "skipped", durationLabel: "—" },
    ],
  },
];

type Stat = {
  key: string;
  label: string;
  value: string;
  meta: string;
  icon: React.ElementType;
  accent: string;
  live?: boolean;
};

const STATS: Stat[] = [
  {
    key: "success",
    label: "Success rate",
    value: "78%",
    meta: "21 of 27 completed runs",
    icon: CheckCircle2,
    accent: "var(--success)",
  },
  {
    key: "failure",
    label: "Failure rate",
    value: "15%",
    meta: "4 failures across 3 pipelines",
    icon: AlertTriangle,
    accent: "var(--destructive)",
  },
  {
    key: "skipped",
    label: "Skipped",
    value: "7%",
    meta: "2 of 27 completed runs",
    icon: CircleSlash,
    accent: "var(--muted-foreground)",
  },
  {
    key: "active",
    label: "Active now",
    value: "1",
    meta: "Currently running or queued",
    icon: Activity,
    accent: "var(--accent-cool)",
    live: true,
  },
];

const chartConfig = {
  duration: { label: "Duration" },
} satisfies ChartConfig;

function formatSeconds(value: number) {
  if (value < 60) return `${value}s`;
  const m = Math.floor(value / 60);
  const s = value % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

function StateDot({ state }: { state: RunState }) {
  return (
    <span
      aria-hidden
      className="inline-block size-2 shrink-0 rounded-full"
      style={{ backgroundColor: STATE_TOKEN[state] }}
    />
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <div
      data-slot="dashboard-stat"
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {stat.live ? (
          <span className="relative flex size-2">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-70"
              style={{ backgroundColor: stat.accent }}
            />
            <span
              className="relative inline-flex size-2 rounded-full"
              style={{ backgroundColor: stat.accent }}
            />
          </span>
        ) : (
          <Icon className="size-3" style={{ color: stat.accent }} />
        )}
        {stat.label}
      </div>
      <span className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
        {stat.value}
      </span>
      <span className="text-[11px] text-muted-foreground">{stat.meta}</span>
    </div>
  );
}

function RunBreakdown({ run }: { run: Run | null }) {
  if (!run) {
    return (
      <Card
        data-slot="dashboard-breakdown"
        className="gap-1 self-stretch overflow-hidden py-0"
      >
        <div className="h-1 w-full bg-muted" />
        <CardHeader className="px-4 pt-3">
          <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <Hash className="size-3 shrink-0" />
            <span>—</span>
          </div>
          <CardTitle className="text-sm text-muted-foreground">
            No run selected
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center px-4 pb-4">
          <Empty className="border-0">
            <EmptyMedia variant="icon">
              <BarChart3 />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyDescription>
                Pick a bar in the chart to inspect a run.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      data-slot="dashboard-breakdown"
      className="gap-2 self-stretch overflow-hidden py-0"
    >
      <div
        className="h-1 w-full"
        style={{ backgroundColor: STATE_TOKEN[run.state] }}
      />
      <CardHeader className="px-4 pt-3">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <span className="inline-flex items-center">
            <Hash className="size-3 shrink-0" />
            {run.number}
          </span>
          {run.attempt > 1 && <span>· attempt {run.attempt}</span>}
        </div>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-sm">{run.pipeline}</span>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium"
            style={{ color: STATE_TOKEN[run.state] }}
          >
            <StateDot state={run.state} />
            {STATE_LABEL[run.state]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4 pb-4">
        <dl className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">Branch</dt>
            <dd className="inline-flex items-center gap-1 font-mono">
              <GitBranch className="size-3 shrink-0" />
              <span className="truncate">{run.branch}</span>
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Clock className="size-3 shrink-0" />
              {formatSeconds(run.durationSec)}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-1 border-t border-border pt-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Steps
          </p>
          <ul className="flex flex-col gap-1">
            {run.steps.map((step) => (
              <li
                key={step.name}
                className="flex items-center gap-2 text-[11px]"
              >
                <StateDot state={step.state} />
                <span className="min-w-0 flex-1 truncate">{step.name}</span>
                <span className="shrink-0 font-mono tabular-nums text-muted-foreground">
                  {step.durationLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          size="sm"
          className="mt-auto gap-1 px-3 py-1.5 text-[11px]"
        >
          View full log
          <ChevronRight className="size-3 rtl:rotate-180" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Dashboard06() {
  const chartData = React.useMemo(
    () =>
      [...RUNS].reverse().map((run) => ({
        run,
        label: `#${run.number}`,
        duration: run.durationSec,
        state: run.state,
      })),
    [],
  );

  const [selectedId, setSelectedId] = React.useState<string>(RUNS[0].id);
  const selectedRun = RUNS.find((r) => r.id === selectedId) ?? null;

  return (
    <section data-slot="dashboard" className="bg-background py-20 sm:py-28">
      <div className="container flex w-full flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="size-1 rounded-full bg-foreground" />
            Pipelines
          </span>
          <h2 className="font-serif text-3xl font-medium tracking-tight">
            Overview
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Success rate, failures, and live activity across your pipelines,
            with the latest runs and what each one did.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard key={stat.key} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[1fr_340px]">
          <Card data-slot="dashboard-chart" className="py-0">
            <CardHeader className="px-6 pt-4 pb-3">
              <CardTitle>Latest runs</CardTitle>
              <CardDescription>
                Duration of the last {chartData.length} runs — pick a bar to
                inspect.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pb-4 sm:px-4">
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart
                  data={chartData}
                  margin={{ left: 4, right: 4, top: 4, bottom: 0 }}
                  onClick={(e) => {
                    const payload = (
                      e as { activePayload?: { payload?: unknown }[] }
                    ).activePayload?.[0]?.payload as
                      | (typeof chartData)[number]
                      | undefined;
                    if (payload?.run) setSelectedId(payload.run.id);
                  }}
                >
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    width={42}
                    tickFormatter={(v) => formatSeconds(v as number)}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <ChartTooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const { run, state } = payload[0]
                        .payload as (typeof chartData)[number];
                      return (
                        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
                          <p className="font-medium">{run.pipeline}</p>
                          <p className="font-mono text-muted-foreground">
                            {run.branch}
                          </p>
                          <div className="mt-1.5 space-y-0.5 text-[11px]">
                            <p>
                              <span className="text-muted-foreground">
                                Status:{" "}
                              </span>
                              {STATE_LABEL[state]}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Duration:{" "}
                              </span>
                              {formatSeconds(run.durationSec)}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Started:{" "}
                              </span>
                              {run.startedLabel}
                            </p>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="duration"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                    cursor="pointer"
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.run.id}
                        fill={STATE_TOKEN[entry.state]}
                        opacity={selectedId === entry.run.id ? 1 : 0.45}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-2 text-[11px] text-muted-foreground">
                {LEGEND.map((item) => (
                  <span key={item.state} className="flex items-center gap-1.5">
                    <span
                      className="inline-block size-2 rounded-sm"
                      style={{ backgroundColor: STATE_TOKEN[item.state] }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <RunBreakdown run={selectedRun} />
        </div>

        <Card data-slot="dashboard-recent" className="py-0">
          <CardHeader className="px-6 pt-4 pb-3">
            <CardTitle>Recent runs</CardTitle>
            <CardDescription>
              The last {RUNS.length} pipeline runs.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            {RUNS.length === 0 ? (
              <Empty className="m-4 h-[180px]">
                <EmptyMedia variant="icon">
                  <BarChart3 />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No runs yet</EmptyTitle>
                  <EmptyDescription>
                    Runs show up here once your pipelines start executing.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="flex flex-col">
                {RUNS.map((run, i) => (
                  <li key={run.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(run.id)}
                      className={cn(
                        "grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 px-6 py-3 text-start transition-colors duration-150 ease-out hover:bg-muted/50",
                        i < RUNS.length - 1 && "border-b border-border",
                        selectedId === run.id && "bg-muted/40",
                      )}
                    >
                      <StateDot state={run.state} />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">
                          {run.pipeline}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                          <Hash className="size-3 shrink-0" />
                          {run.number}
                          <span className="inline-flex items-center gap-1">
                            <GitBranch className="size-3 shrink-0" />
                            {run.branch}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-mono text-xs tabular-nums text-muted-foreground">
                              {formatSeconds(run.durationSec)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Started {run.startedLabel}
                          </TooltipContent>
                        </Tooltip>
                        <span
                          className="hidden font-mono text-[10px] uppercase tracking-[0.08em] sm:inline"
                          style={{ color: STATE_TOKEN[run.state] }}
                        >
                          {STATE_LABEL[run.state]}
                        </span>
                        <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
