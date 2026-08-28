import * as React from 'react';

const Testimonial03 = () => {
  return (
    <section data-slot="testimonial" className="bg-background py-24 sm:py-32">
      <div data-slot="testimonial-inner" className="relative mx-auto w-full max-w-2xl px-6 text-center sm:px-0">
        <blockquote data-slot="testimonial-quote">
          <h2
            data-slot="testimonial-heading"
            className="space-y-1 font-serif text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
          >
            <span data-slot="testimonial-line" className="relative mx-auto block w-fit text-start md:w-full">
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
              className="flex items-center justify-center gap-2 text-foreground sm:gap-3 md:justify-start dark:text-primary"
            >
              <span className="hidden h-[2px] w-8 bg-gradient-to-r from-transparent to-primary/50 sm:inline-flex" />
              of the way and let
              <span className="hidden h-[2px] w-8 bg-gradient-to-l from-transparent to-primary/50 sm:inline-flex" />
            </span>
            <span
              data-slot="testimonial-highlight"
              className="relative inline-block px-1 text-center sm:px-2 sm:text-start"
            >
              the work speak
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 -z-10 hidden h-full w-full -translate-y-[45%] rounded-lg bg-primary/20 sm:block"
              />
            </span>
          </h2>
        </blockquote>
        <figcaption
          data-slot="testimonial-attribution"
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
        >
          Priya Anand · Product lead
        </figcaption>
      </div>
    </section>
  );
};

export default Testimonial03;
