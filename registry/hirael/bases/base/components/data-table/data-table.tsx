'use no memo';
'use client';

import { DataTablePagination } from './data-table-pagination';
import type { DataTableFeatures } from './data-table-features';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/hirael/bases/base/ui/table';
import { getColumnPinningStyle } from './data-table-utils';
import { cn } from '@/lib/utils';
import type { ReactTable, RowData } from '@tanstack/react-table';
import type * as React from 'react';

interface DataTableProps<TData extends RowData> extends React.ComponentProps<'div'> {
  table: ReactTable<DataTableFeatures, TData>;
  actionBar?: React.ReactNode;
}

export const DataTable = <TData extends RowData>({
  table,
  actionBar,
  children,
  className,
  ...props
}: DataTableProps<TData>) => {
  return (
    <div data-slot="data-table" className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)} {...props}>
      {children}
      <div data-slot="data-table-content" className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
};
