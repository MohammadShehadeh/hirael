// Runs in `pnpm registry:gen`. Generates public/llms.txt, the LLM-facing
// index of the registry (llmstxt.org), from registry-meta.ts.

import { writeFileSync } from "node:fs";
import path from "node:path";

import {
  BLOCK_KIND_LABELS,
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_ORDER,
  REGISTRY,
  REGISTRY_BY_CATEGORY,
  TEMPLATES,
  entryHref,
  type RegistryEntryMeta,
} from "@/registry/hirael/registry-meta";

import { BRAND, REGISTRY_BASE_URL, ROOT } from "./shared.mts";

const OUT_PATH = path.join(ROOT, "public/llms.txt");

const line = (label: string, href: string, description?: string) =>
  `- [${label}](${href})${description ? `: ${description}` : ""}`;

const itemLine = (entry: RegistryEntryMeta, prefix = "") =>
  line(
    entry.title,
    `${REGISTRY_BASE_URL}${entryHref(entry)}`,
    `${prefix}${entry.description} Registry JSON: ${REGISTRY_BASE_URL}/r/${entry.name}.json`,
  );

const components = COMPONENT_CATEGORY_ORDER.flatMap((category) =>
  REGISTRY_BY_CATEGORY[category].map((entry) => itemLine(entry)),
);

const blocks = BLOCK_KIND_ORDER.flatMap((kind) =>
  BLOCKS_BY_KIND[kind].map((entry) =>
    itemLine(entry, `${BLOCK_KIND_LABELS[kind]} block. `),
  ),
);

const templates = TEMPLATES.map((entry) =>
  itemLine(entry, "Full-page template. "),
);

const docs = [
  line(
    "Full catalog JSON",
    `${REGISTRY_BASE_URL}/r/registry.json`,
    "Every item in one shadcn registry document",
  ),
  line(
    "Components overview",
    `${REGISTRY_BASE_URL}/components`,
    "All components with live previews",
  ),
  line(
    "Blocks overview",
    `${REGISTRY_BASE_URL}/blocks`,
    "Block categories and schematic index",
  ),
  line(
    "Theme playground",
    `${REGISTRY_BASE_URL}/theme`,
    "Live token editor and component gallery against custom themes",
  ),
  line("Changelog", `${REGISTRY_BASE_URL}/changelog`, "Release notes"),
  line("GitHub", BRAND.repoUrl, "Source repository"),
];

const categoryLabels = COMPONENT_CATEGORY_ORDER.map(
  (category) => `${category} = ${CATEGORY_LABELS[category]}`,
).join(", ");

const output = [
  "# Hirael",
  "",
  `> The components shadcn/ui doesn't ship: React components, section blocks, and full-page templates distributed through the shadcn registry schema. Install any item with \`npx shadcn@latest add ${REGISTRY_BASE_URL}/r/<name>.json\`; the source copies into the consumer's repo.`,
  "",
  "Every item below has a machine-readable registry JSON at `/r/<name>.json` containing its full source files, dependencies, and install targets. Human-facing pages embed live demos of each item.",
  "",
  "## Components",
  ...components,
  "",
  "## Blocks",
  ...blocks,
  "",
  "## Templates",
  ...templates,
  "",
  "## Docs",
  ...docs,
  "",
  `Component categories: ${categoryLabels}`,
  "",
].join("\n");

writeFileSync(OUT_PATH, output);
console.log(`✓ llms.txt generated (${REGISTRY.length} items)`);
