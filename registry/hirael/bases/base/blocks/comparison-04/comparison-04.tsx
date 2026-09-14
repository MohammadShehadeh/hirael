'use client';

import * as React from 'react';
import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Label } from '@/registry/hirael/bases/base/ui/label';
import { Switch } from '@/registry/hirael/bases/base/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none md:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type PlanKey = 'starter' | 'team' | 'enterprise';
type Value = boolean | string;

interface Plan {
  key: PlanKey;
  name: string;
  price: string;
  cadence: string;
  cta: string;
  recommended?: boolean;
}

const PLANS: readonly Plan[] = [
  { key: 'starter', name: 'Starter', price: '$0', cadence: 'free forever', cta: 'Start free' },
  { key: 'team', name: 'Team', price: '$24', cadence: 'per seat, monthly', cta: 'Try Team', recommended: true },
  { key: 'enterprise', name: 'Enterprise', price: 'Custom', cadence: 'billed yearly', cta: 'Talk to sales' },
];

interface Group {
  name: string;
  rows: readonly { feature: string; values: Record<PlanKey, Value> }[];
}

const GROUPS: readonly Group[] = [
  {
    name: 'Workspace',
    rows: [
      { feature: 'Seats', values: { starter: '3 seats', team: 'Unlimited', enterprise: 'Unlimited' } },
      { feature: 'Projects', values: { starter: '5', team: 'Unlimited', enterprise: 'Unlimited' } },
      { feature: 'Version history', values: { starter: '7 days', team: '90 days', enterprise: 'Unlimited' } },
      { feature: 'Guest access', values: { starter: false, team: true, enterprise: true } },
      { feature: 'Custom domain', values: { starter: false, team: true, enterprise: true } },
    ],
  },
  {
    name: 'Collaboration',
    rows: [
      { feature: 'Comments and mentions', values: { starter: true, team: true, enterprise: true } },
      { feature: 'Live editing', values: { starter: true, team: true, enterprise: true } },
      { feature: 'Review and approvals', values: { starter: false, team: true, enterprise: true } },
      { feature: 'Shared templates', values: { starter: false, team: true, enterprise: true } },
      { feature: 'Branches', values: { starter: false, team: false, enterprise: true } },
    ],
  },
  {
    name: 'Security and support',
    rows: [
      { feature: 'Two-factor sign in', values: { starter: true, team: true, enterprise: true } },
      { feature: 'SAML single sign-on', values: { starter: false, team: false, enterprise: true } },
      { feature: 'Audit log', values: { starter: false, team: '30 days', enterprise: 'Unlimited' } },
      { feature: 'Support', values: { starter: 'Community', team: 'Email, 1 day', enterprise: 'Named, 4 hours' } },
      { feature: 'Uptime SLA', values: { starter: false, team: false, enterprise: '99.9%' } },
    ],
  },
];

const isSame = (values: Record<PlanKey, Value>) => PLANS.every((plan) => values[plan.key] === values[PLANS[0].key]);

const TOTAL_ROWS = GROUPS.reduce((sum, group) => sum + group.rows.length, 0);
const DIFFERENT_ROWS = GROUPS.reduce((sum, group) => sum + group.rows.filter((row) => !isSame(row.values)).length, 0);

const CellValue = ({ value }: { value: Value }) => {
  if (typeof value === 'string') {
    return <span className="text-sm tabular-nums">{value}</span>;
  }
  return value ? (
    <>
      <Check aria-hidden className="size-4 text-foreground" />
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <Minus aria-hidden className="size-4 text-muted-foreground/50" />
      <span className="sr-only">Not included</span>
    </>
  );
};

/** Collapses a table row's cell content with the grid-rows height trick; exits run faster than entrances. */
const Collapse = ({ open, className, children }: { open: boolean; className?: string; children: React.ReactNode }) => (
  <div
    className={cn(
      'grid ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
      open
        ? 'grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-300'
        : 'grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200',
    )}
  >
    <div className="overflow-hidden">
      <div className={className}>{children}</div>
    </div>
  </div>
);

