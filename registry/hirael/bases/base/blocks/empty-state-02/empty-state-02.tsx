'use client';

import * as React from 'react';
import { SearchX, Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/base/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/base/ui/input-group';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const PLANS = ['Free', 'Pro', 'Enterprise'] as const;
const STATUSES = ['Active', 'Past due', 'Canceled'] as const;

type Plan = (typeof PLANS)[number];
type Status = (typeof STATUSES)[number];

interface Customer {
  name: string;
  email: string;
  plan: Plan;
  status: Status;
  /** Monthly recurring revenue in USD. */
  mrr: number;
}

const CUSTOMERS: readonly Customer[] = [
  { name: 'Hirael Design', email: 'design@hirael.com', plan: 'Enterprise', status: 'Active', mrr: 4200 },
  { name: 'Hirael Desktop', email: 'desktop@hirael.com', plan: 'Pro', status: 'Active', mrr: 290 },
  { name: 'Hirael Cloud', email: 'cloud@hirael.com', plan: 'Enterprise', status: 'Past due', mrr: 3800 },
  { name: 'Hirael Labs', email: 'labs@hirael.com', plan: 'Pro', status: 'Active', mrr: 190 },
  { name: 'Hirael Docs', email: 'docs@hirael.com', plan: 'Free', status: 'Active', mrr: 0 },
  { name: 'Hirael Commerce', email: 'commerce@hirael.com', plan: 'Enterprise', status: 'Active', mrr: 5600 },
  { name: 'Hirael Studio', email: 'studio@hirael.com', plan: 'Pro', status: 'Past due', mrr: 290 },
  { name: 'Hirael Academy', email: 'academy@hirael.com', plan: 'Free', status: 'Canceled', mrr: 0 },
  { name: 'Hirael Store', email: 'store@hirael.com', plan: 'Pro', status: 'Active', mrr: 490 },
  { name: 'Hirael Mobile', email: 'mobile@hirael.com', plan: 'Pro', status: 'Canceled', mrr: 0 },
  { name: 'Hirael Analytics', email: 'analytics@hirael.com', plan: 'Enterprise', status: 'Active', mrr: 7200 },
  { name: 'Hirael Blog', email: 'blog@hirael.com', plan: 'Free', status: 'Active', mrr: 0 },
];

const STATUS_DOT: Record<Status, string> = {
  Active: 'bg-success',
  'Past due': 'bg-warning',
  Canceled: 'bg-muted-foreground/50',
};

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const matchesQuery = (customer: Customer, query: string) => {
  const q = query.trim().toLowerCase();

  return !q || customer.name.toLowerCase().includes(q) || customer.email.toLowerCase().includes(q);
};

const matchesFilters = (customer: Customer, plans: readonly string[], statuses: readonly string[]) =>
  (plans.length === 0 || plans.includes(customer.plan)) &&
  (statuses.length === 0 || statuses.includes(customer.status));

const levenshtein = (a: string, b: string) => {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }

  return previous[b.length];
};

// Scores each word of a name, so "desing" still finds "Hirael Design"; a shared 3-letter prefix is a weaker hit.
const suggest = (query: string, customers: readonly Customer[], limit = 2) => {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  const threshold = Math.max(1, Math.floor(q.length / 3));

  return customers
    .map((customer) => {
      const words = customer.name.toLowerCase().split(/[^a-z0-9]+/);
      const distance = Math.min(...words.map((word) => levenshtein(q, word)));
      const prefix = words.some((word) => word.startsWith(q.slice(0, 3)));
      const score = distance <= threshold ? distance : prefix ? threshold + 1 : Infinity;

      return { customer, score };
    })
    .filter((entry) => entry.score !== Infinity)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((entry) => entry.customer);
};

