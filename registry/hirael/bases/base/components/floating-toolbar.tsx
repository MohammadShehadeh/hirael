'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const BUTTON_SELECTOR = '[data-slot="floating-toolbar-button"]:not(:disabled)';

export type FloatingToolbarProps = React.ComponentProps<'div'>;

const FloatingToolbar = ({ className, onKeyDown, ...props }: FloatingToolbarProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(BUTTON_SELECTOR));
    const current = items.indexOf(document.activeElement as HTMLElement);
    // Focus may sit on something else the consumer put in the toolbar, like an input that needs its own arrow keys.
    if (current === -1) return;

    let index: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft': {
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        index = current + ((event.key === 'ArrowRight') !== rtl ? 1 : -1);
        break;
      }
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = -1;
        break;
      default:
        return;
    }

    event.preventDefault();
    items.at(index % items.length)?.focus();
  };

  return (
    <div
      role="toolbar"
      data-slot="floating-toolbar"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-border bg-popover/95 p-1 text-popover-foreground shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/80',
        className,
      )}
      {...props}
      onKeyDown={handleKeyDown}
    />
  );
};

export interface FloatingToolbarButtonProps extends React.ComponentProps<'button'> {
  /** Marks the button as a toggle and renders it pressed. Leave unset for a plain action. */
  active?: boolean;
}

const FloatingToolbarButton = ({ className, active, ...props }: FloatingToolbarButtonProps) => {
  return (
    <button
      type="button"
      data-slot="floating-toolbar-button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-pressed:bg-accent aria-pressed:text-foreground [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
};

export type FloatingToolbarSeparatorProps = React.ComponentProps<'div'>;

const FloatingToolbarSeparator = ({ className, ...props }: FloatingToolbarSeparatorProps) => {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      data-slot="floating-toolbar-separator"
      className={cn('mx-0.5 h-5 w-px shrink-0 bg-border', className)}
      {...props}
    />
  );
};

export type FloatingToolbarLabelProps = React.ComponentProps<'span'>;

const FloatingToolbarLabel = ({ className, ...props }: FloatingToolbarLabelProps) => {
  return (
    <span
      data-slot="floating-toolbar-label"
      className={cn('px-2 text-xs text-muted-foreground uppercase', className)}
      {...props}
    />
  );
};

export { FloatingToolbar, FloatingToolbarButton, FloatingToolbarSeparator, FloatingToolbarLabel };
