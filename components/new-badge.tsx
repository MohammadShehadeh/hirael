'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { newBadgeRemainingMs } from '@/lib/freshness';

export interface NewBadgeProps {
  addedAt?: string;
  className?: string;
}

// Pages are statically exported and cached indefinitely, so freshness must be decided in the browser, not at build time.
// The clock is read as an external store: the server snapshot is false, the client resolves it on hydration, and the subscription fires once at expiry.
export const NewBadge = ({ addedAt, className }: NewBadgeProps) => {
  const isVisible = React.useSyncExternalStore(
    (onExpire) => {
      const remaining = newBadgeRemainingMs(addedAt);
      if (remaining <= 0) return () => {};
      const timer = setTimeout(onExpire, remaining);
      return () => clearTimeout(timer);
    },
    () => newBadgeRemainingMs(addedAt) > 0,
    () => false,
  );

  if (!isVisible) return null;

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
