"use client";

import * as React from "react";
import { GripVertical, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";

export type KanbanCardData = {
  id: string;
  title: string;
  [key: string]: unknown;
};

export type KanbanColumnData = {
  id: string;
  title: string;
  cards: KanbanCardData[];
};

type DropTarget = {
  columnId: string;
  index: number;
};

type KanbanCtx = {
  columns: KanbanColumnData[];
  dragCardId: string | null;
  dropTarget: DropTarget | null;
  registerColumn: (id: string) => () => void;
  columnOrder: () => string[];
  startDrag: (cardId: string) => void;
  endDrag: () => void;
  setDropTarget: (target: DropTarget | null) => void;
  drop: (columnId: string, index: number) => void;
  moveCard: (cardId: string, dir: -1 | 1) => void;
};

const KanbanContext = React.createContext<KanbanCtx | null>(null);

function useKanban() {
  const ctx = React.useContext(KanbanContext);
  if (!ctx) {
    throw new Error("Kanban parts must be used inside <KanbanBoard>");
  }
  return ctx;
}

type ColumnCtx = {
  columnId: string;
};

const KanbanColumnContext = React.createContext<ColumnCtx | null>(null);

function useKanbanColumn() {
  const ctx = React.useContext(KanbanColumnContext);
  if (!ctx) {
    throw new Error("Column parts must be used inside <KanbanColumn>");
  }
  return ctx;
}

const CARD_MIME = "application/x-kanban-card";

function locate(columns: KanbanColumnData[], cardId: string) {
  for (let c = 0; c < columns.length; c += 1) {
    const index = columns[c].cards.findIndex((card) => card.id === cardId);
    if (index !== -1) return { columnIndex: c, cardIndex: index };
  }
  return null;
}

function moveCardTo(
  columns: KanbanColumnData[],
  cardId: string,
  toColumnId: string,
  toIndex: number,
): KanbanColumnData[] {
  const from = locate(columns, cardId);
  if (!from) return columns;

  const card = columns[from.columnIndex].cards[from.cardIndex];
  const toColumnIndex = columns.findIndex((col) => col.id === toColumnId);
  if (toColumnIndex === -1) return columns;

  let target = toIndex;
  if (from.columnIndex === toColumnIndex && from.cardIndex < target) {
    target -= 1;
  }

  const next = columns.map((col) => ({ ...col, cards: col.cards.slice() }));
  next[from.columnIndex].cards.splice(from.cardIndex, 1);

  const clamped = Math.max(0, Math.min(target, next[toColumnIndex].cards.length));
  if (
    from.columnIndex === toColumnIndex &&
    clamped === from.cardIndex &&
    target === from.cardIndex
  ) {
    return columns;
  }
  next[toColumnIndex].cards.splice(clamped, 0, card);
  return next;
}

export type KanbanBoardProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Controlled list of columns with their cards. */
  value?: KanbanColumnData[];
  /** Initial columns when uncontrolled. */
  defaultValue?: KanbanColumnData[];
  /** Called with the next columns after any move. */
  onValueChange?: (value: KanbanColumnData[]) => void;
};

