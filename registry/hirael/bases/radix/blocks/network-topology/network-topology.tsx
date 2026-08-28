'use client';

import * as React from 'react';
import { Database, Globe, HardDrive, Network, Server } from 'lucide-react';

import { cn } from '@/lib/utils';

type Point = [x: number, y: number];

export type EdgeStatus = 'active' | 'idle' | 'down';

const edgeStroke: Record<EdgeStatus, string> = {
  active: 'text-accent-cool',
  idle: 'text-border',
  down: 'text-destructive',
};

export type NodeStatus = 'online' | 'warning' | 'down' | 'idle';

const nodeDot: Record<NodeStatus, string> = {
  online: 'bg-success',
  warning: 'bg-warning',
  down: 'bg-destructive',
  idle: 'bg-muted-foreground',
};

// Keyframes travel with the component so the animated edges work the moment
// it is copied into a project — no globals.css or Tailwind config edits needed.
const TOPOLOGY_KEYFRAMES = `
@keyframes msh-network-dash {
  to { stroke-dashoffset: -14; }
}
`;

type NetworkTopologyProps = React.ComponentProps<'div'>;

const NetworkTopology = ({ className, children, ...props }: NetworkTopologyProps) => {
  return (
    <div
      data-slot="network-topology"
      dir="ltr"
      className={cn('relative w-full overflow-hidden rounded-lg border border-border bg-card', className)}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: TOPOLOGY_KEYFRAMES }} />
      {children}
    </div>
  );
};

type NetworkTopologyEdgesProps = React.ComponentProps<'svg'>;

const NetworkTopologyEdges = ({ className, ...props }: NetworkTopologyEdgesProps) => {
  return (
    <svg
      data-slot="network-topology-edges"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className={cn('absolute inset-0 size-full', className)}
      {...props}
    />
  );
};

interface NetworkEdgeProps extends Omit<React.ComponentProps<'line'>, 'x1' | 'y1' | 'x2' | 'y2' | 'from' | 'to'> {
  from: Point;
  to: Point;
  status?: EdgeStatus;
  animated?: boolean;
}

const NetworkEdge = ({ from, to, status = 'idle', animated, className, style, ...props }: NetworkEdgeProps) => {
  const isAnimated = animated && status !== 'down';
  return (
    <line
      data-slot="network-edge"
      data-status={status}
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      strokeDasharray={isAnimated ? '4 3' : undefined}
      style={
        isAnimated
          ? {
              animationName: 'msh-network-dash',
              animationDuration: '1s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              ...style,
            }
          : style
      }
      className={cn(edgeStroke[status], isAnimated && 'motion-reduce:[animation-play-state:paused]', className)}
      {...props}
    />
  );
};

interface NetworkNodeProps extends React.ComponentProps<'div'> {
  x: number;
  y: number;
  status?: NodeStatus;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
  variant?: 'node' | 'hub';
}

const NetworkNode = ({
  x,
  y,
  status = 'online',
  icon,
  label,
  sublabel,
  variant = 'node',
  className,
  style,
  ...props
}: NetworkNodeProps) => {
  return (
    <div
      data-slot="network-node"
      data-status={status}
      className={cn(
        'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border px-2.5 py-1.5 shadow-sm',
        variant === 'hub'
          ? 'border-primary/50 bg-primary/15 text-foreground'
          : 'border-border bg-card text-card-foreground',
        className,
      )}
      style={{ left: `${x}%`, top: `${y}%`, ...style }}
      {...props}
    >
      {icon ? <span className="flex size-4 items-center justify-center [&_svg]:size-4">{icon}</span> : null}
      {label || sublabel ? (
        <span className="flex min-w-0 flex-col leading-tight">
          {label ? <span className="truncate text-xs font-medium">{label}</span> : null}
          {sublabel ? <span className="truncate font-mono text-[10px] text-muted-foreground">{sublabel}</span> : null}
        </span>
      ) : null}
      <span className={cn('size-2 shrink-0 rounded-full ring-2 ring-card', nodeDot[status])} aria-hidden />
      <span className="sr-only">{status}</span>
    </div>
  );
};

export { NetworkTopology, NetworkTopologyEdges, NetworkEdge, NetworkNode };

const NetworkTopologyBlock = () => {
  return (
    <section data-slot="network-topology-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className="w-full max-w-2xl">
        <NetworkTopology className="h-80">
          <NetworkTopologyEdges>
            <NetworkEdge from={[50, 12]} to={[50, 38]} status="active" animated />
            <NetworkEdge from={[50, 38]} to={[22, 66]} status="active" animated />
            <NetworkEdge from={[50, 38]} to={[50, 66]} status="active" animated />
            <NetworkEdge from={[50, 38]} to={[78, 66]} status="down" />
            <NetworkEdge from={[22, 66]} to={[35, 90]} status="active" />
            <NetworkEdge from={[50, 66]} to={[35, 90]} status="active" />
            <NetworkEdge from={[50, 66]} to={[65, 90]} status="active" />
            <NetworkEdge from={[78, 66]} to={[65, 90]} status="idle" />
          </NetworkTopologyEdges>

          <NetworkNode x={50} y={12} variant="hub" status="online" icon={<Globe />} label="Gateway" sublabel="edge" />
          <NetworkNode x={50} y={38} status="online" icon={<Network />} label="Load balancer" sublabel="lb-01" />
          <NetworkNode x={22} y={66} status="online" icon={<Server />} label="api-1" sublabel="10.0.1.4" />
          <NetworkNode x={50} y={66} status="warning" icon={<Server />} label="api-2" sublabel="10.0.1.5" />
          <NetworkNode x={78} y={66} status="down" icon={<Server />} label="api-3" sublabel="10.0.1.6" />
          <NetworkNode x={35} y={90} status="online" icon={<Database />} label="db" sublabel="primary" />
          <NetworkNode x={65} y={90} status="idle" icon={<HardDrive />} label="cache" sublabel="redis" />
        </NetworkTopology>
      </div>
    </section>
  );
};

export default NetworkTopologyBlock;
