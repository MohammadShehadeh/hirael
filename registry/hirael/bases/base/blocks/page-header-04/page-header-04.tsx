'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, Download } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AnimatedNumber, type AnimatedNumberProps } from '@/registry/hirael/bases/base/components/animated-number';
import { Sparkline } from '@/registry/hirael/bases/base/components/sparkline';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

type AnalyticsHeaderProps = React.ComponentProps<'header'>;

const AnalyticsHeader = ({ className, ...props }: AnalyticsHeaderProps) => {
  return <header data-slot="analytics-header" className={cn('flex flex-col gap-8', className)} {...props} />;
};

type AnalyticsHeaderRowProps = React.ComponentProps<'div'>;

const AnalyticsHeaderRow = ({ className, ...props }: AnalyticsHeaderRowProps) => {
  return (
    <div
      data-slot="analytics-header-row"
      className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8', className)}
      {...props}
    />
  );
};

type AnalyticsHeaderContentProps = React.ComponentProps<'div'>;

const AnalyticsHeaderContent = ({ className, ...props }: AnalyticsHeaderContentProps) => {
  return (
    <div data-slot="analytics-header-content" className={cn('flex min-w-0 flex-col gap-2', className)} {...props} />
  );
};

type AnalyticsHeaderTitleProps = React.ComponentProps<'h1'>;

const AnalyticsHeaderTitle = ({ className, ...props }: AnalyticsHeaderTitleProps) => {
  return (
    <h1
      data-slot="analytics-header-title"
      className={cn('text-2xl font-semibold tracking-tight sm:text-3xl', className)}
      {...props}
    />
  );
};

type AnalyticsHeaderDescriptionProps = React.ComponentProps<'p'>;

const AnalyticsHeaderDescription = ({ className, ...props }: AnalyticsHeaderDescriptionProps) => {
  return (
    <p
      data-slot="analytics-header-description"
      className={cn('max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base', className)}
      {...props}
    />
  );
};

type AnalyticsHeaderActionsProps = React.ComponentProps<'div'>;

const AnalyticsHeaderActions = ({ className, ...props }: AnalyticsHeaderActionsProps) => {
  return (
    <div
      data-slot="analytics-header-actions"
      className={cn('flex shrink-0 flex-wrap items-center gap-2', className)}
      {...props}
    />
  );
};

type AnalyticsMetricsProps = React.ComponentProps<'dl'>;

/** Metric strip. Hairlines come from the 1px gap showing the border color through. */
const AnalyticsMetrics = ({ className, ...props }: AnalyticsMetricsProps) => {
  return (
    <dl
      data-slot="analytics-metrics"
      className={cn('grid grid-cols-2 gap-px border-y border-border bg-border lg:grid-cols-4', className)}
      {...props}
    />
  );
};

type AnalyticsMetricProps = React.ComponentProps<'div'>;

const AnalyticsMetric = ({ className, ...props }: AnalyticsMetricProps) => {
  return (
    <div
      data-slot="analytics-metric"
      className={cn('flex min-w-0 flex-col gap-2 bg-background px-4 py-5 sm:px-5', className)}
      {...props}
    />
  );
};

type AnalyticsMetricLabelProps = React.ComponentProps<'dt'>;

const AnalyticsMetricLabel = ({ className, ...props }: AnalyticsMetricLabelProps) => {
  return (
    <dt
      data-slot="analytics-metric-label"
      className={cn('text-xs text-muted-foreground uppercase', className)}
      {...props}
    />
  );
};

type AnalyticsMetricValueProps = AnimatedNumberProps;

/** Tweens between figures when the value changes; starts on the real value so the server render isn't zero. */
const AnalyticsMetricValue = ({ value, className, ...props }: AnalyticsMetricValueProps) => {
  return (
    <dd data-slot="analytics-metric-value" className={cn('text-2xl font-semibold tracking-tight', className)}>
      <AnimatedNumber startValue={value} duration={350} {...props} value={value} />
    </dd>
  );
};

type Direction = 'up' | 'down' | 'flat';

interface AnalyticsMetricDeltaProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** Percent change from the previous period; negative when it went down. */
  change: number;
  /** Which direction counts as an improvement, e.g. `down` for a refund rate. */
  goodWhen?: 'up' | 'down';
  /** Read after the figure by screen readers, e.g. "vs previous 30 days". */
  comparison?: string;
}

const DELTA_TONE: Record<'good' | 'bad' | 'flat', string> = {
  good: 'bg-success/10 text-success',
  bad: 'bg-destructive/10 text-destructive',
  flat: 'bg-muted text-muted-foreground',
};

