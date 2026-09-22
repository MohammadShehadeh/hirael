'use client';

import * as React from 'react';
import { ArrowRight, Check, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type ColumnId = 'now' | 'next' | 'later';
type Sort = 'votes' | 'newest';

interface RoadmapItem {
  id: string;
  column: ColumnId;
  title: string;
  description: string;
  tag: string;
  votes: number;
  /** ISO date the item was added to the board. */
  added: string;
  /** Display date when the item has shipped, e.g. "Aug 28". */
  shipped?: string;
}

const COLUMNS: readonly { id: ColumnId; title: string; meaning: string }[] = [
  { id: 'now', title: 'Now', meaning: 'Being built this cycle' },
  { id: 'next', title: 'Next', meaning: 'Planned for the next cycle' },
  { id: 'later', title: 'Later', meaning: 'On our list, not scheduled yet' },
];

const ITEMS: readonly RoadmapItem[] = [
  {
    id: 'webhooks-retry',
    column: 'now',
    title: 'Webhook retries with backoff',
    description: 'Failed deliveries retry for 24 hours and show every attempt in the log.',
    tag: 'API',
    votes: 212,
    added: '2026-06-02',
    shipped: 'Aug 28',
  },
  {
    id: 'inline-comments',
    column: 'now',
    title: 'Inline comments on drafts',
    description: 'Select any sentence in a draft and leave a note for a teammate.',
    tag: 'Editor',
    votes: 348,
    added: '2026-05-14',
  },
  {
    id: 'annual-invoices',
    column: 'now',
    title: 'Annual plans with one invoice',
    description: 'Pay for a year up front and get a single invoice with your tax ID on it.',
    tag: 'Billing',
    votes: 97,
    added: '2026-07-21',
  },
  {
    id: 'scim',
    column: 'now',
    title: 'SCIM provisioning',
    description: 'Add and remove seats from Okta or Entra ID without touching Relay.',
    tag: 'Admin',
    votes: 164,
    added: '2026-04-30',
  },
  {
    id: 'rate-limit-headers',
    column: 'next',
    title: 'Rate limit headers on every response',
    description: 'Know how many requests you have left before you hit the limit.',
    tag: 'API',
    votes: 131,
    added: '2026-08-11',
  },
  {
    id: 'version-history',
    column: 'next',
    title: 'Version history for templates',
    description: 'See who changed a saved reply and restore any earlier version.',
    tag: 'Editor',
    votes: 276,
    added: '2026-07-02',
  },
  {
    id: 'usage-alerts',
    column: 'next',
    title: 'Usage alerts before overages',
    description: 'Get an email when a workspace reaches 80 percent of its monthly quota.',
    tag: 'Billing',
    votes: 189,
    added: '2026-08-25',
  },
  {
    id: 'offline-mode',
    column: 'later',
    title: 'Offline mode for the desktop app',
    description: 'Read and draft replies on a plane, then send when you reconnect.',
    tag: 'Desktop',
    votes: 402,
    added: '2026-03-18',
  },
  {
    id: 'graphql',
    column: 'later',
    title: 'GraphQL endpoint',
    description: 'Fetch threads, contacts, and tags in one request instead of three.',
    tag: 'API',
    votes: 88,
    added: '2026-09-03',
  },
  {
    id: 'multi-currency',
    column: 'later',
    title: 'Pay in EUR and GBP',
    description: 'Invoices and card charges in your own currency, no conversion fees.',
    tag: 'Billing',
    votes: 145,
    added: '2026-06-19',
  },
];

// Sorts on the stored count so an item doesn't jump from under the cursor when voted.
const sortItems = (items: readonly RoadmapItem[], sort: Sort) =>
  [...items].sort((a, b) => (sort === 'votes' ? b.votes - a.votes : b.added.localeCompare(a.added)));

const formatAdded = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' }).format(new Date(date));

interface UpvoteProps {
  count: number;
  voted: boolean;
  title: string;
  onToggle: () => void;
}

const Upvote = ({ count, voted, title, onToggle }: UpvoteProps) => {
  return (
    <Button
      type="button"
      variant={voted ? 'secondary' : 'outline'}
      size="sm"
      data-slot="roadmap-upvote"
      aria-pressed={voted}
      aria-label={`${voted ? 'Remove vote for' : 'Vote for'} ${title}, ${count} votes`}
      onClick={onToggle}
      className="h-auto w-12 shrink-0 flex-col"
    >
      <ChevronUp
        aria-hidden
        className={cn('size-4 transition-transform duration-150 ease-out', voted && '-translate-y-px')}
      />
      <span className="relative block h-4 overflow-hidden text-xs leading-4">
        <span
          key={count}
          className={cn(
            'block tabular-nums animate-in fade-in duration-250 fill-mode-both motion-reduce:animate-none',
            EASE,
            voted ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2',
          )}
        >
          {count}
        </span>
      </span>
    </Button>
  );
};

const Changelog02 = () => {
  const [sort, setSort] = React.useState<Sort>('votes');
  const [activeColumn, setActiveColumn] = React.useState<ColumnId>('now');
  const [votes, setVotes] = React.useState<ReadonlySet<string>>(() => new Set(['version-history']));

  const toggleVote = (id: string) => {
    setVotes((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sorted = sortItems(ITEMS, sort);

  return (
    <section data-slot="roadmap" aria-labelledby="changelog-02-heading" className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:gap-12 md:px-10">
        <header
          data-slot="roadmap-header"
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10"
        >
          <div className="flex max-w-xl flex-col gap-4">
            <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Public roadmap</span>
            <h2
              id="changelog-02-heading"
              style={stagger(1, 80)}
              className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
            >
              What we are working on
            </h2>
            <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
              Vote for the things you need. We read every vote when we plan a cycle, and cycles last six weeks.
            </p>
          </div>

          <div style={stagger(3, 80)} className={cn(ENTER, 'flex items-center gap-3')}>
            <span id="changelog-02-sort" className="text-xs uppercase text-muted-foreground">
              Sort
            </span>
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[sort]}
              onValueChange={([next]) => {
                // Keep one option selected when the active one is clicked again.
                if (next) setSort(next as Sort);
              }}
              aria-labelledby="changelog-02-sort"
              data-slot="roadmap-sort"
            >
              <ToggleGroupItem value="votes">Most votes</ToggleGroupItem>
              <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </header>

        <div style={stagger(4, 80)} className={cn(ENTER, 'flex flex-col gap-4')}>
          <Tabs
            value={activeColumn}
            onValueChange={(value) => setActiveColumn(value as ColumnId)}
            aria-label="Roadmap column"
            className="md:hidden"
          >
            <TabsList variant="line" className="w-full justify-start">
              {COLUMNS.map((column) => (
                <TabsTrigger key={column.id} value={column.id} className="flex-none">
                  {column.title}
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {ITEMS.filter((item) => item.column === column.id).length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div
            data-slot="roadmap-board"
            className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card/40 md:grid-cols-3 md:divide-x md:divide-border"
          >
            {COLUMNS.map((column) => {
              const items = sorted.filter((item) => item.column === column.id);
              return (
                <div
                  key={column.id}
                  data-slot="roadmap-column"
                  data-column={column.id}
                  className={cn('flex-col', activeColumn === column.id ? 'flex' : 'hidden md:flex')}
                >
                  <div
                    data-slot="roadmap-column-header"
                    className="flex flex-col gap-1 border-b border-border px-5 py-4"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{column.title}</h3>
                      <span className="text-xs tabular-nums text-muted-foreground">{items.length}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{column.meaning}</p>
                  </div>

                  <ul key={sort} className="flex flex-col divide-y divide-border">
                    {items.map((item, index) => {
                      const voted = votes.has(item.id);
                      return (
                        <li
                          key={item.id}
                          data-slot="roadmap-item"
                          style={stagger(index, 50)}
                          className={cn(SWAP, 'flex items-start gap-4 px-5 py-4')}
                        >
                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <h4 className="text-sm font-medium leading-snug">{item.title}</h4>
                              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                              <Badge variant="outline">{item.tag}</Badge>
                              {item.shipped ? (
                                <span className="inline-flex items-center gap-1 text-xs text-success">
                                  <Check aria-hidden className="size-3" />
                                  Shipped <span className="tabular-nums">{item.shipped}</span>
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Added <span className="tabular-nums">{formatAdded(item.added)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <Upvote
                            title={item.title}
                            count={item.votes + (voted ? 1 : 0)}
                            voted={voted}
                            onToggle={() => toggleVote(item.id)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <footer
          data-slot="roadmap-footer"
          className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Not on the board? Tell us what is missing and how you would use it.</span>
          <Button variant="link" className="group/suggest h-auto w-fit" render={<a href="#" />} nativeButton={false}>
            Suggest a feature
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-150 ease-out group-hover/suggest:translate-x-0.5 rtl:rotate-180 rtl:group-hover/suggest:-translate-x-0.5"
            />
          </Button>
        </footer>
      </div>
    </section>
  );
};

export default Changelog02;
