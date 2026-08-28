'use client';

import Image from 'next/image';
import { ArrowRight, Orbit } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/base/ui/button';

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
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-background/20"
      />

      <header data-slot="hero-nav" className="relative z-10 px-4 py-4 md:px-6">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-border bg-card/70 py-2 pe-2 ps-5 backdrop-blur-md">
          <span className="flex items-center gap-2 text-base font-medium tracking-tight text-foreground">
            <Orbit className="size-5 text-primary" />
            Orbit
          </span>
          <Button render={<a href="#" />} nativeButton={false} size="sm" className="rounded-full">
            Get started
          </Button>
        </nav>
      </header>

      <div className="relative z-10 flex flex-1 items-end px-6 pb-16 md:px-10 lg:pb-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm">
            Mission control
          </span>

          <h1 className="mt-6 max-w-2xl font-serif text-5xl font-medium leading-[1.03] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Launch with confidence.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Monitor every deploy, rollback, and metric from a single pane of glass. Catch problems before your users do.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button
              render={<a href="#" />}
              nativeButton={false}
              size="lg"
              className="group h-12 rounded-full px-7 text-base"
            >
              Start your trial
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Button>
            <Button
              render={<a href="#" />}
              nativeButton={false}
              size="lg"
              variant="ghost"
              className="h-12 rounded-full px-7 text-base"
            >
              Talk to sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero04;
