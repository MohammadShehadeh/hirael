import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/command-palette';
import * as radix from '@/registry/hirael/bases/radix/components/command-palette';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('CommandPalette (%s)', (_, { CommandPalette }) => {
  const setup = () => {
    const onOpenChange = vi.fn();
    render(
      <CommandPalette onOpenChange={onOpenChange}>
        <input aria-label="Notes" />
        <div contentEditable suppressContentEditableWarning data-testid="editor" />
      </CommandPalette>,
    );

    return { onOpenChange };
  };

  it('should ignore the shortcut while typing in an editable field', () => {
    const { onOpenChange } = setup();
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Notes' }), { key: 'k', ctrlKey: true });
    fireEvent.keyDown(screen.getByTestId('editor'), { key: 'k', metaKey: true });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should ignore the shortcut with shift or alt held', () => {
    const { onOpenChange } = setup();
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true, shiftKey: true });
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true, altKey: true });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should open on the shortcut outside editable fields', () => {
    const { onOpenChange } = setup();
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
