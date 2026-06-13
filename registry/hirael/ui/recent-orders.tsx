"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type RecentOrdersProps = React.ComponentProps<"div">

function RecentOrders({ className, ...props }: RecentOrdersProps) {
  return (
    <div
      data-slot="recent-orders"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

type RecentOrdersHeaderProps = React.ComponentProps<"div">

function RecentOrdersHeader({ className, ...props }: RecentOrdersHeaderProps) {
  return (
    <div
      data-slot="recent-orders-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

type RecentOrdersTitleProps = React.ComponentProps<"h3">

function RecentOrdersTitle({ className, ...props }: RecentOrdersTitleProps) {
  return (
    <h3
      data-slot="recent-orders-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

type RecentOrdersListProps = React.ComponentProps<"ul">

function RecentOrdersList({ className, ...props }: RecentOrdersListProps) {
  return (
    <ul
      data-slot="recent-orders-list"
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  )
}

type RecentOrdersItemProps = React.ComponentProps<"li">

function RecentOrdersItem({ className, ...props }: RecentOrdersItemProps) {
  return (
    <li
      data-slot="recent-orders-item"
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent/60",
        className
      )}
      {...props}
    />
  )
}

type RecentOrderIdProps = React.ComponentProps<"span">

function RecentOrderId({ className, ...props }: RecentOrderIdProps) {
  return (
    <span
      data-slot="recent-order-id"
      className={cn(
        "shrink-0 font-mono text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type RecentOrderCustomerProps = React.ComponentProps<"span">

function RecentOrderCustomer({
  className,
  ...props
}: RecentOrderCustomerProps) {
  return (
    <span
      data-slot="recent-order-customer"
      className={cn("min-w-0 flex-1 truncate text-sm text-foreground", className)}
      {...props}
    />
  )
}

type RecentOrderAmountProps = React.ComponentProps<"span">

function RecentOrderAmount({ className, ...props }: RecentOrderAmountProps) {
  return (
    <span
      data-slot="recent-order-amount"
      className={cn(
        "shrink-0 font-mono text-sm tabular-nums text-foreground",
        className
      )}
      {...props}
    />
  )
}

type OrderTone = "default" | "success" | "warning" | "danger"

const orderToneClasses: Record<OrderTone, string> = {
  default: "border-border text-muted-foreground",
  success: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  warning: "border-amber-500/30 text-amber-600 dark:text-amber-400",
  danger: "border-red-500/30 text-red-600 dark:text-red-400",
}

type RecentOrderStatusProps = React.ComponentProps<"span"> & {
  tone?: OrderTone
}

function RecentOrderStatus({
  tone = "default",
  className,
  ...props
}: RecentOrderStatusProps) {
  return (
    <span
      data-slot="recent-order-status"
      data-tone={tone}
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em]",
        orderToneClasses[tone],
        className
      )}
      {...props}
    />
  )
}

export {
  RecentOrders,
  RecentOrdersHeader,
  RecentOrdersTitle,
  RecentOrdersList,
  RecentOrdersItem,
  RecentOrderId,
  RecentOrderCustomer,
  RecentOrderAmount,
  RecentOrderStatus,
}
