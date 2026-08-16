// Generates registry.json from registry-meta.ts (the single source of truth).
// Never edit registry.json by hand — run `pnpm registry:gen`.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const META_PATH = path.join(ROOT, "registry/hirael/registry-meta.ts");
const REGISTRY_JSON_PATH = path.join(ROOT, "registry.json");

// Cross-hirael deps are emitted as absolute URLs so the shadcn CLI resolves
// them against hirael instead of the default ui.shadcn.com registry. The smoke
// test overrides this to point at a local server.
const REGISTRY_BASE_URL = process.env.REGISTRY_BASE_URL ?? "https://hirael.com";

// registry-meta.ts is data-only TS; transpile to ESM and import the real module
// rather than regex-parsing it.
export async function loadRegistryMeta() {
  const { outputText } = ts.transpileModule(readFileSync(META_PATH, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const cacheDir = path.join(ROOT, "node_modules/.cache/hirael");
  mkdirSync(cacheDir, { recursive: true });
  const outFile = path.join(cacheDir, "registry-meta.mjs");
  writeFileSync(outFile, outputText);
  return import(`${pathToFileURL(outFile).href}?v=${Date.now()}`);
}

// Install target: primitives (registry/hirael/ui) land in components/ui;
// extended components keep their sub-path so multi-file kits install as folders.
function deriveTarget(p) {
  if (p.startsWith("registry/hirael/components/")) {
    return p.slice("registry/hirael/".length);
  }
  return `components/ui/${path.basename(p)}`;
}

// Hirael items become absolute `/r/<name>.json` URLs; shadcn primitives stay
// bare; URLs and `@`-namespaced deps pass through.
function resolveDep(dep, hiraelNames) {
  if (dep.includes("/") || dep.startsWith("@")) return dep;
  return hiraelNames.has(dep) ? `${REGISTRY_BASE_URL}/r/${dep}.json` : dep;
}

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
  // A registry:theme item ships only cssVars, so it's exempt from needing files.
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
  const registry = buildRegistry(await loadRegistryMeta());
  writeFileSync(REGISTRY_JSON_PATH, registryJsonText(registry));
  console.log(`✓ registry.json generated (${registry.items.length} items)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
