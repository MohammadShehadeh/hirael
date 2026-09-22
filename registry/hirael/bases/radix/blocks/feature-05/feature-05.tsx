import type * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

/** Entrance: fade and rise, skipped under reduced motion. */
const RISE =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Value {
  title: string;
  description: string;
}

const VALUES: readonly Value[] = [
  {
    title: 'Own the source',
    description: 'Every component installs as plain TypeScript in your repo. No package to pin, nothing to wait on.',
  },
  {
    title: 'Accessible by default',
    description:
      'Keyboard paths, focus rings, and screen reader labels are part of the component, not a follow-up ticket.',
  },
  {
    title: 'Tokens over hex',
    description:
      'One set of CSS variables drives light, dark, and any brand you bring. Change the token, change the product.',
  },
  {
    title: 'Compound first',
    description: 'Small parts you arrange yourself, named and composed the way shadcn/ui primitives are.',
  },
  {
    title: 'RTL without config',
    description:
      'Logical properties and mirrored icons mean Arabic and Hebrew layouts work the day you flip the direction.',
  },
  {
    title: 'Plain language',
    description: 'Labels, empty states, and docs read like a person wrote them. Short, specific, no hype.',
  },
];

const Title = () => {
  return (
    <h2
      data-slot="feature-title"
      style={stagger(1)}
      className={cn(RISE, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight text-balance sm:text-5xl')}
    >
      The principles behind every component
    </h2>
  );
};

/** Static dot grid in the brand tone, faded toward the edges. */
const DottedGlow = ({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden
      data-slot="dotted-glow"
      className={cn(
        'pointer-events-none absolute inset-0 bg-[radial-gradient(var(--warm)_1.6px,transparent_1.6px)] bg-size-[10px_10px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]',
        className,
      )}
    />
  );
};

const ValueCard = ({ value, index }: { value: Value; index: number }) => {
  return (
    <article
      data-slot="feature-card"
      style={stagger(index, 60, 180)}
      className={cn(RISE, 'relative overflow-hidden rounded-lg border border-border bg-card/60 p-6 backdrop-blur-sm')}
    >
      <DottedGlow />
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
        <p className="text-pretty text-muted-foreground">{value.description}</p>
      </div>
    </article>
  );
};

const Feature05 = () => {
  const half = Math.ceil(VALUES.length / 2);
  const columns = [VALUES.slice(0, half), VALUES.slice(half)];

  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div data-slot="feature-header" className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <div className={RISE}>
            <Badge variant="outline">Values</Badge>
          </div>
          <Title />
          <p
            data-slot="feature-description"
            style={stagger(2)}
            className={cn(RISE, 'max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg')}
          >
            Six decisions we make the same way every time, so you never have to guess how a new component will behave.
          </p>
        </div>

        <div
          data-slot="feature-grid"
          className="mx-auto mt-14 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-8"
        >
          {columns.map((column, c) => (
            <div
              key={c}
              data-slot="feature-column"
              className={cn('flex flex-col gap-4 md:gap-8', c === 1 && 'md:mt-16')}
            >
              {column.map((value, i) => (
                <ValueCard key={value.title} value={value} index={c * half + i} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature05;
