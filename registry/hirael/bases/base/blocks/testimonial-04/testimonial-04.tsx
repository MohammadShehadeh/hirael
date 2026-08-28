'use client';

import * as React from 'react';
import { Quote } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';

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
  const reduce = useReducedMotion();
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="testimonial-title"
      className="max-w-3xl font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn('me-[0.25em] inline-block', i < half ? 'text-muted-foreground' : 'text-foreground')}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
};

const GlowingRing = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();

  return (
    <div
      data-slot="testimonial-ring"
      aria-hidden
      className={cn('relative size-12 shrink-0 overflow-hidden rounded-full bg-primary/5', className)}
    >
      <Quote className="absolute start-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-foreground rtl:translate-x-1/2" />
      <motion.div
        className="absolute inset-0 rounded-full will-change-transform"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 3, ease: 'linear', repeat: Infinity }}
      >
        <div className="absolute start-1/2 top-1 h-3 w-10 -translate-x-1/2 rounded-full bg-primary blur-[10px] rtl:translate-x-1/2" />
      </motion.div>
    </div>
  );
};

const Testimonial04 = () => {
  const reduce = useReducedMotion();

  return (
    <section data-slot="testimonial" className="bg-background py-16 md:py-24">
      <div className="container w-full">
        <div
          data-slot="testimonial-header"
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <Badge
              variant="outline"
              data-slot="testimonial-badge"
              className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
            >
              Testimonials
            </Badge>
          </motion.div>

          <Headline />

          <motion.p
            data-slot="testimonial-description"
            className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Teams shipping with Hirael, in their own words.
          </motion.p>
        </div>

        <div data-slot="testimonial-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <motion.figure
              key={item.name}
              data-slot="testimonial-card"
              className="flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-6"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.12 }}
            >
              <GlowingRing />
              <blockquote
                data-slot="testimonial-quote"
                className="text-pretty text-base font-medium leading-relaxed text-foreground before:me-1 before:font-serif before:text-2xl before:text-primary before:content-[open-quote] after:ms-1 after:font-serif after:text-2xl after:text-primary after:content-[close-quote]"
              >
                {item.quote}
              </blockquote>
              <figcaption data-slot="testimonial-author" className="mt-auto flex flex-col text-sm">
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-muted-foreground">{item.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial04;