const AnalyticsMetricDelta = ({
  change,
  goodWhen = 'up',
  comparison,
  className,
  ...props
}: AnalyticsMetricDeltaProps) => {
  const direction: Direction = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const tone = direction === 'flat' ? 'flat' : direction === goodWhen ? 'good' : 'bad';
  const Icon = direction === 'down' ? ArrowDown : ArrowUp;
  const word = direction === 'up' ? 'Up' : direction === 'down' ? 'Down' : 'No change,';

  return (
    <span
      data-slot="analytics-metric-delta"
      data-direction={direction}
      data-tone={tone}
      className={cn(
        'inline-flex w-fit items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
        DELTA_TONE[tone],
        className,
      )}
      {...props}
    >
      {direction === 'flat' ? null : <Icon aria-hidden className="size-3" />}
      <span className="sr-only">{word} </span>
      {Math.abs(change).toFixed(1)}%{comparison ? <span className="sr-only"> {comparison}</span> : null}
    </span>
  );
};

export {
  AnalyticsHeader,
  AnalyticsHeaderRow,
  AnalyticsHeaderContent,
  AnalyticsHeaderTitle,
  AnalyticsHeaderDescription,
  AnalyticsHeaderActions,
  AnalyticsMetrics,
  AnalyticsMetric,
  AnalyticsMetricLabel,
  AnalyticsMetricValue,
  AnalyticsMetricDelta,
};

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

type Range = '7d' | '30d' | '90d';
type MetricId = 'revenue' | 'orders' | 'conversion' | 'refunds';

interface Reading {
  value: number;
  change: number;
  spark: number[];
}

interface MetricDefinition {
  id: MetricId;
  label: string;
  goodWhen: 'up' | 'down';
  number: Pick<AnimatedNumberProps, 'decimals' | 'format' | 'prefix' | 'suffix'>;
}

const RANGES: readonly { value: Range; label: string; previous: string }[] = [
  { value: '7d', label: 'Last 7 days', previous: 'previous 7 days' },
  { value: '30d', label: 'Last 30 days', previous: 'previous 30 days' },
  { value: '90d', label: 'Last 90 days', previous: 'previous 90 days' },
];

const METRICS: readonly MetricDefinition[] = [
  { id: 'revenue', label: 'Revenue', goodWhen: 'up', number: { prefix: '$' } },
  { id: 'orders', label: 'Orders', goodWhen: 'up', number: {} },
  { id: 'conversion', label: 'Conversion rate', goodWhen: 'up', number: { decimals: 2, suffix: '%' } },
  { id: 'refunds', label: 'Refund rate', goodWhen: 'down', number: { decimals: 1, suffix: '%' } },
];

// Revenue is orders times average order value; conversion is orders over visitors (18.4k, 76.9k, 214.3k).
const DATA: Record<Range, Record<MetricId, Reading>> = {
  '7d': {
    revenue: { value: 31334, change: 8.2, spark: [3.9, 4.2, 4.0, 4.6, 4.4, 4.9, 5.3] },
    orders: { value: 512, change: 5.1, spark: [66, 70, 68, 74, 71, 77, 86] },
    conversion: { value: 2.78, change: -2.4, spark: [2.9, 2.86, 2.84, 2.8, 2.82, 2.74, 2.71] },
    refunds: { value: 1.4, change: -12.5, spark: [1.7, 1.6, 1.6, 1.5, 1.4, 1.3, 1.2] },
  },
  '30d': {
    revenue: { value: 141762, change: 14.6, spark: [28, 30, 29, 33, 34, 32, 36, 38, 37, 41] },
    orders: { value: 2236, change: 11.3, spark: [196, 204, 199, 215, 221, 218, 230, 236, 241, 252] },
    conversion: { value: 2.91, change: 3.2, spark: [2.81, 2.84, 2.83, 2.88, 2.9, 2.87, 2.93, 2.95, 2.94, 2.98] },
    refunds: { value: 1.8, change: 5.9, spark: [1.6, 1.7, 1.7, 1.8, 1.7, 1.8, 1.9, 1.8, 1.9, 2.0] },
  },
  '90d': {
    revenue: { value: 356884, change: 22.1, spark: [92, 96, 101, 99, 108, 112, 118, 121, 126, 134, 139, 146] },
    orders: { value: 5958, change: 18.7, spark: [410, 425, 441, 436, 462, 471, 489, 497, 512, 530, 541, 556] },
    conversion: {
      value: 2.78,
      change: -1.1,
      spark: [2.83, 2.81, 2.82, 2.8, 2.79, 2.8, 2.78, 2.77, 2.78, 2.76, 2.77, 2.75],
    },
    refunds: { value: 2.1, change: -8.7, spark: [2.4, 2.4, 2.3, 2.3, 2.2, 2.2, 2.1, 2.1, 2.0, 2.0, 1.9, 1.9] },
  },
};

