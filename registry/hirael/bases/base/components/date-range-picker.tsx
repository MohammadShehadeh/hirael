'use client';

import * as React from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';
import {
  DEFAULT_LOCALE,
  addDays,
  clampDate,
  findFocusableDay,
  gridKeyToDate,
  isDayDisabled,
  monthCells,
  monthIndex,
  rangeHasDisabledDay,
  sameDay,
  startOfDay,
  startOfMonth,
  useToday,
  type WeekStartsOn,
} from '@/registry/hirael/bases/base/components/calendar-utils';

export interface DateRange {
  from?: Date;
  to?: Date;
}
export interface DateRangePreset {
  label: string;
  range: () => { from: Date; to: Date };
}

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: 'Today',
    range: () => {
      const t = startOfDay(new Date());

      return { from: t, to: t };
    },
  },
  {
    label: 'Last 7 days',
    range: () => {
      const t = startOfDay(new Date());

      return { from: addDays(t, -6), to: t };
    },
  },
  {
    label: 'Last 14 days',
    range: () => {
      const t = startOfDay(new Date());

      return { from: addDays(t, -13), to: t };
    },
  },
  {
    label: 'Last 30 days',
    range: () => {
      const t = startOfDay(new Date());

      return { from: addDays(t, -29), to: t };
    },
  },
  {
    label: 'This month',
    range: () => {
      const t = new Date();

      return {
        from: new Date(t.getFullYear(), t.getMonth(), 1),
        to: new Date(t.getFullYear(), t.getMonth() + 1, 0),
      };
    },
  },
  {
    label: 'Last month',
    range: () => {
      const t = new Date();

      return {
        from: new Date(t.getFullYear(), t.getMonth() - 1, 1),
        to: new Date(t.getFullYear(), t.getMonth(), 0),
      };
    },
  },
];

const EMPTY_RANGE: DateRange = {};

// Laid out while today is unknown (server render, hydration); it has six week rows, so the height never jumps.
const PLACEHOLDER_MONTH = new Date(2000, 0, 1);

// The second month is hidden below the `sm` breakpoint, so keyboard focus and paging treat it as absent.
const WIDE_QUERY = '(min-width: 40rem)';
const subscribeWide = (onChange: () => void) => {
  if (typeof window.matchMedia !== 'function') return () => {};
  const mql = window.matchMedia(WIDE_QUERY);
  mql.addEventListener('change', onChange);

  return () => mql.removeEventListener('change', onChange);
};
const getWideSnapshot = () => typeof window.matchMedia !== 'function' || window.matchMedia(WIDE_QUERY).matches;
const getServerWideSnapshot = () => true;

