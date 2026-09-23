// Runs in `pnpm registry:md`. Writes a Markdown page per item and base to
// public/r. Must run after registry:props: the API tables come from registry-props.json.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { registryMarkdown, type MarkdownApiPart, type RegistryMarkdownInput } from '@/lib/registry-markdown';
import {
  BASE_LABELS,
  REGISTRY,
  REGISTRY_BASES,
  getExamples,
  registryFilePath,
  type RegistryBase,
} from '@/registry/hirael/registry-meta';

import { REGISTRY_BASE_URL, ROOT, builtDir } from './shared.mts';

const PROPS_PATH = path.join(ROOT, 'registry/hirael/registry-props.json');

type MarkdownExample = RegistryMarkdownInput['examples'][number];

const api: Record<string, MarkdownApiPart[]> = existsSync(PROPS_PATH)
  ? JSON.parse(readFileSync(PROPS_PATH, 'utf8'))
  : {};

if (!Object.keys(api).length) {
  console.warn('  registry-props.json is empty or missing; API tables will be omitted. Run `pnpm registry:props`.');
}

const read = (base: RegistryBase, file: string): string | undefined => {
  try {
    return readFileSync(path.join(ROOT, registryFilePath(base, file)), 'utf8');
  } catch {
    return undefined;
  }
};

let written = 0;

for (const base of REGISTRY_BASES) {
  const outDir = builtDir(base);
  mkdirSync(outDir, { recursive: true });

  for (const entry of REGISTRY) {
    const sources: Record<string, string> = {};
    for (const file of entry.files ?? []) {
      const code = read(base, file.path);
      if (code === undefined) {
        // check:registry already fails the build on this; here the section is skipped, loudly.
        console.warn(`  ${entry.name} (${base}): missing ${file.path}`);
        continue;
      }
      sources[file.path] = code;
    }

    const examples = getExamples(entry.name)
      .map(({ slug, title }) => ({ title, code: read(base, `examples/${slug}.tsx`) }))
      .filter((example): example is MarkdownExample => example.code !== undefined);

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
