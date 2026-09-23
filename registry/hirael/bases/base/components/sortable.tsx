'use client';

import * as React from 'react';
import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';

type Orientation = 'vertical' | 'horizontal';

interface ItemEntry {
  node: HTMLElement;
  disabled: boolean;
}

interface SortableCtx {
  order: string[];
  orientation: Orientation;
  disabled: boolean;
  dragId: string | null;
  grabbedId: string | null;
  registerItem: (id: string, entry: ItemEntry) => () => void;
  startPress: (e: React.PointerEvent, id: string) => void;
  handlePointerMove: (e: React.PointerEvent, id: string) => void;
  handlePointerEnd: (e: React.PointerEvent, id: string, cancel: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent, id: string) => void;
  handleBlur: (id: string) => void;
}

const SortableContext = React.createContext<SortableCtx | null>(null);

const useSortable = () => {
  const ctx = React.useContext(SortableContext);
  if (!ctx) {
    throw new Error('Sortable compound parts must be used inside <Sortable>');
  }

  return ctx;
};

type SortableItemState = 'idle' | 'grabbed';

interface SortableItemCtx {
  id: string;
  disabled: boolean;
  hasHandle: boolean;
  setHasHandle: (has: boolean) => void;
  state: SortableItemState;
}

const SortableItemContext = React.createContext<SortableItemCtx | null>(null);

const useSortableItem = () => {
  const ctx = React.useContext(SortableItemContext);
  if (!ctx) {
    throw new Error('Sortable item parts must be used inside <SortableItem>');
  }

  return ctx;
};

const DRAG_THRESHOLD = 5;

// Presses that start on these keep their own behavior instead of starting a drag.
const INTERACTIVE_SELECTOR = 'button, a, input, textarea, select, [role="button"], [contenteditable]';

const composeHandlers =
  <E extends React.SyntheticEvent>(theirs: ((event: E) => void) | undefined, ours: ((event: E) => void) | undefined) =>
  (event: E) => {
    theirs?.(event);
    if (!event.defaultPrevented) ours?.(event);
  };

const arrayMove = (arr: string[], from: number, to: number) => {
  const next = arr.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);

  return next;
};

const reorderPinned = (order: string[], isDisabled: (id: string) => boolean, id: string, toMovablePos: number) => {
  const movable = order.filter((v) => !isDisabled(v));
  const from = movable.indexOf(id);
  if (from === -1) return order;
  const to = Math.max(0, Math.min(toMovablePos, movable.length - 1));
  if (to === from) return order;
  const nextMovable = arrayMove(movable, from, to);
  let m = 0;

  return order.map((v) => (isDisabled(v) ? v : nextMovable[m++]));
};

export interface SortableProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Ordered item ids. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  orientation?: Orientation;
  disabled?: boolean;
}