export interface DateRangeCalendarProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  /** Disabled days can't be picked, and a range can't span one. */
  disabledDate?: (d: Date) => boolean;
  /** BCP 47 tag for labels. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  weekStartsOn?: WeekStartsOn;
  numberOfMonths?: 1 | 2;
}

const DateRangeCalendar = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  min,
  max,
  disabledDate,
  locale = DEFAULT_LOCALE,
  weekStartsOn = 1,
  numberOfMonths = 2,
  className,
  ref: refProp,
  ...props
}: DateRangeCalendarProps) => {
  const [internal, setInternal] = React.useState<DateRange | undefined>(defaultValue);
  const range = valueProp !== undefined ? valueProp : internal;
  const today = useToday();
  const wide = React.useSyncExternalStore(subscribeWide, getWideSnapshot, getServerWideSnapshot);
  const visibleMonths = wide ? numberOfMonths : 1;

  // With no anchor, the first month is today's, which is only known after hydration.
  const [internalMonth, setInternalMonth] = React.useState<Date | null>(() => {
    const anchor = monthProp ?? defaultMonth ?? range?.from;

    return anchor ? startOfMonth(anchor) : null;
  });
  const resolvedMonth =
    monthProp !== undefined ? startOfMonth(monthProp) : (internalMonth ?? (today && startOfMonth(today)));
  const viewMonth = resolvedMonth ?? PLACEHOLDER_MONTH;
  const setViewMonth = (next: Date) => {
    if (monthProp === undefined) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const isMonthVisible = (d: Date) => {
    const k = monthIndex(d);
    const v = monthIndex(viewMonth);

    return k >= v && k < v + visibleMonths;
  };

  // Follow a controlled `from` that lands outside the visible months, like DateCalendar does.
  const fromMonthKey = valueProp?.from ? monthIndex(valueProp.from) : null;
  const [prevFromMonthKey, setPrevFromMonthKey] = React.useState(fromMonthKey);
  if (fromMonthKey !== prevFromMonthKey) {
    setPrevFromMonthKey(fromMonthKey);
    if (valueProp?.from && monthProp === undefined && !isMonthVisible(valueProp.from)) {
      setInternalMonth(startOfMonth(valueProp.from));
    }
  }

  const [hovered, setHovered] = React.useState<Date | null>(null);

  const pending = !!range?.from && !range?.to;

  const setRange = React.useCallback(
    (next: DateRange | undefined) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const isDisabled = React.useCallback(
    (d: Date) => isDayDisabled(d, { min, max, disabledDate }),
    [min, max, disabledDate],
  );

  const selectDay = (d: Date) => {
    // A range can't span a disabled day, so that click starts a new range instead.
    if (!range?.from || range.to || rangeHasDisabledDay(range.from, d, isDisabled)) {
      setRange({ from: d });

      return;
    }
    setHovered(null);
    if (d.getTime() < startOfDay(range.from).getTime()) {
      setRange({ from: d, to: startOfDay(range.from) });
    } else {
      setRange({ from: startOfDay(range.from), to: d });
    }
  };

  const fromDay = range?.from ? startOfDay(range.from) : undefined;
  const toDay = range?.to ? startOfDay(range.to) : undefined;
  const previewing = pending && !!hovered && !!fromDay && !rangeHasDisabledDay(fromDay, hovered, isDisabled);
  const lo = previewing ? (hovered.getTime() < fromDay.getTime() ? hovered : fromDay) : fromDay;
  const hi = previewing ? (hovered.getTime() < fromDay.getTime() ? fromDay : hovered) : toDay;
  const hasSpan = !!lo && !!hi && !sameDay(lo, hi);

  const months = Array.from(
    { length: numberOfMonths },
    (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth() + i, 1),
  );

  const canPrev =
    !min || new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0).getTime() >= startOfDay(min).getTime();
  const canNext =
    !max ||
    new Date(viewMonth.getFullYear(), viewMonth.getMonth() + visibleMonths, 1).getTime() <= startOfDay(max).getTime();

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

  const isTabbable = (d: Date | null | undefined): d is Date => !!d && isMonthVisible(d) && !isDisabled(d);
  const tabbable = isTabbable(fromDay)
    ? fromDay
    : isTabbable(today)
      ? today
      : (months
          .slice(0, visibleMonths)
          .flatMap((m) => monthCells(m, weekStartsOn))
          .find((c): c is Date => isTabbable(c)) ?? viewMonth);

  return (
    <div
      ref={composedRef}
      data-slot="date-range-calendar"
      data-pending={resolvedMonth ? undefined : ''}
      className={cn('flex gap-4', !resolvedMonth && 'invisible', className)}
      {...props}
    >
      {months.map((month, mi) => {
        const last = mi === numberOfMonths - 1;
        const cells = monthCells(month, weekStartsOn);
        const weeks: (Date | null)[][] = [];
        for (let i = 0; i < cells.length; i += 7) {
          weeks.push(cells.slice(i, i + 7));
        }

        return (
          <div
            key={monthIndex(month)}
            data-slot="date-range-calendar-month"
            className={cn('w-60', mi > 0 && 'max-sm:hidden')}
          >
            <div data-slot="date-range-calendar-header" className="mb-2 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Previous month"
                disabled={!canPrev}
                onClick={() => stepMonth(-1)}
                className={cn('size-7', mi > 0 && 'invisible')}
              >
                <ChevronLeft className="size-3.5 rtl:rotate-180" />
              </Button>
              <span
                data-slot="date-range-calendar-caption"
                className="text-xs text-muted-foreground uppercase tabular-nums"
              >
                {monthFmt.format(month)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next month"
                disabled={!canNext}
                onClick={() => stepMonth(1)}
                className={cn('size-7', !last && numberOfMonths === 2 && 'sm:invisible')}
              >
                <ChevronRight className="size-3.5 rtl:rotate-180" />
              </Button>
            </div>
            <div
              role="grid"
              aria-label={monthFmt.format(month)}
              data-slot="date-range-calendar-grid"
              className="grid gap-y-0.5"
              onMouseLeave={() => setHovered(null)}
            >
              <div role="row" className="grid grid-cols-7">
                {weekdays.map((label, i) => (
                  <span
                    key={i}
                    role="columnheader"
                    data-slot="date-range-calendar-weekday"
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
                    const t = d.getTime();
                    const isLo = !!lo && sameDay(d, lo);
                    const isHi = !!hi && sameDay(d, hi);
                    const isBetween = !!lo && !!hi && t > lo.getTime() && t < hi.getTime();
                    const isAnchor = sameDay(d, range?.from) || sameDay(d, range?.to);
                    const isSelected =
                      isAnchor || (!!fromDay && !!toDay && t > fromDay.getTime() && t < toDay.getTime());
                    const isToday = sameDay(d, today);
                    const out = isDisabled(d);

                    return (
                      <button
                        key={i}
                        type="button"
                        role="gridcell"
                        data-day={t}
                        data-slot="date-range-calendar-day"
                        disabled={out}
                        aria-selected={isSelected}
                        aria-current={isToday ? 'date' : undefined}
                        aria-label={dayLabelFmt.format(d)}
                        data-preview={(previewing && (isLo || isHi || isBetween) && !isSelected) || undefined}
                        onClick={() => selectDay(d)}
                        onKeyDown={(e) => handleKey(e, d)}
                        onMouseEnter={() => pending && setHovered(d)}
                        onFocus={() => pending && setHovered(d)}
                        tabIndex={sameDay(d, tabbable) ? 0 : -1}
                        className={cn(
                          'relative size-8 rounded-sm text-xs tabular-nums transition-colors outline-none',
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus-visible:ring-2 focus-visible:ring-ring',
                          'disabled:opacity-30 disabled:hover:bg-transparent',
                          isBetween && 'rounded-none bg-accent text-accent-foreground',
                          (isLo || isHi) && !isAnchor && 'bg-accent text-accent-foreground',
                          isAnchor && 'bg-primary text-primary-foreground hover:bg-primary',
                          isLo && hasSpan && 'rounded-e-none',
                          isHi && hasSpan && 'rounded-s-none',
                          !isAnchor && isToday && 'ring-1 ring-primary/60 ring-inset',
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
      })}
    </div>
  );
};

interface DateRangePickerContextValue {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  min?: Date;
  max?: Date;
  disabledDate?: (d: Date) => boolean;
  locale: string;
  weekStartsOn?: WeekStartsOn;
  disabled?: boolean;
}

const DateRangePickerContext = React.createContext<DateRangePickerContextValue | null>(null);

const useDateRangePicker = () => {
  const ctx = React.useContext(DateRangePickerContext);
  if (!ctx) {
    throw new Error('DateRangePicker compound components must be used inside <DateRangePicker>');
  }

  return ctx;
};

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  min?: Date;
  max?: Date;
  /** Disabled days can't be picked, and a range can't span one. */
  disabledDate?: (d: Date) => boolean;
  /** BCP 47 tag for the trigger label and calendar. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  weekStartsOn?: WeekStartsOn;
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
  min,
  max,
  disabledDate,
  locale = DEFAULT_LOCALE,
  weekStartsOn,
  disabled,
  children,
}: DateRangePickerProps) => {
  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(defaultValue);
  const range = valueProp !== undefined ? valueProp : internalRange;
  const setRange = React.useCallback(
    (next: DateRange | undefined) => {
      if (valueProp === undefined) setInternalRange(next);
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

  const ctx = React.useMemo<DateRangePickerContextValue>(
    () => ({ range, setRange, open, setOpen, min, max, disabledDate, locale, weekStartsOn, disabled }),
    [range, setRange, open, setOpen, min, max, disabledDate, locale, weekStartsOn, disabled],
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
  /** Overrides the root `locale`. */
  locale?: string;
  children?: React.ReactNode;
}

