'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/hirael/bases/base/ui/card';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/registry/hirael/bases/base/ui/chart';
import { useDirection } from '@/registry/hirael/bases/base/ui/direction';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 80): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

// The rank column drops on phones so channel names don't truncate.
const LEGEND_GRID =
  'grid grid-cols-[minmax(0,1fr)_4rem_2.5rem_3rem] gap-x-2 sm:grid-cols-[0.75rem_minmax(0,1fr)_4rem_2.5rem_3rem] sm:gap-x-3';

type Channel = 'organic' | 'direct' | 'paid' | 'referral' | 'email';
type Period = '30d' | '90d' | '12m';

// Colour follows the channel in this fixed order, never its rank, so a reshuffle doesn't repaint slices.
const chartConfig = {
  organic: { label: 'Organic', color: 'var(--chart-1)' },
  direct: { label: 'Direct', color: 'var(--chart-2)' },
  paid: { label: 'Paid ads', color: 'var(--chart-3)' },
  referral: { label: 'Referral', color: 'var(--chart-4)' },
  email: { label: 'Email', color: 'var(--chart-5)' },
} satisfies ChartConfig;

const CHANNELS = Object.keys(chartConfig) as Channel[];

interface PeriodData {
  label: string;
  /** Shown under the total in the donut. */
  short: string;
  /** Completes "Revenue was $X ..." and "... on ...". */
  current: string;
  previous: string;
  /** Revenue in USD per channel: [this period, the period before]. */
  revenue: Record<Channel, [number, number]>;
}

const PERIODS: Record<Period, PeriodData> = {
  '30d': {
    label: '30 days',
    short: 'Last 30 days',
    current: 'over the last 30 days',
    previous: 'the 30 days before',
    revenue: {
      organic: [21400, 19800],
      direct: [11900, 12400],
      paid: [12300, 13100],
      referral: [6800, 5900],
      email: [4100, 3100],
    },
  },
  '90d': {
    label: '90 days',
    short: 'Last 90 days',
    current: 'over the last 90 days',
    previous: 'the 90 days before',
    revenue: {
      organic: [60200, 54100],
      direct: [49800, 47900],
      paid: [38700, 35200],
      referral: [18900, 17600],
      email: [11400, 8700],
    },
  },
  '12m': {
    label: '12 months',
    short: 'Last 12 months',
    current: 'over the last 12 months',
    previous: 'the 12 months before',
    revenue: {
      organic: [221000, 168400],
      direct: [187500, 171300],
      paid: [162800, 171900],
      referral: [69300, 58200],
      email: [38600, 29800],
    },
  },
};

const PERIOD_KEYS = Object.keys(PERIODS) as Period[];

interface ChannelRow {
  key: Channel;
  label: string;
  value: number;
  share: number;
  /** Whole-number share; the rows always add up to 100. */
  shareRounded: number;
  change: number;
}

// Largest-remainder rounding, so the share column never sums to 99% or 101%.
const roundShares = (shares: number[]) => {
  const floors = shares.map(Math.floor);
  let missing = 100 - floors.reduce((acc, value) => acc + value, 0);
  const byRemainder = shares.map((share, i) => ({ i, rest: share - floors[i] })).sort((a, b) => b.rest - a.rest);

  for (const { i } of byRemainder) {
    if (missing <= 0) break;
    floors[i] += 1;
    missing -= 1;
  }

  return floors;
};

const toRows = (period: Period): ChannelRow[] => {
  const { revenue } = PERIODS[period];
  const total = CHANNELS.reduce((acc, key) => acc + revenue[key][0], 0);
  const shares = CHANNELS.map((key) => (revenue[key][0] / total) * 100);
  const rounded = roundShares(shares);

  return CHANNELS.map((key, i) => ({
    key,
    label: chartConfig[key].label,
    value: revenue[key][0],
    share: shares[i],
    shareRounded: rounded[i],
    change: Math.round((revenue[key][0] / revenue[key][1] - 1) * 100),
  })).sort((a, b) => b.value - a.value);
};

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const signed = (value: number) => (value >= 0 ? `+${value}%` : `${value}%`);

