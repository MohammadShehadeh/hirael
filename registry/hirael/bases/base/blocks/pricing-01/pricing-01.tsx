'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/registry/hirael/bases/base/ui/card';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';
import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type Billing = 'monthly' | 'yearly';

/** Yearly billing charges 10 months and covers 12. */
const PAID_MONTHS_PER_YEAR = 10;

interface Tier {
  name: string;
  /** Monthly price in whole dollars when billed monthly. */
  monthly: number;
  blurb: string;
  features: readonly string[];
  cta: string;
  featured?: boolean;
  ctaVariant: 'default' | 'outline';
}

const TIERS: readonly Tier[] = [
  {
    name: 'Solo',
    monthly: 0,
    blurb: 'For freelancers sending a handful of invoices a month.',
    features: ['5 active clients', 'Invoices and quotes', 'Card and bank payments', 'Email reminders'],
    cta: 'Start free',
    ctaVariant: 'outline',
  },
  {
    name: 'Studio',
    monthly: 24,
    blurb: 'For small studios billing retainers and project work.',
    features: ['Unlimited clients', 'Recurring invoices', 'Client portal with your logo', 'Time tracking'],
    cta: 'Try Studio free for 14 days',
    featured: true,
    ctaVariant: 'default',
  },
  {
    name: 'Agency',
    monthly: 64,
    blurb: 'For agencies with several teams and a finance lead.',
    features: ['Everything in Studio', 'Up to 25 team members', 'Approval before sending', 'Accounting sync'],
    cta: 'Talk to us',
    ctaVariant: 'outline',
  },
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const priceFor = (tier: Tier, billing: Billing) =>
  billing === 'yearly' ? Math.round((tier.monthly * PAID_MONTHS_PER_YEAR) / 12) : tier.monthly;

const Pricing01 = () => {
  const [billing, setBilling] = React.useState<Billing>('monthly');

  return (
    <section data-slot="pricing" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div data-slot="pricing-header" className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Pricing</span>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
          >
            Send invoices free. Pay when you <span className="italic text-foreground">grow</span>.
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'text-base text-muted-foreground sm:text-lg')}>
            Every plan takes card and bank payments with no extra fee from us. Upgrade when you need more clients or
            more people.
          </p>
          <div style={stagger(3)} className={cn(ENTER, 'mt-2 flex flex-col items-center gap-2')}>
            <ToggleGroup
              data-slot="pricing-billing"
              type="single"
              variant="outline"
              value={billing}
              onValueChange={(next) => next && setBilling(next as Billing)}
              aria-label="Billing period"
            >
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
            </ToggleGroup>
            <span className="text-xs text-muted-foreground">Yearly plans get 2 months free</span>
          </div>
        </div>

        <div data-slot="pricing-tiers" className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TIERS.map((tier, index) => {
            const price = priceFor(tier, billing);

            return (
              <Card
                key={tier.name}
                data-slot="pricing-tier"
                data-featured={tier.featured ? '' : undefined}
                style={{
                  ...stagger(index, 60, 240),
                  ...(tier.featured
                    ? {
                        backgroundImage:
                          'radial-gradient(120% 90% at 50% 0%, color-mix(in oklch, var(--primary) 9%, transparent), transparent 60%)',
                      }
                    : undefined),
                }}
                className={cn(
                  ENTER,
                  'relative gap-6 p-6 transition-[translate,border-color] duration-200 hover:-translate-y-1',
                  tier.featured ? 'ring-1 ring-foreground/25' : 'hover:border-foreground/20',
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-2.5 end-6 inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs uppercase text-foreground">
                    Most popular
                  </span>
                )}

                <CardHeader className="flex flex-col gap-2 px-0">
                  <h3 className="text-xs font-normal uppercase text-muted-foreground">{tier.name}</h3>
                  <div key={billing} data-slot="pricing-price" className={cn(SWAP, 'flex flex-col gap-1')}>
                    <div className="flex items-baseline gap-1">
                      <span dir="ltr" className="text-4xl font-semibold tabular-nums tracking-[-0.04em]">
                        {money.format(price)}
                      </span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {tier.monthly === 0 ? (
                        'Free for as long as you like'
                      ) : billing === 'yearly' ? (
                        <>
                          <span dir="ltr" className="tabular-nums">
                            {money.format(tier.monthly * PAID_MONTHS_PER_YEAR)}
                          </span>{' '}
                          billed once a year
                        </>
                      ) : (
                        'Billed monthly, cancel any time'
                      )}
                    </span>
                  </div>
                  <p className="pt-1 text-sm text-muted-foreground">{tier.blurb}</p>
                </CardHeader>

                <Separator className="border-dashed" />

                <CardContent className="px-0">
                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-foreground" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto px-0 pt-2">
                  <Button
                    variant={tier.ctaVariant}
                    size="lg"
                    className="w-full rounded-full"
                    render={<a href="#" />}
                    nativeButton={false}
                  >
                    {tier.cta}
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

export default Pricing01;
