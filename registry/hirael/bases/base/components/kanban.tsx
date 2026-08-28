'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Column id to ordered card ids. */
export type KanbanValue = Record<string, string[]>;

export interface KanbanMove {
  cardId: string;
  from: { columnId: string; index: number };
  to: { columnId: string; index: number };
}

interface CardEntry {
  node: HTMLElement;
  columnId: string;
  disabled: boolean;
}

interface ColumnEntry {
  node: HTMLElement;
}

interface DropTarget {
  columnId: string;
  index: number;
}

interface DragState {
  id: string;
  rect: { left: number; top: number; width: number; height: number };
  /** Static clone of the card that follows the pointer. */
  ghost: HTMLElement;
}

interface KanbanCtx {
  value: KanbanValue;
  disabled: boolean;
  dragId: string | null;
  grabbedId: string | null;
  drag: DragState | null;
  dropTarget: DropTarget | null;
  registerColumn: (id: string, entry: ColumnEntry) => () => void;
  registerCard: (id: string, entry: CardEntry) => () => void;
  startPress: (e: React.PointerEvent, id: string) => void;
  handlePointerMove: (e: React.PointerEvent, id: string) => void;
  handlePointerEnd: (e: React.PointerEvent, id: string, cancel: boolean) => void;
  handleKeyDown: (e: React.KeyboardEvent, id: string) => void;
  handleBlur: (id: string) => void;
}

const KanbanContext = React.createContext<KanbanCtx | null>(null);

const useKanban = () => {
  const ctx = React.useContext(KanbanContext);
  if (!ctx) {
    throw new Error('Kanban compound parts must be used inside <Kanban>');
  }
  return ctx;
};

interface KanbanColumnCtx {
  id: string;
}

const KanbanColumnContext = React.createContext<KanbanColumnCtx | null>(null);

const useKanbanColumn = () => {
  const ctx = React.useContext(KanbanColumnContext);
  if (!ctx) {
    throw new Error('Kanban column parts must be used inside <KanbanColumn>');
  }
  return ctx;
};

interface KanbanCardCtx {
  id: string;
  disabled: boolean;
  hasHandle: boolean;
  setHasHandle: (has: boolean) => void;
  state: 'idle' | 'grabbed';
}

const KanbanCardContext = React.createContext<KanbanCardCtx | null>(null);

const useKanbanCard = () => {
  const ctx = React.useContext(KanbanCardContext);
  if (!ctx) {
    throw new Error('Kanban card parts must be used inside <KanbanCard>');
  }
  return ctx;
};

const DRAG_THRESHOLD = 5;

const findCard = (value: KanbanValue, cardId: string) => {
  for (const columnId of Object.keys(value)) {
    const index = value[columnId].indexOf(cardId);
    if (index !== -1) return { columnId, index };
  }
  return null;
};

const moveCard = (value: KanbanValue, cardId: string, to: DropTarget): KanbanValue | null => {
  const from = findCard(value, cardId);
  if (!from || !(to.columnId in value)) return null;
  const next: KanbanValue = { ...value };
  const source = next[from.columnId].filter((id) => id !== cardId);
  next[from.columnId] = source;
  const target = to.columnId === from.columnId ? source : next[to.columnId].slice();
  const index = Math.max(0, Math.min(to.index, target.length));
  target.splice(index, 0, cardId);
  next[to.columnId] = target;
  return next;
};

