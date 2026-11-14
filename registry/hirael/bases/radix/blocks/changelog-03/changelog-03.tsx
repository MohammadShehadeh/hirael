'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/radix/ui/tabs';

const KINDS = ['Feature', 'Improvement', 'Fix'] as const;

type Kind = (typeof KINDS)[number];

const FILTERS = ['All', ...KINDS] as const;

type Filter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<Filter, string> = {
  All: 'All',
  Feature: 'Features',
  Improvement: 'Improvements',
  Fix: 'Fixes',
};

const KIND_BADGE = {
  Feature: 'default',
  Improvement: 'secondary',
  Fix: 'outline',
} as const satisfies Record<Kind, 'default' | 'secondary' | 'outline'>;

interface Change {
  day: string;
  dateTime: string;
  kind: Kind;
  area: string;
  title: string;
}

interface Month {
  label: string;
  changes: readonly Change[];
}

const MONTHS: readonly Month[] = [
  {
    label: 'November 2026',
    changes: [
      {
        day: 'Nov 12',
        dateTime: '2026-11-12',
        kind: 'Feature',
        area: 'Previews',
        title: 'Comment on any element in a branch preview',
      },
      {
        day: 'Nov 12',
        dateTime: '2026-11-12',
        kind: 'Fix',
        area: 'CLI',
        title: 'Fixed deploys hanging when the lockfile was missing',
      },
      {
        day: 'Nov 9',
        dateTime: '2026-11-09',
        kind: 'Improvement',
        area: 'Builds',
        title: 'Dependency installs reuse the cache across branches',
      },
      {
        day: 'Nov 4',
        dateTime: '2026-11-04',
        kind: 'Improvement',
        area: 'Dashboard',
        title: 'Deployment list loads 50 rows at a time',
      },
      {
        day: 'Nov 2',
        dateTime: '2026-11-02',
        kind: 'Fix',
        area: 'Domains',
        title: 'Fixed renewals failing for wildcard certificates',
      },
    ],
  },
  {
    label: 'October 2026',
    changes: [
      {
        day: 'Oct 28',
        dateTime: '2026-10-28',
        kind: 'Feature',
        area: 'API',
        title: 'Webhooks for deployment and domain events',
      },
      {
        day: 'Oct 21',
        dateTime: '2026-10-21',
        kind: 'Improvement',
        area: 'Logs',
        title: 'Log search keeps your query when you change the time range',
      },
      {
        day: 'Oct 15',
        dateTime: '2026-10-15',
        kind: 'Fix',
        area: 'Billing',
        title: 'Fixed invoices showing the wrong seat count after a downgrade',
      },
      {
        day: 'Oct 6',
        dateTime: '2026-10-06',
        kind: 'Feature',
        area: 'Teams',
        title: 'Roles per project, not only per workspace',
      },
    ],
  },
  {
    label: 'September 2026',
    changes: [
      {
        day: 'Sep 30',
        dateTime: '2026-09-30',
        kind: 'Improvement',
        area: 'Builds',
        title: 'Build minutes are counted per second, not per minute',
      },
      {
        day: 'Sep 18',
        dateTime: '2026-09-18',
        kind: 'Fix',
        area: 'Previews',
        title: 'Fixed previews serving a stale build after a force push',
      },
      {
        day: 'Sep 9',
        dateTime: '2026-09-09',
        kind: 'Feature',
        area: 'CLI',
        title: 'hirael logs follows a deployment from your terminal',
      },
    ],
  },
  {
    label: 'August 2026',
    changes: [
      {
        day: 'Aug 26',
        dateTime: '2026-08-26',
        kind: 'Feature',
        area: 'Domains',
        title: 'Buy and connect a domain without leaving the dashboard',
      },
      {
        day: 'Aug 11',
        dateTime: '2026-08-11',
        kind: 'Improvement',
        area: 'API',
        title: 'List endpoints return a cursor instead of page numbers',
      },
    ],
  },
];

