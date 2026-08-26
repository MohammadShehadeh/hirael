"use client";

import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

export type MetricTone = "neutral" | "positive" | "warning" | "critical";

const toneText: Record<MetricTone, string> = {
  neutral: "text-muted-foreground",
  positive: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
};

const toneStroke: Record<MetricTone, string> = {
  neutral: "text-muted-foreground",
  positive: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
};

type MetricCardProps = React.ComponentProps<"div">;

const MetricCard = ({ className, ...props }: MetricCardProps) => {
  return (
    <div
      data-slot="metric-card"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-5 text-card-foreground",
        className,
      )}
      {...props}
    />
  );
};

interface MetricCardHeaderProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode;}

const MetricCardHeader = ({
  icon,
  className,
  children,
  ...props
}: MetricCardHeaderProps) => {
  return (
    <div
      data-slot="metric-card-header"
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    >
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {icon}
        {children}
      </span>
    </div>
  );
};

interface MetricCardValueProps extends React.ComponentProps<"div"> {
  unit?: React.ReactNode;}

const MetricCardValue = ({
  unit,
  className,
  children,
  ...props
}: MetricCardValueProps) => {
  return (
    <div
      data-slot="metric-card-value"
      className={cn(
        "flex items-baseline gap-1 text-3xl font-semibold tracking-[-0.035em] text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {unit ? (
        <span className="text-sm font-normal text-muted-foreground">
          {unit}
        </span>
      ) : null}
    </div>
  );
};

interface MetricCardTrendProps extends Omit<React.ComponentProps<"span">, "children"> {
  direction: "up" | "down" | "flat";
  tone?: MetricTone;
  children?: React.ReactNode;}

const MetricCardTrend = ({
  direction,
  tone = "neutral",
  className,
  children,
  ...props
}: MetricCardTrendProps) => {
  const Icon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
        ? TrendingDown
        : Minus;
  return (
    <span
      data-slot="metric-card-trend"
      data-direction={direction}
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs",
        toneText[tone],
        className,
      )}
      {...props}
    >
      <Icon className="size-3.5 rtl:-scale-x-100" aria-hidden />
      {children}
    </span>
  );
};

interface MetricCardSparkProps extends Omit<React.ComponentProps<"svg">, "points"> {
  points: number[];
  tone?: MetricTone;
  /** Fill the area under the line with a faint tint. */
  area?: boolean;}

const MetricCardSpark = ({
  points,
  tone = "neutral",
  area = true,
  className,
  ...props
}: MetricCardSparkProps) => {
  if (!points.length) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const coords = points.map(
    (point, i) =>
      [i * step, height - ((point - min) / range) * height] as const,
  );
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const fill = `0,${height} ${line} ${width},${height}`;
  return (
    <svg
      data-slot="metric-card-spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-8 w-full", toneStroke[tone], className)}
      {...props}
    >
      {area ? (
        <polygon points={fill} fill="currentColor" className="opacity-10" />
      ) : null}
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
};

type MetricCardFooterProps = React.ComponentProps<"p">;

const MetricCardFooter = ({ className, ...props }: MetricCardFooterProps) => {
  return (
    <p
      data-slot="metric-card-footer"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
};

export {
  MetricCard,
  MetricCardHeader,
  MetricCardValue,
  MetricCardTrend,
  MetricCardSpark,
  MetricCardFooter,
};
