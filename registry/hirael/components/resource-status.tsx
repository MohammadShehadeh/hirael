"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type ResourceState =
  | "operational"
  | "degraded"
  | "partial-outage"
  | "major-outage"
  | "maintenance";

const stateDot: Record<ResourceState, string> = {
  operational: "bg-success",
  degraded: "bg-warning",
  "partial-outage": "bg-warning",
  "major-outage": "bg-destructive",
  maintenance: "bg-info",
};

const stateText: Record<ResourceState, string> = {
  operational: "text-success",
  degraded: "text-warning",
  "partial-outage": "text-warning",
  "major-outage": "text-destructive",
  maintenance: "text-info",
};

const stateLabel: Record<ResourceState, string> = {
  operational: "Operational",
  degraded: "Degraded",
  "partial-outage": "Partial outage",
  "major-outage": "Major outage",
  maintenance: "Maintenance",
};

type ResourceStatusProps = React.ComponentProps<"div">;

function ResourceStatus({ className, ...props }: ResourceStatusProps) {
  return (
    <div
      data-slot="resource-status"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

type ResourceStatusBannerProps = React.ComponentProps<"div"> & {
  state: ResourceState;
};

function ResourceStatusBanner({
  state,
  className,
  children,
  ...props
}: ResourceStatusBannerProps) {
  return (
    <div
      data-slot="resource-status-banner"
      data-state={state}
      className={cn(
        "flex items-center gap-3 border-b border-border px-4 py-3",
        className,
      )}
      {...props}
    >
      <ResourceStatusDot state={state} />
      <span className={cn("text-sm font-medium", stateText[state])}>
        {children ?? stateLabel[state]}
      </span>
    </div>
  );
}

type ResourceStatusListProps = React.ComponentProps<"ul">;

function ResourceStatusList({ className, ...props }: ResourceStatusListProps) {
  return (
    <ul
      data-slot="resource-status-list"
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  );
}

type ResourceStatusItemProps = React.ComponentProps<"li"> & {
  name: React.ReactNode;
  state: ResourceState;
  description?: React.ReactNode;
  uptime?: React.ReactNode;
};

function ResourceStatusItem({
  name,
  state,
  description,
  uptime,
  className,
  children,
  ...props
}: ResourceStatusItemProps) {
  return (
    <li
      data-slot="resource-status-item"
      data-state={state}
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground">
          {name}
        </span>
        {description ? (
          <span className="truncate text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {uptime ? (
          <span className="font-mono text-xs text-muted-foreground">
            {uptime}
          </span>
        ) : null}
        {children ?? <ResourceStatusIndicator state={state} />}
      </div>
    </li>
  );
}

type ResourceStatusDotProps = React.ComponentProps<"span"> & {
  state: ResourceState;
  /** Pulse the dot to signal a live/active condition. */
  pulse?: boolean;
};

function ResourceStatusDot({
  state,
  pulse,
  className,
  ...props
}: ResourceStatusDotProps) {
  return (
    <span
      data-slot="resource-status-dot"
      className={cn("relative flex size-2.5 shrink-0", className)}
      {...props}
    >
      {pulse ? (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            stateDot[state],
          )}
          aria-hidden
        />
      ) : null}
      <span
        className={cn(
          "relative inline-flex size-2.5 rounded-full",
          stateDot[state],
        )}
        aria-hidden
      />
    </span>
  );
}

type ResourceStatusIndicatorProps = Omit<
  React.ComponentProps<"span">,
  "children"
> & {
  state: ResourceState;
  children?: React.ReactNode;
};

function ResourceStatusIndicator({
  state,
  className,
  children,
  ...props
}: ResourceStatusIndicatorProps) {
  return (
    <span
      data-slot="resource-status-indicator"
      data-state={state}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        stateText[state],
        className,
      )}
      {...props}
    >
      <ResourceStatusDot state={state} />
      {children ?? stateLabel[state]}
    </span>
  );
}

export {
  ResourceStatus,
  ResourceStatusBanner,
  ResourceStatusList,
  ResourceStatusItem,
  ResourceStatusDot,
  ResourceStatusIndicator,
};