function KanbanBoard({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  className,
  children,
  ...props
}: KanbanBoardProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const [dragCardId, setDragCardId] = React.useState<string | null>(null);
  const [dropTarget, setDropTargetState] = React.useState<DropTarget | null>(
    null,
  );
  const [liveText, setLiveText] = React.useState("");

  const columns = valueProp ?? internal;
  const columnsRef = React.useRef(columns);
  columnsRef.current = columns;

  const orderRef = React.useRef<string[]>([]);

  const registerColumn = React.useCallback((id: string) => {
    orderRef.current = [...orderRef.current, id];
    return () => {
      orderRef.current = orderRef.current.filter((v) => v !== id);
    };
  }, []);

  const columnOrder = React.useCallback(() => orderRef.current, []);

  const commit = React.useCallback(
    (next: KanbanColumnData[]) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const startDrag = React.useCallback((cardId: string) => {
    setDragCardId(cardId);
  }, []);

  const endDrag = React.useCallback(() => {
    setDragCardId(null);
    setDropTargetState(null);
  }, []);

  const setDropTarget = React.useCallback((target: DropTarget | null) => {
    setDropTargetState(target);
  }, []);

  const announce = React.useCallback(
    (cardId: string, columnId: string, next: KanbanColumnData[]) => {
      const where = locate(next, cardId);
      const column = next.find((col) => col.id === columnId);
      if (!where || !column) return;
      const card = column.cards[where.cardIndex];
      setLiveText(
        `Moved ${card?.title ?? cardId} to ${column.title}, position ${
          where.cardIndex + 1
        } of ${column.cards.length}.`,
      );
    },
    [],
  );

  const drop = React.useCallback(
    (columnId: string, index: number) => {
      const cardId = dragCardId;
      endDrag();
      if (!cardId) return;
      const next = moveCardTo(columnsRef.current, cardId, columnId, index);
      if (next === columnsRef.current) return;
      commit(next);
      announce(cardId, columnId, next);
    },
    [dragCardId, endDrag, commit, announce],
  );

  const moveCard = React.useCallback(
    (cardId: string, dir: -1 | 1) => {
      const current = columnsRef.current;
      const from = locate(current, cardId);
      if (!from) return;
      const order = orderRef.current;
      const fromOrderIndex = order.indexOf(current[from.columnIndex].id);
      const toOrderIndex = fromOrderIndex + dir;
      if (toOrderIndex < 0 || toOrderIndex >= order.length) return;
      const toColumnId = order[toOrderIndex];
      const toColumn = current.find((col) => col.id === toColumnId);
      if (!toColumn) return;
      const next = moveCardTo(current, cardId, toColumnId, toColumn.cards.length);
      if (next === current) return;
      commit(next);
      announce(cardId, toColumnId, next);
    },
    [commit, announce],
  );

  const ctx = React.useMemo<KanbanCtx>(
    () => ({
      columns,
      dragCardId,
      dropTarget,
      registerColumn,
      columnOrder,
      startDrag,
      endDrag,
      setDropTarget,
      drop,
      moveCard,
    }),
    [
      columns,
      dragCardId,
      dropTarget,
      registerColumn,
      columnOrder,
      startDrag,
      endDrag,
      setDropTarget,
      drop,
      moveCard,
    ],
  );

  return (
    <KanbanContext.Provider value={ctx}>
      <div
        role="list"
        data-slot="kanban-board"
        data-dragging={dragCardId ? "" : undefined}
        className={cn("flex w-full gap-4 overflow-x-auto pb-2", className)}
        {...props}
      >
        {children}
        <span data-slot="kanban-live" aria-live="polite" className="sr-only">
          {liveText}
        </span>
      </div>
    </KanbanContext.Provider>
  );
}

export type KanbanColumnProps = React.ComponentProps<"div"> & {
  /** Unique id matching a column in the root value. */
  value: string;
};

function KanbanColumn({
  value,
  className,
  children,
  ...props
}: KanbanColumnProps) {
  const { columns, dragCardId, dropTarget, registerColumn, setDropTarget, drop } =
    useKanban();

  React.useLayoutEffect(() => registerColumn(value), [value, registerColumn]);

  const column = columns.find((col) => col.id === value);
  const isActive = dragCardId !== null && dropTarget?.columnId === value;

  const handleDragOver = (e: React.DragEvent) => {
    if (!dragCardId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTarget?.columnId !== value) {
      setDropTarget({ columnId: value, index: column?.cards.length ?? 0 });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!dragCardId) return;
    e.preventDefault();
    const fallback = column?.cards.length ?? 0;
    drop(value, dropTarget?.columnId === value ? dropTarget.index : fallback);
  };

  return (
    <KanbanColumnContext.Provider value={{ columnId: value }}>
      <div
        role="listitem"
        data-slot="kanban-column"
        data-active={isActive ? "" : undefined}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "flex w-72 shrink-0 flex-col gap-3 rounded-lg border border-border bg-card/40 p-3 transition-colors",
          isActive && "border-ring bg-accent/40",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </KanbanColumnContext.Provider>
  );
}

function KanbanColumnHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { columns } = useKanban();
  const { columnId } = useKanbanColumn();
  const column = columns.find((col) => col.id === columnId);

  return (
    <div
      data-slot="kanban-column-header"
      className={cn("flex items-center gap-2 px-1", className)}
      {...props}
    >
      {children ?? (
        <>
          <h3
            data-slot="kanban-column-title"
            className="text-sm font-medium text-foreground"
          >
            {column?.title}
          </h3>
          <Badge
            data-slot="kanban-column-count"
            variant="secondary"
            className="ms-auto tabular-nums"
          >
            {column?.cards.length ?? 0}
          </Badge>
        </>
      )}
    </div>
  );
}

