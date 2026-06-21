"use no memo";
"use client";

import { DataTable } from "@/registry/hirael/ui/data-table";
import { DataTableToolbar } from "@/registry/hirael/ui/data-table-toolbar";
import type {
  ExtendedColumnSort,
  FilterVariant,
} from "@/registry/hirael/ui/data-table-utils";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

function toTime(value: unknown): number | null {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? null : time;
  }
  return null;
}

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function endOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

function getFilterFn<TData>(
  variant: FilterVariant | undefined,
): FilterFn<TData> {
  return (row, columnId, filterValue) => {
    if (filterValue == null || filterValue === "") return true;

    const value = row.getValue(columnId);

    switch (variant) {
      case "select":
      case "multiSelect": {
        const selected = (
          Array.isArray(filterValue) ? filterValue : [filterValue]
        ).map(String);
        if (selected.length === 0) return true;
        return selected.includes(String(value));
      }

      case "range": {
        if (!Array.isArray(filterValue)) return true;
        const [min, max] = filterValue;
        const num = Number(value);
        if (Number.isNaN(num)) return false;
        if (min != null && min !== "" && num < Number(min)) return false;
        if (max != null && max !== "" && num > Number(max)) return false;
        return true;
      }

      case "date":
      case "dateRange": {
        const rowTime = toTime(value);
        if (rowTime == null) return false;

        if (Array.isArray(filterValue)) {
          const [from, to] = filterValue;
          if (from != null && from !== "" && rowTime < startOfDay(Number(from)))
            return false;
          if (to != null && to !== "" && rowTime > endOfDay(Number(to)))
            return false;
          return true;
        }

        const target = Number(filterValue);
        if (Number.isNaN(target)) return true;
        return startOfDay(rowTime) === startOfDay(target);
      }

      default: {
        const needle = String(
          Array.isArray(filterValue) ? (filterValue[0] ?? "") : filterValue,
        ).toLowerCase();
        if (!needle) return true;
        return String(value ?? "")
          .toLowerCase()
          .includes(needle);
      }
    }
  };
}

interface UseDataTableClientProps<TData> extends Omit<
  TableOptions<TData>,
  | "state"
  | "pageCount"
  | "getCoreRowModel"
  | "manualFiltering"
  | "manualPagination"
  | "manualSorting"
> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
}

export function useDataTableClient<TData>(
  props: UseDataTableClientProps<TData>,
) {
  const { columns, initialState, ...tableProps } = props;

  const filterableColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    return columns.map((column) => {
      if (column.filterFn || !column.enableColumnFilter) return column;
      return { ...column, filterFn: getFilterFn<TData>(column.meta?.variant) };
    });
  }, [columns]);

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? [],
  );
  const [pagination, setPagination] = React.useState<PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  );

  const table = useReactTable({
    ...tableProps,
    columns: filterableColumns,
    initialState,
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
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return { table };
}

interface DataTableClientProps<TData>
  extends
    UseDataTableClientProps<TData>,
    Omit<React.ComponentProps<"div">, "children"> {
  actionBar?: React.ReactNode;
  withToolbar?: boolean;
  pageSizeOptions?: number[];
}

export function DataTableClient<TData>({
  columns,
  data,
  initialState,
  actionBar,
  withToolbar = true,
  className,
  getRowId,
  ...props
}: DataTableClientProps<TData>) {
  const { table } = useDataTableClient({
    columns,
    data,
    initialState,
    getRowId,
  });

  return (
    <DataTable
      table={table}
      actionBar={actionBar}
      className={className}
      {...props}
    >
      {withToolbar ? <DataTableToolbar table={table} /> : null}
    </DataTable>
  );
}
