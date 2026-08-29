import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NewBadge } from '@/components/new-badge';
import { formatDay, type DatedEntry } from '@/lib/freshness';
import { BLOCK_KIND_LABELS, CATEGORY_LABELS, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

const collectionLabel = (entry: RegistryEntryMeta) => {
  if (entry.blockKind) return BLOCK_KIND_LABELS[entry.blockKind];
  if (entry.category === 'templates') return 'Template';
  return CATEGORY_LABELS[entry.category];
};

/**
 * A row of catalog cards. Used for the cross-links at the foot of a detail
 * page, where the pager beside it walks the catalog in order and this walks it
 * by kinship so a page is a fork in the path rather than a dead end, and for
 * the landing page's recently-added rail.
 */
export const ItemCards = ({
  items,
  withDate,
  className,
}: {
  items: DatedEntry[];
  /** Show when each item shipped. For lists whose whole point is recency. */
  withDate?: boolean;
  className?: string;
}) => {
  if (items.length === 0) return null;

  return (
    <div className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map(({ entry, addedAt }) => (
        <Link
          key={entry.name}
          href={entryHref(entry)}
          className="group flex flex-col gap-1.5 rounded-md border border-border bg-card/40 p-4 transition-colors hover:bg-accent"
        >
          <span className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium tracking-[-0.01em] text-foreground">{entry.title}</span>
              <NewBadge addedAt={addedAt} />
            </span>
            <ArrowUpRight
              className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100"
              aria-hidden
            />
          </span>

          <span className="flex flex-wrap items-center gap-x-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {collectionLabel(entry)}
            {withDate && addedAt && <time dateTime={addedAt}>{formatDay(addedAt)}</time>}
          </span>

          <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{entry.description}</span>
        </Link>
      ))}
    </div>
  );
};
