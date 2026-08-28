'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SegmentedControlItem {
  value: string;
  /** Visible content; pass a function to render against the active state. */
  label: React.ReactNode | ((active: boolean) => React.ReactNode);
  ariaLabel?: string;
  title?: string;
  /** Non-interactive item (e.g. a Code tab with no source). Still focusable
   * for arrow-key roving, but announces as disabled and ignores clicks. */
  disabled?: boolean;
}

/**
 * A compact pill strip — the shared shape behind the file tabs, viewport
 * switch, and package-manager picker. Roving tabindex + arrow-key navigation
 * (RTL-aware) come built in, so call sites only supply items and state.
 */
export const SegmentedControl = ({
  items,
  value,
  onValueChange,
  role = 'tab',
  ariaLabel,
  className,
  itemClassName,
}: {
  items: SegmentedControlItem[];
  value: string;
  onValueChange: (value: string) => void;
  /** "tab" renders a tablist; "radio" renders a radiogroup. */
  role?: 'tab' | 'radio';
  ariaLabel: string;
  className?: string;
  itemClassName?: string;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    // Mirror the arrow direction under RTL so focus follows visual order.
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const forward = e.key === 'ArrowRight' ? !rtl : rtl;
    const dir = forward ? 1 : -1;
    const i = items.findIndex((it) => it.value === value);
    if (i === -1) return;
    const next = items[(i + dir + items.length) % items.length];
    onValueChange(next.value);
    ref.current?.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus();
  };

  return (
    <div
      ref={ref}
      role={role === 'tab' ? 'tablist' : 'radiogroup'}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn('flex items-center gap-0.5', className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role={role}
            aria-selected={role === 'tab' ? active : undefined}
            aria-checked={role === 'radio' ? active : undefined}
            tabIndex={active ? 0 : -1}
            data-value={item.value}
            aria-label={item.ariaLabel}
            title={item.title}
            disabled={item.disabled}
            aria-disabled={item.disabled || undefined}
            onClick={() => onValueChange(item.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[11px] tracking-tight transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-40 disabled:hover:text-muted-foreground',
              active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground',
              itemClassName,
            )}
          >
            {typeof item.label === 'function' ? item.label(active) : item.label}
          </button>
        );
      })}
    </div>
  );
};
