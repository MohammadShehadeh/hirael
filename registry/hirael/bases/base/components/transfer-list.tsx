'use client';

import * as React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
  Search,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Checkbox } from '@/registry/hirael/bases/base/ui/checkbox';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export interface TransferListItem {
  value: string;
  label: string;
  /** Second line under the label. */
  description?: string;
  /** Shown but can't be checked or moved. */
  disabled?: boolean;
}

export type TransferListSide = 'source' | 'target';

interface TransferListContextValue {
  items: TransferListItem[];
  /** Values on the target side, in the order they were added. */
  value: string[];
  checked: Record<TransferListSide, Set<string>>;
  toggle: (side: TransferListSide, value: string) => void;
  setChecked: (side: TransferListSide, values: string[]) => void;
  move: (from: TransferListSide, mode: 'checked' | 'all') => void;
  sideItems: (side: TransferListSide) => TransferListItem[];
  disabled?: boolean;
}

const TransferListContext = React.createContext<TransferListContextValue | null>(null);

const useTransferList = () => {
  const ctx = React.useContext(TransferListContext);
  if (!ctx) {
    throw new Error('TransferList compound parts must be used inside <TransferList>');
  }

  return ctx;
};

export interface TransferListProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  /** Every item, on either side. */
  items: TransferListItem[];
  /** Values moved to the target side. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
}

const EMPTY: string[] = [];

const TransferList = ({
  items,
  value: valueProp,
  defaultValue = EMPTY,
  onValueChange,
  disabled,
  className,
  ...props
}: TransferListProps) => {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [checked, setCheckedState] = React.useState<Record<TransferListSide, Set<string>>>(() => ({
    source: new Set(),
    target: new Set(),
  }));

  const sideItems = React.useCallback(
    (side: TransferListSide) => {
      const onTarget = new Set(value);
      if (side === 'source') return items.filter((item) => !onTarget.has(item.value));
      const byValue = new Map(items.map((item) => [item.value, item]));

      return value.flatMap((v) => byValue.get(v) ?? []);
    },
    [items, value],
  );

  const toggle = React.useCallback((side: TransferListSide, v: string) => {
    setCheckedState((prev) => {
      const next = new Set(prev[side]);
      if (next.has(v)) next.delete(v);
      else next.add(v);

      return { ...prev, [side]: next };
    });
  }, []);

  const setChecked = React.useCallback((side: TransferListSide, values: string[]) => {
    setCheckedState((prev) => ({ ...prev, [side]: new Set(values) }));
  }, []);

  const move = React.useCallback(
    (from: TransferListSide, mode: 'checked' | 'all') => {
      const movable = sideItems(from)
        .filter((item) => !item.disabled && (mode === 'all' || checked[from].has(item.value)))
        .map((item) => item.value);
      if (movable.length === 0) return;
      const moving = new Set(movable);
      setValue(from === 'source' ? [...value, ...movable] : value.filter((v) => !moving.has(v)));
      setCheckedState((prev) => ({ ...prev, [from]: new Set() }));
    },
    [sideItems, checked, setValue, value],
  );

  const ctx = React.useMemo<TransferListContextValue>(
    () => ({ items, value, checked, toggle, setChecked, move, sideItems, disabled }),
    [items, value, checked, toggle, setChecked, move, sideItems, disabled],
  );

  return (
    <TransferListContext.Provider value={ctx}>
      <div data-slot="transfer-list-container" className="@container/transfer-list w-full">
        <div
          data-slot="transfer-list"
          data-disabled={disabled || undefined}
          className={cn(
            'grid items-stretch gap-3 @xl/transfer-list:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
            className,
          )}
          {...props}
        />
      </div>
    </TransferListContext.Provider>
  );
};

export interface TransferListPanelProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  side: TransferListSide;
  /** Heading above the list. */
  title: React.ReactNode;
  /** Placeholder for the filter field. Leave out to hide the field. */
  searchPlaceholder?: string;
  /** Shown when the side has nothing, or nothing matches the filter. */
  emptyMessage?: React.ReactNode;
  /** Accessible name for the check-all box. */
  selectAllLabel?: string;
}

