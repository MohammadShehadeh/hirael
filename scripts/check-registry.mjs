// Registry drift guard.
//
// Keeps the two hand-maintained sources honest and fails the build early if
// they drift:
//   1. every file referenced by registry.json exists on disk
//   2. every showcased entry (registry-meta.ts) is also distributable
//      (present in registry.json)
//   3. every sourceFile referenced by registry-meta.ts exists
//   4. every non-block component has a sibling demo file
//
// Run via `node scripts/check-registry.mjs` (also chained into `build`).

import { existsSync, readFileSync } from "node:fs"

let errors = 0
const fail = (msg) => {
  console.error(`  ✗ ${msg}`)
  errors++
}

// 1. registry.json — every declared file path resolves.
const reg = JSON.parse(readFileSync("registry.json", "utf8"))
const regNames = new Set()
for (const item of reg.items ?? []) {
  regNames.add(item.name)
  for (const f of item.files ?? []) {
    if (!existsSync(f.path)) {
      fail(`registry.json: "${item.name}" → missing file ${f.path}`)
    }
  }
}

// 2–4. registry-meta.ts entries (parsed from source — it's data-only).
const meta = readFileSync("registry/hirael/registry-meta.ts", "utf8")
const entryRe = /\{\s*\n\s*name: "([^"]+)"[\s\S]*?\n {2}\}/g
let m
let count = 0
while ((m = entryRe.exec(meta)) !== null) {
  const body = m[0]
  const name = m[1]
  count++

  if (!regNames.has(name)) {
    fail(`registry-meta: "${name}" is showcased but missing from registry.json`)
  }

  const sf = body.match(/sourceFiles: \[([^\]]*)\]/)
  if (sf) {
    for (const p of [...sf[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])) {
      if (!existsSync(p)) {
        fail(`registry-meta: "${name}" → missing sourceFile ${p}`)
      }
    }
  }

  const isComposite = /category: "(?:blocks|templates)"/.test(body)
  if (!isComposite) {
    const demo = `registry/hirael/${name}/${name}.demo.tsx`
    if (!existsSync(demo)) {
      fail(`registry-meta: component "${name}" → missing demo ${demo}`)
    }
  }
}

if (count === 0) {
  fail("registry-meta: parsed 0 entries — the parser may have drifted")
}

if (errors) {
  console.error(`\n✗ registry check failed — ${errors} problem(s).`)
  process.exit(1)
}
console.log(
  `✓ registry OK — ${count} showcased entries, ${reg.items.length} registry.json items, all referenced files present.`
)
