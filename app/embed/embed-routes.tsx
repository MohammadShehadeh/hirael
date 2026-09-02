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

/**
 * Shared bodies for the framed `/embed/*` previews. The default base keeps
 * the original `/embed/blocks/...` and `/embed/templates/...` paths; every
 * other base nests under `/embed/<base>/...` so a page can frame the tree the
 * Customizer selected. All four routes are static (`dynamicParams = false`).
 */
export const blockEmbedParams = () =>
  REGISTRY.filter((entry) => entry.category === 'blocks').map((entry) => ({
    category: entryCategorySlug(entry),
    block: entry.name,
  }));

export const templateEmbedParams = () =>
  REGISTRY.filter((entry) => entry.category === 'templates').map((entry) => ({
    template: entry.name,
  }));

/** Bases that get their own `/embed/<base>/` tree. */
export const nestedEmbedBases = (): RegistryBase[] => REGISTRY_BASES.filter((base) => base !== DEFAULT_BASE);

/**
 * Titles for the framed previews. Without them every embed inherits the root
 * layout's, so ~300 frames all claim to be the home page.
 */
export const blockEmbedMetadata = async ({ params }: { params: Promise<{ block: string }> }): Promise<Metadata> => {
  const { block } = await params;
  return embedMetadata(`${REGISTRY_BY_NAME[block]?.title ?? 'Block'} preview`);
};

export const templateEmbedMetadata = async ({
  params,
}: {
  params: Promise<{ template: string }>;
}): Promise<Metadata> => {
  const { template } = await params;
  return embedMetadata(`${REGISTRY_BY_NAME[template]?.title ?? 'Template'} preview`);
};

export const BlockEmbed = ({ base, category, block }: { base: RegistryBase; category: string; block: string }) => {
  const entry = REGISTRY_BY_NAME[block];
  if (!entry || entry.category !== 'blocks' || entryCategorySlug(entry) !== category) notFound();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: embedDirScript() }} />
      <BlockEmbedShell demoNotice={entry.blockKind === 'login'}>
        <RegistryDemo name={entry.name} base={base} />
      </BlockEmbedShell>
    </>
  );
};

export const TemplateEmbed = ({ base, template }: { base: RegistryBase; template: string }) => {
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
