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

    it('should stay closed when a disabled trigger is clicked', async () => {
      render(
        <MultiSelect options={OPTIONS} disabled>
          <MultiSelectTrigger />
          <MultiSelectContent />
        </MultiSelect>,
      );
      await userEvent.setup().click(screen.getByRole('combobox'));
      expect(screen.queryByText('Select all')).not.toBeInTheDocument();
    });

    it('should open from the keyboard', async () => {
      render(
        <MultiSelect options={OPTIONS}>
          <MultiSelectTrigger />
          <MultiSelectContent />
        </MultiSelect>,
      );
      const user = userEvent.setup();
      const trigger = screen.getByRole('combobox');
      await user.tab();
      expect(trigger).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(screen.getByText('Select all')).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('should focus the search input when opened', async () => {
      render(
        <MultiSelect options={OPTIONS}>
          <MultiSelectTrigger />
          <MultiSelectContent />
        </MultiSelect>,
      );
      await userEvent.setup().click(screen.getByRole('combobox'));
      expect(await screen.findByPlaceholderText('Search…')).toHaveFocus();
    });

    it('should skip a disabled trigger in the tab order and mark it disabled', async () => {
      render(
        <MultiSelect options={OPTIONS} disabled>
          <MultiSelectTrigger />
          <MultiSelectContent />
        </MultiSelect>,
      );
      await userEvent.setup().tab();
      const trigger = screen.getByRole('combobox');
      expect(trigger).not.toHaveFocus();
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not offer to remove a locked option chip', () => {
      render(
        <MultiSelect options={[{ value: 'x', label: 'X', disabled: true }, ...OPTIONS]} defaultValue={['x', 'a']}>
          <MultiSelectTrigger />
          <MultiSelectContent />
        </MultiSelect>,
      );
      expect(screen.queryByRole('button', { name: 'Remove X' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove A' })).toBeInTheDocument();
    });

    it('should remove a chip without opening the popover', async () => {
      const onValueChange = vi.fn();
      render(
        <MultiSelect options={OPTIONS} defaultValue={['a', 'b']} onValueChange={onValueChange}>
          <MultiSelectTrigger />
          <MultiSelectContent />
        </MultiSelect>,
      );
      await userEvent.setup().click(screen.getByRole('button', { name: 'Remove A' }));
      expect(onValueChange).toHaveBeenLastCalledWith(['b']);
      expect(screen.queryByText('Select all')).not.toBeInTheDocument();
    });
  },
);
