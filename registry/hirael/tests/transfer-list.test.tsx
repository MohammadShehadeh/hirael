import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/transfer-list';
import * as radix from '@/registry/hirael/bases/radix/components/transfer-list';

const registry = {
  radix,
  base,
};

const ITEMS = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'admin', label: 'Admin', disabled: true },
];

describe.each(Object.entries(registry))(
  'TransferList (%s)',
  (_, { TransferList, TransferListActions, TransferListPanel }) => {
    const setup = (defaultValue: string[] = []) => {
      const onValueChange = vi.fn();
      render(
        <TransferList items={ITEMS} defaultValue={defaultValue} onValueChange={onValueChange}>
          <TransferListPanel side="source" title="Available" searchPlaceholder="Filter" />
          <TransferListActions />
          <TransferListPanel side="target" title="Granted" />
        </TransferList>,
      );

      return { user: userEvent.setup(), onValueChange };
    };

    it('should move checked items to the target list', async () => {
      const { user, onValueChange } = setup();
      await user.click(screen.getByRole('checkbox', { name: 'Write' }));
      await user.click(screen.getByRole('button', { name: 'Move checked to the right list' }));
      expect(onValueChange).toHaveBeenLastCalledWith(['write']);
      expect(within(screen.getByRole('list', { name: 'Granted' })).getByText('Write')).toBeInTheDocument();
    });

    it('should move everything except disabled items', async () => {
      const { user, onValueChange } = setup();
      await user.click(screen.getByRole('button', { name: 'Move all to the right list' }));
      expect(onValueChange).toHaveBeenLastCalledWith(['read', 'write']);
    });

    it('should filter a side by its search field', async () => {
      const { user } = setup();
      await user.type(screen.getByRole('textbox', { name: 'Filter' }), 'wri');
      const available = within(screen.getByRole('list', { name: 'Available' }));
      expect(available.getByText('Write')).toBeInTheDocument();
      expect(available.queryByText('Read')).not.toBeInTheDocument();
    });

    it('should move items back', async () => {
      const { user, onValueChange } = setup(['read']);
      await user.click(screen.getByRole('button', { name: 'Move all back' }));
      expect(onValueChange).toHaveBeenLastCalledWith([]);
    });
  },
);
