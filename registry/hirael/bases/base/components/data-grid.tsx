'use no memo';
'use client';

import * as React from 'react';
import {
  columnResizingFeature,
  columnSizingFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/registry/hirael/bases/base/ui/checkbox';

const gridFeatures = tableFeatures({
  rowSortingFeature,
  columnSizingFeature,
  columnResizingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

export type DataGridCellType = 'text' | 'number' | 'select' | 'checkbox';

export interface DataGridColumn<Row> {
  /** Key of the row field this column shows and edits. */
  id: Extract<keyof Row, string>;
  header: string;
  type?: DataGridCellType;
  /** Choices for a `select` column. */
  options?: { value: string; label: string }[];
  /** Starting width in pixels. Columns can be resized by dragging the header edge. */
  width?: number;
  /** Set to false to make the column read-only. */
  editable?: boolean;
  /** How the value reads when not being edited. */
  format?: (value: Row[Extract<keyof Row, string>], row: Row) => React.ReactNode;
}

export interface DataGridChange<Row> {
  /** Index of the row in `data`, not its position after sorting. */
  rowIndex: number;
  columnId: Extract<keyof Row, string>;
  value: unknown;
}

export interface DataGridProps<Row extends Record<string, unknown>> extends Omit<
  React.ComponentProps<'div'>,
  'onChange'
> {
  columns: DataGridColumn<Row>[];
  data: Row[];
  /** Called with the next data after a cell edit, paste or clear. */
  onDataChange?: (data: Row[], change: DataGridChange<Row>) => void;
  /** Pixel height of a row. */
  rowHeight?: number;
  /** Pixel height of the scrolling area. */
  height?: number;
  /** Accessible name of the grid. */
  label?: string;
  /** Show 1, 2, 3… in a narrow first column. */
  rowNumbers?: boolean;
}

interface Position {
  row: number;
  col: number;
}

const parseValue = (type: DataGridCellType, text: string) => {
  if (type === 'number') {
    const n = Number(text.replace(/[^\d.-]/g, ''));

    return text.trim() === '' || Number.isNaN(n) ? null : n;
  }
  if (type === 'checkbox') return ['true', '1', 'yes', 'x'].includes(text.trim().toLowerCase());

  return text;
};

const DataGrid = <Row extends Record<string, unknown>>({
  columns,
  data,
  onDataChange,
  rowHeight = 36,
  height = 400,
  label,
  rowNumbers = true,
  className,
  ...props
}: DataGridProps<Row>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const gridId = React.useId();
  const [active, setActive] = React.useState<Position>({ row: 0, col: 0 });
  const [editing, setEditing] = React.useState<{ draft: string } | null>(null);
  // Enter and Tab close the editor, and the input then blurs on unmount; this keeps that from saving twice.
  const editingRef = React.useRef(false);
  const [rtl, setRtl] = React.useState(false);

  React.useLayoutEffect(() => {
    if (scrollRef.current) setRtl(getComputedStyle(scrollRef.current).direction === 'rtl');
  }, []);

  const tableColumns = React.useMemo(
    () =>
      columns.map((column) => ({
        accessorKey: column.id,
        header: column.header,
        size: column.width ?? 160,
        minSize: 64,
      })) as ColumnDef<typeof gridFeatures, Row>[],
    [columns],
  );

  const table = useTable({
    features: gridFeatures,
    columns: tableColumns,
    data,
    columnResizeMode: 'onChange',
    columnResizeDirection: rtl ? 'rtl' : 'ltr',
  });

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  const rowNumberWidth = rowNumbers ? 48 : 0;
  const totalWidth = table.getTotalSize() + rowNumberWidth;

  // The file opts out of the React Compiler above, which is what this rule asks for.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });

  const cellId = (pos: Position) => `${gridId}-${pos.row}-${pos.col}`;
  const columnAt = (col: number) => columns[col];
  const valueAt = (pos: Position) => rows[pos.row]?.original[columnAt(pos.col)?.id];

  const commit = (pos: Position, value: unknown) => {
    const row = rows[pos.row];
    const column = columnAt(pos.col);
    if (!row || !column || column.editable === false || !onDataChange) return;
    if (Object.is(row.original[column.id], value)) return;
    const next = data.map((r, i) => (i === row.index ? { ...r, [column.id]: value } : r));
    onDataChange(next, { rowIndex: row.index, columnId: column.id, value });
  };

  const moveTo = (pos: Position) => {
    const next = {
      row: Math.min(Math.max(pos.row, 0), rows.length - 1),
      col: Math.min(Math.max(pos.col, 0), columns.length - 1),
    };
    setActive(next);
    virtualizer.scrollToIndex(next.row, { align: 'auto' });
    requestAnimationFrame(() =>
      document.getElementById(cellId(next))?.scrollIntoView({ block: 'nearest', inline: 'nearest' }),
    );
  };

  const startEditing = (pos: Position, initial?: string) => {
    const column = columnAt(pos.col);
    if (!column || column.editable === false || !onDataChange) return;
    if (column.type === 'checkbox') {
      commit(pos, !valueAt(pos));

      return;
    }
    const value = valueAt(pos);
    editingRef.current = true;
    setEditing({ draft: initial ?? (value === null || value === undefined ? '' : String(value)) });
  };

  const finishEditing = (save: boolean, then?: Position) => {
    if (!editingRef.current) return;
    editingRef.current = false;
    if (editing && save) commit(active, parseValue(columnAt(active.col)?.type ?? 'text', editing.draft));
    setEditing(null);
    if (then) moveTo(then);
    scrollRef.current?.focus();
  };

  const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (editing) return;
    const { row, col } = active;
    const page = Math.max(1, Math.floor(height / rowHeight) - 1);
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    const mod = event.metaKey || event.ctrlKey;
    const moves: Record<string, Position> = {
      ArrowDown: { row: row + 1, col },
      ArrowUp: { row: row - 1, col },
      [forward]: { row, col: col + 1 },
      [backward]: { row, col: col - 1 },
      PageDown: { row: row + page, col },
      PageUp: { row: row - page, col },
      Home: mod ? { row: 0, col: 0 } : { row, col: 0 },
      End: mod ? { row: rows.length - 1, col: columns.length - 1 } : { row, col: columns.length - 1 },
      Tab: { row, col: col + (event.shiftKey ? -1 : 1) },
    };
    const move = moves[event.key];
    if (move) {
      // Tab leaves the grid at its edges instead of trapping focus.
      if (event.key === 'Tab' && (move.col < 0 || move.col >= columns.length)) return;
      event.preventDefault();
      moveTo(move);

      return;
    }
    if (event.key === 'Enter' || event.key === 'F2' || (event.key === ' ' && columnAt(col)?.type === 'checkbox')) {
      event.preventDefault();
      startEditing(active);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      const type = columnAt(col)?.type ?? 'text';
      if (type !== 'select') commit(active, type === 'number' ? null : type === 'checkbox' ? false : '');
    } else if (mod && event.key.toLowerCase() === 'c') {
      const value = valueAt(active);
      void navigator.clipboard?.writeText(value === null || value === undefined ? '' : String(value));
    } else if (event.key.length === 1 && !mod && !event.altKey) {
      const type = columnAt(col)?.type ?? 'text';
      if (type === 'text' || type === 'number') {
        event.preventDefault();
        startEditing(active, event.key);
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (editing) return;
    const text = event.clipboardData.getData('text/plain');
    if (!text) return;
    event.preventDefault();
    // Pasting a block from a spreadsheet fills cells from the active one, right and down.
    const block = text
      .replace(/\r?\n$/, '')
      .split(/\r?\n/)
      .map((line) => line.split('\t'));
    let next = data;
    block.forEach((cells, r) =>
      cells.forEach((cellText, c) => {
        const pos = { row: active.row + r, col: active.col + c };
        const row = rows[pos.row];
        const column = columnAt(pos.col);
        if (!row || !column || column.editable === false) return;
        const value =
          column.type === 'select'
            ? (column.options?.find((o) => o.label === cellText || o.value === cellText)?.value ?? null)
            : parseValue(column.type ?? 'text', cellText);
        if (value === null && column.type === 'select') return;
        next = next.map((item, i) => (i === row.index ? { ...item, [column.id]: value } : item));
      }),
    );
    if (next !== data && onDataChange) {
      onDataChange(next, { rowIndex: rows[active.row]?.index ?? 0, columnId: columnAt(active.col).id, value: text });
    }
  };

  const renderValue = (row: Row, column: DataGridColumn<Row>) => {
    const value = row[column.id];
    if (column.format) return column.format(value, row);
    if (column.type === 'select') return column.options?.find((o) => o.value === value)?.label ?? '';
    if (column.type === 'number' && typeof value === 'number') return value.toLocaleString('en-US');

    return value === null || value === undefined ? '' : String(value);
  };

  return (
    <div
      data-slot="data-grid"
      className={cn('overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    >
      <div
        ref={scrollRef}
        role="grid"
        aria-label={label}
        aria-rowcount={rows.length + 1}
        aria-colcount={columns.length}
        aria-activedescendant={rows.length ? cellId(active) : undefined}
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
        onPaste={handlePaste}
        data-slot="data-grid-viewport"
        className="relative overflow-auto overscroll-contain outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
        style={{ height }}
      >
        <div style={{ width: totalWidth, minWidth: '100%' }}>
          <div
            role="row"
            aria-rowindex={1}
            data-slot="data-grid-header"
            className="sticky top-0 z-20 flex border-b border-border bg-muted text-xs font-medium text-muted-foreground"
            style={{ height: rowHeight }}
          >
            {rowNumbers && (
              <div
                aria-hidden
                className="sticky start-0 z-10 shrink-0 border-e border-border bg-muted"
                style={{ width: rowNumberWidth }}
              />
            )}
            {headers.map((header, index) => {
              const sorted = header.column.getIsSorted();
              const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ChevronsUpDown;

              return (
                <div
                  key={header.id}
                  role="columnheader"
                  aria-colindex={index + 1}
                  aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
                  className="relative flex shrink-0 items-center border-e border-border"
                  style={{ width: header.getSize() }}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      'flex size-full min-w-0 items-center gap-1 px-3 text-start hover:text-foreground',
                      columns[index]?.type === 'number' && 'flex-row-reverse text-end',
                    )}
                  >
                    <span className="truncate">{columns[index]?.header}</span>
                    <Icon aria-hidden className={cn('size-3.5 shrink-0', !sorted && 'opacity-40')} />
                  </button>
                  <span
                    aria-hidden
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    onDoubleClick={() => header.column.resetSize()}
                    data-resizing={header.column.getIsResizing() || undefined}
                    className="absolute inset-y-0 -end-1 z-10 w-2 cursor-col-resize touch-none select-none after:absolute after:inset-y-1 after:start-1/2 after:w-px hover:after:bg-ring data-resizing:after:bg-ring"
                  />
                </div>
              );
            })}
          </div>

          <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map((item) => {
              const row = rows[item.index];

              return (
                <div
                  key={row.id}
                  role="row"
                  aria-rowindex={item.index + 2}
                  data-slot="data-grid-row"
                  className="absolute inset-x-0 flex border-b border-border text-sm hover:bg-muted/40"
                  style={{ height: rowHeight, transform: `translateY(${item.start}px)` }}
                >
                  {rowNumbers && (
                    <div
                      aria-hidden
                      className="sticky start-0 z-10 flex shrink-0 items-center justify-end border-e border-border bg-card px-2 text-xs text-muted-foreground tabular-nums"
                      style={{ width: rowNumberWidth }}
                    >
                      {item.index + 1}
                    </div>
                  )}
                  {columns.map((column, colIndex) => {
                    const pos = { row: item.index, col: colIndex };
                    const isActive = active.row === item.index && active.col === colIndex;
                    const isEditing = isActive && editing !== null;
                    const width = headers[colIndex]?.getSize() ?? column.width ?? 160;
                    const readOnly = column.editable === false || !onDataChange;

                    return (
                      <div
                        key={column.id}
                        id={cellId(pos)}
                        role="gridcell"
                        aria-colindex={colIndex + 1}
                        aria-selected={isActive}
                        aria-readonly={readOnly || undefined}
                        data-active={isActive || undefined}
                        data-slot="data-grid-cell"
                        onMouseDown={() => {
                          if (!isEditing) moveTo(pos);
                        }}
                        onDoubleClick={() => startEditing(pos)}
                        className={cn(
                          'relative flex shrink-0 items-center border-e border-border px-3',
                          column.type === 'number' && 'justify-end tabular-nums',
                          readOnly && 'text-muted-foreground',
                          'data-active:z-[1] data-active:outline-2 data-active:-outline-offset-2 data-active:outline-primary',
                        )}
                        style={{ width }}
                      >
                        {isEditing && column.type === 'select' ? (
                          <select
                            autoFocus
                            aria-label={column.header}
                            value={editing.draft}
                            onChange={(event) => {
                              commit(pos, event.target.value);
                              editingRef.current = false;
                              setEditing(null);
                              scrollRef.current?.focus();
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Escape') finishEditing(false);
                            }}
                            onBlur={() => {
                              editingRef.current = false;
                              setEditing(null);
                            }}
                            className="absolute inset-0 bg-background px-2 text-sm outline-none"
                          >
                            {column.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : isEditing ? (
                          <input
                            autoFocus
                            aria-label={column.header}
                            value={editing.draft}
                            inputMode={column.type === 'number' ? 'decimal' : undefined}
                            onChange={(event) => setEditing({ draft: event.target.value })}
                            onFocus={(event) => {
                              const end = event.target.value.length;
                              event.target.setSelectionRange(end, end);
                            }}
                            onBlur={() => finishEditing(true)}
                            onKeyDown={(event) => {
                              if (event.key === 'Escape') {
                                event.preventDefault();
                                finishEditing(false);
                              } else if (event.key === 'Enter') {
                                event.preventDefault();
                                finishEditing(true, { row: pos.row + (event.shiftKey ? -1 : 1), col: pos.col });
                              } else if (event.key === 'Tab') {
                                event.preventDefault();
                                finishEditing(true, { row: pos.row, col: pos.col + (event.shiftKey ? -1 : 1) });
                              }
                            }}
                            className={cn(
                              'absolute inset-0 bg-background px-3 text-sm outline-none',
                              column.type === 'number' && 'text-end tabular-nums',
                            )}
                          />
                        ) : column.type === 'checkbox' ? (
                          <Checkbox
                            tabIndex={-1}
                            aria-label={column.header}
                            checked={Boolean(row.original[column.id])}
                            disabled={readOnly}
                            onCheckedChange={() => commit(pos, !row.original[column.id])}
                          />
                        ) : (
                          <span className="truncate">{renderValue(row.original, column)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DataGrid };
