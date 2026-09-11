import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { embedDirScript } from '@/lib/embed';
import { embedMetadata } from '@/lib/seo';
import { RegistryDemo } from '@/registry/hirael/registry-demos';
import {
  DEFAULT_BASE,
  REGISTRY,
  REGISTRY_BASES,
  REGISTRY_BY_NAME,
  entryCategorySlug,
  type RegistryBase,
} from '@/registry/hirael/registry-meta';

import { BlockEmbedShell } from './blocks/[category]/[block]/embed-shell';
import { TemplateEmbedShell } from './templates/[template]/embed-shell';

export const blockEmbedParams = () =>
  REGISTRY.filter((entry) => entry.category === 'blocks').map((entry) => ({
    category: entryCategorySlug(entry),
    block: entry.name,
  }));

export const templateEmbedParams = () =>
  REGISTRY.filter((entry) => entry.category === 'templates').map((entry) => ({
    template: entry.name,
  }));

export const nestedEmbedBases = (): RegistryBase[] => REGISTRY_BASES.filter((base) => base !== DEFAULT_BASE);

export interface BlockEmbedMetadataProps {
  params: Promise<{ block: string }>;
}

export const blockEmbedMetadata = async ({ params }: BlockEmbedMetadataProps): Promise<Metadata> => {
  const { block } = await params;
  return embedMetadata(`${REGISTRY_BY_NAME[block]?.title ?? 'Block'} preview`);
};

export interface TemplateEmbedMetadataProps {
  params: Promise<{ template: string }>;
}

export const templateEmbedMetadata = async ({ params }: TemplateEmbedMetadataProps): Promise<Metadata> => {
  const { template } = await params;
  return embedMetadata(`${REGISTRY_BY_NAME[template]?.title ?? 'Template'} preview`);
};

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
        <RegistryDemo name={entry.name} base={base} />
      </BlockEmbedShell>
    </>
  );
};

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
        <RegistryDemo name={entry.name} base={base} />
      </TemplateEmbedShell>
    </>
  );
};
