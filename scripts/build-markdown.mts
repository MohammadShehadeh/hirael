// Runs in `pnpm registry:md`, after registry:props. Writes the Markdown twin
// of every detail page to public/r/<name>.md (and public/r/<base>/<name>.md),
// the document the "Copy page" control fetches and an agent reads directly.
//
// Runs after `registry:props` because the API tables it embeds come from
// registry-props.json.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { registryMarkdown, type MarkdownApiPart } from '@/lib/registry-markdown';
import {
  BASE_LABELS,
  REGISTRY,
  REGISTRY_BASES,
  getExamples,
  registryFilePath,
  type RegistryBase,
} from '@/registry/hirael/registry-meta';

import { REGISTRY_BASE_URL, ROOT, rDir } from './shared.mts';

const PROPS_PATH = path.join(ROOT, 'registry/hirael/registry-props.json');

const api: Record<string, MarkdownApiPart[]> = existsSync(PROPS_PATH)
  ? JSON.parse(readFileSync(PROPS_PATH, 'utf8'))
  : {};

if (!Object.keys(api).length) {
  console.warn('  registry-props.json is empty or missing; API tables will be omitted. Run `pnpm registry:props`.');
}

/** Reads a base-relative registry file, or undefined when it isn't there. */
const read = (base: RegistryBase, file: string): string | undefined => {
  try {
    return readFileSync(path.join(ROOT, registryFilePath(base, file)), 'utf8');
  } catch {
    return undefined;
  }
};

let written = 0;

for (const base of REGISTRY_BASES) {
  const outDir = rDir(base);
  mkdirSync(outDir, { recursive: true });

  for (const entry of REGISTRY) {
    const sources: Record<string, string> = {};
    for (const file of entry.files ?? []) {
      const code = read(base, file.path);
      if (code === undefined) {
        // A file listed in registry-meta that isn't on disk is a real error,
        // and check:registry already fails the build on it. Here it only means
        // the section is skipped, so say so rather than shipping a silent gap.
        console.warn(`  ${entry.name} (${base}): missing ${file.path}`);
        continue;
      }
      sources[file.path] = code;
    }

    const examples = getExamples(entry.name)
      .map(({ slug, title }) => ({ title, code: read(base, `examples/${slug}.tsx`) }))
      .filter((example): example is { title: string; code: string } => example.code !== undefined);

    const markdown = registryMarkdown({
      entry,
      base,
      origin: REGISTRY_BASE_URL,
      baseLabel: BASE_LABELS[base],
      sources,
      examples,
      api: api[entry.name] ?? null,
    });

    writeFileSync(path.join(outDir, `${entry.name}.md`), markdown);
    written += 1;
  }
}

console.log(
  `✓ ${written} registry markdown pages generated (${REGISTRY.length} items x ${REGISTRY_BASES.length} bases)`,
);
