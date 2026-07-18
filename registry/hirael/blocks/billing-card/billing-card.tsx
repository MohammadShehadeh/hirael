"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type BillingCardProps = React.ComponentProps<"div">;

function BillingCard({ className, ...props }: BillingCardProps) {
  return (
    <div
      data-slot="billing-card"
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

type BillingCardHeaderProps = React.ComponentProps<"div">;

function BillingCardHeader({ className, ...props }: BillingCardHeaderProps) {
  return (
    <div
      data-slot="billing-card-header"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  );
}

type BillingCardEyebrowProps = React.ComponentProps<"p">;

function BillingCardEyebrow({ className, ...props }: BillingCardEyebrowProps) {
  return (
    <p
      data-slot="billing-card-eyebrow"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type BillingCardPlanProps = React.ComponentProps<"p">;

function BillingCardPlan({ className, ...props }: BillingCardPlanProps) {
  return (
    <p
      data-slot="billing-card-plan"
      className={cn(
        "text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type BillingCardPriceProps = React.ComponentProps<"p"> & {
  cycle?: React.ReactNode;
};

function BillingCardPrice({
  cycle,
  className,
  children,
  ...props
}: BillingCardPriceProps) {
  return (
    <p
      data-slot="billing-card-price"
      className={cn("text-end text-sm text-foreground", className)}
      {...props}
    >
      <span className="text-lg font-semibold tracking-tight">{children}</span>
      {cycle ? <span className="text-muted-foreground"> / {cycle}</span> : null}
    </p>
  );
}

type BillingCardMeterProps = React.ComponentProps<"div"> & {
  value: number;
  max: number;
  label?: React.ReactNode;
};

function BillingCardMeter({
  value,
  max,
  label,
  className,
  ...props
}: BillingCardMeterProps) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return (
    <div
      data-slot="billing-card-meter"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      {label ? (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono tabular-nums text-foreground">
            {value} / {max}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

type BillingCardRowProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
};

function BillingCardRow({
  label,
  className,
  children,
  ...props
}: BillingCardRowProps) {
  return (
    <div
      data-slot="billing-card-row"
      className={cn(
        "flex items-center justify-between gap-3 text-sm",
        className,
      )}
      {...props}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}

type BillingCardFooterProps = React.ComponentProps<"div">;

function BillingCardFooter({ className, ...props }: BillingCardFooterProps) {
  return (
    <div
      data-slot="billing-card-footer"
      className={cn(
        "flex items-center gap-2 border-t border-border pt-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  BillingCard,
  BillingCardHeader,
  BillingCardEyebrow,
  BillingCardPlan,
  BillingCardPrice,
  BillingCardMeter,
  BillingCardRow,
  BillingCardFooter,
};

export default function BillingCardBlock() {
  return (
    <section
      data-slot="billing-card-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <BillingCard className="w-full max-w-sm">
        <BillingCardHeader>
          <div className="flex flex-col gap-1">
            <BillingCardEyebrow>Current plan</BillingCardEyebrow>
            <BillingCardPlan>Scale</BillingCardPlan>
          </div>
          <BillingCardPrice cycle="mo">$99</BillingCardPrice>
        </BillingCardHeader>

        <BillingCardMeter value={18} max={25} label="Seats used" />

        <div className="flex flex-col gap-2">
          <BillingCardRow label="Renews on">Jul 1, 2026</BillingCardRow>
          <BillingCardRow label="Payment">Visa ending 4242</BillingCardRow>
        </div>

        <BillingCardFooter>
          <button
            type="button"
            className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Manage billing
          </button>
          <button
            type="button"
            className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Upgrade
          </button>
        </BillingCardFooter>
      </BillingCard>
    </section>
  );
}
