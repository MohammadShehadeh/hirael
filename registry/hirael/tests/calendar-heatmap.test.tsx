import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/calendar-heatmap';
import * as radix from '@/registry/hirael/bases/radix/components/calendar-heatmap';

const registry = { radix, base };

describe.each(Object.entries(registry))('CalendarHeatmap (%s)', (_, { CalendarHeatmap }) => {
  const levelsFor = (props: Partial<React.ComponentProps<typeof CalendarHeatmap>> = {}) => {
    const { container } = render(
      <CalendarHeatmap
        startDate={new Date(2026, 0, 1)}
        endDate={new Date(2026, 0, 5)}
        data={[
          { date: '2026-01-02', value: 1 },
          { date: '2026-01-03', value: 5 },
          { date: '2026-01-04', value: 10 },
        ]}
        {...props}
      />,
    );

    return [...container.querySelectorAll('[data-level]')].map((cell) => Number(cell.getAttribute('data-level')));
  };

  it('should give any day with activity at least the first level', () => {
    expect(levelsFor()).toEqual([0, 1, 2, 4, 0]);
  });

  it('should keep custom thresholds as the values each level starts at', () => {
    expect(levelsFor({ thresholds: [5, 10] })).toEqual([0, 0, 1, 2, 0]);
  });
});
