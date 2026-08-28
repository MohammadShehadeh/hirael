'use no memo';
'use client';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import type { DataTableFeatures } from './data-table-features';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/radix/ui/select';
import { cn } from '@/lib/utils';
import type { ReactTable, RowData } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTablePaginationProps<TData extends RowData> extends React.ComponentProps<'div'> {
  table: ReactTable<DataTableFeatures, TData>;
  pageSizeOptions?: number[];
}

export const DataTablePagination = <TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: DataTablePaginationProps<TData>) => {
  const pageSize = table.state.pagination.pageSize;
  const sizes = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        'flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8',
        className,
      )}
      {...props}
    >
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap font-medium text-sm">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-18 data-size:h-8">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {sizes.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center font-medium text-sm">
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="rtl:rotate-180" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="rtl:rotate-180" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="rtl:rotate-180" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};
