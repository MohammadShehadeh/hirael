'use client';

import * as React from 'react';
import { CheckCircle2, Clock, GitCommitHorizontal, Loader2, RotateCcw, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

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
          <Icon className={cn('size-4', meta.text, state === 'building' && 'animate-spin')} aria-hidden />
        </span>
        {!last ? <span className="w-px flex-1 bg-border" aria-hidden /> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-medium text-foreground">{version}</span>
          {environment ? (
            <span className="rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
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
      <span className="font-mono">{sha}</span>
      {children}
    </span>
  );
};

export { DeploymentHistory, DeploymentHistoryItem, DeploymentHistoryMeta, DeploymentHistoryCommit };

const DeploymentHistoryBlock = () => {
  return (
    <section data-slot="deployment-history-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className="w-full max-w-lg">
        <DeploymentHistory>
          <DeploymentHistoryItem state="building" version="v2.4.0" environment="production">
            <DeploymentHistoryMeta>
              <DeploymentHistoryCommit sha="a1b9c4d" />
              <span>by maya</span>
              <span>just now</span>
            </DeploymentHistoryMeta>
          </DeploymentHistoryItem>

          <DeploymentHistoryItem state="success" version="v2.3.9" environment="production">
            <DeploymentHistoryMeta>
              <DeploymentHistoryCommit sha="7f2e10a" />
              <span>by omar</span>
              <span>2h ago · 48s</span>
            </DeploymentHistoryMeta>
          </DeploymentHistoryItem>

          <DeploymentHistoryItem state="rolled-back" version="v2.3.8" environment="production">
            <DeploymentHistoryMeta>
              <DeploymentHistoryCommit sha="c03be91" />
              <span>reverted failing migration</span>
              <span>5h ago</span>
            </DeploymentHistoryMeta>
          </DeploymentHistoryItem>

          <DeploymentHistoryItem state="failed" version="v2.3.7" environment="staging" last>
            <DeploymentHistoryMeta>
              <DeploymentHistoryCommit sha="11de4f0" />
              <span>build step exited 1</span>
              <span>6h ago</span>
            </DeploymentHistoryMeta>
          </DeploymentHistoryItem>
        </DeploymentHistory>
      </div>
    </section>
  );
};

export default DeploymentHistoryBlock;
