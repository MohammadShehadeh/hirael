import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/currency-input';
import * as radix from '@/registry/hirael/bases/radix/components/currency-input';

const registry = {
  radix,
  base,
};

interface ClampedProps {
  onValue: (value: number | null) => void;
}

describe.each(Object.entries(registry))('CurrencyInput (%s)', (_, { CurrencyInput, CurrencyInputField }) => {
  const Clamped = ({ onValue }: ClampedProps) => {
    const [value, setValue] = React.useState<number | null>(null);

    return (
      <CurrencyInput
        value={value}
        onValueChange={(next) => {
          const clamped = next === null ? null : Math.min(next, 1000);
          onValue(clamped);
          setValue(clamped);
        }}
      >
        <CurrencyInputField aria-label="Amount" />
      </CurrencyInput>
    );
  };

  it('should keep a value the parent clamps while the field is focused', () => {
    const seen: (number | null)[] = [];
    render(<Clamped onValue={(value) => seen.push(value)} />);
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'Amount' });

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '5000' } });
    expect(input.value).toBe('1000.00');

    fireEvent.blur(input);
    expect(input.value).toBe('1,000.00');
    expect(seen).toEqual([1000]);
  });

  it('should show the grouped value at rest and plain digits while editing', () => {
    render(
      <CurrencyInput defaultValue={1234.5}>
        <CurrencyInputField aria-label="Amount" />
      </CurrencyInput>,
    );
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'Amount' });
    expect(input.value).toBe('1,234.50');

    fireEvent.focus(input);
    expect(input.value).toBe('1234.50');

    fireEvent.blur(input);
    expect(input.value).toBe('1,234.50');
  });
});
