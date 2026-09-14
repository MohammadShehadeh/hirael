'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

export type PodPhase =
  'Running' | 'Pending' | 'Succeeded' | 'Failed' | 'CrashLoopBackOff' | 'ContainerCreating' | 'Terminating';

const phaseMeta: Record<PodPhase, { className: string; live?: boolean }> = {
  Running: { className: 'border-success/30 bg-success/10 text-success' },
  Succeeded: {
    className: 'border-border bg-accent text-muted-foreground',
  },
  Pending: { className: 'border-warning/30 bg-warning/10 text-warning' },
  ContainerCreating: {
    className: 'border-info/30 bg-info/10 text-info',
    live: true,
  },
  Terminating: {
    className: 'border-border bg-accent text-muted-foreground',
    live: true,
  },
  Failed: {
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
  CrashLoopBackOff: {
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
  },
};

interface K8sPodTableProps extends React.ComponentProps<'table'> {
  caption?: React.ReactNode;
}

const K8sPodTable = ({ className, caption, children, ...props }: K8sPodTableProps) => {
  return (
    <div data-slot="k8s-pod-table-container" className="w-full overflow-x-auto rounded-lg border border-border">
      <table data-slot="k8s-pod-table" className={cn('w-full caption-bottom text-sm', className)} {...props}>
        {caption ? <caption className="p-3 text-xs text-muted-foreground">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
};

const K8sPodTableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => {
  return (
    <thead
      data-slot="k8s-pod-table-header"
      className={cn('border-b border-border bg-muted/40 text-muted-foreground', className)}
      {...props}
    />
  );
};

const K8sPodTableHead = ({ className, ...props }: React.ComponentProps<'th'>) => {
  return (
    <th
      data-slot="k8s-pod-table-head"
      className={cn('h-9 px-3 text-start align-middle whitespace-nowrap text-xs font-medium uppercase', className)}
      {...props}
    />
  );
};

const K8sPodTableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => {
  return <tbody data-slot="k8s-pod-table-body" className={cn('divide-y divide-border', className)} {...props} />;
};

const K8sPodTableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => {
  return (
    <tr data-slot="k8s-pod-table-row" className={cn('transition-colors hover:bg-muted/40', className)} {...props} />
  );
};

const K8sPodTableCell = ({ className, ...props }: React.ComponentProps<'td'>) => {
  return (
    <td
      data-slot="k8s-pod-table-cell"
      className={cn('px-3 py-2.5 align-middle whitespace-nowrap text-xs text-muted-foreground', className)}
      {...props}
    />
  );
};

interface K8sPodNameProps extends React.ComponentProps<'td'> {
  namespace?: React.ReactNode;
}

const K8sPodName = ({ namespace, className, children, ...props }: K8sPodNameProps) => {
  return (
    <td data-slot="k8s-pod-name" className={cn('px-3 py-2.5 align-middle', className)} {...props}>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">{children}</span>
        {namespace ? <span className="text-[11px] text-muted-foreground">{namespace}</span> : null}
      </div>
    </td>
  );
};

interface K8sPodPhaseProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  phase: PodPhase;
  children?: React.ReactNode;
}

const K8sPodPhase = ({ phase, className, children, ...props }: K8sPodPhaseProps) => {
  const meta = phaseMeta[phase];
  return (
    <span
      data-slot="k8s-pod-phase"
      data-phase={phase}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        meta.className,
        className,
      )}
      {...props}
    >
      {meta.live ? (
        <span className="size-1.5 animate-pulse rounded-full bg-current motion-reduce:animate-none" aria-hidden />
      ) : null}
      {children ?? phase}
    </span>
  );
};

interface K8sPodRestartsProps extends React.ComponentProps<'td'> {
  count: number;
  /** Count at or above which restarts read as unhealthy. */
  warnAt?: number;
}

const K8sPodRestarts = ({ count, warnAt = 3, className, ...props }: K8sPodRestartsProps) => {
  return (
    <td
      data-slot="k8s-pod-restarts"
      className={cn(
        'px-3 py-2.5 align-middle text-xs',
        count >= warnAt ? 'text-destructive' : 'text-muted-foreground',
        className,
      )}
      {...props}
    >
      {count}
    </td>
  );
};

export {
  K8sPodTable,
  K8sPodTableHeader,
  K8sPodTableHead,
  K8sPodTableBody,
  K8sPodTableRow,
  K8sPodTableCell,
  K8sPodName,
  K8sPodPhase,
  K8sPodRestarts,
};

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

type PodRow = {
  name: string;
  ns: string;
  phase: PodPhase;
  ready: string;
  restarts: number;
  age: string;
  node: string;
};