const EmptyState02 = () => {
  const [query, setQuery] = React.useState('desing');
  const [plans, setPlans] = React.useState<string[]>(['Pro']);
  const [statuses, setStatuses] = React.useState<string[]>(['Active']);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const results = CUSTOMERS.filter((c) => matchesQuery(c, trimmed) && matchesFilters(c, plans, statuses));
  const hidden = trimmed ? CUSTOMERS.filter((c) => matchesQuery(c, trimmed)).length : 0;
  const suggestions = hidden === 0 ? suggest(trimmed, CUSTOMERS) : [];
  const hasFilters = plans.length + statuses.length > 0;

  const clearFilters = () => {
    setPlans([]);
    setStatuses([]);
  };

  const applySuggestion = (customer: Customer) => {
    setQuery(customer.name);
    if (!matchesFilters(customer, plans, statuses)) clearFilters();
  };

  return (
    <section data-slot="empty-state-02" className="bg-background">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <div
          data-slot="empty-state-02-panel"
          className={cn(ENTER, 'overflow-hidden rounded-lg border border-border bg-card text-card-foreground')}
        >
          <header data-slot="empty-state-02-header" className="flex flex-col gap-3 border-b border-border px-5 py-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-medium text-foreground">Customers</h2>
              <p aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
                Showing {results.length} of {CUSTOMERS.length}
              </p>
            </div>

            <InputGroup>
              <InputGroupAddon>
                <Search aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or email"
                aria-label="Search customers"
              />
              {query ? (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery('');
                      searchRef.current?.focus();
                    }}
                  >
                    <X />
                  </InputGroupButton>
                </InputGroupAddon>
              ) : null}
            </InputGroup>

            <div data-slot="empty-state-02-filters" className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase">Plan</span>
                <ToggleGroup
                  multiple
                  variant="outline"
                  size="sm"
                  value={plans}
                  onValueChange={setPlans}
                  aria-label="Filter by plan"
                >
                  {PLANS.map((plan) => (
                    <ToggleGroupItem key={plan} value={plan}>
                      {plan}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase">Status</span>
                <ToggleGroup
                  multiple
                  variant="outline"
                  size="sm"
                  value={statuses}
                  onValueChange={setStatuses}
                  aria-label="Filter by status"
                >
                  {STATUSES.map((status) => (
                    <ToggleGroupItem key={status} value={status}>
                      {status}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </header>

          {results.length === 0 ? (
            <Empty className={SWAP}>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchX />
                </EmptyMedia>
                <EmptyTitle>{trimmed ? `No results for “${trimmed}”` : 'No customers match these filters'}</EmptyTitle>
                <EmptyDescription>
                  {hidden > 0
                    ? `${hidden} ${hidden === 1 ? 'customer matches' : 'customers match'} your search but ${hidden === 1 ? 'is' : 'are'} hidden by the plan and status filters.`
                    : trimmed
                      ? 'Check the spelling, or search by email address instead.'
                      : 'Try removing a filter to widen the list.'}
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent>
                {suggestions.length > 0 ? (
                  <div
                    data-slot="empty-state-02-suggestions"
                    className="flex flex-wrap items-center justify-center gap-2"
                  >
                    <span className="text-sm text-muted-foreground">Did you mean</span>
                    {suggestions.map((customer) => (
                      <Button
                        key={customer.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applySuggestion(customer)}
                      >
                        {customer.name}
                      </Button>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap justify-center gap-2">
                  {hasFilters ? (
                    <Button type="button" variant={hidden > 0 ? 'default' : 'outline'} size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  ) : null}
                  {trimmed ? (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setQuery('')}>
                      Clear search
                    </Button>
                  ) : null}
                </div>
              </EmptyContent>
            </Empty>
          ) : (
            <ul data-slot="empty-state-02-list" className="divide-y divide-border">
              {results.map((customer) => (
                <li
                  key={customer.name}
                  data-slot="empty-state-02-row"
                  className={cn(SWAP, 'flex items-center gap-4 px-5 py-3')}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">{customer.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{customer.email}</span>
                  </span>
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    {customer.plan}
                  </Badge>
                  <span className="hidden w-20 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                    <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', STATUS_DOT[customer.status])} />
                    {customer.status}
                  </span>
                  <span className="w-16 text-end text-sm text-foreground tabular-nums">
                    {currency.format(customer.mrr)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmptyState02;
