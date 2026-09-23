// Runs in `pnpm check:registry`, before `shadcn build`. Checks registry-meta.ts
// against both base trees: every declared file and preview exists, declared
// dependencies match what the source imports, shipped source uses no site-only
// class or token, and the order arrays cover every category exactly once.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

import {
  BASE_UI_PACKAGE,
  BLOCK_KIND_LABELS,
  BLOCK_KIND_ORDER,
  COMPONENT_CATEGORY_ORDER,
  DISTRIBUTION_ONLY,
  REGISTRY,
  REGISTRY_BASES,
  REGISTRY_BY_CATEGORY,
  basePackages,
  getExamples,
  registryFilePath,
  type RegistryBase,
} from '@/registry/hirael/registry-meta';

import { ALL_ENTRIES, ROOT, createReporter, isShowcased, type RegistryEntry } from './shared.mts';

const IMPLICIT_PACKAGES = new Set(['react', 'react-dom', 'next']);
const HIRAEL_IMPORT_PATTERN = /^@\/registry\/hirael\/bases\/[a-z]+\/(?:ui|components)\/([a-z0-9-]+)/;

const report = createReporter('registry check');

// Every check runs per base, so every failure names the base.
const label = (base: RegistryBase, entry: RegistryEntry) => `"${entry.name}" [${base}]`;

const GLOBALS_CSS = readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8');

const parseSource = (source: string, fileName: string) =>
  ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const packageNameOf = (specifier: string) =>
  specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];

// Read from the AST so mentions in comments or strings don't count.
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
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const [target] = node.arguments;
      if (target && ts.isStringLiteral(target)) specifiers.push(target.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(parseSource(source, fileName));

  return specifiers;
};

