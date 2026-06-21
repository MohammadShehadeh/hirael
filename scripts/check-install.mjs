// Real `shadcn add` smoke test for the registry.
//
// Builds the registry with `registryDependencies` URLs pointed at a local
// server, serves `/r/*.json`, then runs the real shadcn CLI to install a
// component into a throwaway consumer project and asserts:
//   - extended components land under the consumer's `components/` (not `ui/`),
//   - a cross-hirael dependency (date-picker -> calendar-utils) is pulled in
//     via its `/r/*.json` URL, proving deps resolve against hirael and not the
//     default ui.shadcn.com registry,
//   - every `@/registry/hirael/*` import is rewritten to the consumer's aliases.
//
// Needs network: shadcn fetches base colors and shadcn primitives from
// ui.shadcn.com, so this runs in CI, not in the sandboxed dev environment.
// Run with `pnpm check:install`.

import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  createReadStream,
  existsSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.CHECK_INSTALL_PORT ?? 4499);
const BASE = `http://localhost:${PORT}`;
const SHADCN = path.join(ROOT, "node_modules/.bin/shadcn");

function run(cmd, args, opts = {}) {
  execFileSync(cmd, args, { stdio: "inherit", cwd: ROOT, ...opts });
}

let server;
let consumer;
let ok = false;
try {
  // 1. Generate registry.json + /r/*.json with deps pointed at the local server.
  console.log(`• building registry with deps -> ${BASE}`);
  run("node", ["scripts/build-registry.mjs"], {
    env: { ...process.env, REGISTRY_BASE_URL: BASE },
  });
  run("pnpm", ["registry:build"]);

  // 2. Serve public/ (so /r/<name>.json is reachable).
  server = createServer((req, res) => {
    const file = path.join(ROOT, "public", (req.url ?? "/").split("?")[0]);
    if (!file.startsWith(path.join(ROOT, "public")) || !existsSync(file)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { "content-type": "application/json" });
    createReadStream(file).pipe(res);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, resolve);
  });
  console.log(`• serving registry on ${BASE}`);

  // 3. Throwaway consumer project with standard shadcn aliases.
  consumer = mkdtempSync(path.join(tmpdir(), "hirael-consumer-"));
  mkdirSync(path.join(consumer, "app"), { recursive: true });
  writeFileSync(
    path.join(consumer, "components.json"),
    JSON.stringify({
      $schema: "https://ui.shadcn.com/schema.json",
      style: "new-york",
      rsc: true,
      tsx: true,
      tailwind: {
        config: "",
        css: "app/globals.css",
        baseColor: "zinc",
        cssVariables: true,
        prefix: "",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        ui: "@/components/ui",
        lib: "@/lib",
        hooks: "@/hooks",
      },
      iconLibrary: "lucide",
    }),
  );
  writeFileSync(
    path.join(consumer, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./*"] } },
    }),
  );
  writeFileSync(
    path.join(consumer, "package.json"),
    JSON.stringify({
      name: "hirael-consumer",
      version: "0.0.0",
      private: true,
    }),
  );
  writeFileSync(
    path.join(consumer, "app/globals.css"),
    '@import "tailwindcss";\n',
  );
  console.log(`• consumer at ${consumer}`);

  // 4. Real install of a components/ item that pulls a cross-hirael dep.
  console.log("• shadcn add date-picker");
  run(
    SHADCN,
    [
      "add",
      `${BASE}/r/date-picker.json`,
      "--yes",
      "--overwrite",
      "--cwd",
      consumer,
    ],
    { timeout: 240_000 },
  );

  // 5. Assert the install landed where we expect, with imports rewritten.
  const dpPath = path.join(consumer, "components/date-picker.tsx");
  const cuPath = path.join(consumer, "components/calendar-utils.ts");
  const fail = (m) => {
    throw new Error(m);
  };
  if (!existsSync(dpPath))
    fail("date-picker.tsx did not install to components/");
  if (!existsSync(cuPath))
    fail("calendar-utils.ts (cross-hirael dep) was not pulled in via its URL");
  const dp = readFileSync(dpPath, "utf8");
  if (dp.includes("@/registry/hirael/"))
    fail("date-picker.tsx still has an unrewritten @/registry/hirael/* import");
  if (!dp.includes("@/components/calendar-utils"))
    fail(
      "date-picker.tsx does not import calendar-utils via the consumer alias",
    );

  console.log(
    "\n✓ install OK — date-picker + calendar-utils installed under components/, imports rewritten",
  );
  ok = true;
} finally {
  if (server) server.close();
  if (consumer) rmSync(consumer, { recursive: true, force: true });
  // Restore registry.json to the production base URL.
  run("node", ["scripts/build-registry.mjs"]);
}

process.exit(ok ? 0 : 1);