const summarize = (period: Period, rows: ChannelRow[]) => {
  const { current, previous, revenue } = PERIODS[period];
  const total = rows.reduce((acc, row) => acc + row.value, 0);
  const previousTotal = CHANNELS.reduce((acc, key) => acc + revenue[key][1], 0);
  const change = Math.round((total / previousTotal - 1) * 100);
  const trend = change >= 0 ? `up ${change}%` : `down ${Math.abs(change)}%`;
  const [top] = rows;
  const fastest = rows.reduce((best, row) => (row.change > best.change ? row : best));
  const lead =
    fastest.key === top.key
      ? `${top.label} leads with ${top.shareRounded}% and grew fastest at ${signed(top.change)}.`
      : `${top.label} leads with ${top.shareRounded}%, and ${fastest.label} grew fastest at ${signed(fastest.change)}.`;

  return `Revenue was ${usdCompact.format(total)} ${current}, ${trend} on ${previous}. ${lead}`;
};

interface TooltipBodyProps {
  active?: boolean;
  payload?: readonly { payload?: ChannelRow }[];
}

const TooltipBody = ({ active, payload }: TooltipBodyProps) => {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;

  return (
    <div
      data-slot="channel-chart-tooltip"
      className="grid min-w-40 gap-1 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-0.5 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: `var(--color-${row.key})` }}
        />
        <span className="font-medium">{row.label}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground">Revenue</span>
        <span className="font-medium tabular-nums">{usd.format(row.value)}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground">Share</span>
        <span className="font-medium tabular-nums">{row.share.toFixed(1)}%</span>
      </div>
    </div>
  );
};

interface ChannelLegendRowProps {
  row: ChannelRow;
  rank: number;
  highlighted: boolean;
  dimmed: boolean;
  pinned: boolean;
  onHover: (key: Channel | null) => void;
  onPin: (key: Channel) => void;
}

const ChannelLegendRow = ({ row, rank, highlighted, dimmed, pinned, onHover, onPin }: ChannelLegendRowProps) => {
  const Arrow = row.change >= 0 ? ArrowUp : ArrowDown;

  return (
    <li>
      <button
        type="button"
        data-slot="channel-chart-legend-row"
        aria-pressed={pinned}
        onMouseEnter={() => onHover(row.key)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(row.key)}
        onBlur={() => onHover(null)}
        onClick={() => onPin(row.key)}
        className={cn(
          LEGEND_GRID,
          'w-full items-center rounded-md px-2 py-2 text-start text-sm transition-[opacity,background-color] duration-150 ease-out outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          highlighted && 'bg-muted',
          dimmed && 'opacity-50',
        )}
      >
        <span className="hidden text-xs text-muted-foreground tabular-nums sm:inline">{rank}</span>
        <span className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-[3px]"
            style={{ backgroundColor: chartConfig[row.key].color }}
          />
          <span className="truncate">{row.label}</span>
        </span>
        <span className="text-end font-medium tabular-nums">{usdCompact.format(row.value)}</span>
        <span className="text-end text-muted-foreground tabular-nums">{row.shareRounded}%</span>
        <span className="inline-flex items-center justify-end gap-0.5 text-xs text-muted-foreground tabular-nums">
          <Arrow aria-hidden className="size-3" />
          {Math.abs(row.change)}%<span className="sr-only">{row.change >= 0 ? ' up' : ' down'}</span>
        </span>
      </button>
    </li>
  );
};

