// Registry drift guard.
//
// registry-meta.ts is the single source of truth; registry.json is
// generated from it by scripts/build-registry.mjs. This script fails the
// build early when:
//   1. registry.json is stale (doesn't match what build-registry generates)
//   2. a file referenced by registry-meta.ts is missing on disk
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

import ts from "typescript";

import {
  buildRegistry,
  loadRegistryMeta,
  registryJsonText,
} from "./build-registry.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The `@/registry/hirael/ui/<name>` modules a source file actually imports,
// read from the TS AST so import specifiers inside comments or string
// literals don't count, and quote style / line-wrapping don't matter.
function collectUiImports(src, fileName) {
  const sf = ts.createSourceFile(
    fileName,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const deps = new Set();
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const m = node.moduleSpecifier.text.match(
        /^@\/registry\/hirael\/ui\/([a-z0-9-]+)$/,
      );
      if (m) deps.add(m[1]);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return deps;
}

let errors = 0;
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  errors++;
};

const meta = await loadRegistryMeta();
const generated = buildRegistry(meta);
const entries = [...meta.REGISTRY, ...meta.DISTRIBUTION_ONLY];

// Preview loaders registered in registry-demos.tsx: block/template names in
// BLOCK_LOADERS, component example slugs in EXAMPLE_LOADERS. A showcased entry
// with no matching loader renders blank in its preview / embed iframe.
// Distribution-only items (no showcase page) are intentionally absent.
const demosSrc = readFileSync(
  path.join(ROOT, "registry/hirael/registry-demos.tsx"),
  "utf8",
);
const demoLoaderNames = new Set(
  [...demosSrc.matchAll(/["']?([\w-]+)["']?:\s*\(\)\s*=>/g)].map((m) => m[1]),
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
  const filePaths = (entry.files ?? []).map((f) => f.path);
  for (const p of filePaths) {
    if (!existsSync(path.join(ROOT, p))) {
      fail(`"${entry.name}" → missing file ${p}`);
    }
  }

  const isBlock =
    entry.category === "blocks" ||
    entry.category === "templates" ||
    entry.type === "registry:block";
  const showcased = meta.REGISTRY.includes(entry);
  if (!isBlock && showcased) {
    // Each example needs its source file in examples/ and a slug-keyed loader
    // in EXAMPLE_LOADERS, or its block on the page renders blank.
    for (const ex of meta.getExamples(entry.name)) {
      const demo = `registry/hirael/examples/${ex.slug}.tsx`;
      if (!existsSync(path.join(ROOT, demo))) {
        fail(`component "${entry.name}" → missing example ${demo}`);
      }
      if (!demoLoaderNames.has(ex.slug)) {
        fail(
          `component "${entry.name}" → example "${ex.slug}" has no loader in registry-demos.tsx (EXAMPLE_LOADERS) — its preview would render blank`,
        );
      }
    }
  }

  // Blocks/templates must be registered in BLOCK_LOADERS by name, or their
  // preview / embed iframe renders blank.
  if (isBlock && showcased && !demoLoaderNames.has(entry.name)) {
    fail(
      `"${entry.name}" → missing preview loader in registry-demos.tsx (BLOCK_LOADERS) — its preview/embed would render blank`,
    );
  }

  // Declared registryDependencies must match the registry modules the
  // source actually imports.
  const imported = new Set();
  for (const p of filePaths) {
    const file = path.join(ROOT, p);
    if (!existsSync(file)) continue;
    for (const dep of collectUiImports(readFileSync(file, "utf8"), p)) {
      imported.add(dep);
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
