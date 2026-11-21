import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { needsOgShot, ogShotPath } from '@/lib/og-shots';
import { REGISTRY } from '@/registry/hirael/registry-meta';

describe('og shots', () => {
  it('should have a screenshot for every block and template', () => {
    const missing = REGISTRY.filter(needsOgShot)
      .filter((entry) => !existsSync(ogShotPath(entry.name)))
      .map((entry) => entry.name);

    expect(missing, 'Run `pnpm build && pnpm og:shots --items=<names>` and commit the images').toEqual([]);
  });
});
