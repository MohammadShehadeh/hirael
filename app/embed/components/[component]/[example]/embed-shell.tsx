import type { ReactNode } from 'react';

import { EmbedDirection } from '../../../embed-direction';

export interface ExampleEmbedShellProps {
  children: ReactNode;
}

/**
 * The frame sizes to `[data-embed-shell]`, so the floor lives on the inner box where `?fit=1` can't zero it: the
 * demo is centered in the same min-height the inline example used, and fills the viewport on a direct visit.
 */
export const ExampleEmbedShell = ({ children }: ExampleEmbedShellProps) => {
  return (
    <div data-embed-shell className="bg-background">
      <div className="bg-dot-grid flex min-h-90 items-center justify-center px-8 py-6 sm:min-h-105 sm:px-12 sm:py-8 md:px-16 md:py-10 [html:not([data-framed])_&]:min-h-svh">
        <EmbedDirection>{children}</EmbedDirection>
      </div>
    </div>
  );
};
