'use client';

import { Bell, CalendarClock, FlaskConical, Hammer, Rocket, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

const CELLS = [
  {
    icon: Hammer,
    title: 'Build',
    description: 'Compile, bundle and containerize with per-branch caches that survive between runs.',
    className: 'md:col-span-2',
  },
  {
    icon: FlaskConical,
    title: 'Test',
    description: 'Split suites across parallel runners and merge the reports back into one view.',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description: 'Gate releases on approvals, roll out per environment, roll back from the graph.',
  },
  {
    icon: Bell,
    title: 'Notify',
    description: 'Route failures to the people who can fix them, not a channel everyone mutes.',
  },
  {
    icon: CalendarClock,
    title: 'Schedule',
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
  return (
    <section
      data-slot="feature"
      className="flex w-full flex-col justify-center gap-12 bg-background px-6 py-16 md:px-10 md:py-24"
    >
      <div data-slot="feature-header" className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <Badge
          variant="outline"
          className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          Step catalog
        </Badge>
        <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
          One graph, every stage
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Steps are typed, so the canvas knows what connects to what. Pick a stage, wire it in, and the pipeline stays
          legible.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-px bg-border p-px md:grid-cols-3">
        {CELLS.map((cell) => (
          <div
            key={cell.title}
            data-slot="feature-cell"
            className={cn(
              'relative flex flex-col justify-between overflow-hidden bg-background p-(--box-padding) [--box-padding:1rem]',
              cell.className,
            )}
          >
            <div className="z-1 size-full">
              <div className="group relative flex size-full min-h-32 items-center justify-center overflow-hidden">
                <cell.icon
                  aria-hidden
                  className="size-14 stroke-[1.2] text-muted-foreground/50 transition-colors duration-300 group-hover:text-warm"
                />
              </div>
            </div>
            <div className="relative min-h-24 p-3">
              <h3 className="mb-1 text-base font-semibold text-foreground md:text-lg">{cell.title}</h3>
              <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {cell.description}
              </p>
              <div className="absolute start-1/2 top-0 h-px w-screen bg-border ltr:-translate-x-1/2 rtl:translate-x-1/2" />
            </div>
            <CellFrame />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feature09;
