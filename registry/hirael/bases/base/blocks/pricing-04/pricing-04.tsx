'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    tagline: 'For side projects and trying the editor.',
    cta: 'Start free',
    featured: false,
    quota: ['2 concurrent runs', '500 run minutes a month', '7 days of run history', 'Unlimited collaborators'],
  },
  {
    name: 'Team',
    price: '$12',
    tagline: 'For teams shipping every day.',
    cta: 'Start with Team',
    featured: true,
    quota: ['10 concurrent runs', '3,000 run minutes a month', '90 days of run history', 'Per-environment secrets'],
  },
  {
    name: 'Scale',
    price: '$29',
    tagline: 'For orgs with many repos and gates.',
    cta: 'Start with Scale',
    featured: false,
    quota: ['Unlimited concurrent runs', '10,000 run minutes a month', '1 year of run history', 'Audit log and SSO'],
  },
];

const Pricing04 = () => {
  return (
    <section data-slot="pricing" className="flex w-full flex-col gap-16 bg-background px-6 py-16 md:px-10 md:py-24">
      <div data-slot="pricing-header" className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <Badge
          variant="outline"
          className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          Pricing
        </Badge>
        <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
          Priced by the minute, not the seat
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Every plan includes the full editor. You pay for compute and retention, and collaborators are free everywhere.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            data-slot="pricing-tier"
            data-featured={tier.featured}
            className={cn(
              'relative flex h-full flex-col gap-6 overflow-hidden rounded-xs border border-border bg-background p-7',
              tier.featured && 'border-primary/60',
            )}
          >
            {tier.featured ? (
              <>
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_0%,var(--warm-glow),transparent_70%)]"
                />
                <Badge className="absolute end-5 top-5 font-mono text-[10px] uppercase tracking-[0.12em]">
                  Most popular
                </Badge>
              </>
            ) : null}

            <div className="flex flex-col gap-2">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{tier.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">{tier.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">{tier.tagline}</p>
            </div>

            <Button
              variant={tier.featured ? 'default' : 'outline'}
              className="w-full"
              render={<a href="#" />}
              nativeButton={false}
            >
              {tier.cta}
            </Button>

            <ul className="flex flex-col gap-2.5 text-sm">
              {tier.quota.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing04;
