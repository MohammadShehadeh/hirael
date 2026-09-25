import type { Metadata } from 'next';

import { embedMetadata } from '@/lib/seo';
import {
  COMPONENTS,
  DEFAULT_BASE,
  REGISTRY,
  REGISTRY_BASES,
  REGISTRY_BY_NAME,
  entryCategorySlug,
  getExamples,
  type RegistryBase,
} from '@/registry/hirael/registry-meta';

export const blockEmbedParams = () =>
  REGISTRY.filter((entry) => entry.category === 'blocks').map((entry) => ({
    category: entryCategorySlug(entry),
    block: entry.name,
  }));

export const templateEmbedParams = () =>
  REGISTRY.filter((entry) => entry.category === 'templates').map((entry) => ({
    template: entry.name,
  }));

export const exampleEmbedParams = () =>
  COMPONENTS.flatMap((entry) =>
    getExamples(entry.name).map((example) => ({ component: entry.name, example: example.slug })),
  );

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

export interface ExampleEmbedMetadataProps {
  params: Promise<{ component: string; example: string }>;
}

export const exampleEmbedMetadata = async ({ params }: ExampleEmbedMetadataProps): Promise<Metadata> => {
  const { component, example } = await params;
  const entry = REGISTRY_BY_NAME[component];
  const ref = entry ? getExamples(entry.name).find((e) => e.slug === example) : undefined;
  const title = entry && ref ? `${entry.title} ${ref.title.toLowerCase()}` : 'Component';

  return embedMetadata(`${title} preview`);
};