const Sortable = ({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  orientation = 'vertical',
  disabled = false,
  className,
  children,
  ...props
}: SortableProps) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const [preview, setPreview] = React.useState<string[] | null>(null);
  const [dragId, setDragIdState] = React.useState<string | null>(null);
  const dragIdRef = React.useRef<string | null>(null);
  const setDragId = React.useCallback((id: string | null) => {
    dragIdRef.current = id;
    setDragIdState(id);
  }, []);
  const [grabbedId, setGrabbedId] = React.useState<string | null>(null);
  const [liveText, setLiveText] = React.useState('');

  const committed = valueProp ?? internal;
  const order = preview ?? committed;

  const orderRef = React.useRef(order);
  const committedRef = React.useRef(committed);
  React.useLayoutEffect(() => {
    orderRef.current = order;
    committedRef.current = committed;
  }, [order, committed]);

  const itemsRef = React.useRef(new Map<string, ItemEntry>());
  const pressRef = React.useRef<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const rtlRef = React.useRef(false);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const registerItem = React.useCallback((id: string, entry: ItemEntry) => {
    itemsRef.current.set(id, entry);

    return () => {
      itemsRef.current.delete(id);
    };
  }, []);

  const isDisabled = React.useCallback((id: string) => itemsRef.current.get(id)?.disabled ?? false, []);

  const announce = React.useCallback((text: string) => {
    setLiveText(text);
  }, []);

  const itemLabel = React.useCallback((id: string) => {
    return itemsRef.current.get(id)?.node.textContent?.trim() || null;
  }, []);

  const commit = React.useCallback(
    (next: string[]) => {
      setPreview(null);
      const prev = committedRef.current;
      if (next.length === prev.length && next.every((v, i) => v === prev[i])) {
        return;
      }
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const cancel = React.useCallback(() => {
    setPreview(null);
    setDragId(null);
    setGrabbedId(null);
    pressRef.current = null;
  }, [setDragId]);

  const startPress = React.useCallback(
    (e: React.PointerEvent, id: string) => {
      if (disabled || e.button !== 0) return;
      pressRef.current = { id, x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
      rtlRef.current = listRef.current !== null && getComputedStyle(listRef.current).direction === 'rtl';
    },
    [disabled],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent, id: string) => {
      const press = pressRef.current;
      if (!press || press.id !== id) return;

      if (dragIdRef.current !== id) {
        const dx = e.clientX - press.x;
        const dy = e.clientY - press.y;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        setDragId(id);
        setGrabbedId(null);
      }

      const current = orderRef.current;
      const horizontal = orientation === 'horizontal';
      const coord = horizontal ? e.clientX : e.clientY;
      const movableOthers = current.filter((v) => v !== id && !isDisabled(v));

      let before = 0;
      for (const other of movableOthers) {
        const entry = itemsRef.current.get(other);
        if (!entry) continue;
        const rect = entry.node.getBoundingClientRect();
        const mid = horizontal ? (rect.left + rect.right) / 2 : (rect.top + rect.bottom) / 2;
        const passed = horizontal && rtlRef.current ? coord < mid : coord > mid;
        if (passed) before += 1;
      }

      const movablePos = current.filter((v) => !isDisabled(v)).indexOf(id);
      if (before !== movablePos) {
        setPreview(reorderPinned(current, isDisabled, id, before));
      }
    },
    [orientation, isDisabled, setDragId],
  );

  const handlePointerEnd = React.useCallback(
    (e: React.PointerEvent, id: string, cancelled: boolean) => {
      const wasDragging = dragIdRef.current === id;
      pressRef.current = null;
      if (!wasDragging) return;
      setDragId(null);
      if (cancelled) {
        setPreview(null);

        return;
      }
      const next = orderRef.current;
      commit(next);
      const label = itemLabel(id);
      announce(
        label
          ? `Moved ${label} to position ${next.indexOf(id) + 1} of ${next.length}`
          : `Moved to position ${next.indexOf(id) + 1} of ${next.length}`,
      );
    },
    [commit, announce, itemLabel, setDragId],
  );

  const moveGrabbed = React.useCallback(
    (id: string, dir: -1 | 1) => {
      const current = orderRef.current;
      const movable = current.filter((v) => !isDisabled(v));
      const from = movable.indexOf(id);
      if (from === -1) return;
      const to = from + dir;
      if (to < 0 || to >= movable.length) return;
      const next = reorderPinned(current, isDisabled, id, to);
      setPreview(next);
      const label = itemLabel(id);
      announce(
        label
          ? `Moved ${label} to position ${next.indexOf(id) + 1} of ${next.length}`
          : `Moved to position ${next.indexOf(id) + 1} of ${next.length}`,
      );
    },
    [announce, isDisabled, itemLabel],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (disabled) return;
      const horizontal = orientation === 'horizontal';
      const rtl = listRef.current !== null && getComputedStyle(listRef.current).direction === 'rtl';

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (grabbedId === id) {
          const next = orderRef.current;
          setGrabbedId(null);
          commit(next);
          const label = itemLabel(id);
          announce(
            label
              ? `Dropped ${label} at position ${next.indexOf(id) + 1} of ${next.length}`
              : `Dropped at position ${next.indexOf(id) + 1} of ${next.length}`,
          );
        } else if (grabbedId === null && dragId === null) {
          setGrabbedId(id);
          const current = orderRef.current;
          const label = itemLabel(id);
          announce(
            `Grabbed ${label ?? 'item'}, position ${current.indexOf(id) + 1} of ${current.length}. Use arrow keys to move, Space to drop, Escape to cancel.`,
          );
        }

        return;
      }

      if (e.key === 'Escape') {
        if (grabbedId === id) {
          e.preventDefault();
          cancel();
          const label = itemLabel(id);
          announce(`Reorder cancelled. ${label ?? 'Item'} returned to its original position.`);
        }

        return;
      }

      if (grabbedId !== id) return;

      let dir: -1 | 1 | 0 = 0;
      if (horizontal) {
        if (e.key === 'ArrowLeft') dir = rtl ? 1 : -1;
        if (e.key === 'ArrowRight') dir = rtl ? -1 : 1;
      } else {
        if (e.key === 'ArrowUp') dir = -1;
        if (e.key === 'ArrowDown') dir = 1;
      }
      if (dir !== 0) {
        e.preventDefault();
        moveGrabbed(id, dir);
      }
    },
    [disabled, orientation, grabbedId, dragId, commit, cancel, announce, moveGrabbed, itemLabel],
  );

  const handleBlur = React.useCallback(
    (id: string) => {
      if (grabbedId === id) cancel();
    },
    [grabbedId, cancel],
  );

  React.useEffect(() => {
    if (!dragId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dragId, cancel]);

  const ctx = React.useMemo<SortableCtx>(
    () => ({
      order,
      orientation,
      disabled,
      dragId,
      grabbedId,
      registerItem,
      startPress,
      handlePointerMove,
      handlePointerEnd,
      handleKeyDown,
      handleBlur,
    }),
    [
      order,
      orientation,
      disabled,
      dragId,
      grabbedId,
      registerItem,
      startPress,
      handlePointerMove,
      handlePointerEnd,
      handleKeyDown,
      handleBlur,
    ],
  );

  return (
    <SortableContext.Provider value={ctx}>
      <div
        ref={listRef}
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
        <span data-slot="sortable-live" aria-live="polite" className="sr-only">
          {liveText}
        </span>
      </div>
    </SortableContext.Provider>
  );
};

