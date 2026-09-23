import type * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 80, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const Testimonial03 = () => {
  return (
    <section data-slot="testimonial" className="bg-background py-24 sm:py-32">
      <h2 className="sr-only">What our customers say</h2>
      <figure data-slot="testimonial-inner" className="relative mx-auto w-full max-w-2xl px-6 text-center sm:px-0">
        <blockquote data-slot="testimonial-quote">
          <p
            data-slot="testimonial-heading"
            className="space-y-1 font-serif text-4xl leading-[1.08] font-medium tracking-tight sm:text-5xl md:text-6xl"
          >
            <span
              data-slot="testimonial-line"
              className={cn(ENTER, 'relative mx-auto block w-fit text-start md:w-full')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="absolute -start-6 -top-3 size-6 text-primary/60 sm:-start-12 sm:-top-4 sm:size-8"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M7.27273 16.3833H0L5.30713 4H10.0737L7.27273 16.3833ZM17.199 16.3833H9.92629L15.2334 4H20L17.199 16.3833Z"
                />
              </svg>
              Good tools get out
            </span>
            <span
              data-slot="testimonial-divider"
              style={stagger(1)}
              className={cn(ENTER, 'flex items-center justify-center gap-2 text-foreground sm:gap-3 md:justify-start')}
            >
              <span
                aria-hidden
                className="hidden h-[2px] w-8 bg-linear-to-r from-transparent to-primary/50 sm:inline-flex rtl:bg-linear-to-l"
              />
              of the way and let
              <span
                aria-hidden
                className="hidden h-[2px] w-8 bg-linear-to-l from-transparent to-primary/50 sm:inline-flex rtl:bg-linear-to-r"
              />
            </span>
            <span
              data-slot="testimonial-highlight"
              style={stagger(2)}
              className={cn(ENTER, 'relative isolate inline-block px-1 text-center sm:px-2 sm:text-start')}
            >
              the work speak
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 -z-10 hidden h-full w-full -translate-y-[45%] rounded-lg bg-primary/20 sm:block"
              />
            </span>
          </p>
        </blockquote>
        <figcaption
          data-slot="testimonial-attribution"
          style={stagger(3)}
          className={cn(ENTER, 'mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase')}
        >
          <span>Priya Anand</span>
          <span aria-hidden className="text-border">
            |
          </span>
          <span>Product lead, Tidewater</span>
        </figcaption>
      </figure>
    </section>
  );
};

export default Testimonial03;
