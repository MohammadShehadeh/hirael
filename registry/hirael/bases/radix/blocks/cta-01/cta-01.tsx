import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const COMMAND = 'npx shadcn add https://hirael.com/r/multi-select.json';

const Cta01 = () => {
  return (
    <section data-slot="cta" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div
          data-slot="cta-panel"
          className={cn(
            ENTER,
            'relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_70px_-40px_color-mix(in_oklch,var(--foreground)_30%,transparent)]',
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_60%)]"
          />

          <div className="relative grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-16 lg:p-14">
            <div data-slot="cta-header" className="flex flex-col gap-5 lg:col-span-7">
              <span style={stagger(1)} className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>
                Get started
              </span>
              <h2
                style={stagger(2)}
                className={cn(
                  ENTER,
                  'font-serif text-4xl leading-[1.04] font-medium tracking-tight sm:text-5xl md:text-6xl',
                )}
              >
                Stop rebuilding the components every project needs.
              </h2>
              <p style={stagger(3)} className={cn(ENTER, 'max-w-xl text-sm text-muted-foreground sm:text-base')}>
                Pull a real multi-select, year picker, or tag input into your repo in one command. No package, no
                version pin. Just the source, in your codebase, yours to shape.
              </p>
            </div>

            <div
              data-slot="cta-actions"
              style={stagger(4)}
              className={cn(ENTER, 'flex min-w-0 flex-col gap-3 lg:col-span-5')}
            >
              <div
                data-slot="cta-command"
                dir="ltr"
                className="flex min-w-0 items-center gap-3 rounded-full border border-border bg-background/60 py-1.5 ps-5 pe-1.5"
              >
                <span aria-hidden className="text-sm text-muted-foreground select-none">
                  $
                </span>
                <span className="min-w-0 flex-1 truncate text-sm tabular-nums">{COMMAND}</span>
                <CopyButton value={COMMAND} size="md" className="shrink-0" />
              </div>
              <Button asChild variant="outline" size="lg" className="group w-full">
                <a href="#">
                  Browse blocks
                  <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </a>
              </Button>
              <p className="text-center text-xs text-muted-foreground uppercase lg:text-end">No runtime dependency</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta01;
