import * as React from 'react';
import { ArrowRight, Compass, Dna, Gem, ShieldCheck, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
// Text only slides: starting it at opacity 0 would hold back Largest Contentful Paint.
const ENTER_TEXT =
  'animate-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const LOGOS = [
  { name: 'Helix', icon: Dna },
  { name: 'Northwind', icon: Compass },
  { name: 'Vanta', icon: ShieldCheck },
  { name: 'Quartz', icon: Gem },
  { name: 'Lumen', icon: Sun },
] as const;

const Hero03 = () => {
  return (
    <section data-slot="hero" className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)] bg-size-[64px_64px] opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(to_right,transparent,var(--primary)_50%,transparent)]"
      />
      {/* Without the orbs, the grid alone reads as bare background in both themes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute start-1/2 -top-40 -z-10 size-130 -translate-x-1/2 rounded-full bg-primary opacity-25 blur-3xl rtl:translate-x-1/2"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-24 top-40 -z-10 size-96 rounded-full bg-primary opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-24 bottom-0 -z-10 size-96 rounded-full bg-primary opacity-15 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-24 text-center md:px-10 lg:py-32">
        <span
          data-slot="hero-eyebrow"
          className={cn(
            ENTER,
            'inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs text-muted-foreground uppercase backdrop-blur-sm',
          )}
        >
          <span>Since 2021</span>
          <span aria-hidden className="text-border">
            |
          </span>
          <span>One calm workspace</span>
        </span>

        <h1
          style={stagger(1)}
          className={cn(
            ENTER_TEXT,
            'max-w-3xl font-serif text-5xl leading-[1.02] font-medium tracking-tight sm:text-6xl md:text-7xl',
          )}
        >
          Software that respects your time.
        </h1>

        <p
          style={stagger(2)}
          className={cn(ENTER_TEXT, 'max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg')}
        >
          Plan, build, and ship from one workspace your whole team will actually enjoy using. No tab sprawl, no
          busywork.
        </p>

        <div
          data-slot="hero-actions"
          style={stagger(3)}
          className={cn(ENTER, 'flex flex-col items-center gap-3 sm:flex-row')}
        >
          <Button asChild size="lg" className="group">
            <a href="#">
              Start free
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#">Book a demo</a>
          </Button>
        </div>

        <div
          data-slot="hero-logos"
          style={stagger(4)}
          className={cn(ENTER, 'mt-12 flex w-full flex-col items-center gap-5')}
        >
          <p className="text-xs text-muted-foreground uppercase">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((logo) => (
              <span
                key={logo.name}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                <logo.icon aria-hidden className="size-4" />
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero03;
