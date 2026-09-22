'use client';

import * as React from 'react';
import { Check, Minus } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/hirael/bases/base/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';
import { cn } from '@/lib/utils';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
/** Replays whenever a hidden column is shown, because leaving display:none restarts CSS animations. */
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type Cell = boolean | string;
type PlanKey = 'starter' | 'growth' | 'business';

interface Plan {
  key: PlanKey;
  name: string;
  price: string;
  cta: string;
  ctaVariant: 'default' | 'outline';
  featured?: boolean;
}

const PLANS: readonly Plan[] = [
  { key: 'starter', name: 'Starter', price: '$0', cta: 'Start free', ctaVariant: 'outline' },
  { key: 'growth', name: 'Growth', price: '$29', cta: 'Start trial', ctaVariant: 'default', featured: true },
  { key: 'business', name: 'Business', price: '$99', cta: 'Contact sales', ctaVariant: 'outline' },
];

interface Row {
  feature: string;
  cells: Record<PlanKey, Cell>;
}

const GROUPS: readonly { label: string; rows: readonly Row[] }[] = [
  {
    label: 'Monitoring',
    rows: [
      { feature: 'Uptime monitors', cells: { starter: '10', growth: '50', business: '250' } },
      { feature: 'Check interval', cells: { starter: '5 min', growth: '1 min', business: '30 sec' } },
      { feature: 'Check regions', cells: { starter: '3', growth: '12', business: '12' } },
      { feature: 'Log retention', cells: { starter: '7 days', growth: '90 days', business: '1 year' } },
    ],
  },
  {
    label: 'Alerts and status pages',
    rows: [
      { feature: 'Email and Slack alerts', cells: { starter: true, growth: true, business: true } },
      { feature: 'SMS and phone calls', cells: { starter: false, growth: true, business: true } },
      { feature: 'Public status pages', cells: { starter: '1', growth: '5', business: 'Unlimited' } },
      { feature: 'Status page on your domain', cells: { starter: false, growth: true, business: true } },
    ],
  },
  {
    label: 'Team',
    rows: [
      { feature: 'Team members', cells: { starter: '2', growth: '10', business: 'Unlimited' } },
      { feature: 'On-call schedules', cells: { starter: false, growth: true, business: true } },
      { feature: 'SSO and audit log', cells: { starter: false, growth: false, business: true } },
    ],
  },
];

const CellContent = ({ value }: { value: Cell }) => {
  if (value === true) {
    return (
      <>
        <Check aria-hidden className="size-4 text-foreground" />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus aria-hidden className="size-4 text-muted-foreground" />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="text-sm tabular-nums text-foreground">{value}</span>;
};

const Pricing02 = () => {
  const [selected, setSelected] = React.useState<PlanKey>('growth');

  /** Below md only the selected plan's column is shown; from md up every column is. */
  const columnClass = (plan: Plan) =>
    cn(plan.key !== selected && 'hidden md:table-cell', plan.featured && 'md:bg-primary/5');

  return (
    <section data-slot="pricing" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div data-slot="pricing-header" className="flex flex-col gap-5">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Compare plans</span>
          <h2
            style={stagger(1)}
            className={cn(ENTER, 'max-w-2xl font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
          >
            Know when your site is down before your customers do.
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'max-w-2xl text-base text-muted-foreground sm:text-lg')}>
            Every plan checks from several regions and alerts the right person. The larger plans check more often and
            keep your history longer.
          </p>
        </div>

        <ToggleGroup
          data-slot="pricing-plan-picker"
          variant="outline"
          value={[selected]}
          onValueChange={([next]) => next && setSelected(next as PlanKey)}
          aria-label="Plan to show"
          style={stagger(3)}
          className={cn(ENTER, 'mt-10 w-full md:hidden')}
        >
          {PLANS.map((plan) => (
            <ToggleGroupItem key={plan.key} value={plan.key} className="flex-1">
              {plan.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div
          data-slot="pricing-table"
          style={stagger(4)}
          className={cn(ENTER, 'mt-4 overflow-hidden rounded-md border border-border bg-card md:mt-12')}
        >
          <Table className="table-fixed border-collapse text-start">
            <TableHeader className="bg-card">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-1/2 px-4 pt-6 pb-5 align-top text-start whitespace-normal sm:px-5 md:w-2/5">
                  <span className="text-xs font-normal uppercase text-muted-foreground">Features</span>
                </TableHead>
                {PLANS.map((plan) => (
                  <TableHead
                    key={plan.key}
                    className={cn('h-auto px-4 py-5 align-bottom text-start sm:px-5', columnClass(plan))}
                  >
                    <div className={cn(SWAP, 'flex flex-col gap-3')}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                        <span className="text-base font-semibold tracking-[-0.01em] text-foreground">{plan.name}</span>
                        <span className="text-xs text-muted-foreground">
                          <span dir="ltr" className="tabular-nums text-foreground">
                            {plan.price}
                          </span>{' '}
                          / month
                        </span>
                      </div>
                      <Button
                        variant={plan.ctaVariant}
                        size="sm"
                        className="w-full"
                        render={<a href="#" />}
                        nativeButton={false}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {GROUPS.map((group) => (
                <React.Fragment key={group.label}>
                  <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
                    <TableCell
                      colSpan={PLANS.length + 1}
                      className="px-4 py-2.5 text-xs uppercase text-muted-foreground sm:px-5"
                    >
                      {group.label}
                    </TableCell>
                  </TableRow>
                  {group.rows.map((row) => (
                    <TableRow key={row.feature} className="border-border hover:bg-transparent">
                      <TableCell className="px-4 py-3.5 text-sm whitespace-normal text-foreground sm:px-5">
                        {row.feature}
                      </TableCell>
                      {PLANS.map((plan) => (
                        <TableCell key={plan.key} className={cn('px-4 py-3.5 sm:px-5', columnClass(plan))}>
                          <span className={cn(SWAP, 'flex items-center')}>
                            <CellContent value={row.cells[plan.key]} />
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default Pricing02;
