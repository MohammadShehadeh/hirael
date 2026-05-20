"use client"

import * as React from "react"
import { Minus, TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

/* ============================================================================
 * Types
 * ========================================================================== */

export type StatCardTrend = "up" | "down" | "flat"

export type StatCardDeltaInput = {
  value: React.ReactNode
  trend: StatCardTrend
}

/* ============================================================================
 * Root
 * ========================================================================== */

type StatCardRootProps = React.ComponentProps<"div">

function StatCardRoot({ className, ...props }: StatCardRootProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "flex flex-col gap-2 rounded-md border border-border bg-card p-5 text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

/* ============================================================================
 * Label
 * ========================================================================== */

type StatCardLabelProps = React.ComponentProps<"p">

function StatCardLabel({ className, ...props }: StatCardLabelProps) {
  return (
    <p
      data-slot="stat-card-label"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/* ============================================================================
 * Value
 * ========================================================================== */

type StatCardValueProps = React.ComponentProps<"p">

function StatCardValue({ className, ...props }: StatCardValueProps) {
  return (
    <p
      data-slot="stat-card-value"
      className={cn(
        "text-3xl font-semibold tracking-[-0.035em] text-foreground",
        className
      )}
      {...props}
    />
  )
}

/* ============================================================================
 * Delta
 * ========================================================================== */

type StatCardDeltaProps = Omit<React.ComponentProps<"span">, "children"> & {
  trend: StatCardTrend
  children?: React.ReactNode
}

function StatCardDelta({
  trend,
  className,
  children,
  ...props
}: StatCardDeltaProps) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const tone =
    trend === "flat" ? "text-muted-foreground" : "text-foreground"
  return (
    <span
      data-slot="stat-card-delta"
      data-trend={trend}
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[11px] leading-none",
        tone,
        className
      )}
      {...props}
    >
      <Icon className="size-3" aria-hidden />
      {children}
    </span>
  )
}

/* ============================================================================
 * Single-prop convenience wrapper
 * ========================================================================== */

export type StatCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode
  value: React.ReactNode
  delta?: StatCardDeltaInput
  hint?: React.ReactNode
}

function StatCard({
  label,
  value,
  delta,
  hint,
  className,
  ...props
}: StatCardProps) {
  return (
    <StatCardRoot className={className} {...props}>
      <StatCardLabel>{label}</StatCardLabel>
      <StatCardValue>{value}</StatCardValue>
      <div className="flex items-center gap-2">
        {delta && <StatCardDelta trend={delta.trend}>{delta.value}</StatCardDelta>}
        {hint && (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        )}
      </div>
    </StatCardRoot>
  )
}

/* ============================================================================
 * Exports
 * ========================================================================== */

StatCard.Root = StatCardRoot
StatCard.Label = StatCardLabel
StatCard.Value = StatCardValue
StatCard.Delta = StatCardDelta

export {
  StatCard,
  StatCardRoot,
  StatCardLabel,
  StatCardValue,
  StatCardDelta,
}
