import * as React from 'react';
import Image from 'next/image';
import { ArrowRight, Orbit } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const Hero04 = () => {
  return (
    <section
      data-slot="hero"
      className="dark relative isolate flex min-h-[640px] w-full flex-col overflow-hidden bg-background text-foreground"
    >
      <Image
        src="/media/blocks/hero-04/earth.jpg"
        alt="Earth seen from orbit against deep space"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/80 to-background/20"
      />

      <header data-slot="hero-nav" className={cn(ENTER, 'relative z-10 px-4 py-4 md:px-6')}>
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-border bg-card/70 py-2 pe-2 ps-5 backdrop-blur-md">
          <span className="flex items-center gap-2 text-base font-medium tracking-tight text-foreground">
            <Orbit aria-hidden className="size-5 text-primary" />
            Orbit
          </span>
          <Button render={<a href="#" />} nativeButton={false} size="sm">
            Get started
          </Button>
        </nav>
      </header>

      <div data-slot="hero-content" className="relative z-10 flex flex-1 items-end px-6 pb-16 md:px-10 lg:pb-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start text-start">
          <span
            data-slot="hero-eyebrow"
            style={stagger(1)}
            className={cn(
              ENTER,
              'inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs uppercase text-muted-foreground backdrop-blur-sm',
            )}
          >
            Mission control
          </span>

          <h1
            style={stagger(2)}
            className={cn(
              ENTER,
              'mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.03] tracking-tight text-foreground sm:text-6xl md:text-7xl',
            )}
          >
            Launch with confidence.
          </h1>

          <p style={stagger(3)} className={cn(ENTER, 'mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground')}>
            Watch every deploy, error rate, and rollback on one screen, and catch a bad release before most of your
            users see it.
          </p>

          <div
            data-slot="hero-actions"
            style={stagger(4)}
            className={cn(ENTER, 'mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center')}
          >
            <Button render={<a href="#" />} nativeButton={false} size="lg" className="group">
              Start your trial
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Button>
            <Button render={<a href="#" />} nativeButton={false} size="lg" variant="ghost">
              Talk to sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero04;
