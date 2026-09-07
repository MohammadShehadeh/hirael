'use client';

import * as React from 'react';
import {
  BarChart3,
  Boxes,
  Check,
  CreditCard,
  Database,
  GitBranch,
  Mail,
  MessageSquare,
  Plus,
  Siren,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { cn } from '@/lib/utils';

type Category = 'All' | 'Source' | 'Messaging' | 'Data' | 'Billing';

interface Integration {
  name: string;
  summary: string;
  category: Exclude<Category, 'All'>;
  icon: LucideIcon;
  connected?: boolean;
}

const INTEGRATIONS: readonly Integration[] = [
  {
    name: 'Git provider',
    summary: 'Open a pull request on every release',
    category: 'Source',
    icon: GitBranch,
    connected: true,
  },
  { name: 'Package registry', summary: 'Publish payloads on merge to main', category: 'Source', icon: Boxes },
  {
    name: 'Team chat',
    summary: 'Post build results into a channel',
    category: 'Messaging',
    icon: MessageSquare,
    connected: true,
  },
  { name: 'Transactional email', summary: 'Send digests to maintainers', category: 'Messaging', icon: Mail },
  { name: 'On-call paging', summary: 'Wake someone when a deploy fails', category: 'Messaging', icon: Siren },
  {
    name: 'Warehouse',
    summary: 'Stream install events into your tables',
    category: 'Data',
    icon: Database,
    connected: true,
  },
  { name: 'Product analytics', summary: 'Track which components get adopted', category: 'Data', icon: BarChart3 },
  { name: 'Payments', summary: 'Meter usage against a plan', category: 'Billing', icon: CreditCard },
];

const CATEGORIES: readonly Category[] = ['All', 'Source', 'Messaging', 'Data', 'Billing'];

const Integrations02 = () => {
  const [active, setActive] = React.useState<Category>('All');

  const shown = active === 'All' ? INTEGRATIONS : INTEGRATIONS.filter((item) => item.category === active);

  return (
    <section className="bg-background py-20 sm:py-28" aria-labelledby="integrations-02-heading">
      <div className="container w-full">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Integrations</p>
            <h2
              id="integrations-02-heading"
              className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl"
            >
              Connect the tools already in the loop
            </h2>
            <p className="mt-4 text-muted-foreground">
              Eight connectors, each one a webhook and a token. Nothing here needs a migration.
            </p>
          </div>

          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={active === category}
                data-state={active === category ? 'on' : 'off'}
                onClick={() => setActive(category)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'data-[state=off]:border-border data-[state=off]:text-muted-foreground data-[state=off]:hover:text-foreground',
                  'data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background',
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-4 rounded-md border border-border bg-card p-5 transition-colors hover:border-ring"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-background">
                  <item.icon aria-hidden className="size-4" />
                </span>
                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-[0.1em]">
                  {item.category}
                </Badge>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
              </div>
              <Button
                variant={item.connected ? 'outline' : 'default'}
                size="sm"
                className="mt-auto w-full"
                aria-label={item.connected ? `${item.name} is connected` : `Connect ${item.name}`}
              >
                {item.connected ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                {item.connected ? 'Connected' : 'Connect'}
              </Button>
            </li>
          ))}
        </ul>

        <p aria-live="polite" className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Showing {shown.length} of {INTEGRATIONS.length}
        </p>
      </div>
    </section>
  );
};

export default Integrations02;
