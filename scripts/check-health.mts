// Runs in `pnpm check:health`, locally before a PR. Replays shadcn's registry
// health monitor (ui/apps/v4/lib/registry-health) against a local build: the
// index and every item against the CLI's schemas, the hygiene signals, and a
// real `shadcn add --dry-run` per item into a blank project. Needs network:
// the CLI resolves bare primitives from ui.shadcn.com, which is why CI runs
// the offline `check:install` instead.
//
//   pnpm check:health                      every item, both bases
//   pnpm check:health --changed            items this branch touches, plus their dependents
//   pnpm check:health --items=a,b          only these items
//   pnpm check:health --base=radix         one base
//   pnpm check:health --concurrency=4      parallel dry-runs (default: CPU count, 2..8)
//   pnpm check:health --build=false        skip registry:gen + registry:build, check public/r as is
//   pnpm check:health --verbose            print the CLI output of passing dry-runs too
//
// Sections mirror the monitor's score: hygiene 10, correctness 25,
// installability 20, reliability 45 (uptime, only measurable on the live site).

import { execSync, spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { registryItemSchema, registrySchema, type RegistryItem } from 'shadcn/schema';

import { BASE_LABELS, REGISTRY_BASES, registryFilePath, type RegistryBase } from '@/registry/hirael/registry-meta';

import { ALL_ENTRIES, REGISTRY_BASE_URL, ROOT, builtDir } from './shared.mts';

const NAMESPACE = '@hirael';
const STYLE = 'radix-vega';
const DRY_RUN_TIMEOUT_MS = 90_000;
const MAX_PROBLEMS_SHOWN = 20;

interface BuiltItem {
  name: string;
  type: string;
  bytes: number;
  files: number;
  json: RegistryItem;
}

interface DryRunResult {
  item: string;
  ok: boolean;
  ms: number;
  output: string;
}

interface LiveHealth {
  score: number;
  status: string;
  checkedAt: string;
  breakdown: Record<string, number>;
}

interface RegistryListing {
  name: string;
  health?: LiveHealth;
}

interface LocalServer {
  url: string;
  close: () => void;
}

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');

    return [key, value ?? 'true'];
  }),
);
const bases = (args.base ? [args.base] : REGISTRY_BASES) as RegistryBase[];
const concurrency = Number(args.concurrency ?? Math.max(2, Math.min(8, os.cpus().length)));

// execSync goes through a shell, which is what resolves pnpm's Windows shim.
const run = (command: string) => execSync(command, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const kb = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

// Prints one line per check; a failed check lists what failed under it and fails the run.
let failedChecks = 0;
const check = (indent: string, ok: boolean, label: string, problems: string[] = []) => {
  console.log(`${indent}${ok ? '✓' : '✗'} ${label}`);
  if (ok) return;
  failedChecks++;
  for (const problem of problems.slice(0, MAX_PROBLEMS_SHOWN)) console.error(`${indent}  → ${problem}`);
  if (problems.length > MAX_PROBLEMS_SHOWN) {
    console.error(`${indent}  → …and ${problems.length - MAX_PROBLEMS_SHOWN} more`);
  }
};

// Runs `task` over `values` with at most `concurrency` in flight.
const pool = async <T, R>(values: T[], task: (value: T) => Promise<R>, onDone?: (done: number) => void) => {
  const queue = [...values];
  const results: R[] = [];
  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, async () => {
      for (let value = queue.shift(); value !== undefined; value = queue.shift()) {
        results.push(await task(value));
        onDone?.(results.length);
      }
    }),
  );

  return results;
};

// Items whose source changed on this branch or in the working tree, plus items that depend on them.
const changedItems = () => {
  const mergeBase = run('git merge-base HEAD origin/main').trim();
  const files = new Set(
    [run(`git diff --name-only ${mergeBase}`), run('git ls-files --others --exclude-standard')]
      .join('\n')
      .split('\n')
      .filter(Boolean),
  );
  // Meta or the generator changed: every payload may differ.
  if (files.has('registry/hirael/registry-meta.ts') || files.has('scripts/build-registry.mts')) {
    return ALL_ENTRIES.map((entry) => entry.name);
  }

  const touched = new Set(
    ALL_ENTRIES.filter((entry) =>
      REGISTRY_BASES.some((b) => (entry.files ?? []).some((file) => files.has(registryFilePath(b, file.path)))),
    ).map((entry) => entry.name),
  );
  // Close over dependents: an item whose dependency changed installs differently too.
  let hasGrown = true;
  while (hasGrown) {
    hasGrown = false;
    for (const entry of ALL_ENTRIES) {
      if (touched.has(entry.name)) continue;
      if ((entry.registryDependencies ?? []).some((dep) => touched.has(dep))) {
        touched.add(entry.name);
        hasGrown = true;
      }
    }
  }

  return [...touched];
};

