'use client';

import * as React from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { composeRefs } from '@/registry/hirael/bases/radix/components/compose-refs';
import {
  DEFAULT_LOCALE,
  clampDate,
  findFocusableDay,
  gridKeyToDate,
  isDayDisabled,
  monthCells,
  monthIndex,
  sameDay,
  startOfDay,
  startOfMonth,
  useToday,
  type WeekStartsOn,
} from '@/registry/hirael/bases/radix/components/calendar-utils';

// Laid out while today is unknown (server render, hydration); it has six week rows, so the height never jumps.
const PLACEHOLDER_MONTH = new Date(2000, 0, 1);

export interface DateCalendarProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  disabledDate?: (d: Date) => boolean;
  /** BCP 47 tag for labels. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  weekStartsOn?: WeekStartsOn;
}

const DateCalendar = ({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  min,
  max,
  disabledDate,
  locale = DEFAULT_LOCALE,
  weekStartsOn = 1,
  className,
  ref: refProp,
  ...props
}: DateCalendarProps) => {
  const [internal, setInternal] = React.useState<Date | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;
  const today = useToday();

  // With no anchor, the first month is today's, which is only known after hydration.
  const [internalMonth, setInternalMonth] = React.useState<Date | null>(() => {
    const anchor = monthProp ?? defaultMonth ?? value;

    return anchor ? startOfMonth(anchor) : null;
  });
  const resolvedMonth =
    monthProp !== undefined ? startOfMonth(monthProp) : (internalMonth ?? (today && startOfMonth(today)));
  const viewMonth = resolvedMonth ?? PLACEHOLDER_MONTH;
  const setViewMonth = (next: Date) => {
    if (monthProp === undefined) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const valueMonthKey = valueProp != null ? monthIndex(valueProp) : null;
  const [prevValueMonthKey, setPrevValueMonthKey] = React.useState(valueMonthKey);
  if (valueMonthKey !== prevValueMonthKey) {
    setPrevValueMonthKey(valueMonthKey);
    if (valueProp != null && monthProp === undefined) {
      setInternalMonth(new Date(valueProp.getFullYear(), valueProp.getMonth(), 1));
    }
  }

  const setValue = React.useCallback(
    (next: Date | null) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const isDisabled = React.useCallback(
    (d: Date) => isDayDisabled(d, { min, max, disabledDate }),
    [min, max, disabledDate],
  );

  const selected = value ? startOfDay(value) : null;

  const isMonthVisible = (d: Date) => monthIndex(d) === monthIndex(viewMonth);

  const canPrev =
    !min || new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0).getTime() >= startOfDay(min).getTime();
  const canNext =
    !max || new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1).getTime() <= startOfDay(max).getTime();

  const stepMonth = (n: number) => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1));

  const rootRef = React.useRef<HTMLDivElement>(null);
  const composedRef = React.useMemo(() => composeRefs(rootRef, refProp), [refProp]);
  const focusDay = (d: Date) => {
    const doFocus = () => {
      rootRef.current?.querySelector<HTMLButtonElement>(`[data-day="${d.getTime()}"]`)?.focus();
    };
    if (!isMonthVisible(d)) {
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      requestAnimationFrame(doFocus);
    } else {
      doFocus();
    }
  };

  const handleKey = (e: React.KeyboardEvent, d: Date) => {
    const forward = getComputedStyle(e.currentTarget).direction === 'rtl' ? -1 : 1;
    const next = gridKeyToDate(e.key, d, {
      weekStartsOn,
      shiftKey: e.shiftKey,
      forward,
    });
    if (!next) return;
    e.preventDefault();
    const target = clampDate(next, min, max);
    const focusable = findFocusableDay(target, target.getTime() < d.getTime() ? -1 : 1, isDisabled, min, max);
    if (focusable) focusDay(focusable);
  };

  const monthFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }), [locale]);
  const weekdayFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'short' }), [locale]);
  const dayLabelFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }), [locale]);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(2021, 7, 1 + ((weekStartsOn + i) % 7))),
  );

  const cells = monthCells(viewMonth, weekStartsOn);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const isTabbable = (d: Date | null): d is Date => !!d && isMonthVisible(d) && !isDisabled(d);
  const tabbable = isTabbable(selected)
    ? selected
    : isTabbable(today)
      ? today
      : (cells.find((c): c is Date => isTabbable(c)) ?? viewMonth);

  return (
    <div
      ref={composedRef}
      data-slot="date-picker-calendar"
      data-pending={resolvedMonth ? undefined : ''}
      className={cn('w-60', !resolvedMonth && 'invisible', className)}
      {...props}
    >
      <div data-slot="date-picker-calendar-header" className="mb-2 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous month"
          disabled={!canPrev}
          onClick={() => stepMonth(-1)}
          className="size-7"
        >
          <ChevronLeft className="size-3.5 rtl:rotate-180" />
        </Button>
        <span data-slot="date-picker-calendar-caption" className="text-xs text-muted-foreground uppercase tabular-nums">
          {monthFmt.format(viewMonth)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next month"
          disabled={!canNext}
          onClick={() => stepMonth(1)}
          className="size-7"
        >
          <ChevronRight className="size-3.5 rtl:rotate-180" />
        </Button>
      </div>
      <div
        role="grid"
        aria-label={monthFmt.format(viewMonth)}
        data-slot="date-picker-calendar-grid"
        className="grid gap-y-0.5"
      >
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((label, i) => (
            <span
              key={i}
              role="columnheader"
              data-slot="date-picker-calendar-weekday"
              className="flex h-7 items-center justify-center text-xs text-muted-foreground uppercase"
            >
              {label}
            </span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} role="row" className="grid grid-cols-7">
            {week.map((d, i) => {
              if (!d) {
                return <span key={i} role="gridcell" className="size-8" />;
              }
              const isSelected = sameDay(d, selected);
              const isToday = sameDay(d, today);
              const out = isDisabled(d);

              return (
                <button
                  key={i}
                  type="button"
                  role="gridcell"
                  data-day={d.getTime()}
                  data-slot="date-picker-calendar-day"
                  disabled={out}
                  aria-selected={isSelected}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={dayLabelFmt.format(d)}
                  onClick={() => setValue(d)}
                  onKeyDown={(e) => handleKey(e, d)}
                  tabIndex={sameDay(d, tabbable) ? 0 : -1}
                  className={cn(
                    'relative size-8 rounded-sm text-xs tabular-nums transition-colors outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:opacity-30 disabled:hover:bg-transparent',
                    isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                    !isSelected && isToday && 'ring-1 ring-primary/60 ring-inset',
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

interface DatePickerContextValue {
  value: Date | null;
  setValue: (date: Date | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  min?: Date;
  max?: Date;
  disabledDate?: (d: Date) => boolean;
  locale: string;
  weekStartsOn?: WeekStartsOn;
  disabled?: boolean;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

const useDatePicker = () => {
  const ctx = React.useContext(DatePickerContext);
  if (!ctx) {
    throw new Error('DatePicker compound components must be used inside <DatePicker>');
  }

  return ctx;
};

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  min?: Date;
  max?: Date;
  disabledDate?: (d: Date) => boolean;
  /** BCP 47 tag for the trigger label and calendar. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  weekStartsOn?: WeekStartsOn;
  disabled?: boolean;
  children?: React.ReactNode;
}

const DatePicker = ({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  min,
  max,
  disabledDate,
  locale = DEFAULT_LOCALE,
  weekStartsOn,
  disabled,
  children,
}: DatePickerProps) => {
  const [internalValue, setInternalValue] = React.useState<Date | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const setValue = React.useCallback(
    (next: Date | null) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const ctx = React.useMemo<DatePickerContextValue>(
    () => ({ value, setValue, open, setOpen, min, max, disabledDate, locale, weekStartsOn, disabled }),
    [value, setValue, open, setOpen, min, max, disabledDate, locale, weekStartsOn, disabled],
  );

  return (
    <DatePickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </DatePickerContext.Provider>
  );
};

interface DatePickerTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  /** Overrides the root `locale`. */
  locale?: string;
  children?: React.ReactNode;
}

