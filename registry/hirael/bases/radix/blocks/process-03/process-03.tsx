'use client';

import * as React from 'react';
import { Check, GitBranch } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const STEPS = [
  {
    id: 'connect',
    title: 'Connect a repository',
    body: 'Sign in with GitHub and pick the repository. We read the framework from its files.',
  },
  {
    id: 'configure',
    title: 'Check the settings',
    body: 'The build command and output folder are filled in for you. Change them if yours differ.',
  },
  {
    id: 'deploy',
    title: 'Push to deploy',
    body: 'Every push builds a preview with its own URL. Merging to main updates production.',
  },
] as const;

type StepId = (typeof STEPS)[number]['id'];

const REPOSITORIES = [
  { name: 'hirael/storefront', detail: 'Next.js, updated 2 hours ago', isSelected: true },
  { name: 'hirael/docs', detail: 'Astro, updated yesterday', isSelected: false },
  { name: 'hirael/status', detail: 'Remix, updated 5 days ago', isSelected: false },
] as const;

const SETTINGS = [
  { label: 'Framework', value: 'Next.js' },
  { label: 'Build command', value: 'pnpm build' },
  { label: 'Output folder', value: '.next' },
  { label: 'Node version', value: '22' },
] as const;

const LOG = [
  { time: '00:00', line: 'Cloned hirael/storefront at 4f2c1ab' },
  { time: '00:06', line: 'Installed 1,412 packages from the shared cache' },
  { time: '00:31', line: 'Built 48 routes' },
  { time: '00:42', line: 'Live at storefront-git-main.hirael.com' },
] as const;

const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none';

const twoDigits = (value: number) => String(value).padStart(2, '0');

const ConnectPanel = () => (
  <ul className="flex flex-col">
    {REPOSITORIES.map((repository) => (
      <li key={repository.name} className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
        <GitBranch aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{repository.name}</span>
          <span className="truncate text-sm text-muted-foreground">{repository.detail}</span>
        </span>
        {repository.isSelected ? <Badge>Selected</Badge> : <Badge variant="outline">Import</Badge>}
      </li>
    ))}
  </ul>
);

const ConfigurePanel = () => (
  <dl className="flex flex-col">
    {SETTINGS.map((setting) => (
      <div
        key={setting.label}
        className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0"
      >
        <dt className="text-sm text-muted-foreground">{setting.label}</dt>
        <dd className="text-sm font-medium">{setting.value}</dd>
      </div>
    ))}
  </dl>
);

const DeployPanel = () => (
  <ol className="flex flex-col">
    {LOG.map((entry, index) => (
      <li key={entry.time} className="flex items-baseline gap-4 border-b border-border py-3 last:border-b-0">
        <span className="text-sm text-muted-foreground tabular-nums">{entry.time}</span>
        <span className={cn('flex-1 text-sm', index === LOG.length - 1 && 'font-medium')}>{entry.line}</span>
        {index === LOG.length - 1 && <Check aria-hidden className="size-4 shrink-0 self-center text-success" />}
      </li>
    ))}
  </ol>
);

const PANELS: Record<StepId, React.ReactNode> = {
  connect: <ConnectPanel />,
  configure: <ConfigurePanel />,
  deploy: <DeployPanel />,
};

const Process03 = () => {
  const [stepIndex, setStepIndex] = React.useState(0);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <section data-slot="process" className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <header className="flex flex-col gap-4">
          <span className="text-xs text-muted-foreground uppercase">How it works</span>
          <h2 className="max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            From repository to live URL in three steps.
          </h2>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          <ol data-slot="process-steps" className="flex flex-col">
            {STEPS.map((item, index) => (
              <li key={item.id} className="border-t border-border last:border-b">
                <button
                  type="button"
                  aria-current={index === stepIndex ? 'step' : undefined}
                  onClick={() => setStepIndex(index)}
                  className="group flex w-full gap-4 py-5 text-start focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="pt-1 text-xs text-muted-foreground tabular-nums group-aria-[current=step]:text-primary">
                    {twoDigits(index + 1)}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-lg font-medium tracking-[-0.01em] text-muted-foreground transition-colors duration-150 group-hover:text-foreground group-aria-[current=step]:text-foreground">
                      {item.title}
                    </span>
                    <span className="hidden text-sm leading-relaxed text-muted-foreground group-aria-[current=step]:block">
                      {item.body}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div data-slot="process-panel" className="flex flex-col rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
              <p aria-live="polite" className="text-sm font-medium">
                {step.title}
              </p>
              <span dir="ltr" className="text-xs text-foreground tabular-nums">
                {twoDigits(stepIndex + 1)}
                <span className="text-muted-foreground/60"> / {twoDigits(STEPS.length)}</span>
              </span>
            </div>
            <div key={step.id} className={cn(SWAP, 'min-h-64 flex-1 px-5 py-2')}>
              {PANELS[step.id]}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
              <Button
                variant="ghost"
                size="sm"
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((current) => current - 1)}
              >
                Back
              </Button>
              <Button size="sm" onClick={() => setStepIndex(isLast ? 0 : stepIndex + 1)}>
                {isLast ? 'Start over' : 'Next step'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process03;
