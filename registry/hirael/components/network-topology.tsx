"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Point = [x: number, y: number];

export type EdgeStatus = "active" | "idle" | "down";

const edgeStroke: Record<EdgeStatus, string> = {
  active: "text-accent-cool",
  idle: "text-border",
  down: "text-destructive",
};

export type NodeStatus = "online" | "warning" | "down" | "idle";

const nodeDot: Record<NodeStatus, string> = {
  online: "bg-success",
  warning: "bg-warning",
  down: "bg-destructive",
  idle: "bg-muted-foreground",
};

// Keyframes travel with the component so the animated edges work the moment
// it is copied into a project — no globals.css or Tailwind config edits needed.
const TOPOLOGY_KEYFRAMES = `
@keyframes msh-network-dash {
  to { stroke-dashoffset: -14; }
}
`;

type NetworkTopologyProps = React.ComponentProps<"div">;

function NetworkTopology({
  className,
  children,
  ...props
}: NetworkTopologyProps) {
  return (
    <div
      data-slot="network-topology"
      dir="ltr"
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: TOPOLOGY_KEYFRAMES }} />
      {children}
    </div>
  );
}

type NetworkTopologyEdgesProps = React.ComponentProps<"svg">;

function NetworkTopologyEdges({
  className,
  ...props
}: NetworkTopologyEdgesProps) {
  return (
    <svg
      data-slot="network-topology-edges"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("absolute inset-0 size-full", className)}
      {...props}
    />
  );
}

type NetworkEdgeProps = Omit<
  React.ComponentProps<"line">,
  "x1" | "y1" | "x2" | "y2" | "from" | "to"
> & {
  from: Point;
  to: Point;
  status?: EdgeStatus;
  animated?: boolean;
};

function NetworkEdge({
  from,
  to,
  status = "idle",
  animated,
  className,
  style,
  ...props
}: NetworkEdgeProps) {
  const isAnimated = animated && status !== "down";
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
      strokeDasharray={isAnimated ? "4 3" : undefined}
      style={
        isAnimated
          ? {
              animationName: "msh-network-dash",
              animationDuration: "1s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              ...style,
            }
          : style
      }
      className={cn(
        edgeStroke[status],
        isAnimated && "motion-reduce:[animation-play-state:paused]",
        className,
      )}
      {...props}
    />
  );
}

type NetworkNodeProps = React.ComponentProps<"div"> & {
  x: number;
  y: number;
  status?: NodeStatus;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
  variant?: "node" | "hub";
};

function NetworkNode({
  x,
  y,
  status = "online",
  icon,
  label,
  sublabel,
  variant = "node",
  className,
  style,
  ...props
}: NetworkNodeProps) {
  return (
    <div
      data-slot="network-node"
      data-status={status}
      className={cn(
        "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border px-2.5 py-1.5 shadow-sm",
        variant === "hub"
          ? "border-primary/40 bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground",
        className,
      )}
      style={{ left: `${x}%`, top: `${y}%`, ...style }}
      {...props}
    >
      {icon ? (
        <span className="flex size-4 items-center justify-center [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      {label || sublabel ? (
        <span className="flex min-w-0 flex-col leading-tight">
          {label ? (
            <span className="truncate text-xs font-medium">{label}</span>
          ) : null}
          {sublabel ? (
            <span
              className={cn(
                "truncate font-mono text-[10px]",
                variant === "hub"
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground",
              )}
            >
              {sublabel}
            </span>
          ) : null}
        </span>
      ) : null}
      <span
        className={cn(
          "size-2 shrink-0 rounded-full ring-2 ring-card",
          nodeDot[status],
          variant === "hub" && "ring-primary",
        )}
        aria-hidden
      />
      <span className="sr-only">{status}</span>
    </div>
  );
}

export { NetworkTopology, NetworkTopologyEdges, NetworkEdge, NetworkNode };
