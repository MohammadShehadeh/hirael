// Generates public/llms.txt from registry-meta.ts — the LLM-facing index of
// the registry (see llmstxt.org). Runs as part of `pnpm registry:gen`; the
// output is committed like the /r/*.json artifacts.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadRegistryMeta } from "./build-registry.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_PATH = path.join(ROOT, "public/llms.txt");

// Mirrors build-registry.mjs so a smoke-test override points at the same host.
const BASE_URL = process.env.REGISTRY_BASE_URL ?? "https://hirael.com";

function line(label, href, description) {
  const desc = description ? `: ${description}` : "";
  return `- [${label}](${href})${desc}`;
}

async function main() {
  const meta = await loadRegistryMeta();
  const {
    REGISTRY,
    COMPONENT_CATEGORY_ORDER,
    CATEGORY_LABELS,
    REGISTRY_BY_CATEGORY,
    BLOCK_KIND_ORDER,
    BLOCK_KIND_LABELS,
    BLOCKS_BY_KIND,
    TEMPLATES,
    entryHref,
  } = meta;

  const out = [];
  out.push("# Hirael", "");
  out.push(
    `> The components shadcn/ui doesn't ship: React components, section blocks, and full-page templates distributed through the shadcn registry schema. Install any item with \`npx shadcn@latest add ${BASE_URL}/r/<name>.json\`; the source copies into the consumer's repo.`,
    "",
  );

  out.push(
    "Every item below has a machine-readable registry JSON at `/r/<name>.json` containing its full source files, dependencies, and install targets. Human-facing pages embed live demos of each item.",
    "",
  );

  out.push("## Components");
  for (const cat of COMPONENT_CATEGORY_ORDER) {
    for (const entry of REGISTRY_BY_CATEGORY[cat]) {
      out.push(
        line(
          entry.title,
          `${BASE_URL}${entryHref(entry)}`,
          `${entry.description} Registry JSON: ${BASE_URL}/r/${entry.name}.json`,
        ),
      );
    }
  }
  out.push("");

  out.push("## Blocks");
  for (const kind of BLOCK_KIND_ORDER) {
    for (const entry of BLOCKS_BY_KIND[kind]) {
      out.push(
        line(
          entry.title,
          `${BASE_URL}${entryHref(entry)}`,
          `${BLOCK_KIND_LABELS[kind]} block. ${entry.description} Registry JSON: ${BASE_URL}/r/${entry.name}.json`,
        ),
      );
    }
  }
  out.push("");

  out.push("## Templates");
  for (const entry of TEMPLATES) {
    out.push(
      line(
        entry.title,
        `${BASE_URL}${entryHref(entry)}`,
        `Full-page template. ${entry.description} Registry JSON: ${BASE_URL}/r/${entry.name}.json`,
      ),
    );
  }
  out.push("");

  out.push("## Docs");
  out.push(line("Full catalog JSON", `${BASE_URL}/r/registry.json`, "Every item in one shadcn registry document"));
  out.push(line("Components overview", `${BASE_URL}/components`, "All components with live previews"));
  out.push(line("Blocks overview", `${BASE_URL}/blocks`, "Block categories and schematic index"));
  out.push(line("Theme playground", `${BASE_URL}/theme`, "Live token editor and component gallery against custom themes"));
  out.push(line("Changelog", `${BASE_URL}/changelog`, "Release notes"));
  out.push(line("GitHub", "https://github.com/MohammadShehadeh/hirael", "Source repository"));
  out.push("");

  // Category labels are useful context; keep them as an optional appendix.
  const labels = COMPONENT_CATEGORY_ORDER.map(
    (cat) => `${cat} = ${CATEGORY_LABELS[cat]}`,
  ).join(", ");
  out.push(`Component categories: ${labels}`, "");

  writeFileSync(OUT_PATH, out.join("\n"));
  console.log(`✓ llms.txt generated (${REGISTRY.length} items)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
