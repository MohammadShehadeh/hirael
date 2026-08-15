// Generates registry/hirael/registry-props.json — the per-component API tables
// shown on the showcase's API tab. For every non-block item, walks its exported
// React components with the TS checker and records each component's *own* props
// (declared in the registry source, not inherited HTML/React attributes) with
// type, optionality, destructured default and JSDoc. Run via `pnpm registry:props`.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

import { loadRegistryMeta } from "./build-registry.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_PATH = path.join(ROOT, "registry/hirael/registry-props.json");
const MAX_TYPE_LENGTH = 220;

function createProgram(rootNames) {
  const { config } = ts.readConfigFile(path.join(ROOT, "tsconfig.json"), (p) =>
    readFileSync(p, "utf8"),
  );
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, ROOT);
  return ts.createProgram({ rootNames, options: parsed.options });
}

// Default values destructured in the component's props parameter.
function collectDefaults(decl) {
  const fn =
    decl && ts.isVariableDeclaration(decl) && decl.initializer
      ? decl.initializer
      : decl;
  if (!fn?.parameters?.length) return {};
  const param = fn.parameters[0];
  if (!ts.isObjectBindingPattern(param.name)) return {};
  const defaults = {};
  for (const el of param.name.elements) {
    if (el.initializer) {
      defaults[(el.propertyName ?? el.name).getText()] =
        el.initializer.getText();
    }
  }
  return defaults;
}

function extractComponentApi(checker, exportSymbol) {
  const decl = exportSymbol.valueDeclaration ?? exportSymbol.declarations?.[0];
  if (!decl) return null;
  const signature = checker
    .getTypeOfSymbolAtLocation(exportSymbol, decl)
    .getCallSignatures()[0];
  if (!signature) return null;

  const paramSymbol = signature.parameters[0];
  if (!paramSymbol) return { props: [], extendsNative: false };

  const target =
    exportSymbol.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(exportSymbol)
      : exportSymbol;
  const defaults = collectDefaults(
    target.valueDeclaration ?? target.declarations?.[0],
  );
  const propsType = checker.getTypeOfSymbolAtLocation(
    paramSymbol,
    paramSymbol.valueDeclaration ?? decl,
  );

  const props = [];
  let extendsNative = false;
  for (const prop of propsType.getProperties()) {
    const declarations = prop.declarations ?? [];
    const ownDeclaration = declarations.find((d) =>
      d.getSourceFile().fileName.includes("/registry/hirael/"),
    );
    if (!ownDeclaration) {
      // Inherited from React/HTML attribute types — summarize, don't list.
      extendsNative ||= declarations.some((d) =>
        d.getSourceFile().fileName.includes("node_modules"),
      );
      continue;
    }
    const required = !(prop.flags & ts.SymbolFlags.Optional);
    let type = checker.typeToString(
      checker.getTypeOfSymbolAtLocation(prop, ownDeclaration),
      ownDeclaration,
      ts.TypeFormatFlags.NoTruncation |
        ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    );
    if (type.length > MAX_TYPE_LENGTH)
      type = `${type.slice(0, MAX_TYPE_LENGTH)}…`;
    // Optionality is its own column — `| undefined` in the type is noise.
    if (!required) type = type.replace(/ \| undefined$/, "");
    props.push({
      name: prop.getName(),
      type,
      required,
      default: defaults[prop.getName()] ?? null,
      description:
        ts.displayPartsToString(prop.getDocumentationComment(checker)) || null,
    });
  }

  return { props, extendsNative };
}

async function main() {
  const meta = await loadRegistryMeta();
  const entries = meta.REGISTRY.filter((e) => e.category !== "blocks");
  const rootNames = entries.flatMap((e) =>
    (e.files ?? []).map((f) => path.join(ROOT, f.path)),
  );
  const program = createProgram(rootNames);
  const checker = program.getTypeChecker();

  const out = {};
  for (const entry of entries) {
    const parts = [];
    for (const file of entry.files ?? []) {
      const sourceFile = program.getSourceFile(path.join(ROOT, file.path));
      const moduleSymbol =
        sourceFile && checker.getSymbolAtLocation(sourceFile);
      if (!moduleSymbol) continue;
      for (const exportSymbol of checker.getExportsOfModule(moduleSymbol)) {
        const name = exportSymbol.getName();
        // Components only: PascalCase exported values with call signatures.
        if (!/^[A-Z]/.test(name)) continue;
        const resolved =
          exportSymbol.flags & ts.SymbolFlags.Alias
            ? checker.getAliasedSymbol(exportSymbol)
            : exportSymbol;
        if (!(resolved.flags & ts.SymbolFlags.Value)) continue;
        const api = extractComponentApi(checker, resolved);
        if (api) parts.push({ name, ...api });
      }
    }
    if (parts.length) out[entry.name] = parts;
  }

  writeFileSync(OUT_PATH, `${JSON.stringify(out, null, 2)}\n`);
  const partCount = Object.values(out).reduce((n, p) => n + p.length, 0);
  console.log(
    `✓ registry-props.json generated (${Object.keys(out).length} items, ${partCount} parts)`,
  );
}

await main();
