import type { RegistryFileMeta } from '@/registry/hirael/registry-meta';

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

/** Must match `deriveTarget` in scripts/build-registry.mts. */
export const installTarget = (file: RegistryFileMeta): string => {
  if (file.target) return file.target;
  if (['components/', 'hooks/', 'lib/'].some((dir) => file.path.startsWith(dir))) return file.path;

  return `components/ui/${file.path.split('/').pop()}`;
};

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
    // Hooks and utilities document every export; components list their parts and any hooks.
    const isShared = file.path.startsWith('hooks/') || file.path.startsWith('lib/');
    const components = exported.filter((name) => (documented.size ? documented.has(name) : isComponent(name)));
    const names = isShared ? exported : [...new Set([...components, ...exported.filter(isHook)])];
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
