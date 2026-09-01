'use client';

import { type DataTableFeatures, dataTableFeatures } from './data-table-features';
import { getSortingStateParser } from './data-table-parsers';
import type { ExtendedColumnSort, FilterVariant } from './data-table-utils';
import type { ColumnDef, FilterFn, RowData } from '@tanstack/react-table';
import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useTable,
} from '@tanstack/react-table';
import {
  parseAsArrayOf,
  parseAsString,
  parseAsInteger,
  type SingleParser,
  type UseQueryStateOptions,
  useQueryState,
  useQueryStates,
} from 'nuqs';
import * as React from 'react';

const useCallbackRef = <T extends (...args: never[]) => unknown>(callback: T | undefined): T => {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });
  return React.useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
};

const useDebouncedCallback = <T extends (...args: never[]) => unknown>(callback: T, delay: number) => {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = React.useRef(0);
  React.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return React.useCallback(
    (...args: Parameters<T>) => {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(() => handleCallback(...args), delay);
    },
    [handleCallback, delay],
  );
};

const toTime = (value: unknown): number | null => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  }
  return null;
};

const startOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const endOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

const ARRAY_VARIANTS = new Set<FilterVariant>(['select', 'multiSelect', 'range', 'dateRange']);

const isArrayVariant = (variant: FilterVariant | undefined): boolean => {
  return variant ? ARRAY_VARIANTS.has(variant) : false;
};

// In-memory filter for a column, picked from its `meta.variant`. Used when the
// table runs client-side (no `pageCount`); manual mode ignores it.
const getFilterFn = <TData extends RowData>(variant: FilterVariant | undefined): FilterFn<DataTableFeatures, TData> => {
  return (row, columnId, filterValue) => {
    if (filterValue == null || filterValue === '') return true;
    const value = row.getValue(columnId);

    switch (variant) {
      case 'select':
      case 'multiSelect': {
        const selected = (Array.isArray(filterValue) ? filterValue : [filterValue]).map(String);
        if (selected.length === 0) return true;
        return selected.includes(String(value));
      }
      case 'range': {
        if (!Array.isArray(filterValue)) return true;
        const [min, max] = filterValue;
        const num = Number(value);
        if (Number.isNaN(num)) return false;
        if (min != null && min !== '' && num < Number(min)) return false;
        if (max != null && max !== '' && num > Number(max)) return false;
        return true;
      }
      case 'date':
      case 'dateRange': {
        const rowTime = toTime(value);
        if (rowTime == null) return false;
        if (Array.isArray(filterValue)) {
          const [from, to] = filterValue;
          if (from != null && from !== '' && rowTime < startOfDay(Number(from))) return false;
          if (to != null && to !== '' && rowTime > endOfDay(Number(to))) return false;
          return true;
        }
        const target = Number(filterValue);
        if (Number.isNaN(target)) return true;
        return startOfDay(rowTime) === startOfDay(target);
      }
      default: {
        const needle = String(Array.isArray(filterValue) ? (filterValue[0] ?? '') : filterValue).toLowerCase();
        if (!needle) return true;
        return String(value ?? '')
          .toLowerCase()
          .includes(needle);
      }
    }
  };
};

const getColumnId = <TData extends RowData>(column: ColumnDef<DataTableFeatures, TData>): string => {
  return column.id ?? ('accessorKey' in column ? String(column.accessorKey) : '');
};

const serializeFilterValue = (value: unknown): string => {
  if (value == null) return '';
  return Array.isArray(value) ? value.map(String).join(ARRAY_SEPARATOR) : String(value);
};

const areFiltersEqual = (a: ColumnFiltersState, b: ColumnFiltersState): boolean => {
  if (a.length !== b.length) return false;
  const values = new Map(a.map((f) => [f.id, serializeFilterValue(f.value)]));
  return b.every((f) => values.has(f.id) && values.get(f.id) === serializeFilterValue(f.value));
};

const PAGE_KEY = 'page';
const PER_PAGE_KEY = 'perPage';
const SORT_KEY = 'sort';
const ARRAY_SEPARATOR = ',';
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

interface UseDataTableProps<TData extends RowData> extends Omit<
  TableOptions<DataTableFeatures, TData>,
  'features' | 'state' | 'pageCount' | 'manualFiltering' | 'manualPagination' | 'manualSorting'
> {
  /**
   * Total page count from the server. Pass it to run the table in manual mode
   * (server does pagination / sorting / filtering, `data` is the current page).
   * Omit it to run in memory: pass the full `data` and the table paginates,
   * sorts and filters it from the URL state.
   */
  pageCount?: number;
  /** Override the server/client mode. Defaults to `pageCount != null`. */
  manual?: boolean;
  initialState?: Omit<Partial<TableState<DataTableFeatures>>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  /** Controlled row selection. Pair with `onRowSelectionChange`. */
  rowSelection?: RowSelectionState;
  /** Controlled column visibility. Pair with `onColumnVisibilityChange`. */
  columnVisibility?: ColumnVisibilityState;
  prefix?: string;
  history?: 'push' | 'replace';
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  startTransition?: React.TransitionStartFunction;
}

