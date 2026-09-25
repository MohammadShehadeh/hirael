'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowRight, Cloud } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const Hero05Backdrop = dynamic(() => import('./hero-05-backdrop'), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
});

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
// Text only slides: starting it at opacity 0 would hold back Largest Contentful Paint.
const ENTER_TEXT =
  'animate-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const AVATARS = [
  '/media/blocks/hero-05/avatar-1.jpg',
  '/media/blocks/hero-05/avatar-2.jpg',
  '/media/blocks/hero-05/avatar-3.jpg',
  '/media/blocks/hero-05/avatar-4.jpg',
] as const;

const NAV_LINKS = ['Product', 'Docs', 'Pricing'] as const;

const Hero05 = () => {
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
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_oklch,var(--primary)_26%,transparent),transparent_48%),radial-gradient(70%_60%_at_84%_2%,color-mix(in_oklch,var(--primary)_32%,transparent),transparent_62%),radial-gradient(85%_60%_at_38%_110%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)]"
          />
          <div
            aria-hidden
            data-slot="hero-backdrop"
            className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply dark:opacity-50 dark:mix-blend-screen"
          >
            <Hero05Backdrop active={active} />
          </div>
          {/* A soft scrim behind the copy keeps it legible over the aurora
              without boxing it into a second panel. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_52%,var(--card),transparent)] opacity-70"
          />

          <nav
            data-slot="hero-nav"
            className={cn(ENTER, 'relative z-10 flex items-center justify-between gap-4 px-6 py-5 md:px-10')}
          >
            <span className="flex items-center gap-2 text-base font-medium tracking-tight text-foreground">
              <Cloud aria-hidden className="size-5 text-primary" />
              Hirael
            </span>
            <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
              {NAV_LINKS.map((link) => (
                <a key={link} href="#" className="transition-colors duration-150 hover:text-foreground">
                  {link}
                </a>
              ))}
            </div>
            <Button render={<a href="#" />} nativeButton={false} variant="outline" size="sm">
              Get started
            </Button>
          </nav>

          <div
            data-slot="hero-content"
            className="relative z-10 flex flex-1 items-center justify-center px-6 py-16 md:px-10"
          >
            <div className="flex max-w-2xl flex-col items-center text-center">
              <span
                data-slot="hero-status"
                style={stagger(1)}
                className={cn(
                  ENTER,
                  'inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs uppercase backdrop-blur-sm',
                )}
              >
                <span aria-hidden className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                </span>
                All systems online
              </span>

              <h1
                style={stagger(2)}
                className={cn(
                  ENTER_TEXT,
                  'mt-7 font-serif text-5xl leading-[1.04] font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl',
                )}
              >
                Bring your ideas together.
              </h1>

              <p
                style={stagger(3)}
                className={cn(ENTER_TEXT, 'mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground')}
              >
                A shared canvas for notes, tasks, and docs, so your team always knows what&apos;s next.
              </p>

              <div
                data-slot="hero-actions"
                style={stagger(4)}
                className={cn(ENTER, 'mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center')}
              >
                <Button render={<a href="#" />} nativeButton={false} size="lg" className="group">
                  Try it free
                  <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </Button>
                <Button render={<a href="#" />} nativeButton={false} size="lg" variant="outline">
                  See how it works
                </Button>
              </div>

              <div
                data-slot="hero-social-proof"
                style={stagger(5)}
                className={cn(ENTER, 'mt-10 flex items-center gap-3')}
              >
                <div className="flex -space-x-2">
                  {AVATARS.map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full border-2 border-card object-cover"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Used by 2,000+ teams to plan their week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero05;
