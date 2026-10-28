import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it.each([
    ['+44 20 7946 0958', '+442079460958', '2079460958'],
    ['+971 50 123 4567', '+971501234567', '501234567'],
  ])('should switch to the country of a pasted %s', (pasted, e164, national) => {
    const onValueChange = vi.fn();
    render(
      <PhoneInput defaultCountry="US" onValueChange={onValueChange}>
        <PhoneInputField aria-label="Phone" />
      </PhoneInput>,
    );
    const field = screen.getByRole('textbox', { name: 'Phone' });

    fireEvent.change(field, { target: { value: pasted } });

    expect(onValueChange).toHaveBeenLastCalledWith(e164);
    expect(field).toHaveValue(national);
  });

  it('should keep the selected country for a pasted national number', () => {
    const onValueChange = vi.fn();
    render(
      <PhoneInput defaultCountry="US" onValueChange={onValueChange}>
        <PhoneInputField aria-label="Phone" />
      </PhoneInput>,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Phone' }), { target: { value: '(555) 123-4567' } });

    expect(onValueChange).toHaveBeenLastCalledWith('+15551234567');
  });
});
