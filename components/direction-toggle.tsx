'use client';

import { cn } from '@/lib/utils';

export interface DirectionToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  className?: string;
}

export const DirectionToggle = ({ pressed, onPressedChange, className }: DirectionToggleProps) => {
  return (
    <button
      type="button"
      data-slot="direction-toggle"
      data-state={pressed ? 'on' : 'off'}
      aria-pressed={pressed}
      aria-label="Toggle right-to-left preview"
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        'inline-flex h-6 items-center rounded-sm border border-border bg-background px-2 text-xs uppercase text-muted-foreground transition-colors hover:text-foreground data-[state=on]:bg-accent data-[state=on]:text-foreground',
        className,
      )}
    >
      RTL
    </button>
  );
};
