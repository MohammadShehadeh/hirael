import { cn } from '@/lib/utils';

import { SectionIntro } from './primitives';

const TESTIMONIALS = [
  {
    quote:
      'A complete rebuild in five days. The new site beats the old one on every metric we track, and the brief we wrote was a single paragraph.',
    name: 'Sarah Chen',
    role: 'CEO, Luminary',
    delay: '',
  },
  {
    quote:
      'Conversions up 4x in the first month. The site keeps testing and tuning itself, so the numbers kept climbing long after launch.',
    name: 'Marcus Webb',
    role: 'Head of Growth, Arcline',
    delay: '[animation-delay:100ms]',
  },
  {
    quote:
      "They didn't just design our site. They understood the brand well enough to make the calls we would have made ourselves, only faster.",
    name: 'Elena Voss',
    role: 'Brand Director, Helix',
    delay: '[animation-delay:200ms]',
  },
] as const;

export const Testimonials = () => {
  return (
    <section id="pricing" data-slot="testimonials" className="px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro kicker="What They Say" title="Don't take our word for it." />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className={cn('rise liquid-glass flex flex-col rounded-2xl p-8', testimonial.delay)}
            >
              <blockquote className="flex-1 text-sm leading-relaxed font-light text-foreground/80 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                <p className="mt-1 text-xs font-light text-foreground/50">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
