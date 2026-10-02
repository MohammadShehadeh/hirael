// Runs in `pnpm registry:props`. Reads each component's props, JSDoc included,
// from the default base into registry-props.json for the API tables.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

import { DEFAULT_BASE, REGISTRY, registryFilePath } from '@/registry/hirael/registry-meta';

import { ROOT, jsonText } from './shared.mts';

const OUT_PATH = path.join(ROOT, 'registry/hirael/registry-props.json');
const MAX_TYPE_LENGTH = 220;

interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string | null;
}

interface ComponentDoc {
  name: string;
  props: PropDoc[];
  extendsNative: boolean;
  /** `function` for hooks and utilities: rows are parameters and `returns` is set. */
  kind?: 'component' | 'function';
  returns?: string;
}

const createProgram = (rootNames: string[]) => {
  const { config } = ts.readConfigFile(path.join(ROOT, 'tsconfig.json'), (p) => readFileSync(p, 'utf8'));
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, ROOT);

  return ts.createProgram({ rootNames, options: parsed.options });
};

const resolveAlias = (checker: ts.TypeChecker, symbol: ts.Symbol) =>
  symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;

const declarationOf = (symbol: ts.Symbol) => symbol.valueDeclaration ?? symbol.declarations?.[0];

const functionOf = (declaration: ts.Declaration | undefined): ts.SignatureDeclaration | undefined => {
  const node = declaration && ts.isVariableDeclaration(declaration) ? declaration.initializer : declaration;

  return node && ts.isFunctionLike(node) ? node : undefined;
};

const collectDefaults = (declaration: ts.Declaration | undefined) => {
  const defaults: Record<string, string> = {};
  const parameter = functionOf(declaration)?.parameters[0];
  if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return defaults;
  for (const element of parameter.name.elements) {
    if (!element.initializer) continue;
    const key = (element.propertyName ?? element.name).getText();
    defaults[key] = element.initializer.getText();
  }

  return defaults;
};

const extractComponent = (checker: ts.TypeChecker, symbol: ts.Symbol): Omit<ComponentDoc, 'name'> | null => {
  const declaration = declarationOf(symbol);
  if (!declaration) return null;
  const [signature] = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures();
  if (!signature) return null;

  const [propsParameter] = signature.parameters;
  if (!propsParameter) return { props: [], extendsNative: false };

  const defaults = collectDefaults(declarationOf(resolveAlias(checker, symbol)));
  const propsType = checker.getTypeOfSymbolAtLocation(propsParameter, propsParameter.valueDeclaration ?? declaration);

  const props: PropDoc[] = [];
  let extendsNative = false;
  for (const prop of propsType.getProperties()) {
    const declarations = prop.declarations ?? [];
    const own = declarations.find((d) => d.getSourceFile().fileName.includes('/registry/hirael/'));
    if (!own) {
      extendsNative ||= declarations.some((d) => d.getSourceFile().fileName.includes('node_modules'));
      continue;
    }
    const required = !(prop.flags & ts.SymbolFlags.Optional);
    let type = checker.typeToString(
      checker.getTypeOfSymbolAtLocation(prop, own),
      own,
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    );
    if (type.length > MAX_TYPE_LENGTH) {
      type = `${type.slice(0, MAX_TYPE_LENGTH)}…`;
    }
    // Optionality is its own column, so `| undefined` is noise.
    if (!required) type = type.replace(/ \| undefined$/, '');
    props.push({
      name: prop.getName(),
      type,
      required,
      default: defaults[prop.getName()] ?? null,
      description: ts.displayPartsToString(prop.getDocumentationComment(checker)) || null,
    });
  }

  return { props, extendsNative };
};

const typeText = (checker: ts.TypeChecker, type: ts.Type, node: ts.Node) => {
  const text = checker.typeToString(
    type,
    node,
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
  );

  return text.length > MAX_TYPE_LENGTH ? `${text.slice(0, MAX_TYPE_LENGTH)}…` : text;
};

// A single options object documents its fields; anything else documents its positional parameters.
const extractFunction = (checker: ts.TypeChecker, symbol: ts.Symbol): Omit<ComponentDoc, 'name'> | null => {
  const declaration = declarationOf(symbol);
  const fn = functionOf(declaration);
  if (!declaration || !fn) return null;
  const [signature] = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures();
  if (!signature) return null;
  // A written return annotation reads better than the inferred, fully expanded type.
  const returns = fn.type?.getText() ?? typeText(checker, signature.getReturnType(), declaration);
  const [first] = fn.parameters;
  if (fn.parameters.length === 1 && first && ts.isObjectBindingPattern(first.name)) {
    const options = extractComponent(checker, symbol);

    return options && { ...options, kind: 'function', returns };
  }
  const paramDocs = new Map(
    ts
      .getJSDocTags(fn.parent && ts.isVariableDeclaration(fn.parent) ? fn.parent : fn)
      .filter(ts.isJSDocParameterTag)
      .map((tag) => [tag.name.getText(), ts.getTextOfJSDocComment(tag.comment) ?? null] as const),
  );
  const props: PropDoc[] = fn.parameters.map((parameter) => {
    const name = parameter.name.getText();
    const rest = Boolean(parameter.dotDotDotToken);

    return {
      name: rest ? `...${name}` : name,
      type: typeText(checker, checker.getTypeAtLocation(parameter), parameter),
      required: !parameter.questionToken && !parameter.initializer && !rest,
      default: parameter.initializer?.getText() ?? null,
      description: paramDocs.get(name) ?? null,
    };
  });

  return { props, extendsNative: false, kind: 'function', returns };
};

const entries = REGISTRY.filter((entry) => entry.category !== 'blocks');
const program = createProgram(
  entries.flatMap((entry) =>
    (entry.files ?? []).map((file) => path.join(ROOT, registryFilePath(DEFAULT_BASE, file.path))),
  ),
);
const checker = program.getTypeChecker();

const out: Record<string, ComponentDoc[]> = {};
for (const entry of entries) {
  const components: ComponentDoc[] = [];
  for (const file of entry.files ?? []) {
    const sourceFile = program.getSourceFile(path.join(ROOT, registryFilePath(DEFAULT_BASE, file.path)));
    const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) continue;
    const isUtility = entry.category === 'utilities';
    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
      const name = exported.getName();
      if (!isUtility && !/^[A-Z]/.test(name)) continue;
      const resolved = resolveAlias(checker, exported);
      if (!(resolved.flags & ts.SymbolFlags.Value)) continue;
      const api = isUtility ? extractFunction(checker, resolved) : extractComponent(checker, resolved);
      if (api) components.push({ name, ...api });
    }
  }
  if (components.length) out[entry.name] = components;
}

writeFileSync(OUT_PATH, jsonText(out));
const partCount = Object.values(out).reduce((n, parts) => n + parts.length, 0);
console.log(`✓ registry-props.json generated (${Object.keys(out).length} items, ${partCount} parts)`);