export const useDataTable = <TData extends RowData>(props: UseDataTableProps<TData>) => {
  const {
    columns,
    pageCount,
    manual = pageCount != null,
    initialState,
    rowSelection: rowSelectionProp,
    columnVisibility: columnVisibilityProp,
    onRowSelectionChange: onRowSelectionChangeProp,
    onColumnVisibilityChange: onColumnVisibilityChangeProp,
    prefix = '',
    history = 'replace',
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props;

  const pageKey = `${prefix}${PAGE_KEY}`;
  const perPageKey = `${prefix}${PER_PAGE_KEY}`;
  const sortKey = `${prefix}${SORT_KEY}`;

  const queryStateOptions = React.useMemo<Omit<UseQueryStateOptions<string>, 'parse'>>(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [history, scroll, shallow, throttleMs, debounceMs, clearOnDefault, startTransition],
  );

  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const rowSelection = rowSelectionProp ?? internalRowSelection;

  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<ColumnVisibilityState>(
    initialState?.columnVisibility ?? {},
  );
  const columnVisibility = columnVisibilityProp ?? internalColumnVisibility;

  const onRowSelectionChange = React.useCallback(
    (updaterOrValue: Updater<RowSelectionState>) => {
      if (rowSelectionProp === undefined) setInternalRowSelection(updaterOrValue);
      onRowSelectionChangeProp?.(updaterOrValue);
    },
    [rowSelectionProp, onRowSelectionChangeProp],
  );

  const onColumnVisibilityChange = React.useCallback(
    (updaterOrValue: Updater<ColumnVisibilityState>) => {
      if (columnVisibilityProp === undefined) setInternalColumnVisibility(updaterOrValue);
      onColumnVisibilityChangeProp?.(updaterOrValue);
    },
    [columnVisibilityProp, onColumnVisibilityChangeProp],
  );

  const [page, setPage] = useQueryState(pageKey, parseAsInteger.withOptions(queryStateOptions).withDefault(1));
  const [perPage, setPerPage] = useQueryState(
    perPageKey,
    parseAsInteger.withOptions(queryStateOptions).withDefault(initialState?.pagination?.pageSize ?? 10),
  );

  const pagination: PaginationState = React.useMemo(() => {
    return { pageIndex: page - 1, pageSize: perPage };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1);
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage],
  );

  const columnIds = React.useMemo(() => {
    return new Set(columns.map((column) => getColumnId(column)).filter(Boolean));
  }, [columns]);

  const [sorting, setSorting] = useQueryState(
    sortKey,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? []),
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
    },
    [sorting, setSorting],
  );

  const filterableColumns = React.useMemo(() => {
    return columns.filter((column) => column.enableColumnFilter);
  }, [columns]);

  // Wire each filterable column an in-memory filterFn from its variant so the
  // table can filter client-side; manual mode ignores these.
  const tableColumns = React.useMemo<ColumnDef<DataTableFeatures, TData>[]>(() => {
    return columns.map((column) => {
      if (column.filterFn || !column.enableColumnFilter) return column;
      return { ...column, filterFn: getFilterFn<TData>(column.meta?.variant) };
    });
  }, [columns]);

  const filterParsers = React.useMemo(() => {
    return filterableColumns.reduce<Record<string, SingleParser<string> | SingleParser<string[]>>>((acc, column) => {
      const id = getColumnId(column);
      if (!id) return acc;
      const key = `${prefix}${id}`;
      acc[key] = isArrayVariant(column.meta?.variant)
        ? parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withOptions(queryStateOptions)
        : parseAsString.withOptions(queryStateOptions);
      return acc;
    }, {});
  }, [filterableColumns, queryStateOptions, prefix]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers);

  const debouncedSetFilterValues = useDebouncedCallback((values: typeof filterValues) => {
    void setPage(1);
    void setFilterValues(values);
  }, debounceMs);

  const queryColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
      if (value !== null) {
        filters.push({
          id: prefix ? key.slice(prefix.length) : key,
          value,
        });
      }
      return filters;
    }, []);
  }, [filterValues, prefix]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(queryColumnFilters);

  const columnFiltersRef = React.useRef(columnFilters);
  React.useEffect(() => {
    columnFiltersRef.current = columnFilters;
  }, [columnFilters]);

  React.useEffect(() => {
    setColumnFilters((prev) => (areFiltersEqual(prev, queryColumnFilters) ? prev : queryColumnFilters));
  }, [queryColumnFilters]);

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      const prev = columnFiltersRef.current;
      const next = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;

      const filterUpdates = next.reduce<Record<string, string | string[] | null>>((acc, filter) => {
        if (filterableColumns.find((column) => getColumnId(column) === filter.id)) {
          acc[`${prefix}${filter.id}`] = filter.value as string | string[];
        }
        return acc;
      }, {});

      for (const prevFilter of prev) {
        if (!next.some((filter) => filter.id === prevFilter.id)) {
          filterUpdates[`${prefix}${prevFilter.id}`] = null;
        }
      }

      columnFiltersRef.current = next;
      setColumnFilters(next);
      debouncedSetFilterValues(filterUpdates);
    },
    [debouncedSetFilterValues, filterableColumns, prefix],
  );

  const table = useTable({
    ...tableProps,
    features: dataTableFeatures,
    columns: tableColumns,
    initialState,
    pageCount: manual ? (pageCount ?? -1) : undefined,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
    manualPagination: manual,
    manualSorting: manual,
    manualFiltering: manual,
  });

  return React.useMemo(() => ({ table, shallow, debounceMs, throttleMs }), [table, shallow, debounceMs, throttleMs]);
};
