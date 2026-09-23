'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { newBadgeRemainingMs } from '@/lib/freshness';

export interface NewBadgeProps {
  addedAt?: string;
  className?: string;
}

/** Static pages cannot know the current time, so the badge is decided in the browser and hidden until hydration. */
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
        'inline-flex shrink-0 items-center rounded-full border border-warm/45 bg-warm/12 px-1.5 py-0.5 text-[10px] leading-none text-foreground uppercase',
        className,
      )}
    >
      New
    </span>
  );
};
