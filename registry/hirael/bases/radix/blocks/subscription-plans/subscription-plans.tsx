'use client';

import * as React from 'react';
import { Check, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

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
      className={cn('absolute -top-2.5 end-4 bg-background font-normal uppercase', className)}
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

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in zoom-in-97 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0',
    description: 'For side projects and trials.',
    features: ['1 project', 'Community support', '1k requests / day'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    description: 'For growing teams shipping every week.',
    features: ['Unlimited projects', 'Priority support', '100k requests / day', 'Audit log'],
    featured: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$99',
    description: 'For high-volume production.',
    features: ['Everything in Pro', 'SSO and SAML', 'Unlimited requests'],
  },
];

const SubscriptionPlansBlock = () => {
  const [currentId, setCurrentId] = React.useState('scale');
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const currentIndex = PLANS.findIndex((plan) => plan.id === currentId);

  const choose = (id: string) => {
    setPendingId(id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCurrentId(id);
      setPendingId(null);
    }, 1000);
  };

  return (
    <section data-slot="subscription-plans-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <SubscriptionPlans className="w-full max-w-3xl">
        {PLANS.map((plan, index) => {
          const current = plan.id === currentId;
          const pending = plan.id === pendingId;
          const verb = index > currentIndex ? 'Upgrade to' : 'Switch to';
          return (
            <SubscriptionPlan
              key={plan.id}
              featured={plan.featured}
              current={current}
              style={{ animationDelay: `${index * 60}ms` }}
              className={ENTER}
            >
              {current ? (
                <SubscriptionPlanBadge key="current" className={SWAP}>
                  Current
                </SubscriptionPlanBadge>
              ) : plan.featured ? (
                <SubscriptionPlanBadge key="featured">Popular</SubscriptionPlanBadge>
              ) : null}
              <SubscriptionPlanName>{plan.name}</SubscriptionPlanName>
              <SubscriptionPlanPrice cycle="mo">{plan.price}</SubscriptionPlanPrice>
              <SubscriptionPlanDescription>{plan.description}</SubscriptionPlanDescription>
              <SubscriptionPlanFeatures>
                {plan.features.map((feature) => (
                  <SubscriptionPlanFeature key={feature}>{feature}</SubscriptionPlanFeature>
                ))}
              </SubscriptionPlanFeatures>
              {current ? (
                <SubscriptionPlanAction
                  disabled
                  className="disabled:border-border disabled:bg-muted/40 disabled:text-muted-foreground disabled:opacity-100"
                >
                  Current plan
                </SubscriptionPlanAction>
              ) : (
                <SubscriptionPlanAction
                  variant={plan.featured ? 'primary' : 'outline'}
                  disabled={pendingId !== null}
                  aria-busy={pending || undefined}
                  onClick={() => choose(plan.id)}
                >
                  {pending ? (
                    <>
                      <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" />
                      Switching
                    </>
                  ) : (
                    `${verb} ${plan.name}`
                  )}
                </SubscriptionPlanAction>
              )}
            </SubscriptionPlan>
          );
        })}
      </SubscriptionPlans>
      <p aria-live="polite" className="sr-only">
        {pendingId ? 'Changing plan' : `Current plan: ${PLANS[currentIndex].name}`}
      </p>
    </section>
  );
};

export default SubscriptionPlansBlock;
