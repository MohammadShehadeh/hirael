'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';

const HEADLINE = 'A small studio with a strong opinion';

const Title = () => {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="feature-title"
      className="font-serif text-4xl font-medium leading-[1.04] tracking-tight text-balance sm:text-5xl"
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

const GridPattern = () => {
  const id = React.useId();

  return (
    <div
      aria-hidden
      data-slot="grid-pattern"
      className="pointer-events-none absolute top-0 start-1/2 -mt-2 -ms-20 h-full w-full [mask-image:linear-gradient(black,transparent)]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent [mask-image:radial-gradient(farthest-side_at_top,black,transparent)]">
        <svg className="absolute inset-0 h-full w-full fill-primary/5 stroke-primary/25 mix-blend-overlay">
          <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse" x="-12" y="4">
            <path d="M.5 20V.5H20" fill="none" />
          </pattern>
          <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${id})`} />
          <svg x="-12" y="4" className="overflow-visible">
            <rect strokeWidth="0" width="21" height="21" x="180" y="20" />
            <rect strokeWidth="0" width="21" height="21" x="200" y="120" />
            <rect strokeWidth="0" width="21" height="21" x="180" y="100" />
            <rect strokeWidth="0" width="21" height="21" x="160" y="120" />
          </svg>
        </svg>
      </div>
    </div>
  );
};

interface AboutCard {
  title: string;
  paragraphs: readonly string[];
}

const CARDS: readonly AboutCard[] = [
  {
    title: 'Who we are',
    paragraphs: [
      'Hirael started as a folder of components we kept copying between client projects. The folder got a registry, the registry got a site, and the site got a name.',
      'Today it is a small team of designers and engineers who care about the parts of an interface most people never notice until they break.',
    ],
  },
  {
    title: 'How we work',
    paragraphs: [
      'Every component starts as a written API before it becomes markup. We test it in light, dark, and right-to-left before it ships, and we keep the copy short enough to read in one pass.',
      'You install the source, so nothing we do locks you in. If a component stops fitting, edit it. It was always yours.',
    ],
  },
];

const Card = ({ card, index }: { card: AboutCard; index: number }) => {
  const reduce = useReducedMotion();
  const base = 0.2 + index * 0.1;

  return (
    <motion.article
      data-slot="feature-card"
      className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 md:px-10 md:py-8"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: base }}
    >
      <GridPattern />
      <motion.h3
        className="relative mb-6 text-2xl font-semibold text-foreground md:text-3xl"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: base + 0.1 }}
      >
        {card.title}
      </motion.h3>
      <div className="relative flex flex-col gap-4">
        {card.paragraphs.map((text, i) => (
          <motion.p
            key={i}
            className="leading-relaxed text-pretty text-muted-foreground"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: base + 0.2 + i * 0.1,
            }}
          >
            {text}
          </motion.p>
        ))}
      </div>
    </motion.article>
  );
};

const Feature06 = () => {
  const reduce = useReducedMotion();

  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div data-slot="feature-header" className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Badge
              variant="outline"
              className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
            >
              About
            </Badge>
          </motion.div>
          <Title />
          <motion.p
            data-slot="feature-description"
            className="max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          >
            We build the components shadcn/ui does not ship, and we build them the way we would want to inherit them.
          </motion.p>
        </div>

        <div data-slot="feature-grid" className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {CARDS.map((card, i) => (
            <Card key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature06;
