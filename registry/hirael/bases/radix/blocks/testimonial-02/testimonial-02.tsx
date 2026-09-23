import type * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Quote {
  body: string;
  initials: string;
  name: string;
  role: string;
  company: string;
}

const QUOTES: readonly Quote[] = [
  {
    body: 'The compound APIs are the same shape as shadcn, so there was nothing new to learn. We composed a whole settings page out of these in an afternoon.',
    initials: 'MR',
    name: 'Maya Renner',
    role: 'Staff engineer',
    company: 'Plinth Labs',
  },
  {
    body: 'Light and dark mirror each other properly, which few kits get right. I stopped patching contrast bugs.',
    initials: 'JT',
    name: 'Jules Tanaka',
    role: 'Design systems',
    company: 'Hexpoint',
  },
  {
    body: "RTL just worked. We flipped the locale and didn't have to touch a single component.",
    initials: 'AO',
    name: 'Adaeze Okafor',
    role: 'Founding engineer',
    company: 'Brella',
  },
  {
    body: "It's source in our repo, not another dependency to keep up with. That's what sold the team.",
    initials: 'SK',
    name: 'Soren Kim',
    role: 'Frontend lead',
    company: 'Verbit',
  },
  {
    body: 'We replaced three half-finished internal components in a morning and deleted a lot of code.',
    initials: 'RP',
    name: 'Reema Patel',
    role: 'CTO',
    company: 'Lattice & Co.',
  },
  {
    body: 'The blocks gave us a real landing page on day one. We swapped the copy and colors and shipped.',
    initials: 'DL',
    name: 'Diego Larrea',
    role: 'Engineer',
    company: 'Mercado',
  },
];

const Testimonial02 = () => {
  return (
    <section data-slot="testimonial" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1480px] px-4">
        <div data-slot="testimonial-header" className="flex max-w-2xl flex-col gap-5">
          <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>What teams say</span>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-4xl leading-[1.04] font-medium tracking-tight sm:text-5xl')}
          >
            What people are <span className="text-foreground italic">actually</span> saying.
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
            Notes from engineers and designers building with the catalog in production.
          </p>
        </div>

        <div data-slot="testimonial-grid" className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {QUOTES.map((quote, index) => (
            <figure
              key={quote.name}
              data-slot="testimonial-card"
              style={stagger(index, 40, 180)}
              className={cn(ENTER, 'break-inside-avoid rounded-md border border-border bg-card p-5')}
            >
              <blockquote>
                <p className="text-sm leading-relaxed text-foreground">{quote.body}</p>
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-foreground"
                >
                  {quote.initials}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold tracking-[-0.01em]">{quote.name}</span>
                  <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground uppercase">
                    <span>{quote.role}</span>
                    <span aria-hidden className="text-border">
                      |
                    </span>
                    <span>{quote.company}</span>
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial02;
