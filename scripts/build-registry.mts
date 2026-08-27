// Runs in `pnpm registry:gen`. Generates registry.json (the input to
// `shadcn build`) from registry-meta.ts, the single source of truth.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { registrySchema, type RegistryItem } from "shadcn/schema";

import { entryHref } from "@/registry/hirael/registry-meta";

import {
  ALL_ENTRIES,
  BRAND,
  REGISTRY_BASE_URL,
  ROOT,
  isShowcased,
  jsonText,
  type RegistryEntry,
} from "./shared.mts";

const REGISTRY_JSON_PATH = path.join(ROOT, "registry.json");
const COMPONENTS_DIR = "registry/hirael/components/";

const ITEM_NAMES = new Set(ALL_ENTRIES.map((entry) => entry.name));

type ItemType = RegistryItem["type"];

const isComposite = (entry: RegistryEntry) =>
  isShowcased(entry)
    ? entry.category === "blocks" || entry.category === "templates"
    : entry.type === "registry:block";

// Mirrors shadcn/ui's own registry: `ui/` primitives are `registry:ui`,
// hirael's components are `registry:component`, blocks and templates are
// `registry:block`.
const deriveType = (entry: RegistryEntry): ItemType => {
  if (!isShowcased(entry)) return entry.type;
  if (isComposite(entry)) return "registry:block";
  const files = entry.files ?? [];
  const isOwnComponent =
    files.length > 0 && files.every((f) => f.path.startsWith(COMPONENTS_DIR));
  return isOwnComponent ? "registry:component" : "registry:ui";
};

const deriveCategories = (entry: RegistryEntry): string[] => {
  if (!isShowcased(entry)) return entry.categories;
  if (entry.category === "blocks") {
    if (!entry.blockKind) throw new Error(`"${entry.name}": missing blockKind`);
    return ["blocks", entry.blockKind];
  }
  return [entry.category];
};

// Primitives land in components/ui; hirael components keep their sub-path so
// multi-file kits install as folders.
const deriveTarget = (sourcePath: string) =>
  sourcePath.startsWith(COMPONENTS_DIR)
    ? sourcePath.slice("registry/hirael/".length)
    : `components/ui/${path.basename(sourcePath)}`;

// Hirael items resolve against this registry instead of ui.shadcn.com; shadcn
// primitives stay bare, URLs and `@`-namespaced deps pass through.
const resolveDependency = (dep: string) =>
  ITEM_NAMES.has(dep) && !dep.includes("/") && !dep.startsWith("@")
    ? `${REGISTRY_BASE_URL}/r/${dep}.json`
    : dep;

const toRegistryItem = (entry: RegistryEntry) => {
  const type = deriveType(entry);

  const files = (entry.files ?? []).map((file) => {
    const target =
      file.target ?? (isComposite(entry) ? undefined : deriveTarget(file.path));
    if (!target) throw new Error(`"${entry.name}": missing install target`);
    return { path: file.path, type: file.type ?? type, target };
  });
  if (!files.length && type !== "registry:theme") {
    throw new Error(`"${entry.name}": no files`);
  }

  const docsHref = isShowcased(entry) ? entryHref(entry) : undefined;

  return {
    name: entry.name,
    type,
    title: entry.title,
    description: entry.description,
    categories: deriveCategories(entry),
    dependencies: [...(entry.dependencies ?? [])].sort(),
    registryDependencies: [...(entry.registryDependencies ?? [])]
      .sort()
      .map(resolveDependency),
    ...(entry.cssVars ? { cssVars: entry.cssVars } : {}),
    ...(isShowcased(entry) && entry.docs ? { docs: entry.docs } : {}),
    ...(files.length ? { files } : {}),
    ...(docsHref
      ? { meta: { links: { docs: `${REGISTRY_BASE_URL}${docsHref}` } } }
      : {}),
  };
};

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "hirael",
  homepage: BRAND.homepage,
  items: ALL_ENTRIES.map(toRegistryItem),
};

// The CLI's own schema, so a rejected item fails here rather than at install.
registrySchema.parse(registry);

writeFileSync(REGISTRY_JSON_PATH, jsonText(registry));
console.log(`✓ registry.json generated (${registry.items.length} items)`);
