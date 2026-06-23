"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type UsageDashboardProps = React.ComponentProps<"div">;

function UsageDashboard({ className, ...props }: UsageDashboardProps) {
  return (
    <div
      data-slot="usage-dashboard"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

type UsageDashboardHeaderProps = React.ComponentProps<"div">;

function UsageDashboardHeader({
  className,
  ...props
}: UsageDashboardHeaderProps) {
  return (
    <div
      data-slot="usage-dashboard-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

type UsageDashboardTitleProps = React.ComponentProps<"h3">;

function UsageDashboardTitle({
  className,
  ...props
}: UsageDashboardTitleProps) {
  return (
    <h3
      data-slot="usage-dashboard-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

type UsageListProps = React.ComponentProps<"div">;

function UsageList({ className, ...props }: UsageListProps) {
  return (
    <div
      data-slot="usage-list"
      className={cn("flex flex-col gap-4 p-4", className)}
      {...props}
    />
  );
}

type UsageItemProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value: number;
  max: number;
  /** Short value caption, e.g. "8.2k / 10k". */
  caption?: React.ReactNode;
  unit?: React.ReactNode;
};

function UsageItem({
  label,
  value,
  max,
  caption,
  className,
  ...props
}: UsageItemProps) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  const tone =
    pct >= 100 ? "bg-destructive" : pct >= 90 ? "bg-warning" : "bg-foreground";
  return (
    <div
      data-slot="usage-item"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-foreground">{label}</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {caption ?? `${value} / ${max}`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            tone,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export {
  UsageDashboard,
  UsageDashboardHeader,
  UsageDashboardTitle,
  UsageList,
  UsageItem,
};
