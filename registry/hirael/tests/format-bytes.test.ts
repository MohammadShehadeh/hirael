import { describe, expect, it } from 'vitest';

import { formatBytes } from '@/registry/hirael/lib/format-bytes';

describe('formatBytes', () => {
  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [1024, '1.0 KB'],
    [1536, '1.5 KB'],
    [1048575, '1.0 MB'],
    [1073741823, '1.0 GB'],
    [1024 ** 5, '1024.0 TB'],
  ])('should format %d bytes as %s', (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected);
  });

  it('should read negative or non-finite input as 0 B', () => {
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(Number.NaN)).toBe('0 B');
    expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('0 B');
  });
});
