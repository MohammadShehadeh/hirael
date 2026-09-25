import { notFound } from 'next/navigation';

import { embedDirScript } from '@/lib/embed';
import { RegistryExample } from '@/registry/hirael/registry-demos';
import { REGISTRY_BY_NAME, getExamples, isComponentEntry, type RegistryBase } from '@/registry/hirael/registry-meta';

import { ExampleEmbedShell } from './components/[component]/[example]/embed-shell';

export interface ExampleEmbedProps {
  base: RegistryBase;
  component: string;
  example: string;
}

export const ExampleEmbed = ({ base, component, example }: ExampleEmbedProps) => {
  const entry = REGISTRY_BY_NAME[component];
  if (!entry || !isComponentEntry(entry) || !getExamples(entry.name).some((e) => e.slug === example)) notFound();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: embedDirScript() }} />
      <ExampleEmbedShell>
        <RegistryExample name={example} base={base} />
      </ExampleEmbedShell>
    </>
  );
};
