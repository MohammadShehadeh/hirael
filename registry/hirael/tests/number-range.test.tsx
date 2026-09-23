import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/number-range';
import * as radix from '@/registry/hirael/bases/radix/components/number-range';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('NumberRange (%s)', (_, { NumberRange, NumberRangeInput }) => {
  it('should still commit on blur when the consumer passes onBlur', async () => {
    const onValueChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <NumberRange defaultValue={[10, 90]} onValueChange={onValueChange}>
        <NumberRangeInput bound="min" aria-label="Minimum" onBlur={onBlur} />
      </NumberRange>,
    );
    const user = userEvent.setup();
    const field = screen.getByRole('textbox', { name: 'Minimum' });

    await user.clear(field);
    await user.type(field, '25');
    await user.tab();

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith([25, 90]);
    expect(field).toHaveValue('25');
  });

  it('should skip its own commit when the consumer prevents the blur default', async () => {
    const onValueChange = vi.fn();
    render(
      <NumberRange defaultValue={[10, 90]} onValueChange={onValueChange}>
        <NumberRangeInput bound="min" aria-label="Minimum" onBlur={(e) => e.preventDefault()} />
      </NumberRange>,
    );
    const user = userEvent.setup();
    const field = screen.getByRole('textbox', { name: 'Minimum' });

    await user.clear(field);
    await user.type(field, '25');
    await user.tab();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(field).toHaveValue('10');
  });
});
