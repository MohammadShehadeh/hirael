'use client';

import * as React from 'react';
import { CircleAlert, GitBranch, LifeBuoy, RotateCw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/registry/hirael/bases/base/components/copy-button';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/base/ui/empty';
import { Skeleton } from '@/registry/hirael/bases/base/ui/skeleton';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 40): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

type Phase = 'error' | 'loading' | 'ready';
type DeployStatus = 'Ready' | 'Building' | 'Failed';

interface Deployment {
  id: string;
  commit: string;
  branch: string;
  author: string;
  environment: 'Production' | 'Preview';
  status: DeployStatus;
  duration: string;
  age: string;
}

const DEPLOYMENTS: readonly Deployment[] = [
  {
    id: 'dpl_4k9s2m',
    commit: 'Show saved cards first at checkout',
    branch: 'feat/saved-cards',
    author: 'Jonah Weiss',
    environment: 'Preview',
    status: 'Building',
    duration: '0m 51s',
    age: 'Just now',
  },
  {
    id: 'dpl_8f2c7q',
    commit: 'Fix cart total rounding for JPY',
    branch: 'main',
    author: 'Priya Raman',
    environment: 'Production',
    status: 'Ready',
    duration: '1m 42s',
    age: '4m ago',
  },
  {
    id: 'dpl_3n7x1d',
    commit: 'Bump next to 16.2.1',
    branch: 'deps/next-16-2',
    author: 'Renovate',
    environment: 'Preview',
    status: 'Failed',
    duration: '0m 47s',
    age: '1h ago',
  },
  {
    id: 'dpl_6t1r9b',
    commit: 'Add size guide to product pages',
    branch: 'feat/size-guide',
    author: 'Tomás Ruiz',
    environment: 'Preview',
    status: 'Ready',
    duration: '1m 58s',
    age: '2h ago',
  },
  {
    id: 'dpl_2h5w8e',
    commit: 'Cache product images at the edge',
    branch: 'main',
    author: 'Priya Raman',
    environment: 'Production',
    status: 'Ready',
    duration: '2m 05s',
    age: '3h ago',
  },
];

const STATUS_DOT: Record<DeployStatus, string> = {
  Ready: 'bg-success',
  Building: 'bg-warning animate-pulse motion-reduce:animate-none',
  Failed: 'bg-destructive',
};

// One reference per failed attempt, so support can match the report to the right request.
const ERROR_REFS = ['DPL-7F3A-9C21', 'DPL-2B8E-41D0'] as const;
const FAILURES_BEFORE_SUCCESS = ERROR_REFS.length;
const LOAD_MS = 1000;

const EmptyState03 = () => {
  const [phase, setPhase] = React.useState<Phase>('error');
  const [failures, setFailures] = React.useState(1);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const errorRef = ERROR_REFS[Math.min(failures, ERROR_REFS.length) - 1];

  const retry = () => {
    setPhase('loading');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (failures < FAILURES_BEFORE_SUCCESS) {
        setFailures(failures + 1);
        setPhase('error');
      } else {
        setPhase('ready');
      }
    }, LOAD_MS);
  };

  const supportHref = `mailto:support@shipyard.dev?subject=${encodeURIComponent(`Deployments failed to load (${errorRef})`)}`;

  return (
    <section data-slot="empty-state-03" className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <div
          data-slot="empty-state-03-panel"
          className={cn(ENTER, 'overflow-hidden rounded-lg border border-border bg-card text-card-foreground')}
        >
          <header
            data-slot="empty-state-03-header"
            className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5"
          >
            <div className="flex min-w-0 flex-col">
              <h2 className="text-sm font-medium text-foreground">Recent deployments</h2>
              <p className="truncate text-xs text-muted-foreground">storefront</p>
            </div>
            <p aria-live="polite" className="text-xs text-muted-foreground">
              {phase === 'loading' ? 'Loading' : phase === 'ready' ? 'Updated just now' : null}
            </p>
          </header>

          {phase === 'error' ? (
            <Empty key={`error-${failures}`} className={SWAP}>
              <EmptyHeader>
                <EmptyMedia>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <CircleAlert aria-hidden className="size-5" />
                  </span>
                </EmptyMedia>
                <EmptyTitle>Couldn&apos;t load deployments</EmptyTitle>
                <EmptyDescription>
                  The deployments service didn&apos;t respond in time. Your deployments are not affected, only this
                  list.
                </EmptyDescription>
                {failures > 1 ? (
                  <p data-slot="empty-state-03-attempt" className="text-xs text-muted-foreground tabular-nums">
                    Attempt {failures} failed too. If the next one fails, send us the reference below.
                  </p>
                ) : null}
              </EmptyHeader>

              <EmptyContent>
                <div
                  data-slot="empty-state-03-reference"
                  className="flex items-center gap-2 rounded-md border border-border py-1 ps-3 pe-1"
                >
                  <span className="text-xs text-muted-foreground uppercase">Reference</span>
                  <span className="text-sm text-foreground tabular-nums">{errorRef}</span>
                  <CopyButton value={errorRef} size="sm" label="Copy error reference" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button type="button" onClick={retry}>
                    <RotateCw aria-hidden />
                    Try again
                  </Button>
                  <Button variant="ghost" render={<a href={supportHref} />} nativeButton={false}>
                    <LifeBuoy aria-hidden />
                    Contact support
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          ) : phase === 'loading' ? (
            <div data-slot="empty-state-03-loading" aria-busy="true">
              <span className="sr-only">Loading deployments</span>
              <ul className="divide-y divide-border">
                {DEPLOYMENTS.map((deployment) => (
                  <li key={deployment.id} aria-hidden className="flex items-center gap-4 px-5 py-3.5">
                    <Skeleton className="size-2" />
                    <span className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-3.5 w-3/5" />
                      <Skeleton className="h-3 w-2/5" />
                    </span>
                    <Skeleton className="hidden h-5 w-20 sm:block" />
                    <Skeleton className="h-3 w-12" />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul data-slot="empty-state-03-list" className="divide-y divide-border">
              {DEPLOYMENTS.map((deployment, index) => (
                <li
                  key={deployment.id}
                  data-slot="empty-state-03-row"
                  style={stagger(index)}
                  className={cn(SWAP, 'flex items-center gap-4 px-5 py-3.5')}
                >
                  <span aria-hidden className={cn('size-2 shrink-0 rounded-full', STATUS_DOT[deployment.status])} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-foreground">{deployment.commit}</span>
                    <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="sr-only">{deployment.status},</span>
                      <GitBranch aria-hidden className="size-3.5 shrink-0" />
                      <span className="truncate">{deployment.branch}</span>
                      <span className="truncate">by {deployment.author}</span>
                    </span>
                  </span>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    {deployment.environment}
                  </Badge>
                  <span className="flex w-16 shrink-0 flex-col items-end text-xs text-muted-foreground tabular-nums">
                    <span className="text-foreground">{deployment.duration}</span>
                    <span>{deployment.age}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmptyState03;
