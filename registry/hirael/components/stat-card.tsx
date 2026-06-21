"use client";

import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatCardTrend = "up" | "down" | "flat";

type StatCardProps = React.ComponentProps<"div">;

function StatCard({ className, ...props }: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "flex flex-col gap-2 rounded-md border border-border bg-card p-5 text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

type StatCardLabelProps = React.ComponentProps<"p">;

function StatCardLabel({ className, ...props }: StatCardLabelProps) {
  return (
    <p
      data-slot="stat-card-label"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type StatCardValueProps = React.ComponentProps<"p">;

function StatCardValue({ className, ...props }: StatCardValueProps) {
  return (
    <p
      data-slot="stat-card-value"
      className={cn(
        "text-3xl font-semibold tracking-[-0.035em] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type StatCardDeltaProps = Omit<React.ComponentProps<"span">, "children"> & {
  trend: StatCardTrend;
  children?: React.ReactNode;
};

function StatCardDelta({
  trend,
  className,
  children,
  ...props
}: StatCardDeltaProps) {
  const Icon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const tone = trend === "flat" ? "text-muted-foreground" : "text-foreground";
  return (
    <span
      data-slot="stat-card-delta"
      data-trend={trend}
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[11px] leading-none",
        tone,
        className,
      )}
      {...props}
    >
      <Icon className="size-3" aria-hidden />
      {children}
    </span>
  );
}

export { StatCard, StatCardLabel, StatCardValue, StatCardDelta };
