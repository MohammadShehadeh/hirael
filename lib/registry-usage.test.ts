import { describe, expect, it } from 'vitest';

import { buildUsageCode, installTarget } from '@/lib/registry-usage';

describe('installTarget', () => {
  it('should prefer an explicit target', () => {
    expect(installTarget({ path: 'blocks/hero-01/hero-01.tsx', target: 'components/blocks/hero-01.tsx' })).toBe(
      'components/blocks/hero-01.tsx',
    );
  });

  it('should keep component paths as they are', () => {
    expect(installTarget({ path: 'components/data-table/data-table.tsx' })).toBe(
      'components/data-table/data-table.tsx',
    );
  });

  it('should send anything else to components/ui', () => {
    expect(installTarget({ path: 'ui/button.tsx' })).toBe('components/ui/button.tsx');
  });
});

describe('buildUsageCode', () => {
  const source: Record<string, string> = {
    'components/tag-input.tsx': [
      'const TagInput = () => null;',
      'const TagInputField = () => null;',
      'const useTagInput = () => null;',
      'const helper = () => null;',
      'export type TagValidator = () => true;',
      'export { TagInput, TagInputField, useTagInput, helper, type TagValidator };',
    ].join('\n'),
    'components/stat-card.tsx': 'export const StatCard = () => null;\nexport async function loadStats() {}',
    'components/tree.tsx': 'export { TreeRoot as Tree, TreeItem };',
  };
  const read = (path: string) => source[path];

  it('should import components and hooks, never helpers or types', () => {
    expect(buildUsageCode([{ path: 'components/tag-input.tsx' }], read)).toBe(
      'import { TagInput, TagInputField, useTagInput } from "@/components/tag-input"',
    );
  });

  it('should read `export const` and `export function` declarations', () => {
    expect(buildUsageCode([{ path: 'components/stat-card.tsx' }], read)).toBe(
      'import { StatCard } from "@/components/stat-card"',
    );
  });

  it('should use the exported name of a renamed export', () => {
    expect(buildUsageCode([{ path: 'components/tree.tsx' }], read)).toBe(
      'import { Tree, TreeItem } from "@/components/tree"',
    );
  });

  it('should limit components to the documented API parts when given', () => {
    expect(buildUsageCode([{ path: 'components/tag-input.tsx' }], read, [{ name: 'TagInput' }])).toBe(
      'import { TagInput, useTagInput } from "@/components/tag-input"',
    );
  });

  it('should break long import lists across lines', () => {
    source['components/many.tsx'] = 'export { A, B, C, D };';
    expect(buildUsageCode([{ path: 'components/many.tsx' }], read)).toBe(
      'import {\n  A,\n  B,\n  C,\n  D,\n} from "@/components/many"',
    );
  });

  it('should return null when nothing is importable', () => {
    expect(buildUsageCode(undefined, read)).toBeNull();
    expect(buildUsageCode([{ path: 'components/missing.tsx' }], read)).toBeNull();
  });
});
