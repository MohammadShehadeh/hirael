'use no memo';
'use client';

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { cn } from '@/lib/utils';

export interface VirtualListProps<Item> extends Omit<React.ComponentProps<'div'>, 'children'> {
  items: Item[];
  /** Renders one row. Rows may be any height; each is measured after it renders. */
  children: (item: Item, index: number) => React.ReactNode;
  /** Guess of a row's height in pixels, used until it is measured. */
  estimateSize?: number;
  /** Stable key per row. Defaults to the index. */
  getItemKey?: (item: Item, index: number) => string | number;
  /** Rows rendered beyond the visible ones in each direction. */
  overscan?: number;
  /** More rows exist after the last one. */
  hasMore?: boolean;
  /** A page is being fetched. Shows `loader` and holds back `onEndReached`. */
  loading?: boolean;
  /** Called when the reader nears the end and `hasMore` is set, to fetch the next page. */
  onEndReached?: () => void;
  /** How many rows before the end `onEndReached` fires. */
  endThreshold?: number;
  /** Row shown at the end while `loading`. */
  loader?: React.ReactNode;
  /** Shown when there are no items and nothing is loading. */
  empty?: React.ReactNode;
  /** Gap between rows, in pixels. */
  gap?: number;
}

const VirtualList = <Item,>({
  items,
  children,
  estimateSize = 48,
  getItemKey,
  overscan = 6,
  hasMore = false,
  loading = false,
  onEndReached,
  endThreshold = 5,
  loader,
  empty,
  gap = 0,
  className,
  ...props
}: VirtualListProps<Item>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const showLoader = loading && loader !== undefined;
  const count = items.length + (showLoader ? 1 : 0);

  // The file opts out of the React Compiler above, which is what this rule asks for.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateSize,
    overscan,
    gap,
    getItemKey: (index) => (index >= items.length ? '__loader' : getItemKey ? getItemKey(items[index], index) : index),
  });

  const virtualItems = virtualizer.getVirtualItems();
  const lastIndex = virtualItems.at(-1)?.index ?? -1;

  React.useEffect(() => {
    if (!onEndReached || !hasMore || loading || items.length === 0) return;
    if (lastIndex >= items.length - 1 - endThreshold) onEndReached();
  }, [lastIndex, items.length, hasMore, loading, onEndReached, endThreshold]);

  return (
    <div
      ref={scrollRef}
      data-slot="virtual-list"
      className={cn('relative overflow-y-auto overscroll-contain', className)}
      {...props}
    >
      {items.length === 0 && !loading ? (
        <div data-slot="virtual-list-empty">{empty}</div>
      ) : (
        <div role="list" className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
          {virtualItems.map((virtualItem) => {
            const isLoader = virtualItem.index >= items.length;

            return (
              <div
                key={virtualItem.key}
                ref={virtualizer.measureElement}
                data-index={virtualItem.index}
                role="listitem"
                aria-setsize={hasMore ? -1 : items.length}
                aria-posinset={virtualItem.index + 1}
                data-slot={isLoader ? 'virtual-list-loader' : 'virtual-list-item'}
                className="absolute inset-x-0 top-0"
                style={{ transform: `translateY(${virtualItem.start}px)` }}
              >
                {isLoader ? loader : children(items[virtualItem.index], virtualItem.index)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { VirtualList };
