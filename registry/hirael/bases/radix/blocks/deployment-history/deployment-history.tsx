'use client';

import * as React from 'react';
import { CheckCircle2, Clock, GitCommitHorizontal, Loader2, RotateCcw, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

export type DeploymentState = 'success' | 'failed' | 'building' | 'rolled-back' | 'queued';

const stateMeta: Record<DeploymentState, { icon: React.ElementType; text: string; ring: string; label: string }> = {
  success: {
    icon: CheckCircle2,
    text: 'text-success',
    ring: 'border-success/40',
    label: 'Deployed',
  },
  failed: {
    icon: XCircle,
    text: 'text-destructive',
    ring: 'border-destructive/40',
    label: 'Failed',
  },
  building: {
    icon: Loader2,
    text: 'text-info',
    ring: 'border-info/40',
    label: 'Building',
  },
  'rolled-back': {
    icon: RotateCcw,
    text: 'text-warning',
    ring: 'border-warning/40',
    label: 'Rolled back',
  },
  queued: {
    icon: Clock,
    text: 'text-muted-foreground',
    ring: 'border-border',
    label: 'Queued',
  },
};

type DeploymentHistoryProps = React.ComponentProps<'ol'>;

const DeploymentHistory = ({ className, ...props }: DeploymentHistoryProps) => {
  return <ol data-slot="deployment-history" className={cn('flex flex-col', className)} {...props} />;
};

interface DeploymentHistoryItemProps extends React.ComponentProps<'li'> {
  state: DeploymentState;
  version: React.ReactNode;
  environment?: React.ReactNode;
  /** Hide the connecting rail below (pass on the last item). */
  last?: boolean;
}

const DeploymentHistoryItem = ({
  state,
  version,
  environment,
  last,
  className,
  children,
  ...props
}: DeploymentHistoryItemProps) => {
  const meta = stateMeta[state];
  const Icon = meta.icon;
  return (
    <li
      data-slot="deployment-history-item"
      data-state={state}
      className={cn('relative flex gap-3 ps-1', className)}
      {...props}
    >
      <div className="flex flex-col items-center">
        <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border bg-card', meta.ring)}>
          <Icon
            className={cn('size-4', meta.text, state === 'building' && 'animate-spin motion-reduce:animate-none')}
            aria-hidden
          />
        </span>
        {!last ? <span className="w-px flex-1 bg-border" aria-hidden /> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{version}</span>
          {environment ? (
            <span className="rounded-sm bg-accent px-1.5 py-0.5 text-xs uppercase text-muted-foreground">
              {environment}
            </span>
          ) : null}
          <span className={cn('text-xs font-medium', meta.text)}>{meta.label}</span>
        </div>
        {children}
      </div>
    </li>
  );
};

type DeploymentHistoryMetaProps = React.ComponentProps<'div'>;

const DeploymentHistoryMeta = ({ className, ...props }: DeploymentHistoryMetaProps) => {
  return (
    <div
      data-slot="deployment-history-meta"
      className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
};

interface DeploymentHistoryCommitProps extends React.ComponentProps<'span'> {
  sha: React.ReactNode;
}

const DeploymentHistoryCommit = ({ sha, className, children, ...props }: DeploymentHistoryCommitProps) => {
  return (
    <span data-slot="deployment-history-commit" className={cn('inline-flex items-center gap-1', className)} {...props}>
      <GitCommitHorizontal className="size-3.5" aria-hidden />
      <span>{sha}</span>
      {children}
    </span>
  );
};

export { DeploymentHistory, DeploymentHistoryItem, DeploymentHistoryMeta, DeploymentHistoryCommit };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

type Deployment = {
  id: string;
  state: DeploymentState;
  version: string;
  environment: string;
  sha: string;
  note: string;
  when: string;
  duration?: string;
};

const DEPLOYMENTS: Deployment[] = [
  {
    id: 'dpl-5',
    state: 'building',
    version: 'v2.4.1',
    environment: 'staging',
    sha: 'a1b9c4d',
    note: 'by maya',
    when: 'just now',
  },
  {
    id: 'dpl-4',
    state: 'success',
    version: 'v2.4.0',
    environment: 'production',
    sha: 'e84f2c7',
    note: 'by omar',
    when: '2h ago',
    duration: '48s',
  },
  {
    id: 'dpl-3',
    state: 'success',
    version: 'v2.3.9',
    environment: 'production',
    sha: '7f2e10a',
    note: 'by lena',
    when: 'yesterday',
    duration: '52s',
  },
  {
    id: 'dpl-2',
    state: 'rolled-back',
    version: 'v2.3.8',
    environment: 'production',
    sha: 'c03be91',
    note: 'reverted failing migration',
    when: '2d ago',
  },
  {
    id: 'dpl-1',
    state: 'failed',
    version: 'v2.3.7',
    environment: 'staging',
    sha: '11de4f0',
    note: 'build step exited 1',
    when: '2d ago',
  },
];

type RollbackStep = 'idle' | 'confirm' | 'pending';

const DeploymentHistoryBlock = () => {
  const [deployments, setDeployments] = React.useState(DEPLOYMENTS);
  const [target, setTarget] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<RollbackStep>('idle');
  const [addedId, setAddedId] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const live = deployments.find(
    (deployment) => deployment.environment === 'production' && deployment.state === 'success',
  );

  const rollback = (deployment: Deployment) => {
    setStep('pending');
    timer.current = setTimeout(() => {
      const id = `dpl-${deployments.length + 1}`;
      setDeployments((current) => [
        {
          ...deployment,
          id,
          state: 'success',
          note: `rolled back from ${live?.version ?? 'latest'}`,
          when: 'just now',
          duration: '31s',
        },
        ...current.map((item) => (item.id === live?.id ? { ...item, state: 'rolled-back' as const } : item)),
      ]);
      setAddedId(id);
      setTarget(null);
      setStep('idle');
    }, 1800);
  };

  return (
    <section data-slot="deployment-history-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className={cn(ENTER, 'w-full max-w-lg')}>
        <DeploymentHistory>
          {deployments.map((deployment, index) => {
            const canRollback =
              deployment.environment === 'production' &&
              deployment.state === 'success' &&
              deployment.version !== live?.version;
            const isTarget = target === deployment.id;

            return (
              <DeploymentHistoryItem
                key={deployment.id}
                state={deployment.state}
                version={deployment.version}
                environment={deployment.environment}
                last={index === deployments.length - 1}
                className={cn(deployment.id === addedId && SWAP)}
              >
                <DeploymentHistoryMeta>
                  <DeploymentHistoryCommit sha={deployment.sha} />
                  <span>{deployment.note}</span>
                  <span>{deployment.when}</span>
                  {deployment.duration ? <span className="tabular-nums">{deployment.duration}</span> : null}
                </DeploymentHistoryMeta>

                {canRollback ? (
                  <div data-slot="deployment-history-actions" className="pt-1.5">
                    {!isTarget ? (
                      <Button
                        variant="outline"
                        size="xs"
                        disabled={step !== 'idle'}
                        onClick={() => {
                          setTarget(deployment.id);
                          setStep('confirm');
                        }}
                      >
                        <RotateCcw aria-hidden />
                        Roll back to {deployment.version}
                      </Button>
                    ) : (
                      <div
                        key={step}
                        className={cn(
                          SWAP,
                          'flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2',
                        )}
                      >
                        {step === 'pending' ? (
                          <span role="status" className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
                            Rolling production back to {deployment.version}
                          </span>
                        ) : (
                          <>
                            <span className="me-auto text-xs text-foreground">
                              Replace {live?.version} in production with {deployment.version}?
                            </span>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => {
                                setTarget(null);
                                setStep('idle');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button size="xs" onClick={() => rollback(deployment)}>
                              Roll back
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </DeploymentHistoryItem>
            );
          })}
        </DeploymentHistory>
      </div>
    </section>
  );
};

export default DeploymentHistoryBlock;
