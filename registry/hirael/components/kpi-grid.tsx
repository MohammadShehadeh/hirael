"use client";

import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

type KpiGridProps = React.ComponentProps<"div">;

function KpiGrid({ className, ...props }: KpiGridProps) {
  return (
    <div
      data-slot="kpi-grid"
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}

type KpiCardProps = React.ComponentProps<"div">;

function KpiCard({ className, ...props }: KpiCardProps) {
  return (
    <div
      data-slot="kpi-card"
      className={cn("flex flex-col gap-2 bg-card p-4", className)}
      {...props}
    />
  );
}

type KpiCardLabelProps = React.ComponentProps<"p">;

function KpiCardLabel({ className, ...props }: KpiCardLabelProps) {
  return (
    <p
      data-slot="kpi-card-label"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type KpiCardValueProps = React.ComponentProps<"p">;

function KpiCardValue({ className, ...props }: KpiCardValueProps) {
  return (
    <p
      data-slot="kpi-card-value"
      className={cn(
        "text-2xl font-semibold tracking-[-0.03em] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type KpiTrend = "up" | "down" | "flat";

const trendIcon: Record<KpiTrend, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const trendTone: Record<KpiTrend, string> = {
  up: "text-success",
  down: "text-destructive",
  flat: "text-muted-foreground",
};

type KpiCardDeltaProps = Omit<React.ComponentProps<"span">, "children"> & {
  trend?: KpiTrend;
  children?: React.ReactNode;
};

function KpiCardDelta({
  trend = "flat",
  className,
  children,
  ...props
}: KpiCardDeltaProps) {
  const Icon = trendIcon[trend];
  return (
    <span
      data-slot="kpi-card-delta"
      data-trend={trend}
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs",
        trendTone[trend],
        className,
      )}
      {...props}
    >
      <Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}

type KpiCardSparkProps = Omit<React.ComponentProps<"svg">, "points"> & {
  points: number[];
};

function KpiCardSpark({ points, className, ...props }: KpiCardSparkProps) {
  if (!points.length) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 100;
  const height = 28;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const line = points
    .map(
      (point, i) => `${i * step},${height - ((point - min) / range) * height}`,
    )
    .join(" ");
  return (
    <svg
      data-slot="kpi-card-spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-7 w-full text-muted-foreground", className)}
      {...props}
    >
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export {
  KpiGrid,
  KpiCard,
  KpiCardLabel,
  KpiCardValue,
  KpiCardDelta,
  KpiCardSpark,
};
