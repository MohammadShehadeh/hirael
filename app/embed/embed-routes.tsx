import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { embedDirScript } from '@/lib/embed';
import { embedMetadata } from '@/lib/seo';
import { RegistryDemo, RegistryExample } from '@/registry/hirael/registry-demos';
import {
  DEFAULT_BASE,
  REGISTRY,
  REGISTRY_BASES,
  REGISTRY_BY_NAME,
  entryCategorySlug,
  getExamples,
  type RegistryBase,
  type RegistryEntryMeta,
} from '@/registry/hirael/registry-meta';

import { BlockEmbedShell } from './blocks/[category]/[block]/embed-shell';
import { ExampleEmbedShell } from './components/[component]/[example]/embed-shell';
import { TemplateEmbedShell } from './templates/[template]/embed-shell';

const isComponentEntry = (entry: RegistryEntryMeta) => entry.category !== 'blocks' && entry.category !== 'templates';

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
  REGISTRY.filter(isComponentEntry).flatMap((entry) =>
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
