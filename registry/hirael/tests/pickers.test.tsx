import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import * as baseYear from '@/registry/hirael/bases/base/components/year-picker';
import * as radixYear from '@/registry/hirael/bases/radix/components/year-picker';

const yearCell = (year: number) => document.querySelector<HTMLButtonElement>(`[data-year="${year}"]`);

describe.each([
  ['radix', radixYear],
  ['base', baseYear],
] as const)('YearPicker (%s)', (_, { YearPicker, YearPickerContent, YearPickerTrigger }) => {
  const setup = (props: { defaultValue: number; maxYear: number }) => {
    render(
      <YearPicker defaultOpen minYear={1900} {...props}>
        <YearPickerTrigger />
        <YearPickerContent />
      </YearPicker>,
    );
  };

  it('should stay on the last view when PageDown is pressed near maxYear', async () => {
    setup({ defaultValue: 2100, maxYear: 2100 });
    const cell = await waitFor(() => {
      const el = yearCell(2100);
      if (!el) throw new Error('Year grid not open');

      return el;
    });
    cell.focus();

    fireEvent.keyDown(cell, { key: 'PageDown' });

    expect(yearCell(2099)).not.toBeNull();
    expect(yearCell(2089)).toBeNull();
    expect(document.activeElement).toBe(yearCell(2100));
  });

  it('should page forward to the next decade and focus the same offset', async () => {
    setup({ defaultValue: 2025, maxYear: 2100 });
    const cell = await waitFor(() => {
      const el = yearCell(2025);
      if (!el) throw new Error('Year grid not open');

      return el;
    });
    cell.focus();

    fireEvent.keyDown(cell, { key: 'PageDown' });

    await waitFor(() => expect(document.activeElement).toBe(yearCell(2035)));
    expect(yearCell(2029)).not.toBeNull();
    expect(yearCell(2040)).not.toBeNull();
    expect(yearCell(2028)).toBeNull();
  });

  it('should page the header by the same decade step as the keyboard', async () => {
    setup({ defaultValue: 2025, maxYear: 2100 });
    const user = userEvent.setup();
    await waitFor(() => expect(yearCell(2019)).not.toBeNull());

    await user.click(screen.getByRole('button', { name: 'Next years' }));

    expect(yearCell(2029)).not.toBeNull();
    expect(yearCell(2028)).toBeNull();
  });
});
