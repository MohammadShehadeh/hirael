'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Compass, Dna, Gem, Globe, Play, ShieldCheck, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const Hero02Backdrop = dynamic(() => import('./hero-02-backdrop'), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
});

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const WORDMARKS = [
  { name: 'Helix', icon: Dna },
  { name: 'Northwind', icon: Compass },
  { name: 'Vanta', icon: ShieldCheck },
  { name: 'Quartz', icon: Gem },
  { name: 'Lumen', icon: Sun },
  { name: 'Atlas', icon: Globe },
] as const;

const Hero02 = () => {
  const [active, setActive] = React.useState(false);

  return (
    <section
      data-slot="hero"
      className="relative isolate flex min-h-[640px] flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-center text-foreground md:px-10"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div
        aria-hidden
        data-slot="hero-wash"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_8%,color-mix(in_oklch,var(--primary)_30%,transparent),transparent_64%),radial-gradient(60%_60%_at_10%_92%,color-mix(in_oklch,var(--accent-cool)_28%,transparent),transparent_68%),radial-gradient(60%_60%_at_90%_80%,color-mix(in_oklch,var(--chart-2)_20%,transparent),transparent_68%)]"
      />
      <div
        aria-hidden
        data-slot="hero-backdrop"
        className="pointer-events-none absolute inset-0 opacity-50 mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)] dark:opacity-40 dark:mix-blend-screen"
      >
        <Hero02Backdrop active={active} />
      </div>

      <a
        href="#"
        data-slot="hero-release"
        className={cn(
          ENTER,
          'inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs uppercase backdrop-blur-sm transition-colors duration-150 hover:border-warm/50',
        )}
      >
        <span className="text-warm">New release</span>
        <span aria-hidden className="text-border">
          |
        </span>
        <span dir="ltr" className="tabular-nums text-muted-foreground">
          2026.06
        </span>
      </a>

      <h1
        style={stagger(1)}
        className={cn(
          ENTER,
          'mt-8 max-w-4xl font-serif text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl',
        )}
      >
        Ship faster with tools that stay{' '}
        <span className="italic underline decoration-border decoration-2 underline-offset-[10px]">out of your way</span>
        .
      </h1>

      <p style={stagger(2)} className={cn(ENTER, 'mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground')}>
        A focused toolkit for teams that would rather build than configure. Sensible defaults, no busywork.
      </p>

      <div
        data-slot="hero-actions"
        style={stagger(3)}
        className={cn(ENTER, 'mt-10 flex flex-col items-center gap-3 sm:flex-row')}
      >
        <Button asChild size="lg" className="group">
          <a href="#">
            Get started
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </a>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <a href="#">
            <Play className="size-4" />
            Watch demo
          </a>
        </Button>
      </div>

      <div data-slot="hero-logos" style={stagger(4)} className={cn(ENTER, 'mt-16 flex flex-col items-center gap-5')}>
        <p className="text-xs uppercase text-muted-foreground">Used by product teams at</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {WORDMARKS.map((w) => (
            <span
              key={w.name}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              <w.icon aria-hidden className="size-4" />
              {w.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero02;
