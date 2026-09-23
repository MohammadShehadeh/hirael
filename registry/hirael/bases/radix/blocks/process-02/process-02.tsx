'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/hirael/bases/radix/ui/tabs';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const COMMAND = 'npx shadcn add https://hirael.com/r/command-palette.json';

interface Step {
  value: string;
  title: string;
  body: string;
  detail: string;
  panelTitle: string;
  panelBody: string;
  checklist: readonly string[];
}

const STEPS: readonly Step[] = [
  {
    value: 'discover',
    title: 'Discover',
    body: 'Search the catalog by what you need, not by package name.',
    detail: 'Around 170 items to browse',
    panelTitle: 'Find the item that fits',
    panelBody:
      'Every item has a live preview in light, dark and right to left, so you can rule things out before reading any code.',
    checklist: ['Filter by component, block or template', 'Switch the preview between Radix UI and Base UI'],
  },
  {
    value: 'inspect',
    title: 'Inspect',
    body: 'Read the full source and the props table before it touches your repo.',
    detail: 'One file for most components',
    panelTitle: 'Know what you are adding',
    panelBody:
      'The source tab shows exactly what the CLI will write, including the shadcn primitives it expects you to have.',
    checklist: [
      'Registry dependencies listed by name',
      'npm dependencies listed with the item',
      'No runtime package, no telemetry',
    ],
  },
  {
    value: 'sandbox',
    title: 'Sandbox',
    body: 'Try it inside a framed preview with your own theme tokens.',
    detail: 'Takes about a minute',
    panelTitle: 'Check it against your theme',
    panelBody:
      'The customizer swaps radius, base color and fonts on the preview, so you see the item the way your app will render it.',
    checklist: ['Toggle light and dark', 'Flip the direction to check right to left', 'Resize to phone width'],
  },
  {
    value: 'install',
    title: 'Install',
    body: 'Run one shadcn command and commit the files like any other code.',
    detail: 'Writes 1 to 3 files',
    panelTitle: 'Own the source',
    panelBody:
      'The CLI resolves the item, installs missing primitives and writes plain TSX into your components folder. From here it is your code.',
    checklist: ['components/command-palette.tsx', 'Missing primitives: dialog, input', 'npm: lucide-react'],
  },
];

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const Process02 = () => {
  const [active, setActive] = React.useState(STEPS[0].value);
  const activeIndex = STEPS.findIndex((step) => step.value === active);

  return (
    <section data-slot="process" className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:gap-16 md:px-10">
        <div data-slot="process-header" className="flex max-w-xl flex-col gap-4">
          <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>Install flow</span>
          <h2
            style={stagger(1, 70)}
            className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
          >
            From the catalog to production
          </h2>
          <p style={stagger(2, 70)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            Four steps, and only the last one changes your repo. Pick a step to see what happens during it.
          </p>
        </div>

        <Tabs value={active} onValueChange={(value) => setActive(value)}>
          <TabsList
            variant="line"
            className="grid h-auto w-full grid-cols-1 items-stretch group-data-[orientation=horizontal]/tabs:h-auto lg:grid-cols-4"
          >
            {STEPS.map((step, index) => {
              const reached = index <= activeIndex;
              const isLast = index === STEPS.length - 1;

              return (
                <TabsTrigger
                  key={step.value}
                  value={step.value}
                  style={stagger(index, 60, 200)}
                  className={cn(
                    ENTER,
                    'group/step relative h-auto flex-row items-start justify-start text-start whitespace-normal lg:flex-col',
                    'after:hidden',
                  )}
                >
                  {!isLast && (
                    <>
                      <span aria-hidden className="absolute start-5.5 top-10 bottom-1 w-px bg-border lg:hidden">
                        <span
                          className={cn(
                            'absolute inset-0 origin-top bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                            index < activeIndex ? 'scale-y-100' : 'scale-y-0',
                          )}
                        />
                      </span>
                      <span aria-hidden className="absolute start-12 end-2 top-4.5 hidden h-px bg-border lg:block">
                        <span
                          className={cn(
                            'absolute inset-0 origin-left bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none rtl:origin-right',
                            index < activeIndex ? 'scale-x-100' : 'scale-x-0',
                          )}
                        />
                      </span>
                    </>
                  )}
                  <span
                    dir="ltr"
                    className={cn(
                      'relative me-2.5 grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-medium tabular-nums transition-colors duration-250 lg:me-0 lg:mb-3.5',
                      index === activeIndex
                        ? 'border-foreground bg-foreground text-background'
                        : reached
                          ? 'border-foreground bg-background text-foreground'
                          : 'border-border bg-background text-muted-foreground group-hover/step:border-muted-foreground',
                    )}
                  >
                    {formatIndex(index)}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1.5 pe-4 pt-0.5 pb-8 lg:pt-0 lg:pb-0">
                    <span
                      className={cn(
                        'text-base font-medium transition-colors duration-150',
                        reached ? 'text-foreground' : 'text-muted-foreground group-hover/step:text-foreground',
                      )}
                    >
                      {step.title}
                    </span>
                    <span className="text-sm leading-relaxed font-normal text-muted-foreground">{step.body}</span>
                    <span className="text-xs font-normal text-muted-foreground/80">{step.detail}</span>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {STEPS.map((step, index) => (
            <TabsContent key={step.value} value={step.value} className="mt-6">
              <div
                data-slot="process-detail"
                className="grid gap-8 border-y border-border py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14"
              >
                <div className={cn(SWAP, 'flex flex-col gap-3')}>
                  <span dir="ltr" className="self-start text-xs text-muted-foreground tabular-nums">
                    {formatIndex(index)}
                    <span className="mx-1.5 text-border">|</span>
                    {formatIndex(STEPS.length - 1)}
                  </span>
                  <h3 className="text-lg font-medium">{step.panelTitle}</h3>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{step.panelBody}</p>
                </div>
                <ul className="flex flex-col gap-3 md:pt-7">
                  {step.checklist.map((item, itemIndex) => (
                    <li
                      key={item}
                      style={stagger(itemIndex + 1, 50)}
                      className={cn(SWAP, 'flex items-start gap-3 text-sm')}
                    >
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div data-slot="process-command" className="flex flex-col gap-3">
          <span className="text-xs text-muted-foreground uppercase">Try it now</span>
          <div
            dir="ltr"
            className="flex items-center gap-3 rounded-lg border border-border bg-card/40 py-1.5 ps-4 pe-1.5"
          >
            <span aria-hidden className="text-sm text-muted-foreground select-none">
              $
            </span>
            <span className="min-w-0 flex-1 truncate text-sm tabular-nums">{COMMAND}</span>
            <CopyButton value={COMMAND} size="md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process02;
