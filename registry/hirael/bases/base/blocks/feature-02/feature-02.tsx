import type * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

interface Feature {
  title: string;
  body: string;
}

const FEATURES: readonly Feature[] = [
  {
    title: 'A live preview for every item',
    body: 'Each page renders the real component in light, dark and right to left, at any width you drag it to.',
  },
  {
    title: 'Radix UI or Base UI',
    body: 'Every item exists for both primitive libraries. Switch the base and the preview, source and install command follow.',
  },
  {
    title: 'The full source, up front',
    body: 'Read every line the CLI will write before you run it, with the imports already pointed at your paths.',
  },
  {
    title: 'A props table you can trust',
    body: 'Props, types and defaults are generated from the source on every build, so they never fall behind the code.',
  },
  {
    title: 'Demos you can copy',
    body: 'Usage examples sit next to the preview and cover the common setups, not only the happy path.',
  },
  {
    title: 'A page your agent can read',
    body: 'Every item has a Markdown version with the install command, usage and source, ready to paste into a prompt.',
  },
];

const Feature02 = () => {
  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div data-slot="feature-header" className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>What you get</span>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
          >
            Everything you need to decide before you install
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
            Each item in the catalog comes with the same six things, so you can judge it on the page instead of in your
            repo.
          </p>
        </div>

        <ul
          data-slot="feature-list"
          className="mt-14 grid grid-cols-1 gap-x-10 border-t border-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature, index) => (
            <li
              key={feature.title}
              data-slot="feature-item"
              style={stagger(index, 60, 180)}
              className={cn(ENTER, 'flex flex-col gap-3 border-b border-border py-8')}
            >
              <span dir="ltr" className="self-start text-xs tabular-nums text-muted-foreground">
                <span className="text-foreground">{formatIndex(index)}</span>
                <span className="mx-1.5 text-border">|</span>
                {formatIndex(FEATURES.length - 1)}
              </span>
              <h3 className="text-base font-semibold tracking-[-0.01em]">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{feature.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Feature02;
