'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SegmentedControlItem {
  value: string;
  label: React.ReactNode | ((isActive: boolean) => React.ReactNode);
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  items: SegmentedControlItem[];
  value: string;
  onValueChange: (value: string) => void;
  role?: 'tab' | 'radio';
  ariaLabel: string;
  className?: string;
  itemClassName?: string;
}

export const SegmentedControl = ({
  items,
  value,
  onValueChange,
  role = 'tab',
  ariaLabel,
  className,
  itemClassName,
}: SegmentedControlProps) => {
  const listRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const isForward = event.key === 'ArrowRight' ? !isRtl : isRtl;
    const step = isForward ? 1 : -1;
    const activeIndex = items.findIndex((item) => item.value === value);
    if (activeIndex === -1) return;
    const nextItem = items[(activeIndex + step + items.length) % items.length];
    onValueChange(nextItem.value);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-value="${nextItem.value}"]`)?.focus();
  };

  return (
    <div
      ref={listRef}
      role={role === 'tab' ? 'tablist' : 'radiogroup'}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn('flex items-center gap-0.5', className)}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role={role}
            aria-selected={role === 'tab' ? isActive : undefined}
            aria-checked={role === 'radio' ? isActive : undefined}
            tabIndex={isActive ? 0 : -1}
            data-value={item.value}
            aria-label={item.ariaLabel}
            title={item.title}
            disabled={item.disabled}
            aria-disabled={item.disabled || undefined}
            onClick={() => onValueChange(item.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[11px] tracking-tight transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-40 disabled:hover:text-muted-foreground',
              isActive ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground',
              itemClassName,
            )}
          >
            {typeof item.label === 'function' ? item.label(isActive) : item.label}
          </button>
        );
      })}
    </div>
  );
};