// Cloudflare serves /r from public/, so any `_headers` rule that retypes JSON breaks the hygiene signal.
const headerProblems = () => {
  const problems: string[] = [];
  const rules = readFileSync(path.join(ROOT, 'public/_headers'), 'utf8').split(/\n(?=\/)/);
  for (const rule of rules) {
    const [pattern, ...lines] = rule.trim().split('\n');
    if (!pattern.startsWith('/')) continue;
    const matcher = new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
    const contentType = lines.find((line) => /^\s*content-type:/i.test(line));
    if (matcher.test('/r/example.json') && contentType && !/application\/json/i.test(contentType)) {
      problems.push(`rule "${pattern}" serves item JSON as "${contentType.split(':')[1].trim()}"`);
    }
  }

  return problems;
};

// Serves one base's public/r over HTTP so the CLI fetches payloads the way it would from the deployed site.
const serve = (dir: string) =>
  new Promise<LocalServer>((resolve) => {
    const server = createServer((request, response) => {
      const file = path.join(dir, decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname));
      try {
        if (!file.startsWith(dir) || !statSync(file).isFile()) throw new Error();
        response.writeHead(200, { 'content-type': file.endsWith('.json') ? 'application/json' : 'text/plain' });
        response.end(readFileSync(file));
      } catch {
        response.writeHead(404).end();
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      resolve({ url: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  const contentType = response.headers.get('content-type') ?? '';

  return { ok: response.ok, status: response.status, contentType, json: response.ok ? await response.json() : null };
};

// The package's main entry is its CLI bin.
const cliPath = createRequire(import.meta.url).resolve('shadcn');
const cliVersion = JSON.parse(readFileSync(path.join(path.dirname(cliPath), '../package.json'), 'utf8')).version;

// Same blank project the monitor uses (dry-run.ts), pointed at the local server.
const writeBlankProject = (dir: string, registryUrl: string) => {
  mkdirSync(path.join(dir, 'app'));
  writeFileSync(path.join(dir, 'app/globals.css'), '@import "tailwindcss";\n');
  writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      name: 'hirael-health',
      private: true,
      dependencies: { next: '16.0.0', react: '19.0.0', 'react-dom': '19.0.0' },
      devDependencies: { tailwindcss: '4.0.0', typescript: '5.0.0' },
    }),
  );
  writeFileSync(
    path.join(dir, 'components.json'),
    JSON.stringify({
      $schema: 'https://ui.shadcn.com/schema.json',
      style: STYLE,
      rsc: true,
      tsx: true,
      tailwind: { config: '', css: 'app/globals.css', baseColor: 'neutral', cssVariables: true, prefix: '' },
      iconLibrary: 'lucide',
      aliases: {
        components: '@/components',
        utils: '@/lib/utils',
        ui: '@/components/ui',
        lib: '@/lib',
        hooks: '@/hooks',
      },
      registries: { [NAMESPACE]: registryUrl },
    }),
  );
  writeFileSync(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['./*'] }, jsx: 'preserve' } }),
  );
};

