import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/phone-input';
import * as radix from '@/registry/hirael/bases/radix/components/phone-input';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('PhoneInput (%s)', (_, { PhoneInput, PhoneInputField }) => {
  it('should drop the national trunk 0 from the E.164 value', async () => {
    const onValueChange = vi.fn();
    render(
      <PhoneInput defaultCountry="GB" name="phone" onValueChange={onValueChange}>
        <PhoneInputField aria-label="Phone" />
      </PhoneInput>,
    );
    await userEvent.setup().type(screen.getByRole('textbox', { name: 'Phone' }), '07911 123456');

    expect(onValueChange).toHaveBeenLastCalledWith('+447911123456');
    expect(document.querySelector('input[name="phone"]')).toHaveValue('+447911123456');
  });

  it('should keep the leading 0 for Italy', async () => {
    const onValueChange = vi.fn();
    render(
      <PhoneInput defaultCountry="IT" onValueChange={onValueChange}>
        <PhoneInputField aria-label="Phone" />
      </PhoneInput>,
    );
    await userEvent.setup().type(screen.getByRole('textbox', { name: 'Phone' }), '06 1234567');

    expect(onValueChange).toHaveBeenLastCalledWith('+39061234567');
  });

  it('should show a parent-driven value and keep typed spacing when controlled', async () => {
    const Controlled = () => {
      const [value, setValue] = React.useState('+14155550100');

      return (
        <>
          <PhoneInput value={value} onValueChange={setValue}>
            <PhoneInputField aria-label="Phone" />
          </PhoneInput>
          <button type="button" onClick={() => setValue('+442071234567')}>
            Reset
          </button>
        </>
      );
    };
    render(<Controlled />);
    const user = userEvent.setup();
    const field = screen.getByRole('textbox', { name: 'Phone' });
    expect(field).toHaveValue('4155550100');

    await user.clear(field);
    await user.type(field, '415 555');
    expect(field).toHaveValue('415 555');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(field).toHaveValue('2071234567');
  });
});
