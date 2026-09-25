'use client';

import * as React from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';

export type MetricTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'destructive'
  /** @deprecated Use `success`. */
  | 'positive'
  /** @deprecated Use `destructive`. */
  | 'critical';

type ResolvedMetricTone = Exclude<MetricTone, 'positive' | 'critical'>;

const resolveMetricTone = (tone: MetricTone): ResolvedMetricTone => {
  if (tone === 'positive') return 'success';
  if (tone === 'critical') return 'destructive';

  return tone;
};

const toneText: Record<ResolvedMetricTone, string> = {
  neutral: 'text-muted-foreground',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

type MetricCardProps = React.ComponentProps<'div'>;

const MetricCard = ({ className, ...props }: MetricCardProps) => {
  return (
    <div
      data-slot="metric-card"
      className={cn('flex flex-col gap-3 rounded-lg border border-border bg-card p-5 text-card-foreground', className)}
      {...props}
    />
  );
};

interface MetricCardHeaderProps extends React.ComponentProps<'div'> {
  icon?: React.ReactNode;
}

const MetricCardHeader = ({ icon, className, children, ...props }: MetricCardHeaderProps) => {
  return (
    <div data-slot="metric-card-header" className={cn('flex items-center justify-between gap-2', className)} {...props}>
      <span data-slot="metric-card-label" className="flex items-center gap-2 text-xs text-muted-foreground uppercase">
        {icon}
        {children}
      </span>
    </div>
  );
};

interface MetricCardValueProps extends React.ComponentProps<'div'> {
  unit?: React.ReactNode;
}

const MetricCardValue = ({ unit, className, children, ...props }: MetricCardValueProps) => {
  return (
    <div
      data-slot="metric-card-value"
      className={cn(
        'flex items-baseline gap-1 text-3xl font-semibold tracking-[-0.035em] text-foreground tabular-nums',
        className,
      )}
      {...props}
    >
      {children}
      {unit ? (
        <span data-slot="metric-card-unit" className="text-sm font-normal text-muted-foreground">
          {unit}
        </span>
      ) : null}
    </div>
  );
};

interface MetricCardTrendProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  direction: 'up' | 'down' | 'flat';
  tone?: MetricTone;
  children?: React.ReactNode;
}

const MetricCardTrend = ({ direction, tone = 'neutral', className, children, ...props }: MetricCardTrendProps) => {
  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;
  const resolvedTone = resolveMetricTone(tone);

  return (
    <span
      data-slot="metric-card-trend"
      data-direction={direction}
      data-tone={resolvedTone}
      className={cn('inline-flex items-center gap-1 text-xs tabular-nums', toneText[resolvedTone], className)}
      {...props}
    >
      <Icon className="size-3.5 rtl:-scale-x-100" aria-hidden />
      {children}
    </span>
  );
};

interface MetricCardSparkProps extends Omit<React.ComponentProps<'svg'>, 'points'> {
  points: number[];
  tone?: MetricTone;
  /** Fill the area under the line with a faint tint. */
  area?: boolean;
}

const MetricCardSpark = ({ points, tone = 'neutral', area = true, className, ...props }: MetricCardSparkProps) => {
  const values = points.filter(Number.isFinite);
  if (!values.length) return null;
  const series = values.length === 1 ? [values[0], values[0]] : values;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min;
  const width = 100;
  const height = 32;
  const step = width / (series.length - 1);
  const coords = series.map(
    (point, i) => [i * step, range === 0 ? height / 2 : height - ((point - min) / range) * height] as const,
  );
  const line = coords.map(([x, y]) => `${x},${y}`).join(' ');
  const fill = `0,${height} ${line} ${width},${height}`;

  return (
    <svg
      data-slot="metric-card-spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      data-tone={resolveMetricTone(tone)}
      className={cn('h-8 w-full', toneText[resolveMetricTone(tone)], className)}
      {...props}
    >
      {area ? <polygon points={fill} fill="currentColor" className="opacity-10" /> : null}
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

type MetricCardFooterProps = React.ComponentProps<'p'>;

const MetricCardFooter = ({ className, ...props }: MetricCardFooterProps) => {
  return <p data-slot="metric-card-footer" className={cn('text-xs text-muted-foreground', className)} {...props} />;
};

export { MetricCard, MetricCardHeader, MetricCardValue, MetricCardTrend, MetricCardSpark, MetricCardFooter };
