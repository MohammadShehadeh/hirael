import { describe, expect, it } from 'vitest';

import { buildSearchIndex, searchIndex } from '@/lib/search';
import { REGISTRY } from '@/registry/hirael/registry-meta';

const index = buildSearchIndex(REGISTRY);
const names = (query: string) => searchIndex(index, query).map((doc) => doc.entry.name);

describe('searchIndex', () => {
  it('should rank an exact name first', () => {
    expect(names('multi select')[0]).toBe('multi-select');
    expect(names('tag-input')[0]).toBe('tag-input');
  });

  it('should treat "1" and "01" as the same number', () => {
    expect(names('hero 1')[0]).toBe('hero-01');
  });

  it('should resolve aliases to the component they describe', () => {
    expect(names('datepicker')).toContain('date-picker');
    expect(names('wizard')).toContain('stepper');
  });

  it('should tolerate a one-letter typo in longer words', () => {
    expect(names('steppr')).toContain('stepper');
  });

  it('should return nothing for blank or stopword-only noise', () => {
    expect(names('')).toEqual([]);
    expect(names('   ')).toEqual([]);
    expect(names('zzzzqqqq')).toEqual([]);
  });

  it('should respect the limit', () => {
    expect(searchIndex(index, 'block', 5)).toHaveLength(5);
  });
});