export interface SortableItemProps extends React.ComponentProps<'div'> {
  /** Unique id matching an entry in the root `value`. */
  value: string;
  disabled?: boolean;
}

const SortableItem = ({
  value,
  disabled: disabledProp = false,
  className,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onKeyDown,
  onBlur,
  ...props
}: SortableItemProps) => {
  const {
    order,
    disabled: rootDisabled,
    dragId,
    grabbedId,
    registerItem,
    startPress,
    handlePointerMove,
    handlePointerEnd,
    handleKeyDown,
    handleBlur,
  } = useSortable();

  const disabled = disabledProp || rootDisabled;
  const [hasHandle, setHasHandle] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    return registerItem(value, { node, disabled });
  }, [value, disabled, registerItem]);

  const index = order.indexOf(value);
  const interactive = !hasHandle && !disabled;
  const state: SortableItemState = dragId === value || grabbedId === value ? 'grabbed' : 'idle';

  const itemCtx = React.useMemo<SortableItemCtx>(
    () => ({ id: value, disabled, hasHandle, setHasHandle, state }),
    [value, disabled, hasHandle, state],
  );

  return (
    <SortableItemContext.Provider value={itemCtx}>
      <div
        ref={ref}
        role="listitem"
        data-slot="sortable-item"
        data-state={state}
        data-disabled={disabled || undefined}
        aria-roledescription="sortable item"
        tabIndex={hasHandle || disabled ? undefined : 0}
        style={{ ...style, order: index === -1 ? undefined : index }}
        onPointerDown={composeHandlers(
          onPointerDown,
          interactive
            ? (e) => {
                const hit = (e.target as HTMLElement).closest(INTERACTIVE_SELECTOR);
                if (hit && hit !== e.currentTarget && e.currentTarget.contains(hit)) return;
                startPress(e, value);
              }
            : undefined,
        )}
        // The handle owns pointer events; bubbled copies here would end the drag twice.
        onPointerMove={composeHandlers(onPointerMove, interactive ? (e) => handlePointerMove(e, value) : undefined)}
        onPointerUp={composeHandlers(onPointerUp, interactive ? (e) => handlePointerEnd(e, value, false) : undefined)}
        onPointerCancel={composeHandlers(
          onPointerCancel,
          interactive ? (e) => handlePointerEnd(e, value, true) : undefined,
        )}
        onKeyDown={composeHandlers(
          onKeyDown,
          interactive
            ? (e) => {
                // Keys typed into inner controls bubble here; only the focused item itself moves.
                if (e.target !== e.currentTarget) return;
                handleKeyDown(e, value);
              }
            : undefined,
        )}
        onBlur={composeHandlers(onBlur, interactive ? () => handleBlur(value) : undefined)}
        className={cn(
          'group/sortable-item relative flex items-center gap-2 rounded-md border border-border bg-background text-sm transition-[box-shadow,transform,background-color] outline-none select-none',
          !hasHandle && !disabled && 'cursor-grab touch-none',
          !hasHandle &&
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          state === 'grabbed' && 'z-10 scale-[1.02] cursor-grabbing border-ring bg-card shadow-lg',
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      />
    </SortableItemContext.Provider>
  );
};

const SortableHandle = ({
  className,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onKeyDown,
  onBlur,
  ...props
}: React.ComponentProps<'button'>) => {
  const { startPress, handlePointerMove, handlePointerEnd, handleKeyDown, handleBlur } = useSortable();
  const { id, disabled, setHasHandle, state } = useSortableItem();

  React.useLayoutEffect(() => {
    setHasHandle(true);

    return () => setHasHandle(false);
  }, [setHasHandle]);

  return (
    <button
      type="button"
      data-slot="sortable-handle"
      data-state={state}
      disabled={disabled}
      aria-label="Drag to reorder"
      aria-pressed={state === 'grabbed'}
      onPointerDown={composeHandlers(onPointerDown, (e) => startPress(e, id))}
      onPointerMove={composeHandlers(onPointerMove, (e) => handlePointerMove(e, id))}
      onPointerUp={composeHandlers(onPointerUp, (e) => handlePointerEnd(e, id, false))}
      onPointerCancel={composeHandlers(onPointerCancel, (e) => handlePointerEnd(e, id, true))}
      onKeyDown={composeHandlers(onKeyDown, (e) => handleKeyDown(e, id))}
      onBlur={composeHandlers(onBlur, () => handleBlur(id))}
      className={cn(
        'inline-flex size-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground transition-colors outline-none select-none',
        'hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed',
        state === 'grabbed' && 'cursor-grabbing text-foreground',
        className,
      )}
      {...props}
    >
      {children ?? <GripVertical aria-hidden className="size-4" />}
    </button>
  );
};

export { Sortable, SortableItem, SortableHandle };
