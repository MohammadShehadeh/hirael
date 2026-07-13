// Generates registry.json from registry/hirael/registry-meta.ts.
//
// registry-meta.ts is the single source of truth for every item: the
// showcase reads it directly and this script derives the distributable
// registry.json (consumed by `shadcn build`) from REGISTRY +
// DISTRIBUTION_ONLY. Never edit registry.json by hand — run
// `pnpm registry:gen` instead. `scripts/check-registry.mjs` fails the
// build if the two files drift.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const META_PATH = path.join(ROOT, "registry/hirael/registry-meta.ts");
const REGISTRY_JSON_PATH = path.join(ROOT, "registry.json");

// Where the registry is served. Cross-hirael `registryDependencies` are
// emitted as absolute URLs so the shadcn CLI resolves them against hirael
// instead of the default ui.shadcn.com registry (bare names only resolve
// there). Overridable so the install smoke-test can point deps at a local
// server; production builds use hirael.com.
const REGISTRY_BASE_URL = process.env.REGISTRY_BASE_URL ?? "https://hirael.com";

/**
 * registry-meta.ts is data-only TypeScript. Transpile it to ESM in a cache
 * dir and import it so we evaluate the real module instead of regex-parsing.
 */
export async function loadRegistryMeta() {
  const source = readFileSync(META_PATH, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const cacheDir = path.join(ROOT, "node_modules/.cache/hirael");
  mkdirSync(cacheDir, { recursive: true });
  const outFile = path.join(cacheDir, "registry-meta.mjs");
  writeFileSync(outFile, outputText);
  // Cache-bust so repeated imports in one process see fresh content.
  return import(`${pathToFileURL(outFile).href}?v=${Date.now()}`);
}

/**
 * Default install target for a source file. Primitives in `registry/hirael/ui`
 * land in the consumer's `components/ui`; extended components under
 * `registry/hirael/components` keep their sub-path (so a multi-file kit like
 * the data table installs as a folder).
 */
function deriveTarget(p) {
  if (p.startsWith("registry/hirael/components/")) {
    return p.slice("registry/hirael/".length);
  }
  return `components/ui/${path.basename(p)}`;
}

/**
 * Resolve a `registryDependencies` entry. Names that are hirael items become
 * absolute `/r/<name>.json` URLs (so the CLI fetches them from hirael); every
 * other name is a shadcn primitive and stays bare (resolved from the consumer's
 * default registry). URLs and `@`-namespaced deps pass through untouched.
 */
function resolveDep(dep, hiraelNames) {
  if (dep.includes("/") || dep.startsWith("@")) return dep;
  return hiraelNames.has(dep) ? `${REGISTRY_BASE_URL}/r/${dep}.json` : dep;
}

/** Map one meta entry to a registry.json item. */
function toRegistryItem(entry, hiraelNames) {
  const isBlock =
    entry.type === "registry:block" || entry.category === "blocks";
  const isTemplate = entry.category === "templates";
  const isComposite = isBlock || isTemplate;
  const type = entry.type ?? (isComposite ? "registry:block" : "registry:ui");

  const categories =
    entry.categories ??
    (isBlock
      ? ["blocks", entry.blockKind]
      : isTemplate
        ? ["templates"]
        : [entry.category]);
  if (categories.some((c) => !c)) {
    throw new Error(`"${entry.name}": could not derive categories`);
  }

  const files = (entry.files ?? []).map((file) => ({
    path: file.path,
    type: file.type ?? type,
    target: file.target ?? (isComposite ? undefined : deriveTarget(file.path)),
  }));
  // A `registry:theme` item ships only `cssVars` — no files to install — so
  // it's the one type exempt from the "must have files" rule below.
  if (!files.length && type !== "registry:theme") {
    throw new Error(`"${entry.name}": no files`);
  }
  for (const f of files) {
    if (!f.target) throw new Error(`"${entry.name}": missing install target`);
  }

  return {
    name: entry.name,
    type,
    title: entry.title,
    description: entry.description,
    categories,
    dependencies: [...(entry.dependencies ?? [])].sort(),
    registryDependencies: [...(entry.registryDependencies ?? [])]
      .sort()
      .map((dep) => resolveDep(dep, hiraelNames)),
    ...(entry.cssVars ? { cssVars: entry.cssVars } : {}),
    ...(entry.docs ? { docs: entry.docs } : {}),
    ...(files.length ? { files } : {}),
  };
}

export function buildRegistry({ REGISTRY, DISTRIBUTION_ONLY }) {
  const all = [...REGISTRY, ...(DISTRIBUTION_ONLY ?? [])];
  const hiraelNames = new Set(all.map((e) => e.name));
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "hirael",
    homepage: "https://hirael.com",
    items: all.map((entry) => toRegistryItem(entry, hiraelNames)),
  };
}

export function registryJsonText(registry) {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

async function main() {
  const meta = await loadRegistryMeta();
  const registry = buildRegistry(meta);
  writeFileSync(REGISTRY_JSON_PATH, registryJsonText(registry));
  console.log(`✓ registry.json generated (${registry.items.length} items)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
