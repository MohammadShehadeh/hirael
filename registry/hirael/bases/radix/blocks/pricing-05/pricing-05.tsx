'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/registry/hirael/bases/radix/components/animated-number';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import { Slider } from '@/registry/hirael/bases/radix/ui/slider';
import { Switch } from '@/registry/hirael/bases/radix/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type Billing = 'monthly' | 'yearly';

const PRICING = {
  base: 49,
  includedUsers: 10_000,
  userTiers: [
    { upTo: 50_000, rate: 0.006 },
    { upTo: Infinity, rate: 0.004 },
  ],
  includedMinutes: 2_000,
  minuteRate: 0.008,
  support: 99,
  paidMonthsPerYear: 10,
} as const;

const USERS = { min: 1_000, max: 200_000, step: 1_000, ticks: [1_000, 50_000, 100_000, 150_000, 200_000] };
const MINUTES = { min: 0, max: 20_000, step: 500, ticks: [0, 5_000, 10_000, 15_000, 20_000] };

const number = new Intl.NumberFormat('en-US');
const compact = new Intl.NumberFormat('en-US', { notation: 'compact' });
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const rate = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 3 });
const TOTAL_FORMAT: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' };

const toCents = (dollars: number) => Math.round(dollars * 100) / 100;

const estimate = (users: number, minutes: number, support: boolean, billing: Billing) => {
  let userCost = 0;
  let floor: number = PRICING.includedUsers;
  for (const tier of PRICING.userTiers) {
    if (users <= floor) break;
    userCost += (Math.min(users, tier.upTo) - floor) * tier.rate;
    floor = tier.upTo;
  }

  const extraUsers = Math.max(0, users - PRICING.includedUsers);
  const extraMinutes = Math.max(0, minutes - PRICING.includedMinutes);
  const lines = [
    {
      label: 'Base plan',
      detail: `${compact.format(PRICING.includedUsers)} users, ${number.format(PRICING.includedMinutes)} minutes`,
      amount: PRICING.base,
    },
    { label: 'Users over included', detail: `${number.format(extraUsers)} users`, amount: toCents(userCost) },
    {
      label: 'Minutes over included',
      detail: `${number.format(extraMinutes)} min at ${rate.format(PRICING.minuteRate)}`,
      amount: toCents(extraMinutes * PRICING.minuteRate),
    },
    {
      label: 'Priority support',
      detail: support ? 'Four hour response' : 'Not added',
      amount: support ? PRICING.support : 0,
    },
  ];

  const subtotal = toCents(lines.reduce((sum, line) => sum + line.amount, 0));
  const yearly = toCents(subtotal * PRICING.paidMonthsPerYear);
  const monthly = billing === 'yearly' ? toCents(yearly / 12) : subtotal;

  return { lines, subtotal, discount: toCents(subtotal - monthly), monthly, yearly };
};

const tierNote = (users: number) => {
  if (users <= PRICING.includedUsers) {
    return { tier: 0, text: `Up to ${compact.format(PRICING.includedUsers)} users are covered by the base plan.` };
  }
  let floor: number = PRICING.includedUsers;
  let index = 0;
  while (index < PRICING.userTiers.length - 1 && users > PRICING.userTiers[index].upTo) {
    floor = PRICING.userTiers[index].upTo;
    index += 1;
  }
  const tier = PRICING.userTiers[index];
  return {
    tier: index + 1,
    text: `You are in tier ${index + 1}: ${rate.format(tier.rate)} per user after ${compact.format(floor)}.`,
  };
};

interface UsageSliderProps {
  id: string;
  label: string;
  unit: string;
  value: number;
  range: typeof USERS;
  onChange: (value: number) => void;
}

