import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/credit-card-input';
import * as radix from '@/registry/hirael/bases/radix/components/credit-card-input';

const registry = {
  radix,
  base,
};

const VISA = { number: '4242424242424242', expiry: '', cvc: '' };

// Writes through the native setter so React's value tracker still sees a change, like a real keystroke.
const typeAt = (input: HTMLInputElement, value: string, caret: number) => {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setValue?.call(input, value);
  input.setSelectionRange(caret, caret);
  fireEvent.input(input);
};

describe.each(Object.entries(registry))(
  'CreditCardInputNumber (%s)',
  (_, { CreditCardInput, CreditCardInputNumber }) => {
    const renderNumber = () => {
      render(
        <CreditCardInput defaultValue={VISA}>
          <CreditCardInputNumber />
        </CreditCardInput>,
      );
      const input = screen.getByRole('textbox', { name: 'Card number' }) as HTMLInputElement;
      input.focus();

      return input;
    };

    it('should keep the caret after a digit typed in the middle', () => {
      const input = renderNumber();
      typeAt(input, '42942 4242 4242 4242', 3);

      expect(input.value).toBe('4294 2424 2424 2424 2');
      expect(input.selectionStart).toBe(3);
    });

    it('should delete the digit before a group space on Backspace', () => {
      const input = renderNumber();
      input.setSelectionRange(5, 5);
      fireEvent.keyDown(input, { key: 'Backspace' });

      expect(input.value).toBe('4244 2424 2424 242');
      expect(input.selectionStart).toBe(3);
    });

    it('should delete the digit after a group space on Delete', () => {
      const input = renderNumber();
      input.setSelectionRange(4, 4);
      fireEvent.keyDown(input, { key: 'Delete' });

      expect(input.value).toBe('4242 2424 2424 242');
      expect(input.selectionStart).toBe(4);
    });
  },
);
