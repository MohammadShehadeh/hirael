import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/copy-button';
import * as radix from '@/registry/hirael/bases/radix/components/copy-button';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('CopyButton (%s)', (_, { CopyButton }) => {
  const execCommand = vi.fn<(command: string) => boolean>();

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('Permission denied')) },
    });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
  });

  afterEach(() => {
    execCommand.mockReset();
  });

  it('should fall back to execCommand when the clipboard API rejects', async () => {
    execCommand.mockReturnValue(true);
    const onCopy = vi.fn();
    const onCopyError = vi.fn();
    render(<CopyButton value="hello" onCopy={onCopy} onCopyError={onCopyError} />);
    const button = screen.getByRole('button', { name: 'Copy to clipboard' });
    button.focus();
    fireEvent.click(button);

    await waitFor(() => expect(onCopy).toHaveBeenCalledWith('hello'));
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(onCopyError).not.toHaveBeenCalled();
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('data-state', 'copied');
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
  });

  it('should call onCopyError and flag the error state when every copy path fails', async () => {
    execCommand.mockReturnValue(false);
    const onCopy = vi.fn();
    const onCopyError = vi.fn();
    render(<CopyButton value="hello" onCopy={onCopy} onCopyError={onCopyError} />);
    const button = screen.getByRole('button', { name: 'Copy to clipboard' });
    fireEvent.click(button);

    await waitFor(() => expect(onCopyError).toHaveBeenCalledTimes(1));
    expect(onCopy).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('data-state', 'error');
    expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
  });

  it('should build a lazy value only when clicked', async () => {
    execCommand.mockReturnValue(true);
    const getValue = vi.fn(() => 'lazy');
    const onCopy = vi.fn();
    render(<CopyButton value={getValue} onCopy={onCopy} />);
    expect(getValue).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(onCopy).toHaveBeenCalledWith('lazy'));
    expect(getValue).toHaveBeenCalledTimes(1);
  });
});
