'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, Compass, Dna, Gem, Globe, Play, ShieldCheck, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

// Shades of the theme's primary for the backdrop glows. Lightness and chroma are set per mode, because the raw
// primary at low opacity greys out against the background (a brown haze on dark canvases).
const GLOW =
  'bg-[oklch(from_var(--primary)_0.86_calc(c*0.7)_h)] dark:bg-[oklch(from_var(--primary)_0.58_calc(c*0.9)_calc(h-10))]';
const DEPTH =
  'bg-[oklch(from_var(--primary)_0.88_calc(c*0.55)_calc(h-20))] dark:bg-[oklch(from_var(--primary)_0.4_calc(c*0.7)_calc(h-30))]';
const WISP =
  'bg-[oklch(from_var(--primary)_0.92_calc(c*0.45)_calc(h+15))] dark:bg-[oklch(from_var(--primary)_0.7_calc(c*0.8)_calc(h-5))]';

const Hero02Backdrop = dynamic(() => import('./hero-02-backdrop'), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
});

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
// Text only slides: starting it at opacity 0 would hold back Largest Contentful Paint.
const ENTER_TEXT =
  'animate-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

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
      <div aria-hidden data-slot="hero-wash" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'absolute start-1/2 -top-48 size-160 -translate-x-1/2 rounded-full opacity-60 blur-3xl rtl:translate-x-1/2 dark:opacity-30',
            GLOW,
          )}
        />
        <div
          className={cn(
            'absolute -start-32 -bottom-40 size-140 rounded-full opacity-55 blur-3xl dark:opacity-25',
            DEPTH,
          )}
        />
        <div
          className={cn('absolute -end-32 -bottom-32 size-140 rounded-full opacity-50 blur-3xl dark:opacity-20', WISP)}
        />
      </div>
      <div
        aria-hidden
        data-slot="hero-backdrop"
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)] opacity-50 mix-blend-multiply dark:opacity-40 dark:mix-blend-screen"
      >
        <Hero02Backdrop active={active} />
      </div>

      <a
        href="#"
        data-slot="hero-release"
        className={cn(
          ENTER,
          'inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs uppercase backdrop-blur-sm transition-colors duration-150 hover:border-primary/50',
        )}
      >
        <span className="text-primary">New release</span>
        <span aria-hidden className="text-border">
          |
        </span>
        <span dir="ltr" className="text-muted-foreground tabular-nums">
          2026.06
        </span>
      </a>

      <h1
        style={stagger(1)}
        className={cn(
          ENTER_TEXT,
          'mt-8 max-w-4xl font-serif text-5xl leading-[1.04] font-medium tracking-tight sm:text-6xl md:text-7xl',
        )}
      >
        Ship faster with tools that stay{' '}
        <span className="italic underline decoration-border decoration-2 underline-offset-[10px]">out of your way</span>
        .
      </h1>

      <p style={stagger(2)} className={cn(ENTER_TEXT, 'mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground')}>
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
        <p className="text-xs text-muted-foreground uppercase">Used by product teams at</p>
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
