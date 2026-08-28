'use client';

import * as React from 'react';
import { ArrowDownRight, ArrowUpRight, GitBranch, Minus, MoonStar, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';

type Range = '4h' | '24h' | '7d';

const RANGES: { value: Range; label: string }[] = [
  { value: '4h', label: 'Last 4 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
];

/**
 * The sign gives the direction and `goodWhen` gives the intent, so falling
 * errors and falling latency read as wins without a per-metric special case.
 */
interface Delta {
  value: number;
  unit: '%' | 'pp';
  goodWhen: 'up' | 'down';
}

interface Kpi {
  label: string;
  value: string;
  delta: Delta;
  spark: readonly number[];
}

const KPIS_BY_RANGE: Record<Range, readonly Kpi[]> = {
  '4h': [
    {
      label: 'Requests',
      value: '248.6K',
      delta: { value: 8.4, unit: '%', goodWhen: 'up' },
      spark: [42, 48, 45, 56, 52, 61, 68],
    },
    {
      label: 'Errors',
      value: '212',
      delta: { value: -22.1, unit: '%', goodWhen: 'down' },
      spark: [38, 32, 35, 26, 22, 18, 14],
    },
    {
      label: 'P95 latency',
      value: '184 ms',
      delta: { value: -6.3, unit: '%', goodWhen: 'down' },
      spark: [52, 49, 50, 46, 44, 45, 41],
    },
    {
      label: 'Compute',
      value: '96.4 GB-s',
      delta: { value: 3.1, unit: '%', goodWhen: 'down' },
      spark: [30, 32, 31, 35, 34, 37, 39],
    },
  ],
  '24h': [
    {
      label: 'Requests',
      value: '1.42M',
      delta: { value: 11.9, unit: '%', goodWhen: 'up' },
      spark: [36, 44, 41, 52, 49, 58, 66],
    },
    {
      label: 'Errors',
      value: '1,894',
      delta: { value: -9.6, unit: '%', goodWhen: 'down' },
      spark: [44, 40, 42, 36, 33, 30, 27],
    },
    {
      label: 'P95 latency',
      value: '201 ms',
      delta: { value: -2.4, unit: '%', goodWhen: 'down' },
      spark: [55, 53, 54, 51, 50, 49, 48],
    },
    {
      label: 'Compute',
      value: '612 GB-s',
      delta: { value: 5.8, unit: '%', goodWhen: 'down' },
      spark: [26, 29, 28, 33, 32, 36, 40],
    },
  ],
  '7d': [
    {
      label: 'Requests',
      value: '9.81M',
      delta: { value: 19.2, unit: '%', goodWhen: 'up' },
      spark: [28, 36, 33, 46, 42, 55, 64],
    },
    {
      label: 'Errors',
      value: '11.2K',
      delta: { value: -14.8, unit: '%', goodWhen: 'down' },
      spark: [52, 46, 49, 40, 36, 31, 26],
    },
    {
      label: 'P95 latency',
      value: '196 ms',
      delta: { value: -4.1, unit: '%', goodWhen: 'down' },
      spark: [58, 55, 56, 52, 50, 48, 46],
    },
    {
      label: 'Compute',
      value: '4.1 TB-s',
      delta: { value: 9.4, unit: '%', goodWhen: 'down' },
      spark: [22, 26, 25, 31, 30, 35, 41],
    },
  ],
};

const CACHE_SERIES = [88, 91, 90, 93, 92, 95, 96];
const DURATION_SERIES = [31, 28, 29, 26, 27, 24, 23];

const P95_TARGET_MS = 200;

/** `overTarget` is measured against the stated target, not eyeballed. */
const LATENCY = [
  { label: 'P50', ms: 92, pct: 28 },
  { label: 'P95', ms: 184, pct: 58 },
  { label: 'P99', ms: 412, pct: 86 },
].map((row) => ({ ...row, overTarget: row.ms > P95_TARGET_MS }));

interface Deploy {
  version: string;
  env: string;
  branch: string;
  message: string;
  date: string;
  status: 'live' | 'stable' | 'canary';
  cache: 'warm' | 'cold';
}

const DEPLOYS: readonly Deploy[] = [
  {
    version: 'v4.2.1',
    env: 'Production',
    branch: 'main',
    message: 'Tighten cache key normalization for query params',
    date: 'Jun 9',
    status: 'live',
    cache: 'warm',
  },
  {
    version: 'v4.2.0',
    env: 'Production',
    branch: 'release/4.2',
    message: 'Retry webhook delivery with jittered backoff',
    date: 'Jun 7',
    status: 'stable',
    cache: 'warm',
  },
  {
    version: 'v4.3.0-rc.2',
    env: 'Staging',
    branch: 'release/4.3',
    message: 'Stream build logs over server-sent events',
    date: 'Jun 6',
    status: 'canary',
    cache: 'cold',
  },
  {
    version: 'v5.0.0-alpha.1',
    env: 'Preview',
    branch: 'next/isolates',
    message: 'Spike: per-request sandbox isolation',
    date: 'Jun 2',
    status: 'stable',
    cache: 'cold',
  },
];

/**
 * `--accent-cool` is the reserved live/active tone in this theme, so the
 * deployment actually taking traffic gets it. Canary is a warning, and
 * stable is simply not noteworthy.
 */
const STATUS_META: Record<Deploy['status'], { label: string; dot: string; pulse: boolean }> = {
  live: { label: 'Live', dot: 'bg-accent-cool', pulse: true },
  stable: { label: 'Stable', dot: 'bg-muted-foreground/50', pulse: false },
  canary: { label: 'Canary', dot: 'bg-warning', pulse: true },
};

const UNIT_WORD: Record<Delta['unit'], string> = {
  '%': 'percent',
  pp: 'percentage points',
};

const DeltaChip = ({ delta, label }: { delta: Delta; label: string }) => {
  const { value, unit, goodWhen } = delta;
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  const direction = value > 0 ? 'up' : value < 0 ? 'down' : 'unchanged';
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  const tone =
    value === 0
      ? 'bg-accent text-muted-foreground'
      : value > 0 === (goodWhen === 'up')
        ? 'bg-success/10 text-success'
        : 'bg-destructive/10 text-destructive';

  return (
    <span
      dir="ltr"
      aria-label={`${label} ${direction} ${Math.abs(value)} ${UNIT_WORD[unit]}`}
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[11px] leading-none tabular-nums',
        tone,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {sign}
      {Math.abs(value)}
      {unit}
    </span>
  );
};

const StatusBadge = ({ status }: { status: Deploy['status'] }) => {
  const meta = STATUS_META[status];
  return (
    <Badge variant="outline" className="w-fit gap-1.5 font-normal text-muted-foreground">
      <span aria-hidden className="relative flex size-2">
        {meta.pulse && (
          <span
            className={cn('absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping', meta.dot)}
          />
        )}
        <span className={cn('relative inline-flex size-2 rounded-full', meta.dot)} />
      </span>
      {meta.label}
    </Badge>
  );
};

const Spark = ({ points, className }: { points: readonly number[]; className?: string }) => {
  const height = 32;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = points.length > 1 ? 100 / (points.length - 1) : 100;
  const line = points
    .map(
      (v, i) =>
        `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)} ${(height - 3 - ((v - min) / span) * (height - 8)).toFixed(1)}`,
    )
    .join(' ');

  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden className={cn('w-full', className)}>
      <path d={`${line} L100 ${height} L0 ${height} Z`} className="fill-foreground/6" />
      <path d={line} fill="none" vectorEffect="non-scaling-stroke" strokeWidth="1.5" className="stroke-foreground/60" />
    </svg>
  );
};

const CellLabel = ({ children }: { children: React.ReactNode }) => {
  return <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{children}</span>;
};

const Dashboard05 = () => {
  const [range, setRange] = React.useState<Range>('4h');
  const kpis = KPIS_BY_RANGE[range];

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
          <div className="flex flex-col gap-4 bg-card p-5 sm:flex-row sm:items-center sm:justify-between md:col-span-4">
            <div className="flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <MoonStar className="size-3.5" aria-hidden />
                good evening
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight">All systems steady.</h2>
            </div>
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger size="sm" className="w-[150px]" aria-label="Time range">
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
            <div key={k.label} className="flex flex-col justify-between gap-3 bg-card p-5">
              <div className="flex flex-col gap-2">
                <CellLabel>{k.label}</CellLabel>
                <div className="flex items-end justify-between gap-2">
                  <span className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">{k.value}</span>
                  <DeltaChip delta={k.delta} label={k.label} />
                </div>
              </div>
              <Spark points={k.spark} className="h-10" />
            </div>
          ))}

          <div className="flex flex-col gap-3 bg-card p-5 md:col-span-2">
            <CellLabel>Edge cache hit rate</CellLabel>
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">96.2%</span>
              <DeltaChip delta={{ value: 1.8, unit: 'pp', goodWhen: 'up' }} label="Edge cache hit rate" />
            </div>
            <Spark points={CACHE_SERIES} className="h-16" />
          </div>

          <div className="flex flex-col gap-3 bg-card p-5 md:col-span-2">
            <CellLabel>Avg. request duration</CellLabel>
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">23.4 ms</span>
              <DeltaChip delta={{ value: -6.3, unit: '%', goodWhen: 'down' }} label="Average request duration" />
            </div>
            <Spark points={DURATION_SERIES} className="h-16" />
          </div>

          <div className="flex flex-col justify-between gap-5 bg-card p-5 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <Sparkles className="size-3.5" aria-hidden />
                insight
              </span>
              <Button variant="outline" size="sm">
                View traces
              </Button>
            </div>
            <p className="max-w-md text-lg leading-snug font-medium tracking-[-0.01em] sm:text-xl">
              Cold starts dropped 21% this window after the v4.2.1 cache changes rolled out.
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Generated from 248K spans · confidence high
            </span>
          </div>

          <div className="flex flex-col gap-4 bg-card p-5 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Latency distribution
                <Badge variant="outline" className="font-mono text-[10px] uppercase tabular-nums">
                  p95 target · {P95_TARGET_MS}ms
                </Badge>
              </span>
              <Button variant="link" size="sm" className="h-auto p-0" render={<a href="#" />} nativeButton={false}>
                Open metrics
              </Button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-3">
              {LATENCY.map((row) => (
                <li key={row.label} className="flex items-center gap-3">
                  <span className="w-8 shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {row.label}
                  </span>
                  <div aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-accent">
                    <div
                      className={cn('h-full rounded-full', row.overTarget ? 'bg-warning/70' : 'bg-foreground/70')}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      'w-14 shrink-0 text-end font-mono text-xs tabular-nums',
                      row.overTarget && 'text-warning',
                    )}
                  >
                    {row.ms} ms
                    {row.overTarget && <span className="sr-only">, over target</span>}
                  </span>
                </li>
              ))}
            </ul>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Sampled across all regions
            </span>
          </div>

          <div className="flex flex-col bg-card md:col-span-4">
            <div className="flex items-center justify-between gap-2 p-5 pb-3">
              <CellLabel>Active deployments</CellLabel>
              <Button variant="link" size="sm" className="h-auto p-0" render={<a href="#" />} nativeButton={false}>
                View all
              </Button>
            </div>
            <ul className="flex flex-col">
              {DEPLOYS.map((d, i) => (
                <li
                  key={d.version}
                  className={cn(
                    'grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3 md:grid-cols-[140px_110px_1fr_70px_70px]',
                    i < DEPLOYS.length - 1 && 'border-b border-border',
                  )}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-mono text-xs font-medium">{d.version}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                      {d.env}
                    </span>
                  </div>
                  <div className="justify-self-end md:justify-self-start">
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="col-span-2 flex min-w-0 flex-col md:col-span-1">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                      <GitBranch className="size-3" aria-hidden />
                      {d.branch}
                    </span>
                    <span className="truncate text-xs text-foreground">{d.message}</span>
                  </div>
                  <span className="hidden font-mono text-xs tabular-nums text-muted-foreground md:inline">
                    {d.date}
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground md:inline">
                    {d.cache} cache
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard05;