const Chart03 = () => {
  const [period, setPeriod] = React.useState<Period>('90d');
  const [hovered, setHovered] = React.useState<Channel | null>(null);
  const [pinned, setPinned] = React.useState<Channel | null>(null);
  const isRtl = useDirection() === 'rtl';

  const rows = React.useMemo(() => toRows(period), [period]);
  const summary = summarize(period, rows);
  const total = rows.reduce((acc, row) => acc + row.value, 0);
  const activeKey = hovered ?? pinned;
  const active = rows.find((row) => row.key === activeKey);

  const pin = (key: Channel) => setPinned((current) => (current === key ? null : key));

  return (
    <section
      data-slot="channel-chart"
      aria-labelledby="chart-03-heading"
      className="bg-background px-4 py-16 sm:px-6 sm:py-24"
    >
      <Card data-slot="channel-chart-card" className={cn(ENTER, 'mx-auto w-full max-w-3xl')}>
        <CardHeader>
          <CardTitle>
            <h2 id="chart-03-heading" className="text-balance">
              Revenue by channel
            </h2>
          </CardTitle>
          <CardDescription data-slot="channel-chart-summary" aria-live="polite" className="max-w-xl">
            <span key={period} className={cn(SWAP, 'block text-pretty')}>
              {summary}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent style={stagger(1)} className={ENTER}>
          <div className="flex flex-col gap-6">
            <ToggleGroup
              variant="outline"
              value={[period]}
              onValueChange={([next]) => {
                if (next) setPeriod(next as Period);
              }}
              aria-label="Period"
              data-slot="channel-chart-period"
            >
              {PERIOD_KEYS.map((key) => (
                <ToggleGroupItem key={key} value={key}>
                  <span dir="auto">{PERIODS[key].label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
              <div data-slot="channel-chart-donut" className="relative mx-auto aspect-square w-full max-w-56">
                <ChartContainer config={chartConfig} className="size-full">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => (
                        <TooltipBody active={active} payload={payload as TooltipBodyProps['payload']} />
                      )}
                    />
                    <Pie
                      data={rows}
                      dataKey="value"
                      nameKey="key"
                      innerRadius="70%"
                      outerRadius="100%"
                      startAngle={90}
                      endAngle={isRtl ? 450 : -270}
                      stroke="var(--card)"
                      strokeWidth={2}
                      cornerRadius={4}
                      onMouseEnter={(_, index) => setHovered(rows[index]?.key ?? null)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={(_, index) => {
                        const key = rows[index]?.key;
                        if (key) pin(key);
                      }}
                      className="cursor-pointer"
                    >
                      {rows.map((row) => (
                        <Cell
                          key={row.key}
                          fill={`var(--color-${row.key})`}
                          opacity={activeKey && activeKey !== row.key ? 0.3 : 1}
                          className="transition-opacity duration-150 ease-out"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div
                  data-slot="channel-chart-center"
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center"
                >
                  <span className="max-w-[60%] truncate text-xs text-muted-foreground">
                    {active ? active.label : 'Total'}
                  </span>
                  <span className="text-2xl font-semibold tracking-tight tabular-nums">
                    {usdCompact.format(active ? active.value : total)}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {active ? `${active.share.toFixed(1)}% of revenue` : PERIODS[period].short}
                  </span>
                </div>
              </div>

              <div data-slot="channel-chart-legend" className="flex min-w-0 flex-col gap-1">
                <div
                  aria-hidden
                  className={cn(
                    LEGEND_GRID,
                    'border-b border-border px-2 pb-2 text-xs text-muted-foreground uppercase',
                  )}
                >
                  <span className="hidden sm:block" />
                  <span>Channel</span>
                  <span className="text-end">Revenue</span>
                  <span className="text-end">Share</span>
                  <span className="text-end">Change</span>
                </div>
                <ol aria-label="Channels ranked by revenue" className="flex flex-col">
                  {rows.map((row, i) => (
                    <ChannelLegendRow
                      key={row.key}
                      row={row}
                      rank={i + 1}
                      highlighted={activeKey === row.key}
                      dimmed={activeKey !== null && activeKey !== row.key}
                      pinned={pinned === row.key}
                      onHover={setHovered}
                      onPin={pin}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Chart03;
