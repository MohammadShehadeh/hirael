import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/kanban';
import * as radix from '@/registry/hirael/bases/radix/components/kanban';

const registry = {
  radix,
  base,
};

const initial = { todo: ['a', 'b'], done: ['c'] };

describe.each(Object.entries(registry))(
  'Kanban (%s)',
  (_, { Kanban, KanbanColumn, KanbanColumnContent, KanbanCard }) => {
    const setup = () => {
      const onCardMove = vi.fn();
      const onValueChange = vi.fn();
      render(
        <Kanban defaultValue={initial} onCardMove={onCardMove} onValueChange={onValueChange}>
          {Object.entries(initial).map(([columnId, cards]) => (
            <KanbanColumn key={columnId} id={columnId}>
              <KanbanColumnContent>
                {cards.map((id) => (
                  <KanbanCard key={id} id={id}>
                    {`Card ${id}`}
                  </KanbanCard>
                ))}
              </KanbanColumnContent>
            </KanbanColumn>
          ))}
        </Kanban>,
      );

      return { onCardMove, onValueChange, card: screen.getByText('Card a') };
    };

    it('should fire onCardMove once when a keyboard move is dropped', () => {
      const { onCardMove, onValueChange, card } = setup();
      card.focus();
      fireEvent.keyDown(card, { key: ' ' });
      fireEvent.keyDown(card, { key: 'ArrowDown' });
      expect(onCardMove).not.toHaveBeenCalled();
      expect(onValueChange).not.toHaveBeenCalled();

      fireEvent.keyDown(screen.getByText('Card a'), { key: 'Enter' });
      expect(onCardMove).toHaveBeenCalledTimes(1);
      expect(onCardMove).toHaveBeenCalledWith({
        cardId: 'a',
        from: { columnId: 'todo', index: 0 },
        to: { columnId: 'todo', index: 1 },
      });
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith({ todo: ['b', 'a'], done: ['c'] });
    });

    it('should not fire onCardMove when a keyboard move is cancelled with Escape', () => {
      const { onCardMove, onValueChange, card } = setup();
      card.focus();
      fireEvent.keyDown(card, { key: ' ' });
      fireEvent.keyDown(card, { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByText('Card a'), { key: 'Escape' });
      expect(onCardMove).not.toHaveBeenCalled();
      expect(onValueChange).not.toHaveBeenCalled();
    });
  },
);
