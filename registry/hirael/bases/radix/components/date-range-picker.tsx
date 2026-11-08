'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { DateLib, type DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Calendar } from '@/registry/hirael/bases/radix/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export type { DateRange };

/** A non-Gregorian calendar, such as `hijriCalendar` from `hijri-calendar`. */
export interface CalendarSystem {
  /** Intl calendar id for the trigger label, such as `islamic-umalqura`. */
  intl: string;
  /** Spread onto the calendar before its own props. */
  props: Pick<React.ComponentProps<typeof Calendar>, 'dateLib' | 'startMonth' | 'endMonth' | 'formatters'>;
}

interface DateRangePickerContextValue {
  value: DateRange | undefined;
  setValue: (value: DateRange | undefined) => void;
  setOpen: (open: boolean) => void;
  locale: string;
  calendar?: CalendarSystem;
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
  /** Shows another calendar, such as `hijriCalendar` from `hijri-calendar`. Values stay `Date`s. */
  calendar?: CalendarSystem;
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
  calendar,
  disabled,
  children,
}: DateRangePickerProps) => {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const ctx: DateRangePickerContextValue = { value, setValue, setOpen, locale, calendar, disabled };

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
  const fmt = new Intl.DateTimeFormat(ctx.locale, { dateStyle: 'medium', calendar: ctx.calendar?.intl });

  return (
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        disabled={ctx.disabled}
        data-slot="date-range-picker-trigger"
        data-empty={!ctx.value?.from || undefined}
        className={cn('w-full justify-start font-normal tabular-nums data-empty:text-muted-foreground', className)}
        {...props}
      >
        <CalendarIcon className="text-muted-foreground" />
        <span data-slot="date-range-picker-trigger-label" className="flex-1 truncate text-start">
          {children ??
            (ctx.value?.from
              ? `${fmt.format(ctx.value.from)} – ${ctx.value.to ? fmt.format(ctx.value.to) : '…'}`
              : placeholder)}
        </span>
      </Button>
    </PopoverTrigger>
  );
};

export interface DateRangePreset {
  label: string;
  /** Gets the picker's date library, so month presets follow its calendar. */
  range: (dateLib: DateLib) => DateRange;
}

const lastDays = (days: number): DateRange => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const from = new Date(today);
  from.setDate(today.getDate() + 1 - days);

  return { from, to: today };
};

const calendarMonth = (dateLib: DateLib, offset: number): DateRange => {
  const from = dateLib.startOfMonth(dateLib.addMonths(new Date(), offset));

  return { from, to: dateLib.startOfDay(dateLib.endOfMonth(from)) };
};

const DEFAULT_PRESETS: DateRangePreset[] = [
  { label: 'Today', range: () => lastDays(1) },
  { label: 'Last 7 days', range: () => lastDays(7) },
  { label: 'Last 30 days', range: () => lastDays(30) },
  { label: 'This month', range: (dateLib) => calendarMonth(dateLib, 0) },
  { label: 'Last month', range: (dateLib) => calendarMonth(dateLib, -1) },
];

interface DateRangePickerContentProps
  extends
    Omit<React.ComponentProps<typeof Calendar>, 'mode' | 'selected' | 'onSelect' | 'required'>,
    Pick<React.ComponentProps<typeof PopoverContent>, 'align'> {
  /** Pass `[]` to hide the preset column. */
  presets?: DateRangePreset[];
}

/** Takes the calendar's props (`disabled`, `numberOfMonths`, `weekStartsOn`, …). */
const DateRangePickerContent = ({
  presets = DEFAULT_PRESETS,
  numberOfMonths = 2,
  align = 'start',
  ...props
}: DateRangePickerContentProps) => {
  const ctx = useDateRangePicker();
  const dateLib = new DateLib(undefined, ctx.calendar?.props.dateLib);

  return (
    <PopoverContent
      align={align}
      data-slot="date-range-picker-content"
      className="w-auto max-w-(--radix-popover-content-available-width) p-0"
    >
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
                  ctx.setValue(preset.range(dateLib));
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
          {...ctx.calendar?.props}
          {...props}
        />
      </div>
    </PopoverContent>
  );
};

export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent };
