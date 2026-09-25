import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/number-field';
import * as radix from '@/registry/hirael/bases/radix/components/number-field';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))(
  'NumberField (%s)',
  (
    _,
    { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput, NumberFieldStepper },
  ) => {
    afterEach(() => {
      vi.useRealTimers();
    });

    const setup = (props: Partial<React.ComponentProps<typeof NumberField>> = {}, stacked = false) => {
      const onValueChange = vi.fn();
      render(
        <NumberField onValueChange={onValueChange} {...props}>
          <NumberFieldGroup>
            {!stacked && <NumberFieldDecrement />}
            <NumberFieldInput aria-label="Amount" />
            {stacked ? <NumberFieldStepper /> : <NumberFieldIncrement />}
          </NumberFieldGroup>
        </NumberField>,
      );

      return { user: userEvent.setup(), input: screen.getByRole('spinbutton', { name: 'Amount' }), onValueChange };
    };

    it('should step with the buttons and disable them at the bounds', async () => {
      const { user, input, onValueChange } = setup({ defaultValue: 1, min: 0, max: 2 });
      const increase = screen.getByRole('button', { name: 'Increase' });
      const decrease = screen.getByRole('button', { name: 'Decrease' });

      await user.click(increase);
      expect(onValueChange).toHaveBeenLastCalledWith(2);
      expect(input).toHaveValue('2');
      expect(increase).toBeDisabled();

      await user.click(decrease);
      await user.click(decrease);
      expect(input).toHaveValue('0');
      expect(decrease).toBeDisabled();
    });

    it('should step with the arrow keys and take large steps with Shift and Page keys', async () => {
      const { user, input } = setup({ defaultValue: 10, step: 2, largeStep: 20 });
      await user.click(input);

      await user.keyboard('{ArrowUp}');
      expect(input).toHaveValue('12');
      await user.keyboard('{ArrowDown}{ArrowDown}');
      expect(input).toHaveValue('8');
      await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
      expect(input).toHaveValue('28');
      await user.keyboard('{PageDown}');
      expect(input).toHaveValue('8');
      await user.keyboard('{PageUp}');
      expect(input).toHaveValue('28');
    });

    it('should jump to min and max with Home and End', async () => {
      const { user, input, onValueChange } = setup({ defaultValue: 5, min: 1, max: 9 });
      await user.click(input);

      await user.keyboard('{End}');
      expect(onValueChange).toHaveBeenLastCalledWith(9);
      await user.keyboard('{Home}');
      expect(onValueChange).toHaveBeenLastCalledWith(1);
      expect(input).toHaveValue('1');
    });

    it('should snap an off-grid value to the next step', async () => {
      const { user, input } = setup({ defaultValue: 1.3, step: 0.5 });
      await user.click(input);

      await user.keyboard('{ArrowUp}');
      expect(input).toHaveValue('1.5');
      await user.keyboard('{ArrowUp}');
      expect(input).toHaveValue('2');
    });

    it('should accept grouping, reject letters, and clamp on blur', async () => {
      const { user, input, onValueChange } = setup({ defaultValue: null, max: 5000 });

      await user.type(input, '1,2x50');
      expect(input).toHaveValue('1,250');
      expect(onValueChange).not.toHaveBeenCalled();

      await user.tab();
      expect(onValueChange).toHaveBeenLastCalledWith(1250);
      expect(input).toHaveValue('1,250');

      await user.clear(input);
      await user.type(input, '9999');
      await user.tab();
      expect(onValueChange).toHaveBeenLastCalledWith(5000);
      expect(input).toHaveValue('5,000');
    });

    it('should revert the draft on Escape', async () => {
      const { user, input, onValueChange } = setup({ defaultValue: 4 });

      await user.clear(input);
      await user.type(input, '42{Escape}');
      expect(input).toHaveValue('4');
      await user.tab();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should expose spinbutton values and format currency', async () => {
      const { user, input, onValueChange } = setup({
        defaultValue: 1234.5,
        min: 0,
        max: 5000,
        formatOptions: { style: 'currency', currency: 'USD' },
      });
      expect(input).toHaveValue('$1,234.50');
      expect(input).toHaveAttribute('aria-valuenow', '1234.5');
      expect(input).toHaveAttribute('aria-valuemin', '0');
      expect(input).toHaveAttribute('aria-valuemax', '5000');
      expect(input).toHaveAttribute('aria-valuetext', '$1,234.50');

      await user.clear(input);
      await user.type(input, '$2,000.255{Enter}');
      expect(onValueChange).toHaveBeenLastCalledWith(2000.26);
      expect(input).toHaveValue('$2,000.26');
    });

    it('should submit the raw number under its name after Enter', async () => {
      const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        return new FormData(e.currentTarget).get('price');
      });
      render(
        <form onSubmit={onSubmit}>
          <NumberField name="price" defaultValue={10} formatOptions={{ style: 'currency', currency: 'USD' }}>
            <NumberFieldGroup>
              <NumberFieldInput aria-label="Price" />
            </NumberFieldGroup>
          </NumberField>
          <button type="submit">Save</button>
        </form>,
      );
      const user = userEvent.setup();
      const input = screen.getByRole('spinbutton', { name: 'Price' });

      await user.clear(input);
      await user.type(input, '1,499.9{Enter}');
      expect(onSubmit).toHaveReturnedWith('1499.9');
    });

    it('should repeat and speed up while a button is held', () => {
      vi.useFakeTimers();
      const { input } = setup({ defaultValue: 0 }, true);
      const increase = screen.getByRole('button', { name: 'Increase' });

      fireEvent.pointerDown(increase, { button: 0, pointerType: 'mouse' });
      expect(input).toHaveValue('1');
      act(() => vi.advanceTimersByTime(399));
      expect(input).toHaveValue('1');
      act(() => vi.advanceTimersByTime(1000));
      const held = Number(input.getAttribute('aria-valuenow'));
      expect(held).toBeGreaterThan(10);

      fireEvent.pointerUp(window);
      act(() => vi.advanceTimersByTime(1000));
      expect(input).toHaveAttribute('aria-valuenow', String(held));
    });

    it('should only step on the wheel when allowWheel is set', () => {
      const { input } = setup({ defaultValue: 3 });
      act(() => input.focus());
      fireEvent.wheel(input, { deltaY: -100 });
      expect(input).toHaveValue('3');
    });

    it('should step on the wheel while focused when allowWheel is set', () => {
      const { input } = setup({ defaultValue: 3, allowWheel: true });
      act(() => input.focus());
      fireEvent.wheel(input, { deltaY: -100 });
      expect(input).toHaveValue('4');
      fireEvent.wheel(input, { deltaY: 100 });
      fireEvent.wheel(input, { deltaY: 100 });
      expect(input).toHaveValue('2');
    });

    it('should block every change when read-only', async () => {
      const { user, input, onValueChange } = setup({ defaultValue: 3, readOnly: true });
      await user.click(input);
      await user.keyboard('{ArrowUp}{End}');
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    });
  },
);