const sameValue = (a: KanbanValue, b: KanbanValue) => {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => {
    const x = a[k];
    const y = b[k];
    return !!y && x.length === y.length && x.every((v, i) => v === y[i]);
  });
};

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
  defaultValue = {},
  onValueChange,
  onCardMove,
  disabled = false,
  className,
  children,
  ...props
}: KanbanProps) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const [drag, setDrag] = React.useState<DragState | null>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = React.useState<DropTarget | null>(null);
  const [grabbedId, setGrabbedId] = React.useState<string | null>(null);
  const [liveText, setLiveText] = React.useState('');

  const value = valueProp ?? internal;
  const valueRef = React.useRef(value);
  React.useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const columnsRef = React.useRef(new Map<string, ColumnEntry>());
  const cardsRef = React.useRef(new Map<string, CardEntry>());
  const pressRef = React.useRef<{ id: string; x: number; y: number } | null>(null);
  const dropRef = React.useRef<DropTarget | null>(null);
  const dragRef = React.useRef<DragState | null>(null);
  const snapshotRef = React.useRef<KanbanValue | null>(null);
  const pendingFocusRef = React.useRef<string | null>(null);

  const registerColumn = React.useCallback((id: string, entry: ColumnEntry) => {
    columnsRef.current.set(id, entry);
    return () => {
      columnsRef.current.delete(id);
    };
  }, []);

  const registerCard = React.useCallback((id: string, entry: CardEntry) => {
    cardsRef.current.set(id, entry);
    return () => {
      cardsRef.current.delete(id);
    };
  }, []);

  const announce = React.useCallback((text: string) => setLiveText(text), []);

  const cardLabel = React.useCallback((id: string) => {
    return cardsRef.current.get(id)?.node.textContent?.trim() || 'card';
  }, []);

  const columnLabel = React.useCallback((id: string) => {
    const node = columnsRef.current.get(id)?.node;
    const title = node?.querySelector<HTMLElement>('[data-slot="kanban-column-title"]');
    return title?.textContent?.trim() || id;
  }, []);

  /** Column ids in DOM order, so arrow keys follow what is on screen. */
  const orderedColumns = React.useCallback(() => {
    return Array.from(columnsRef.current.entries())
      .sort(([, a], [, b]) => (a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      .map(([id]) => id);
  }, []);

  const commit = React.useCallback(
    (next: KanbanValue, move?: KanbanMove) => {
      if (sameValue(next, valueRef.current)) return;
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
      if (move) onCardMove?.(move);
    },
    [valueProp, onValueChange, onCardMove],
  );

  const describe = React.useCallback(
    (verb: string, id: string, next: KanbanValue) => {
      const pos = findCard(next, id);
      if (!pos) return `${verb} ${cardLabel(id)}`;
      const total = next[pos.columnId].length;
      return `${verb} ${cardLabel(id)} to ${columnLabel(pos.columnId)}, position ${pos.index + 1} of ${total}`;
    },
    [cardLabel, columnLabel],
  );

  const resetDrag = React.useCallback(() => {
    pressRef.current = null;
    dropRef.current = null;
    setDrag(null);
    setDropTarget(null);
    setOffset({ x: 0, y: 0 });
  }, []);

  const startPress = React.useCallback(
    (e: React.PointerEvent, id: string) => {
      if (disabled || e.button !== 0 || grabbedId) return;
      pressRef.current = { id, x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [disabled, grabbedId],
  );

  const locate = React.useCallback((x: number, y: number, dragging: string): DropTarget | null => {
    let columnId: string | null = null;
    for (const [id, entry] of columnsRef.current) {
      const r = entry.node.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        columnId = id;
        break;
      }
    }
    if (!columnId) return dropRef.current;
    const ids = (valueRef.current[columnId] ?? []).filter((id) => id !== dragging);
    let index = 0;
    for (const id of ids) {
      const entry = cardsRef.current.get(id);
      if (!entry) continue;
      const r = entry.node.getBoundingClientRect();
      if (y > (r.top + r.bottom) / 2) index += 1;
    }
    return { columnId, index };
  }, []);

  const updateDrag = React.useCallback(
    (x: number, y: number) => {
      const press = pressRef.current;
      const active = dragRef.current;
      if (!press || !active) return;
      setOffset({ x: x - press.x, y: y - press.y });
      const next = locate(x, y, active.id);
      const prev = dropRef.current;
      if (next && (!prev || prev.columnId !== next.columnId || prev.index !== next.index)) {
        dropRef.current = next;
        setDropTarget(next);
      }
    },
    [locate],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent, id: string) => {
      const press = pressRef.current;
      if (!press || press.id !== id || dragRef.current) return;
      const dx = e.clientX - press.x;
      const dy = e.clientY - press.y;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      const entry = cardsRef.current.get(id);
      if (!entry) return;
      const r = entry.node.getBoundingClientRect();
      const ghost = entry.node.cloneNode(true) as HTMLElement;
      ghost.removeAttribute('tabindex');
      ghost.removeAttribute('id');
      ghost.setAttribute('aria-hidden', 'true');
      const from = findCard(valueRef.current, id);
      dropRef.current = from ? { columnId: from.columnId, index: from.index } : null;
      const state: DragState = {
        id,
        rect: { left: r.left, top: r.top, width: r.width, height: r.height },
        ghost,
      };
      dragRef.current = state;
      setDrag(state);
      setDropTarget(dropRef.current);
      updateDrag(e.clientX, e.clientY);
    },
    [updateDrag],
  );

  const finishDrag = React.useCallback(
    (cancelled: boolean) => {
      const active = dragRef.current;
      const target = dropRef.current;
      dragRef.current = null;
      resetDrag();
      if (!active || cancelled || !target) return;
      const id = active.id;
      const current = valueRef.current;
      const from = findCard(current, id);
      const next = moveCard(current, id, target);
      if (!next || !from) return;
      const to = findCard(next, id);
      commit(next, to ? { cardId: id, from, to } : undefined);
      announce(describe('Moved', id, next));
    },
    [resetDrag, commit, announce, describe],
  );

  const handlePointerEnd = React.useCallback((_e: React.PointerEvent, id: string) => {
    // While dragging, the document listeners below own the pointer.
    if (dragRef.current) return;
    if (pressRef.current?.id === id) pressRef.current = null;
  }, []);

  React.useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent) => updateDrag(e.clientX, e.clientY);
    const onUp = () => finishDrag(false);
    const onCancel = () => finishDrag(true);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onCancel);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onCancel);
    };
  }, [drag, updateDrag, finishDrag]);

  const moveGrabbed = React.useCallback(
    (id: string, key: string, rtl: boolean) => {
      const current = valueRef.current;
      const from = findCard(current, id);
      if (!from) return;
      let target: DropTarget | null = null;
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        const dir = key === 'ArrowUp' ? -1 : 1;
        const len = current[from.columnId].length;
        const index = from.index + dir;
        if (index < 0 || index >= len) return;
        target = { columnId: from.columnId, index };
      } else {
        const columns = orderedColumns();
        const at = columns.indexOf(from.columnId);
        let dir = key === 'ArrowRight' ? 1 : -1;
        if (rtl) dir = -dir;
        const columnId = columns[at + dir];
        if (!columnId || !(columnId in current)) return;
        target = {
          columnId,
          index: Math.min(from.index, current[columnId].length),
        };
      }
      const next = moveCard(current, id, target);
      if (!next) return;
      pendingFocusRef.current = id;
      const to = findCard(next, id);
      commit(next, to ? { cardId: id, from, to } : undefined);
      announce(describe('Moved', id, next));
    },
    [orderedColumns, commit, announce, describe],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (disabled || drag) return;
      const isGrabbed = grabbedId === id;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (isGrabbed) {
          setGrabbedId(null);
          snapshotRef.current = null;
          announce(describe('Dropped', id, valueRef.current));
        } else if (grabbedId === null) {
          setGrabbedId(id);
          snapshotRef.current = valueRef.current;
          const pos = findCard(valueRef.current, id);
          announce(
            `Grabbed ${cardLabel(id)}${
              pos
                ? `, ${columnLabel(pos.columnId)}, position ${pos.index + 1} of ${valueRef.current[pos.columnId].length}`
                : ''
            }. Use arrow keys to move between cards and columns, Space to drop, Escape to cancel.`,
          );
        }
        return;
      }

      if (e.key === 'Escape') {
        if (!isGrabbed) return;
        e.preventDefault();
        const snapshot = snapshotRef.current;
        setGrabbedId(null);
        snapshotRef.current = null;
        if (snapshot) {
          pendingFocusRef.current = id;
          commit(snapshot);
        }
        announce(`Move cancelled. ${cardLabel(id)} returned to its original position.`);
        return;
      }

      if (!isGrabbed) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const rtl = rootRef.current !== null && getComputedStyle(rootRef.current).direction === 'rtl';
        moveGrabbed(id, e.key, rtl);
      }
    },
    [disabled, drag, grabbedId, announce, describe, cardLabel, columnLabel, commit, moveGrabbed],
  );

  const handleBlur = React.useCallback(
    (id: string) => {
      if (grabbedId !== id || pendingFocusRef.current === id) return;
      setGrabbedId(null);
      snapshotRef.current = null;
    },
    [grabbedId],
  );

  // A keyboard move may remount the card in another column; put focus back.
  React.useEffect(() => {
    const id = pendingFocusRef.current;
    if (!id) return;
    const node = cardsRef.current.get(id)?.node;
    const focusable = node?.querySelector<HTMLElement>('[data-slot="kanban-card-handle"]') ?? node;
    focusable?.focus({ preventScroll: false });
    pendingFocusRef.current = null;
  });

  React.useEffect(() => {
    if (!drag) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        finishDrag(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drag, finishDrag]);

  const ctx = React.useMemo<KanbanCtx>(
    () => ({
      value,
      disabled,
      dragId: drag?.id ?? null,
      grabbedId,
      drag,
      dropTarget,
      registerColumn,
      registerCard,
      startPress,
      handlePointerMove,
      handlePointerEnd,
      handleKeyDown,
      handleBlur,
    }),
    [
      value,
      disabled,
      drag,
      grabbedId,
      dropTarget,
      registerColumn,
      registerCard,
      startPress,
      handlePointerMove,
      handlePointerEnd,
      handleKeyDown,
      handleBlur,
    ],
  );

  return (
    <KanbanContext.Provider value={ctx}>
      <div
        ref={rootRef}
        data-slot="kanban"
        data-dragging={drag ? '' : undefined}
        data-disabled={disabled || undefined}
        className={cn('flex items-start gap-4 overflow-x-auto', drag && 'cursor-grabbing', className)}
        {...props}
      >
        {children}
        <span data-slot="kanban-live" aria-live="polite" className="sr-only">
          {liveText}
        </span>
      </div>
      {drag ? <KanbanDragOverlay drag={drag} offset={offset} /> : null}
    </KanbanContext.Provider>
  );
};