const Comparison04 = () => {
  const [picked, setPicked] = React.useState<PlanKey | null>(null);
  const [differencesOnly, setDifferencesOnly] = React.useState(false);
  const [focusColumn, setFocusColumn] = React.useState<PlanKey | null>(null);

  const selected = picked ?? 'team';

  const columnProps = (plan: Plan) => ({
    onPointerEnter: () => setFocusColumn(plan.key),
    onFocus: () => setFocusColumn(plan.key),
    className: cn(plan.key !== selected && 'hidden md:table-cell'),
  });

  return (
    <section data-slot="comparison" className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:gap-14 md:px-10">
        <div data-slot="comparison-header" className="flex max-w-xl flex-col gap-4">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Compare plans</span>
          <h2
            style={stagger(1, 80)}
            className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
          >
            Every feature, every plan
          </h2>
          <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            Starter covers a small team getting organised. Team adds guests, approvals and a longer history. Enterprise
            is for companies that need single sign-on and a contract.
          </p>
        </div>

        <div data-slot="comparison-matrix" style={stagger(3, 80)} className={cn(ENTER, 'flex flex-col gap-6')}>
          <div
            data-slot="comparison-toolbar"
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <ToggleGroup
              type="single"
              variant="outline"
              value={selected}
              onValueChange={(next) => next && setPicked(next as PlanKey)}
              aria-label="Plan to compare"
              className="w-full sm:w-auto md:hidden"
            >
              {PLANS.map((plan) => (
                <ToggleGroupItem key={plan.key} value={plan.key} className="flex-1 sm:flex-none">
                  {plan.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="hidden text-sm text-muted-foreground md:block" aria-live="polite">
              Showing{' '}
              <span className="tabular-nums text-foreground">{differencesOnly ? DIFFERENT_ROWS : TOTAL_ROWS}</span> of{' '}
              <span className="tabular-nums">{TOTAL_ROWS}</span> features
            </p>
            <div className="flex items-center gap-3">
              <Label htmlFor="comparison-04-differences" className="font-normal text-muted-foreground">
                Show differences only
              </Label>
              <Switch id="comparison-04-differences" checked={differencesOnly} onCheckedChange={setDifferencesOnly} />
            </div>
          </div>

          <table
            className="w-full table-fixed border-separate border-spacing-0 text-start"
            onPointerLeave={() => setFocusColumn(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setFocusColumn(null);
            }}
          >
            <caption className="sr-only">Features included in the Starter, Team and Enterprise plans</caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky top-0 z-10 w-2/5 border-b border-border bg-background px-4 py-4 text-start align-bottom text-xs font-normal uppercase text-muted-foreground md:w-1/4"
                >
                  Features
                </th>
                {PLANS.map((plan) => {
                  const { className, ...handlers } = columnProps(plan);
                  const active = focusColumn === plan.key;
                  return (
                    <th
                      key={plan.key}
                      scope="col"
                      data-slot="comparison-plan"
                      data-active={active || undefined}
                      {...handlers}
                      className={cn(
                        'sticky top-0 z-10 border-b border-border bg-background p-0 text-start align-bottom font-normal',
                        className,
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'pointer-events-none absolute inset-0 bg-muted/40 transition-opacity duration-150 motion-reduce:transition-none',
                          active ? 'opacity-0 md:opacity-100' : 'opacity-0',
                        )}
                      />
                      {plan.recommended && (
                        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-warm/70" />
                      )}
                      <div
                        key={picked ? selected : undefined}
                        className={cn('relative flex flex-col gap-3 px-4 pt-5 pb-4', picked && SWAP)}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-base font-medium text-foreground">
                            {plan.name}
                            {plan.recommended && (
                              <span className="text-xs font-normal uppercase text-warm">Recommended</span>
                            )}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            <span dir="ltr" className="font-medium tabular-nums text-foreground">
                              {plan.price}
                            </span>{' '}
                            {plan.cadence}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant={plan.recommended ? 'default' : 'outline'}
                          className="w-full"
                          render={<a href="#" />}
                          nativeButton={false}
                        >
                          {plan.cta}
                        </Button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            {GROUPS.map((group) => {
              const groupOpen = !differencesOnly || group.rows.some((row) => !isSame(row.values));
              return (
                <tbody key={group.name} data-slot="comparison-group">
                  <tr aria-hidden={!groupOpen || undefined}>
                    <th scope="colgroup" colSpan={PLANS.length + 1} className="p-0 text-start font-normal">
                      <Collapse open={groupOpen} className="px-4 pt-8 pb-3 text-xs uppercase text-muted-foreground">
                        {group.name}
                      </Collapse>
                    </th>
                  </tr>
                  {group.rows.map((row) => {
                    const open = !differencesOnly || !isSame(row.values);
                    return (
                      <tr key={row.feature} data-slot="comparison-row" aria-hidden={!open || undefined}>
                        <th scope="row" className="p-0 text-start text-sm font-normal">
                          <Collapse open={open} className="border-t border-border px-4 py-3.5">
                            {row.feature}
                          </Collapse>
                        </th>
                        {PLANS.map((plan) => {
                          const { className, ...handlers } = columnProps(plan);
                          return (
                            <td
                              key={plan.key}
                              {...handlers}
                              className={cn(
                                'p-0 transition-colors duration-150 motion-reduce:transition-none',
                                focusColumn === plan.key && 'md:bg-muted/40',
                                className,
                              )}
                            >
                              <Collapse open={open} className="border-t border-border px-4 py-3.5">
                                <span
                                  key={picked ? selected : undefined}
                                  className={cn('flex min-h-5 items-center', picked && SWAP)}
                                >
                                  <CellValue value={row.values[plan.key]} />
                                </span>
                              </Collapse>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
    </section>
  );
};

export default Comparison04;
