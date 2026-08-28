/**
 * Shared source-loading for the component/block/template detail routes. Each
 * route reads its entry's registry files off disk at build time, highlights
 * them, and hands the result to `<ComponentPage>`'s source tab.
 */

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
    files.map(async (f) => {
      const abs = path.join(process.cwd(), registryFilePath(base, f));
      let code: string;
      try {
        code = await fs.readFile(abs, 'utf8');
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // Surface the real reason — silently rendering the stub made it
        // very hard to tell whether the path was wrong, the file was
        // missing, or the deploy bundle didn't include it.
        console.error(`[loadSource] could not read ${abs}: ${msg}`);
        code = `// (unable to read source: ${msg})`;
      }
      const lang = langFromPath(f);
      const html = await highlightCode(code, lang);
      out[f] = { code, html, lang };
    }),
  );
  return out;
};

/** The same files from every base, keyed by base, for base-switching pages. */
export const loadSources = async (
  files: string[] | undefined,
): Promise<Record<RegistryBase, Record<string, SourceFile>>> => {
  const entries = await Promise.all(REGISTRY_BASES.map(async (base) => [base, await loadSource(files, base)] as const));
  return Object.fromEntries(entries) as Record<RegistryBase, Record<string, SourceFile>>;
};
