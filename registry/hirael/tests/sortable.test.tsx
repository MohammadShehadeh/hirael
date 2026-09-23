import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/sortable';
import * as radix from '@/registry/hirael/bases/radix/components/sortable';

const registry = {
  radix,
  base,
};

beforeAll(() => {
  Element.prototype.setPointerCapture ??= () => {};
});

describe.each(Object.entries(registry))('Sortable (%s)', (_, { Sortable, SortableItem }) => {
  const setup = () => {
    const onValueChange = vi.fn();
    const onClick = vi.fn();
    render(
      <Sortable defaultValue={['a', 'b']} onValueChange={onValueChange}>
        <SortableItem value="a">
          <span>Item a</span>
          <button type="button" onClick={onClick}>
            Edit a
          </button>
        </SortableItem>
        <SortableItem value="b">Item b</SortableItem>
      </Sortable>,
    );

    const item = screen.getByText('Item a').closest<HTMLElement>('[data-slot="sortable-item"]');
    if (!item) throw new Error('sortable item not rendered');

    return { onValueChange, onClick, item, button: screen.getByRole('button', { name: 'Edit a' }) };
  };

  const drag = (target: HTMLElement) => {
    fireEvent.pointerDown(target, { button: 0, pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 0, clientY: 40 });
  };

  it('should start a drag from the item itself', () => {
    const { item } = setup();
    drag(screen.getByText('Item a'));
    expect(item).toHaveAttribute('data-state', 'grabbed');
  });

  it('should not start a drag from a button inside an item', () => {
    const { item, button, onValueChange } = setup();
    drag(button);
    expect(item).toHaveAttribute('data-state', 'idle');
    fireEvent.pointerUp(button, { pointerId: 1 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('should not grab the item when Space is pressed on an inner button', () => {
    const { item, button } = setup();
    button.focus();
    fireEvent.keyDown(button, { key: ' ' });
    expect(item).toHaveAttribute('data-state', 'idle');
  });
});
