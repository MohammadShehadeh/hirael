import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { BLOCK_KIND_LABELS, CATEGORY_LABELS, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

export interface PagerProps {
  prev: RegistryEntryMeta | null;
  next: RegistryEntryMeta | null;
}

export const Pager = ({ prev, next }: PagerProps) => {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Catalog" className="flex items-stretch justify-between gap-3 border-t border-border pt-6">
      {prev ? <PagerLink entry={prev} direction="prev" /> : <span aria-hidden />}
      {next ? <PagerLink entry={next} direction="next" /> : <span aria-hidden />}
    </nav>
  );
};

interface PagerLinkProps {
  entry: RegistryEntryMeta;
  direction: 'prev' | 'next';
}

const PagerLink = ({ entry, direction }: PagerLinkProps) => {
  const isPrev = direction === 'prev';
  const Chevron = isPrev ? ChevronLeft : ChevronRight;
  const chevron = <Chevron className="size-3.5 shrink-0 rtl:rotate-180" aria-hidden />;

  return (
    <Link
      href={entryHref(entry)}
      rel={isPrev ? 'prev' : 'next'}
      className={cn(
        'group flex max-w-[48%] flex-col gap-1 rounded-md border border-border bg-card/40 px-4 py-3 transition-colors hover:bg-accent',
        isPrev ? 'items-start text-start' : 'items-end text-end',
      )}
    >
      <span className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
        {isPrev && chevron}
        {isPrev ? 'Previous' : 'Next'}
        {!isPrev && chevron}
      </span>
      <span className="truncate text-sm font-medium tracking-[-0.01em] text-foreground">{entry.title}</span>
      <span className="truncate text-[11px] text-muted-foreground">{collectionLabel(entry)}</span>
    </Link>
  );
};

const collectionLabel = (entry: RegistryEntryMeta) => {
  if (entry.blockKind) return `${BLOCK_KIND_LABELS[entry.blockKind]} blocks`;
  if (entry.category === 'templates') return 'Template';
  return CATEGORY_LABELS[entry.category];
};
