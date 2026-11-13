'use client';

import type * as React from 'react';

import { Kbd } from '@/registry/hirael/bases/radix/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/hirael/bases/radix/ui/tooltip';

export interface HintProps {
  label: React.ReactNode;
  /** Keys shown after the label, e.g. `⌘K`. */
  shortcut?: string;
  side?: React.ComponentProps<typeof TooltipContent>['side'];
  /** A single element that accepts a ref, usually a Button. */
  children: React.ReactElement;
}

export const Hint = ({ label, shortcut, side = 'bottom', children }: HintProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <span className="inline-flex items-center gap-2">
          {label}
          {shortcut && <Kbd>{shortcut}</Kbd>}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
