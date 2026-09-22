'use client';

import * as React from 'react';
import { Bell, CalendarClock, FlaskConical, Hammer, Rocket, Sparkles, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface StepSetting {
  label: string;
  value: string;
}

interface Cell {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  settings?: readonly StepSetting[];
}

const CELLS: readonly Cell[] = [
  {
    icon: Hammer,
    title: 'Build',
    settings: [
      { label: 'Runner', value: 'Linux, 8 cores' },
      { label: 'Cache', value: 'Per branch, kept 7 days' },
      { label: 'Timeout', value: '20 minutes' },
      { label: 'Needs', value: 'Checkout' },
    ],
    description: 'Compile, bundle and containerize with per-branch caches that survive between runs.',
    className: 'md:col-span-2',
  },
  {
    icon: FlaskConical,
    title: 'Test',
    settings: [
      { label: 'Runners', value: '4 in parallel' },
      { label: 'Split by', value: 'Previous run time' },
      { label: 'Retries', value: '1 per failed shard' },
      { label: 'Needs', value: 'Build' },
    ],
    description: 'Split suites across parallel runners and merge the reports back into one view.',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    settings: [
      { label: 'Environment', value: 'Production' },
      { label: 'Approval', value: '1 reviewer from Platform' },
      { label: 'Rollout', value: '10%, then 100% after 15 minutes' },
      { label: 'Needs', value: 'Test' },
    ],
    description: 'Gate releases on approvals, roll out per environment, roll back from the graph.',
  },
  {
    icon: Bell,
    title: 'Notify',
    settings: [
      { label: 'On failure', value: 'Author of the last commit' },
      { label: 'On recovery', value: 'Same thread, one message' },
      { label: 'Quiet hours', value: '22:00 to 07:00' },
      { label: 'Needs', value: 'Deploy' },
    ],
    description: 'Route failures to the people who can fix them, not a channel everyone mutes.',
  },
  {
    icon: CalendarClock,
    title: 'Schedule',
    settings: [
      { label: 'Runs', value: 'Every night at 02:00 UTC' },
      { label: 'Branch', value: 'main' },
      { label: 'Skip when', value: 'No commits since the last run' },
      { label: 'Starts', value: 'Build' },
    ],
    description: 'Nightly builds, weekly cleanups and cron-style triggers without a separate service.',
  },
  {
    icon: Sparkles,
    title: 'More on the way',
    description:
      'Matrix expansion, reusable sub-graphs and self-hosted runners are in progress. The catalog grows without config changes.',
    className: 'md:col-span-3',
  },
];

/** Crosshair frame: lines extend past the padded box and clip at the cell edge. */
const CellFrame = () => {
  return (
    <div className="pointer-events-none absolute inset-[calc(var(--box-padding)-1px)] z-0">
      <div className="absolute start-1/2 top-0 h-px w-[200%] bg-border ltr:-translate-x-1/2 rtl:translate-x-1/2" />
      <div className="absolute bottom-0 start-1/2 h-px w-[200%] bg-border ltr:-translate-x-1/2 rtl:translate-x-1/2" />
      <div className="absolute start-0 top-1/2 h-[200%] w-px -translate-y-1/2 bg-border" />
      <div className="absolute end-0 top-1/2 h-[200%] w-px -translate-y-1/2 bg-border" />
    </div>
  );
};

const Feature09 = () => {
  const [selected, setSelected] = React.useState(CELLS[0].title);
  const selectedCell = CELLS.find((cell) => cell.title === selected) ?? CELLS[0];

  return (
    <section
      data-slot="feature"
      className="flex w-full flex-col justify-center gap-12 bg-background px-6 py-16 md:px-10 md:py-24"
    >
      <div data-slot="feature-header" className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <Badge variant="outline" className={ENTER}>
          Step catalog
        </Badge>
        <h2
          style={stagger(1)}
          className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl')}
        >
          One graph, every stage
        </h2>
        <p style={stagger(2)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground md:text-lg')}>
          Steps are typed, so the canvas knows what connects to what. Pick a stage to see the settings it comes with.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="grid w-full grid-cols-1 gap-px bg-border p-px md:grid-cols-3">
          {CELLS.map((cell, index) => {
            const isSelected = cell.settings !== undefined && cell.title === selectedCell.title;
            const body = (
              <>
                <div className="z-1 size-full">
                  <div className="relative flex size-full min-h-32 items-center justify-center overflow-hidden">
                    <cell.icon
                      aria-hidden
                      className={cn(
                        'size-14 stroke-[1.2] transition-colors duration-150 group-hover:text-warm',
                        isSelected ? 'text-warm' : 'text-muted-foreground/50',
                      )}
                    />
                  </div>
                </div>
                <div className="relative min-h-24 p-3">
                  <h3 className="mb-1 text-base font-semibold text-foreground md:text-lg">{cell.title}</h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{cell.description}</p>
                  <div className="absolute start-1/2 top-0 h-px w-screen bg-border ltr:-translate-x-1/2 rtl:translate-x-1/2" />
                </div>
                <CellFrame />
              </>
            );
            const cellClassName = cn(
              ENTER,
              'group relative flex flex-col justify-between overflow-hidden bg-background p-(--box-padding) text-start [--box-padding:1rem]',
              cell.className,
            );

            if (!cell.settings) {
              return (
                <div
                  key={cell.title}
                  data-slot="feature-cell"
                  style={stagger(index, 60, 180)}
                  className={cellClassName}
                >
                  {body}
                </div>
              );
            }

            return (
              <button
                key={cell.title}
                type="button"
                data-slot="feature-cell"
                data-selected={isSelected || undefined}
                aria-pressed={isSelected}
                onClick={() => setSelected(cell.title)}
                style={stagger(index, 60, 180)}
                className={cn(
                  cellClassName,
                  'cursor-pointer outline-none transition-colors duration-150 hover:bg-muted/30 focus-visible:bg-muted/30 data-selected:bg-muted/40',
                )}
              >
                {body}
              </button>
            );
          })}
        </div>

        <div
          data-slot="feature-step-settings"
          aria-live="polite"
          style={stagger(CELLS.length, 60, 180)}
          className={cn(ENTER, 'border border-border bg-card/40')}
        >
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
            <span className="text-xs uppercase text-muted-foreground">Step settings</span>
            <span key={selectedCell.title} className={cn(SWAP, 'text-sm font-medium')}>
              {selectedCell.title}
            </span>
          </div>
          <dl key={selectedCell.title} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {selectedCell.settings?.map((row, index) => (
              <div
                key={row.label}
                style={stagger(index, 40)}
                className={cn(
                  SWAP,
                  'flex flex-col gap-1 border-border px-5 py-4 max-sm:not-first:border-t sm:max-lg:nth-[n+3]:border-t lg:not-first:border-s',
                )}
              >
                <dt className="text-xs text-muted-foreground">{row.label}</dt>
                <dd className="text-sm">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Feature09;
