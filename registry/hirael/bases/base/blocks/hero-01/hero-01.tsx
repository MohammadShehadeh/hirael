'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const Hero01Backdrop = dynamic(() => import('./hero-01-backdrop'), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
});

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
// Text only slides: starting it at opacity 0 would hold back Largest Contentful Paint.
const ENTER_TEXT =
  'animate-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const NAV_LINKS = ['Product', 'Docs', 'Pricing', 'Changelog'] as const;

const STATS = [
  { value: '4,000+', label: 'Teams' },
  { value: '60+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime' },
] as const;

const Hero01 = () => {
  const [active, setActive] = React.useState(false);

  return (
    <section data-slot="hero" className="flex w-full items-center justify-center bg-background px-4 py-12 md:px-6">
      <div
        className="relative w-full max-w-7xl"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div className="relative isolate flex min-h-[680px] flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm md:rounded-[40px]">
          <div
            aria-hidden
            data-slot="hero-wash"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_55%_at_16%_4%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_62%),radial-gradient(65%_60%_at_90%_94%,color-mix(in_oklch,var(--primary)_26%,transparent),transparent_66%),radial-gradient(95%_70%_at_50%_112%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_70%)]"
          />
          <div
            aria-hidden
            data-slot="hero-backdrop"
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply dark:opacity-10 dark:mix-blend-screen"
          >
            <Hero01Backdrop active={active} />
          </div>

          <nav
            data-slot="hero-nav"
            className={cn(ENTER, 'relative z-10 flex items-center justify-between gap-4 px-6 py-5 md:px-10')}
          >
            <span className="flex items-center gap-2 text-base font-medium tracking-tight text-foreground">Hirael</span>
            <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
              {NAV_LINKS.map((link) => (
                <a key={link} href="#" className="transition-colors duration-150 hover:text-foreground">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="hidden text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground sm:inline"
              >
                Sign in
              </a>
              <Button render={<a href="#" />} nativeButton={false} variant="outline" size="sm">
                Get started
              </Button>
            </div>
          </nav>

          <div
            data-slot="hero-content"
            className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20 text-center md:px-10"
          >
            <h1
              style={stagger(1)}
              className={cn(
                ENTER_TEXT,
                'max-w-4xl font-serif text-5xl leading-[1.04] font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl',
              )}
            >
              The interface layer your product was missing.
            </h1>

            <p
              style={stagger(2)}
              className={cn(ENTER_TEXT, 'mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground')}
            >
              Drop in accessible components and ship a polished UI in an afternoon, no design system required.
            </p>

            <div
              data-slot="hero-actions"
              style={stagger(3)}
              className={cn(ENTER, 'mt-10 flex flex-col items-center gap-3 sm:flex-row')}
            >
              <Button render={<a href="#" />} nativeButton={false} size="lg" className="group">
                Start building
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Button>
              <Button render={<a href="#" />} nativeButton={false} size="lg" variant="outline">
                Read the docs
              </Button>
            </div>
          </div>

          <div
            data-slot="hero-stats"
            style={stagger(4)}
            className={cn(
              ENTER,
              'relative z-10 flex items-center justify-center gap-8 border-t border-border px-6 py-7 md:gap-16 md:px-10',
            )}
          >
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <span aria-hidden className="h-9 w-px bg-border" />}
                <div data-slot="hero-stat" className="text-center">
                  <div dir="ltr" className="font-serif text-2xl font-medium text-foreground tabular-nums md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs tracking-[0.14em] text-muted-foreground uppercase">{stat.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero01;
