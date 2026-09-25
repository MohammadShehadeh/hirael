'use client';

import * as React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useSortableSensors } from '@/registry/hirael/bases/base/components/sortable';

export type KanbanValue = Record<string, string[]>;

export interface KanbanMove {
  cardId: string;
  from: { columnId: string; index: number };
  to: { columnId: string; index: number };
}

const CARD_CLASS =
  'group/kanban-card relative flex shrink-0 flex-col gap-2 rounded-md border border-border bg-card p-3 text-sm text-card-foreground shadow-xs outline-none select-none';

const columnOf = (board: KanbanValue, id: string) =>
  id in board ? id : Object.keys(board).find((column) => board[column].includes(id));

interface KanbanCtx {
  value: KanbanValue;
  disabled: boolean;
  /** Each card hands its content here so the drag overlay can render it outside the column. */
  cardContent: React.RefObject<Map<string, { className?: string; children: React.ReactNode }>>;
}

const KanbanContext = React.createContext<KanbanCtx | null>(null);

const useKanban = () => {
  const ctx = React.useContext(KanbanContext);
  if (!ctx) throw new Error('Kanban parts must be used inside <Kanban>');

  return ctx;
};

const KanbanColumnContext = React.createContext<string | null>(null);

const useKanbanColumn = () => {
  const id = React.useContext(KanbanColumnContext);
  if (id === null) throw new Error('Kanban column parts must be used inside <KanbanColumn>');

  return id;
};

interface KanbanCardCtx {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  setActivatorNodeRef: (el: HTMLElement | null) => void;
  setHasHandle: (has: boolean) => void;
  dragging: boolean;
  disabled: boolean;
}

const KanbanCardContext = React.createContext<KanbanCardCtx | null>(null);

export interface KanbanProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Column id to ordered card ids. */
  value?: KanbanValue;
  defaultValue?: KanbanValue;
  onValueChange?: (value: KanbanValue) => void;
  /** Fires once per completed move with the source and destination. */
  onCardMove?: (move: KanbanMove) => void;
  disabled?: boolean;
}

