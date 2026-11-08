import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { Metadata } from 'next';

import { ComponentPage } from '@/components/component-page';
import { EntryJsonLd } from '@/components/entry-json-ld';
import type { ApiPart, ExampleFile, ExampleSources } from '@/components/component-page';
import { exampleDependencies, forConsumer } from '@/lib/consumer-source';
import { highlightCode, highlightInline, langFromPath } from '@/lib/highlight';
import { getDetailExtras } from '@/lib/detail-extras';
import { buildUsageCode, installTarget } from '@/lib/registry-usage';
import { loadSources } from '@/lib/registry-source';
import { detailMetadata } from '@/lib/seo';
import {
  DEFAULT_BASE,
  REGISTRY_BASES,
  getExamples,
  registryFilePath,
  type RegistryBase,
  type RegistryEntryMeta,
  type RegistryFileMeta,
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

const readText = async (relPath: string): Promise<string | null> => {
  try {
    return await fs.readFile(path.join(process.cwd(), relPath), 'utf8');
  } catch {
    return null;
  }
};

const exampleFile = async (label: string, code: string): Promise<ExampleFile> => {
  const lang = langFromPath(label);
  const consumerCode = forConsumer(code);

  return { label, code: consumerCode, html: await highlightCode(consumerCode, lang), lang };
};

const loadRegistryFile = async (base: RegistryBase, file: RegistryFileMeta): Promise<ExampleFile | null> => {
  const code = await readText(registryFilePath(base, file.path));

  return code === null ? null : exampleFile(installTarget(file), code);
};

const loadSiteFile = async (file: string): Promise<ExampleFile | null> => {
  for (const relPath of [`${file}.tsx`, `${file}.ts`]) {
    const code = await readText(relPath);
    if (code !== null) return exampleFile(relPath, code);
  }

  return null;
};

/** The example, then every file it needs that installing the item doesn't bring: other Hirael items and site helpers. */
async function loadExampleFiles(base: RegistryBase, itemName: string, slug: string): Promise<ExampleFile[]> {
  const code = await readText(registryFilePath(base, `examples/${slug}.tsx`));
  if (code === null) return [];

  const { registryFiles, siteFiles } = exampleDependencies(code, itemName);
  const needed = await Promise.all([
    ...registryFiles.map((file) => loadRegistryFile(base, file)),
    ...siteFiles.map(loadSiteFile),
  ]);

  return [await exampleFile(`${slug}.tsx`, code), ...needed.filter((file): file is ExampleFile => file !== null)];
}

async function loadExamples(name: string): Promise<ExampleSources[]> {
  return Promise.all(
    getExamples(name).map(async ({ slug, title }) => {
      const entries = await Promise.all(
        REGISTRY_BASES.map(async (base) => [base, await loadExampleFiles(base, name, slug)] as const),
      );

      return {
        slug,
        title,
        // fromEntries types its keys as string; entries holds one per base.
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
export const RegistryItemDetail = async ({ entry, breadcrumb }: RegistryItemDetailProps) => {
  const [sources, examples, extras] = await Promise.all([
    loadSources(entry.files?.map((f) => f.path)),
    loadExamples(entry.name),
    getDetailExtras(entry),
  ]);
  // JSON imports widen every string; scripts/extract-props.mts writes these as ApiPart[].
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
};
