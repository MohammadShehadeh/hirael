// Registry drift guard. registry-meta.ts is the source of truth; registry.json
// is generated from it. Fails the build when the two drift, a referenced source
// or preview file is missing, declared deps don't match actual imports, or a
// category/block-kind ordering array is incomplete. Run via `pnpm check:registry`.

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

function parse(src, fileName) {
  return ts.createSourceFile(
    fileName,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
}

// The hirael items a source file imports, read from the AST so specifiers in
// comments or strings don't count. First path segment is the item name.
function collectUiImports(src, fileName) {
  const deps = new Set();
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      ts.isStringLiteral(node.moduleSpecifier ?? {})
    ) {
      const m = node.moduleSpecifier.text.match(
        /^@\/registry\/hirael\/(?:ui|components)\/([a-z0-9-]+)/,
      );
      if (m) deps.add(m[1]);
    }
    ts.forEachChild(node, visit);
  };
  visit(parse(src, fileName));
  return deps;
}

// react/react-dom/next are implicit framework deps no item declares.
const IMPLICIT_PACKAGES = new Set(["react", "react-dom", "next"]);

// `motion/react` → `motion`; `@radix-ui/react-slider` stays scoped.
function packageNameOf(spec) {
  return spec.startsWith("@")
    ? spec.split("/").slice(0, 2).join("/")
    : spec.split("/")[0];
}

// Bare npm packages a source imports directly (static, re-export, dynamic),
// minus implicit framework deps. `@/` aliases and relative paths are internal.
function collectPackageImports(src, fileName) {
  const deps = new Set();
  const record = (spec) => {
    if (/^(@\/|\.\.?\/)/.test(spec)) return;
    const pkg = packageNameOf(spec);
    if (!IMPLICIT_PACKAGES.has(pkg)) deps.add(pkg);
  };
  const visit = (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      ts.isStringLiteral(node.moduleSpecifier ?? {})
    ) {
      record(node.moduleSpecifier.text);
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      ts.isStringLiteral(node.arguments[0] ?? {})
    ) {
      record(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };
  visit(parse(src, fileName));
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

// registry.json must match the generated output byte-for-byte.
if (
  readFileSync(path.join(ROOT, "registry.json"), "utf8") !==
  registryJsonText(generated)
) {
  fail(
    "registry.json is stale or hand-edited — run `pnpm registry:gen` to regenerate it",
  );
}

for (const entry of entries) {
  const filePaths = (entry.files ?? []).map((f) => f.path);
  for (const p of filePaths) {
    if (!existsSync(path.join(ROOT, p)))
      fail(`"${entry.name}" → missing file ${p}`);
  }

  const isBlock =
    entry.category === "blocks" ||
    entry.category === "templates" ||
    entry.type === "registry:block";
  const showcased = meta.REGISTRY.includes(entry);

  // registry-demos.tsx loads previews straight from the file layout, so the
  // guarantee here is that the file each preview imports exists and follows the
  // naming convention: a component's example at examples/<slug>.tsx, a
  // block/template's primary at <category>/<name>/<name>.tsx.
  if (showcased && !isBlock) {
    for (const ex of meta.getExamples(entry.name)) {
      const demo = `examples/${ex.slug}.tsx`;
      if (!existsSync(path.join(ROOT, demo))) {
        fail(`component "${entry.name}" → missing example ${demo}`);
      }
    }
  }
  if (showcased && isBlock) {
    const preview = `registry/hirael/${entry.category}/${entry.name}/${entry.name}.tsx`;
    if (!existsSync(path.join(ROOT, preview))) {
      fail(
        `"${entry.name}" → preview ${preview} missing (registry-demos.tsx loads it by name/category convention)`,
      );
    }
  }

  // Declared deps must match what the source directly imports. A package reached
  // only through a ui primitive belongs to that primitive, not here.
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
    if (!declaredRegistry.has(dep))
      fail(`"${entry.name}" imports "${dep}" but doesn't declare it`);
  }
  for (const dep of declaredRegistry) {
    if (!importedRegistry.has(dep))
      fail(`"${entry.name}" declares "${dep}" but never imports it`);
  }

  const declaredPackages = new Set(entry.dependencies ?? []);
  for (const dep of importedPackages) {
    if (!declaredPackages.has(dep))
      fail(
        `"${entry.name}" imports npm package "${dep}" but doesn't declare it`,
      );
  }
  for (const dep of declaredPackages) {
    if (!importedPackages.has(dep))
      fail(
        `"${entry.name}" declares npm dependency "${dep}" but never imports it`,
      );
  }
}

// Ordering arrays are plain arrays TS can't force complete; a missing kind
// silently drops its items from pagers, indexes and the sitemap.
function checkOrder(arrName, kindLabel, order, expected) {
  const seen = new Set();
  for (const key of order ?? []) {
    if (seen.has(key))
      fail(`${arrName} lists ${kindLabel} "${key}" more than once`);
    seen.add(key);
    if (!expected.has(key))
      fail(`${arrName} lists "${key}", not a known ${kindLabel}`);
  }
  for (const key of expected) {
    if (!seen.has(key)) fail(`${arrName} is missing ${kindLabel} "${key}"`);
  }
}

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
