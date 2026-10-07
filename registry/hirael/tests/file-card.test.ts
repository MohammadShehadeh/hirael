import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/file-card';
import * as radix from '@/registry/hirael/bases/radix/components/file-card';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('fileKindOf (%s)', (_, { fileKindOf }) => {
  it('should prefer the MIME type', () => {
    expect(fileKindOf('photo.bin', 'image/png')).toBe('image');
    expect(fileKindOf('clip', 'video/mp4')).toBe('video');
  });

  it('should fall back to the extension, ignoring case', () => {
    expect(fileKindOf('Report.PDF')).toBe('document');
    expect(fileKindOf('budget.xlsx')).toBe('spreadsheet');
    expect(fileKindOf('site.tar')).toBe('archive');
    expect(fileKindOf('use-filters.ts')).toBe('code');
  });

  it('should call anything else other', () => {
    expect(fileKindOf('Makefile')).toBe('other');
    expect(fileKindOf('.env')).toBe('other');
  });
});
