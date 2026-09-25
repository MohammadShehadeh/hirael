import { notFound } from 'next/navigation';

import { embedDirScript } from '@/lib/embed';
import { RegistryBlock } from '@/registry/hirael/registry-block-demo';
import { REGISTRY_BY_NAME, entryCategorySlug, type RegistryBase } from '@/registry/hirael/registry-meta';

import { BlockEmbedShell } from './blocks/[category]/[block]/embed-shell';

export interface BlockEmbedProps {
  base: RegistryBase;
  category: string;
  block: string;
}

export const BlockEmbed = ({ base, category, block }: BlockEmbedProps) => {
  const entry = REGISTRY_BY_NAME[block];
  if (!entry || entry.category !== 'blocks' || entryCategorySlug(entry) !== category) notFound();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: embedDirScript() }} />
      <BlockEmbedShell hasDemoNotice={entry.blockKind === 'login'}>
        <RegistryBlock name={entry.name} base={base} />
      </BlockEmbedShell>
    </>
  );
};
