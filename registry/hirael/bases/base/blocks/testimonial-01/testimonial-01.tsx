import type * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const LOGOS = ['Plinth Labs', 'Hexpoint', 'Brella', 'Northline', 'Kestrel'] as const;

const Testimonial01 = () => {
  return (
    <section data-slot="testimonial" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-10">
        <div className="flex flex-col items-center gap-10 text-center">
          <h2 className={cn(ENTER, 'text-xs font-normal text-muted-foreground uppercase')}>Customer story</h2>

          <figure className="flex flex-col items-center gap-10">
            <blockquote
              data-slot="testimonial-quote"
              style={stagger(1)}
              className={cn(ENTER, 'flex flex-col items-center')}
            >
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

            <figcaption
              data-slot="testimonial-author"
              style={stagger(2)}
              className={cn(ENTER, 'flex flex-col items-center gap-3')}
            >
              <span
                aria-hidden
                className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-foreground"
              >
                MS
              </span>
              <span className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-semibold tracking-[-0.01em]">Mohammad Shehadeh</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground uppercase">
                  <span>Staff engineer</span>
                  <span aria-hidden className="text-border">
                    |
                  </span>
                  <span>Hirael</span>
                </span>
              </span>
            </figcaption>
          </figure>

          <div
            data-slot="testimonial-logos"
            style={stagger(3)}
            className={cn(ENTER, 'w-full border-t border-border pt-8')}
          >
            <p className="sr-only">Also building with Hirael</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              {LOGOS.map((logo) => (
                <li key={logo}>{logo}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial01;
