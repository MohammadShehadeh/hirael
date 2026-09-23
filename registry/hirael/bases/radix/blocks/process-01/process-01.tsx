import type * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

interface Step {
  title: string;
  body: string;
  detail: string;
}

const STEPS: readonly Step[] = [
  {
    title: 'Invite your team',
    body: 'Add people by email, or let anyone with your company domain join on their own. Pick a role on the invite so nobody starts with more access than they need.',
    detail: 'Owner, Admin, Member or Viewer',
  },
  {
    title: 'Connect your tools',
    body: 'Link the repository and the chat workspace you already use. Updates flow in from both, so nobody has to change where they work.',
    detail: 'About five minutes per tool',
  },
  {
    title: 'Ship the first project',
    body: 'Start from a template, name an owner for each task and set a due date. Everyone you invited sees it on their home screen right away.',
    detail: 'Most teams do this on day one',
  },
];

const Process01 = () => {
  return (
    <section data-slot="process" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div data-slot="process-header" className="flex max-w-2xl flex-col gap-5">
          <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>Getting started</span>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-4xl leading-[1.04] font-medium tracking-tight sm:text-5xl')}
          >
            Your whole team set up by the end of the day.
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
            Three steps from an empty workspace to a project everyone can see. You can skip ahead and come back to any
            of them.
          </p>
        </div>

        <ol data-slot="process-steps" className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-slot="process-step"
              style={stagger(index, 70, 180)}
              className={cn(ENTER, 'relative flex flex-col gap-4 border-t border-border pt-6')}
            >
              <span aria-hidden className="absolute start-0 -top-px h-px w-12 bg-primary" />
              <span dir="ltr" className="self-start text-xs text-muted-foreground tabular-nums">
                <span className="text-foreground">{formatIndex(index)}</span>
                <span className="mx-1.5 text-border">|</span>
                {formatIndex(STEPS.length - 1)}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{step.body}</p>
              </div>
              <p className="mt-auto text-xs text-muted-foreground uppercase">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Process01;
