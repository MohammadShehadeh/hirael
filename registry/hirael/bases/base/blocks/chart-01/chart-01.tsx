'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/hirael/bases/base/ui/card';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/registry/hirael/bases/base/ui/chart';
import { useDirection } from '@/registry/hirael/bases/base/ui/direction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 80): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

// Axis text is Latin; an inherited RTL direction would flip its text-anchor into the plot.
const PLOT_TEXT = 'tabular-nums [&_svg_text]:[direction:ltr]';

type Plan = 'starter' | 'pro' | 'business';
type Layout = 'stacked' | 'grouped';
type Year = '2024' | '2025';

const PLANS: readonly Plan[] = ['starter', 'pro', 'business'];

const chartConfig = {
  starter: { label: 'Starter', color: 'var(--chart-1)' },
  pro: { label: 'Pro', color: 'var(--chart-2)' },
  business: { label: 'Business', color: 'var(--chart-3)' },
} satisfies ChartConfig;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Monthly recurring revenue in USD per plan, January to December. */
const REVENUE: Record<Year, Record<Plan, number[]>> = {
  '2024': {
    starter: [14200, 14800, 15600, 15100, 16300, 16900, 17400, 18100, 18800, 19600, 20400, 21900],
    pro: [26400, 27900, 29800, 30600, 32500, 33100, 34800, 36200, 38900, 40300, 42100, 45600],
    business: [18000, 18000, 21500, 21500, 24000, 24000, 27500, 27500, 27500, 31000, 31000, 36500],
  },
  '2025': {
    starter: [22600, 23100, 24400, 24000, 25200, 25900, 26300, 27100, 27800, 28900, 29400, 31200],
    pro: [47800, 50200, 53900, 55100, 58600, 60400, 63100, 65800, 69200, 72500, 75900, 81300],
    business: [36500, 40000, 40000, 44500, 44500, 49000, 49000, 53500, 58000, 58000, 62500, 68000],
  },
};

const YEARS = Object.keys(REVENUE) as Year[];

interface MonthRow {
  month: string;
  starter: number;
  pro: number;
  business: number;
  total: number;
}

const toRows = (year: Year): MonthRow[] =>
  MONTHS.map((month, i) => {
    const starter = REVENUE[year].starter[i];
    const pro = REVENUE[year].pro[i];
    const business = REVENUE[year].business[i];

    return {
      month,
      starter,
      pro,
      business,
      total: starter + pro + business,
    };
  });

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const usdAxis = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 0,
});

const summarize = (year: Year) => {
  const rows = toRows(year);
  const total = sum(rows.map((row) => row.total));
  const best = rows.reduce((top, row, i) => (row.total > rows[top].total ? i : top), 0);
  const bestMonth = MONTH_NAMES[best];
  const previous = String(Number(year) - 1) as Year;

  if (!(previous in REVENUE)) {
    const lead = PLANS.reduce((top, plan) => (sum(REVENUE[year][plan]) > sum(REVENUE[year][top]) ? plan : top));
    const share = Math.round((sum(REVENUE[year][lead]) / total) * 100);

    return `Revenue in ${year} was ${usdCompact.format(total)}. ${chartConfig[lead].label} plans brought in ${share}% of it, and ${bestMonth} was the best month.`;
  }

  const previousTotal = sum(PLANS.map((plan) => sum(REVENUE[previous][plan])));
  const change = Math.round((total / previousTotal - 1) * 100);
  const lead = PLANS.reduce((top, plan) => {
    const growth = (key: Plan) => sum(REVENUE[year][key]) - sum(REVENUE[previous][key]);

    return growth(plan) > growth(top) ? plan : top;
  });
  const trend = change >= 0 ? `up ${change}%` : `down ${Math.abs(change)}%`;

  return `Revenue in ${year} was ${usdCompact.format(total)}, ${trend} on ${previous}, led by ${chartConfig[lead].label} plans. ${bestMonth} was the best month.`;
};

interface TotalLabelProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  index?: number;
  rows: MonthRow[];
}

const TotalLabel = ({ x, y, width, index, rows }: TotalLabelProps) => {
  const row = index === undefined ? undefined : rows[index];
  if (!row) return null;

  return (
    <text
      x={Number(x) + Number(width) / 2}
      y={Number(y) - 6}
      textAnchor="middle"
      className="hidden fill-foreground text-[11px] font-medium tabular-nums @lg:inline"
    >
      {usdAxis.format(row.total)}
    </text>
  );
};

interface TooltipBodyProps {
  active?: boolean;
  payload?: readonly { payload?: MonthRow }[];
  year: Year;
}