const DatePickerTrigger = ({
  placeholder = 'Pick a date',
  locale,
  className,
  children,
  ...props
}: DatePickerTriggerProps) => {
  const ctx = useDatePicker();
  const resolvedLocale = locale ?? ctx.locale;
  const fmt = React.useMemo(() => new Intl.DateTimeFormat(resolvedLocale, { dateStyle: 'medium' }), [resolvedLocale]);

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={ctx.disabled}
        data-slot="date-picker-trigger"
        data-state={ctx.open ? 'open' : 'closed'}
        className={cn(
          'inline-flex h-9 w-full items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm tabular-nums transition-colors outline-none',
          'hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring',
          !ctx.value && 'font-sans text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span data-slot="date-picker-trigger-label" className="flex-1 truncate">
          {children ?? (ctx.value ? fmt.format(ctx.value) : placeholder)}
        </span>
      </button>
    </PopoverTrigger>
  );
};

interface DatePickerContentProps extends React.ComponentProps<typeof PopoverContent> {
  /** Overrides the root `locale`. */
  locale?: string;
  /** Overrides the root `weekStartsOn`. */
  weekStartsOn?: WeekStartsOn;
  /** Overrides the root `disabledDate`. */
  disabledDate?: (d: Date) => boolean;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
}

const DatePickerContent = ({
  locale,
  weekStartsOn,
  disabledDate,
  month,
  defaultMonth,
  onMonthChange,
  className,
  ...props
}: DatePickerContentProps) => {
  const ctx = useDatePicker();

  return (
    <PopoverContent align="start" data-slot="date-picker-content" className={cn('w-auto p-3', className)} {...props}>
      <div data-slot="date-picker-content-body" className="flex flex-col gap-2">
        <DateCalendar
          value={ctx.value}
          onValueChange={(d) => {
            ctx.setValue(d);
            ctx.setOpen(false);
          }}
          month={month}
          defaultMonth={defaultMonth}
          onMonthChange={onMonthChange}
          min={ctx.min}
          max={ctx.max}
          disabledDate={disabledDate ?? ctx.disabledDate}
          locale={locale ?? ctx.locale}
          weekStartsOn={weekStartsOn ?? ctx.weekStartsOn}
        />
        {ctx.value && (
          <div data-slot="date-picker-content-footer" className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-slot="date-picker-clear"
              onClick={() => ctx.setValue(null)}
              className="h-7 gap-1 px-2 text-xs text-muted-foreground uppercase"
            >
              <X className="size-3" />
              Clear
            </Button>
          </div>
        )}
      </div>
    </PopoverContent>
  );
};

export { DatePicker, DatePickerTrigger, DatePickerContent, DateCalendar };
