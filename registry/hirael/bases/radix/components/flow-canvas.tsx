'use client';

import '@xyflow/react/dist/style.css';

import * as React from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type ReactFlowProps,
} from '@xyflow/react';

import { cn } from '@/lib/utils';

const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return () => observer.disconnect();
};

// Follows the `.dark` class shadcn themes put on <html>.
const useDarkClass = () =>
  React.useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  );

// React Flow reads these variables; pointing them at shadcn tokens makes the canvas adopt your theme.
const THEME_VARS = {
  '--xy-background-color': 'var(--background)',
  '--xy-background-pattern-color': 'var(--border)',
  '--xy-node-background-color': 'var(--card)',
  '--xy-node-color': 'var(--card-foreground)',
  '--xy-node-border': '1px solid var(--border)',
  '--xy-node-border-radius': 'var(--radius)',
  '--xy-node-boxshadow-selected': '0 0 0 2px var(--ring)',
  '--xy-handle-background-color': 'var(--background)',
  '--xy-handle-border-color': 'var(--muted-foreground)',
  '--xy-edge-stroke': 'var(--muted-foreground)',
  '--xy-edge-stroke-selected': 'var(--primary)',
  '--xy-connectionline-stroke': 'var(--primary)',
  '--xy-edge-label-background-color': 'var(--card)',
  '--xy-edge-label-color': 'var(--muted-foreground)',
  '--xy-controls-button-background-color': 'var(--card)',
  '--xy-controls-button-background-color-hover': 'var(--accent)',
  '--xy-controls-button-color': 'var(--foreground)',
  '--xy-controls-button-color-hover': 'var(--accent-foreground)',
  '--xy-controls-button-border-color': 'var(--border)',
  '--xy-controls-box-shadow': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '--xy-minimap-background-color': 'var(--card)',
  '--xy-minimap-mask-background-color': 'color-mix(in oklch, var(--muted) 60%, transparent)',
  '--xy-minimap-node-background-color': 'var(--muted-foreground)',
  '--xy-attribution-background-color': 'transparent',
} as React.CSSProperties;

export interface FlowCanvasProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> extends ReactFlowProps<
  NodeType,
  EdgeType
> {
  /** Show zoom and fit buttons in the corner. */
  controls?: boolean;
  /** Show an overview of the whole graph in the corner. */
  minimap?: boolean;
  /** Dot grid behind the nodes. */
  background?: boolean;
}

/**
 * React Flow with your theme: canvas, edges, handles, controls and minimap all
 * use your tokens and follow light and dark mode. Takes every React Flow prop.
 */
const FlowCanvas = <NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  controls = true,
  minimap = false,
  background = true,
  nodeTypes,
  className,
  style,
  children,
  ...props
}: FlowCanvasProps<NodeType, EdgeType>) => {
  const dark = useDarkClass();

  return (
    <div
      data-slot="flow-canvas"
      className={cn('h-96 w-full overflow-hidden rounded-lg border border-border', className)}
      style={{ ...THEME_VARS, ...style }}
    >
      <ReactFlow
        colorMode={dark ? 'dark' : 'light'}
        nodeTypes={nodeTypes ?? FLOW_NODE_TYPES}
        proOptions={{ hideAttribution: true }}
        fitView
        {...props}
      >
        {background && <Background variant={BackgroundVariant.Dots} gap={16} size={1} />}
        {controls && <Controls showInteractive={false} />}
        {minimap && <MiniMap pannable zoomable />}
        {children}
      </ReactFlow>
    </div>
  );
};

export type FlowNodeStatus = 'idle' | 'running' | 'done' | 'error';

const STATUS_DOT: Record<FlowNodeStatus, string> = {
  idle: 'bg-muted-foreground/40',
  running: 'bg-primary animate-pulse motion-reduce:animate-none',
  done: 'bg-success',
  error: 'bg-destructive',
};

export interface FlowNodeProps extends React.ComponentProps<'div'> {
  /** Draws the selection ring, from React Flow's `selected` node prop. */
  selected?: boolean;
}

/** The card a node renders. Compose the header, body and handles inside it, or use the `card` node type. */
const FlowNode = ({ selected, className, ...props }: FlowNodeProps) => {
  return (
    <div
      data-slot="flow-node"
      data-selected={selected || undefined}
      className={cn(
        'w-60 rounded-lg border border-border bg-card text-card-foreground shadow-xs transition-shadow data-selected:ring-2 data-selected:ring-ring',
        className,
      )}
      {...props}
    />
  );
};

export interface FlowNodeHeaderProps extends React.ComponentProps<'div'> {
  icon?: React.ReactNode;
  status?: FlowNodeStatus;
}

const FlowNodeHeader = ({ icon, status, className, children, ...props }: FlowNodeHeaderProps) => {
  return (
    <div
      data-slot="flow-node-header"
      className={cn('flex items-center gap-2 border-b border-border px-3 py-2 text-sm font-medium', className)}
      {...props}
    >
      {icon && (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {status && <span aria-hidden className={cn('size-2 shrink-0 rounded-full', STATUS_DOT[status])} />}
    </div>
  );
};

const FlowNodeBody = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="flow-node-body"
      className={cn('px-3 py-2 text-xs leading-relaxed text-muted-foreground', className)}
      {...props}
    />
  );
};

export interface FlowNodeHandleProps extends Omit<React.ComponentProps<typeof Handle>, 'position'> {
  /** Which edge of the card the handle sits on. */
  position?: Position;
}

/** A connection point styled to match the card. Targets default to the top, sources to the bottom. */
const FlowNodeHandle = ({ type, position, className, ...props }: FlowNodeHandleProps) => {
  return (
    <Handle
      type={type}
      position={position ?? (type === 'target' ? Position.Top : Position.Bottom)}
      className={cn('size-2.5! border-2! border-muted-foreground! bg-background!', className)}
      {...props}
    />
  );
};

export interface FlowCardData extends Record<string, unknown> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: FlowNodeStatus;
  /** Leave out the input handle, for a trigger that starts the flow. */
  noInput?: boolean;
  /** Leave out the output handle, for a step that ends the flow. */
  noOutput?: boolean;
}

export type FlowCardNode = Node<FlowCardData, 'card'>;

const FlowCard = ({ data, selected }: NodeProps<FlowCardNode>) => {
  return (
    <FlowNode selected={selected}>
      {!data.noInput && <FlowNodeHandle type="target" />}
      <FlowNodeHeader icon={data.icon} status={data.status}>
        {data.title}
      </FlowNodeHeader>
      {data.description && <FlowNodeBody>{data.description}</FlowNodeBody>}
      {!data.noOutput && <FlowNodeHandle type="source" />}
    </FlowNode>
  );
};

/** Node types FlowCanvas uses unless you pass your own. Spread them into yours to keep `card`. */
const FLOW_NODE_TYPES = { card: FlowCard };

export { FlowCanvas, FlowNode, FlowNodeHeader, FlowNodeBody, FlowNodeHandle, FlowCard, FLOW_NODE_TYPES };