const POD_ROWS: PodRow[] = [
  {
    name: 'api-7d9f8c-2xk4p',
    ns: 'default',
    phase: 'Running',
    ready: '2/2',
    restarts: 0,
    age: '6d',
    node: 'node-1',
  },
  {
    name: 'api-7d9f8c-9m1qz',
    ns: 'default',
    phase: 'Running',
    ready: '2/2',
    restarts: 1,
    age: '6d',
    node: 'node-2',
  },
  {
    name: 'worker-5b6a-jj20d',
    ns: 'jobs',
    phase: 'ContainerCreating',
    ready: '0/1',
    restarts: 0,
    age: '12s',
    node: 'node-3',
  },
  {
    name: 'cache-0',
    ns: 'data',
    phase: 'CrashLoopBackOff',
    ready: '0/1',
    restarts: 7,
    age: '3h',
    node: 'node-1',
  },
  {
    name: 'migrate-28471',
    ns: 'jobs',
    phase: 'Succeeded',
    ready: '0/1',
    restarts: 0,
    age: '1h',
    node: 'node-2',
  },
];

const POD_FILTERS: { value: string; label: string; phases: PodPhase[] }[] = [
  {
    value: 'all',
    label: 'All',
    phases: ['Running', 'Pending', 'ContainerCreating', 'Terminating', 'Succeeded', 'Failed', 'CrashLoopBackOff'],
  },
  { value: 'running', label: 'Running', phases: ['Running'] },
  { value: 'pending', label: 'Pending', phases: ['Pending', 'ContainerCreating', 'Terminating'] },
  { value: 'failing', label: 'Failing', phases: ['Failed', 'CrashLoopBackOff'] },
  { value: 'completed', label: 'Completed', phases: ['Succeeded'] },
];

const isFailing = (phase: PodPhase) => phase === 'Failed' || phase === 'CrashLoopBackOff';

const K8sPodTableBlock = () => {
  const [pods, setPods] = React.useState(POD_ROWS);
  const [filter, setFilter] = React.useState('all');
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const activeFilter = POD_FILTERS.find((option) => option.value === filter) ?? POD_FILTERS[0];
  const visiblePods = pods.filter((pod) => activeFilter.phases.includes(pod.phase));

  const updatePod = (name: string, patch: Partial<PodRow>) =>
    setPods((current) => current.map((pod) => (pod.name === name ? { ...pod, ...patch } : pod)));

  const restartPod = (name: string) => {
    updatePod(name, { phase: 'ContainerCreating', restarts: 0, age: '0s' });
    timers.current.push(setTimeout(() => updatePod(name, { phase: 'Running', ready: '1/1', age: '3s' }), 2400));
  };

  return (
    <section data-slot="k8s-pod-table-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className={cn(ENTER, 'flex w-full max-w-3xl flex-col gap-3')}>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={filter}
          onValueChange={(value) => value && setFilter(value)}
          aria-label="Filter pods by phase"
          className="max-w-full flex-wrap"
        >
          {POD_FILTERS.map((option) => {
            const count = pods.filter((pod) => option.phases.includes(pod.phase)).length;
            return (
              <ToggleGroupItem key={option.value} value={option.value} className="gap-1.5">
                {option.label}
                <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        <K8sPodTable caption={<span className="font-mono">kubectl get pods -A</span>}>
          <K8sPodTableHeader>
            <K8sPodTableRow>
              <K8sPodTableHead>Pod</K8sPodTableHead>
              <K8sPodTableHead>Status</K8sPodTableHead>
              <K8sPodTableHead>Ready</K8sPodTableHead>
              <K8sPodTableHead>Restarts</K8sPodTableHead>
              <K8sPodTableHead>Age</K8sPodTableHead>
              <K8sPodTableHead>Node</K8sPodTableHead>
            </K8sPodTableRow>
          </K8sPodTableHeader>
          <K8sPodTableBody key={filter} className={SWAP}>
            {visiblePods.length === 0 ? (
              <K8sPodTableRow className="hover:bg-transparent">
                <K8sPodTableCell colSpan={6} className="py-10 text-center text-sm">
                  No {activeFilter.label.toLowerCase()} pods in any namespace.
                </K8sPodTableCell>
              </K8sPodTableRow>
            ) : (
              visiblePods.map((pod) => (
                <K8sPodTableRow key={pod.name}>
                  <K8sPodName namespace={pod.ns}>{pod.name}</K8sPodName>
                  <K8sPodTableCell>
                    <span className="flex items-center gap-3">
                      <K8sPodPhase key={pod.phase} phase={pod.phase} className={SWAP} />
                      {isFailing(pod.phase) ? (
                        <Button variant="outline" size="xs" onClick={() => restartPod(pod.name)}>
                          Restart
                        </Button>
                      ) : null}
                    </span>
                  </K8sPodTableCell>
                  <K8sPodTableCell className="tabular-nums">{pod.ready}</K8sPodTableCell>
                  <K8sPodRestarts count={pod.restarts} className="tabular-nums" />
                  <K8sPodTableCell className="tabular-nums">{pod.age}</K8sPodTableCell>
                  <K8sPodTableCell>{pod.node}</K8sPodTableCell>
                </K8sPodTableRow>
              ))
            )}
          </K8sPodTableBody>
        </K8sPodTable>
      </div>
    </section>
  );
};

export default K8sPodTableBlock;