const KanbanDragOverlay = ({ drag, offset }: { drag: DragState; offset: { x: number; y: number } }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { ghost } = drag;

  React.useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.replaceChildren(ghost);
    return () => {
      host.replaceChildren();
    };
  }, [ghost]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={ref}
      data-slot="kanban-drag-overlay"
      aria-hidden
      className="pointer-events-none fixed z-50 rotate-1 opacity-90 shadow-lg motion-reduce:rotate-0 [&>*]:h-full [&>*]:w-full"
      style={{
        left: drag.rect.left,
        top: drag.rect.top,
        width: drag.rect.width,
        height: drag.rect.height,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    />,
    document.body,
  );
};

export interface KanbanColumnProps extends React.ComponentProps<'div'> {
  /** Key in the root `value`. */
  id: string;
}

const KanbanColumn = ({ id, className, ...props }: KanbanColumnProps) => {
  const { registerColumn, dropTarget, drag } = useKanban();
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    return registerColumn(id, { node });
  }, [id, registerColumn]);

  const isTarget = !!drag && dropTarget?.columnId === id;
  const columnCtx = React.useMemo<KanbanColumnCtx>(() => ({ id }), [id]);

  return (
    <KanbanColumnContext.Provider value={columnCtx}>
      <div
        ref={ref}
        data-slot="kanban-column"
        data-column-id={id}
        data-drop-target={isTarget || undefined}
        className={cn(
          'flex max-h-full w-72 shrink-0 flex-col rounded-lg border border-border bg-muted/40 transition-colors',
          isTarget && 'border-ring/60 bg-muted/70',
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
  const { id } = useKanbanColumn();
  const count = value[id]?.length ?? 0;
  return (
    <span
      data-slot="kanban-column-count"
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-accent px-1.5 font-mono text-[11px] text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children ?? count}
    </span>
  );
};

export interface KanbanColumnContentProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Pass a function to render from the live card ids of this column. */
  children?: React.ReactNode | ((cardIds: string[]) => React.ReactNode);
}

