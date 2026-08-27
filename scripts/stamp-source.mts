// Runs in `pnpm registry:build`, after `shadcn build`. Prepends the Hirael
// attribution header to every source file in the built /r/*.json payloads and
// points placeholder media at the showcase host; repo source stays untouched.

import { writeFileSync } from "node:fs";

import {
  REGISTRY_BASE_URL,
  STAMPABLE_FILE,
  jsonText,
  readBuiltItems,
  sourceHeader,
} from "./shared.mts";

// Placeholder images and videos live in public/media and are referenced
// root-relative in source. Installed items would 404 on those paths, so the
// shipped payload carries absolute URLs instead.
const MEDIA_PATH = /(["'`])\/media\//g;

let stampedFiles = 0;
let mediaFiles = 0;
let touchedItems = 0;
for (const { file: itemJson, item } of readBuiltItems()) {
  const header = sourceHeader(item);
  let isTouched = false;
  for (const file of item.files ?? []) {
    if (typeof file.content !== "string") continue;
    const withMedia = file.content.replace(
      MEDIA_PATH,
      `$1${REGISTRY_BASE_URL}/media/`,
    );
    if (withMedia !== file.content) {
      file.content = withMedia;
      mediaFiles++;
      isTouched = true;
    }
    if (!STAMPABLE_FILE.test(file.path)) continue;
    if (file.content.startsWith(header)) continue;
    file.content = `${header}\n${file.content}`;
    stampedFiles++;
    isTouched = true;
  }
  if (!isTouched) continue;
  writeFileSync(itemJson, jsonText(item));
  touchedItems++;
}
console.log(
  `✓ source stamped — ${stampedFiles} file(s) in ${touchedItems} item(s) carry the Hirael header, ${mediaFiles} file(s) point media at ${REGISTRY_BASE_URL}`,
);
