'use client';

import * as React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock4,
  CreditCard,
  Minus,
  Package,
  RotateCcw,
  Rows3,
  ShoppingCart,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/registry/hirael/bases/base/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';

/**
 * One delta, one source of truth. The sign gives the direction, `goodWhen`
 * gives the intent, and both the colour and the spoken label come from those
 * two fields, so a falling refund rate can never render as bad news.
 */
interface Delta {
  value: number;
  unit: '%' | 'pp';
  goodWhen: 'up' | 'down';
}

interface Stat {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: Delta;
}

const STATS: readonly Stat[] = [
  {
    icon: ShoppingCart,
    label: 'Open orders',
    value: '36',
    delta: { value: 12.5, unit: '%', goodWhen: 'up' },
  },
  {
    icon: Package,
    label: 'Items sold',
    value: '1,482',
    delta: { value: 6.8, unit: '%', goodWhen: 'up' },
  },
  {
    icon: Users,
    label: 'Store sessions',
    value: '9,214',
    delta: { value: 4.1, unit: '%', goodWhen: 'up' },
  },
  {
    icon: RotateCcw,
    label: 'Refund rate',
    value: '0.8%',
    delta: { value: -0.2, unit: 'pp', goodWhen: 'down' },
  },
];

/** Revenue every two hours, so the ticks and the data table share one source. */
const HOURLY: readonly { hour: string; today: number; yesterday: number }[] = [
  { hour: '00', today: 12, yesterday: 10 },
  { hour: '02', today: 9, yesterday: 8 },
  { hour: '04', today: 14, yesterday: 11 },
  { hour: '06', today: 24, yesterday: 19 },
  { hour: '08', today: 46, yesterday: 39 },
  { hour: '10', today: 74, yesterday: 61 },
  { hour: '12', today: 92, yesterday: 78 },
  { hour: '14', today: 84, yesterday: 73 },
  { hour: '16', today: 102, yesterday: 84 },
  { hour: '18', today: 96, yesterday: 80 },
  { hour: '20', today: 71, yesterday: 64 },
  { hour: '22', today: 48, yesterday: 41 },
  { hour: '24', today: 31, yesterday: 26 },
];

const REVENUE = {
  today: 1284.5,
  yesterday: 1092.2,
  delta: { value: 17.6, unit: '%', goodWhen: 'up' } satisfies Delta,
};

/** `peak` is a fact about the hour, not a brightness threshold in the markup. */
const PEAK_HOURS: readonly { hour: string; orders: number; peak?: boolean }[] = [
  { hour: '07', orders: 14 },
  { hour: '08', orders: 18 },
  { hour: '09', orders: 26 },
  { hour: '10', orders: 41 },
  { hour: '11', orders: 58 },
  { hour: '12', orders: 92, peak: true },
  { hour: '13', orders: 100, peak: true },
  { hour: '14', orders: 86, peak: true },
  { hour: '15', orders: 54 },
  { hour: '16', orders: 38 },
  { hour: '17', orders: 27 },
  { hour: '18', orders: 19 },
];

type WeekRange = 'this' | 'last';

interface WeekData {
  orders: {
    value: string;
    delta: Delta;
    days: readonly { day: string; orders: number }[];
  };
  minis: readonly {
    label: string;
    value: string;
    delta: Delta;
    spark: readonly number[];
  }[];
}

