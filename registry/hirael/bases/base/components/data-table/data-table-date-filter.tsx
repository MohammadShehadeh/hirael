'use no memo';
'use client';

import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Calendar } from '@/registry/hirael/bases/base/ui/calendar';
import type { DataTableFeatures } from './data-table-features';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';
import { formatDate } from './data-table-utils';
import { cn } from '@/lib/utils';
import type { Column, RowData } from '@tanstack/react-table';
import { CalendarIcon, XCircle } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

type DateSelection = Date[] | DateRange;

const getIsDateRange = (value: DateSelection): value is DateRange => {
  return value && typeof value === 'object' && !Array.isArray(value);
};

const parseAsDate = (timestamp: number | string | undefined): Date | undefined => {
  if (!timestamp) return undefined;
  const numericTimestamp = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
};

const parseColumnFilterValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'number' || typeof item === 'string') {
        return item;
      }
      return undefined;
    });
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }

  return [];
};

interface DataTableDateFilterProps<TData extends RowData> {
  column: Column<DataTableFeatures, TData>;
  title?: string;
  multiple?: boolean;
}

export const DataTableDateFilter = <TData extends RowData>({
  column,
  title,
  multiple,
}: DataTableDateFilterProps<TData>) => {
  const columnFilterValue = column.getFilterValue();

  const selectedDates = React.useMemo<DateSelection>(() => {
    if (!columnFilterValue) {
      return multiple ? { from: undefined, to: undefined } : [];
    }

    if (multiple) {
      const timestamps = parseColumnFilterValue(columnFilterValue);
      return {
        from: parseAsDate(timestamps[0]),
        to: parseAsDate(timestamps[1]),
      };
    }

    const timestamps = parseColumnFilterValue(columnFilterValue);
    const date = parseAsDate(timestamps[0]);
    return date ? [date] : [];
  }, [columnFilterValue, multiple]);

  const onSelect = React.useCallback(
    (date: Date | DateRange | undefined) => {
      if (!date) {
        column.setFilterValue(undefined);
        return;
      }

      if (multiple && !('getTime' in date)) {
        const from = date.from?.getTime();
        const to = date.to?.getTime();
        column.setFilterValue(from || to ? [from, to] : undefined);
      } else if (!multiple && 'getTime' in date) {
        column.setFilterValue(date.getTime());
      }
    },
    [column, multiple],
  );

  const onReset = React.useCallback(() => {
    column.setFilterValue(undefined);
  }, [column]);

  const hasValue = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return false;
      return selectedDates.from || selectedDates.to;
    }
    if (!Array.isArray(selectedDates)) return false;
    return selectedDates.length > 0;
  }, [multiple, selectedDates]);

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return '';
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    return formatDate(range.from ?? range.to);
  }, []);

  const label = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return null;

      const hasSelectedDates = selectedDates.from || selectedDates.to;
      const dateText = hasSelectedDates ? formatDateRange(selectedDates) : 'Select date range';

      return (
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {hasSelectedDates && (
            <>
              <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4" />
              <span>{dateText}</span>
            </>
          )}
        </span>
      );
    }

    if (getIsDateRange(selectedDates)) return null;

    const hasSelectedDate = selectedDates.length > 0;
    const dateText = hasSelectedDate ? formatDate(selectedDates[0]) : 'Select date';

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {hasSelectedDate && (
          <>
            <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4" />
            <span>{dateText}</span>
          </>
        )}
      </span>
    );
  }, [selectedDates, multiple, formatDateRange, title]);

  return (
    <Popover>
      <div className="flex items-center">
        {hasValue ? (
          <Button
            variant="outline"
            size="sm"
            aria-label={`Clear ${title} filter`}
            data-slot="data-table-date-filter-reset"
            className="rounded-e-none border-e-0 border-dashed px-2"
            onClick={onReset}
          >
            <XCircle />
          </Button>
        ) : null}
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              data-slot="data-table-date-filter"
              className={cn('border-dashed font-normal', hasValue && 'rounded-s-none')}
            />
          }
        >
          {hasValue ? null : <CalendarIcon />}
          {label}
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        {multiple ? (
          <Calendar
            autoFocus
            captionLayout="dropdown"
            mode="range"
            selected={getIsDateRange(selectedDates) ? selectedDates : { from: undefined, to: undefined }}
            onSelect={onSelect}
          />
        ) : (
          <Calendar
            captionLayout="dropdown"
            mode="single"
            selected={!getIsDateRange(selectedDates) ? selectedDates[0] : undefined}
            onSelect={onSelect}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};
