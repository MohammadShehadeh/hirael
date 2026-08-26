"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type NodeHealth = "healthy" | "warning" | "critical" | "idle";

const healthFill: Record<NodeHealth, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
  idle: "bg-muted-foreground",
};

const healthDot: Record<NodeHealth, string> = healthFill;

const healthLabel: Record<NodeHealth, string> = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  idle: "Idle",
};

interface ClusterMapProps extends React.ComponentProps<"div"> {
  columns?: number;}

const ClusterMap = ({
  columns = 12,
  className,
  style,
  ...props
}: ClusterMapProps) => {
  return (
    <div
      data-slot="cluster-map"
      className={cn("grid gap-1.5", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
    />
  );
};

interface ClusterNodeProps extends Omit<React.ComponentProps<"button">, "children"> {
  health: NodeHealth;
  label?: React.ReactNode;
  /** Utilization 0–1, drives the fill intensity. */
  load?: number;
  active?: boolean;}

const ClusterNode = ({
  health,
  label,
  load = 1,
  active,
  className,
  title,
  ...props
}: ClusterNodeProps) => {
  const opacity = 0.25 + Math.max(0, Math.min(1, load)) * 0.75;
  return (
    <button
      type="button"
      data-slot="cluster-node"
      data-health={health}
      title={title ?? (label ? String(label) : healthLabel[health])}
      aria-label={
        label ? `${label}, ${healthLabel[health]}` : healthLabel[health]
      }
      className={cn(
        "group relative aspect-square rounded-sm outline-none transition-transform",
        "hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring",
        active && "ring-2 ring-ring",
        className,
      )}
      {...props}
    >
      <span
        className={cn("absolute inset-0 rounded-sm", healthFill[health])}
        style={{ opacity }}
        aria-hidden
      />
    </button>
  );
};

type ClusterMapLegendProps = React.ComponentProps<"div">;

const ClusterMapLegend = ({ className, ...props }: ClusterMapLegendProps) => {
  return (
    <div
      data-slot="cluster-map-legend"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

interface ClusterMapLegendItemProps extends React.ComponentProps<"span"> {
  health: NodeHealth;}

const ClusterMapLegendItem = ({
  health,
  className,
  children,
  ...props
}: ClusterMapLegendItemProps) => {
  return (
    <span
      data-slot="cluster-map-legend-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <span
        className={cn("size-2.5 rounded-sm", healthDot[health])}
        aria-hidden
      />
      {children ?? healthLabel[health]}
    </span>
  );
};

export { ClusterMap, ClusterNode, ClusterMapLegend, ClusterMapLegendItem };

const CLUSTER_COLUMNS = 16;
const CLUSTER_ROWS = 6;

const clusterHealthFor = (i: number): NodeHealth => {
  if (i % 37 === 0) return "critical";
  if (i % 11 === 0) return "warning";
  if (i % 9 === 0) return "idle";
  return "healthy";
};

const ClusterMapBlock = () => {
  const nodes = Array.from(
    { length: CLUSTER_COLUMNS * CLUSTER_ROWS },
    (_, i) => ({
      id: i,
      health: clusterHealthFor(i),
      load: 0.4 + ((i * 7) % 60) / 100,
    }),
  );

  return (
    <section
      data-slot="cluster-map-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            prod-cluster · 96 nodes
          </p>
          <ClusterMap columns={CLUSTER_COLUMNS}>
            {nodes.map((node) => (
              <ClusterNode
                key={node.id}
                health={node.health}
                load={node.load}
                label={`node-${String(node.id + 1).padStart(3, "0")}`}
              />
            ))}
          </ClusterMap>
        </div>
        <ClusterMapLegend>
          <ClusterMapLegendItem health="healthy">Healthy</ClusterMapLegendItem>
          <ClusterMapLegendItem health="warning">Warning</ClusterMapLegendItem>
          <ClusterMapLegendItem health="critical">
            Critical
          </ClusterMapLegendItem>
          <ClusterMapLegendItem health="idle">Idle</ClusterMapLegendItem>
        </ClusterMapLegend>
      </div>
    </section>
  );
};

export default ClusterMapBlock;
