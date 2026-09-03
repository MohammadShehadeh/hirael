import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { notFound } from 'next/navigation';
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
  CATEGORY_LABELS,
  COMPONENTS,
  DEFAULT_BASE,
  REGISTRY_BASES,
  REGISTRY_BY_NAME,
  getExamples,
  registryFilePath,
  type RegistryBase,
} from '@/registry/hirael/registry-meta';
import registryProps from '@/registry/hirael/registry-props.json';

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENTS.map((entry) => ({
    category: entry.category,
    component: entry.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; component: string }>;
}): Promise<Metadata> {
  const { category, component } = await params;
  const entry = REGISTRY_BY_NAME[component];
  if (!entry || entry.category === 'blocks' || entry.category === 'templates' || entry.category !== category) return {};
  return detailMetadata(entry, { titleSuffix: 'component' });
}

/**
 * A component ships its install source at `<base>/components/<name>.tsx`
 * (what shadcn distributes) and one or more demos at
 * `<base>/examples/<slug>.tsx`. Returns each example with its pre-highlighted
 * source for the stacked preview/code blocks; the source is null when a file
 * is missing.
 */
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

export default async function ComponentRoute({ params }: { params: Promise<{ category: string; component: string }> }) {
  const { category, component } = await params;
  const entry = REGISTRY_BY_NAME[component];
  if (!entry || entry.category === 'blocks' || entry.category === 'templates' || entry.category !== category)
    notFound();
  const [sources, examples, extras] = await Promise.all([
    loadSources(entry.files?.map((f) => f.path)),
    loadExamples(entry.name),
    getDetailExtras(entry),
  ]);
  const api = (registryProps as Record<string, ApiPart[]>)[entry.name] ?? null;
  // Import statements are identical across bases; derive them once. The same
  // helper writes the Usage block into the generated Markdown, so the page and
  // the file an agent fetches show one import.
  const usageCode = buildUsageCode(entry.files, (file) => sources[DEFAULT_BASE][file]?.code, api);
  const usage = usageCode
    ? {
        code: usageCode,
        html: await highlightCode(usageCode, 'tsx'),
        lang: 'tsx',
      }
    : null;
  // Pre-highlight each prop's type and default as inline TS so the API table
  // gets the same VSCode token colors as the code blocks.
  const apiHighlighted = api
    ? await Promise.all(
        api.map(async (part) => ({
          ...part,
          props: await Promise.all(
            part.props.map(async (p) => ({
              ...p,
              typeHtml: await highlightInline(p.type, 'ts'),
              defaultHtml: p.default ? await highlightInline(p.default, 'ts') : null,
            })),
          ),
        })),
      )
    : null;
  const breadcrumb = [
    { label: 'Components', href: '/components' },
    { label: CATEGORY_LABELS[entry.category], href: `/components/${entry.category}` },
    { label: entry.title },
  ];
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
