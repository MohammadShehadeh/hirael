'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Calendar } from '@/registry/hirael/bases/radix/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';

export type { DateRange };

interface DateRangePickerContextValue {
  value: DateRange | undefined;
  setValue: (value: DateRange | undefined) => void;
  setOpen: (open: boolean) => void;
  locale: string;
  disabled?: boolean;
}

const DateRangePickerContext = React.createContext<DateRangePickerContextValue | null>(null);

const useDateRangePicker = () => {
  const ctx = React.useContext(DateRangePickerContext);
  if (!ctx) {
    throw new Error('DateRangePicker compound parts must be used inside <DateRangePicker>');
  }

  return ctx;
};

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** BCP 47 tag for the trigger label. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const DateRangePicker = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  locale = 'en-US',
  disabled,
  children,
}: DateRangePickerProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp ?? internalValue;
  const setValue = React.useCallback(
    (next: DateRange | undefined) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const ctx = React.useMemo<DateRangePickerContextValue>(
    () => ({ value, setValue, setOpen, locale, disabled }),
    [value, setValue, setOpen, locale, disabled],
  );

  return (
    <DateRangePickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </DateRangePickerContext.Provider>
  );
};

interface DateRangePickerTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  children?: React.ReactNode;
}

const DateRangePickerTrigger = ({
  placeholder = 'Pick a date range',
  className,
  children,
  ...props
}: DateRangePickerTriggerProps) => {
  const ctx = useDateRangePicker();
  const fmt = React.useMemo(() => new Intl.DateTimeFormat(ctx.locale, { dateStyle: 'medium' }), [ctx.locale]);

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={ctx.disabled}
        data-slot="date-range-picker-trigger"
        className={cn(
          'inline-flex h-9 w-full items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm tabular-nums transition-colors outline-none',
          'hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring',
          !ctx.value?.from && 'text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span data-slot="date-range-picker-trigger-label" className="flex-1 truncate">
          {children ??
            (ctx.value?.from
              ? `${fmt.format(ctx.value.from)} – ${ctx.value.to ? fmt.format(ctx.value.to) : '…'}`
              : placeholder)}
        </span>
      </button>
    </PopoverTrigger>
  );
};

export interface DateRangePreset {
  label: string;
  range: () => DateRange;
}

const lastDays = (days: number) => () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const from = new Date(today);
  from.setDate(today.getDate() + 1 - days);

  return { from, to: today };
};

const calendarMonth = (offset: number) => () => {
  const today = new Date();

  return {
    from: new Date(today.getFullYear(), today.getMonth() + offset, 1),
    to: new Date(today.getFullYear(), today.getMonth() + offset + 1, 0),
  };
};

const DEFAULT_PRESETS: DateRangePreset[] = [
  { label: 'Today', range: lastDays(1) },
  { label: 'Last 7 days', range: lastDays(7) },
  { label: 'Last 30 days', range: lastDays(30) },
  { label: 'This month', range: calendarMonth(0) },
  { label: 'Last month', range: calendarMonth(-1) },
];

type DateRangePickerContentProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'onSelect' | 'required'
> &
  Pick<React.ComponentProps<typeof PopoverContent>, 'align'> & {
    /** Pass `[]` to hide the preset column. */
    presets?: DateRangePreset[];
  };

/** Takes the calendar's props (`disabled`, `numberOfMonths`, `weekStartsOn`, …). */
const DateRangePickerContent = ({
  presets = DEFAULT_PRESETS,
  numberOfMonths = 2,
  align = 'start',
  ...props
}: DateRangePickerContentProps) => {
  const ctx = useDateRangePicker();

  return (
    <PopoverContent align={align} data-slot="date-range-picker-content" className="w-auto p-0">
      <div className="flex flex-col sm:flex-row">
        {presets.length > 0 && (
          <div
            data-slot="date-range-picker-presets"
            className="flex flex-wrap gap-0.5 border-b p-2 sm:w-36 sm:flex-col sm:border-e sm:border-b-0"
          >
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                data-slot="date-range-picker-preset"
                className="justify-start font-normal"
                onClick={() => {
                  ctx.setValue(preset.range());
                  ctx.setOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
        <Calendar
          mode="range"
          numberOfMonths={numberOfMonths}
          selected={ctx.value}
          defaultMonth={ctx.value?.from}
          onSelect={ctx.setValue}
          excludeDisabled
          {...props}
        />
      </div>
    </PopoverContent>
  );
};

export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent };
