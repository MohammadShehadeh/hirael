// Regenerates the `redirects` array in vercel.json from registry-meta.ts.
//
// Detail pages live under their category segment (`/components/<category>/<name>`,
// `/blocks/<category>/<name>`). This keeps the old flat URLs alive as permanent
// redirects so existing links and search results don't 404:
//   - legacy bare `/<name>` (history: components once lived at the site root),
//   - `/components/<name>`  → `/components/<category>/<name>`,
//   - `/blocks/<name>`      → `/blocks/<category>/<name>`.
//
// Run via `pnpm registry:gen` (or `pnpm redirects:gen`) and commit the result.
// vercel.json is read by Vercel from the repo, not from the build output, so it
// has to be regenerated at authoring time, never during the deploy build.

import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { loadRegistryMeta } from "./build-registry.mjs"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const VERCEL_PATH = path.join(ROOT, "vercel.json")

const BARE = /^\/([^/]+)$/

async function main() {
  const { REGISTRY, COMPONENTS, entryHref } = await loadRegistryMeta()

  const byName = new Map(REGISTRY.map((entry) => [entry.name, entry]))
  const blocks = REGISTRY.filter((entry) => entry.category === "blocks")

  const vercel = JSON.parse(readFileSync(VERCEL_PATH, "utf8"))

  // Preserve exactly the historical bare `/<name>` redirects, retargeted to the
  // new nested path. We don't invent new bare URLs for items that never had one.
  const bare = (vercel.redirects ?? [])
    .map((r) => BARE.exec(r.source)?.[1])
    .filter((name) => name && byName.has(name))
    .map((name) => ({
      source: `/${name}`,
      destination: entryHref(byName.get(name)),
      permanent: true,
    }))

  const componentRedirects = COMPONENTS.map((entry) => ({
    source: `/components/${entry.name}`,
    destination: entryHref(entry),
    permanent: true,
  }))

  const blockRedirects = blocks.map((entry) => ({
    source: `/blocks/${entry.name}`,
    destination: entryHref(entry),
    permanent: true,
  }))

  vercel.redirects = [...bare, ...componentRedirects, ...blockRedirects].sort(
    (a, b) => a.source.localeCompare(b.source)
  )

  writeFileSync(VERCEL_PATH, `${JSON.stringify(vercel, null, 2)}\n`)
  console.log(`✓ vercel.json redirects generated (${vercel.redirects.length})`)
}

await main()
