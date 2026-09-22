'use client';

import * as React from 'react';
import { ArrowRight, Check, Shield, Star, Zap } from 'lucide-react';

import { AnimatedNumber } from '@/registry/hirael/bases/base/components/animated-number';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/hirael/bases/base/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';
import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type Frequency = 'monthly' | 'yearly';

interface Plan {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  price: Record<Frequency, number | string>;
  description: string;
  features: readonly string[];
  cta: string;
  ctaVariant: 'default' | 'outline';
  popular?: boolean;
}

const PLANS: readonly Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Star,
    price: { monthly: 'Free', yearly: 'Free' },
    description: 'Everything you need to ship your first project.',
    features: ['1,000 generations a month', 'Base model access', 'Community support', '500 MB model storage'],
    cta: 'Start free',
    ctaVariant: 'outline',
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    price: { monthly: 90, yearly: 75 },
    description: 'For teams shipping to real users.',
    features: ['Unlimited generations', 'Premium model access', 'Priority support', '10 GB model storage'],
    cta: 'Choose Pro',
    ctaVariant: 'default',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Shield,
    price: { monthly: 'Custom', yearly: 'Custom' },
    description: 'For companies that need their own models and a signed contract.',
    features: ['Custom models', 'Dedicated account manager', 'On-premise deployment', 'Unlimited secure storage'],
    cta: 'Contact sales',
    ctaVariant: 'outline',
  },
];

const PRICE_FORMAT: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 };
const money = new Intl.NumberFormat('en-US', PRICE_FORMAT);

/** The largest yearly saving across paid plans, read from the prices so the badge can't drift from them. */
const yearlySaving = Math.max(
  0,
  ...PLANS.map(({ price }) =>
    typeof price.monthly === 'number' && typeof price.yearly === 'number'
      ? Math.round((1 - price.yearly / price.monthly) * 100)
      : 0,
  ),
);

const Pricing03 = () => {
  const [frequency, setFrequency] = React.useState<Frequency>('monthly');

  return (
    <section data-slot="pricing" className="relative overflow-hidden bg-background py-20 text-foreground sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 start-1/2 h-72 w-3/5 -translate-x-1/2 rounded-full bg-foreground/[0.06] blur-3xl rtl:translate-x-1/2" />
        <div className="absolute -bottom-24 end-[-8%] h-72 w-2/5 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative flex flex-col items-center gap-8">
        <div data-slot="pricing-header" className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Pricing</span>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
          >
            Pick the plan that fits your pace.
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
            Start free, move to Pro when you need more generations, and change plans or billing whenever you like.
          </p>
        </div>

        <ToggleGroup
          data-slot="pricing-billing"
          variant="outline"
          value={[frequency]}
          onValueChange={([next]) => next && setFrequency(next as Frequency)}
          aria-label="Billing period"
          style={stagger(3)}
          className={ENTER}
        >
          <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          <ToggleGroupItem value="yearly" className="gap-2">
            Yearly
            {yearlySaving > 0 && (
              <Badge variant="secondary" className="px-1.5">
                Save {yearlySaving}%
              </Badge>
            )}
          </ToggleGroupItem>
        </ToggleGroup>

        <div data-slot="pricing-tiers" className="mt-4 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((plan, index) => {
            const amount = plan.price[frequency];
            const Icon = plan.icon;

            return (
              <Card
                key={plan.id}
                data-slot="pricing-tier"
                data-featured={plan.popular ? '' : undefined}
                style={{
                  ...stagger(index, 60, 240),
                  ...(plan.popular
                    ? {
                        backgroundImage:
                          'radial-gradient(120% 90% at 50% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)',
                      }
                    : undefined),
                }}
                className={cn(
                  ENTER,
                  'relative h-full gap-6 p-6 text-start transition-[translate,border-color] duration-200 hover:-translate-y-1',
                  plan.popular ? 'ring-1 ring-foreground/25' : 'hover:border-foreground/20',
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 end-6 inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs uppercase text-foreground">
                    Most popular
                  </span>
                )}

                <CardHeader className="gap-3 px-0">
                  <div className="flex items-center gap-2">
                    <Icon aria-hidden className="size-4 text-muted-foreground" />
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div data-slot="pricing-price" className="flex min-h-14 flex-col justify-end gap-1 pt-1">
                    {typeof amount === 'number' ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <AnimatedNumber
                            dir="ltr"
                            className="text-4xl font-semibold tracking-[-0.04em] text-foreground"
                            format={PRICE_FORMAT}
                            duration={250}
                            value={amount}
                          />
                          <span className="text-xs text-muted-foreground">/ month</span>
                        </div>
                        <span key={frequency} className={cn(SWAP, 'text-xs text-muted-foreground')}>
                          {frequency === 'yearly' ? (
                            <>
                              <span dir="ltr" className="tabular-nums">
                                {money.format(amount * 12)}
                              </span>{' '}
                              billed once a year
                            </>
                          ) : (
                            'Billed monthly, cancel any time'
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-semibold tracking-[-0.03em] text-foreground">{amount}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-0">
                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto px-0 pt-2">
                  <Button
                    variant={plan.ctaVariant}
                    size="lg"
                    className="group w-full rounded-full"
                    render={<a href="#" />}
                    nativeButton={false}
                  >
                    {plan.cta}
                    <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing03;
