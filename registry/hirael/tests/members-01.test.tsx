import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';

import BaseMembers from '@/registry/hirael/bases/base/blocks/members-01/members-01';
import RadixMembers from '@/registry/hirael/bases/radix/blocks/members-01/members-01';

const registry = { radix: RadixMembers, base: BaseMembers };

// The role select measures itself; jsdom has no ResizeObserver.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe.each(Object.entries(registry))('Members01 (%s)', (_, Members) => {
  it('should send a typed address in one click without committing it first', async () => {
    const user = userEvent.setup();
    render(<Members />);
    await user.click(screen.getByRole('button', { name: 'Invite' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(dialog.querySelector<HTMLInputElement>('[data-slot="tag-input-field"]')!, 'new@hirael.com');
    await user.click(screen.getByRole('button', { name: /send invite/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByText('new@hirael.com')).toBeInTheDocument();
  });
});
