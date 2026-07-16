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

type ClusterMapProps = React.ComponentProps<"div"> & {
  columns?: number;
};

function ClusterMap({
  columns = 12,
  className,
  style,
  ...props
}: ClusterMapProps) {
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
}

type ClusterNodeProps = Omit<React.ComponentProps<"button">, "children"> & {
  health: NodeHealth;
  label?: React.ReactNode;
  /** Utilization 0–1, drives the fill intensity. */
  load?: number;
  active?: boolean;
};

function ClusterNode({
  health,
  label,
  load = 1,
  active,
  className,
  title,
  ...props
}: ClusterNodeProps) {
  const opacity = 0.25 + Math.max(0, Math.min(1, load)) * 0.75;
  return (
    <button
      type="button"
      data-slot="cluster-node"
      data-health={health}
      title={title ?? (label ? String(label) : healthLabel[health])}
      aria-label={
        label ? `${label} — ${healthLabel[health]}` : healthLabel[health]
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
}

type ClusterMapLegendProps = React.ComponentProps<"div">;

function ClusterMapLegend({ className, ...props }: ClusterMapLegendProps) {
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
}

type ClusterMapLegendItemProps = React.ComponentProps<"span"> & {
  health: NodeHealth;
};

function ClusterMapLegendItem({
  health,
  className,
  children,
  ...props
}: ClusterMapLegendItemProps) {
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
}

export { ClusterMap, ClusterNode, ClusterMapLegend, ClusterMapLegendItem };
