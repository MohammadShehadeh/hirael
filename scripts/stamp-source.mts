// Runs in `pnpm registry:build`, after `shadcn build`. Prepends the Hirael
// attribution header to every source file in the built /r/*.json payloads;
// repo source stays header-free.

import { writeFileSync } from "node:fs";

import {
  STAMPABLE_FILE,
  jsonText,
  readBuiltItems,
  sourceHeader,
} from "./shared.mts";

let stampedFiles = 0;
let stampedItems = 0;
for (const { file: itemJson, item } of readBuiltItems()) {
  const header = sourceHeader(item);
  let isTouched = false;
  for (const file of item.files ?? []) {
    if (typeof file.content !== "string") continue;
    if (!STAMPABLE_FILE.test(file.path)) continue;
    if (file.content.startsWith(header)) continue;
    file.content = `${header}\n${file.content}`;
    stampedFiles++;
    isTouched = true;
  }
  if (!isTouched) continue;
  writeFileSync(itemJson, jsonText(item));
  stampedItems++;
}
console.log(
  `✓ source stamped — ${stampedFiles} file(s) in ${stampedItems} item(s) carry the Hirael header`,
);
