import * as React from 'react';
import { ArrowRight, Boxes, Code2, Database, Layers, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/hirael/bases/radix/ui/tooltip';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const REVEAL =
  'animate-in fade-in zoom-in-90 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const STATS = [
  { value: '7', label: 'Years in frontend' },
  { value: '50+', label: 'Products shipped' },
  { value: '4', label: 'Design systems built' },
] as const;

const STACK = [
  { name: 'React and Next.js', icon: Layers },
  { name: 'Component libraries', icon: Boxes },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Postgres and APIs', icon: Database },
] as const;

const GeometricAccent = () => {
  return (
    <div data-slot="hero-accent" aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* A glow behind each nest of squares, so the corners carry color and not
          just a hairline that all but disappears on a light canvas. */}
      <div className="absolute -top-40 start-[-10rem] size-120 rounded-full bg-primary opacity-20 blur-3xl" />
      <div className="absolute -bottom-40 end-[-10rem] size-120 rounded-full bg-accent-cool opacity-15 blur-3xl" />

      <div style={stagger(0, 0, 150)} className={cn(REVEAL, 'absolute -top-20 start-[-5rem] size-80')}>
        <div className="absolute inset-0 rotate-45 border border-primary/40" />
        <div className="absolute inset-4 rotate-45 border border-primary/25" />
        <div className="absolute inset-8 rotate-45 border border-primary/15" />
      </div>

      <div style={stagger(0, 0, 250)} className={cn(REVEAL, 'absolute -bottom-20 end-[-5rem] size-80')}>
        <div className="absolute inset-0 rotate-12 border border-accent-cool/40" />
        <div className="absolute inset-4 rotate-12 border border-accent-cool/25" />
        <div className="absolute inset-8 rotate-12 border border-accent-cool/15" />
      </div>
    </div>
  );
};

const Hero06 = () => {
  return (
    <section
      data-slot="hero"
      className="relative isolate overflow-hidden bg-background px-6 py-20 text-center text-foreground md:px-10 md:py-28"
    >
      <GeometricAccent />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6">
        <Badge variant="secondary" className={ENTER} asChild>
          <a href="#">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-cool opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-cool" />
            </span>
            Available for work
          </a>
        </Badge>

        <div style={stagger(1)} className={cn(ENTER, 'space-y-4')}>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
            Frontend engineer building{' '}
            <span className="italic text-foreground underline decoration-primary decoration-2 underline-offset-8 dark:text-primary dark:no-underline">
              fast, accessible
            </span>{' '}
            web apps.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
            I work with product teams on interfaces, component libraries, and the performance budgets that keep them
            quick.
          </p>
        </div>

        <div
          data-slot="hero-stats"
          style={stagger(2)}
          className={cn(ENTER, 'flex items-center justify-center gap-3 md:gap-10')}
        >
          {STATS.map((stat, index) => (
            <React.Fragment key={stat.label}>
              {index > 0 ? (
                <div
                  aria-hidden
                  className="h-12 w-px shrink-0 bg-linear-to-b from-transparent via-border to-transparent"
                />
              ) : null}
              <div data-slot="hero-stat" className="text-center">
                <span
                  dir="ltr"
                  className="block font-serif text-2xl font-semibold tabular-nums text-foreground dark:text-primary md:text-4xl"
                >
                  {stat.value}
                </span>
                <span className="mt-1 block text-xs uppercase text-muted-foreground sm:whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div
          data-slot="hero-actions"
          style={stagger(3)}
          className={cn(ENTER, 'mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4')}
        >
          <Button asChild size="lg" className="group w-full sm:w-auto">
            <a href="#">
              View experience
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="group w-full sm:w-auto">
            <a href="#">
              View projects
              <Sparkles className="size-4 transition-transform duration-150 group-hover:rotate-12 motion-reduce:group-hover:rotate-0" />
            </a>
          </Button>
        </div>

        <div data-slot="hero-stack" style={stagger(4)} className={cn(ENTER, 'mt-6 w-full max-w-2xl space-y-3')}>
          <p className="text-xs uppercase text-muted-foreground">Core stack</p>
          <div className="flex items-center gap-4">
            <div
              aria-hidden
              className="hidden h-px flex-1 bg-linear-to-r from-transparent to-border md:block rtl:bg-linear-to-l"
            />
            <div className="flex flex-1 flex-wrap items-center justify-center gap-5 md:flex-none">
              {STACK.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={item.name}
                      className="rounded text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <item.icon className="size-6" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{item.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <div
              aria-hidden
              className="hidden h-px flex-1 bg-linear-to-l from-transparent to-border md:block rtl:bg-linear-to-r"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero06;
