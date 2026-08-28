'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';

type SubscriptionPlansProps = React.ComponentProps<'div'>;

const SubscriptionPlans = ({ className, ...props }: SubscriptionPlansProps) => {
  return <div data-slot="subscription-plans" className={cn('grid gap-3 sm:grid-cols-3', className)} {...props} />;
};

interface SubscriptionPlanProps extends React.ComponentProps<'div'> {
  featured?: boolean;
  current?: boolean;
}

const SubscriptionPlan = ({ featured, current, className, ...props }: SubscriptionPlanProps) => {
  return (
    <div
      data-slot="subscription-plan"
      data-featured={featured ? '' : undefined}
      data-current={current ? '' : undefined}
      className={cn(
        'relative flex flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground',
        featured && 'border-foreground/30 ring-1 ring-foreground/20',
        className,
      )}
      {...props}
    />
  );
};

type SubscriptionPlanBadgeProps = React.ComponentProps<'span'>;

const SubscriptionPlanBadge = ({ className, ...props }: SubscriptionPlanBadgeProps) => {
  return (
    <Badge
      variant="outline"
      data-slot="subscription-plan-badge"
      className={cn(
        'absolute -top-2.5 end-4 bg-background font-mono text-[10px] font-normal uppercase tracking-[0.1em]',
        className,
      )}
      {...props}
    />
  );
};

type SubscriptionPlanNameProps = React.ComponentProps<'h3'>;

const SubscriptionPlanName = ({ className, ...props }: SubscriptionPlanNameProps) => {
  return (
    <h3
      data-slot="subscription-plan-name"
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
};

interface SubscriptionPlanPriceProps extends React.ComponentProps<'p'> {
  cycle?: React.ReactNode;
}

const SubscriptionPlanPrice = ({ cycle, className, children, ...props }: SubscriptionPlanPriceProps) => {
  return (
    <p data-slot="subscription-plan-price" className={cn('flex items-baseline gap-1', className)} {...props}>
      <span className="text-3xl font-semibold tracking-tight text-foreground">{children}</span>
      {cycle ? <span className="text-sm text-muted-foreground">/ {cycle}</span> : null}
    </p>
  );
};

type SubscriptionPlanDescriptionProps = React.ComponentProps<'p'>;

const SubscriptionPlanDescription = ({ className, ...props }: SubscriptionPlanDescriptionProps) => {
  return (
    <p
      data-slot="subscription-plan-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};

type SubscriptionPlanFeaturesProps = React.ComponentProps<'ul'>;

const SubscriptionPlanFeatures = ({ className, ...props }: SubscriptionPlanFeaturesProps) => {
  return (
    <ul
      data-slot="subscription-plan-features"
      className={cn('flex flex-1 flex-col gap-2 text-sm', className)}
      {...props}
    />
  );
};

type SubscriptionPlanFeatureProps = React.ComponentProps<'li'>;

const SubscriptionPlanFeature = ({ className, children, ...props }: SubscriptionPlanFeatureProps) => {
  return (
    <li
      data-slot="subscription-plan-feature"
      className={cn('flex items-center gap-2 text-muted-foreground', className)}
      {...props}
    >
      <Check className="size-4 shrink-0 text-foreground" aria-hidden />
      <span>{children}</span>
    </li>
  );
};

interface SubscriptionPlanActionProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'outline';
}

const SubscriptionPlanAction = ({ variant = 'outline', className, ...props }: SubscriptionPlanActionProps) => {
  return (
    <Button
      type="button"
      variant={variant === 'primary' ? 'default' : 'outline'}
      data-slot="subscription-plan-action"
      className={cn('w-full', className)}
      {...props}
    />
  );
};

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

const SubscriptionPlansBlock = () => {
  return (
    <section data-slot="subscription-plans-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <SubscriptionPlans className="w-full max-w-3xl">
        <SubscriptionPlan>
          <SubscriptionPlanName>Starter</SubscriptionPlanName>
          <SubscriptionPlanPrice cycle="mo">$0</SubscriptionPlanPrice>
          <SubscriptionPlanDescription>For side projects and trials.</SubscriptionPlanDescription>
          <SubscriptionPlanFeatures>
            <SubscriptionPlanFeature>1 project</SubscriptionPlanFeature>
            <SubscriptionPlanFeature>Community support</SubscriptionPlanFeature>
            <SubscriptionPlanFeature>1k requests / day</SubscriptionPlanFeature>
          </SubscriptionPlanFeatures>
          <SubscriptionPlanAction>Choose Starter</SubscriptionPlanAction>
        </SubscriptionPlan>

        <SubscriptionPlan featured>
          <SubscriptionPlanBadge>Popular</SubscriptionPlanBadge>
          <SubscriptionPlanName>Pro</SubscriptionPlanName>
          <SubscriptionPlanPrice cycle="mo">$29</SubscriptionPlanPrice>
          <SubscriptionPlanDescription>For growing teams shipping fast.</SubscriptionPlanDescription>
          <SubscriptionPlanFeatures>
            <SubscriptionPlanFeature>Unlimited projects</SubscriptionPlanFeature>
            <SubscriptionPlanFeature>Priority support</SubscriptionPlanFeature>
            <SubscriptionPlanFeature>100k requests / day</SubscriptionPlanFeature>
            <SubscriptionPlanFeature>Audit log</SubscriptionPlanFeature>
          </SubscriptionPlanFeatures>
          <SubscriptionPlanAction variant="primary">Upgrade to Pro</SubscriptionPlanAction>
        </SubscriptionPlan>

        <SubscriptionPlan current>
          <SubscriptionPlanBadge>Current</SubscriptionPlanBadge>
          <SubscriptionPlanName>Scale</SubscriptionPlanName>
          <SubscriptionPlanPrice cycle="mo">$99</SubscriptionPlanPrice>
          <SubscriptionPlanDescription>For high-volume production.</SubscriptionPlanDescription>
          <SubscriptionPlanFeatures>
            <SubscriptionPlanFeature>Everything in Pro</SubscriptionPlanFeature>
            <SubscriptionPlanFeature>SSO &amp; SAML</SubscriptionPlanFeature>
            <SubscriptionPlanFeature>Unlimited requests</SubscriptionPlanFeature>
          </SubscriptionPlanFeatures>
          <SubscriptionPlanAction
            disabled
            className="disabled:border-border disabled:bg-muted/40 disabled:text-muted-foreground disabled:opacity-100"
          >
            Current plan
          </SubscriptionPlanAction>
        </SubscriptionPlan>
      </SubscriptionPlans>
    </section>
  );
};

export default SubscriptionPlansBlock;
