import type { RegistryFileMeta } from '@/registry/hirael/registry-meta';

/**
 * Value exports of a source file. Regex-based rather than a TypeScript pass:
 * registry source is hand-written to one shape, and this runs for every file
 * of every item in both bases on each build.
 */
const exportedNames = (code: string): string[] => {
  const names = new Set<string>();
  for (const match of code.matchAll(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)) {
    names.add(match[1]);
  }
  for (const match of code.matchAll(/^export\s*\{([^}]*)\}/gm)) {
    for (const raw of match[1].split(',')) {
      const spec = raw.trim();
      if (!spec || spec.startsWith('type ')) continue;
      const local = spec.split(/\s+as\s+/).pop();
      if (local) names.add(local);
    }
  }
  return [...names];
};

/** Where a file lands in a consumer project. Mirrors `deriveTarget` in scripts/build-registry.mts. */
export const installTarget = (file: RegistryFileMeta): string => {
  if (file.target) return file.target;
  if (file.path.startsWith('components/')) return file.path;
  return `components/ui/${file.path.split('/').pop()}`;
};

/**
 * The import statement a consumer writes after installing an item: every
 * documented part plus any hooks, from the paths the CLI actually wrote to.
 * When the API tables are available their part names decide what is public;
 * without them, anything capitalised counts.
 *
 * Shared by the detail route's Usage block and the generated `.md`, so the
 * page and the file an agent fetches can't drift.
 */
export const buildUsageCode = (
  files: RegistryFileMeta[] | undefined,
  readCode: (path: string) => string | undefined,
  api?: { name: string }[] | null,
): string | null => {
  const documented = new Set((api ?? []).map((part) => part.name));
  const isHook = (name: string) => /^use[A-Z]/.test(name);
  const isComponent = (name: string) => /^[A-Z]/.test(name);
  const statements: string[] = [];

  for (const file of files ?? []) {
    const code = readCode(file.path);
    if (!code) continue;
    const exported = exportedNames(code);
    const components = exported.filter((name) => (documented.size ? documented.has(name) : isComponent(name)));
    const names = [...components, ...exported.filter(isHook)];
    if (!names.length) continue;

    const specifier = `@/${installTarget(file).replace(/\.tsx?$/, '')}`;
    statements.push(
      names.length > 3
        ? `import {\n  ${names.join(',\n  ')},\n} from "${specifier}"`
        : `import { ${names.join(', ')} } from "${specifier}"`,
    );
  }

  return statements.length ? statements.join('\n\n') : null;
};
