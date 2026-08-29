'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { newBadgeRemainingMs } from '@/lib/freshness';

/**
 * "New" marker for items added inside the freshness window.
 *
 * The ship date comes from the release that lists the item in the changelog;
 * an item no release claims renders nothing.
 *
 * Whether that date is still recent is a clock read, and these pages are
 * statically exported and cached indefinitely, so deciding at build time would
 * freeze the badge onto items that have long since aged out. The clock is
 * therefore an external store: the server snapshot is always `false`, the
 * client resolves it on hydration, and the subscription fires once at expiry so
 * a page left open drops the badge in place rather than going stale.
 */
export const NewBadge = ({ addedAt, className }: { addedAt?: string; className?: string }) => {
  const visible = React.useSyncExternalStore(
    (onExpire) => {
      const remaining = newBadgeRemainingMs(addedAt);
      if (remaining <= 0) return () => {};
      const timer = setTimeout(onExpire, remaining);
      return () => clearTimeout(timer);
    },
    () => newBadgeRemainingMs(addedAt) > 0,
    () => false,
  );

  if (!visible) return null;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border border-warm/45 bg-warm/12 px-1.5 py-0.5 font-mono text-[9px] uppercase leading-none tracking-[0.14em] text-foreground',
        className,
      )}
    >
      New
    </span>
  );
};