const KanbanColumnContent = ({ className, children, ...props }: KanbanColumnContentProps) => {
  const { value, drag, dropTarget } = useKanban();
  const { id } = useKanbanColumn();
  const ids = value[id] ?? [];
  const placeholderIndex = drag && dropTarget?.columnId === id ? dropTarget.index : null;

  return (
    <div
      role="list"
      data-slot="kanban-column-content"
      className={cn('flex min-h-16 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2', className)}
      {...props}
    >
      {typeof children === 'function' ? children(ids) : children}
      {placeholderIndex !== null && drag ? (
        <div
          data-slot="kanban-placeholder"
          aria-hidden
          className="shrink-0 rounded-md border border-dashed border-ring/60 bg-accent/40"
          style={{ order: placeholderIndex * 2 + 1, height: drag.rect.height }}
        />
      ) : null}
    </div>
  );
};

export interface KanbanCardProps extends React.ComponentProps<'div'> {
  /** Unique card id, listed in one of the root `value` columns. */
  id: string;
  disabled?: boolean;
}

const KanbanCard = ({ id, disabled: disabledProp = false, className, style, ...props }: KanbanCardProps) => {
  const {
    value,
    disabled: rootDisabled,
    dragId,
    grabbedId,
    registerCard,
    startPress,
    handlePointerMove,
    handlePointerEnd,
    handleKeyDown,
    handleBlur,
  } = useKanban();
  const { id: columnId } = useKanbanColumn();

  const disabled = disabledProp || rootDisabled;
  const [hasHandle, setHasHandle] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    return registerCard(id, { node, columnId, disabled });
  }, [id, columnId, disabled, registerCard]);

  const visible = (value[columnId] ?? []).filter((v) => v !== dragId);
  const index = visible.indexOf(id);
  const isDragging = dragId === id;
  const state: 'idle' | 'grabbed' = isDragging || grabbedId === id ? 'grabbed' : 'idle';

  const cardCtx = React.useMemo<KanbanCardCtx>(
    () => ({ id, disabled, hasHandle, setHasHandle, state }),
    [id, disabled, hasHandle, state],
  );

  const interactive = !hasHandle && !disabled;

  return (
    <KanbanCardContext.Provider value={cardCtx}>
      <div
        ref={ref}
        role="listitem"
        data-slot="kanban-card"
        data-card-id={id}
        data-state={state}
        data-disabled={disabled || undefined}
        aria-roledescription="draggable card"
        tabIndex={interactive ? 0 : undefined}
        hidden={isDragging}
        style={{ ...style, order: index === -1 ? undefined : index * 2 + 2 }}
        onPointerDown={interactive ? (e) => startPress(e, id) : undefined}
        onPointerMove={disabled ? undefined : (e) => handlePointerMove(e, id)}
        onPointerUp={disabled ? undefined : (e) => handlePointerEnd(e, id, false)}
        onPointerCancel={disabled ? undefined : (e) => handlePointerEnd(e, id, true)}
        onKeyDown={interactive ? (e) => handleKeyDown(e, id) : undefined}
        onBlur={interactive ? () => handleBlur(id) : undefined}
        className={cn(
          'group/kanban-card relative flex shrink-0 select-none flex-col gap-2 rounded-md border border-border bg-card p-3 text-sm text-card-foreground shadow-xs outline-none transition-[box-shadow,border-color,transform] motion-reduce:transition-none',
          interactive && 'cursor-grab touch-none',
          interactive &&
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          state === 'grabbed' && 'z-10 border-ring shadow-lg',
          disabled && 'opacity-50',
          className,
          isDragging && 'hidden',
        )}
        {...props}
      />
    </KanbanCardContext.Provider>
  );
};

