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
//   6. an item's declared npm `dependencies` drift from the bare packages
//      its source imports directly (implicit react/react-dom/next aside)
//   7. a loader in registry-demos.tsx has no showcased entry (orphan loader)
//   8. BLOCK_KIND_ORDER / COMPONENT_CATEGORY_ORDER omit or duplicate a kind,
//      which would silently drop its items from pagers, indexes and sitemap
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
      // A registry item is referenced either as a ui primitive
      // (`@/registry/hirael/ui/<name>`) or an extended component
      // (`@/registry/hirael/components/<name>`, optionally a file inside the
      // item's folder). The first path segment is the item name.
      const m = node.moduleSpecifier.text.match(
        /^@\/registry\/hirael\/(?:ui|components)\/([a-z0-9-]+)/,
      );
      if (m) deps.add(m[1]);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return deps;
}

// Bare npm package specifiers a source file imports directly — static imports,
// re-exports, and dynamic `import("pkg")` — normalized to the installable
// package name. `@/…` aliases and relative paths are registry-internal, not npm
// packages. React and Next are implicit framework deps every consumer of a
// React/Next.js registry already has, so no item declares them per-item.
const IMPLICIT_PACKAGES = new Set(["react", "react-dom", "next"]);

// `motion/react` → `motion`, `date-fns/format` → `date-fns`,
// `@radix-ui/react-slider` → `@radix-ui/react-slider` (scoped: first two segs),
// `react/jsx-runtime` → `react`.
function packageNameOf(spec) {
  if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/");
  return spec.split("/")[0];
}

function collectPackageImports(src, fileName) {
  const sf = ts.createSourceFile(
    fileName,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const deps = new Set();
  const record = (spec) => {
    if (
      spec.startsWith("@/") ||
      spec.startsWith("./") ||
      spec.startsWith("../")
    ) {
      return;
    }
    const pkg = packageNameOf(spec);
    if (!IMPLICIT_PACKAGES.has(pkg)) deps.add(pkg);
  };
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      record(node.moduleSpecifier.text);
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      record(node.arguments[0].text);
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

// The loader keys a showcased catalog actually needs — filled while iterating
// entries below, then diffed against demoLoaderNames to catch orphan loaders
// (a loader whose registry entry was renamed or removed).
const expectedLoaderNames = new Set();

// 1. registry.json matches the generated output byte-for-byte.
const onDisk = readFileSync(path.join(ROOT, "registry.json"), "utf8");
if (onDisk !== registryJsonText(generated)) {
  fail(
    "registry.json is stale or hand-edited — run `pnpm registry:gen` to regenerate it from registry-meta.ts",
  );
}

// 2–6. Per-entry checks.
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
      expectedLoaderNames.add(ex.slug);
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
  if (isBlock && showcased) {
    expectedLoaderNames.add(entry.name);
    if (!demoLoaderNames.has(entry.name)) {
      fail(
        `"${entry.name}" → missing preview loader in registry-demos.tsx (BLOCK_LOADERS) — its preview/embed would render blank`,
      );
    }
  }

  // Declared dependencies must match what the source actually imports:
  //   registryDependencies ↔ `@/registry/hirael/{ui,components}/*` modules
  //   dependencies (npm)   ↔ bare package specifiers (minus implicit
  //   framework packages). A package reached only through a ui primitive
  //   belongs to that primitive, not here — so this checks each item's own
  //   direct imports and never follows registryDependencies into a primitive.
  const importedRegistry = new Set();
  const importedPackages = new Set();
  for (const p of filePaths) {
    const file = path.join(ROOT, p);
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf8");
    for (const dep of collectUiImports(src, p)) importedRegistry.add(dep);
    for (const dep of collectPackageImports(src, p)) importedPackages.add(dep);
  }

  const declaredRegistry = new Set(entry.registryDependencies ?? []);
  for (const dep of importedRegistry) {
    if (!declaredRegistry.has(dep)) {
      fail(`"${entry.name}" imports "${dep}" but doesn't declare it`);
    }
  }
  for (const dep of declaredRegistry) {
    if (!importedRegistry.has(dep)) {
      fail(`"${entry.name}" declares "${dep}" but never imports it`);
    }
  }

  const declaredPackages = new Set(entry.dependencies ?? []);
  for (const dep of importedPackages) {
    if (!declaredPackages.has(dep)) {
      fail(
        `"${entry.name}" imports npm package "${dep}" but doesn't declare it in dependencies`,
      );
    }
  }
  for (const dep of declaredPackages) {
    if (!importedPackages.has(dep)) {
      fail(
        `"${entry.name}" declares npm dependency "${dep}" but never imports it`,
      );
    }
  }
}

// 7. No orphan loaders: every loader key in registry-demos.tsx maps to a
// showcased entry (a leftover loader for a renamed/removed item lingers
// silently otherwise).
for (const name of demoLoaderNames) {
  if (!expectedLoaderNames.has(name)) {
    fail(
      `registry-demos.tsx has loader "${name}" with no showcased registry entry — remove the orphan loader`,
    );
  }
}

// 8. Ordering arrays must be exhaustive and duplicate-free. They are plain
// arrays TS can't force complete, so a missing kind silently drops its items
// from the detail-page pager, the index and the sitemap.
function checkOrder(arrName, kindLabel, order, expected) {
  const seen = new Set();
  for (const key of order ?? []) {
    if (seen.has(key)) {
      fail(`${arrName} lists ${kindLabel} "${key}" more than once`);
    }
    seen.add(key);
    if (!expected.has(key)) {
      fail(`${arrName} lists "${key}", which is not a known ${kindLabel}`);
    }
  }
  for (const key of expected) {
    if (!seen.has(key)) fail(`${arrName} is missing ${kindLabel} "${key}"`);
  }
}

// BLOCK_KIND_LABELS and REGISTRY_BY_CATEGORY are Record<Union, …>, so TS forces
// their keys to enumerate every BlockKind / ComponentCategory — the exhaustive
// source of truth the plain order arrays are diffed against.
checkOrder(
  "BLOCK_KIND_ORDER",
  "block kind",
  meta.BLOCK_KIND_ORDER,
  new Set(Object.keys(meta.BLOCK_KIND_LABELS)),
);
checkOrder(
  "COMPONENT_CATEGORY_ORDER",
  "component category",
  meta.COMPONENT_CATEGORY_ORDER,
  new Set(
    Object.keys(meta.REGISTRY_BY_CATEGORY).filter(
      (c) => c !== "blocks" && c !== "templates",
    ),
  ),
);

if (errors) {
  console.error(`\n✗ registry check failed — ${errors} problem(s).`);
  process.exit(1);
}
console.log(
  `✓ registry OK — ${meta.REGISTRY.length} showcased + ${meta.DISTRIBUTION_ONLY.length} distribution-only items, registry.json in sync.`,
);