const WEEK: Record<WeekRange, WeekData> = {
  this: {
    orders: {
      value: '1,318',
      delta: { value: 11.2, unit: '%', goodWhen: 'up' },
      days: [
        { day: 'Mon', orders: 148 },
        { day: 'Tue', orders: 176 },
        { day: 'Wed', orders: 162 },
        { day: 'Thu', orders: 196 },
        { day: 'Fri', orders: 228 },
        { day: 'Sat', orders: 184 },
        { day: 'Sun', orders: 224 },
      ],
    },
    minis: [
      {
        label: 'Gross revenue',
        value: '$24,820',
        delta: { value: 9.2, unit: '%', goodWhen: 'up' },
        spark: [30, 34, 31, 38, 44, 41, 48],
      },
      {
        label: 'Returning buyers',
        value: '58.4%',
        delta: { value: 1.9, unit: 'pp', goodWhen: 'up' },
        spark: [52, 54, 53, 55, 56, 57, 58],
      },
      {
        label: 'Checkout conversion',
        value: '3.1%',
        delta: { value: 0.4, unit: 'pp', goodWhen: 'up' },
        spark: [2.5, 2.7, 2.6, 2.9, 3.0, 2.9, 3.1],
      },
    ],
  },
  last: {
    orders: {
      value: '1,186',
      delta: { value: 4.6, unit: '%', goodWhen: 'up' },
      days: [
        { day: 'Mon', orders: 132 },
        { day: 'Tue', orders: 158 },
        { day: 'Wed', orders: 149 },
        { day: 'Thu', orders: 171 },
        { day: 'Fri', orders: 198 },
        { day: 'Sat', orders: 166 },
        { day: 'Sun', orders: 212 },
      ],
    },
    minis: [
      {
        label: 'Gross revenue',
        value: '$22,730',
        delta: { value: 5.8, unit: '%', goodWhen: 'up' },
        spark: [27, 30, 28, 33, 37, 35, 41],
      },
      {
        label: 'Returning buyers',
        value: '56.5%',
        delta: { value: -0.3, unit: 'pp', goodWhen: 'up' },
        spark: [57, 56, 57, 56, 55, 56, 56],
      },
      {
        label: 'Checkout conversion',
        value: '2.7%',
        delta: { value: 0.1, unit: 'pp', goodWhen: 'up' },
        spark: [2.4, 2.5, 2.4, 2.6, 2.7, 2.6, 2.7],
      },
    ],
  },
};

const BUDGET = { spent: 223.1, cap: 400 };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

/** Density is read from the section, so every panel tightens without prop drilling. */
const DENSE_GAP = 'group-data-[density=compact]/dashboard:gap-2.5';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const UNIT_WORD: Record<Delta['unit'], string> = {
  '%': 'percent',
  pp: 'percentage points',
};

