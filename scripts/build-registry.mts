// Runs first in `pnpm registry:gen`. Turns registry-meta.ts into one
// registry.json per base for `shadcn build`: derives each item's type,
// categories, install targets, cssVars and per-base dependencies.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { registrySchema, type RegistryItem } from 'shadcn/schema';

import {
  BASE_UI_PACKAGE,
  REGISTRY_BASES,
  STATUS_CSS_VARS,
  basePackages,
  entryHref,
  registryFilePath,
  registryItemPath,
  type RegistryBase,
  type RegistryCssVars,
} from '@/registry/hirael/registry-meta';

import { ALL_ENTRIES, BRAND, REGISTRY_BASE_URL, ROOT, isShowcased, jsonText, type RegistryEntry } from './shared.mts';

const registryJsonPath = (base: RegistryBase) =>
  path.join(ROOT, base === 'radix' ? 'registry.json' : `registry.${base}.json`);
const COMPONENTS_DIR = 'components/';

const ITEM_NAMES = new Set(ALL_ENTRIES.map((entry) => entry.name));

const isComposite = (entry: RegistryEntry) =>
  isShowcased(entry) ? entry.category === 'blocks' || entry.category === 'templates' : entry.type === 'registry:block';

const deriveType = (entry: RegistryEntry): RegistryItem['type'] => {
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

// Hirael components keep their sub-path so multi-file kits install as folders.
const deriveTarget = (sourcePath: string) =>
  sourcePath.startsWith(COMPONENTS_DIR) ? sourcePath : `components/ui/${path.basename(sourcePath)}`;

// shadcn primitives stay bare so consumers keep their own copy; hirael deps point at the same base's payloads.
const resolveDependency = (base: RegistryBase, dep: string) =>
  ITEM_NAMES.has(dep) && !dep.includes('/') && !dep.startsWith('@')
    ? `${REGISTRY_BASE_URL}${registryItemPath(base, dep)}`
    : dep;

// All of an item's source in one string, for the scans below. A missing file
// reads as empty: this runs before check:registry, which is what reports it.
const readSources = (base: RegistryBase, entry: RegistryEntry) =>
  (entry.files ?? [])
    .map((file) => {
      try {
        return readFileSync(path.join(ROOT, registryFilePath(base, file.path)), 'utf8');
      } catch {
        return '';
      }
    })
    .join('\n');

// A Base UI file may import @base-ui/react (useRender) where the Radix version needed no Radix package.
const importsBaseUi = (base: RegistryBase, source: string) =>
  base !== 'radix' && (source.includes(`from "${BASE_UI_PACKAGE}`) || source.includes(`from '${BASE_UI_PACKAGE}`));

// Functional status tokens aren't in shadcn's default theme; ship them with any item that uses them.
const STATUS_TOKEN = /(?:\b[a-z]+-|var\(--)(?:success|warning|info)\b/;

const deriveCssVars = (entry: RegistryEntry, source: string): RegistryCssVars | undefined => {
  const sets = [entry.cssVars, STATUS_TOKEN.test(source) ? STATUS_CSS_VARS : undefined];
  const merged: RegistryCssVars = {};
  for (const set of sets) {
    for (const key of ['theme', 'light', 'dark'] as const) {
      if (set?.[key]) merged[key] = { ...merged[key], ...set[key] };
    }
  }

  return Object.keys(merged).length ? merged : undefined;
};

const toRegistryItem = (base: RegistryBase, entry: RegistryEntry) => {
  const type = deriveType(entry);
  const source = readSources(base, entry);

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
  const cssVars = deriveCssVars(entry, source);

  return {
    name: entry.name,
    type,
    title: entry.title,
    description: entry.description,
    categories: deriveCategories(entry),
    dependencies: basePackages(base, entry.dependencies ?? [], importsBaseUi(base, source)).sort(),
    registryDependencies: [...(entry.registryDependencies ?? [])].sort().map((dep) => resolveDependency(base, dep)),
    ...(cssVars ? { cssVars } : {}),
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
