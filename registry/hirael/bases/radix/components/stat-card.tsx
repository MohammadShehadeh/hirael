'use client';

import * as React from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';

export type StatCardTrend = 'up' | 'down' | 'flat';

export type StatCardTone = 'neutral' | 'info' | 'success' | 'warning' | 'destructive';

const toneText: Record<StatCardTone, string> = {
  neutral: 'text-muted-foreground',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

type StatCardProps = React.ComponentProps<'div'>;

const StatCard = ({ className, ...props }: StatCardProps) => {
  return (
    <div
      data-slot="stat-card"
      className={cn('flex flex-col gap-2 rounded-md border border-border bg-card p-5 text-card-foreground', className)}
      {...props}
    />
  );
};

type StatCardLabelProps = React.ComponentProps<'p'>;

const StatCardLabel = ({ className, ...props }: StatCardLabelProps) => {
  return (
    <p data-slot="stat-card-label" className={cn('text-xs text-muted-foreground uppercase', className)} {...props} />
  );
};

type StatCardValueProps = React.ComponentProps<'p'>;

const StatCardValue = ({ className, ...props }: StatCardValueProps) => {
  return (
    <p
      data-slot="stat-card-value"
      className={cn('text-3xl font-semibold tracking-[-0.035em] text-foreground tabular-nums', className)}
      {...props}
    />
  );
};

interface StatCardDeltaProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  trend: StatCardTrend;
  tone?: StatCardTone;
  children?: React.ReactNode;
}

const StatCardDelta = ({ trend, tone = 'neutral', className, children, ...props }: StatCardDeltaProps) => {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <span
      data-slot="stat-card-delta"
      data-trend={trend}
      data-tone={tone}
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-sm bg-accent px-1.5 py-0.5 text-[11px] leading-none tabular-nums',
        toneText[tone],
        className,
      )}
      {...props}
    >
      <Icon className="size-3 rtl:-scale-x-100" aria-hidden />
      {children}
    </span>
  );
};

export { StatCard, StatCardLabel, StatCardValue, StatCardDelta };
