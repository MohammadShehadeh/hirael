"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type UsageDashboardProps = React.ComponentProps<"div">;

const UsageDashboard = ({ className, ...props }: UsageDashboardProps) => {
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
};

type UsageDashboardHeaderProps = React.ComponentProps<"div">;

const UsageDashboardHeader = ({
  className,
  ...props
}: UsageDashboardHeaderProps) => {
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
};

type UsageDashboardTitleProps = React.ComponentProps<"h3">;

const UsageDashboardTitle = ({
  className,
  ...props
}: UsageDashboardTitleProps) => {
  return (
    <h3
      data-slot="usage-dashboard-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
};

type UsageListProps = React.ComponentProps<"div">;

const UsageList = ({ className, ...props }: UsageListProps) => {
  return (
    <div
      data-slot="usage-list"
      className={cn("flex flex-col gap-4 p-4", className)}
      {...props}
    />
  );
};

interface UsageItemProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
  value: number;
  max: number;
  /** Short value caption, e.g. "8.2k / 10k". */
  caption?: React.ReactNode;
  unit?: React.ReactNode;}

const UsageItem = ({
  label,
  value,
  max,
  caption,
  unit,
  className,
  ...props
}: UsageItemProps) => {
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
          {unit != null ? <> {unit}</> : null}
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
};

export {
  UsageDashboard,
  UsageDashboardHeader,
  UsageDashboardTitle,
  UsageList,
  UsageItem,
};

const UsageDashboardBlock = () => {
  return (
    <section
      data-slot="usage-dashboard-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <UsageDashboard className="w-full max-w-md">
        <UsageDashboardHeader>
          <UsageDashboardTitle>Usage this month</UsageDashboardTitle>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Resets Jul 1
          </span>
        </UsageDashboardHeader>
        <UsageList>
          <UsageItem
            label="API requests"
            value={82000}
            max={100000}
            caption="82k / 100k"
          />
          <UsageItem label="Storage" value={46} max={50} caption="46 / 50 GB" />
          <UsageItem label="Seats" value={18} max={25} caption="18 / 25" />
          <UsageItem
            label="Email sends"
            value={5200}
            max={5000}
            caption="5.2k / 5k"
          />
        </UsageList>
      </UsageDashboard>
    </section>
  );
};

export default UsageDashboardBlock;
