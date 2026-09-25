'use client';

import * as React from 'react';
import { Plus, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/registry/hirael/bases/base/components/animated-number';
import {
  Sparkline,
  SparklineArea,
  SparklineDot,
  SparklineLine,
} from '@/registry/hirael/bases/base/components/sparkline';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

// Integer hash instead of Math.random so server and client render the same numbers.
const noise = (seed: number) => {
  let t = Math.imul(seed + 1, 2654435761) >>> 0;
  t ^= t >>> 15;
  t = Math.imul(t, 2246822519) >>> 0;
  t ^= t >>> 13;

  return (t >>> 0) / 4294967296;
};

type Range = '7d' | '30d' | '90d';
type SegmentId = 'all' | 'new' | 'returning' | 'mobile' | 'desktop' | 'search';

const RANGES: Record<Range, { days: number; label: string }> = {
  '7d': { days: 7, label: 'Last 7 days' },
  '30d': { days: 30, label: 'Last 30 days' },
  '90d': { days: 90, label: 'Last 90 days' },
};

interface Segment {
  id: SegmentId;
  label: string;
  description: string;
  share: number;
  seed: number;
  rates: { signup: number; activate: number; pay: number };
  bounce: number;
  /** Median session length in seconds. */
  session: number;
}

const SEGMENTS: readonly Segment[] = [
  {
    id: 'all',
    label: 'All visitors',
    description: 'Every session on the marketing site and the app.',
    share: 1,
    seed: 3,
    rates: { signup: 0.062, activate: 0.54, pay: 0.21 },
    bounce: 41,
    session: 154,
  },
  {
    id: 'new',
    label: 'New',
    description: 'People on their first visit in the last 12 months.',
    share: 0.64,
    seed: 17,
    rates: { signup: 0.071, activate: 0.49, pay: 0.17 },
    bounce: 48,
    session: 118,
  },
  {
    id: 'returning',
    label: 'Returning',
    description: 'People who visited before, signed in or not.',
    share: 0.36,
    seed: 29,
    rates: { signup: 0.043, activate: 0.68, pay: 0.31 },
    bounce: 28,
    session: 221,
  },
  {
    id: 'mobile',
    label: 'Mobile',
    description: 'Phones and small tablets.',
    share: 0.47,
    seed: 41,
    rates: { signup: 0.041, activate: 0.45, pay: 0.14 },
    bounce: 52,
    session: 97,
  },
  {
    id: 'desktop',
    label: 'Desktop',
    description: 'Laptops, desktops and large tablets.',
    share: 0.53,
    seed: 53,
    rates: { signup: 0.078, activate: 0.59, pay: 0.25 },
    bounce: 33,
    session: 203,
  },
  {
    id: 'search',
    label: 'From search',
    description: 'Sessions that started on a search engine result.',
    share: 0.41,
    seed: 67,
    rates: { signup: 0.066, activate: 0.52, pay: 0.22 },
    bounce: 44,
    session: 139,
  },
];

const segmentById = (id: SegmentId) => SEGMENTS.find((segment) => segment.id === id) ?? SEGMENTS[0];

const HISTORY = 180;

// Two 90-day windows so every range has a previous period to compare against.
const BASE_DAILY = Array.from({ length: HISTORY }, (_, day) => {
  const weekday = day % 7;
  const weekend = weekday === 5 || weekday === 6 ? 0.84 : 1;
  const growth = 1 + day * 0.0021;

  return 5200 * weekend * growth;
});

const dailyVisitors = (segment: Segment) =>
  BASE_DAILY.map((value, day) => Math.round(value * segment.share * (0.93 + 0.14 * noise(segment.seed * 1000 + day))));

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

const REGIONS = [
  { name: 'United States', share: 0.34 },
  { name: 'Germany', share: 0.12 },
  { name: 'United Kingdom', share: 0.1 },
  { name: 'India', share: 0.09 },
  { name: 'Brazil', share: 0.06 },
  { name: 'Japan', share: 0.05 },
] as const;

const LAST_DAY = Date.UTC(2026, 8, 23);
const DAY_MS = 86_400_000;
const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const integer = new Intl.NumberFormat('en-US');

const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`;

interface View {
  range: Range;
  segment: SegmentId;
}

const useAnalytics = ({ range, segment: segmentId }: View) => {
  const segment = segmentById(segmentId);
  const history = React.useMemo(() => dailyVisitors(segment), [segment]);

  return React.useMemo(() => {
    const days = RANGES[range].days;
    const series = history.slice(HISTORY - days);
    const visitors = sum(series);
    const previous = sum(history.slice(HISTORY - days * 2, HISTORY - days));

    const signedUp = Math.round(visitors * segment.rates.signup);
    const activated = Math.round(signedUp * segment.rates.activate);
    const paid = Math.round(activated * segment.rates.pay);

    const regionCounts = REGIONS.map((region, index) => ({
      name: region.name,
      count: Math.round(visitors * region.share * (0.8 + 0.4 * noise(segment.seed * 31 + index))),
    })).sort((a, b) => b.count - a.count);
    const other = visitors - sum(regionCounts.map((region) => region.count));

    return {
      segment,
      series,
      visitors,
      change: ((visitors - previous) / previous) * 100,
      funnel: [
        { label: 'Visited', count: visitors },
        { label: 'Signed up', count: signedUp },
        { label: 'Activated', count: activated },
        { label: 'Paid', count: paid },
      ],
      regions: [...regionCounts, { name: 'Other', count: other }],
      firstDay: dayFormat.format(new Date(LAST_DAY - (days - 1) * DAY_MS)),
      lastDay: dayFormat.format(new Date(LAST_DAY)),
    };
  }, [history, range, segment]);
};

type Analytics = ReturnType<typeof useAnalytics>;

interface TileProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const Tile = ({ title, description, action, className, children, ...props }: TileProps) => {
  return (
    <article
      data-slot="bento-tile"
      className={cn('flex min-w-0 flex-col gap-6 bg-background p-6', className)}
      {...props}
    >
      <div data-slot="bento-tile-header" className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-medium">{title}</h3>
          {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      <div data-slot="bento-tile-body" className="flex flex-1 flex-col">
        {children}
      </div>
    </article>
  );
};

interface MetricTileProps extends Omit<TileProps, 'title' | 'description' | 'action' | 'children'> {
  data: Analytics;
  range: Range;
  onRangeChange: (range: Range) => void;
}

const MetricTile = ({ data, range, onRangeChange, ...props }: MetricTileProps) => {
  const up = data.change >= 0;

  return (
    <Tile
      data-slot="metric"
      title="Visitors"
      description={data.segment.description}
      action={
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[range]}
          onValueChange={([next]) => {
            if (next) onRangeChange(next as Range);
          }}
          aria-label="Date range"
        >
          <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d">30d</ToggleGroupItem>
          <ToggleGroupItem value="90d">90d</ToggleGroupItem>
        </ToggleGroup>
      }
      {...props}
    >
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="text-5xl font-medium tracking-tight sm:text-6xl">
            <AnimatedNumber value={data.visitors} duration={600} />
          </span>
          <span className="flex flex-col pb-1.5 text-sm">
            <span className={cn('tabular-nums', up ? 'text-success' : 'text-destructive')}>
              {up ? '+' : ''}
              {data.change.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs previous {RANGES[range].days} days</span>
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Sparkline
            data={data.series}
            variant={range === '7d' ? 'bar' : 'area'}
            curve
            min={0}
            label={`${data.segment.label}, ${RANGES[range].label}: ${integer.format(data.visitors)} visitors`}
            className="h-48 w-full sm:h-56"
          >
            {range === '7d' ? null : (
              <>
                <SparklineArea fillOpacity={0.08} />
                <SparklineLine />
                <SparklineDot />
              </>
            )}
          </Sparkline>
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>{data.firstDay}</span>
            <span>{data.lastDay}</span>
          </div>
        </div>

        <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">Daily average</dt>
            <dd className="text-lg font-medium">
              <AnimatedNumber value={Math.round(data.visitors / RANGES[range].days)} duration={500} />
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">Bounce rate</dt>
            <dd className="text-lg font-medium">
              <AnimatedNumber value={data.segment.bounce} suffix="%" duration={500} />
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">Median session</dt>
            <dd key={data.segment.id} className={cn(SWAP, 'text-lg font-medium tabular-nums')}>
              {formatDuration(data.segment.session)}
            </dd>
          </div>
        </dl>
      </div>
    </Tile>
  );
};

interface SegmentTileProps extends Omit<TileProps, 'title' | 'description' | 'action' | 'children'> {
  segment: SegmentId;
  onSegmentChange: (segment: SegmentId) => void;
}

const SegmentTile = ({ segment, onSegmentChange, ...props }: SegmentTileProps) => {
  const current = segmentById(segment);

  return (
    <Tile data-slot="segments" title="Segments" description="Filter every panel to one group of people." {...props}>
      <div className="flex flex-col gap-4">
        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={2}
          value={[segment]}
          onValueChange={([next]) => {
            if (next) onSegmentChange(next as SegmentId);
          }}
          aria-label="Segment"
          className="flex-wrap"
        >
          {SEGMENTS.map((s) => (
            <ToggleGroupItem key={s.id} value={s.id}>
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-3 text-sm">
          <span aria-hidden className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-primary transition-transform duration-500 ease-out ltr:origin-left rtl:origin-right"
              style={{ transform: `scaleX(${current.share})` }}
            />
          </span>
          <span className="shrink-0 text-muted-foreground">
            <AnimatedNumber value={current.share * 100} startValue={100} suffix="% of traffic" duration={400} />
          </span>
        </div>
      </div>
    </Tile>
  );
};

type FunnelTileProps = Omit<TileProps, 'title' | 'description' | 'action' | 'children'> & { data: Analytics };

const FunnelTile = ({ data, ...props }: FunnelTileProps) => {
  return (
    <Tile data-slot="funnel" title="Funnel" description="How many make it to each step." {...props}>
      <ol className="flex flex-col gap-4">
        {data.funnel.map((step, index) => {
          const previous = index === 0 ? step.count : data.funnel[index - 1].count;
          const rate = previous === 0 ? 0 : step.count / previous;

          return (
            <li key={step.label} className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span>{step.label}</span>
                <span className="flex items-baseline gap-2">
                  <span className="font-medium">
                    <AnimatedNumber value={step.count} duration={500} />
                  </span>
                  {index > 0 ? (
                    <span className="w-12 text-end text-xs text-muted-foreground tabular-nums">
                      {(rate * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="w-12" />
                  )}
                </span>
              </div>
              <span aria-hidden className="h-1.5 overflow-hidden rounded-full bg-muted">
                <span
                  className={cn(
                    'block h-full rounded-full transition-transform duration-500 ease-out ltr:origin-left rtl:origin-right',
                    index === data.funnel.length - 1 ? 'bg-primary' : 'bg-muted-foreground/60',
                  )}
                  style={{ transform: `scaleX(${rate})` }}
                />
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-auto pt-4 text-xs text-muted-foreground">Bars show the share kept from the step before.</p>
    </Tile>
  );
};

type RegionTileProps = Omit<TileProps, 'title' | 'description' | 'action' | 'children'> & { data: Analytics };

const RegionTile = ({ data, ...props }: RegionTileProps) => {
  // Other is a remainder, not a country, so it doesn't set the scale.
  const max = Math.max(...data.regions.filter((region) => region.name !== 'Other').map((region) => region.count));

  return (
    <Tile data-slot="regions" title="Where they are" description="Visitors by country for the current view." {...props}>
      <ul className="flex flex-col gap-2.5">
        {data.regions.map((region) => {
          const other = region.name === 'Other';

          return (
            <li
              key={region.name}
              className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[7.5rem_1fr_auto]"
            >
              <span className={cn('truncate', other && 'text-muted-foreground')}>{region.name}</span>
              <span aria-hidden className={cn('h-1.5 overflow-hidden rounded-full', !other && 'bg-muted')}>
                <span
                  className="block h-full rounded-full bg-muted-foreground/60 transition-transform duration-500 ease-out ltr:origin-left rtl:origin-right"
                  style={{ transform: `scaleX(${other ? 0 : region.count / max})` }}
                />
              </span>
              <span className="flex w-24 items-baseline justify-end gap-2">
                <AnimatedNumber value={region.count} duration={500} />
                <span className="w-9 text-end text-xs text-muted-foreground tabular-nums">
                  {Math.round((region.count / data.visitors) * 100)}%
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </Tile>
  );
};

interface Report extends View {
  id: string;
  name: string;
  owner: string;
  pinned: boolean;
}

const INITIAL_REPORTS: readonly Report[] = [
  { id: 'r1', name: 'Mobile, last 30 days', owner: 'Priya Nair', range: '30d', segment: 'mobile', pinned: true },
  { id: 'r2', name: 'Search traffic this week', owner: 'Leo Brandt', range: '7d', segment: 'search', pinned: false },
  { id: 'r3', name: 'Returning, this quarter', owner: 'You', range: '90d', segment: 'returning', pinned: false },
  { id: 'r4', name: 'New visitor funnel', owner: 'Priya Nair', range: '30d', segment: 'new', pinned: false },
];

interface ReportsTileProps extends Omit<TileProps, 'title' | 'description' | 'action' | 'children'> {
  view: View;
  onOpen: (view: View) => void;
}

const ReportsTile = ({ view, onOpen, ...props }: ReportsTileProps) => {
  const [reports, setReports] = React.useState<readonly Report[]>(INITIAL_REPORTS);
  const sorted = [...reports].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  const saved = reports.some((report) => report.range === view.range && report.segment === view.segment);

  const save = () =>
    setReports((list) => [
      ...list,
      {
        id: `r${list.length + 1}`,
        name: `${segmentById(view.segment).label}, ${RANGES[view.range].label.toLowerCase()}`,
        owner: 'You',
        range: view.range,
        segment: view.segment,
        pinned: false,
      },
    ]);

  return (
    <Tile
      data-slot="saved-reports"
      title="Saved reports"
      description="Open one to load its segment and range."
      action={
        <Button variant="outline" size="sm" onClick={save} disabled={saved}>
          <Plus aria-hidden />
          {saved ? 'Saved' : 'Save view'}
        </Button>
      }
      {...props}
    >
      <ul className="-mx-2 flex flex-col">
        {sorted.map((report) => {
          const active = report.range === view.range && report.segment === view.segment;

          return (
            <li
              key={report.id}
              className={cn(
                Number(report.id.slice(1)) > INITIAL_REPORTS.length && SWAP,
                'flex items-center gap-1 rounded-md transition-colors duration-150',
                active && 'bg-muted',
              )}
            >
              <button
                type="button"
                aria-current={active || undefined}
                onClick={() => onOpen({ range: report.range, segment: report.segment })}
                className="flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-md px-2 py-2 text-start text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className={cn('truncate', active && 'font-medium')}>{report.name}</span>
                <span className="text-xs text-muted-foreground">
                  {report.owner}, {RANGES[report.range].label.toLowerCase()}
                </span>
              </button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-pressed={report.pinned}
                aria-label={report.pinned ? `Unpin ${report.name}` : `Pin ${report.name}`}
                onClick={() =>
                  setReports((list) => list.map((r) => (r.id === report.id ? { ...r, pinned: !r.pinned } : r)))
                }
                className="me-1"
              >
                <Star aria-hidden className={cn(report.pinned && 'fill-current text-primary')} />
              </Button>
            </li>
          );
        })}
      </ul>
    </Tile>
  );
};

const Bento03 = () => {
  const [view, setView] = React.useState<View>({ range: '30d', segment: 'all' });
  const data = useAnalytics(view);

  return (
    <section data-slot="bento" className="bg-background px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header data-slot="bento-header" className="flex max-w-2xl flex-col gap-4">
          <h2
            className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight text-balance md:text-4xl lg:text-5xl')}
          >
            See who visits and where they drop off
          </h2>
          <p style={stagger(1)} className={cn(ENTER, 'text-base text-pretty text-muted-foreground md:text-lg')}>
            Pick a segment, a range or a saved report. Every panel answers from the same numbers, so they always add up.
          </p>
        </header>

        <div
          data-slot="bento-grid"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-6 lg:grid-cols-12"
        >
          <MetricTile
            data={data}
            range={view.range}
            onRangeChange={(range) => setView((v) => ({ ...v, range }))}
            style={stagger(0, 70, 150)}
            className={cn(ENTER, 'md:col-span-6 lg:col-span-8 lg:row-span-2')}
          />
          <SegmentTile
            segment={view.segment}
            onSegmentChange={(segment) => setView((v) => ({ ...v, segment }))}
            style={stagger(1, 70, 150)}
            className={cn(ENTER, 'md:col-span-3 lg:col-span-4')}
          />
          <FunnelTile data={data} style={stagger(2, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-4')} />
          <RegionTile data={data} style={stagger(3, 70, 150)} className={cn(ENTER, 'md:col-span-3 lg:col-span-6')} />
          <ReportsTile
            view={view}
            onOpen={setView}
            style={stagger(4, 70, 150)}
            className={cn(ENTER, 'md:col-span-3 lg:col-span-6')}
          />
        </div>
      </div>
    </section>
  );
};

export default Bento03;
