import * as fs from "node:fs/promises";
import * as path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ComponentPage } from "@/components/component-page";
import type {
  ApiPart,
  ExampleEntry,
  SourceFile,
} from "@/components/component-page";
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
  return detailMetadata(entry, { ownOgImage: true });
}

/**
 * A component ships its install source at `registry/hirael/ui/<name>.tsx`
 * (what shadcn distributes) and one or more demos at the top-level
 * `examples/<slug>.tsx`. Returns each example with its pre-highlighted source
 * for the stacked preview/code blocks; the source is null when a file is
 * missing.
 */
async function loadExamples(name: string): Promise<ExampleEntry[]> {
  return Promise.all(
    getExamples(name).map(async ({ slug, title }) => {
      const relPath = `examples/${slug}.tsx`;
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

/** Value exports only; regex-based, which hand-written registry source keeps reliable. */
function exportedNames(code: string): string[] {
  const names = new Set<string>();
  for (const m of code.matchAll(
    /^export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm,
  )) {
    names.add(m[1]);
  }
  for (const m of code.matchAll(/^export\s*\{([^}]*)\}/gm)) {
    for (const raw of m[1].split(",")) {
      const spec = raw.trim();
      if (!spec || spec.startsWith("type ")) continue;
      const local = spec.split(/\s+as\s+/).pop();
      if (local) names.add(local);
    }
  }
  return [...names];
}

/** Mirrors `deriveTarget` in scripts/build-registry.mjs. */
function installTarget(file: { path: string; target?: string }): string {
  if (file.target) return file.target;
  if (file.path.startsWith("registry/hirael/components/")) {
    return file.path.slice("registry/hirael/".length);
  }
  return `components/ui/${path.basename(file.path)}`;
}

function buildUsage(
  entry: (typeof COMPONENTS)[number],
  source: Record<string, SourceFile>,
  api: ApiPart[] | null,
) {
  const documented = new Set((api ?? []).map((part) => part.name));
  const isHook = (name: string) => /^use[A-Z]/.test(name);
  const isComponent = (name: string) => /^[A-Z]/.test(name);
  const statements: string[] = [];
  for (const file of entry.files ?? []) {
    const code = source[file.path]?.code;
    if (!code) continue;
    const exported = exportedNames(code);
    const components = exported.filter((name) =>
      documented.size ? documented.has(name) : isComponent(name),
    );
    const hooks = exported.filter(isHook);
    const names = [...components, ...hooks];
    if (!names.length) continue;
    const specifier = `@/${installTarget(file).replace(/\.tsx?$/, "")}`;
    statements.push(
      names.length > 3
        ? `import {\n  ${names.join(",\n  ")},\n} from "${specifier}"`
        : `import { ${names.join(", ")} } from "${specifier}"`,
    );
  }
  return statements.length ? statements.join("\n\n") : null;
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
  const usageCode = buildUsage(entry, source, api);
  const usage = usageCode
    ? {
        code: usageCode,
        html: await highlightCode(usageCode, "tsx"),
        lang: "tsx",
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
      usage={usage}
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
