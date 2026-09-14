'use client';

import * as React from 'react';
import {
  BarChart3,
  Boxes,
  Check,
  CreditCard,
  Database,
  GitBranch,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  Siren,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

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
    name: 'Forkline',
    summary: 'Open a pull request on every release',
    category: 'Source',
    icon: GitBranch,
    connected: true,
  },
  { name: 'Cratebay', summary: 'Publish payloads on merge to main', category: 'Source', icon: Boxes },
  {
    name: 'Chatterbox',
    summary: 'Post build results into a channel',
    category: 'Messaging',
    icon: MessageSquare,
    connected: true,
  },
  { name: 'Postwing', summary: 'Send digests to maintainers', category: 'Messaging', icon: Mail },
  { name: 'Nightcall', summary: 'Wake someone when a deploy fails', category: 'Messaging', icon: Siren },
  {
    name: 'Stackhouse',
    summary: 'Stream install events into your tables',
    category: 'Data',
    icon: Database,
    connected: true,
  },
  { name: 'Tallyboard', summary: 'Track which components get adopted', category: 'Data', icon: BarChart3 },
  { name: 'Meterly', summary: 'Meter usage against a plan', category: 'Billing', icon: CreditCard },
];

const CATEGORIES: readonly Category[] = ['All', 'Source', 'Messaging', 'Data', 'Billing'];

const Integrations02 = () => {
  const [active, setActive] = React.useState<Category>('All');
  const [connected, setConnected] = React.useState<ReadonlySet<string>>(
    () => new Set(INTEGRATIONS.filter((item) => item.connected).map((item) => item.name)),
  );
  const [pending, setPending] = React.useState<ReadonlySet<string>>(() => new Set());

  const shown = active === 'All' ? INTEGRATIONS : INTEGRATIONS.filter((item) => item.category === active);

  const toggle = (name: string) => {
    if (pending.has(name)) return;
    setPending((prev) => new Set(prev).add(name));
    window.setTimeout(() => {
      setConnected((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        return next;
      });
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }, 900);
  };

  return (
    <section
      data-slot="integrations"
      className="bg-background py-20 sm:py-28"
      aria-labelledby="integrations-02-heading"
    >
      <div className="container w-full">
        <div
          data-slot="integrations-header"
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Integrations</p>
            <h2
              id="integrations-02-heading"
              style={stagger(1)}
              className={cn(ENTER, 'mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl')}
            >
              Connect the tools already in the loop
            </h2>
            <p style={stagger(2)} className={cn(ENTER, 'mt-4 text-muted-foreground')}>
              Eight connectors, each one a webhook and a token. Nothing here needs a migration.
            </p>
          </div>

          <div style={stagger(3)} className={ENTER}>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              spacing={1}
              value={active}
              onValueChange={(value) => {
                if (value) setActive(value as Category);
              }}
              aria-label="Filter by category"
              className="flex-wrap"
            >
              {CATEGORIES.map((category) => (
                <ToggleGroupItem key={category} value={category} className="rounded-full px-3 text-xs">
                  {category}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <ul key={active} data-slot="integrations-grid" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item, index) => {
            const isConnected = connected.has(item.name);
            const isPending = pending.has(item.name);
            return (
              <li
                key={item.name}
                data-slot="integrations-card"
                style={stagger(index, 40)}
                className={cn(
                  SWAP,
                  'flex flex-col gap-4 rounded-md border border-border bg-card p-5 transition-colors duration-150 hover:border-ring',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex min-w-0 items-center gap-2 text-sm font-medium">
                    <item.icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    {item.name}
                  </h3>
                  <Badge variant="outline" className="text-xs uppercase">
                    {item.category}
                  </Badge>
                </div>
                <p className="text-sm text-pretty text-muted-foreground">{item.summary}</p>
                <Button
                  type="button"
                  variant={isConnected ? 'outline' : 'default'}
                  size="sm"
                  disabled={isPending}
                  onClick={() => toggle(item.name)}
                  aria-label={isConnected ? `Disconnect ${item.name}` : `Connect ${item.name}`}
                  className={cn('mt-auto w-full', isConnected && !isPending && 'text-accent-cool')}
                >
                  {isPending ? (
                    <Loader2 aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
                  ) : isConnected ? (
                    <Check aria-hidden className="size-3.5" />
                  ) : (
                    <Plus aria-hidden className="size-3.5" />
                  )}
                  {isPending ? (isConnected ? 'Disconnecting' : 'Connecting') : isConnected ? 'Connected' : 'Connect'}
                </Button>
              </li>
            );
          })}
        </ul>

        <p
          aria-live="polite"
          className="mt-6 flex flex-wrap items-center gap-x-2 text-xs uppercase text-muted-foreground"
        >
          <span>
            Showing {shown.length} of {INTEGRATIONS.length}
          </span>
          <span aria-hidden className="text-border">
            |
          </span>
          <span>{connected.size} connected</span>
        </p>
      </div>
    </section>
  );
};

export default Integrations02;
