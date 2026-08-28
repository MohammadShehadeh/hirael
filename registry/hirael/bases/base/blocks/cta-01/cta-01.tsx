'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/base/ui/button';

const Cta01 = () => {
  return (
    <section data-slot="cta" className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div
          className="relative overflow-hidden rounded-[2rem] border border-border bg-card"
          style={{
            boxShadow: '0 30px 70px -40px color-mix(in oklch, var(--foreground) 30%, transparent)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 120% at 100% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)',
            }}
          />

          <div className="relative grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-16 lg:p-14">
            <div className="flex flex-col gap-5 lg:col-span-7">
              <span className="inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
                <span className="size-1 rounded-full bg-foreground" />
                Get started
              </span>
              <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
                Stop rebuilding the components <span className="italic text-foreground">every project</span> needs.
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                Pull a real multi-select, year picker, or tag input into your repo in one command. No package, no
                version pin. Just the source, in your codebase, yours to shape.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
              <Button
                render={<a href="#" />}
                nativeButton={false}
                size="lg"
                className="group w-full justify-between rounded-full px-7 lg:w-auto"
              >
                Install via shadcn CLI
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </Button>
              <Button
                render={<a href="#" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="w-full rounded-full px-7 lg:w-auto"
              >
                Browse blocks
              </Button>
              <p className="text-end font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                No runtime dependency
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta01;
