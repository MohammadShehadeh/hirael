import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/registry/hirael/bases/base/components/copy-button';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const REGISTRY_URL = 'https://hirael.com/r/multi-select.json';
const COMMAND = `npx shadcn add ${REGISTRY_URL}`;

const Cta02 = () => {
  return (
    <section data-slot="cta" className="relative isolate overflow-hidden bg-background py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% 50%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)',
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-7 px-6 text-center md:px-10">
        <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>One-line install</span>

        <h2
          style={stagger(1)}
          className={cn(
            ENTER,
            'font-serif text-4xl font-medium leading-[1.03] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl',
          )}
        >
          Make your component layer{' '}
          <span className="relative inline-block">
            <span className="relative z-10 italic">do its job.</span>
            <span aria-hidden className="absolute inset-x-0 bottom-1.5 -z-0 h-3 rounded-full bg-primary/45" />
          </span>
        </h2>

        <p style={stagger(2)} className={cn(ENTER, 'max-w-xl text-base text-muted-foreground')}>
          Hirael fills the obvious gaps in shadcn: the components your team quietly rebuilds project after project, so
          you can spend that time on the work only you can do.
        </p>

        <div
          data-slot="cta-actions"
          style={stagger(3)}
          className={cn(ENTER, 'flex flex-col items-center gap-3 sm:flex-row')}
        >
          <Button render={<a href="#" />} nativeButton={false} size="lg" className="group">
            Browse the registry
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Button>
          <span className="text-xs uppercase text-muted-foreground">
            or{' '}
            <a
              className="underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
              href="#"
            >
              read the install guide
            </a>
          </span>
        </div>

        <div
          data-slot="cta-command"
          dir="ltr"
          style={stagger(4)}
          className={cn(
            ENTER,
            'mt-2 flex w-full max-w-xl min-w-0 items-center gap-3 rounded-full border border-border bg-card/70 py-1.5 ps-5 pe-1.5 backdrop-blur-sm',
          )}
        >
          <span aria-hidden className="shrink-0 select-none font-mono text-xs text-muted-foreground">
            $
          </span>
          <code className="min-w-0 flex-1 truncate text-start font-mono text-xs text-foreground">
            npx shadcn add <span className="text-muted-foreground">{REGISTRY_URL}</span>
          </code>
          <CopyButton value={COMMAND} size="md" className="shrink-0" />
        </div>
      </div>
    </section>
  );
};

export default Cta02;
