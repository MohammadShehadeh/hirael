import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/tool-call';
import * as radix from '@/registry/hirael/bases/radix/components/tool-call';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('ToolCall (%s)', (_, { ToolCall }) => {
  it('should show the input and output once opened', async () => {
    render(<ToolCall name="search_docs" status="done" input={{ query: 'calendar' }} output={['Event Calendar']} />);
    expect(screen.queryByText(/"query": "calendar"/)).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: /search_docs/ }));
    expect(screen.getByText(/"query": "calendar"/)).toBeInTheDocument();
    expect(screen.getByText(/"Event Calendar"/)).toBeInTheDocument();
  });

  it('should stay open and ask for approval', async () => {
    const onApprove = vi.fn();
    const onDeny = vi.fn();
    render(<ToolCall name="deploy" status="approval" input={{ env: 'prod' }} onApprove={onApprove} onDeny={onDeny} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Deny' }));
    await user.click(screen.getByRole('button', { name: 'Allow' }));
    expect(onDeny).toHaveBeenCalledOnce();
    expect(onApprove).toHaveBeenCalledOnce();
  });

  it('should open on its own when the call failed', () => {
    render(<ToolCall name="read_file" status="error" error="ENOENT" />);
    expect(screen.getByText('ENOENT')).toBeInTheDocument();
  });
});
