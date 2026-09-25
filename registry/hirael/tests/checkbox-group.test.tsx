import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/checkbox-group';
import * as radix from '@/registry/hirael/bases/radix/components/checkbox-group';

const registry = {
  radix,
  base,
};

// Radix's checkbox measures its hidden form input; jsdom has no ResizeObserver.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Radix renders a <button disabled>, Base UI a <span aria-disabled>.
const isDisabled = (el: HTMLElement) => el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';

describe.each(Object.entries(registry))(
  'CheckboxGroup (%s)',
  (
    _,
    {
      CheckboxGroup,
      CheckboxGroupEmpty,
      CheckboxGroupItem,
      CheckboxGroupLabel,
      CheckboxGroupMessage,
      CheckboxGroupSearch,
      CheckboxGroupSelectAll,
      CheckboxGroupSub,
    },
  ) => {
    const box = (name: string) => screen.getByRole('checkbox', { name });

    const setupNested = (props: React.ComponentProps<typeof CheckboxGroup> = {}) => {
      const onValueChange = vi.fn();
      render(
        <CheckboxGroup onValueChange={onValueChange} {...props}>
          <CheckboxGroupLabel>Notifications</CheckboxGroupLabel>
          <CheckboxGroupSelectAll>All notifications</CheckboxGroupSelectAll>
          <CheckboxGroupSub label="Email">
            <CheckboxGroupItem value="email.comments">Email comments</CheckboxGroupItem>
            <CheckboxGroupItem value="email.digest">Weekly digest</CheckboxGroupItem>
          </CheckboxGroupSub>
          <CheckboxGroupSub label="SMS">
            <CheckboxGroupItem value="sms.security">Security alerts</CheckboxGroupItem>
          </CheckboxGroupSub>
        </CheckboxGroup>,
      );

      return { user: userEvent.setup(), onValueChange };
    };

    const setupFlat = (props: React.ComponentProps<typeof CheckboxGroup> = {}) => {
      const onValueChange = vi.fn();
      render(
        <CheckboxGroup aria-label="Permissions" onValueChange={onValueChange} {...props}>
          <CheckboxGroupSearch placeholder="Filter permissions" />
          <CheckboxGroupSelectAll>Select all</CheckboxGroupSelectAll>
          <CheckboxGroupItem value="repo.read">Read repositories</CheckboxGroupItem>
          <CheckboxGroupItem value="repo.write">Write repositories</CheckboxGroupItem>
          <CheckboxGroupItem value="issues">Manage issues</CheckboxGroupItem>
          <CheckboxGroupItem value="billing">Manage billing</CheckboxGroupItem>
          <CheckboxGroupEmpty>No permissions match.</CheckboxGroupEmpty>
          <CheckboxGroupMessage />
        </CheckboxGroup>,
      );

      return { user: userEvent.setup(), onValueChange };
    };

    it('should label the group and each nested group', () => {
      setupNested();
      expect(screen.getByRole('group', { name: 'Notifications' })).toBeInTheDocument();
      expect(within(screen.getByRole('group', { name: 'Email' })).getAllByRole('checkbox')).toHaveLength(2);
    });

    it('should toggle an item from its checkbox and its label', async () => {
      const { user, onValueChange } = setupNested();
      await user.click(box('Email comments'));
      expect(onValueChange).toHaveBeenLastCalledWith(['email.comments']);
      await user.click(screen.getByText('Weekly digest'));
      expect(onValueChange).toHaveBeenLastCalledWith(['email.comments', 'email.digest']);
    });

    it('should show a parent as mixed when only some children are checked', () => {
      setupNested({ defaultValue: ['email.comments'] });
      expect(box('Email')).toHaveAttribute('aria-checked', 'mixed');
      expect(box('All notifications')).toHaveAttribute('aria-checked', 'mixed');
      expect(box('SMS')).toHaveAttribute('aria-checked', 'false');
    });

    it('should check every child when a parent is clicked', async () => {
      const { user, onValueChange } = setupNested({ defaultValue: ['email.comments'] });
      await user.click(box('Email'));
      expect(onValueChange).toHaveBeenLastCalledWith(['email.comments', 'email.digest']);
      expect(box('Email')).toHaveAttribute('aria-checked', 'true');
      await user.click(box('Email'));
      expect(onValueChange).toHaveBeenLastCalledWith([]);
    });

    it('should select and clear everything with select all', async () => {
      const { user, onValueChange } = setupNested();
      await user.click(box('All notifications'));
      expect(onValueChange).toHaveBeenLastCalledWith(['email.comments', 'email.digest', 'sms.security']);
      expect(box('SMS')).toHaveAttribute('aria-checked', 'true');
      await user.click(box('All notifications'));
      expect(onValueChange).toHaveBeenLastCalledWith([]);
    });

    it('should toggle with Space from the keyboard', async () => {
      const { user, onValueChange } = setupNested();
      box('Security alerts').focus();
      await user.keyboard(' ');
      expect(onValueChange).toHaveBeenLastCalledWith(['sms.security']);
    });

    it('should narrow the list and apply select all to the visible options only', async () => {
      const { user, onValueChange } = setupFlat();
      await user.type(screen.getByRole('searchbox', { name: 'Filter permissions' }), 'repo');
      expect(screen.queryByRole('checkbox', { name: 'Manage issues' })).not.toBeInTheDocument();
      await user.click(box('Select all'));
      expect(onValueChange).toHaveBeenLastCalledWith(['repo.read', 'repo.write']);
    });

    it('should show the empty message when the search matches nothing', async () => {
      const { user } = setupFlat();
      await user.type(screen.getByRole('searchbox'), 'deploy');
      expect(screen.getByRole('status')).toHaveTextContent('No permissions match.');
      await user.keyboard('{Escape}');
      expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    });

    it('should clear the search from its clear button', async () => {
      const { user } = setupFlat();
      const search = screen.getByRole('searchbox');
      await user.type(search, 'billing');
      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
      await user.click(screen.getByRole('button', { name: 'Clear search' }));
      expect(search).toHaveValue('');
      expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    });

    it('should disable the rest at max and say why', async () => {
      const { user } = setupFlat({ max: 2 });
      await user.click(box('Read repositories'));
      await user.click(box('Manage issues'));
      expect(isDisabled(box('Write repositories'))).toBe(true);
      expect(isDisabled(box('Manage billing'))).toBe(true);
      expect(isDisabled(box('Read repositories'))).toBe(false);
      expect(screen.getByText('You can pick up to 2.')).toBeInTheDocument();
      expect(box('Select all')).toHaveAttribute('aria-checked', 'mixed');
    });

    it('should report a selection below min once the user has changed it', async () => {
      const { user } = setupFlat({ min: 2, defaultValue: ['issues'] });
      expect(screen.queryByText('Pick at least 2.')).not.toBeInTheDocument();
      await user.click(box('Read repositories'));
      await user.click(box('Read repositories'));
      expect(screen.getByText('Pick at least 2.')).toBeInTheDocument();
      expect(box('Manage issues')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should submit each checked value under the name', async () => {
      const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        return new FormData(event.currentTarget).getAll('scope');
      });
      render(
        <form onSubmit={onSubmit}>
          <CheckboxGroup aria-label="Scopes" name="scope" defaultValue={['issues']}>
            <CheckboxGroupItem value="repo.read">Read repositories</CheckboxGroupItem>
            <CheckboxGroupItem value="issues">Manage issues</CheckboxGroupItem>
          </CheckboxGroup>
          <button type="submit">Save</button>
        </form>,
      );
      const user = userEvent.setup();
      await user.click(box('Read repositories'));
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onSubmit).toHaveReturnedWith(['issues', 'repo.read']);
    });
  },
);