function KanbanCards({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { columns, dragCardId, dropTarget } = useKanban();
  const { columnId } = useKanbanColumn();
  const column = columns.find((col) => col.id === columnId);
  const showEndIndicator =
    dragCardId !== null &&
    dropTarget?.columnId === columnId &&
    dropTarget.index >= (column?.cards.length ?? 0);

  return (
    <div
      data-slot="kanban-cards"
      className={cn("flex min-h-16 flex-1 flex-col gap-2", className)}
      {...props}
    >
      {children}
      {showEndIndicator ? (
        <div
          data-slot="kanban-drop-indicator"
          aria-hidden
          className="h-0.5 rounded-full bg-ring"
        />
      ) : null}
    </div>
  );
}

export type KanbanCardProps = React.ComponentProps<"div"> & {
  /** Unique id matching a card in this column. */
  value: string;
  /** Position of this card within its column, used for the drop indicator. */
  index: number;
};

function KanbanCard({
  value,
  index,
  className,
  children,
  ...props
}: KanbanCardProps) {
  const {
    columns,
    dragCardId,
    dropTarget,
    startDrag,
    endDrag,
    setDropTarget,
    drop,
    moveCard,
    columnOrder,
  } = useKanban();
  const { columnId } = useKanbanColumn();

  const card = columns
    .find((col) => col.id === columnId)
    ?.cards.find((c) => c.id === value);
  const isDragging = dragCardId === value;
  const showIndicator =
    dragCardId !== null &&
    dragCardId !== value &&
    dropTarget?.columnId === columnId &&
    dropTarget.index === index;

  const order = columnOrder();
  const columnIndex = order.indexOf(columnId);
  const canMovePrev = columnIndex > 0;
  const canMoveNext = columnIndex !== -1 && columnIndex < order.length - 1;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(CARD_MIME, value);
    startDrag(value);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!dragCardId) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    const next = after ? index + 1 : index;
    if (dropTarget?.columnId !== columnId || dropTarget.index !== next) {
      setDropTarget({ columnId, index: next });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!dragCardId) return;
    e.preventDefault();
    e.stopPropagation();
    const target = dropTarget?.columnId === columnId ? dropTarget.index : index;
    drop(columnId, target);
  };

  return (
    <>
      {showIndicator ? (
        <div
          data-slot="kanban-drop-indicator"
          aria-hidden
          className="h-0.5 rounded-full bg-ring"
        />
      ) : null}
      <div
        role="group"
        aria-roledescription="draggable card"
        aria-label={card?.title}
        data-slot="kanban-card"
        data-dragging={isDragging ? "" : undefined}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={endDrag}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "group/kanban-card flex cursor-grab items-start gap-2 rounded-md border border-border bg-background p-3 text-sm shadow-xs transition-[box-shadow,opacity] outline-none",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          isDragging && "cursor-grabbing opacity-50",
          className,
        )}
        {...props}
      >
        <GripVertical
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        />
        <div className="min-w-0 flex-1">
          {children ?? (
            <span data-slot="kanban-card-title" className="block">
              {card?.title}
            </span>
          )}
        </div>
        <div
          data-slot="kanban-card-actions"
          className="-me-1 flex shrink-0 items-center gap-0.5"
        >
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={!canMovePrev}
            aria-label={`Move ${card?.title ?? "card"} to previous column`}
            onClick={() => moveCard(value, -1)}
          >
            Prev
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={!canMoveNext}
            aria-label={`Move ${card?.title ?? "card"} to next column`}
            onClick={() => moveCard(value, 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

function KanbanAddCard({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-slot="kanban-add-card"
      className={cn("justify-start text-muted-foreground", className)}
      {...props}
    >
      <Plus aria-hidden />
      {children ?? "Add card"}
    </Button>
  );
}

export {
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHeader,
  KanbanCards,
  KanbanCard,
  KanbanAddCard,
};
