import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { BlockPreview } from '@/components/block-preview';
import { DemoCard } from '@/components/demo-card';
import { NewBadge } from '@/components/new-badge';
import type { LatestCatalog } from '@/lib/detail-extras';
import type { DatedEntry } from '@/lib/freshness';
import { entryHref } from '@/registry/hirael/registry-meta';

const COLUMNS = [
  {
    kind: 'templates',
    title: 'Templates',
    href: '/templates',
    variant: 'frame',
  },
  {
    kind: 'blocks',
    title: 'Blocks',
    href: '/blocks',
    variant: 'frame',
  },
  {
    kind: 'components',
    title: 'Components',
    href: '/components',
    variant: 'demo',
  },
] as const;

/**
 * First-screen catalog: two live previews per collection, so templates, blocks
 * and components are all visible without leaving the landing page.
 */
export const LandingCatalog = ({ items }: { items: LatestCatalog }) => {
  return (
    <section aria-label="Latest from the catalog" className="pb-16 sm:pb-20">
      <div className="container grid w-full gap-10 lg:grid-cols-3 lg:gap-8">
        {COLUMNS.map((column) => (
          <CatalogColumn
            key={column.kind}
            title={column.title}
            href={column.href}
            items={items[column.kind]}
            variant={column.variant}
          />
        ))}
      </div>
    </section>
  );
};

const CatalogColumn = ({
  title,
  href,
  items,
  variant,
}: {
  title: string;
  href: string;
  items: DatedEntry[];
  variant: 'frame' | 'demo';
}) => {
  if (items.length === 0) return null;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium tracking-tight">{title}</h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) =>
          variant === 'demo' ? (
            <DemoCard key={item.entry.name} entry={item.entry} addedAt={item.addedAt} compact className="rounded-sm" />
          ) : (
            <FrameCard key={item.entry.name} item={item} />
          ),
        )}
      </div>
    </div>
  );
};

const FrameCard = ({ item }: { item: DatedEntry }) => {
  const { entry, addedAt } = item;

  return (
    <Link
      href={entryHref(entry)}
      className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background outline-none transition-colors hover:border-foreground/40 focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="aspect-video overflow-hidden border-b border-border">
        <BlockPreview entry={entry} fill />
      </div>
      <span className="flex items-center justify-between gap-2 px-4 py-3">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium tracking-[-0.01em]">{entry.title}</span>
          <NewBadge addedAt={addedAt} />
        </span>
        <ArrowUpRight
          className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 rtl:-scale-x-100"
          aria-hidden
        />
      </span>
    </Link>
  );
};
