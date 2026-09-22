'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Progress } from '@/registry/hirael/bases/base/ui/progress';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type Period = 'quarter' | 'year';

interface Metric {
  name: string;
  current: number;
  target: number;
  format: (value: number) => string;
  unit: string;
  context: string;
}

const count = (value: number) => value.toLocaleString('en-US');
const money = (value: number) => `$${Math.round(value / 1000)}k`;
const percent = (value: number) => `${value}%`;

const PERIODS: Record<Period, { caption: string; metrics: readonly Metric[] }> = {
  quarter: {
    caption: 'Q3 2026 targets, July to September',
    metrics: [
      {
        name: 'Paid seats',
        current: 8412,
        target: 10000,
        format: count,
        unit: 'seats',
        context: 'Up 18% since June',
      },
      {
        name: 'Monthly recurring revenue',
        current: 412000,
        target: 450000,
        format: money,
        unit: '',
        context: 'Up $61k since June',
      },
      {
        name: 'Teams on annual plans',
        current: 214,
        target: 250,
        format: count,
        unit: 'teams',
        context: '31 switched from monthly this quarter',
      },
      {
        name: 'Net revenue retention',
        current: 112,
        target: 110,
        format: percent,
        unit: 'target',
        context: 'Expansion outpaced churn for the fourth quarter running',
      },
    ],
  },
  year: {
    caption: '2026 targets, January to December',
    metrics: [
      {
        name: 'Paid seats',
        current: 8412,
        target: 12000,
        format: count,
        unit: 'seats',
        context: 'Up 64% since January',
      },
      {
        name: 'Monthly recurring revenue',
        current: 412000,
        target: 600000,
        format: money,
        unit: '',
        context: 'Up $158k since January',
      },
      {
        name: 'Teams on annual plans',
        current: 214,
        target: 400,
        format: count,
        unit: 'teams',
        context: 'Most renewals land in November',
      },
      {
        name: 'Net revenue retention',
        current: 112,
        target: 120,
        format: percent,
        unit: 'target',
        context: 'Held above 105% every month this year',
      },
    ],
  },
};

const Stats03 = () => {
  const [period, setPeriod] = React.useState<Period>('quarter');
  const [filled, setFilled] = React.useState(false);
  const { caption, metrics } = PERIODS[period];

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section data-slot="stats" className="bg-background py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div data-slot="stats-story" className="flex max-w-md flex-col gap-4">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Growth</span>
          <h2
            style={stagger(1, 70)}
            className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
          >
            Eighteen months, 8,412 seats
          </h2>
          <p style={stagger(2, 70)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            We sent the first invoice in March 2025 to a team of six. Today 1,140 companies pay for Northbeam, and most
            of them started on the free plan with fewer than ten people before rolling it out to other departments.
          </p>
          <a
            href="#"
            style={stagger(3, 70)}
            className={cn(
              ENTER,
              'group/link mt-2 inline-flex items-center gap-1.5 self-start rounded-sm text-sm font-medium text-foreground transition-colors duration-150 hover:text-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            Read the Q3 investor update
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-150 group-hover/link:translate-x-0.5 rtl:rotate-180 rtl:group-hover/link:-translate-x-0.5"
            />
          </a>
        </div>

        <div data-slot="stats-metrics" style={stagger(0, 0, 240)} className={cn(ENTER, 'flex flex-col')}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <span key={period} className={cn(SWAP, 'text-sm text-muted-foreground')}>
              {caption}
            </span>
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[period]}
              onValueChange={([value]) => {
                if (value) setPeriod(value as Period);
              }}
              aria-label="Period"
            >
              <ToggleGroupItem value="quarter" className="px-3 text-xs">
                Quarter
              </ToggleGroupItem>
              <ToggleGroupItem value="year" className="px-3 text-xs">
                Year
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <ul className="flex flex-col">
            {metrics.map((metric, index) => {
              const ratio = Math.round((metric.current / metric.target) * 100);
              const met = ratio >= 100;
              return (
                <li
                  key={metric.name}
                  data-slot="stats-metric"
                  className="flex flex-col gap-3 border-b border-border py-5 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <span
                      key={`${period}-ratio`}
                      dir="ltr"
                      className={cn(SWAP, 'text-sm font-medium tabular-nums', met ? 'text-success' : 'text-foreground')}
                    >
                      {ratio}%
                    </span>
                  </div>
                  <Progress
                    value={filled ? Math.min(ratio, 100) : 0}
                    aria-label={`${metric.name}, ${ratio}% of target`}
                    className={cn(
                      'h-1.5 bg-muted',
                      '**:data-[slot=progress-indicator]:delay-(--bar-delay) **:data-[slot=progress-indicator]:duration-700 **:data-[slot=progress-indicator]:ease-[cubic-bezier(0.22,1,0.36,1)] **:data-[slot=progress-indicator]:motion-reduce:transition-none',
                      met
                        ? '**:data-[slot=progress-indicator]:bg-success'
                        : '**:data-[slot=progress-indicator]:bg-foreground',
                    )}
                    style={{ '--bar-delay': `${index * 60}ms` } as React.CSSProperties}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                    <span key={`${period}-value`} className={cn(SWAP, 'tabular-nums text-foreground')}>
                      <span dir="ltr">{metric.format(metric.current)}</span>
                      <span className="text-muted-foreground">
                        {' of '}
                        <span dir="ltr">{metric.format(metric.target)}</span>
                        {metric.unit && ` ${metric.unit}`}
                      </span>
                    </span>
                    <span key={`${period}-context`} className={cn(SWAP, 'text-muted-foreground')}>
                      {metric.context}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Stats03;