const TooltipBody = ({ active, payload, year }: TooltipBodyProps) => {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;

  return (
    <div
      data-slot="revenue-chart-tooltip"
      className="grid min-w-44 gap-1.5 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
    >
      <p className="font-medium">
        {MONTH_NAMES[MONTHS.indexOf(row.month)]} {year}
      </p>
      {[...PLANS].reverse().map((plan) => (
        <div key={plan} className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-0.5 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: `var(--color-${plan})` }}
          />
          <span className="flex-1 text-muted-foreground">{chartConfig[plan].label}</span>
          <span className="font-medium tabular-nums">{usd.format(row[plan])}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 border-t border-border pt-1.5">
        <span className="flex-1 text-muted-foreground">Total</span>
        <span className="font-semibold tabular-nums">{usd.format(row.total)}</span>
      </div>
    </div>
  );
};

const Chart01 = () => {
  const [year, setYear] = React.useState<Year>('2025');
  const [layout, setLayout] = React.useState<Layout>('stacked');
  const isRtl = useDirection() === 'rtl';

  const rows = React.useMemo(() => toRows(year), [year]);
  const summary = React.useMemo(() => summarize(year), [year]);
  const total = sum(rows.map((row) => row.total));
  const stacked = layout === 'stacked';
  // Recharts keeps bars in a group left to right even on a reversed axis, so RTL reverses them; the layout key remounts them so the new order registers.
  const barOrder = !stacked && isRtl ? [...PLANS].reverse() : PLANS;

  return (
    <section
      data-slot="revenue-chart"
      aria-labelledby="chart-01-heading"
      className="bg-background px-4 py-16 sm:px-6 sm:py-24"
    >
      <Card data-slot="revenue-chart-card" className={cn(ENTER, 'mx-auto w-full max-w-3xl')}>
        <CardHeader>
          <CardTitle>
            <h2 id="chart-01-heading" className="text-balance">
              Monthly revenue
            </h2>
          </CardTitle>
          <CardDescription data-slot="revenue-chart-summary" aria-live="polite" className="max-w-xl">
            <span key={year} className={cn(SWAP, 'block text-pretty')}>
              {summary}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent style={stagger(1)} className={ENTER}>
          <div className="flex flex-col gap-6">
            <div data-slot="revenue-chart-toolbar" className="flex flex-wrap items-center justify-between gap-3">
              <Select value={year} onValueChange={(next) => setYear(next as Year)}>
                <SelectTrigger aria-label="Year" data-slot="revenue-chart-year" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {YEARS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ToggleGroup
                variant="outline"
                value={[layout]}
                onValueChange={([next]) => {
                  if (next) setLayout(next as Layout);
                }}
                aria-label="Bar layout"
                data-slot="revenue-chart-layout"
              >
                <ToggleGroupItem value="stacked">Stacked</ToggleGroupItem>
                <ToggleGroupItem value="grouped">Grouped</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase">Total for {year}</span>
              <span key={year} className={cn(SWAP, 'text-3xl font-semibold tracking-tight tabular-nums')}>
                {usd.format(total)}
              </span>
            </div>

            <div data-slot="revenue-chart-plot" className={cn(PLOT_TEXT, '@container flex flex-col gap-3')}>
              <ChartContainer config={chartConfig} className="h-72 w-full">
                <BarChart
                  data={rows}
                  barGap={2}
                  barCategoryGap={stacked ? '28%' : '18%'}
                  margin={{ top: 22, right: 4, bottom: 0, left: 4 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    reversed={isRtl}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={4}
                    interval="preserveStart"
                  />
                  <YAxis
                    orientation={isRtl ? 'right' : 'left'}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    width={48}
                    tickFormatter={(value: number) => usdAxis.format(value)}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.6 }}
                    content={({ active, payload }) => (
                      <TooltipBody active={active} payload={payload as TooltipBodyProps['payload']} year={year} />
                    )}
                  />
                  {barOrder.map((plan) => {
                    const top = plan === 'business';

                    return (
                      <Bar
                        key={`${layout}-${plan}`}
                        dataKey={plan}
                        stackId={stacked ? 'revenue' : undefined}
                        fill={`var(--color-${plan})`}
                        maxBarSize={24}
                        radius={stacked && !top ? 0 : [4, 4, 0, 0]}
                        stroke={stacked ? 'var(--card)' : undefined}
                        strokeWidth={stacked ? 2 : 0}
                      >
                        {/* Totals sit on the stack top only; over grouped bars their height would misread the axis. */}
                        {stacked && top ? (
                          <LabelList dataKey={plan} content={(props) => <TotalLabel {...props} rows={rows} />} />
                        ) : null}
                      </Bar>
                    );
                  })}
                </BarChart>
              </ChartContainer>

              <ul data-slot="revenue-chart-legend" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                {PLANS.map((plan) => (
                  <li key={plan} className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-[3px]"
                      style={{ backgroundColor: chartConfig[plan].color }}
                    />
                    {chartConfig[plan].label}
                    <span className="font-medium text-foreground">
                      {usdCompact.format(sum(rows.map((row) => row[plan])))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Chart01;