const collectImports = (base: RegistryBase, entry: RegistryEntry) => {
  const hiraelItems = new Set<string>();
  const packages = new Set<string>();
  for (const { path: sourcePath } of entry.files ?? []) {
    const file = path.join(ROOT, registryFilePath(base, sourcePath));
    if (!existsSync(file)) continue;
    for (const specifier of importSpecifiers(readFileSync(file, 'utf8'), sourcePath)) {
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

const checkFiles = (base: RegistryBase, entry: RegistryEntry) => {
  for (const { path: sourcePath } of entry.files ?? []) {
    if (!existsSync(path.join(ROOT, registryFilePath(base, sourcePath)))) {
      report.fail(`${label(base, entry)} missing file ${sourcePath}`);
    }
  }
};

const checkPreview = (base: RegistryBase, entry: RegistryEntry) => {
  if (!isShowcased(entry)) return;
  const composite = entry.category === 'blocks' || entry.category === 'templates';
  if (composite) {
    const preview = registryFilePath(base, `${entry.category}/${entry.name}/${entry.name}.tsx`);
    if (!existsSync(path.join(ROOT, preview))) {
      report.fail(`${label(base, entry)} missing preview ${preview}`);
    }

    return;
  }
  for (const example of getExamples(entry.name)) {
    const demo = registryFilePath(base, `examples/${example.slug}.tsx`);
    if (!existsSync(path.join(ROOT, demo))) {
      report.fail(`${label(base, entry)} missing example ${demo}`);
    }
  }
};

// A package reached only through a primitive belongs to that primitive. Declared
// packages are the Radix set; the Base UI tree is checked against its mapped set.
const checkDependencies = (base: RegistryBase, entry: RegistryEntry) => {
  const imported = collectImports(base, entry);
  const declaredRegistry = new Set(entry.registryDependencies ?? []);
  const declaredPackages = new Set(
    basePackages(base, entry.dependencies ?? [], imported.packages.has(BASE_UI_PACKAGE)),
  );

  const who = label(base, entry);
  for (const dep of imported.hiraelItems) {
    if (!declaredRegistry.has(dep)) report.fail(`${who} imports "${dep}" but doesn't declare it`);
  }
  for (const dep of declaredRegistry) {
    if (!imported.hiraelItems.has(dep)) report.fail(`${who} declares "${dep}" but never imports it`);
  }
  for (const dep of imported.packages) {
    if (!declaredPackages.has(dep)) report.fail(`${who} imports npm package "${dep}" but doesn't declare it`);
  }
  for (const dep of declaredPackages) {
    if (!imported.packages.has(dep)) report.fail(`${who} declares npm dependency "${dep}" but never imports it`);
  }
};

// Classes defined only in the site's globals.css render here but vanish in a consumer's project.
const SITE_ONLY_CLASSES = new Set(
  [...GLOBALS_CSS.matchAll(/^\s*(?:@utility\s+|\.)([a-z][\w-]*)\s*\{/gm)]
    .map(([, name]) => name)
    .filter((name) => !['dark', 'light', 'shiki'].includes(name)),
);

const classTokens = (source: string, fileName: string) => {
  const tokens = new Set<string>();
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node)) {
      for (const token of node.text.split(/\s+/)) tokens.add(token.slice(token.lastIndexOf(':') + 1));
    }
    ts.forEachChild(node, visit);
  };
  visit(parseSource(source, fileName));

  return tokens;
};

// Items adopt the consumer's theme, so they may only use shadcn's tokens plus the
// status tokens they ship. Any other `--x` declared on the site's `:root` is
// site-only; `chart-*` and `sidebar*` are shadcn's and stay allowed.
const THEME_TOKENS = new Set([
  ...['background', 'foreground', 'radius', 'border', 'input', 'ring', 'success', 'warning', 'info'],
  ...['card', 'popover', 'primary', 'secondary', 'muted', 'accent', 'destructive'].flatMap((t) => [
    t,
    `${t}-foreground`,
  ]),
]);
const ROOT_BLOCK = GLOBALS_CSS.match(/^:root \{[\s\S]*?^\}/m)?.[0] ?? '';
const SITE_ONLY_TOKENS = [...ROOT_BLOCK.matchAll(/^\s*--([a-z][\w-]*):/gm)]
  .map(([, name]) => name)
  .filter((name) => !THEME_TOKENS.has(name) && !/^(chart-\d|sidebar)/.test(name));
const SITE_TOKEN_PATTERN = new RegExp(`(?:-|--)(${SITE_ONLY_TOKENS.join('|')})(?![\\w-])`);

const checkSiteOnlyClasses = (base: RegistryBase, entry: RegistryEntry) => {
  for (const { path: sourcePath } of entry.files ?? []) {
    const file = path.join(ROOT, registryFilePath(base, sourcePath));
    if (!existsSync(file)) continue;
    for (const token of classTokens(readFileSync(file, 'utf8'), sourcePath)) {
      if (SITE_ONLY_CLASSES.has(token)) {
        report.fail(`${label(base, entry)} uses site-only class "${token}" (defined in app/globals.css)`);
      }
      const siteToken = SITE_ONLY_TOKENS.length ? token.match(SITE_TOKEN_PATTERN)?.[1] : undefined;
      if (siteToken) report.fail(`${label(base, entry)} uses site-only token "--${siteToken}" in "${token}"`);
    }
  }
};

const checkOrder = (arrayName: string, kindLabel: string, order: readonly string[], expected: Set<string>) => {
  const seen = new Set<string>();
  for (const key of order) {
    if (seen.has(key)) report.fail(`${arrayName} lists ${kindLabel} "${key}" more than once`);
    seen.add(key);
    if (!expected.has(key)) report.fail(`${arrayName} lists "${key}", not a known ${kindLabel}`);
  }
  for (const key of expected) {
    if (!seen.has(key)) report.fail(`${arrayName} is missing ${kindLabel} "${key}"`);
  }
};

for (const base of REGISTRY_BASES) {
  for (const entry of ALL_ENTRIES) {
    checkFiles(base, entry);
    checkPreview(base, entry);
    checkDependencies(base, entry);
    checkSiteOnlyClasses(base, entry);
  }
}

checkOrder('BLOCK_KIND_ORDER', 'block kind', BLOCK_KIND_ORDER, new Set(Object.keys(BLOCK_KIND_LABELS)));
checkOrder(
  'COMPONENT_CATEGORY_ORDER',
  'component category',
  COMPONENT_CATEGORY_ORDER,
  new Set(Object.keys(REGISTRY_BY_CATEGORY).filter((category) => category !== 'blocks' && category !== 'templates')),
);

report.finish(
  `registry OK — ${REGISTRY.length} showcased + ${DISTRIBUTION_ONLY.length} distribution-only items, meta consistent.`,
);
