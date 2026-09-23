import type * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/hirael/bases/base/ui/accordion';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const FAQS = [
  {
    q: 'Do I need to install a package?',
    a: 'No. Hirael is a registry; components copy straight into your repo through the shadcn CLI. Nothing depends on Hirael at runtime.',
  },
  {
    q: 'Will updates break my code?',
    a: 'You own the copied source, so updates are opt-in. Re-run the install command to pull the latest, then diff and merge.',
  },
  {
    q: 'Is it compatible with shadcn themes?',
    a: 'Yes. It reads the same CSS variables, so any shadcn theme works without changes.',
  },
  {
    q: 'What about accessibility?',
    a: 'Every published component works from the keyboard with the right ARIA roles. Focus handling is tested before a component is listed.',
  },
  {
    q: 'Can I use it with the Pages Router?',
    a: 'Yes. Components are plain React and avoid framework-specific APIs: App Router, Pages Router, Remix, anywhere React runs.',
  },
  {
    q: 'Do I own the code?',
    a: 'Yes. Installing puts the source in your repo to keep, edit and ship. No telemetry, no lock-in.',
  },
] as const;

const Faq02 = () => {
  return (
    <section data-slot="faq" className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <div data-slot="faq-header" className="flex flex-col items-center gap-4 text-center">
          <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>Frequently asked</span>
          <h2
            style={stagger(1, 70)}
            className={cn(
              ENTER,
              'max-w-2xl font-serif text-4xl leading-[1.04] font-medium tracking-tight sm:text-5xl md:text-6xl',
            )}
          >
            Everything you&apos;d ask in the first ten minutes.
          </h2>
          <p style={stagger(2, 70)} className={cn(ENTER, 'max-w-xl text-sm text-muted-foreground')}>
            Short answers first. If something isn&apos;t here, the issue tracker is open and we usually respond within a
            day.
          </p>
        </div>

        <div data-slot="faq-list" className="grid grid-cols-1 gap-x-12 gap-y-0 lg:grid-cols-2 lg:items-start">
          {[FAQS.slice(0, 3), FAQS.slice(3)].map((col, ci) => (
            <div key={ci} className="border-b border-border first:border-t lg:border-t">
              <Accordion multiple defaultValue={ci === 0 ? ['item-0-0'] : []}>
                {col.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`item-${ci}-${i}`}
                    style={stagger(ci * 3 + i, 50, 220)}
                    className={ENTER}
                  >
                    <AccordionTrigger>
                      <span className="flex items-baseline gap-3">
                        <span className="text-xs text-muted-foreground tabular-nums">Q{ci * 3 + i + 1}</span>
                        <span>{f.q}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ms-8 text-muted-foreground">{f.a}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq02;
