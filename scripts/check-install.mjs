// Offline install verification. A real `shadcn add` can't run in CI (the CLI
// reaches ui.shadcn.com and stalls the runner), so this applies shadcn's own
// import-rewrite rules to the built `/r/*.json` and asserts, per item, that it
// installs to the right place, every `@/registry/hirael/*` import rewrites to a
// consumer alias, and cross-hirael deps are `/r/<name>.json` URLs (not bare
// names, which resolve against ui.shadcn.com). Run with `pnpm check:install`.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const R_DIR = path.join(ROOT, "public/r");

// Consumer aliases (shadcn defaults) the CLI maps registry path segments onto.
const CONSUMER = {
  ui: "@/components/ui",
  components: "@/components",
  lib: "@/lib",
  hooks: "@/hooks",
};

// Mirror of shadcn's import transform for `@/registry/<...>/<seg>/...` paths.
const rewrite = (spec) =>
  Object.entries(CONSUMER).reduce(
    (s, [seg, alias]) =>
      s.replace(new RegExp(`^@/registry/[^/]+/${seg}(?=/|$)`), alias),
    spec,
  );

const importSpecifiers = (src) =>
  [...src.matchAll(/(?:import|export)[^"']*?["']([^"']+)["']/g)].map(
    (m) => m[1],
  );

let errors = 0;
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  errors++;
};

// Rebuild /r/*.json from scratch — `shadcn build` writes but never prunes, so
// stale files from a since-removed catalog would be validated otherwise.
// `shell: true` resolves pnpm's launcher (the Windows `pnpm.cmd` shim, which
// Node won't execFile directly); the static args carry no injection risk.
rmSync(R_DIR, { recursive: true, force: true });
const run = (script) =>
  execFileSync("pnpm", [script], { stdio: "inherit", cwd: ROOT, shell: true });
run("registry:gen");
run("registry:build");

// `shadcn build` also copies the registry index to public/r/registry.json,
// which isn't an installable item.
const files = readdirSync(R_DIR).filter(
  (f) => f.endsWith(".json") && f !== "registry.json",
);
if (files.length === 0)
  throw new Error("no /r/*.json — run `pnpm build` first");
const itemNames = new Set(files.map((f) => f.replace(/\.json$/, "")));

let checked = 0;
for (const jsonFile of files) {
  const item = JSON.parse(readFileSync(path.join(R_DIR, jsonFile), "utf8"));

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

    // Extended components install under components/; primitives under components/ui.
    if (
      file.path?.startsWith("registry/hirael/components/") &&
      file.target &&
      !file.target.startsWith("components/")
    ) {
      fail(
        `"${item.name}" → ${file.path} installs to ${file.target}, expected components/*`,
      );
    }

    for (const spec of importSpecifiers(file.content)) {
      if (
        spec.startsWith("@/registry/hirael/") &&
        rewrite(spec).startsWith("@/registry/hirael/")
      ) {
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
