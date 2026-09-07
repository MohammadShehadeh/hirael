'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { Sparkline } from '@/registry/hirael/bases/base/components/sparkline';
import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: string;
  caption: string;
  delta: string;
  direction: 'up' | 'down';
  /** Down is not always bad: p95 latency falling is the win. */
  good: boolean;
  data: number[];
}

const STATS: readonly Stat[] = [
  {
    label: 'Weekly installs',
    value: '41,280',
    caption: 'across 3,100 repositories',
    delta: '+18.4%',
    direction: 'up',
    good: true,
    data: [18, 21, 20, 26, 25, 31, 29, 34, 38, 37, 41, 44],
  },
  {
    label: 'p95 install time',
    value: '2.4s',
    caption: 'from command to file on disk',
    delta: '-31%',
    direction: 'down',
    good: true,
    data: [62, 58, 55, 51, 48, 44, 41, 38, 33, 30, 27, 24],
  },
  {
    label: 'Components shipped',
    value: '212',
    caption: 'in two parallel bases',
    delta: '+34',
    direction: 'up',
    good: true,
    data: [140, 148, 155, 161, 168, 174, 181, 189, 195, 201, 207, 212],
  },
  {
    label: 'Open issues',
    value: '9',
    caption: 'median age under four days',
    delta: '-12',
    direction: 'down',
    good: true,
    data: [28, 26, 27, 23, 21, 22, 18, 17, 14, 12, 11, 9],
  },
];

const Stats02 = () => {
  return (
    <section className="bg-background py-20 sm:py-28" aria-labelledby="stats-02-heading">
      <div className="container w-full">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Last twelve weeks</p>
          <h2 id="stats-02-heading" className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            The numbers behind the registry
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every figure is read straight from the release pipeline, so the chart and the headline can never disagree.
          </p>
        </div>

        <dl className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Arrow = stat.direction === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <div key={stat.label} className="flex flex-col gap-4 bg-background p-6">
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <div className="flex items-end justify-between gap-3">
                  <dd className="font-mono text-3xl font-semibold tabular-nums tracking-tight">{stat.value}</dd>
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-mono text-[10px] tabular-nums',
                      stat.good ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
                    )}
                  >
                    <Arrow aria-hidden className="size-3 rtl:-scale-x-100" />
                    {stat.delta}
                  </span>
                </div>
                <Sparkline
                  data={stat.data}
                  variant="area"
                  curve
                  tone={stat.good ? 'success' : 'destructive'}
                  label={`${stat.label} over the last twelve weeks`}
                  className="h-10 w-full"
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