const INITIAL_MONTHS = 2;

const ENTER =
  'animate-in fade-in slide-in-from-bottom-3 duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

const isFilter = (value: string): value is Filter => FILTERS.some((filter) => filter === value);

const countFor = (filter: Filter) =>
  MONTHS.reduce(
    (sum, month) => sum + month.changes.filter((change) => filter === 'All' || change.kind === filter).length,
    0,
  );

interface MonthSectionProps {
  month: Month;
}

const MonthSection = ({ month }: MonthSectionProps) => (
  <section
    data-slot="changelog-month"
    aria-label={month.label}
    className={cn(ENTER, 'grid gap-x-10 gap-y-3 border-t border-border py-6 md:grid-cols-[11rem_1fr]')}
  >
    <h3 className="flex items-baseline gap-2 text-sm font-medium md:sticky md:top-6 md:self-start">
      {month.label}
      <span className="text-xs font-normal text-muted-foreground tabular-nums">{month.changes.length}</span>
    </h3>
    <ul className="flex flex-col">
      {month.changes.map((change) => (
        <li key={change.title} className="border-b border-border last:border-b-0">
          <a
            href="#"
            data-slot="changelog-change"
            className={cn(
              'group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 gap-y-1 rounded-sm py-3 sm:grid-cols-[3.5rem_6.5rem_1fr_auto]',
              FOCUS_RING,
            )}
          >
            <time dateTime={change.dateTime} className="text-sm text-muted-foreground tabular-nums">
              {change.day}
            </time>
            <span className="col-start-2 row-start-2 sm:col-start-auto sm:row-start-auto">
              <Badge variant={KIND_BADGE[change.kind]}>{change.kind}</Badge>
            </span>
            <span className="text-sm text-pretty group-hover:underline group-hover:underline-offset-4">
              {change.title}
            </span>
            <span className="hidden text-xs text-muted-foreground uppercase sm:inline">{change.area}</span>
          </a>
        </li>
      ))}
    </ul>
  </section>
);

const Changelog03 = () => {
  const [filter, setFilter] = React.useState<Filter>('All');
  const [monthCount, setMonthCount] = React.useState(INITIAL_MONTHS);

  const months = MONTHS.slice(0, monthCount)
    .map((month) => ({
      ...month,
      changes: month.changes.filter((change) => filter === 'All' || change.kind === filter),
    }))
    .filter((month) => month.changes.length > 0);
  const hasOlder = monthCount < MONTHS.length;

  return (
    <section data-slot="changelog" className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 md:px-10">
        <header className="flex flex-col gap-4">
          <span className="text-xs text-muted-foreground uppercase">Changelog</span>
          <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">What changed, by month.</h2>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Every release in one line. Open any entry for the details and the upgrade notes.
          </p>
        </header>

        <Tabs
          value={filter}
          onValueChange={(next) => {
            if (isFilter(next)) setFilter(next);
          }}
          aria-label="Filter changes by type"
        >
          <TabsList>
            {FILTERS.map((item) => (
              <TabsTrigger key={item} value={item}>
                {FILTER_LABELS[item]}
                <span className="text-xs text-muted-foreground tabular-nums">{countFor(item)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div key={filter} data-slot="changelog-months" className="flex flex-col border-b border-border">
          {months.map((month) => (
            <MonthSection key={month.label} month={month} />
          ))}
          {months.length === 0 && (
            <p className="border-t border-border py-6 text-sm text-muted-foreground">
              No {FILTER_LABELS[filter].toLowerCase()} in these months. Load older months to keep looking.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing <span className="tabular-nums">{Math.min(monthCount, MONTHS.length)}</span> of{' '}
            <span className="tabular-nums">{MONTHS.length}</span> months
          </p>
          {hasOlder ? (
            <Button variant="outline" size="sm" onClick={() => setMonthCount((count) => count + 1)}>
              Show an older month
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setMonthCount(INITIAL_MONTHS)}>
              Show fewer
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Changelog03;
