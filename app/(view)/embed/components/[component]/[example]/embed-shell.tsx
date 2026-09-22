import type { ReactNode } from 'react';

import { EmbedDirection } from '../../../embed-direction';

export interface ExampleEmbedShellProps {
  children: ReactNode;
}

// The docs frame measures the outer shell, so the minimum height sits on the inner box.
export const ExampleEmbedShell = ({ children }: ExampleEmbedShellProps) => {
  return (
    <div data-embed-shell className="bg-background">
      <div className="bg-dot-grid flex min-h-90 items-center justify-center px-8 py-6 sm:min-h-105 sm:px-12 sm:py-8 md:px-16 md:py-10 [html:not([data-framed])_&]:min-h-svh">
        <EmbedDirection>{children}</EmbedDirection>
      </div>
    </div>
  );
};