const linePath = (values: readonly number[], max: number, h: number) => {
  const step = values.length > 1 ? 100 / (values.length - 1) : 100;
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(2)} ${(h - 2 - (v / max) * (h - 6)).toFixed(2)}`)
    .join(' ');
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
        'inline-flex w-fit items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs leading-none tabular-nums',
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

const PanelCard = ({
  icon: Icon,
  label,
  action,
  children,
  className,
}: {
  icon: LucideIcon;
  label: string;
  /** Only pass an action when there is one. An empty menu is not a feature. */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card data-slot="dashboard-panel" size="sm" className={className}>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-1.5 text-xs font-normal uppercase text-muted-foreground">
            <Icon className="size-3.5" aria-hidden />
            {label}
          </span>
        </CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col rounded-sm border border-border bg-background p-4 transition-[padding] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[density=compact]/dashboard:p-3 motion-reduce:transition-none">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

const Sparkline = ({ points }: { points: readonly number[] }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = points.length > 1 ? 100 / (points.length - 1) : 100;
  const pts = points.map((v, i) => `${(i * step).toFixed(1)},${(22 - ((v - min) / span) * 16).toFixed(1)}`).join(' ');

  return (
    <svg
      viewBox="0 0 100 26"
      preserveAspectRatio="none"
      aria-hidden
      className="mt-3 h-12 w-full animate-in fade-in duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none"
    >
      <polyline
        points={pts}
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeWidth="1.5"
        className="stroke-foreground/45"
      />
    </svg>
  );
};

const Dashboard04 = () => {
  const [range, setRange] = React.useState<WeekRange>('this');
  const [compact, setCompact] = React.useState(false);
  const week = WEEK[range];

  const chartMax = Math.max(...HOURLY.flatMap((h) => [h.today, h.yesterday]));
  const todayLine = linePath(
    HOURLY.map((h) => h.today),
    chartMax,
    46,
  );
  const yesterdayLine = linePath(
    HOURLY.map((h) => h.yesterday),
    chartMax,
    46,
  );
  const barMax = Math.max(...week.orders.days.map((d) => d.orders));
  const peakMax = Math.max(...PEAK_HOURS.map((h) => h.orders));
  const budgetPct = Math.round((BUDGET.spent / BUDGET.cap) * 100);
  const peakWindow = PEAK_HOURS.filter((h) => h.peak);

  return (
    <section
      data-slot="dashboard"
      data-density={compact ? 'compact' : 'comfortable'}
      className="group/dashboard bg-background py-20 sm:py-28"
    >
      <div className="container flex w-full flex-col gap-8 group-data-[density=compact]/dashboard:gap-6">
        <div
          data-slot="dashboard-header"
          className={cn(ENTER, 'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between')}
        >
          <div className="flex max-w-xl flex-col gap-3">
            <span className="text-xs uppercase text-muted-foreground">Storefront</span>
            <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Today at the counter.</h2>
          </div>
          <Button
            variant={compact ? 'secondary' : 'outline'}
            size="sm"
            aria-pressed={compact}
            onClick={() => setCompact((value) => !value)}
          >
            <Rows3 className="size-3.5" aria-hidden />
            Compact view
          </Button>
        </div>

        <div
          data-slot="dashboard-stats"
          style={stagger(1)}
          className={cn(ENTER, 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4', DENSE_GAP)}
        >
          {STATS.map((s) => (
            <PanelCard key={s.label} icon={s.icon} label={s.label}>
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">{s.value}</span>
                <div className="flex items-center gap-1.5">
                  <DeltaChip delta={s.delta} label={s.label} />
                  <span className="text-xs uppercase text-muted-foreground">vs yesterday</span>
                </div>
              </div>
            </PanelCard>
          ))}
        </div>

        <div data-slot="dashboard-today" style={stagger(2)} className={cn(ENTER, 'flex flex-col gap-4', DENSE_GAP)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-[-0.02em]">Today</h3>
            <span className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
              <span>Store time</span>
              <span aria-hidden className="text-border">
                |
              </span>
              <span>Resets 00:00 UTC</span>
            </span>
          </div>

          <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-5', DENSE_GAP)}>
            <PanelCard icon={CreditCard} label="Gross revenue" className="lg:col-span-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase text-muted-foreground">
                      <span aria-hidden className="size-2 rounded-xs bg-foreground/85" />
                      Today
                    </span>
                    <span className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
                      {usd.format(REVENUE.today)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase text-muted-foreground">
                      <span aria-hidden className="size-2 rounded-xs bg-muted-foreground/45" />
                      Yesterday
                    </span>
                    <span className="text-xl font-semibold tracking-[-0.02em] tabular-nums text-muted-foreground">
                      {usd.format(REVENUE.yesterday)}
                    </span>
                  </div>
                </div>
                <DeltaChip delta={REVENUE.delta} label="Gross revenue" />
              </div>
              <div className="mt-4 flex flex-1 flex-col justify-end">
                <svg
                  viewBox="0 0 100 46"
                  preserveAspectRatio="none"
                  aria-hidden
                  className="h-44 w-full transition-[height] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[density=compact]/dashboard:h-32 sm:h-56 sm:group-data-[density=compact]/dashboard:h-40 motion-reduce:transition-none"
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
                  <path d={`${todayLine} L100 46 L0 46 Z`} className="fill-foreground/8" />
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
                <div aria-hidden className="mt-2 flex justify-between">
                  {HOURLY.filter((_, i) => i % 2 === 0).map((h) => (
                    <span key={h.hour} className="text-xs uppercase tabular-nums text-muted-foreground">
                      {h.hour}
                    </span>
                  ))}
                </div>

                {/* The chart is pixels; this is the same data as text. */}
                <table className="sr-only">
                  <caption>Revenue by hour, today versus yesterday</caption>
                  <thead>
                    <tr>
                      <th scope="col">Hour</th>
                      <th scope="col">Today</th>
                      <th scope="col">Yesterday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HOURLY.map((h) => (
                      <tr key={h.hour}>
                        <th scope="row">{h.hour}:00</th>
                        <td>{h.today}</td>
                        <td>{h.yesterday}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PanelCard>

            <div className={cn('grid grid-cols-1 gap-4 lg:col-span-2 lg:grid-rows-2', DENSE_GAP)}>
              <PanelCard icon={CreditCard} label="Ad budget">
                <div className="flex flex-1 flex-col justify-between gap-4">
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs uppercase text-muted-foreground">Spent today</span>
                      <span className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
                        {usd.format(BUDGET.spent)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-end">
                      <span className="text-xs uppercase text-muted-foreground">Daily cap</span>
                      <span className="text-xl font-semibold tracking-[-0.02em] tabular-nums text-muted-foreground">
                        {usd.format(BUDGET.cap)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div
                      role="progressbar"
                      aria-label="Daily ad budget used"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={budgetPct}
                      aria-valuetext={`${budgetPct}% of ${usd.format(BUDGET.cap)}`}
                      className="h-2 w-full overflow-hidden rounded-full bg-accent"
                    >
                      <div className="h-full rounded-full bg-foreground/80" style={{ width: `${budgetPct}%` }} />
                    </div>
                    <span className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                      <span className="tabular-nums">{budgetPct}% used</span>
                      <span aria-hidden className="text-border">
                        |
                      </span>
                      <span>Resets 00:00 UTC</span>
                    </span>
                  </div>
                </div>
              </PanelCard>

              <PanelCard icon={Clock4} label="Peak hours">
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span dir="ltr" className="text-xl font-semibold tracking-[-0.02em] tabular-nums rtl:text-end">
                      {peakWindow[0]?.hour}:00 – {peakWindow.at(-1)?.hour}:00
                    </span>
                    <span className="text-xs uppercase text-muted-foreground">31% of today&apos;s orders</span>
                  </div>
                  <div aria-hidden className="flex h-16 items-end gap-1">
                    {PEAK_HOURS.map((h) => (
                      <span
                        key={h.hour}
                        className={cn('flex-1 rounded-t-xs', h.peak ? 'bg-foreground/85' : 'bg-muted-foreground/30')}
                        style={{ height: `${(h.orders / peakMax) * 100}%` }}
                      />
                    ))}
                  </div>
                  <table className="sr-only">
                    <caption>Orders by hour</caption>
                    <thead>
                      <tr>
                        <th scope="col">Hour</th>
                        <th scope="col">Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PEAK_HOURS.map((h) => (
                        <tr key={h.hour}>
                          <th scope="row">{h.hour}:00</th>
                          <td>{h.orders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PanelCard>
            </div>
          </div>
        </div>

        <div data-slot="dashboard-week" style={stagger(3)} className={cn(ENTER, 'flex flex-col gap-4', DENSE_GAP)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-[-0.02em]">Week in review</h3>
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

          <div className={cn('flex flex-col gap-4', DENSE_GAP)}>
            <PanelCard icon={ShoppingCart} label="Orders">
              <div key={range} className={cn(SWAP, 'flex items-start justify-between gap-4')}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-3xl font-semibold tracking-[-0.035em] tabular-nums">{week.orders.value}</span>
                  <span className="text-xs uppercase text-muted-foreground">Orders completed</span>
                </div>
                <DeltaChip delta={week.orders.delta} label="Orders" />
              </div>
              <div
                role="group"
                aria-label="Orders per day"
                className="mt-4 grid h-32 items-end gap-2"
                style={{
                  gridTemplateColumns: `repeat(${week.orders.days.length}, minmax(0, 1fr))`,
                }}
              >
                {week.orders.days.map((d) => (
                  <div key={d.day} className="flex h-full flex-col justify-end gap-1.5">
                    <div
                      aria-hidden
                      // Capped so seven bars across a wide card stay bars
                      // rather than slabs.
                      className="mx-auto w-full max-w-16 rounded-t-xs bg-foreground/80 transition-[height] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                      style={{ height: `${(d.orders / barMax) * 100}%` }}
                    />
                    <span className="text-center text-xs uppercase text-muted-foreground">
                      {d.day}
                      <span className="sr-only">: {d.orders} orders</span>
                    </span>
                  </div>
                ))}
              </div>
            </PanelCard>

            <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3', DENSE_GAP)}>
              {week.minis.map((m) => (
                <PanelCard key={m.label} icon={CreditCard} label={m.label}>
                  <div key={range} className={cn(SWAP, 'flex items-start justify-between gap-3')}>
                    <span className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">{m.value}</span>
                    <DeltaChip delta={m.delta} label={m.label} />
                  </div>
                  <Sparkline key={range} points={m.spark} />
                </PanelCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard04;
