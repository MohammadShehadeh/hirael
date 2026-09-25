'use client';

import * as React from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';

type Orientation = 'vertical' | 'horizontal';

const INTERACTIVE = 'button, a, input, textarea, select, [contenteditable]:not([contenteditable="false"])';

// Presses on controls inside an item (an edit button, a link) stay clicks; only the handle or the item itself drags.
const startsDrag = (target: EventTarget | null) =>
  target instanceof Element && (!target.closest(INTERACTIVE) || target.closest('[data-drag-handle]') !== null);

class ItemPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent }: React.PointerEvent) => nativeEvent.button === 0 && startsDrag(nativeEvent.target),
    },
  ];
}

class ItemKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: (event: React.KeyboardEvent) =>
        (event.code === 'Space' || event.code === 'Enter') &&
        event.target === event.currentTarget &&
        (event.preventDefault(), true),
    },
  ];
}

/** Pointer and keyboard sensors that leave controls inside a draggable item clickable. Shared with Kanban. */
const useSortableSensors = () =>
  useSensors(
    useSensor(ItemPointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(ItemKeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

interface SortableCtx {
  order: string[];
}

const SortableOrderContext = React.createContext<SortableCtx | null>(null);

interface SortableItemCtx {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  setActivatorNodeRef: (el: HTMLElement | null) => void;
  setHasHandle: (has: boolean) => void;
  dragging: boolean;
  disabled: boolean;
}

const SortableItemContext = React.createContext<SortableItemCtx | null>(null);

export interface SortableProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Item values in their current order. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  orientation?: Orientation;
  disabled?: boolean;
}

const Sortable = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = 'vertical',
  disabled = false,
  className,
  children,
  ...props
}: SortableProps) => {
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const order = valueProp ?? internal;
  const id = React.useId();

  const sensors = useSortableSensors();

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const next = arrayMove(order, order.indexOf(String(active.id)), order.indexOf(String(over.id)));
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const ctx = React.useMemo(() => ({ order }), [order]);

  return (
    <DndContext id={id} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={order}
        disabled={disabled}
        strategy={orientation === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy}
      >
        <SortableOrderContext.Provider value={ctx}>
          <div
            role="list"
            data-slot="sortable"
            data-orientation={orientation}
            data-disabled={disabled || undefined}
            className={cn(
              'flex gap-2',
              orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center',
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </SortableOrderContext.Provider>
      </SortableContext>
    </DndContext>
  );
};

export interface SortableItemProps extends React.ComponentProps<'div'> {
  /** This item's value in the `Sortable` order. */
  value: string;
  disabled?: boolean;
}

const SortableItem = ({ value, disabled = false, className, style, ...props }: SortableItemProps) => {
  const ctx = React.useContext(SortableOrderContext);
  if (!ctx) throw new Error('SortableItem must be used inside <Sortable>');
  const [hasHandle, setHasHandle] = React.useState(false);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: value,
    disabled,
  });
  const index = ctx.order.indexOf(value);

  const itemCtx = React.useMemo<SortableItemCtx>(
    () => ({
      attributes,
      listeners,
      setActivatorNodeRef,
      setHasHandle,
      dragging: isDragging,
      disabled,
    }),
    [attributes, listeners, setActivatorNodeRef, isDragging, disabled],
  );

  return (
    <SortableItemContext.Provider value={itemCtx}>
      <div
        ref={setNodeRef}
        role="listitem"
        data-slot="sortable-item"
        data-state={isDragging ? 'grabbed' : 'idle'}
        data-disabled={disabled || undefined}
        style={{
          ...style,
          // Children render in any order; the value array decides where each one sits.
          order: index === -1 ? undefined : index,
          transform: CSS.Translate.toString(transform),
          transition,
        }}
        {...(hasHandle ? {} : { ...attributes, ...listeners })}
        className={cn(
          'group/sortable-item relative flex items-center gap-2 rounded-md border border-border bg-background text-sm transition-[box-shadow,background-color] outline-none select-none',
          !hasHandle && !disabled && 'cursor-grab touch-none',
          !hasHandle &&
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isDragging && 'z-10 cursor-grabbing border-ring bg-card shadow-lg',
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      />
    </SortableItemContext.Provider>
  );
};

const SortableHandle = ({ className, children, ...props }: React.ComponentProps<'button'>) => {
  const ctx = React.useContext(SortableItemContext);
  if (!ctx) throw new Error('SortableHandle must be used inside <SortableItem>');
  const { attributes, listeners, setActivatorNodeRef, setHasHandle, dragging, disabled } = ctx;

  React.useLayoutEffect(() => {
    setHasHandle(true);

    return () => setHasHandle(false);
  }, [setHasHandle]);

  return (
    <button
      ref={setActivatorNodeRef}
      type="button"
      data-slot="sortable-handle"
      data-drag-handle=""
      data-state={dragging ? 'grabbed' : 'idle'}
      disabled={disabled}
      aria-label="Drag to reorder"
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

export { Sortable, SortableItem, SortableHandle, useSortableSensors };