const DateRangePickerTrigger = ({
  placeholder = 'Pick a date range',
  locale,
  className,
  children,
  ...props
}: DateRangePickerTriggerProps) => {
  const ctx = useDateRangePicker();
  const resolvedLocale = locale ?? ctx.locale;
  const fmt = React.useMemo(() => new Intl.DateTimeFormat(resolvedLocale, { dateStyle: 'medium' }), [resolvedLocale]);
  const label = ctx.range?.from
    ? ctx.range.to
      ? `${fmt.format(ctx.range.from)} – ${fmt.format(ctx.range.to)}`
      : `${fmt.format(ctx.range.from)} – …`
    : placeholder;

  return (
    <PopoverTrigger
      render={
        <button
          type="button"
          disabled={ctx.disabled}
          data-slot="date-range-picker-trigger"
          className={cn(
            'inline-flex h-9 w-full items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm tabular-nums transition-colors outline-none',
            'hover:border-ring/60 focus-visible:border-ring data-popup-open:border-ring',
            !ctx.range?.from && 'font-sans text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
      }
    >
      <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <span data-slot="date-range-picker-trigger-label" className="flex-1 truncate">
        {children ?? label}
      </span>
    </PopoverTrigger>
  );
};

interface DateRangePickerContentProps extends React.ComponentProps<typeof PopoverContent> {
  presets?: DateRangePreset[];
  showPresets?: boolean;
  /** Overrides the root `locale`. */
  locale?: string;
  /** Overrides the root `weekStartsOn`. */
  weekStartsOn?: WeekStartsOn;
  numberOfMonths?: 1 | 2;
  /** Overrides the root `disabledDate`. */
  disabledDate?: (d: Date) => boolean;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
}

const DateRangePickerContent = ({
  presets = DEFAULT_PRESETS,
  showPresets = true,
  locale,
  weekStartsOn,
  numberOfMonths,
  disabledDate: disabledDateProp,
  month,
  defaultMonth,
  onMonthChange,
  align = 'start',
  className,
  ...props
}: DateRangePickerContentProps) => {
  const ctx = useDateRangePicker();
  const disabledDate = disabledDateProp ?? ctx.disabledDate;

  const isDisabled = (d: Date) => isDayDisabled(d, { min: ctx.min, max: ctx.max, disabledDate });

  const resolvePreset = (preset: DateRangePreset): DateRange | null => {
    const raw = preset.range();
    const rawFrom = startOfDay(raw.from);
    const rawTo = startOfDay(raw.to);
    if (ctx.min && rawTo.getTime() < startOfDay(ctx.min).getTime()) return null;
    if (ctx.max && rawFrom.getTime() > startOfDay(ctx.max).getTime()) return null;
    let from = clampDate(rawFrom, ctx.min, ctx.max);
    let to = clampDate(rawTo, ctx.min, ctx.max);
    while (from.getTime() <= to.getTime() && isDisabled(from)) {
      from = addDays(from, 1);
    }
    while (to.getTime() >= from.getTime() && isDisabled(to)) {
      to = addDays(to, -1);
    }
    if (from.getTime() > to.getTime() || rangeHasDisabledDay(from, to, isDisabled)) return null;

    return { from, to };
  };

  return (
    <PopoverContent
      align={align}
      data-slot="date-range-picker-content"
      className={cn('w-auto p-3', className)}
      {...props}
    >
      <div data-slot="date-range-picker-content-body" className="flex flex-col gap-3 sm:flex-row">
        {showPresets && presets.length > 0 && (
          <>
            <div data-slot="date-range-picker-presets" className="flex flex-row flex-wrap gap-0.5 sm:w-32 sm:flex-col">
              {presets.map((preset) => {
                const resolved = resolvePreset(preset);

                return (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="ghost"
                    size="xs"
                    data-slot="date-range-picker-preset"
                    disabled={!resolved}
                    onClick={() => {
                      if (!resolved) return;
                      ctx.setRange(resolved);
                      ctx.setOpen(false);
                    }}
                    className="justify-start font-normal"
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
            <Separator orientation="vertical" className="h-auto max-sm:hidden" />
            <Separator className="sm:hidden" />
          </>
        )}
        <div data-slot="date-range-picker-content-calendar" className="flex flex-col gap-2">
          <DateRangeCalendar
            value={ctx.range ?? EMPTY_RANGE}
            onValueChange={(next) => {
              ctx.setRange(next);
              if (next?.from && next.to) ctx.setOpen(false);
            }}
            month={month}
            defaultMonth={defaultMonth}
            onMonthChange={onMonthChange}
            min={ctx.min}
            max={ctx.max}
            disabledDate={disabledDate}
            locale={locale ?? ctx.locale}
            weekStartsOn={weekStartsOn ?? ctx.weekStartsOn}
            numberOfMonths={numberOfMonths}
          />
          {ctx.range?.from && (
            <div data-slot="date-range-picker-content-footer" className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-slot="date-range-picker-clear"
                onClick={() => ctx.setRange(undefined)}
                className="h-7 gap-1 px-2 text-xs text-muted-foreground uppercase"
              >
                <X className="size-3" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>
    </PopoverContent>
  );
};

export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent, DateRangeCalendar };