const dryRun = (item: string, registryUrl: string) => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'hirael-health-'));
  writeBlankProject(dir, registryUrl);
  const started = Date.now();

  return new Promise<DryRunResult>((resolve) => {
    let output = '';
    const child = spawn(
      process.execPath,
      [cliPath, 'add', `${NAMESPACE}/${item}`, '--dry-run', '--yes', '--cwd', dir],
      {
        cwd: dir,
        // A clean environment: no user config, cache or npmrc leaks into the run.
        env: {
          PATH: process.env.PATH,
          TMPDIR: os.tmpdir(),
          XDG_CACHE_HOME: dir,
          XDG_CONFIG_HOME: dir,
          npm_config_userconfig: path.join(dir, '.npmrc'),
          NODE_ENV: 'production',
          CI: '1',
          NO_COLOR: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    const timer = setTimeout(() => child.kill('SIGKILL'), DRY_RUN_TIMEOUT_MS);
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => {
      clearTimeout(timer);
      rmSync(dir, { recursive: true, force: true });
      const text = output
        .replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      // With stdin closed a prompt exits 0 having installed nothing, so it counts as a failure.
      const isPrompted = /\bSelect an? |Use arrow-keys|Would you like/.test(text);
      resolve({
        item,
        ok: code === 0 && !isPrompted,
        ms: Date.now() - started,
        output: (isPrompted ? 'CLI stopped at a prompt: ' : '') + text.slice(-400),
      });
    });
  });
};

// Fetches and validates every item the index lists. Problems land in the two lists.
const fetchItems = async (names: string[], itemUrl: string) => {
  const schemaProblems: string[] = [];
  const nameProblems: string[] = [];
  const items: BuiltItem[] = [];
  for (const name of names) {
    const item = await fetchJson(itemUrl.replace('{name}', name));
    const parsed = item.ok ? registryItemSchema.safeParse(item.json) : null;
    if (!item.ok) schemaProblems.push(`${name}: HTTP ${item.status}`);
    else if (!parsed?.success) schemaProblems.push(`${name}: ${parsed?.error.issues[0]?.message}`);
    else {
      if (parsed.data.name !== name) nameProblems.push(`${name}: payload is named "${parsed.data.name}"`);
      items.push({
        name,
        type: parsed.data.type,
        bytes: JSON.stringify(item.json).length,
        files: parsed.data.files?.length ?? 0,
        json: parsed.data,
      });
    }
  }

  return { items, schemaProblems, nameProblems };
};

const checkInstallability = async (names: string[], itemUrl: string) => {
  console.log('  Installability · 20 pts');
  const started = Date.now();
  const progress = (done: number) => {
    if (process.stdout.isTTY) process.stdout.write(`\r    installing ${done}/${names.length}…`);
  };
  const results = await pool(names, (name) => dryRun(name, itemUrl), progress);
  if (process.stdout.isTTY) process.stdout.write('\r\x1b[2K');

  const failed = results.filter((result) => !result.ok);
  const elapsed = Date.now() - started;
  const average = results.length ? results.reduce((sum, r) => sum + r.ms, 0) / results.length : 0;
  check(
    '    ',
    !failed.length,
    `${results.length - failed.length}/${results.length} \`shadcn add --dry-run\` into a blank project (${seconds(elapsed)}, avg ${seconds(average)} per item)`,
    failed.map((result) => `${result.item}: ${result.output}`),
  );
  const slowest = [...results].sort((a, b) => b.ms - a.ms).slice(0, 3);
  if (slowest.length) console.log(`      slowest: ${slowest.map((r) => `${r.item} ${seconds(r.ms)}`).join(', ')}`);
  if (args.verbose) {
    for (const result of results.filter((r) => r.ok)) console.log(`      ${result.item}: ${result.output}`);
  }
};

// Informational: what the base ships, so a size or dependency drift is visible in the log.
const printPayloadSummary = (items: BuiltItem[]) => {
  const byType = Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      const type = item.type.replace('registry:', '');
      acc[type] = (acc[type] ?? 0) + 1;

      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => plural(count, type))
    .join(', ');
  const deps = items.flatMap((item) => item.json.registryDependencies ?? []);
  const hiraelLinks = new Set(deps.filter((dep) => dep.startsWith('http')));
  const primitives = new Set(deps.filter((dep) => !dep.startsWith('http')));
  const packages = new Set(items.flatMap((item) => item.json.dependencies ?? []));
  const withCssVars = items.filter((item) => item.json.cssVars).length;
  const totalFiles = items.reduce((sum, item) => sum + item.files, 0);
  const totalBytes = items.reduce((sum, item) => sum + item.bytes, 0);
  const largest = [...items].sort((a, b) => b.bytes - a.bytes).slice(0, 3);

  console.log('  Payload');
  console.log(`    ${plural(items.length, 'item')}: ${byType}`);
  console.log(
    `    ${plural(totalFiles, 'file')}, ${kb(totalBytes)} total; largest: ${largest.map((item) => `${item.name} ${kb(item.bytes)}`).join(', ')}`,
  );
  console.log(
    `    depends on ${plural(primitives.size, 'shadcn primitive')}, ${plural(hiraelLinks.size, 'Hirael item')}, ${plural(packages.size, 'npm package')}; ${withCssVars} ship cssVars`,
  );
};

