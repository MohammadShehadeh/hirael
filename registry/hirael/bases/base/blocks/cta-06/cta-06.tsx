import * as React from 'react';
import { GitBranch } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const Cta06 = () => {
  return (
    <section data-slot="cta" className="bg-background px-4 py-12 md:px-6">
      <div
        data-slot="cta-panel"
        className={cn(
          ENTER,
          'relative mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-border bg-card md:min-h-80',
        )}
      >
        <div
          aria-hidden
          data-slot="cta-surface"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(120% 120% at 0% 0%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 55%), radial-gradient(100% 100% at 100% 100%, color-mix(in oklch, var(--foreground) 8%, transparent), transparent 60%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, color-mix(in oklch, var(--foreground) 6%, transparent) 0 1px, transparent 1px 14px)',
          }}
        />

        <div className="relative z-10 grid h-full content-center gap-6 px-5 py-8 md:min-h-80 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:px-10">
          <div data-slot="cta-header" className="flex flex-col items-start">
            <span style={stagger(1)} className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>
              Get started
            </span>
            <h2
              style={stagger(2)}
              className={cn(
                ENTER,
                'mt-3 max-w-lg text-start font-serif text-3xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl',
              )}
            >
              Connect a repo and <span className="italic">watch it run.</span>
            </h2>
            <p
              style={stagger(3)}
              className={cn(ENTER, 'mt-3 max-w-xl text-start text-sm text-muted-foreground sm:text-base')}
            >
              Pick a branch and your build, test, and deploy steps show up as a live graph. Most first runs finish in
              under three minutes.
            </p>
          </div>

          <div
            data-slot="cta-actions"
            style={stagger(4)}
            className={cn(
              ENTER,
              'flex w-full flex-wrap items-center gap-3 md:w-auto md:flex-col md:items-end md:gap-2',
            )}
          >
            <Button render={<a href="#" />} nativeButton={false} size="lg" className="w-full rounded-md px-6 sm:w-auto">
              <GitBranch className="size-4" />
              Connect a repository
            </Button>
            <p className="text-xs uppercase text-muted-foreground">Free for public repos</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta06;
