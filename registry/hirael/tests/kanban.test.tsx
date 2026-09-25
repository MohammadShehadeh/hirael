import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/kanban';
import * as radix from '@/registry/hirael/bases/radix/components/kanban';

const registry = {
  radix,
  base,
};

const initial = { todo: ['a', 'b'], done: ['c'] };

// jsdom has no layout; dnd-kit measures cards and columns to decide where a keyboard move lands.
const COLUMN_X: Record<string, number> = { todo: 0, done: 300 };
const originalRect = Element.prototype.getBoundingClientRect;

beforeAll(() => {
  Element.prototype.getBoundingClientRect = function (this: HTMLElement) {
    const card = this.dataset?.cardId;
    const column = card
      ? Object.keys(initial).find((col) => this.closest(`[data-column-id="${col}"]`))
      : this.dataset?.columnId;
    if (!column) return originalRect.call(this);
    const siblings = card ? [...this.parentElement!.querySelectorAll('[data-card-id]')] : [];
    const top = card ? siblings.indexOf(this) * 50 : 0;
    const height = card ? 40 : 400;

    return DOMRect.fromRect({ x: COLUMN_X[column], y: top, width: 200, height });
  };
});

afterAll(() => {
  Element.prototype.getBoundingClientRect = originalRect;
});

describe.each(Object.entries(registry))(
  'Kanban (%s)',
  (_, { Kanban, KanbanColumn, KanbanColumnContent, KanbanCard }) => {
    const setup = () => {
      const onCardMove = vi.fn();
      const onValueChange = vi.fn();
      render(
        <Kanban defaultValue={initial} onCardMove={onCardMove} onValueChange={onValueChange}>
          {Object.keys(initial).map((columnId) => (
            <KanbanColumn key={columnId} id={columnId}>
              <KanbanColumnContent>
                {(ids) =>
                  ids.map((id) => (
                    <KanbanCard key={id} id={id}>
                      {`Card ${id}`}
                    </KanbanCard>
                  ))
                }
              </KanbanColumnContent>
            </KanbanColumn>
          ))}
        </Kanban>,
      );
      const card = screen.getByText('Card a');
      card.focus();

      return { onCardMove, onValueChange, card };
    };

    const press = async (target: Element, code: string) => {
      await act(async () => {
        fireEvent.keyDown(target, { code, key: code === 'Space' ? ' ' : code });
        // dnd-kit measures droppables a frame after the drag starts.
        await new Promise((resolve) => setTimeout(resolve, 20));
      });
    };

    it('should commit a keyboard move once, on drop', async () => {
      const { onCardMove, onValueChange, card } = setup();
      await press(card, 'Space');
      await press(card, 'ArrowDown');
      expect(onCardMove).not.toHaveBeenCalled();
      expect(onValueChange).not.toHaveBeenCalled();

      await press(card, 'Enter');
      expect(onCardMove).toHaveBeenCalledTimes(1);
      expect(onCardMove).toHaveBeenCalledWith({
        cardId: 'a',
        from: { columnId: 'todo', index: 0 },
        to: { columnId: 'todo', index: 1 },
      });
      expect(onValueChange).toHaveBeenCalledWith({ todo: ['b', 'a'], done: ['c'] });
    });

    it('should not commit a keyboard move cancelled with Escape', async () => {
      const { onCardMove, onValueChange, card } = setup();
      await press(card, 'Space');
      await press(card, 'ArrowDown');
      await press(card, 'Escape');
      expect(onCardMove).not.toHaveBeenCalled();
      expect(onValueChange).not.toHaveBeenCalled();
    });
  },
);
