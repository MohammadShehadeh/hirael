import type * as React from 'react';
import { Quote } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const HEADLINE = 'What people say after the first install';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      'We replaced three internal wrappers with one Hirael install. The source landed in our repo and we never looked back.',
    name: 'Lina Haddad',
    role: 'Design engineer, Vessel',
  },
  {
    quote: 'RTL worked on the first render. That alone saved our Arabic launch a full sprint.',
    name: 'Omar Nasser',
    role: 'Frontend lead, Sahl',
  },
  {
    quote:
      'The compound API reads like the shadcn primitives we already know, so onboarding new hires took an afternoon.',
    name: 'Priya Raman',
    role: 'Staff engineer, Northline',
  },
  {
    quote: 'Every block uses our existing tokens. Light and dark both looked right without a single override.',
    name: 'Jonas Keller',
    role: 'Product designer, Kestrel',
  },
  {
    quote: 'Data tables that handle keyboard navigation properly are rare. These do, out of the box.',
    name: 'Mei Tanaka',
    role: 'Accessibility lead, Fold',
  },
  {
    quote: 'No runtime package means no upgrade surprises. We edit the files like they are ours, because they are.',
    name: 'Samuel Osei',
    role: 'CTO, Brightline',
  },
];

const Headline = () => {
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="testimonial-title"
      className="max-w-3xl font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl"
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn(ENTER, 'me-[0.25em] inline-block', i < half ? 'text-muted-foreground' : 'text-foreground')}
          style={{ animationDelay: `${60 + i * 30}ms` }}
        >
          {word}
        </span>
      ))}
    </h2>
  );
};

const Testimonial04 = () => {
  return (
    <section data-slot="testimonial" className="bg-background py-16 md:py-24">
      <div className="container w-full">
        <div
          data-slot="testimonial-header"
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center"
        >
          <div className="animate-in fade-in zoom-in-95 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none">
            <Badge variant="outline" data-slot="testimonial-badge">
              Testimonials
            </Badge>
          </div>

          <Headline />

          <p
            data-slot="testimonial-description"
            style={{ animationDelay: '240ms' }}
            className={cn(ENTER, 'max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg')}
          >
            Teams shipping with Hirael, in their own words.
          </p>
        </div>

        <div data-slot="testimonial-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <figure
              key={item.name}
              data-slot="testimonial-card"
              className={cn(ENTER, 'flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-6')}
              style={{ animationDelay: `${280 + i * 40}ms` }}
            >
              <Quote data-slot="testimonial-mark" aria-hidden className="size-5 text-warm" />
              <blockquote
                data-slot="testimonial-quote"
                className="text-pretty text-base font-medium leading-relaxed text-foreground"
              >
                {item.quote}
              </blockquote>
              <figcaption data-slot="testimonial-author" className="mt-auto flex flex-col text-sm">
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-muted-foreground">{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial04;
