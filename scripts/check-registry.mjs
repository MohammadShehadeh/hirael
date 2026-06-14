// Registry drift guard.
//
// registry-meta.ts is the single source of truth; registry.json is
// generated from it by scripts/build-registry.mjs. This script fails the
// build early when:
//   1. registry.json is stale (doesn't match what build-registry generates)
//   2. a sourceFile referenced by registry-meta.ts is missing on disk
//   3. a non-block component is missing its sibling demo file
//   4. an item's declared registryDependencies drift from the
//      `@/registry/hirael/ui/*` modules its source actually imports
//   5. a showcased entry is missing its preview loader in
//      registry-demos.tsx, so RegistryDemo renders nothing and its
//      preview / embed iframe comes up blank
//
// Run via `node scripts/check-registry.mjs` (also chained into `build`).

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildRegistry,
  loadRegistryMeta,
  registryJsonText,
} from "./build-registry.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let errors = 0;
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  errors++;
};

const meta = await loadRegistryMeta();
const generated = buildRegistry(meta);
const entries = [...meta.REGISTRY, ...meta.DISTRIBUTION_ONLY];

// Preview loaders registered in registry-demos.tsx, keyed by entry name.
// Every showcased entry needs one, or RegistryDemo returns null and the
// item's preview / embed iframe renders blank. Distribution-only items
// (no showcase page) are intentionally absent.
const demosSrc = readFileSync(
  path.join(ROOT, "registry/hirael/registry-demos.tsx"),
  "utf8",
);
const demoLoaderNames = new Set(
  [...demosSrc.matchAll(/"([^"]+)":\s*\(\)\s*=>/g)].map((m) => m[1]),
);

// 1. registry.json matches the generated output byte-for-byte.
const onDisk = readFileSync(path.join(ROOT, "registry.json"), "utf8");
if (onDisk !== registryJsonText(generated)) {
  fail(
    "registry.json is stale or hand-edited — run `pnpm registry:gen` to regenerate it from registry-meta.ts",
  );
}

// 2–4. Per-entry checks.
for (const entry of entries) {
  const sourceFiles = entry.sourceFiles ?? [];
  for (const p of sourceFiles) {
    if (!existsSync(path.join(ROOT, p))) {
      fail(`"${entry.name}" → missing sourceFile ${p}`);
    }
  }

  const isBlock =
    entry.category === "blocks" ||
    entry.category === "templates" ||
    entry.type === "registry:block";
  const showcased = meta.REGISTRY.includes(entry);
  if (!isBlock && showcased) {
    const demo = `registry/hirael/${entry.name}/${entry.name}.demo.tsx`;
    if (!existsSync(path.join(ROOT, demo))) {
      fail(`component "${entry.name}" → missing demo ${demo}`);
    }
  }

  // Every showcased entry must be registered in registry-demos.tsx or its
  // preview / embed iframe renders blank.
  if (showcased && !demoLoaderNames.has(entry.name)) {
    fail(
      `"${entry.name}" → missing preview loader in registry-demos.tsx (DEMO_LOADERS) — its preview/embed would render blank`,
    );
  }

  // Declared registryDependencies must match the registry modules the
  // source actually imports.
  const imported = new Set();
  for (const p of sourceFiles) {
    const file = path.join(ROOT, p);
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(
      /from "@\/registry\/hirael\/ui\/([a-z0-9-]+)"/g,
    )) {
      imported.add(m[1]);
    }
  }
  const declared = new Set(entry.registryDependencies ?? []);
  for (const dep of imported) {
    if (!declared.has(dep)) {
      fail(`"${entry.name}" imports "${dep}" but doesn't declare it`);
    }
  }
  for (const dep of declared) {
    if (!imported.has(dep)) {
      fail(`"${entry.name}" declares "${dep}" but never imports it`);
    }
  }
}

if (errors) {
  console.error(`\n✗ registry check failed — ${errors} problem(s).`);
  process.exit(1);
}
console.log(
  `✓ registry OK — ${meta.REGISTRY.length} showcased + ${meta.DISTRIBUTION_ONLY.length} distribution-only items, registry.json in sync.`,
);
