'use no memo';
'use client';

import { Button } from '@/registry/hirael/bases/base/ui/button';
import { DataTableDateFilter } from './data-table-date-filter';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import type { DataTableFeatures } from './data-table-features';
import { DataTableSliderFilter } from './data-table-slider-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { cn } from '@/lib/utils';
import type { Column, ReactTable, RowData } from '@tanstack/react-table';
import { X } from 'lucide-react';
import * as React from 'react';

interface DataTableToolbarProps<TData extends RowData> extends React.ComponentProps<'div'> {
  table: ReactTable<DataTableFeatures, TData>;
}

export const DataTableToolbar = <TData extends RowData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) => {
  const isFiltered = table.state.columnFilters.length > 0;

  const columns = React.useMemo(() => table.getAllColumns().filter((column) => column.getCanFilter()), [table]);

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      data-slot="data-table-toolbar"
      className={cn('flex w-full items-start justify-between gap-2 p-1', className)}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button aria-label="Reset filters" variant="outline" size="sm" className="border-dashed" onClick={onReset}>
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} align="end" />
      </div>
    </div>
  );
};

interface DataTableToolbarFilterProps<TData extends RowData> {
  column: Column<DataTableFeatures, TData>;
}

const DataTableToolbarFilter = <TData extends RowData>({ column }: DataTableToolbarFilterProps<TData>) => {
  const columnMeta = column.columnDef.meta;

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null;

    switch (columnMeta.variant) {
      case 'text':
        return (
          <Input
            aria-label={columnMeta.label ?? column.id}
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8 w-40 lg:w-56"
          />
        );

      case 'number':
        return (
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              aria-label={columnMeta.label ?? column.id}
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ''}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className={cn('h-8 w-[120px]', columnMeta.unit && 'pe-8')}
            />
            {columnMeta.unit && (
              <span className="absolute top-0 end-0 bottom-0 flex items-center rounded-e-md bg-accent px-2 text-muted-foreground text-sm">
                {columnMeta.unit}
              </span>
            )}
          </div>
        );

      case 'range':
        return <DataTableSliderFilter column={column} title={columnMeta.label ?? column.id} />;

      case 'date':
      case 'dateRange':
        return (
          <DataTableDateFilter
            column={column}
            title={columnMeta.label ?? column.id}
            multiple={columnMeta.variant === 'dateRange'}
          />
        );

      case 'select':
      case 'multiSelect':
        return (
          <DataTableFacetedFilter
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.options ?? []}
            multiple={columnMeta.variant === 'multiSelect'}
          />
        );

      default:
        return null;
    }
  }, [column, columnMeta]);

  return onFilterRender();
};
