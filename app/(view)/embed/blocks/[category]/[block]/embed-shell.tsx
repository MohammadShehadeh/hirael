import type { ReactNode } from 'react';
import Link from 'next/link';

import { EmbedDirection } from '../../../embed-direction';

// Safe Browsing flagged the login demos (real forms on a public URL) as phishing without the
// notice. It stays visible on a direct visit and hides inside the docs frame.
export interface BlockEmbedShellProps {
  children: ReactNode;
  hasDemoNotice?: boolean;
}

export const BlockEmbedShell = ({ children, hasDemoNotice = false }: BlockEmbedShellProps) => {
  return (
    <div data-embed-shell className="min-h-svh bg-background">
      {hasDemoNotice && (
        <div
          role="note"
          className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card px-4 py-2 text-center text-xs text-muted-foreground [[data-framed]_&]:hidden"
        >
          Demo from the{' '}
          <Link href="/" target="_top" className="font-medium text-foreground underline-offset-4 hover:underline">
            Hirael
          </Link>{' '}
          component library. This form doesn&apos;t submit; don&apos;t enter real credentials.
        </div>
      )}
      <EmbedDirection>{children}</EmbedDirection>
    </div>
  );
};
