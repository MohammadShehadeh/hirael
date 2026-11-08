import { installTarget } from '@/lib/registry-usage';
import { DISTRIBUTION_ONLY, REGISTRY, type RegistryFileMeta } from '@/registry/hirael/registry-meta';

const ALL_ENTRIES = [...REGISTRY, ...DISTRIBUTION_ONLY];

const stripExtension = (file: string) => file.replace(/\.tsx?$/, '');

// Base trees hold components, ui and blocks; hooks and lib sit once beside them.
const REGISTRY_PATH = String.raw`@\/registry\/hirael\/(?:bases\/[a-z]+\/)?([\w./-]+)`;

const REGISTRY_IMPORT = new RegExp(REGISTRY_PATH, 'g');

const CONSUMER_IMPORTS = new Map<string, string>(
  ALL_ENTRIES.flatMap((entry) =>
    (entry.files ?? []).map((file) => [stripExtension(file.path), `@/${stripExtension(installTarget(file))}`] as const),
  ),
);

/** Rewrites registry import paths to where `shadcn add` installs each file. */
export const forConsumer = (code: string): string =>
  code.replace(REGISTRY_IMPORT, (_match, file: string) => {
    const mapped = CONSUMER_IMPORTS.get(file);
    if (mapped) return mapped;

    return /^(?:ui|components)\//.test(file) ? `@/components/${file.replace(/^components\//, '')}` : `@/${file}`;
  });

const REGISTRY_SPECIFIER = new RegExp(`^${REGISTRY_PATH}$`);

const SITE_LIB_SPECIFIER = /^@\/lib\/([\w/-]+)$/;

/** shadcn's `cn` lives at `@/lib/utils` in every consumer project, so it never needs its own file. */
const CONSUMER_LIB = new Set(['utils']);

const ITEM_BY_FILE = new Map<string, string>(
  ALL_ENTRIES.flatMap((entry) => (entry.files ?? []).map((file) => [stripExtension(file.path), entry.name] as const)),
);

const ENTRY_BY_NAME = new Map(ALL_ENTRIES.map((entry) => [entry.name, entry]));

const importSpecifiers = (code: string): string[] =>
  [...code.matchAll(/(?:from|import)\s*["']([^"']+)["']/g)].map((match) => match[1]);

// The registry is finite and each name is expanded once, so the walk always ends.
const withHiraelDependencies = (names: Iterable<string>): Set<string> => {
  const seen = new Set<string>();
  const queue = [...names];
  while (queue.length > 0) {
    const name = queue.pop();
    if (name === undefined || seen.has(name)) continue;
    const entry = ENTRY_BY_NAME.get(name);
    if (!entry) continue;

    seen.add(name);
    queue.push(...(entry.registryDependencies ?? []));
  }

  return seen;
};

export interface ExampleDependencies {
  /** Files of Hirael items the example uses that installing the page's item doesn't bring along. */
  registryFiles: RegistryFileMeta[];
  /** Site-only helpers under `lib/`, without extension, such as `lib/demo-locale`. */
  siteFiles: string[];
}

/** What an example needs beyond the item it demonstrates and shadcn's own primitives. */
export const exampleDependencies = (code: string, itemName: string): ExampleDependencies => {
  const specifiers = importSpecifiers(code);

  const imported = specifiers.flatMap((specifier) => {
    const name = ITEM_BY_FILE.get(REGISTRY_SPECIFIER.exec(specifier)?.[1] ?? '');

    return name ? [name] : [];
  });
  const installed = withHiraelDependencies([itemName]);
  const needed = [...withHiraelDependencies(imported)].filter((name) => !installed.has(name));

  const siteFiles = specifiers.flatMap((specifier) => {
    const file = SITE_LIB_SPECIFIER.exec(specifier)?.[1];

    return file && !CONSUMER_LIB.has(file) ? [`lib/${file}`] : [];
  });

  return {
    registryFiles: needed.flatMap((name) => ENTRY_BY_NAME.get(name)?.files ?? []),
    siteFiles: [...new Set(siteFiles)],
  };
};
