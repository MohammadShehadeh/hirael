import { ChartColumn, Palette, Shield, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

import { SectionIntro } from './primitives';

const BENEFITS = [
  {
    Icon: Zap,
    title: 'Days, Not Months',
    description: 'Concept to launch at a pace that redefines fast.',
    delay: '',
  },
  {
    Icon: Palette,
    title: 'Obsessively Crafted',
    description: 'Every detail considered. Every element refined.',
    delay: '[animation-delay:100ms]',
  },
  {
    Icon: ChartColumn,
    title: 'Built to Convert',
    description: 'Layouts informed by data. Decisions backed by performance.',
    delay: '[animation-delay:200ms]',
  },
  {
    Icon: Shield,
    title: 'Secure by Default',
    description: 'Enterprise-grade protection comes standard.',
    delay: '[animation-delay:300ms]',
  },
] as const;

export const Benefits = () => {
  return (
    <section id="work" data-slot="benefits" className="px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro kicker="Why Us" title="The difference is everything." />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ Icon, title, description, delay }) => (
            <article key={title} className={cn('rise liquid-glass rounded-2xl p-6', delay)}>
              <span className="liquid-glass-strong flex size-10 items-center justify-center rounded-full text-foreground">
                <Icon className="size-4" aria-hidden />
              </span>
              <h3 className="mt-6 [font-family:var(--font-prism-serif)] text-lg text-foreground italic">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed font-light text-foreground/60">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
