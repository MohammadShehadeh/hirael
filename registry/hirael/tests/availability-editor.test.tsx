import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/availability-editor';
import * as radix from '@/registry/hirael/bases/radix/components/availability-editor';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('AvailabilityEditor (%s)', (_, { AvailabilityEditor, validateDay }) => {
  it('should flag a range that ends before it starts', () => {
    expect(validateDay([{ start: '17:00', end: '09:00' }])).toEqual({ 0: 'order' });
  });

  it('should flag the later of two overlapping ranges', () => {
    expect(
      validateDay([
        { start: '13:00', end: '17:00' },
        { start: '09:00', end: '14:00' },
      ]),
    ).toEqual({ 0: 'overlap' });
  });

  it('should accept ranges that touch end to start', () => {
    expect(
      validateDay([
        { start: '09:00', end: '12:00' },
        { start: '12:00', end: '17:00' },
      ]),
    ).toEqual({});
  });

  it('should give a day the default hours when it is switched on', async () => {
    const onValueChange = vi.fn();
    render(<AvailabilityEditor defaultValue={{}} onValueChange={onValueChange} weekStartsOn={1} />);
    const [monday] = screen.getAllByRole('switch');
    await userEvent.setup().click(monday);
    expect(onValueChange).toHaveBeenLastCalledWith({ 1: [{ start: '09:00', end: '17:00' }] });
  });

  it('should copy one day to the whole week', async () => {
    const onValueChange = vi.fn();
    render(
      <AvailabilityEditor
        defaultValue={{ 1: [{ start: '10:00', end: '14:00' }] }}
        onValueChange={onValueChange}
        weekStartsOn={1}
      />,
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Copy to all days: Monday' }));
    const week = onValueChange.mock.lastCall?.[0];
    expect(Object.keys(week)).toHaveLength(7);
    expect(week[0]).toEqual([{ start: '10:00', end: '14:00' }]);
  });
});
