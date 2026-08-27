// Runs as `pnpm check:registry` (CI and `pnpm build`). Consistency guard over
// registry-meta.ts: every referenced source and preview file exists, declared
// dependencies match real imports, and the ordering arrays cover every
// category and block kind.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

import {
  BLOCK_KIND_LABELS,
  BLOCK_KIND_ORDER,
  COMPONENT_CATEGORY_ORDER,
  DISTRIBUTION_ONLY,
  REGISTRY,
  REGISTRY_BY_CATEGORY,
  getExamples,
} from "@/registry/hirael/registry-meta";

import {
  ALL_ENTRIES,
  ROOT,
  createReporter,
  isShowcased,
  type RegistryEntry,
} from "./shared.mts";

// Provided by the consumer's framework, never declared by an item.
const IMPLICIT_PACKAGES = new Set(["react", "react-dom", "next"]);
const HIRAEL_IMPORT_PATTERN =
  /^@\/registry\/hirael\/(?:ui|components)\/([a-z0-9-]+)/;

const report = createReporter("registry check");

const parseSource = (source: string, fileName: string) =>
  ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

// `motion/react` → `motion`; `@radix-ui/react-slider` stays scoped.
const packageNameOf = (specifier: string) =>
  specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/")[0];

// Static, re-export and dynamic import specifiers, read from the AST so
// mentions in comments or strings don't count.
const importSpecifiers = (source: string, fileName: string) => {
  const specifiers: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      const [target] = node.arguments;
      if (target && ts.isStringLiteral(target)) specifiers.push(target.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(parseSource(source, fileName));
  return specifiers;
};

const collectImports = (entry: RegistryEntry) => {
  const hiraelItems = new Set<string>();
  const packages = new Set<string>();
  for (const { path: sourcePath } of entry.files ?? []) {
    const file = path.join(ROOT, sourcePath);
    if (!existsSync(file)) continue;
    for (const specifier of importSpecifiers(
      readFileSync(file, "utf8"),
      sourcePath,
    )) {
      const hiraelItem = HIRAEL_IMPORT_PATTERN.exec(specifier)?.[1];
      if (hiraelItem) {
        hiraelItems.add(hiraelItem);
        continue;
      }
      if (/^(@\/|\.\.?\/)/.test(specifier)) continue;
      const pkg = packageNameOf(specifier);
      if (!IMPLICIT_PACKAGES.has(pkg)) packages.add(pkg);
    }
  }
  return { hiraelItems, packages };
};

const checkFiles = (entry: RegistryEntry) => {
  for (const { path: sourcePath } of entry.files ?? []) {
    if (!existsSync(path.join(ROOT, sourcePath))) {
      report.fail(`"${entry.name}" → missing file ${sourcePath}`);
    }
  }
};

// registry-demos.tsx loads previews by naming convention: a component's
// examples at examples/<slug>.tsx, a block or template's primary file at
// registry/hirael/<category>/<name>/<name>.tsx.
const checkPreview = (entry: RegistryEntry) => {
  if (!isShowcased(entry)) return;
  const composite =
    entry.category === "blocks" || entry.category === "templates";
  if (composite) {
    const preview = `registry/hirael/${entry.category}/${entry.name}/${entry.name}.tsx`;
    if (!existsSync(path.join(ROOT, preview))) {
      report.fail(`"${entry.name}" → preview ${preview} missing`);
    }
    return;
  }
  for (const example of getExamples(entry.name)) {
    const demo = `examples/${example.slug}.tsx`;
    if (!existsSync(path.join(ROOT, demo))) {
      report.fail(`component "${entry.name}" → missing example ${demo}`);
    }
  }
};

// A package reached only through a primitive belongs to that primitive.
const checkDependencies = (entry: RegistryEntry) => {
  const imported = collectImports(entry);
  const declaredRegistry = new Set(entry.registryDependencies ?? []);
  const declaredPackages = new Set(entry.dependencies ?? []);

  for (const dep of imported.hiraelItems) {
    if (!declaredRegistry.has(dep))
      report.fail(`"${entry.name}" imports "${dep}" but doesn't declare it`);
  }
  for (const dep of declaredRegistry) {
    if (!imported.hiraelItems.has(dep))
      report.fail(`"${entry.name}" declares "${dep}" but never imports it`);
  }
  for (const dep of imported.packages) {
    if (!declaredPackages.has(dep))
      report.fail(
        `"${entry.name}" imports npm package "${dep}" but doesn't declare it`,
      );
  }
  for (const dep of declaredPackages) {
    if (!imported.packages.has(dep))
      report.fail(
        `"${entry.name}" declares npm dependency "${dep}" but never imports it`,
      );
  }
};

// A kind missing from its ordering array silently drops its items from
// pagers, indexes and the sitemap.
const checkOrder = (
  arrayName: string,
  kindLabel: string,
  order: readonly string[],
  expected: Set<string>,
) => {
  const seen = new Set<string>();
  for (const key of order) {
    if (seen.has(key))
      report.fail(`${arrayName} lists ${kindLabel} "${key}" more than once`);
    seen.add(key);
    if (!expected.has(key))
      report.fail(`${arrayName} lists "${key}", not a known ${kindLabel}`);
  }
  for (const key of expected) {
    if (!seen.has(key))
      report.fail(`${arrayName} is missing ${kindLabel} "${key}"`);
  }
};

for (const entry of ALL_ENTRIES) {
  checkFiles(entry);
  checkPreview(entry);
  checkDependencies(entry);
}

checkOrder(
  "BLOCK_KIND_ORDER",
  "block kind",
  BLOCK_KIND_ORDER,
  new Set(Object.keys(BLOCK_KIND_LABELS)),
);
checkOrder(
  "COMPONENT_CATEGORY_ORDER",
  "component category",
  COMPONENT_CATEGORY_ORDER,
  new Set(
    Object.keys(REGISTRY_BY_CATEGORY).filter(
      (category) => category !== "blocks" && category !== "templates",
    ),
  ),
);

report.finish(
  `registry OK — ${REGISTRY.length} showcased + ${DISTRIBUTION_ONLY.length} distribution-only items, meta consistent.`,
);
