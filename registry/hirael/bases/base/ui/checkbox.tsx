'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({
  className,
  checked,
  indeterminate,
  ...props
}: Omit<CheckboxPrimitive.Root.Props, 'checked'> & {
  /** `"indeterminate"` is accepted for Radix compatibility and maps to `indeterminate`. */
  checked?: boolean | 'indeterminate';
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked === 'indeterminate' ? false : checked}
      indeterminate={indeterminate ?? checked === 'indeterminate'}
      className={cn(
        'peer inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-checked:bg-primary',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
