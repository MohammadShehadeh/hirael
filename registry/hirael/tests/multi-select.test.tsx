import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/multi-select';
import * as radix from '@/registry/hirael/bases/radix/components/multi-select';

const registry = { radix, base };

// cmdk measures its list and scrolls the active option into view; jsdom has neither.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ??= () => {};
});

const OPTIONS = ['a', 'b', 'c', 'd', 'e'].map((value) => ({ value, label: value.toUpperCase() }));

describe.each(Object.entries(registry))(
  'MultiSelect (%s)',
  (_, { MultiSelect, MultiSelectContent, MultiSelectTrigger }) => {
    it('should keep the current picks when select all fills up to maxCount', async () => {
      const onValueChange = vi.fn();
      render(
        <MultiSelect options={OPTIONS} defaultValue={['d', 'e']} maxCount={3} onValueChange={onValueChange} defaultOpen>
          <MultiSelectTrigger />
          <MultiSelectContent />
        </MultiSelect>,
      );
      await userEvent.setup().click(screen.getByText('Select all'));
      expect(onValueChange).toHaveBeenLastCalledWith(['d', 'e', 'a']);
    });

    it('should count only enabled options in the select all row', () => {
      render(
        <MultiSelect
          options={[{ value: 'x', label: 'X', disabled: true }, ...OPTIONS.slice(0, 2)]}
          defaultValue={['x', 'a', 'b']}
          defaultOpen
        >
          <MultiSelectTrigger />
          <MultiSelectContent />
        </MultiSelect>,
      );
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
    });
  },
);
