// Generates registry/hirael/registry-props.json — the per-component API
// tables shown on the showcase's API tab.
//
// For every non-block registry item, walks the exported React components in
// its source files with the TypeScript checker and records each component's
// *own* props (declared inside the registry source, not inherited HTML/React
// attributes), their type text, optionality, destructured default and JSDoc
// description. Run via `pnpm registry:props` (chained into `build`).

import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

import { loadRegistryMeta } from "./build-registry.mjs"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT_PATH = path.join(ROOT, "registry/hirael/registry-props.json")

function createProgram(rootNames) {
  const configFile = ts.readConfigFile(
    path.join(ROOT, "tsconfig.json"),
    (p) => readFileSync(p, "utf8")
  )
  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    ROOT
  )
  return ts.createProgram({ rootNames, options: parsed.options })
}

/** Default values destructured in the component's props parameter. */
function collectDefaults(decl) {
  const fn =
    decl && ts.isVariableDeclaration(decl) && decl.initializer
      ? decl.initializer
      : decl
  if (!fn || !("parameters" in fn) || !fn.parameters?.length) return {}
  const param = fn.parameters[0]
  if (!ts.isObjectBindingPattern(param.name)) return {}
  const defaults = {}
  for (const el of param.name.elements) {
    if (!el.initializer) continue
    const key = (el.propertyName ?? el.name).getText()
    defaults[key] = el.initializer.getText()
  }
  return defaults
}

function extractComponentApi(checker, exportSymbol) {
  const decl = exportSymbol.valueDeclaration ?? exportSymbol.declarations?.[0]
  if (!decl) return null
  const type = checker.getTypeOfSymbolAtLocation(exportSymbol, decl)
  const signatures = type.getCallSignatures()
  if (!signatures.length) return null

  const signature = signatures[0]
  const props = []
  let extendsNative = false

  const paramSymbol = signature.parameters[0]
  if (paramSymbol) {
    const target =
      exportSymbol.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exportSymbol)
        : exportSymbol
    const defaults = collectDefaults(
      target.valueDeclaration ?? target.declarations?.[0]
    )
    const propsType = checker.getTypeOfSymbolAtLocation(
      paramSymbol,
      paramSymbol.valueDeclaration ?? decl
    )
    for (const prop of propsType.getProperties()) {
      const declarations = prop.declarations ?? []
      const ownDeclaration = declarations.find((d) =>
        d.getSourceFile().fileName.includes("/registry/hirael/")
      )
      if (!ownDeclaration) {
        // Inherited from React/HTML attribute types — summarize, don't list.
        if (
          declarations.some((d) =>
            d.getSourceFile().fileName.includes("node_modules")
          )
        ) {
          extendsNative = true
        }
        continue
      }
      const propType = checker.getTypeOfSymbolAtLocation(
        prop,
        ownDeclaration
      )
      let typeText = checker.typeToString(
        propType,
        ownDeclaration,
        ts.TypeFormatFlags.NoTruncation |
          ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
      )
      if (typeText.length > 220) typeText = `${typeText.slice(0, 220)}…`
      const required = !(prop.flags & ts.SymbolFlags.Optional)
      // Optionality is its own column — `| undefined` in the type is noise.
      if (!required) typeText = typeText.replace(/ \| undefined$/, "")
      props.push({
        name: prop.getName(),
        type: typeText,
        required,
        default: defaults[prop.getName()] ?? null,
        description:
          ts.displayPartsToString(prop.getDocumentationComment(checker)) ||
          null,
      })
    }
  }

  return { props, extendsNative }
}

async function main() {
  const meta = await loadRegistryMeta()
  const entries = meta.REGISTRY.filter((e) => e.category !== "blocks")
  const rootNames = entries.flatMap((e) =>
    (e.sourceFiles ?? []).map((f) => path.join(ROOT, f))
  )
  const program = createProgram(rootNames)
  const checker = program.getTypeChecker()

  const out = {}
  for (const entry of entries) {
    const parts = []
    for (const file of entry.sourceFiles ?? []) {
      const sourceFile = program.getSourceFile(path.join(ROOT, file))
      if (!sourceFile) continue
      const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
      if (!moduleSymbol) continue
      for (const exportSymbol of checker.getExportsOfModule(moduleSymbol)) {
        const name = exportSymbol.getName()
        // Components only: PascalCase exported values with call signatures.
        if (!/^[A-Z]/.test(name)) continue
        const resolved =
          exportSymbol.flags & ts.SymbolFlags.Alias
            ? checker.getAliasedSymbol(exportSymbol)
            : exportSymbol
        if (!(resolved.flags & ts.SymbolFlags.Value)) continue
        const api = extractComponentApi(checker, resolved)
        if (!api) continue
        parts.push({ name, ...api })
      }
    }
    if (parts.length) out[entry.name] = parts
  }

  writeFileSync(OUT_PATH, `${JSON.stringify(out, null, 2)}\n`)
  const partCount = Object.values(out).reduce((n, p) => n + p.length, 0)
  console.log(
    `✓ registry-props.json generated (${Object.keys(out).length} items, ${partCount} parts)`
  )
}

await main()
