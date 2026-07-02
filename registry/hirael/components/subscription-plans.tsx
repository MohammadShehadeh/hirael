"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";

type SubscriptionPlansProps = React.ComponentProps<"div">;

function SubscriptionPlans({ className, ...props }: SubscriptionPlansProps) {
  return (
    <div
      data-slot="subscription-plans"
      className={cn("grid gap-3 sm:grid-cols-3", className)}
      {...props}
    />
  );
}

type SubscriptionPlanProps = React.ComponentProps<"div"> & {
  featured?: boolean;
  current?: boolean;
};

function SubscriptionPlan({
  featured,
  current,
  className,
  ...props
}: SubscriptionPlanProps) {
  return (
    <div
      data-slot="subscription-plan"
      data-featured={featured ? "" : undefined}
      data-current={current ? "" : undefined}
      className={cn(
        "relative flex flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground",
        featured && "border-foreground/30 ring-1 ring-foreground/20",
        className,
      )}
      {...props}
    />
  );
}

type SubscriptionPlanBadgeProps = React.ComponentProps<"span">;

function SubscriptionPlanBadge({
  className,
  ...props
}: SubscriptionPlanBadgeProps) {
  return (
    <Badge
      variant="outline"
      data-slot="subscription-plan-badge"
      className={cn(
        "absolute -top-2.5 end-4 bg-background font-mono text-[10px] font-normal uppercase tracking-[0.1em]",
        className,
      )}
      {...props}
    />
  );
}

type SubscriptionPlanNameProps = React.ComponentProps<"h3">;

function SubscriptionPlanName({
  className,
  ...props
}: SubscriptionPlanNameProps) {
  return (
    <h3
      data-slot="subscription-plan-name"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

type SubscriptionPlanPriceProps = React.ComponentProps<"p"> & {
  cycle?: React.ReactNode;
};

function SubscriptionPlanPrice({
  cycle,
  className,
  children,
  ...props
}: SubscriptionPlanPriceProps) {
  return (
    <p
      data-slot="subscription-plan-price"
      className={cn("flex items-baseline gap-1", className)}
      {...props}
    >
      <span className="text-3xl font-semibold tracking-tight text-foreground">
        {children}
      </span>
      {cycle ? (
        <span className="text-sm text-muted-foreground">/ {cycle}</span>
      ) : null}
    </p>
  );
}

type SubscriptionPlanDescriptionProps = React.ComponentProps<"p">;

function SubscriptionPlanDescription({
  className,
  ...props
}: SubscriptionPlanDescriptionProps) {
  return (
    <p
      data-slot="subscription-plan-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

type SubscriptionPlanFeaturesProps = React.ComponentProps<"ul">;

function SubscriptionPlanFeatures({
  className,
  ...props
}: SubscriptionPlanFeaturesProps) {
  return (
    <ul
      data-slot="subscription-plan-features"
      className={cn("flex flex-1 flex-col gap-2 text-sm", className)}
      {...props}
    />
  );
}

type SubscriptionPlanFeatureProps = React.ComponentProps<"li">;

function SubscriptionPlanFeature({
  className,
  children,
  ...props
}: SubscriptionPlanFeatureProps) {
  return (
    <li
      data-slot="subscription-plan-feature"
      className={cn("flex items-center gap-2 text-muted-foreground", className)}
      {...props}
    >
      <Check className="size-4 shrink-0 text-foreground" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

type SubscriptionPlanActionProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "outline";
};

function SubscriptionPlanAction({
  variant = "outline",
  className,
  ...props
}: SubscriptionPlanActionProps) {
  return (
    <Button
      type="button"
      variant={variant === "primary" ? "default" : "outline"}
      data-slot="subscription-plan-action"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

export {
  SubscriptionPlans,
  SubscriptionPlan,
  SubscriptionPlanBadge,
  SubscriptionPlanName,
  SubscriptionPlanPrice,
  SubscriptionPlanDescription,
  SubscriptionPlanFeatures,
  SubscriptionPlanFeature,
  SubscriptionPlanAction,
};
