import { Terminal, FileCode2, Rocket, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Step {
  icon: LucideIcon;
  title: string;
  body: string;
}

const STEPS: readonly Step[] = [
  {
    icon: Terminal,
    title: 'Run one command',
    body: 'Point the shadcn CLI at any Hirael item. It resolves the registry and writes the source straight into your repo.',
  },
  {
    icon: FileCode2,
    title: 'Own the source',
    body: 'The component lands as plain TSX in your components folder. No package pin, no version drift, yours to edit.',
  },
  {
    icon: Rocket,
    title: 'Compose and ship',
    body: 'Build with the compound parts, restyle against your own tokens, and deploy. Nothing phones home.',
  },
];

const Process01 = () => {
  return (
    <section data-slot="process" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div className="flex max-w-2xl flex-col gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">how it works</span>
          <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            From install to shipped in three steps.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Hirael rides the shadcn CLI you already use. No new tooling, no runtime to learn.
          </p>
        </div>

        <ol data-slot="process-steps" className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const last = i === STEPS.length - 1;
            return (
              <li key={step.title} data-slot="process-step" className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <span
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-card font-serif text-xl text-foreground tabular-nums"
                    style={{
                      boxShadow: 'inset 0 1px 0 0 color-mix(in oklch, var(--foreground) 12%, transparent)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden className={cn('h-px flex-1 bg-border', last ? 'hidden' : 'hidden sm:block')} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Process01;