const UsageSlider = ({ id, label, unit, value, range, onChange }: UsageSliderProps) => {
  const position = (tick: number) => ((tick - range.min) / (range.max - range.min)) * 100;

  return (
    <div data-slot="pricing-usage" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <label id={`${id}-label`} className="text-sm font-medium">
          {label}
        </label>
        <span className="text-sm text-muted-foreground">
          <span dir="ltr" className="font-medium tabular-nums text-foreground">
            {number.format(value)}
          </span>{' '}
          {unit}
        </span>
      </div>
      <Slider
        aria-labelledby={`${id}-label`}
        value={[value]}
        min={range.min}
        max={range.max}
        step={range.step}
        onValueChange={([next]) => onChange(next)}
      />
      <div aria-hidden className="relative h-4 text-xs tabular-nums text-muted-foreground">
        {range.ticks.map((tick) => {
          const at = position(tick);
          return (
            <span
              key={tick}
              dir="ltr"
              style={at === 100 ? { insetInlineEnd: 0 } : { insetInlineStart: `${at}%` }}
              className={cn('absolute top-0', at > 0 && at < 100 && '-translate-x-1/2 rtl:translate-x-1/2')}
            >
              {compact.format(tick)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Pricing05 = () => {
  const [users, setUsers] = React.useState(25_000);
  const [minutes, setMinutes] = React.useState(6_000);
  const [support, setSupport] = React.useState(false);
  const [billing, setBilling] = React.useState<Billing>('monthly');

  const quote = estimate(users, minutes, support, billing);
  const note = tierNote(users);

  return (
    <section data-slot="pricing" className="bg-background py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div data-slot="pricing-inputs" className="flex flex-col gap-10">
          <div data-slot="pricing-header" className="flex max-w-xl flex-col gap-4">
            <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Usage pricing</span>
            <h2
              style={stagger(1, 80)}
              className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
            >
              Pay for what your team actually uses
            </h2>
            <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
              Every plan starts at $49 a month with 10k users and 2,000 build minutes. Move the sliders to see what a
              month would cost at your size.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div style={stagger(3, 80)} className={ENTER}>
              <UsageSlider
                id="pricing-05-users"
                label="Monthly active users"
                unit="users"
                value={users}
                range={USERS}
                onChange={setUsers}
              />
            </div>
            <div style={stagger(4, 80)} className={ENTER}>
              <UsageSlider
                id="pricing-05-minutes"
                label="Build minutes"
                unit="min"
                value={minutes}
                range={MINUTES}
                onChange={setMinutes}
              />
            </div>
            <Separator style={stagger(5, 80)} className={ENTER} />
            <div style={stagger(6, 80)} className={ENTER}>
              <Field orientation="horizontal" className="items-center">
                <FieldContent>
                  <FieldLabel htmlFor="pricing-05-support">Priority support</FieldLabel>
                  <FieldDescription>
                    A named engineer and a four hour response, for{' '}
                    <span dir="ltr" className="tabular-nums">
                      {money.format(PRICING.support)}
                    </span>{' '}
                    a month.
                  </FieldDescription>
                </FieldContent>
                <Switch id="pricing-05-support" checked={support} onCheckedChange={setSupport} />
              </Field>
            </div>
          </div>
        </div>

        <aside
          data-slot="pricing-summary"
          aria-label="Monthly estimate"
          style={stagger(0, 0, 320)}
          className={cn(
            ENTER,
            'relative flex flex-col gap-6 self-start overflow-hidden rounded-xl border border-border bg-card/40 p-6 shadow-sm md:p-8 lg:sticky lg:top-8',
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-warm/40 to-transparent"
          />

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase text-muted-foreground">Estimate</span>
            <ToggleGroup
              type="single"
              size="sm"
              variant="outline"
              value={billing}
              onValueChange={(next) => next && setBilling(next as Billing)}
              aria-label="Billing period"
            >
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight">
                <AnimatedNumber dir="ltr" value={quote.monthly} decimals={2} duration={400} format={TOTAL_FORMAT} />
              </span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            <p key={billing} className={cn(SWAP, 'text-sm text-muted-foreground')}>
              {billing === 'yearly' ? (
                <>
                  <span dir="ltr" className="tabular-nums text-foreground">
                    {money.format(quote.yearly)}
                  </span>{' '}
                  billed once a year, <span className="text-warm">2 months free</span>
                </>
              ) : (
                'Billed monthly, cancel any time'
              )}
            </p>
          </div>

          <Separator />

          <dl data-slot="pricing-lines" className="flex flex-col gap-3 text-sm">
            {quote.lines.map((line) => (
              <div key={line.label} className="flex items-start justify-between gap-4">
                <dt className="flex flex-col">
                  <span className={cn(line.amount === 0 && 'text-muted-foreground')}>{line.label}</span>
                  <span className="text-xs text-muted-foreground">{line.detail}</span>
                </dt>
                <dd
                  dir="ltr"
                  className={cn('tabular-nums', line.amount === 0 ? 'text-muted-foreground' : 'text-foreground')}
                >
                  {money.format(line.amount)}
                </dd>
              </div>
            ))}
            {quote.discount > 0 && (
              <div key="discount" className={cn(SWAP, 'flex items-start justify-between gap-4')}>
                <dt className="flex flex-col">
                  <span>Yearly billing</span>
                  <span className="text-xs text-muted-foreground">
                    Pay for {PRICING.paidMonthsPerYear} of 12 months
                  </span>
                </dt>
                <dd dir="ltr" className="tabular-nums text-warm">
                  {money.format(-quote.discount)}
                </dd>
              </div>
            )}
          </dl>

          <p
            key={note.tier}
            data-slot="pricing-tier"
            className={cn(SWAP, 'rounded-md bg-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground')}
          >
            {note.text}
          </p>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="group w-full">
              <a href="#">
                Start a 14 day trial
                <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Estimates exclude tax. Usage is metered daily and billed at the end of the period.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Pricing05;
