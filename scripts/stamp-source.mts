// Runs after `shadcn build`, on the built /r/*.json payloads; repo source stays untouched.

import { writeFileSync } from 'node:fs';

import { REGISTRY_BASE_URL, STAMPABLE_FILE, jsonText, readAllBuiltItems, sourceHeader } from './shared.mts';

// Root-relative /media paths would 404 once installed, so payloads get absolute URLs.
const MEDIA_PATH = /(["'`])\/media\//g;

const results = readAllBuiltItems().map(({ file: itemJson, item }) => {
  const header = sourceHeader(item);
  let stampedFiles = 0;
  let mediaFiles = 0;
  for (const file of item.files ?? []) {
    if (typeof file.content !== 'string') continue;
    const withMedia = file.content.replace(MEDIA_PATH, `$1${REGISTRY_BASE_URL}/media/`);
    if (withMedia !== file.content) {
      file.content = withMedia;
      mediaFiles++;
    }
    if (!STAMPABLE_FILE.test(file.path)) continue;
    if (file.content.startsWith(header)) continue;
    file.content = `${header}\n${file.content}`;
    stampedFiles++;
  }
  if (stampedFiles || mediaFiles) writeFileSync(itemJson, jsonText(item));

  return { stampedFiles, mediaFiles };
});
const stampedFiles = results.reduce((total, result) => total + result.stampedFiles, 0);
const mediaFiles = results.reduce((total, result) => total + result.mediaFiles, 0);
const touchedItems = results.filter((result) => result.stampedFiles || result.mediaFiles).length;
console.log(
  `✓ source stamped — ${stampedFiles} file(s) in ${touchedItems} item(s) carry the Hirael header, ${mediaFiles} file(s) point media at ${REGISTRY_BASE_URL}`,
);
