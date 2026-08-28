import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RegistryItem } from 'shadcn/schema';

import pkg from '../package.json';
import {
  DISTRIBUTION_ONLY,
  REGISTRY,
  REGISTRY_BASES,
  entryHref,
  type DistributionOnlyEntry,
  type RegistryBase,
  type RegistryEntryMeta,
} from '@/registry/hirael/registry-meta';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const R_DIR = path.join(ROOT, 'public/r');

// Built payloads per base: Radix at public/r, others at public/r/<base>.
export const rDir = (base: RegistryBase) => (base === 'radix' ? R_DIR : path.join(R_DIR, base));
export { REGISTRY_BASES };

// Host that item URLs, docs links and source headers point at. Override it
// to test installs against another server, e.g. `pnpm dev` on localhost.
export const REGISTRY_BASE_URL = process.env.REGISTRY_BASE_URL ?? pkg.homepage;

export const BRAND = {
  author: pkg.author.name,
  homepage: pkg.homepage,
  repoUrl: pkg.repository.url,
  license: pkg.license,
};

export type RegistryEntry = RegistryEntryMeta | DistributionOnlyEntry;

export const ALL_ENTRIES: RegistryEntry[] = [...REGISTRY, ...DISTRIBUTION_ONLY];

const SHOWCASED = new Set<RegistryEntry>(REGISTRY);

export const isShowcased = (entry: RegistryEntry): entry is RegistryEntryMeta => SHOWCASED.has(entry);

export const jsonText = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

// `shadcn build` also copies the catalog index to public/r/registry.json,
// which is not an installable item.
export const readBuiltItems = (base: RegistryBase = 'radix') =>
  readdirSync(rDir(base))
    .filter((name) => name.endsWith('.json') && name !== 'registry.json')
    .map((name) => {
      const file = path.join(rDir(base), name);
      return {
        base,
        file,
        item: JSON.parse(readFileSync(file, 'utf8')) as RegistryItem,
      };
    });

export const readAllBuiltItems = () => REGISTRY_BASES.flatMap((base) => readBuiltItems(base));

// Attribution header prepended to every shipped source file so the docs URL
// and repo travel with the code wherever it is installed or mirrored.
export const STAMPABLE_FILE = /\.(tsx?|jsx?|mjs)$/;

const hrefByName = new Map(REGISTRY.map((entry) => [entry.name, entryHref(entry)]));

export const sourceHeader = (item: Pick<RegistryItem, 'name' | 'title'>) => {
  const href = hrefByName.get(item.name);
  const pageUrl = href ? `${REGISTRY_BASE_URL}${href}` : REGISTRY_BASE_URL;
  return [
    `// ${item.title ?? item.name} from Hirael <${pageUrl}>`,
    `// ${BRAND.license} · ${BRAND.author} · ${BRAND.repoUrl}`,
    '',
  ].join('\n');
};

export const createReporter = (label: string) => {
  let problems = 0;
  return {
    fail(message: string) {
      console.error(`  ✗ ${message}`);
      problems++;
    },
    finish(summary: string) {
      if (problems) {
        console.error(`\n✗ ${label} failed — ${problems} problem(s).`);
        process.exit(1);
      }
      console.log(`✓ ${summary}`);
    },
  };
};
