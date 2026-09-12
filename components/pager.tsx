import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { entryHref, entryPosition, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

export interface PagerProps {
  prev: RegistryEntryMeta | null;
  next: RegistryEntryMeta | null;
}

/**
 * Previous/next along the catalog order, set as a hairline-split strip in the same voice as the category index
 * (`02 / 10`, uppercase kicker, bare title). A missing side keeps its half so the other link stays put.
 */
export const Pager = ({ prev, next }: PagerProps) => {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Catalog" className="grid border-t border-border sm:grid-cols-2">
      <div className="sm:border-e sm:border-border sm:pe-8">{prev && <PagerLink entry={prev} direction="prev" />}</div>
      <div className={cn('sm:ps-8', prev && next && 'border-t border-border sm:border-t-0')}>
        {next && <PagerLink entry={next} direction="next" />}
      </div>
    </nav>
  );
};

interface PagerLinkProps {
  entry: RegistryEntryMeta;
  direction: 'prev' | 'next';
}

const PagerLink = ({ entry, direction }: PagerLinkProps) => {
  const isPrev = direction === 'prev';
  const { index, total } = entryPosition(entry);
  const arrow = isPrev ? (
    <ArrowLeft
      aria-hidden
      className="size-3.5 transition-transform duration-150 ease-out group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
    />
  ) : (
    <ArrowRight
      aria-hidden
      className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
    />
  );

  return (
    <Link
      href={entryHref(entry)}
      rel={direction}
      className={cn(
        'group flex flex-col gap-2 py-6 outline-none focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/50',
        isPrev ? 'items-start text-start' : 'items-end text-end',
      )}
    >
      <span className="flex items-center gap-x-2 text-xs uppercase text-muted-foreground">
        {isPrev && arrow}
        <span>{isPrev ? 'Previous' : 'Next'}</span>
        <span aria-hidden className="text-border">
          |
        </span>
        <span className="tabular-nums text-foreground">
          {String(index).padStart(2, '0')}
          <span className="text-muted-foreground/60"> / {String(total).padStart(2, '0')}</span>
        </span>
        {!isPrev && arrow}
      </span>
      <span className="text-xl font-semibold tracking-[-0.015em] text-foreground underline-offset-6 group-hover:underline sm:text-2xl">
        {entry.title}
      </span>
    </Link>
  );
};
