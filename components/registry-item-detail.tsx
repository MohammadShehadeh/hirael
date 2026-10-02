import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { Metadata } from 'next';

import { ComponentPage } from '@/components/component-page';
import { EntryJsonLd } from '@/components/entry-json-ld';
import type { ApiPart, ExampleSources, SourceFile } from '@/components/component-page';
import { highlightCode, highlightInline, langFromPath } from '@/lib/highlight';
import { getDetailExtras } from '@/lib/detail-extras';
import { buildUsageCode } from '@/lib/registry-usage';
import { loadSources } from '@/lib/registry-source';
import { detailMetadata } from '@/lib/seo';
import {
  DEFAULT_BASE,
  REGISTRY_BASES,
  getExamples,
  registryFilePath,
  type RegistryBase,
  type RegistryEntryMeta,
} from '@/registry/hirael/registry-meta';
import registryProps from '@/registry/hirael/registry-props.json';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const titleSuffixFor = (entry: RegistryEntryMeta) =>
  entry.category !== 'utilities' ? 'component' : entry.name.startsWith('use-') ? 'hook' : 'utility';

export const registryItemMetadata = (entry: RegistryEntryMeta): Metadata =>
  detailMetadata(entry, { titleSuffix: titleSuffixFor(entry) });

async function loadExampleSource(base: RegistryBase, slug: string): Promise<SourceFile | null> {
  const relPath = registryFilePath(base, `examples/${slug}.tsx`);
  try {
    const code = await fs.readFile(path.join(process.cwd(), relPath), 'utf8');
    const lang = langFromPath(relPath);

    return { code, html: await highlightCode(code, lang), lang };
  } catch {
    return null;
  }
}

async function loadExamples(name: string): Promise<ExampleSources[]> {
  return Promise.all(
    getExamples(name).map(async ({ slug, title }) => {
      const entries = await Promise.all(
        REGISTRY_BASES.map(async (base) => [base, await loadExampleSource(base, slug)] as const),
      );

      return {
        slug,
        title,
        sources: Object.fromEntries(entries) as ExampleSources['sources'],
      };
    }),
  );
}

export interface RegistryItemDetailProps {
  entry: RegistryEntryMeta;
  breadcrumb: BreadcrumbItem[];
}

/** The detail page shared by components and hooks & utilities. */
export async function RegistryItemDetail({ entry, breadcrumb }: RegistryItemDetailProps) {
  const [sources, examples, extras] = await Promise.all([
    loadSources(entry.files?.map((f) => f.path)),
    loadExamples(entry.name),
    getDetailExtras(entry),
  ]);
  const api = (registryProps as Record<string, ApiPart[]>)[entry.name] ?? null;
  const usageCode = buildUsageCode(entry.files, (file) => sources[DEFAULT_BASE][file]?.code, api);
  const usage = usageCode
    ? {
        code: usageCode,
        html: await highlightCode(usageCode, 'tsx'),
        lang: 'tsx',
      }
    : null;
  const apiHighlighted = api
    ? await Promise.all(
        api.map(async (part) => ({
          ...part,
          props: await Promise.all(
            part.props.map(async (prop) => ({
              ...prop,
              typeHtml: await highlightInline(prop.type, 'ts'),
              defaultHtml: prop.default ? await highlightInline(prop.default, 'ts') : null,
            })),
          ),
          returnsHtml: part.returns ? await highlightInline(part.returns, 'ts') : null,
        })),
      )
    : null;

  return (
    <>
      <EntryJsonLd entry={entry} breadcrumb={breadcrumb} addedAt={extras.addedAt} />
      <ComponentPage
        entry={entry}
        sources={sources}
        examples={examples}
        api={apiHighlighted}
        usage={usage}
        breadcrumb={breadcrumb}
        extras={extras}
      />
    </>
  );
}
