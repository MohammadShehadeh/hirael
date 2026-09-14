'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type NodeHealth = 'healthy' | 'warning' | 'critical' | 'idle';

const healthFill: Record<NodeHealth, string> = {
  healthy: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-destructive',
  idle: 'bg-muted-foreground',
};

const healthDot: Record<NodeHealth, string> = healthFill;

const healthLabel: Record<NodeHealth, string> = {
  healthy: 'Healthy',
  warning: 'Warning',
  critical: 'Critical',
  idle: 'Idle',
};

interface ClusterMapProps extends React.ComponentProps<'div'> {
  columns?: number;
}

const ClusterMap = ({ columns = 12, className, style, ...props }: ClusterMapProps) => {
  return (
    <div
      data-slot="cluster-map"
      className={cn('grid gap-1.5', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
    />
  );
};

interface ClusterNodeProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  health: NodeHealth;
  label?: React.ReactNode;
  /** Utilization from 0 to 1, drives the fill intensity. */
  load?: number;
  active?: boolean;
}

const ClusterNode = ({ health, label, load = 1, active, className, title, ...props }: ClusterNodeProps) => {
  const opacity = 0.25 + Math.max(0, Math.min(1, load)) * 0.75;
  return (
    <button
      type="button"
      data-slot="cluster-node"
      data-health={health}
      title={title ?? (label ? String(label) : healthLabel[health])}
      aria-label={label ? `${label}, ${healthLabel[health]}` : healthLabel[health]}
      aria-pressed={active === undefined ? undefined : active}
      data-active={active ? '' : undefined}
      className={cn(
        'group relative aspect-square rounded-sm outline-none transition-transform',
        'hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring',
        active && 'z-10 scale-110 ring-2 ring-foreground ring-offset-1 ring-offset-background',
        className,
      )}
      {...props}
    >
      <span className={cn('absolute inset-0 rounded-sm', healthFill[health])} style={{ opacity }} aria-hidden />
    </button>
  );
};

type ClusterMapLegendProps = React.ComponentProps<'div'>;

const ClusterMapLegend = ({ className, ...props }: ClusterMapLegendProps) => {
  return (
    <div
      data-slot="cluster-map-legend"
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
};

interface ClusterMapLegendItemProps extends React.ComponentProps<'span'> {
  health: NodeHealth;
}

const ClusterMapLegendItem = ({ health, className, children, ...props }: ClusterMapLegendItemProps) => {
  return (
    <span data-slot="cluster-map-legend-item" className={cn('inline-flex items-center gap-1.5', className)} {...props}>
      <span className={cn('size-2.5 rounded-sm', healthDot[health])} aria-hidden />
      {children ?? healthLabel[health]}
    </span>
  );
};

export { ClusterMap, ClusterNode, ClusterMapLegend, ClusterMapLegendItem };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const CLUSTER_COLUMNS = 16;
const CLUSTER_ROWS = 6;

const clusterHealthFor = (i: number): NodeHealth => {
  if (i % 37 === 0) return 'critical';
  if (i % 11 === 0) return 'warning';
  if (i % 9 === 0) return 'idle';
  return 'healthy';
};

const CLUSTER_NODES = Array.from({ length: CLUSTER_COLUMNS * CLUSTER_ROWS }, (_, i) => {
  const health = clusterHealthFor(i);
  return {
    id: i,
    name: `node-${String(i + 1).padStart(3, '0')}`,
    zone: ['eu-west-1a', 'eu-west-1b', 'eu-west-1c'][i % 3],
    health,
    load: health === 'idle' ? 0.08 : 0.4 + ((i * 7) % 60) / 100,
    pods: health === 'idle' ? 0 : 12 + ((i * 5) % 24),
  };
});

const healthTone: Record<NodeHealth, string> = {
  healthy: 'text-success',
  warning: 'text-warning',
  critical: 'text-destructive',
  idle: 'text-muted-foreground',
};

const ClusterMapBlock = () => {
  const [selectedId, setSelectedId] = React.useState<number | null>(37);
  const selected = selectedId === null ? null : CLUSTER_NODES[selectedId];
  const counts = CLUSTER_NODES.reduce<Record<NodeHealth, number>>(
    (acc, node) => ({ ...acc, [node.health]: acc[node.health] + 1 }),
    { healthy: 0, warning: 0, critical: 0, idle: 0 },
  );

  return (
    <section data-slot="cluster-map-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className={cn(ENTER, 'flex w-full max-w-2xl flex-col gap-4')}>
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
            <span>prod-cluster</span>
            <span aria-hidden className="text-border">
              |
            </span>
            <span className="tabular-nums">{CLUSTER_NODES.length} nodes</span>
          </p>
          <ClusterMap columns={CLUSTER_COLUMNS}>
            {CLUSTER_NODES.map((node) => (
              <ClusterNode
                key={node.id}
                health={node.health}
                load={node.load}
                label={node.name}
                active={node.id === selectedId}
                onClick={() => setSelectedId((current) => (current === node.id ? null : node.id))}
              />
            ))}
          </ClusterMap>
        </div>

        <div
          data-slot="cluster-map-details"
          aria-live="polite"
          className="min-h-14 rounded-md border border-border bg-card/40 px-4 py-3"
        >
          {selected ? (
            <dl key={selected.id} className={cn(SWAP, 'grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4')}>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">Node</dt>
                <dd className="font-medium">{selected.name}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">Health</dt>
                <dd className={cn('flex items-center gap-1.5', healthTone[selected.health])}>
                  <span aria-hidden className={cn('size-2 rounded-sm', healthFill[selected.health])} />
                  {healthLabel[selected.health]}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">CPU load</dt>
                <dd className="tabular-nums">{Math.round(selected.load * 100)}%</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">Pods</dt>
                <dd className="tabular-nums">
                  {selected.pods}
                  <span className="ms-1.5 text-xs text-muted-foreground">{selected.zone}</span>
                </dd>
              </div>
            </dl>
          ) : (
            <p key="empty" className={cn(SWAP, 'py-2 text-sm text-muted-foreground')}>
              Select a node to see its health and load.
            </p>
          )}
        </div>

        <ClusterMapLegend>
          {(Object.keys(healthLabel) as NodeHealth[]).map((health) => (
            <ClusterMapLegendItem key={health} health={health}>
              {healthLabel[health]}
              <span className="tabular-nums text-foreground">{counts[health]}</span>
            </ClusterMapLegendItem>
          ))}
        </ClusterMapLegend>
      </div>
    </section>
  );
};

export default ClusterMapBlock;
