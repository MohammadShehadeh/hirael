'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

const RISE =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const HEADLINE = 'A small studio with a strong opinion';

const Title = () => {
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="feature-title"
      className="font-serif text-4xl leading-[1.04] font-medium tracking-tight text-balance sm:text-5xl"
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn('me-[0.25em] inline-block', RISE, i < half ? 'text-muted-foreground' : 'text-foreground')}
          style={{ animationDelay: `${60 + i * 30}ms` }}
        >
          {word}
        </span>
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
      className="pointer-events-none absolute start-1/2 top-0 -ms-20 -mt-2 h-full w-full [mask-image:linear-gradient(black,transparent)]"
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent [mask-image:radial-gradient(farthest-side_at_top,black,transparent)]">
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
      'Every component starts as a written API before it becomes markup. We test it in light, dark, and right to left before it ships, and we keep the copy short enough to read in one pass.',
      'You install the source, so nothing we do locks you in. If a component stops fitting, edit it. It was always yours.',
    ],
  },
];

interface CardProps {
  card: AboutCard;
  index: number;
}

const Card = ({ card, index }: CardProps) => {
  const base = 240 + index * 60;

  return (
    <article
      data-slot="feature-card"
      className="relative flex h-full animate-in flex-col overflow-hidden rounded-lg border border-border bg-card p-6 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both fade-in slide-in-from-bottom-4 motion-reduce:animate-none md:px-10 md:py-8"
      style={{ animationDelay: `${base}ms` }}
    >
      <GridPattern />
      <h3
        className={cn('relative mb-6 text-2xl font-semibold text-foreground', RISE, 'md:text-3xl')}
        style={{ animationDelay: `${base + 60}ms` }}
      >
        {card.title}
      </h3>
      <div className="relative flex flex-col gap-4">
        {card.paragraphs.map((text, i) => (
          <p
            key={i}
            className={cn('leading-relaxed text-pretty text-muted-foreground', RISE)}
            style={{ animationDelay: `${base + 100 + i * 40}ms` }}
          >
            {text}
          </p>
        ))}
      </div>
    </article>
  );
};

const Feature06 = () => {
  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1480px] px-4">
        <div data-slot="feature-header" className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <div className={RISE}>
            <Badge variant="outline">About</Badge>
          </div>
          <Title />
          <p
            data-slot="feature-description"
            className={cn('max-w-2xl text-base text-pretty text-muted-foreground delay-240 sm:text-lg', RISE)}
          >
            We build the components shadcn/ui does not ship, and we build them the way we would want to inherit them.
          </p>
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
