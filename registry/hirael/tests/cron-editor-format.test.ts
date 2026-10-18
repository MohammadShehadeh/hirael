import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/cron-editor';
import * as radix from '@/registry/hirael/bases/radix/components/cron-editor';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('formatCronField (%s)', (_, { formatCronField, parseCron }) => {
  it.each([
    [[1, 2, 3, 4, 5], '1-5'],
    [[1, 2], '1,2'],
    [[0, 5, 6], '0,5,6'],
    [[1, 2, 3, 5, 7, 8, 9, 10], '1-3,5,7-10'],
    [[5, 3, 4, 3], '3-5'],
  ])('should write %j as %s', (values, expected) => {
    expect(formatCronField({ mode: 'specific', values, step: 1 })).toBe(expected);
  });

  it('should round-trip a compacted field to the same values', () => {
    const values = [0, 1, 2, 3, 15, 30, 31, 32];
    const raw = formatCronField({ mode: 'specific', values, step: 1 });

    expect(parseCron(`${raw} * * * *`).fields.minute.values).toEqual(values);
  });
});
