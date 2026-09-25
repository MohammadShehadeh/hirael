import { notFound } from 'next/navigation';

import { embedDirScript } from '@/lib/embed';
import { REGISTRY_BY_NAME, type RegistryBase } from '@/registry/hirael/registry-meta';
import { RegistryTemplate } from '@/registry/hirael/registry-template-demo';

import { TemplateEmbedShell } from './templates/[template]/embed-shell';

export interface TemplateEmbedProps {
  base: RegistryBase;
  template: string;
}

export const TemplateEmbed = ({ base, template }: TemplateEmbedProps) => {
  const entry = REGISTRY_BY_NAME[template];
  if (!entry || entry.category !== 'templates') notFound();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: embedDirScript() }} />
      <TemplateEmbedShell>
        <RegistryTemplate name={entry.name} base={base} />
      </TemplateEmbedShell>
    </>
  );
};
