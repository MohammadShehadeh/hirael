// Runs in `pnpm registry:gen`. Generates registry.json (the input to
// `shadcn build`) from registry-meta.ts, the single source of truth.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { registrySchema, type RegistryItem } from 'shadcn/schema';

import {
  BASE_UI_PACKAGE,
  REGISTRY_BASES,
  basePackages,
  entryHref,
  registryFilePath,
  registryItemPath,
  type RegistryBase,
} from '@/registry/hirael/registry-meta';

import { ALL_ENTRIES, BRAND, REGISTRY_BASE_URL, ROOT, isShowcased, jsonText, type RegistryEntry } from './shared.mts';

// Radix is the default base and keeps the original registry.json; every
// other base gets registry.<base>.json, built to public/r/<base>.
const registryJsonPath = (base: RegistryBase) =>
  path.join(ROOT, base === 'radix' ? 'registry.json' : `registry.${base}.json`);
const COMPONENTS_DIR = 'components/';

const ITEM_NAMES = new Set(ALL_ENTRIES.map((entry) => entry.name));

type ItemType = RegistryItem['type'];

const isComposite = (entry: RegistryEntry) =>
  isShowcased(entry) ? entry.category === 'blocks' || entry.category === 'templates' : entry.type === 'registry:block';

// Mirrors shadcn/ui's own registry: `ui/` primitives are `registry:ui`,
// hirael's components are `registry:component`, blocks and templates are
// `registry:block`.
const deriveType = (entry: RegistryEntry): ItemType => {
  if (!isShowcased(entry)) return entry.type;
  if (isComposite(entry)) return 'registry:block';
  const files = entry.files ?? [];
  const isOwnComponent = files.length > 0 && files.every((f) => f.path.startsWith(COMPONENTS_DIR));
  return isOwnComponent ? 'registry:component' : 'registry:ui';
};

const deriveCategories = (entry: RegistryEntry): string[] => {
  if (!isShowcased(entry)) return entry.categories;
  if (entry.category === 'blocks') {
    if (!entry.blockKind) throw new Error(`"${entry.name}": missing blockKind`);
    return ['blocks', entry.blockKind];
  }
  return [entry.category];
};

// Primitives land in components/ui; hirael components keep their sub-path so
// multi-file kits install as folders.
const deriveTarget = (sourcePath: string) =>
  sourcePath.startsWith(COMPONENTS_DIR) ? sourcePath : `components/ui/${path.basename(sourcePath)}`;

// Hirael items resolve against this registry instead of ui.shadcn.com; shadcn
// primitives stay bare, URLs and `@`-namespaced deps pass through. A base's
// items depend on the same base's payloads.
const resolveDependency = (base: RegistryBase, dep: string) =>
  ITEM_NAMES.has(dep) && !dep.includes('/') && !dep.startsWith('@')
    ? `${REGISTRY_BASE_URL}${registryItemPath(base, dep)}`
    : dep;

// A base tree file may import @base-ui/react (useRender) even where the Radix
// version needed no Radix package at all.
const importsBaseUi = (base: RegistryBase, entry: RegistryEntry) =>
  base !== 'radix' &&
  (entry.files ?? []).some((file) => {
    try {
      return readFileSync(path.join(ROOT, registryFilePath(base, file.path)), 'utf8').includes(
        `from "${BASE_UI_PACKAGE}`,
      );
    } catch {
      return false;
    }
  });

const toRegistryItem = (base: RegistryBase, entry: RegistryEntry) => {
  const type = deriveType(entry);

  const files = (entry.files ?? []).map((file) => {
    const target = file.target ?? (isComposite(entry) ? undefined : deriveTarget(file.path));
    if (!target) throw new Error(`"${entry.name}": missing install target`);
    return {
      path: registryFilePath(base, file.path),
      type: file.type ?? type,
      target,
    };
  });
  if (!files.length && type !== 'registry:theme') {
    throw new Error(`"${entry.name}": no files`);
  }

  const docsHref = isShowcased(entry) ? entryHref(entry) : undefined;

  return {
    name: entry.name,
    type,
    title: entry.title,
    description: entry.description,
    categories: deriveCategories(entry),
    dependencies: basePackages(base, entry.dependencies ?? [], importsBaseUi(base, entry)).sort(),
    registryDependencies: [...(entry.registryDependencies ?? [])].sort().map((dep) => resolveDependency(base, dep)),
    ...(entry.cssVars ? { cssVars: entry.cssVars } : {}),
    ...(isShowcased(entry) && entry.docs ? { docs: entry.docs } : {}),
    ...(files.length ? { files } : {}),
    ...(docsHref ? { meta: { links: { docs: `${REGISTRY_BASE_URL}${docsHref}` } } } : {}),
  };
};

for (const base of REGISTRY_BASES) {
  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'hirael',
    homepage: BRAND.homepage,
    items: ALL_ENTRIES.map((entry) => toRegistryItem(base, entry)),
  };

  // The CLI's own schema, so a rejected item fails here rather than at install.
  registrySchema.parse(registry);

  writeFileSync(registryJsonPath(base), jsonText(registry));
  console.log(`✓ ${path.basename(registryJsonPath(base))} generated (${registry.items.length} items, ${base})`);
}