const KanbanCardHandle = ({ className, children, ...props }: React.ComponentProps<'button'>) => {
  const { startPress, handlePointerMove, handlePointerEnd, handleKeyDown, handleBlur } = useKanban();
  const { id, disabled, setHasHandle, state } = useKanbanCard();

  React.useLayoutEffect(() => {
    setHasHandle(true);
    return () => setHasHandle(false);
  }, [setHasHandle]);

  return (
    <button
      type="button"
      data-slot="kanban-card-handle"
      data-state={state}
      disabled={disabled}
      aria-label="Drag to move"
      aria-pressed={state === 'grabbed'}
      onPointerDown={(e) => startPress(e, id)}
      onPointerMove={(e) => handlePointerMove(e, id)}
      onPointerUp={(e) => handlePointerEnd(e, id, false)}
      onPointerCancel={(e) => handlePointerEnd(e, id, true)}
      onKeyDown={(e) => handleKeyDown(e, id)}
      onBlur={() => handleBlur(id)}
      className={cn(
        'inline-flex size-6 shrink-0 cursor-grab touch-none select-none items-center justify-center rounded text-muted-foreground outline-none transition-colors',
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

const KanbanEmpty = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { value, drag, dragId, dropTarget } = useKanban();
  const { id } = useKanbanColumn();
  const visible = (value[id] ?? []).filter((v) => v !== dragId);
  const hasPlaceholder = !!drag && dropTarget?.columnId === id;
  if (visible.length > 0 || hasPlaceholder) return null;
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
  useKanban,
  moveCard as moveKanbanCard,
};
