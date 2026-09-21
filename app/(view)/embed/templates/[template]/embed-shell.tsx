import type { ReactNode } from 'react';

import { EmbedDirection } from '../../embed-direction';

export interface TemplateEmbedShellProps {
  children: ReactNode;
}

export const TemplateEmbedShell = ({ children }: TemplateEmbedShellProps) => {
  return (
    <div data-embed-shell className="min-h-svh bg-black">
      <EmbedDirection>{children}</EmbedDirection>
    </div>
  );
};
