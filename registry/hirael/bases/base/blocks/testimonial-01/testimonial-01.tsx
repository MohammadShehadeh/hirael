'use client';

import * as React from 'react';

const LOGOS = ['Linear', 'Vercel', 'Resend', 'Cal.com', 'Raycast'] as const;

const Testimonial01 = () => {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-10">
        <div className="flex flex-col items-center gap-10 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
            <span className="size-1 rounded-full bg-foreground" />
            Testimonial
          </span>

          <blockquote className="flex flex-col items-center">
            <span
              aria-hidden
              className="mb-2 block h-6 font-serif text-6xl leading-none text-muted-foreground/40 sm:h-8 sm:text-7xl"
            >
              &ldquo;
            </span>
            <p className="font-serif text-2xl leading-[1.3] tracking-tight sm:text-3xl">
              The compound APIs match shadcn exactly, so there was nothing new for the team to learn. We pulled in the
              date picker and the data table and shipped the same afternoon.
            </p>
          </blockquote>

          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-muted font-mono text-sm font-medium text-foreground">
              MR
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-semibold tracking-[-0.01em]">Maya Renner</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Staff engineer · Plinth Labs
              </span>
            </div>
          </div>

          <div className="w-full border-t border-border pt-8">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
              {LOGOS.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial01;
