'use client';

import * as React from 'react';

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

const QUESTIONS = [
  {
    value: 'config',
    topic: 'Existing configuration',
    question: 'Do I have to give up my existing configuration?',
    answer:
      'No. The importer reads the workflow files already in your repo and renders them as a graph. Edits flow both ways, and the files stay in git.',
  },
  {
    value: 'free',
    topic: 'The free plan',
    question: 'What does the free plan actually include?',
    answer:
      'The full editor, two concurrent runs and 500 run minutes a month. It is not a trial; small projects can stay on it forever.',
  },
  {
    value: 'runners',
    topic: 'Runners',
    question: 'Where do the runs execute?',
    answer:
      'On managed runners by default. Self-hosted runners are in progress for workloads that need to stay inside your network.',
  },
  {
    value: 'secrets',
    topic: 'Secrets',
    question: 'How are secrets handled?',
    answer:
      'Secrets are scoped to environments and encrypted at rest. A step only receives the secrets of the environment it deploys to, and values never appear in logs.',
  },
  {
    value: 'migrate',
    topic: 'Leaving later',
    question: 'Can I leave without rewriting anything?',
    answer:
      'Yes. Because the graph is stored as standard workflow files in your repo, turning the editor off leaves you with configuration any runner understands.',
  },
];

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const Faq07 = () => {
  const [open, setOpen] = React.useState<string>(QUESTIONS[0].value);

  return (
    <section data-slot="faq" className="bg-background py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-16 md:px-10">
        <div data-slot="faq-intro" className="flex flex-col gap-4">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Migrating</span>
          <h2
            style={stagger(1, 70)}
            className={cn(ENTER, 'text-balance font-serif text-3xl font-medium tracking-tight md:text-4xl')}
          >
            Before you move your pipelines
          </h2>
          <p style={stagger(2, 70)} className={cn(ENTER, 'max-w-md text-sm text-muted-foreground md:text-base')}>
            The short version of what teams ask before switching. Pick a topic to open its answer.
          </p>

          <nav
            data-slot="faq-index"
            aria-label="Topics"
            style={stagger(3, 70)}
            className={cn(ENTER, 'mt-4 hidden flex-col border-s border-border md:flex')}
          >
            {QUESTIONS.map((q, i) => {
              const active = open === q.value;
              return (
                <button
                  key={q.value}
                  type="button"
                  aria-current={active ? 'true' : undefined}
                  data-active={active || undefined}
                  onClick={() => setOpen(q.value)}
                  className="group relative flex items-baseline gap-3 py-2 ps-4 text-start text-sm text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground data-active:text-foreground"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-1 -start-px w-px origin-top scale-y-0 bg-foreground transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-active:scale-y-100 motion-reduce:transition-none"
                  />
                  <span className="text-xs tabular-nums transition-colors group-data-active:text-warm">
                    {formatIndex(i)}
                  </span>
                  {q.topic}
                </button>
              );
            })}
          </nav>
        </div>

        <div data-slot="faq-list" style={stagger(3, 70)} className={cn(ENTER, 'border-y border-border')}>
          <Accordion value={[open]} onValueChange={([next]) => setOpen(next ?? '')}>
            {QUESTIONS.map((q, i) => (
              <AccordionItem key={q.value} value={q.value}>
                <AccordionTrigger>
                  <span className="flex items-baseline gap-4 text-base">
                    <span className="text-xs tabular-nums text-muted-foreground">{formatIndex(i)}</span>
                    <span>{q.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="ms-9 max-w-2xl">
                  <span className="text-muted-foreground">{q.answer}</span>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq07;
