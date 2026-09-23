import { describe, expect, it } from 'vitest';

import { relatedEntries } from '@/lib/related';
import { REGISTRY, REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

describe('relatedEntries', () => {
  it('should never include the entry itself', () => {
    for (const entry of REGISTRY) {
      expect(relatedEntries(entry).map((related) => related.name)).not.toContain(entry.name);
    }
  });

  it('should return at most the limit', () => {
    expect(relatedEntries(REGISTRY_BY_NAME['hero-01'], 5)).toHaveLength(5);
    expect(relatedEntries(REGISTRY_BY_NAME['hero-01'])).toHaveLength(3);
  });

  it('should keep blocks with blocks of the same kind', () => {
    for (const related of relatedEntries(REGISTRY_BY_NAME['pricing-01'])) {
      expect(related.blockKind).toBe('pricing');
    }
  });

  it('should suggest pickers for a picker', () => {
    const related = relatedEntries(REGISTRY_BY_NAME['date-picker']);
    expect(related.map((entry) => entry.name)).toContain('date-range-picker');
    for (const entry of related) expect(entry.category).toBe('pickers');
  });

  it('should be deterministic', () => {
    const entry = REGISTRY_BY_NAME['multi-select'];
    expect(relatedEntries(entry)).toEqual(relatedEntries(entry));
  });
});
