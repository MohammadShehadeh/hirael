'use client';

import * as React from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

type KpiGridProps = React.ComponentProps<'div'>;

const KpiGrid = ({ className, ...props }: KpiGridProps) => {
  return (
    <div
      data-slot="kpi-grid"
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4',
        className,
      )}
      {...props}
    />
  );
};

type KpiCardProps = React.ComponentProps<'div'>;

const KpiCard = ({ className, ...props }: KpiCardProps) => {
  return <div data-slot="kpi-card" className={cn('flex flex-col gap-2 bg-card p-4', className)} {...props} />;
};

type KpiCardLabelProps = React.ComponentProps<'p'>;

const KpiCardLabel = ({ className, ...props }: KpiCardLabelProps) => {
  return (
    <p data-slot="kpi-card-label" className={cn('text-xs uppercase text-muted-foreground', className)} {...props} />
  );
};

type KpiCardValueProps = React.ComponentProps<'p'>;

const KpiCardValue = ({ className, ...props }: KpiCardValueProps) => {
  return (
    <p
      data-slot="kpi-card-value"
      className={cn('text-2xl font-semibold tracking-[-0.03em] text-foreground', className)}
      {...props}
    />
  );
};

type KpiTrend = 'up' | 'down' | 'flat';

const trendIcon: Record<KpiTrend, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const trendTone: Record<KpiTrend, string> = {
  up: 'text-success',
  down: 'text-destructive',
  flat: 'text-muted-foreground',
};

interface KpiCardDeltaProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  trend?: KpiTrend;
  children?: React.ReactNode;
}

const KpiCardDelta = ({ trend = 'flat', className, children, ...props }: KpiCardDeltaProps) => {
  const Icon = trendIcon[trend];
  return (
    <span
      data-slot="kpi-card-delta"
      data-trend={trend}
      className={cn('inline-flex items-center gap-1 text-xs', trendTone[trend], className)}
      {...props}
    >
      <Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
};

interface KpiCardSparkProps extends Omit<React.ComponentProps<'svg'>, 'points'> {
  points: number[];
}

const KpiCardSpark = ({ points, className, ...props }: KpiCardSparkProps) => {
  if (!points.length) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 100;
  const height = 28;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const line = points.map((point, i) => `${i * step},${height - ((point - min) / range) * height}`).join(' ');
  return (
    <svg
      data-slot="kpi-card-spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn('h-7 w-full text-muted-foreground', className)}
      {...props}
    >
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export { KpiGrid, KpiCard, KpiCardLabel, KpiCardValue, KpiCardDelta, KpiCardSpark };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

type KpiPeriod = '7d' | '30d' | '90d';

const PERIODS: { value: KpiPeriod; label: string; comparison: string }[] = [
  { value: '7d', label: '7 days', comparison: 'vs previous 7 days' },
  { value: '30d', label: '30 days', comparison: 'vs previous 30 days' },
  { value: '90d', label: '90 days', comparison: 'vs previous quarter' },
];

type KpiReading = { value: string; trend: KpiTrend; delta: string; spark: number[] };

const KPI_ROWS: { key: string; label: string; periods: Record<KpiPeriod, KpiReading> }[] = [
  {
    key: 'revenue',
    label: 'Revenue',
    periods: {
      '7d': { value: '$11.6k', trend: 'up', delta: '+3.2%', spark: [14, 15, 13, 16, 17, 16, 18] },
      '30d': { value: '$48.2k', trend: 'up', delta: '+12.4%', spark: [8, 10, 9, 13, 12, 16, 18] },
      '90d': { value: '$139k', trend: 'up', delta: '+21.8%', spark: [5, 7, 8, 9, 12, 14, 18] },
    },
  },
  {
    key: 'active-users',
    label: 'Active users',
    periods: {
      '7d': { value: '2,480', trend: 'down', delta: '-1.6%', spark: [26, 25, 27, 24, 23, 24, 22] },
      '30d': { value: '3,914', trend: 'up', delta: '+4.1%', spark: [20, 19, 22, 21, 24, 23, 26] },
      '90d': { value: '5,207', trend: 'up', delta: '+9.7%', spark: [14, 16, 17, 19, 21, 22, 26] },
    },
  },
  {
    key: 'churn',
    label: 'Churn',
    periods: {
      '7d': { value: '0.4%', trend: 'flat', delta: '0.0%', spark: [4, 4, 5, 4, 4, 4, 4] },
      '30d': { value: '1.8%', trend: 'down', delta: '-0.3%', spark: [6, 5, 5, 4, 4, 3, 3] },
      '90d': { value: '5.1%', trend: 'down', delta: '-0.9%', spark: [9, 8, 8, 7, 6, 6, 5] },
    },
  },
  {
    key: 'avg-order',
    label: 'Avg. order',
    periods: {
      '7d': { value: '$63.10', trend: 'up', delta: '+2.8%', spark: [11, 12, 12, 13, 12, 14, 15] },
      '30d': { value: '$61.40', trend: 'flat', delta: '0.0%', spark: [12, 13, 12, 12, 13, 12, 12] },
      '90d': { value: '$58.90', trend: 'down', delta: '-4.2%', spark: [16, 15, 15, 14, 13, 13, 12] },
    },
  },
];

const KpiGridBlock = () => {
  const [period, setPeriod] = React.useState<KpiPeriod>('30d');
  const comparison = PERIODS.find((option) => option.value === period)?.comparison;

  return (
    <section data-slot="kpi-grid-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className={cn(ENTER, 'flex w-full max-w-2xl flex-col gap-3')}>
        <div data-slot="kpi-grid-toolbar" className="flex flex-wrap items-center justify-between gap-2">
          <p key={period} className={cn(SWAP, 'text-xs text-muted-foreground')}>
            {comparison}
          </p>
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            value={period}
            onValueChange={(value) => {
              if (value) setPeriod(value as KpiPeriod);
            }}
            aria-label="Period"
          >
            {PERIODS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <KpiGrid>
          {KPI_ROWS.map((kpi, index) => {
            const reading = kpi.periods[period];
            return (
              <KpiCard key={kpi.key}>
                <KpiCardLabel>{kpi.label}</KpiCardLabel>
                <div
                  key={period}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className={cn(SWAP, 'flex flex-col gap-2')}
                >
                  <KpiCardValue className="tabular-nums">{reading.value}</KpiCardValue>
                  <KpiCardDelta trend={reading.trend} className="tabular-nums">
                    {reading.delta}
                  </KpiCardDelta>
                  <KpiCardSpark points={reading.spark} />
                </div>
              </KpiCard>
            );
          })}
        </KpiGrid>
      </div>
    </section>
  );
};

export default KpiGridBlock;
