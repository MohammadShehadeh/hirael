'use client';

import * as React from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import {
  addDays,
  clampDate,
  gridKeyToDate,
  monthCells,
  monthIndex,
  sameDay,
  startOfDay,
} from '@/registry/hirael/bases/radix/components/calendar-utils';

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

export interface DateRangeCalendarProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  min?: Date;
  max?: Date;
  disabledDate?: (d: Date) => boolean;
  locale?: string;
  weekStartsOn?: 0 | 1;
  numberOfMonths?: 1 | 2;
  className?: string;
}

const DateRangeCalendar = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  disabledDate,
  locale,
  weekStartsOn = 1,
  numberOfMonths = 2,
  className,
}: DateRangeCalendarProps) => {
  const [internal, setInternal] = React.useState<DateRange | undefined>(defaultValue);
  const range = valueProp !== undefined ? valueProp : internal;
  const today = startOfDay(new Date());

  const [viewMonth, setViewMonth] = React.useState<Date>(() => {
    const anchor = range?.from ?? today;
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });
  const [hovered, setHovered] = React.useState<Date | null>(null);

  const pending = !!range?.from && !range?.to;

  const setRange = React.useCallback(
    (next: DateRange | undefined) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const isDayDisabled = React.useCallback(
    (d: Date) => {
      if (min && d.getTime() < startOfDay(min).getTime()) return true;
      if (max && d.getTime() > startOfDay(max).getTime()) return true;
      return disabledDate ? disabledDate(d) : false;
    },
    [min, max, disabledDate],
  );

  const selectDay = (d: Date) => {
    if (!range?.from || range.to) {
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
  const previewing = pending && !!hovered && !!fromDay;
  const lo = previewing ? (hovered.getTime() < fromDay.getTime() ? hovered : fromDay) : fromDay;
  const hi = previewing ? (hovered.getTime() < fromDay.getTime() ? fromDay : hovered) : toDay;
  const hasSpan = !!lo && !!hi && !sameDay(lo, hi);

  const months = Array.from(
    { length: numberOfMonths },
    (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth() + i, 1),
  );

  const isMonthVisible = (d: Date) => {
    const k = monthIndex(d);
    const v = monthIndex(viewMonth);
    return k >= v && k < v + numberOfMonths;
  };

  const canPrev =
    !min || new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0).getTime() >= startOfDay(min).getTime();
  const canNext =
    !max ||
    new Date(viewMonth.getFullYear(), viewMonth.getMonth() + numberOfMonths, 1).getTime() <= startOfDay(max).getTime();

  const stepMonth = (n: number) => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1));

  const rootRef = React.useRef<HTMLDivElement>(null);
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
    focusDay(clampDate(next, min, max));
  };

  const monthFmt = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  });
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const dayLabelFmt = new Intl.DateTimeFormat(locale, { dateStyle: 'full' });
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(2021, 7, 1 + ((weekStartsOn + i) % 7))),
  );

  const tabbable =
    range?.from && isMonthVisible(range.from) ? startOfDay(range.from) : isMonthVisible(today) ? today : viewMonth;

  return (
    <div ref={rootRef} data-slot="date-range-calendar" className={cn('flex gap-4', className)}>
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
                className="font-mono text-[11px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground"
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
                    className="flex h-7 items-center justify-center font-mono text-[10px] uppercase text-muted-foreground"
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
                    const out = isDayDisabled(d);
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
                          'relative size-8 rounded-sm font-mono text-xs tabular-nums outline-none transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus-visible:ring-2 focus-visible:ring-ring',
                          'disabled:opacity-30 disabled:hover:bg-transparent',
                          isBetween && 'rounded-none bg-accent text-accent-foreground',
                          (isLo || isHi) && !isAnchor && 'bg-accent text-accent-foreground',
                          isAnchor && 'bg-primary text-primary-foreground hover:bg-primary',
                          isLo && hasSpan && 'rounded-e-none',
                          isHi && hasSpan && 'rounded-s-none',
                          !isAnchor && isToday && 'ring-1 ring-inset ring-primary/60',
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
    () => ({ range, setRange, open, setOpen, min, max, disabled }),
    [range, setRange, open, setOpen, min, max, disabled],
  );

  return (
    <DateRangePickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </DateRangePickerContext.Provider>
  );
};

const DateRangePickerTrigger = ({
  placeholder = 'Pick a date range',
  locale,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'button'>, 'children'> & {
  placeholder?: string;
  locale?: string;
  children?: React.ReactNode;
}) => {
  const ctx = useDateRangePicker();
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  const label = ctx.range?.from
    ? ctx.range.to
      ? `${fmt.format(ctx.range.from)} – ${fmt.format(ctx.range.to)}`
      : `${fmt.format(ctx.range.from)} – …`
    : placeholder;
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={ctx.disabled}
        data-slot="date-range-picker-trigger"
        data-state={ctx.open ? 'open' : 'closed'}
        className={cn(
          'inline-flex h-9 w-full items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm font-mono tabular-nums outline-none transition-colors',
          'hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring',
          !ctx.range?.from && 'text-muted-foreground font-sans',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span data-slot="date-range-picker-trigger-label" className="flex-1 truncate">
          {children ?? label}
        </span>
      </button>
    </PopoverTrigger>
  );
};

const DateRangePickerContent = ({
  presets = DEFAULT_PRESETS,
  showPresets = true,
  locale,
  weekStartsOn,
  numberOfMonths,
  disabledDate,
  align = 'start',
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent> & {
  presets?: DateRangePreset[];
  showPresets?: boolean;
  locale?: string;
  weekStartsOn?: 0 | 1;
  numberOfMonths?: 1 | 2;
  disabledDate?: (d: Date) => boolean;
}) => {
  const ctx = useDateRangePicker();

  const isDayDisabled = (d: Date) => {
    if (ctx.min && d.getTime() < startOfDay(ctx.min).getTime()) return true;
    if (ctx.max && d.getTime() > startOfDay(ctx.max).getTime()) return true;
    return disabledDate ? disabledDate(d) : false;
  };

  const resolvePreset = (preset: DateRangePreset): DateRange | null => {
    const raw = preset.range();
    const rawFrom = startOfDay(raw.from);
    const rawTo = startOfDay(raw.to);
    if (ctx.min && rawTo.getTime() < startOfDay(ctx.min).getTime()) return null;
    if (ctx.max && rawFrom.getTime() > startOfDay(ctx.max).getTime()) return null;
    let from = clampDate(rawFrom, ctx.min, ctx.max);
    let to = clampDate(rawTo, ctx.min, ctx.max);
    while (from.getTime() <= to.getTime() && isDayDisabled(from)) {
      from = addDays(from, 1);
    }
    while (to.getTime() >= from.getTime() && isDayDisabled(to)) {
      to = addDays(to, -1);
    }
    if (from.getTime() > to.getTime()) return null;
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
            <Separator orientation="vertical" className="max-sm:hidden h-auto" />
            <Separator className="sm:hidden" />
          </>
        )}
        <div data-slot="date-range-picker-content-calendar" className="flex flex-col gap-2">
          <DateRangeCalendar
            value={ctx.range ?? {}}
            onValueChange={ctx.setRange}
            min={ctx.min}
            max={ctx.max}
            disabledDate={disabledDate}
            locale={locale}
            weekStartsOn={weekStartsOn}
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
                className="h-7 gap-1 px-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
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