const checkBase = async (base: RegistryBase, selected: string[] | null) => {
  const server = await serve(builtDir(base));
  const itemUrl = `${server.url}/{name}.json`;
  const route = base === 'radix' ? '/r/' : `/r/${base}/`;
  console.log(`\n${BASE_LABELS[base]} · ${route}`);

  const index = await fetchJson(itemUrl.replace('{name}', 'registry'));
  const parsedIndex = index.ok ? registrySchema.safeParse(index.json) : null;
  const names = parsedIndex?.success ? parsedIndex.data.items.map((item) => item.name) : [];
  const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
  const indexName = parsedIndex?.success ? parsedIndex.data.name : '?';

  console.log('  Hygiene');
  check(
    '    ',
    /application\/json/i.test(index.contentType),
    `Index served as application/json (${index.contentType || 'none'})`,
  );
  check(
    '    ',
    !duplicates.length,
    `No duplicate item names (${names.length} unique)`,
    duplicates.map((n) => `duplicate: ${n}`),
  );
  check('    ', `@${indexName}` === NAMESPACE, `Index name "${indexName}" matches the ${NAMESPACE} namespace`);

  console.log('  Correctness · 25 pts');
  check(
    '    ',
    !!parsedIndex?.success,
    `Index ${route}registry.json matches the registry schema (${plural(names.length, 'item')}, ${kb(JSON.stringify(index.json ?? '').length)})`,
    !index.ok
      ? [`HTTP ${index.status}`]
      : parsedIndex && !parsedIndex.success
        ? parsedIndex.error.issues.slice(0, 5).map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        : [],
  );
  const { items, schemaProblems, nameProblems } = await fetchItems(names, itemUrl);
  check('    ', !schemaProblems.length, `${items.length}/${names.length} items match the item schema`, schemaProblems);
  check(
    '    ',
    !nameProblems.length,
    `${items.length - nameProblems.length}/${items.length} items are named after their URL`,
    nameProblems,
  );

  const toDryRun = selected ? names.filter((name) => selected.includes(name)) : names;
  await checkInstallability(toDryRun, itemUrl);
  server.close();

  printPayloadSummary(items);
};

// The deployed site's score, for context next to the local result.
const liveHealth = async (): Promise<LiveHealth | undefined> => {
  try {
    const response = await fetch('https://ui.shadcn.com/r/registries.json', { signal: AbortSignal.timeout(10_000) });
    const registries = (await response.json()) as RegistryListing[];

    return registries.find((registry) => registry.name === NAMESPACE)?.health;
  } catch {
    return undefined;
  }
};

const selected = args.items ? args.items.split(',') : args.changed ? changedItems() : null;
const scope = args.items ? `items ${args.items}` : args.changed ? 'items changed on this branch' : 'every item';

console.log(`Registry health: shadcn's monitor replayed against a local build`);
console.log(
  `  ${scope}, ${bases.join(' + ')}, ${concurrency} workers, shadcn@${cliVersion}, style ${STYLE}${selected ? ` (${plural(selected.length, 'item')} selected)` : ''}\n`,
);

console.log('Build');
if (args.build !== 'false') {
  const started = Date.now();
  run('pnpm registry:gen');
  run('pnpm registry:build');
  check('  ', true, `registry:gen + registry:build (${seconds(Date.now() - started)})`);
} else {
  console.log('  – skipped (--build=false), checking the existing public/r');
}

console.log('\nHygiene · 10 pts');
check(
  '  ',
  REGISTRY_BASE_URL.startsWith('https://'),
  `Production registry is HTTPS (${REGISTRY_BASE_URL}/r/{name}.json)`,
);
const headers = headerProblems();
check('  ', !headers.length, 'public/_headers serves item JSON as application/json', headers);

for (const base of bases) {
  await checkBase(base, selected);
}

console.log('\nReliability · 45 pts');
console.log("  – Uptime of the deployed site, measured by shadcn over 7 and 30 days; a local build can't show it.");
const live = await liveHealth();
if (live) {
  const breakdown = Object.entries(live.breakdown)
    .map(([key, value]) => `${key} ${value}`)
    .join(', ');
  console.log(
    `  Live ${NAMESPACE}: ${live.score} ${live.status} (${breakdown}), checked ${live.checkedAt.slice(0, 16).replace('T', ' ')} UTC`,
  );
} else {
  console.log('  Live score unavailable (ui.shadcn.com/r/registries.json not reachable).');
}

console.log('');
if (failedChecks) {
  console.error(`✗ registry health failed: ${plural(failedChecks, 'check')} failed.`);
  process.exit(1);
}
console.log('✓ registry health OK: every signal shadcn scores from the code passes.');
