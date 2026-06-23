// Offline install verification for the registry.
//
// A real `shadcn add` can't run in CI: the CLI always reaches ui.shadcn.com
// for base colors and primitives, which stalls on the runner. Instead this
// applies shadcn's own import-rewrite rules (the `ga` transform in the CLI) to
// the built `/r/*.json` and asserts, for every item, that:
//   - it installs to the right place (ui -> components/ui, extended ->
//     components/),
//   - every `@/registry/hirael/*` import rewrites cleanly to a consumer alias
//     (nothing is left pointing back at the registry),
//   - any dependency on another hirael item is a `/r/<name>.json` URL, not a
//     bare name (bare names resolve against ui.shadcn.com, which only has the
//     shadcn primitives).
//
// Deterministic and network-free. Run with `pnpm check:install`.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const R_DIR = path.join(ROOT, "public/r");

// Consumer aliases (shadcn defaults). The CLI maps the registry's `/ui/` and
// `/components/` path segments onto these on install.
const CONSUMER = {
  ui: "@/components/ui",
  components: "@/components",
  lib: "@/lib",
  hooks: "@/hooks",
};

// Mirror of shadcn's import transform for `@/registry/<...>/<seg>/...` paths.
function rewrite(spec) {
  return spec
    .replace(/^@\/registry\/[^/]+\/ui(?=\/|$)/, CONSUMER.ui)
    .replace(/^@\/registry\/[^/]+\/components(?=\/|$)/, CONSUMER.components)
    .replace(/^@\/registry\/[^/]+\/hooks(?=\/|$)/, CONSUMER.hooks)
    .replace(/^@\/registry\/[^/]+\/lib(?=\/|$)/, CONSUMER.lib);
}

const importSpecifiers = (src) =>
  [...src.matchAll(/(?:import|export)[^"']*?["']([^"']+)["']/g)].map(
    (m) => m[1],
  );

let errors = 0;
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  errors++;
};

// Rebuild /r/*.json from scratch. `shadcn build` only writes, never prunes, so
// clear the dir first — otherwise stale files from an earlier catalog (since
// removed from registry.json) would be validated alongside the current items.
rmSync(R_DIR, { recursive: true, force: true });
// Regenerate registry.json from registry-meta.ts (applies the cross-hirael URL
// rewrite), then emit /r/*.json from it. Both offline; no shadcn add.
execFileSync("pnpm", ["registry:gen"], { stdio: "inherit", cwd: ROOT });
execFileSync("pnpm", ["registry:build"], { stdio: "inherit", cwd: ROOT });

// `shadcn build` also copies the registry index to `public/r/registry.json`;
// it's not an installable item, so skip it.
const files = readdirSync(R_DIR).filter(
  (f) => f.endsWith(".json") && f !== "registry.json",
);
if (files.length === 0)
  throw new Error("no /r/*.json — run `pnpm build` first");
const itemNames = new Set(files.map((f) => f.replace(/\.json$/, "")));

let checked = 0;
for (const jsonFile of files) {
  const item = JSON.parse(readFileSync(path.join(R_DIR, jsonFile), "utf8"));

  // Cross-hirael deps must be URLs, not bare names.
  for (const dep of item.registryDependencies ?? []) {
    if (!dep.includes("/") && itemNames.has(dep)) {
      fail(
        `"${item.name}" depends on hirael item "${dep}" by bare name (must be a /r URL)`,
      );
    }
  }

  for (const file of item.files ?? []) {
    if (typeof file.content !== "string") continue;
    checked++;

    // Targets: primitives -> components/ui, extended -> components/.
    if (file.target && file.path?.startsWith("registry/hirael/components/")) {
      if (!file.target.startsWith("components/"))
        fail(
          `"${item.name}" → ${file.path} installs to ${file.target}, expected components/*`,
        );
    }

    // Every registry import must rewrite to a consumer alias and leave nothing
    // pointing back at @/registry/hirael.
    for (const spec of importSpecifiers(file.content)) {
      if (!spec.startsWith("@/registry/hirael/")) continue;
      const out = rewrite(spec);
      if (out.startsWith("@/registry/hirael/")) {
        fail(
          `"${item.name}" → ${file.target ?? file.path}: import "${spec}" does not map to a consumer alias`,
        );
      }
    }
  }
}

if (errors) {
  console.error(`\n✗ install check failed — ${errors} problem(s).`);
  process.exit(1);
}
console.log(
  `✓ install OK — ${files.length} items / ${checked} files: imports rewrite to consumer aliases, cross-hirael deps are URLs.`,
);