const Kanban = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  onCardMove,
  disabled = false,
  className,
  children,
  ...props
}: KanbanProps) => {
  const [internal, setInternal] = React.useState<KanbanValue>(defaultValue ?? {});
  const committed = valueProp ?? internal;
  // The board mid-drag: cards hop columns here, and only the drop commits it.
  const [preview, setPreview] = React.useState<KanbanValue | null>(null);
  const [active, setActive] = React.useState<{ className?: string; children: React.ReactNode } | null>(null);
  const value = preview ?? committed;
  const cardContent = React.useRef(new Map<string, { className?: string; children: React.ReactNode }>());
  const id = React.useId();
  const sensors = useSortableSensors();

  const reset = () => {
    setActive(null);
    setPreview(null);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActive(cardContent.current.get(String(active.id)) ?? null);
    setPreview(committed);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    setPreview((board) => {
      const current = board ?? committed;
      const cardId = String(active.id);
      const from = columnOf(current, cardId);
      const to = columnOf(current, String(over.id));
      if (!from || !to || from === to) return current;
      const target = current[to];
      const overIndex = target.indexOf(String(over.id));
      const index = overIndex === -1 ? target.length : overIndex;

      return {
        ...current,
        [from]: current[from].filter((card) => card !== cardId),
        [to]: [...target.slice(0, index), cardId, ...target.slice(index)],
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const board = preview ?? committed;
    reset();
    const cardId = String(active.id);
    const column = columnOf(board, cardId);
    if (!over || !column) return;
    const ids = board[column];
    const overIndex = ids.indexOf(String(over.id));
    const next =
      overIndex === -1 || overIndex === ids.indexOf(cardId)
        ? board
        : { ...board, [column]: arrayMove(ids, ids.indexOf(cardId), overIndex) };

    const fromColumn = columnOf(committed, cardId);
    if (!fromColumn) return;
    const from = { columnId: fromColumn, index: committed[fromColumn].indexOf(cardId) };
    const to = { columnId: column, index: next[column].indexOf(cardId) };
    if (from.columnId === to.columnId && from.index === to.index) return;
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
    onCardMove?.({ cardId, from, to });
  };

  const ctx = React.useMemo<KanbanCtx>(() => ({ value, disabled, cardContent }), [value, disabled]);

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={reset}
    >
      <KanbanContext.Provider value={ctx}>
        <div
          data-slot="kanban"
          data-disabled={disabled || undefined}
          className={cn('flex items-start gap-4 overflow-x-auto pb-2', className)}
          {...props}
        >
          {children}
        </div>
      </KanbanContext.Provider>
      <DragOverlay>
        {active && (
          <div
            data-slot="kanban-card-overlay"
            className={cn(CARD_CLASS, 'cursor-grabbing border-ring shadow-lg', active.className)}
          >
            {active.children}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export interface KanbanColumnProps extends React.ComponentProps<'div'> {
  /** Key in the root `value`. */
  id: string;
}

const KanbanColumn = ({ id, className, ...props }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <KanbanColumnContext.Provider value={id}>
      <div
        ref={setNodeRef}
        data-slot="kanban-column"
        data-column-id={id}
        data-drop-target={isOver || undefined}
        className={cn(
          'flex max-h-full w-72 shrink-0 flex-col rounded-lg border border-border bg-muted/40 transition-colors',
          isOver && 'border-ring/60 bg-muted/70',
          className,
        )}
        {...props}
      />
    </KanbanColumnContext.Provider>
  );
};

const KanbanColumnHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="kanban-column-header"
      className={cn('flex items-center justify-between gap-2 px-3 pt-3 pb-2', className)}
      {...props}
    />
  );
};

const KanbanColumnTitle = ({ className, ...props }: React.ComponentProps<'h3'>) => {
  return (
    <h3
      data-slot="kanban-column-title"
      className={cn('truncate text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
};

const KanbanColumnCount = ({ className, children, ...props }: React.ComponentProps<'span'>) => {
  const { value } = useKanban();
  const id = useKanbanColumn();

  return (
    <span
      data-slot="kanban-column-count"
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-accent px-1.5 text-[11px] text-muted-foreground tabular-nums',
        className,
      )}
      {...props}
    >
      {children ?? value[id]?.length ?? 0}
    </span>
  );
};

export interface KanbanColumnContentProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Pass a function to render from the live card ids, so cards move between columns while dragging. */
  children?: React.ReactNode | ((cardIds: string[]) => React.ReactNode);
}

const KanbanColumnContent = ({ className, children, ...props }: KanbanColumnContentProps) => {
  const { value } = useKanban();
  const id = useKanbanColumn();
  const ids = value[id] ?? [];

  return (
    <SortableContext id={id} items={ids} strategy={verticalListSortingStrategy}>
      <div
        role="list"
        data-slot="kanban-column-content"
        className={cn('flex min-h-16 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2', className)}
        {...props}
      >
        {typeof children === 'function' ? children(ids) : children}
      </div>
    </SortableContext>
  );
};

export interface KanbanCardProps extends React.ComponentProps<'div'> {
  /** Unique card id, listed in one of the root `value` columns. */
  id: string;
  disabled?: boolean;
}

const KanbanCard = ({ id, disabled: disabledProp = false, className, style, children, ...props }: KanbanCardProps) => {
  const { disabled: rootDisabled, cardContent } = useKanban();
  const disabled = disabledProp || rootDisabled;
  const [hasHandle, setHasHandle] = React.useState(false);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  React.useEffect(() => {
    const cards = cardContent.current;
    cards.set(id, { className, children });

    return () => {
      cards.delete(id);
    };
  }, [cardContent, id, className, children]);

  const cardCtx = React.useMemo<KanbanCardCtx>(
    () => ({ attributes, listeners, setActivatorNodeRef, setHasHandle, dragging: isDragging, disabled }),
    [attributes, listeners, setActivatorNodeRef, isDragging, disabled],
  );
  const interactive = !hasHandle && !disabled;

  return (
    <KanbanCardContext.Provider value={cardCtx}>
      <div
        ref={setNodeRef}
        role="listitem"
        data-slot="kanban-card"
        data-card-id={id}
        data-state={isDragging ? 'grabbed' : 'idle'}
        data-disabled={disabled || undefined}
        style={{ ...style, transform: CSS.Translate.toString(transform), transition }}
        {...(hasHandle ? {} : { ...attributes, ...listeners })}
        className={cn(
          CARD_CLASS,
          'transition-[box-shadow,border-color] motion-reduce:transition-none',
          interactive && 'cursor-grab touch-none',
          interactive &&
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          disabled && 'opacity-50',
          className,
          isDragging && 'opacity-40',
        )}
        {...props}
      >
        {children}
      </div>
    </KanbanCardContext.Provider>
  );
};

const KanbanCardHandle = ({ className, children, ...props }: React.ComponentProps<'button'>) => {
  const ctx = React.useContext(KanbanCardContext);
  if (!ctx) throw new Error('KanbanCardHandle must be used inside <KanbanCard>');
  const { attributes, listeners, setActivatorNodeRef, setHasHandle, dragging, disabled } = ctx;

  React.useLayoutEffect(() => {
    setHasHandle(true);

    return () => setHasHandle(false);
  }, [setHasHandle]);

  return (
    <button
      ref={setActivatorNodeRef}
      type="button"
      data-slot="kanban-card-handle"
      data-drag-handle=""
      data-state={dragging ? 'grabbed' : 'idle'}
      disabled={disabled}
      aria-label="Drag to move"
      {...attributes}
      {...listeners}
      className={cn(
        'inline-flex size-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground transition-colors outline-none select-none',
        'hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed',
        dragging && 'cursor-grabbing text-foreground',
        className,
      )}
      {...props}
    >
      {children ?? <GripVertical className="size-4" />}
    </button>
  );
};

const KanbanEmpty = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { value } = useKanban();
  const id = useKanbanColumn();
  if ((value[id]?.length ?? 0) > 0) return null;

  return (
    <div
      data-slot="kanban-empty"
      className={cn(
        'flex min-h-16 items-center justify-center rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};

export {
  Kanban,
  KanbanColumn,
  KanbanColumnHeader,
  KanbanColumnTitle,
  KanbanColumnCount,
  KanbanColumnContent,
  KanbanCard,
  KanbanCardHandle,
  KanbanEmpty,
};
