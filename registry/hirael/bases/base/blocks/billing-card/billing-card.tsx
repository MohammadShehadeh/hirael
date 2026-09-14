'use client';

import * as React from 'react';
import { Check, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

type BillingCardProps = React.ComponentProps<'div'>;

const BillingCard = ({ className, ...props }: BillingCardProps) => {
  return (
    <div
      data-slot="billing-card"
      className={cn('flex flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground', className)}
      {...props}
    />
  );
};

type BillingCardHeaderProps = React.ComponentProps<'div'>;

const BillingCardHeader = ({ className, ...props }: BillingCardHeaderProps) => {
  return (
    <div
      data-slot="billing-card-header"
      className={cn('flex items-start justify-between gap-3', className)}
      {...props}
    />
  );
};

type BillingCardEyebrowProps = React.ComponentProps<'p'>;

const BillingCardEyebrow = ({ className, ...props }: BillingCardEyebrowProps) => {
  return (
    <p
      data-slot="billing-card-eyebrow"
      className={cn('text-xs uppercase text-muted-foreground', className)}
      {...props}
    />
  );
};

type BillingCardPlanProps = React.ComponentProps<'p'>;

const BillingCardPlan = ({ className, ...props }: BillingCardPlanProps) => {
  return (
    <p
      data-slot="billing-card-plan"
      className={cn('text-xl font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  );
};

interface BillingCardPriceProps extends React.ComponentProps<'p'> {
  cycle?: React.ReactNode;
}

const BillingCardPrice = ({ cycle, className, children, ...props }: BillingCardPriceProps) => {
  return (
    <p data-slot="billing-card-price" className={cn('text-end text-sm text-foreground', className)} {...props}>
      <span className="text-lg font-semibold tracking-tight">{children}</span>
      {cycle ? <span className="text-muted-foreground"> / {cycle}</span> : null}
    </p>
  );
};

interface BillingCardMeterProps extends React.ComponentProps<'div'> {
  value: number;
  max: number;
  label?: React.ReactNode;
}

const BillingCardMeter = ({ value, max, label, className, ...props }: BillingCardMeterProps) => {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return (
    <div data-slot="billing-card-meter" className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label ? (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="tabular-nums text-foreground">
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
};

interface BillingCardRowProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
}

const BillingCardRow = ({ label, className, children, ...props }: BillingCardRowProps) => {
  return (
    <div
      data-slot="billing-card-row"
      className={cn('flex items-center justify-between gap-3 text-sm', className)}
      {...props}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
};

type BillingCardFooterProps = React.ComponentProps<'div'>;

const BillingCardFooter = ({ className, ...props }: BillingCardFooterProps) => {
  return (
    <div
      data-slot="billing-card-footer"
      className={cn('flex items-center gap-2 border-t border-border pt-4', className)}
      {...props}
    />
  );
};

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

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

type UpgradeStep = 'idle' | 'confirm' | 'pending' | 'done';

const PLANS = {
  current: { name: 'Team', price: '$29', seats: 25 },
  next: { name: 'Pro', price: '$79', seats: 50 },
};

const BillingCardBlock = () => {
  const [step, setStep] = React.useState<UpgradeStep>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const upgraded = step === 'done';
  const plan = upgraded ? PLANS.next : PLANS.current;

  const confirmUpgrade = () => {
    setStep('pending');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStep('done'), 1200);
  };

  return (
    <section data-slot="billing-card-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <BillingCard className={cn(ENTER, 'w-full max-w-sm')}>
        <BillingCardHeader>
          <div key={plan.name} className={cn(upgraded && SWAP, 'flex flex-col gap-1')}>
            <BillingCardEyebrow>Current plan</BillingCardEyebrow>
            <BillingCardPlan>{plan.name}</BillingCardPlan>
          </div>
          <BillingCardPrice key={plan.price} cycle="mo" className={cn(upgraded && SWAP)}>
            {plan.price}
          </BillingCardPrice>
        </BillingCardHeader>

        <BillingCardMeter value={18} max={plan.seats} label="Seats used" />

        <div className="flex flex-col gap-2">
          <BillingCardRow label="Renews on">Jul 1, 2026</BillingCardRow>
          <BillingCardRow label="Payment">Visa ending 4242</BillingCardRow>
        </div>

        <BillingCardFooter className="min-h-[4.25rem] flex-col items-stretch">
          {step === 'idle' && (
            <div key="idle" className={cn(SWAP, 'flex items-center gap-2')}>
              <Button variant="outline" className="flex-1" render={<a href="#billing" />} nativeButton={false}>
                Manage billing
              </Button>
              <Button type="button" className="flex-1" onClick={() => setStep('confirm')}>
                Upgrade
              </Button>
            </div>
          )}

          {(step === 'confirm' || step === 'pending') && (
            <div key="confirm" className={cn(SWAP, 'flex flex-col gap-3')}>
              <p className="text-sm text-muted-foreground">
                Move to <span className="font-medium text-foreground">Pro</span> for {PLANS.next.price} a month with{' '}
                {PLANS.next.seats} seats. Today you pay the prorated difference of $32.40.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={step === 'pending'}
                  onClick={() => setStep('idle')}
                >
                  Cancel
                </Button>
                <Button type="button" className="flex-1" disabled={step === 'pending'} onClick={confirmUpgrade}>
                  {step === 'pending' ? (
                    <>
                      <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" />
                      Upgrading
                    </>
                  ) : (
                    'Confirm upgrade'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div key="done" className={cn(SWAP, 'flex items-center justify-between gap-3')}>
              <p role="status" className="flex items-center gap-2 text-sm">
                <Check aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                You&apos;re on Pro
              </p>
              <Button variant="outline" size="sm" render={<a href="#billing" />} nativeButton={false}>
                Manage billing
              </Button>
            </div>
          )}
        </BillingCardFooter>
      </BillingCard>
    </section>
  );
};

export default BillingCardBlock;