const TOP_PRODUCTS: Record<Range, readonly { name: string; revenue: number }[]> = {
  '7d': [
    { name: 'Atlas headphones', revenue: 8420 },
    { name: 'Meridian watch', revenue: 6150 },
    { name: 'Carryall pack', revenue: 4380 },
    { name: 'Volt runners', revenue: 3215 },
  ],
  '30d': [
    { name: 'Atlas headphones', revenue: 36900 },
    { name: 'Meridian watch', revenue: 27480 },
    { name: 'Volt runners', revenue: 19860 },
    { name: 'Carryall pack', revenue: 17220 },
  ],
  '90d': [
    { name: 'Atlas headphones', revenue: 91300 },
    { name: 'Meridian watch', revenue: 70150 },
    { name: 'Volt runners', revenue: 52640 },
    { name: 'Carryall pack', revenue: 44910 },
  ],
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const downloadCsv = (range: Range) => {
  const rows = [
    ['metric', 'value', 'change_percent', 'range'],
    ...METRICS.map((metric) => [
      metric.label,
      String(DATA[range][metric.id].value),
      String(DATA[range][metric.id].change),
      range,
    ]),
  ];
  const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hirael-analytics-${range}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const PageHeader04 = () => {
  const [range, setRange] = React.useState<Range>('30d');

  const current = RANGES.find((option) => option.value === range) ?? RANGES[1];
  const revenue = DATA[range].revenue.value;

  return (
    <section data-slot="page-header-04" className="bg-background py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 md:px-10">
        <AnalyticsHeader>
          <AnalyticsHeaderRow>
            <AnalyticsHeaderContent>
              <AnalyticsHeaderTitle className={ENTER}>Analytics</AnalyticsHeaderTitle>
              <AnalyticsHeaderDescription style={stagger(1, 80)} className={ENTER}>
                Orders and revenue for the Hirael online store. Figures update every hour.
              </AnalyticsHeaderDescription>
            </AnalyticsHeaderContent>
            <AnalyticsHeaderActions style={stagger(2, 80)} className={ENTER}>
              <ToggleGroup
                variant="outline"
                value={[range]}
                onValueChange={([next]) => {
                  // Keep one range selected when the active one is clicked again.
                  if (next) setRange(next as Range);
                }}
                aria-label="Date range"
              >
                {RANGES.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                    {option.value}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Button type="button" variant="outline" onClick={() => downloadCsv(range)}>
                <Download aria-hidden />
                Export
              </Button>
            </AnalyticsHeaderActions>
          </AnalyticsHeaderRow>

          <div style={stagger(3, 80)} className={cn(ENTER, 'flex flex-col gap-3')}>
            <AnalyticsMetrics aria-label={`${current.label}, vs ${current.previous}`}>
              {METRICS.map((metric) => {
                const reading = DATA[range][metric.id];

                return (
                  <AnalyticsMetric key={metric.id} data-metric={metric.id}>
                    <AnalyticsMetricLabel>{metric.label}</AnalyticsMetricLabel>
                    <AnalyticsMetricValue value={reading.value} {...metric.number} />
                    <dd className="flex items-center justify-between gap-3">
                      <AnalyticsMetricDelta
                        key={`${range}-delta`}
                        change={reading.change}
                        goodWhen={metric.goodWhen}
                        comparison={`vs ${current.previous}`}
                        className={SWAP}
                      />
                      <Sparkline
                        key={`${range}-spark`}
                        data={reading.spark}
                        tone="muted"
                        curve
                        aria-hidden
                        className={cn(SWAP, 'h-7 w-20')}
                      />
                    </dd>
                  </AnalyticsMetric>
                );
              })}
            </AnalyticsMetrics>
            <p className="text-xs text-muted-foreground">
              {current.label}, compared with the {current.previous}.
            </p>
          </div>
        </AnalyticsHeader>

        <div data-slot="page-header-04-products" style={stagger(4, 80)} className={cn(ENTER, 'flex flex-col gap-3')}>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium">Top products</h2>
            <span className="text-xs text-muted-foreground">Share of revenue</span>
          </div>
          <ol key={range} className="flex flex-col divide-y divide-border border-y border-border">
            {TOP_PRODUCTS[range].map((product, index) => {
              const share = (product.revenue / revenue) * 100;

              return (
                <li
                  key={product.name}
                  style={stagger(index, 40)}
                  className={cn(
                    SWAP,
                    'grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-3 text-sm sm:grid-cols-[12rem_1fr_6rem_3rem]',
                  )}
                >
                  <span className="truncate font-medium">{product.name}</span>
                  <span
                    aria-hidden
                    className="col-span-2 row-start-2 h-1.5 overflow-hidden rounded-full bg-muted sm:col-span-1 sm:row-start-auto"
                  >
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${share}%` }} />
                  </span>
                  <span className="text-end tabular-nums">{money.format(product.revenue)}</span>
                  <span className="hidden text-end text-muted-foreground tabular-nums sm:block">
                    {share.toFixed(0)}%
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default PageHeader04;
