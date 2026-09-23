'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type FloatingToolbarProps = React.ComponentProps<'div'>;

const FloatingToolbar = ({ className, onKeyDown, ...props }: FloatingToolbarProps) => {
  return (
    <div
      role="toolbar"
      data-slot="floating-toolbar"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>('[data-slot="floating-toolbar-button"]:not(:disabled)'),
        );
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (index === -1) return;
        event.preventDefault();
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        let delta = event.key === 'ArrowRight' ? 1 : -1;
        if (rtl) delta = -delta;
        items[(index + delta + items.length) % items.length]?.focus();
      }}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-border bg-popover/95 p-1 text-popover-foreground shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/80',
        className,
      )}
      {...props}
    />
  );
};

export interface FloatingToolbarButtonProps extends React.ComponentProps<'button'> {
  active?: boolean;
}

const FloatingToolbarButton = ({ className, active, ...props }: FloatingToolbarButtonProps) => {
  return (
    <button
      type="button"
      data-slot="floating-toolbar-button"
      data-active={active ? '' : undefined}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[active]:bg-accent data-[active]:text-foreground [&_svg]:size-4',
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
      aria-hidden
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
