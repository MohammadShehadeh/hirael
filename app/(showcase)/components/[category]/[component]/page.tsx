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
import { highlightCode, highlightInline, langFromPath } from "@/lib/highlight";
import { loadSource } from "@/lib/registry-source";
import { detailMetadata } from "@/lib/site";
import {
  CATEGORY_LABELS,
  COMPONENTS,
  REGISTRY_BY_NAME,
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
  return detailMetadata(entry);
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
  // Pre-highlight each prop's type and default as inline TS so the API table
  // gets the same VSCode token colors as the code blocks.
  const apiHighlighted = api
    ? await Promise.all(
        api.map(async (part) => ({
          ...part,
          props: await Promise.all(
            part.props.map(async (p) => ({
              ...p,
              typeHtml: await highlightInline(p.type, "ts"),
              defaultHtml: p.default
                ? await highlightInline(p.default, "ts")
                : null,
            })),
          ),
        })),
      )
    : null;
  return (
    <ComponentPage
      entry={entry}
      source={source}
      examples={examples}
      api={apiHighlighted}
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
