'use client';

import * as React from 'react';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

import { CATEGORY_BY_SLUG } from '@/components/block-categories';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { BLOCKS_BY_KIND, entryCategorySlug, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

export interface BlockSiblingsProps {
  entry: RegistryEntryMeta;
}

/** Every block in the entry's category, so switching between them doesn't need a trip back to the grid. */
export const BlockSiblings = ({ entry }: BlockSiblingsProps) => {
  const currentRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [entry.name]);

  if (entry.category !== 'blocks' || !entry.blockKind) return null;
  const siblings = BLOCKS_BY_KIND[entry.blockKind];
  if (siblings.length < 2) return null;

  const slug = entryCategorySlug(entry);
  const categoryTitle = CATEGORY_BY_SLUG[slug]?.title ?? slug;
  const index = siblings.findIndex((sibling) => sibling.name === entry.name) + 1;

  return (
    <nav aria-label={`${categoryTitle} blocks`} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-x-2 text-xs text-muted-foreground uppercase">
          <span>{categoryTitle}</span>
          <span aria-hidden className="text-border">
            |
          </span>
          <span className="text-foreground tabular-nums">
            {String(index).padStart(2, '0')}
            <span className="text-muted-foreground/60"> / {String(siblings.length).padStart(2, '0')}</span>
          </span>
        </p>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/blocks/${slug}`}>
            <LayoutGrid />
            View all
          </Link>
        </Button>
      </div>

      <ul className="-mx-1 flex snap-x [scrollbar-width:none] gap-1.5 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
        {siblings.map((sibling) => {
          const isCurrent = sibling.name === entry.name;

          return (
            <li key={sibling.name} className="shrink-0 snap-start">
              <Button asChild variant={isCurrent ? 'secondary' : 'outline'} size="sm">
                <Link
                  ref={isCurrent ? currentRef : undefined}
                  href={entryHref(sibling)}
                  aria-current={isCurrent ? 'page' : undefined}
                  title={sibling.blockTagline ?? sibling.description}
                >
                  {sibling.title}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
