'use client';

import * as React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Sparkline } from '@/registry/hirael/bases/radix/components/sparkline';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const RANGES = [
  { value: '4w', label: '4w', long: 'Last 4 weeks' },
  { value: '12w', label: '12w', long: 'Last 12 weeks' },
  { value: '52w', label: '52w', long: 'Last 52 weeks' },
] as const;

type Range = (typeof RANGES)[number]['value'];

interface Reading {
  value: string;
  delta: string;
  direction: 'up' | 'down';
  /** Down is not always bad: p95 latency falling is the win. */
  good: boolean;
  data: number[];
}

interface Stat {
  label: string;
  caption: string;
  readings: Record<Range, Reading>;
}

const STATS: readonly Stat[] = [
  {
    label: 'Weekly installs',
    caption: 'across 3,100 repositories',
    readings: {
      '4w': { value: '41,280', delta: '+6.2%', direction: 'up', good: true, data: [38, 39, 37, 40, 41, 39, 42, 41] },
      '12w': {
        value: '41,280',
        delta: '+18.4%',
        direction: 'up',
        good: true,
        data: [18, 21, 20, 26, 25, 31, 29, 34, 38, 37, 41, 44],
      },
      '52w': {
        value: '41,280',
        delta: '+212%',
        direction: 'up',
        good: true,
        data: [9, 10, 12, 13, 15, 17, 20, 22, 26, 30, 35, 41],
      },
    },
  },
  {
    label: 'p95 install time',
    caption: 'from command to file on disk',
    readings: {
      '4w': { value: '2.4s', delta: '-8%', direction: 'down', good: true, data: [27, 26, 27, 25, 26, 25, 24, 24] },
      '12w': {
        value: '2.4s',
        delta: '-31%',
        direction: 'down',
        good: true,
        data: [62, 58, 55, 51, 48, 44, 41, 38, 33, 30, 27, 24],
      },
      '52w': {
        value: '2.4s',
        delta: '-64%',
        direction: 'down',
        good: true,
        data: [67, 66, 61, 58, 52, 49, 44, 40, 35, 31, 27, 24],
      },
    },
  },
  {
    label: 'Components shipped',
    caption: 'in two parallel bases',
    readings: {
      '4w': { value: '9', delta: '+2', direction: 'up', good: true, data: [1, 3, 2, 3] },
      '12w': { value: '34', delta: '+11', direction: 'up', good: true, data: [2, 3, 1, 4, 2, 3, 3, 2, 4, 3, 5, 2] },
      '52w': {
        value: '118',
        delta: '+47',
        direction: 'up',
        good: true,
        data: [6, 8, 7, 9, 11, 10, 9, 12, 10, 11, 12, 13],
      },
    },
  },
  {
    label: 'Open issues',
    caption: 'median age under four days',
    readings: {
      '4w': { value: '14', delta: '+5', direction: 'up', good: false, data: [9, 10, 9, 11, 12, 11, 13, 14] },
      '12w': {
        value: '14',
        delta: '-8',
        direction: 'down',
        good: true,
        data: [22, 24, 21, 19, 18, 16, 12, 10, 9, 11, 13, 14],
      },
      '52w': {
        value: '14',
        delta: '-21',
        direction: 'down',
        good: true,
        data: [35, 38, 33, 31, 28, 27, 24, 22, 18, 12, 11, 14],
      },
    },
  },
];

const Stats02 = () => {
  const headingId = React.useId();
  const [range, setRange] = React.useState<Range>('12w');
  const rangeLabel = RANGES.find((option) => option.value === range)?.long ?? RANGES[1].long;

  return (
    <section data-slot="stats" className="bg-background py-20 sm:py-28" aria-labelledby={headingId}>
      <div className="container w-full">
        <div data-slot="stats-header" className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p key={range} className={cn(SWAP, 'text-xs uppercase text-muted-foreground')}>
              {rangeLabel}
            </p>
            <h2
              id={headingId}
              style={stagger(1)}
              className={cn(ENTER, 'mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl')}
            >
              The numbers behind the registry
            </h2>
            <p style={stagger(2)} className={cn(ENTER, 'mt-4 text-muted-foreground')}>
              Every figure is read straight from the release pipeline, so the chart and the headline can never disagree.
            </p>
          </div>

          <ToggleGroup
            data-slot="stats-range"
            type="single"
            variant="outline"
            size="sm"
            value={range}
            onValueChange={(value) => {
              if (value) setRange(value as Range);
            }}
            aria-label="Time range"
            style={stagger(3)}
            className={cn(ENTER, 'shrink-0')}
          >
            {RANGES.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={option.long}
                className="px-3 text-xs tabular-nums"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <dl
          data-slot="stats-grid"
          className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat, index) => {
            const reading = stat.readings[range];
            const Arrow = reading.direction === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={stat.label}
                data-slot="stats-item"
                style={stagger(index, 60, 180)}
                className={cn(ENTER, 'flex flex-col gap-4 bg-background p-6')}
              >
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <div className="flex items-end justify-between gap-3">
                  <dd key={range} className={cn(SWAP, 'text-3xl font-semibold tabular-nums tracking-tight')}>
                    {reading.value}
                  </dd>
                  <span
                    key={`${range}-delta`}
                    data-slot="stats-delta"
                    data-good={reading.good}
                    dir="ltr"
                    style={stagger(1, 40)}
                    className={cn(
                      SWAP,
                      'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] tabular-nums',
                      reading.good ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
                    )}
                  >
                    <Arrow aria-hidden className="size-3" />
                    {reading.delta}
                  </span>
                </div>
                <Sparkline
                  key={`${range}-chart`}
                  data={reading.data}
                  variant="area"
                  curve
                  tone={reading.good ? 'success' : 'destructive'}
                  label={`${stat.label}, ${rangeLabel.toLowerCase()}`}
                  style={stagger(2, 40)}
                  className={cn(SWAP, 'h-10 w-full')}
                />
                <p className="text-xs text-muted-foreground">{stat.caption}</p>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default Stats02;
