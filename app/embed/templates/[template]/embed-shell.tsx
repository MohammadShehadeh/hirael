import type { ReactNode } from 'react';

export interface TemplateEmbedShellProps {
  children: ReactNode;
}

export const TemplateEmbedShell = ({ children }: TemplateEmbedShellProps) => {
  return (
    <div data-embed-shell className="min-h-svh bg-black">
      {children}
    </div>
  );
};
