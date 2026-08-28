'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/base/ui/button';

const Hero01Backdrop = dynamic(() => import('./hero-01-backdrop'), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
});

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
        <div className="relative isolate flex min-h-[680px] flex-col overflow-hidden rounded-[40px] border border-border bg-card text-card-foreground shadow-sm">
          <div
            aria-hidden
            data-slot="hero-backdrop"
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply dark:opacity-10 dark:mix-blend-screen"
          >
            <Hero01Backdrop active={active} />
          </div>

          <nav
            data-slot="hero-nav"
            className="relative z-10 flex items-center justify-between gap-4 px-6 py-5 md:px-10"
          >
            <span className="flex items-center gap-2 text-base font-medium tracking-tight text-foreground">
              Aperture
            </span>
            <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
              {NAV_LINKS.map((link) => (
                <a key={link} href="#" className="transition-colors hover:text-foreground">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Sign in
              </a>
              <Button render={<a href="#" />} variant="outline" size="sm" className="rounded-full">
                Get started
              </Button>
            </div>
          </nav>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20 text-center md:px-10">
            <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.04] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              The interface layer your product was missing.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Drop in accessible components and ship a polished UI in an afternoon, no design system required.
            </p>

            <div
              data-slot="hero-actions"
              className="mt-10 flex flex-col items-center gap-3 rounded-full bg-background/40 p-1.5 backdrop-blur-sm sm:flex-row"
            >
              <Button render={<a href="#" />} size="lg" className="group h-12 rounded-full px-7 text-base">
                Start building
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Button>
              <Button render={<a href="#" />} size="lg" variant="ghost" className="h-12 rounded-full px-7 text-base">
                Read the docs
              </Button>
            </div>
          </div>

          <div
            data-slot="hero-stats"
            className="relative z-10 flex items-center justify-center gap-8 border-t border-border px-6 py-7 md:gap-16 md:px-10"
          >
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <span aria-hidden className="h-9 w-px bg-border" />}
                <div className="text-center">
                  <div className="font-serif text-2xl font-medium text-foreground md:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</div>
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
