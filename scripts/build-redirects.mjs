// Regenerates the `redirects` array in vercel.json from registry-meta.ts.
// Detail pages moved under category segments, so keep the old flat URLs alive
// as permanent redirects: legacy bare `/<name>`, `/components/<name>`, and
// `/blocks/<name>`. vercel.json is read from the repo, so regenerate at
// authoring time (via `pnpm registry:gen`), never during the deploy build.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadRegistryMeta } from "./build-registry.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERCEL_PATH = path.join(ROOT, "vercel.json");
const BARE = /^\/([^/]+)$/;

async function main() {
  const { REGISTRY, COMPONENTS, entryHref } = await loadRegistryMeta();
  const byName = new Map(REGISTRY.map((entry) => [entry.name, entry]));
  const vercel = JSON.parse(readFileSync(VERCEL_PATH, "utf8"));

  // Preserve exactly the historical bare `/<name>` redirects, retargeted to the
  // nested path — we don't invent new bare URLs for items that never had one.
  const bare = (vercel.redirects ?? [])
    .map((r) => BARE.exec(r.source)?.[1])
    .filter((name) => name && byName.has(name))
    .map((name) => ({
      source: `/${name}`,
      destination: entryHref(byName.get(name)),
      permanent: true,
    }));

  const nested = (entries, prefix) =>
    entries.map((entry) => ({
      source: `${prefix}/${entry.name}`,
      destination: entryHref(entry),
      permanent: true,
    }));

  vercel.redirects = [
    ...bare,
    ...nested(COMPONENTS, "/components"),
    ...nested(
      REGISTRY.filter((e) => e.category === "blocks"),
      "/blocks",
    ),
  ].sort((a, b) => a.source.localeCompare(b.source));

  writeFileSync(VERCEL_PATH, `${JSON.stringify(vercel, null, 2)}\n`);
  console.log(`✓ vercel.json redirects generated (${vercel.redirects.length})`);
}

await main();
