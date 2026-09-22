// Offline: a real `shadcn add` reaches ui.shadcn.com and stalls CI, so this
// replays the CLI's import rewrites against a fresh /r instead.

import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';

import { R_DIR, ROOT, STAMPABLE_FILE, createReporter, readAllBuiltItems, sourceHeader } from './shared.mts';

const CONSUMER_ALIASES = {
  ui: '@/components/ui',
  components: '@/components',
  lib: '@/lib',
  hooks: '@/hooks',
};

const report = createReporter('install check');

const rewriteImport = (specifier: string) =>
  Object.entries(CONSUMER_ALIASES).reduce(
    (spec, [segment, alias]) => spec.replace(new RegExp(`^@/registry/(.+?)/${segment}(?=/|$)`), alias),
    specifier,
  );

const importSpecifiers = (source: string) =>
  [...source.matchAll(/(?:import|export)[^"']*?["']([^"']+)["']/g)].map((match) => match[1]);

// `shadcn build` never prunes, so start from an empty /r; `registry:md` restores
// the .md pages this also deletes. `shell: true` resolves pnpm's Windows shim.
rmSync(R_DIR, { recursive: true, force: true });
for (const script of ['registry:gen', 'registry:build', 'registry:md']) {
  execFileSync('pnpm', [script], { stdio: 'inherit', cwd: ROOT, shell: true });
}

const builtItems = readAllBuiltItems();
if (!builtItems.length) throw new Error('no /r/*.json were built');
const itemNames = new Set(builtItems.map(({ item }) => item.name));

let checkedFiles = 0;
for (const { item } of builtItems) {
  for (const dep of item.registryDependencies ?? []) {
    if (!dep.includes('/') && itemNames.has(dep)) {
      report.fail(`"${item.name}" depends on hirael item "${dep}" by bare name (must be a /r URL)`);
    }
  }

  const header = sourceHeader(item);
  for (const file of item.files ?? []) {
    if (typeof file.content !== 'string') continue;
    checkedFiles++;
    const location = file.target ?? file.path;

    if (STAMPABLE_FILE.test(file.path) && !file.content.startsWith(header)) {
      report.fail(`"${item.name}" → ${file.path}: missing Hirael source header`);
    }

    if (
      /^registry\/hirael\/bases\/[a-z]+\/components\//.test(file.path) &&
      file.target &&
      !file.target.startsWith('components/')
    ) {
      report.fail(`"${item.name}" → ${file.path} installs to ${file.target}, expected components/*`);
    }

    for (const specifier of importSpecifiers(file.content)) {
      if (specifier.startsWith('@/registry/hirael/') && rewriteImport(specifier).startsWith('@/registry/hirael/')) {
        report.fail(`"${item.name}" → ${location}: import "${specifier}" does not map to a consumer alias`);
      }
    }
  }
}

report.finish(
  `install OK — ${builtItems.length} items / ${checkedFiles} files: imports rewrite to consumer aliases, cross-hirael deps are URLs.`,
);
