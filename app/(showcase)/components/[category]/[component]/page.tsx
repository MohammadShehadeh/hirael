import * as fs from "node:fs/promises";
import * as path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ComponentPage } from "@/components/showcase/component-page";
import type {
  ApiPart,
  ExampleEntry,
  SourceFile,
} from "@/components/showcase/component-page";
import { highlightCode, langFromPath } from "@/lib/highlight";
import { SITE } from "@/lib/site";
import {
  CATEGORY_LABELS,
  COMPONENTS,
  REGISTRY_BY_NAME,
  entryHref,
  getExamples,
} from "@/registry/hirael/registry-meta";
import registryProps from "@/registry/hirael/registry-props.json";

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
  if (
    !entry ||
    entry.category === "blocks" ||
    entry.category === "templates" ||
    entry.category !== category
  )
    return {};
  const href = entryHref(entry);
  const url = `${SITE.url}${href}`;
  const title = `${entry.title} | ${SITE.name}`;
  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: href,
    },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.name,
      title,
      description: entry.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: entry.description,
      images: ["/opengraph-image"],
    },
  };
}

async function loadSource(
  files: string[] | undefined,
): Promise<Record<string, SourceFile>> {
  const out: Record<string, SourceFile> = {};
  if (!files) return out;
  await Promise.all(
    files.map(async (f) => {
      const abs = path.join(process.cwd(), f);
      let code: string;
      try {
        code = await fs.readFile(abs, "utf8");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // Surface the real reason — silently rendering the stub made it
        // very hard to tell whether the path was wrong, the file was
        // missing, or the deploy bundle didn't include it.
        console.error(`[loadSource] could not read ${abs}: ${msg}`);
        code = `// (unable to read source: ${msg})`;
      }
      const lang = langFromPath(f);
      const html = await highlightCode(code, lang);
      out[f] = { code, html, lang };
    }),
  );
  return out;
}

/**
 * A component ships its install source at `registry/hirael/ui/<name>.tsx`
 * (what shadcn distributes) and one or more demos at
 * `registry/hirael/examples/<slug>.tsx`. Returns each example with its
 * pre-highlighted source for the stacked preview/code blocks; the source is
 * null when a file is missing.
 */
async function loadExamples(name: string): Promise<ExampleEntry[]> {
  return Promise.all(
    getExamples(name).map(async ({ slug, title }) => {
      const relPath = `registry/hirael/examples/${slug}.tsx`;
      const abs = path.join(process.cwd(), relPath);
      let source: SourceFile | null = null;
      try {
        const code = await fs.readFile(abs, "utf8");
        const lang = langFromPath(relPath);
        source = { code, html: await highlightCode(code, lang), lang };
      } catch {
        source = null;
      }
      return { slug, title, source };
    }),
  );
}

export default async function ComponentRoute({
  params,
}: {
  params: Promise<{ category: string; component: string }>;
}) {
  const { category, component } = await params;
  const entry = REGISTRY_BY_NAME[component];
  if (
    !entry ||
    entry.category === "blocks" ||
    entry.category === "templates" ||
    entry.category !== category
  )
    notFound();
  const [source, examples] = await Promise.all([
    loadSource(entry.files?.map((f) => f.path)),
    loadExamples(entry.name),
  ]);
  const api = (registryProps as Record<string, ApiPart[]>)[entry.name] ?? null;
  return (
    <ComponentPage
      entry={entry}
      source={source}
      examples={examples}
      api={api}
      breadcrumb={[
        { label: "Components", href: "/components" },
        {
          label: CATEGORY_LABELS[entry.category],
          href: `/components/${entry.category}`,
        },
        { label: entry.title },
      ]}
    />
  );
}
