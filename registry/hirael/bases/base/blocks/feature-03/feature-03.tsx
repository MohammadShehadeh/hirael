import type * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

interface Tile {
  title: string;
  body: string;
  swatches?: boolean;
}

const TILES: readonly Tile[] = [
  {
    title: 'Primitives come first',
    body: 'If the item needs a Button or a Popover you do not have yet, the CLI adds it from shadcn/ui before anything else.',
  },
  {
    title: 'Imports match your aliases',
    body: 'Paths are rewritten to the folders in your components.json, so nothing points at a folder you do not have.',
  },
  {
    title: 'npm packages are listed',
    body: 'Anything the item imports from npm, like lucide-react, is installed with your package manager in the same run.',
  },
  {
    title: 'Your tokens do the styling',
    body: 'Files use the CSS variables your theme already defines, so new components match on the first render.',
    swatches: true,
  },
  {
    title: 'Nothing left at runtime',
    body: 'There is no Hirael package in your bundle. Delete a file and the component is gone.',
  },
];

const COMMAND = 'npx shadcn add https://hirael.com/r/combobox.json';

const OUTPUT = [
  { state: 'done', text: 'Checking registry dependencies' },
  { state: 'done', text: 'Installing button, popover, command' },
  { state: 'done', text: 'Installing lucide-react' },
  { state: 'done', text: 'Created 4 files:' },
] as const;

const WRITTEN_FILES = [
  'components/ui/button.tsx',
  'components/ui/popover.tsx',
  'components/ui/command.tsx',
  'components/combobox.tsx',
] as const;

const SWATCHES = ['bg-foreground', 'bg-muted-foreground', 'bg-warm', 'bg-primary', 'bg-background'] as const;

const Feature03 = () => {
  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div data-slot="feature-header" className="flex max-w-2xl flex-col gap-5">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>How install works</span>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
          >
            One command, a few plain files
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
            Here is what the shadcn CLI does when you add a Hirael item, and what it leaves in your repo afterwards.
          </p>
        </div>

        <div data-slot="feature-bento" className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div
            data-slot="feature-tile"
            style={stagger(0, 60, 180)}
            className={cn(
              ENTER,
              'relative flex flex-col justify-between gap-8 overflow-hidden rounded-xl border border-border bg-card p-6 sm:col-span-2 lg:col-span-4 lg:row-span-2',
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_100%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_60%)]"
            />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-xs uppercase text-muted-foreground">Source you own</span>
              <h3 className="max-w-md text-2xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-3xl">
                The CLI writes TSX into your repo and steps away
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                You review the diff and commit it like code a teammate wrote. From then on, every edit is yours to make.
              </p>
            </div>

            <div
              data-slot="feature-terminal"
              dir="ltr"
              className="relative z-10 -mx-6 -mb-6 border-t border-border bg-background px-6 py-5 text-start font-mono text-[12px] leading-relaxed"
            >
              <p className="text-foreground">
                <span className="select-none text-muted-foreground">$ </span>
                {COMMAND}
              </p>
              <ul className="mt-3 flex flex-col text-muted-foreground">
                {OUTPUT.map((line) => (
                  <li key={line.text}>
                    <span className="text-foreground">✔</span> {line.text}
                  </li>
                ))}
                {WRITTEN_FILES.map((file) => (
                  <li key={file} className="ps-4 text-foreground">
                    - {file}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {TILES.map((tile, index) => (
            <div
              key={tile.title}
              data-slot="feature-tile"
              style={stagger(index + 1, 60, 180)}
              className={cn(ENTER, 'flex flex-col gap-3 rounded-xl border border-border bg-card p-6 lg:col-span-2')}
            >
              <span dir="ltr" className="self-start text-xs tabular-nums text-muted-foreground">
                <span className="text-foreground">{formatIndex(index)}</span>
                <span className="mx-1.5 text-border">|</span>
                {formatIndex(TILES.length - 1)}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold tracking-[-0.01em]">{tile.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{tile.body}</p>
              </div>
              {tile.swatches ? (
                <div aria-hidden className="mt-auto flex items-center gap-1.5 pt-2">
                  {SWATCHES.map((swatch) => (
                    <span key={swatch} className={cn('size-5 rounded-md border border-border', swatch)} />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature03;
