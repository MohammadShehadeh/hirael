import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { RegistryEntryMeta } from '@/registry/hirael/registry-meta';

// Outside public/: only the social cards read them, so they are never served on their own.
export const OG_SHOTS_DIR = path.join(process.cwd(), 'content', 'og-shots');

/** Pixel size of a screenshot, which is the frame it fills on the 1200 x 630 card. */
export const OG_SHOT_SIZE = { width: 1088, height: 466 };

/** Blocks and templates are whole sections, so a screenshot shows them well; component demos are too small. */
export const needsOgShot = (entry: RegistryEntryMeta) => entry.category === 'blocks' || entry.category === 'templates';

export const ogShotPath = (name: string) => path.join(OG_SHOTS_DIR, `${name}.jpg`);

/** The screenshot as a data URL the card renderer can draw, or null when it hasn't been captured yet. */
export const readOgShot = (name: string): string | null => {
  const file = ogShotPath(name);
  if (!existsSync(file)) return null;

  return `data:image/jpeg;base64,${readFileSync(file).toString('base64')}`;
};
