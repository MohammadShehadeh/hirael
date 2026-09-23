import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import type { SourceFile } from '@/components/component-page';
import { highlightCode, langFromPath } from '@/lib/highlight';
import { DEFAULT_BASE, REGISTRY_BASES, registryFilePath, type RegistryBase } from '@/registry/hirael/registry-meta';

export const loadSource = async (
  files: string[] | undefined,
  base: RegistryBase = DEFAULT_BASE,
): Promise<Record<string, SourceFile>> => {
  const out: Record<string, SourceFile> = {};
  if (!files) return out;
  await Promise.all(
    files.map(async (file) => {
      const absolutePath = path.join(process.cwd(), registryFilePath(base, file));
      let code: string;
      try {
        code = await fs.readFile(absolutePath, 'utf8');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[loadSource] could not read ${absolutePath}: ${message}`);
        code = `// (unable to read source: ${message})`;
      }
      const lang = langFromPath(file);
      const html = await highlightCode(code, lang);
      out[file] = { code, html, lang };
    }),
  );

  return out;
};

export const loadSources = async (
  files: string[] | undefined,
): Promise<Record<RegistryBase, Record<string, SourceFile>>> => {
  const entries = await Promise.all(REGISTRY_BASES.map(async (base) => [base, await loadSource(files, base)] as const));

  return Object.fromEntries(entries) as Record<RegistryBase, Record<string, SourceFile>>;
};
