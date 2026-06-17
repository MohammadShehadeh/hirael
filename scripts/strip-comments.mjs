// Strip comments from registry .ts/.tsx files using the TypeScript parser.
// We walk the AST and collect every leading/trailing comment range, then
// excise just those byte ranges from the original source. The parser is
// fully JSX-aware, so URLs in JSX text and `{/* … */}` comments are
// classified correctly.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import ts from "typescript";

function collectCommentRanges(src, fileName) {
  const sf = ts.createSourceFile(
    fileName,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const seen = new Set();
  const ranges = [];

  function push(rs) {
    if (!rs) return;
    for (const r of rs) {
      const key = `${r.pos}:${r.end}`;
      if (seen.has(key)) continue;
      seen.add(key);
      ranges.push([r.pos, r.end]);
    }
  }

  function visit(node) {
    push(ts.getLeadingCommentRanges(src, node.getFullStart()));
    push(ts.getTrailingCommentRanges(src, node.getEnd()));
    ts.forEachChild(node, visit);
  }
  visit(sf);

  // The parser doesn't always attach comments inside JSX children — sweep
  // them manually with the scanner, only inside JSX expression containers.
  // (Top-level block + line comments are already covered above.)
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.JSX,
    src,
  );
  function sweepExpression(start, end) {
    scanner.setTextPos(start);
    while (scanner.getTokenPos() < end) {
      const t = scanner.scan();
      if (t === ts.SyntaxKind.EndOfFileToken) break;
      if (
        t === ts.SyntaxKind.SingleLineCommentTrivia ||
        t === ts.SyntaxKind.MultiLineCommentTrivia
      ) {
        const p = scanner.getTokenPos();
        const e = scanner.getTokenEnd();
        if (p >= start && e <= end) {
          const key = `${p}:${e}`;
          if (!seen.has(key)) {
            seen.add(key);
            ranges.push([p, e]);
          }
        }
      }
    }
  }
  function visitJsx(node) {
    if (ts.isJsxExpression(node)) {
      sweepExpression(node.getStart(sf), node.getEnd());
    }
    ts.forEachChild(node, visitJsx);
  }
  visitJsx(sf);

  return ranges;
}

// Collapse runs of 3+ newlines (left behind when a comment line is removed)
// down to a single blank line — but never inside a string/template/regex
// literal, whose internal newlines are meaningful source the consumer copies
// verbatim.
function collapseBlankLines(src, fileName) {
  const sf = ts.createSourceFile(
    fileName,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const protectedSpans = [];
  function visit(node) {
    if (
      ts.isStringLiteralLike(node) ||
      ts.isTemplateExpression(node) ||
      ts.isRegularExpressionLiteral(node)
    ) {
      protectedSpans.push([node.getStart(sf), node.getEnd()]);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  const inProtected = (offset) =>
    protectedSpans.some(([s, e]) => offset >= s && offset < e);

  return src.replace(/\n{3,}/g, (match, offset) =>
    inProtected(offset) ? match : "\n\n",
  );
}

function stripComments(src, fileName) {
  const ranges = collectCommentRanges(src, fileName);
  if (ranges.length === 0) return src;

  ranges.sort((a, b) => b[0] - a[0]);
  let out = src;
  for (const [start, end] of ranges) {
    let from = start;
    let to = end;
    const lineStart = out.lastIndexOf("\n", from - 1) + 1;
    const before = out.slice(lineStart, from);
    if (/^\s*$/.test(before)) {
      from = lineStart;
      if (out[to] === "\n") to = to + 1;
    } else {
      const trimmed = before.replace(/\s+$/, "");
      from = lineStart + trimmed.length;
    }
    out = out.slice(0, from) + out.slice(to);
  }

  out = collapseBlankLines(out, fileName);
  if (!out.endsWith("\n")) out += "\n";
  return out;
}

async function walk(dir, acc = []) {
  const ents = await fs.readdir(dir, { withFileTypes: true });
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else if (e.isFile() && (e.name.endsWith(".ts") || e.name.endsWith(".tsx")))
      acc.push(p);
  }
  return acc;
}

const root = process.argv[2] ?? "registry/hirael";
const files = await walk(root);
let changed = 0;
for (const f of files) {
  const src = await fs.readFile(f, "utf8");
  const next = stripComments(src, f);
  if (next !== src) {
    await fs.writeFile(f, next, "utf8");
    changed++;
  }
}
console.log(`stripped ${changed} / ${files.length} files`);