const TransferListPanel = ({
  side,
  title,
  searchPlaceholder,
  emptyMessage = 'No items',
  selectAllLabel = 'Select all',
  className,
  ...props
}: TransferListPanelProps) => {
  const { sideItems, checked, toggle, setChecked, disabled } = useTransferList();
  const [query, setQuery] = React.useState('');
  const titleId = React.useId();
  const all = sideItems(side);
  const needle = query.trim().toLocaleLowerCase();
  const visible = needle
    ? all.filter((item) => `${item.label} ${item.description ?? ''}`.toLocaleLowerCase().includes(needle))
    : all;
  const selectable = visible.filter((item) => !item.disabled);
  const checkedCount = selectable.filter((item) => checked[side].has(item.value)).length;
  const allChecked = selectable.length > 0 && checkedCount === selectable.length;

  return (
    <div
      data-slot="transfer-list-panel"
      data-side={side}
      className={cn('flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card', className)}
      {...props}
    >
      <div
        data-slot="transfer-list-panel-header"
        className="flex items-center gap-3 border-b border-border px-3 py-2.5"
      >
        <Checkbox
          aria-label={selectAllLabel}
          checked={allChecked}
          indeterminate={!allChecked && checkedCount > 0}
          disabled={disabled || selectable.length === 0}
          onCheckedChange={() => setChecked(side, allChecked ? [] : selectable.map((item) => item.value))}
        />
        <span id={titleId} className="flex-1 truncate text-sm font-medium">
          {title}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {checkedCount > 0 ? `${checkedCount}/${all.length}` : all.length}
        </span>
      </div>
      {searchPlaceholder && (
        <div className="border-b border-border p-2">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              disabled={disabled}
            />
          </InputGroup>
        </div>
      )}
      <ul
        aria-labelledby={titleId}
        data-slot="transfer-list-items"
        className="h-64 overflow-y-auto overscroll-contain p-1"
      >
        {visible.length === 0 ? (
          <li className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </li>
        ) : (
          visible.map((item) => {
            const id = `${titleId}-${item.value}`;

            return (
              <li key={item.value} data-slot="transfer-list-item">
                <label
                  htmlFor={id}
                  data-disabled={item.disabled || disabled || undefined}
                  className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-accent data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-transparent"
                >
                  <Checkbox
                    id={id}
                    className="mt-0.5"
                    checked={checked[side].has(item.value)}
                    disabled={item.disabled || disabled}
                    onCheckedChange={() => toggle(side, item.value)}
                  />
                  <span className="grid min-w-0 gap-0.5">
                    <span className="truncate text-sm">{item.label}</span>
                    {item.description && (
                      <span className="truncate text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </span>
                </label>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export interface TransferListActionsProps extends React.ComponentProps<'div'> {
  /** Accessible names for the four move buttons. */
  labels?: Partial<Record<'moveChecked' | 'moveAll' | 'returnChecked' | 'returnAll', string>>;
}

const DEFAULT_ACTION_LABELS = {
  moveChecked: 'Move checked to the right list',
  moveAll: 'Move all to the right list',
  returnChecked: 'Move checked back',
  returnAll: 'Move all back',
};

const TransferListActions = ({ labels, className, ...props }: TransferListActionsProps) => {
  const { move, checked, sideItems, disabled } = useTransferList();
  const text = { ...DEFAULT_ACTION_LABELS, ...labels };
  const movable = (side: TransferListSide) => sideItems(side).some((item) => !item.disabled);
  // Side by side the arrows follow the reading direction; stacked, they point down and up.
  const actions = [
    {
      key: 'moveAll',
      row: ChevronsRight,
      column: ChevronsDown,
      enabled: movable('source'),
      run: () => move('source', 'all'),
    },
    {
      key: 'moveChecked',
      row: ChevronRight,
      column: ChevronDown,
      enabled: checked.source.size > 0,
      run: () => move('source', 'checked'),
    },
    {
      key: 'returnChecked',
      row: ChevronLeft,
      column: ChevronUp,
      enabled: checked.target.size > 0,
      run: () => move('target', 'checked'),
    },
    {
      key: 'returnAll',
      row: ChevronsLeft,
      column: ChevronsUp,
      enabled: movable('target'),
      run: () => move('target', 'all'),
    },
  ] as const;

  return (
    <div
      data-slot="transfer-list-actions"
      className={cn('flex items-center justify-center gap-2 @xl/transfer-list:flex-col', className)}
      {...props}
    >
      {actions.map(({ key, row: RowIcon, column: ColumnIcon, enabled, run }) => (
        <Button
          key={key}
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={text[key]}
          title={text[key]}
          disabled={disabled || !enabled}
          onClick={run}
        >
          <RowIcon aria-hidden className="hidden @xl/transfer-list:block rtl:rotate-180" />
          <ColumnIcon aria-hidden className="@xl/transfer-list:hidden" />
        </Button>
      ))}
    </div>
  );
};

export { TransferList, TransferListPanel, TransferListActions, useTransferList };
