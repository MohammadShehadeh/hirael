'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';

export interface MonthValue {
  year: number;
  month: number;
}
export interface MonthRange {
  from: MonthValue;
  to?: MonthValue;
}
export type MonthPickerMode = 'single' | 'range';

// Default locale for labels, so a static export and the visitor's browser format the same way.
const DEFAULT_LOCALE = 'en-US';

interface MonthPickerSharedContext {
  setValue: (v: MonthValue) => void;
  min: MonthValue;
  max: MonthValue;
  locale: string;
  displayYear: number;
  setDisplayYear: (n: number) => void;
  disabled?: boolean;
}

type MonthPickerContextValue =
  | (MonthPickerSharedContext & { mode: 'single'; value: MonthValue | undefined })
  | (MonthPickerSharedContext & { mode: 'range'; value: MonthRange | undefined });

const MonthPickerContext = React.createContext<MonthPickerContextValue | null>(null);

const useMonthPicker = () => {
  const ctx = React.useContext(MonthPickerContext);
  if (!ctx) {
    throw new Error('MonthPicker compound components must be used inside <MonthPicker>');
  }

  return ctx;
};

const shortMonthLabels = (locale: string) => {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'short' });

  return Array.from({ length: 12 }, (_, m) => fmt.format(new Date(2024, m, 1)));
};

const currentMonth = (): MonthValue => {
  const d = new Date();

  return { year: d.getFullYear(), month: d.getMonth() };
};

const compareMonth = (a: MonthValue, b: MonthValue) => a.year * 12 + a.month - (b.year * 12 + b.month);

const monthEq = (a: MonthValue | undefined, b: MonthValue | undefined) => !!a && !!b && compareMonth(a, b) === 0;

interface MonthPickerSharedProps {
  /** Earliest selectable month. Takes precedence over `minYear`. */
  min?: MonthValue;
  /** Latest selectable month. Takes precedence over `maxYear`. */
  max?: MonthValue;
  minYear?: number;
  maxYear?: number;
  /** BCP 47 tag for labels. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/** `null` and `undefined` both mean no selection; `value={null}` stays controlled. */
export type MonthPickerProps =
  | (MonthPickerSharedProps & {
      mode?: 'single';
      value?: MonthValue | null;
      defaultValue?: MonthValue | null;
      onValueChange?: (v: MonthValue) => void;
    })
  | (MonthPickerSharedProps & {
      mode: 'range';
      value?: MonthRange | null;
      defaultValue?: MonthRange | null;
      onValueChange?: (range: MonthRange) => void;
    });

const MonthPicker = (props: MonthPickerProps) => {
  const {
    min: minProp,
    max: maxProp,
    minYear = 1900,
    maxYear = 2100,
    locale = DEFAULT_LOCALE,
    disabled,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    children,
  } = props;
  const mode = props.mode ?? 'single';
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
  } = props as {
    value?: MonthValue | MonthRange | null;
    defaultValue?: MonthValue | MonthRange | null;
    onValueChange?: (v: MonthValue | MonthRange) => void;
  };

  const [openInternal, setOpenInternal] = React.useState(defaultOpen);
  const open = openProp !== undefined ? openProp : openInternal;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInternal(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const minYearValue = minProp?.year ?? minYear;
  const minMonthValue = minProp?.month ?? 0;
  const maxYearValue = maxProp?.year ?? maxYear;
  const maxMonthValue = maxProp?.month ?? 11;
  const min = React.useMemo<MonthValue>(
    () => ({ year: minYearValue, month: minMonthValue }),
    [minYearValue, minMonthValue],
  );
  const max = React.useMemo<MonthValue>(
    () => ({ year: maxYearValue, month: maxMonthValue }),
    [maxYearValue, maxMonthValue],
  );

  const [internal, setInternal] = React.useState(defaultValue ?? undefined);
  const value = valueProp !== undefined ? (valueProp ?? undefined) : internal;
  const anchorOf = (v: MonthValue | MonthRange | null | undefined) => (v && 'from' in v ? v.from : (v ?? undefined));
  const anchor = anchorOf(value) ?? currentMonth();

  const [displayYear, setDisplayYear] = React.useState<number>(anchor.year);

  const controlledAnchorYear = anchorOf(valueProp)?.year;
  const [prevControlledAnchorYear, setPrevControlledAnchorYear] = React.useState(controlledAnchorYear);
  if (controlledAnchorYear !== prevControlledAnchorYear) {
    setPrevControlledAnchorYear(controlledAnchorYear);
    if (controlledAnchorYear !== undefined) setDisplayYear(controlledAnchorYear);
  }

  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setDisplayYear(anchor.year);
  }

  const setValue = React.useCallback(
    (v: MonthValue) => {
      const current = value as MonthRange | undefined;
      const next: MonthValue | MonthRange =
        mode === 'single'
          ? v
          : !current || current.to
            ? { from: v }
            : compareMonth(v, current.from) < 0
              ? { from: v, to: current.from }
              : { from: current.from, to: v };
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
      if (mode === 'single' || 'to' in next) setOpen(false);
    },
    [mode, value, valueProp, onValueChange, setOpen],
  );

  const ctx = React.useMemo(
    () =>
      ({ mode, value, setValue, min, max, locale, displayYear, setDisplayYear, disabled }) as MonthPickerContextValue,
    [mode, value, setValue, min, max, locale, displayYear, disabled],
  );

  return (
    <MonthPickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </MonthPickerContext.Provider>
  );
};

const formatMonthValue = (ctx: MonthPickerContextValue, placeholder: string, fmt: Intl.DateTimeFormat): string => {
  const label = (v: MonthValue) => fmt.format(new Date(v.year, v.month, 1));
  if (!ctx.value) return placeholder;
  if (ctx.mode === 'single') return label(ctx.value);

  return `${label(ctx.value.from)} – ${ctx.value.to ? label(ctx.value.to) : '…'}`;
};

const MonthPickerTrigger = ({
  placeholder = 'Pick a month',
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'button'>, 'children'> & {
  placeholder?: string;
  children?: React.ReactNode;
}) => {
  const ctx = useMonthPicker();
  const empty = ctx.value === undefined;
  const fmt = React.useMemo(
    () => new Intl.DateTimeFormat(ctx.locale, { month: 'short', year: 'numeric' }),
    [ctx.locale],
  );

  return (
    <PopoverTrigger
      render={
        <button
          type="button"
          disabled={ctx.disabled}
          data-slot="month-picker-trigger"
          className={cn(
            'inline-flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm tabular-nums transition-colors outline-none',
            'hover:border-ring/60 focus-visible:border-ring data-popup-open:border-ring',
            empty && 'text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
      }
    >
      {children ?? formatMonthValue(ctx, placeholder, fmt)}
    </PopoverTrigger>
  );
};

const isInRange = (v: MonthValue, range: MonthRange | undefined) => {
  if (!range || range.to === undefined) return false;

  return compareMonth(v, range.from) > 0 && compareMonth(v, range.to) < 0;
};

const isEndpoint = (v: MonthValue, range: MonthRange | undefined) =>
  !!range && (monthEq(v, range.from) || monthEq(v, range.to));

const MonthPickerContent = ({ className, ...props }: React.ComponentProps<typeof PopoverContent>) => {
  const ctx = useMonthPicker();
  const today = currentMonth();

  const labelsShort = React.useMemo(() => shortMonthLabels(ctx.locale), [ctx.locale]);
  const yearMonthFmt = React.useMemo(
    () => new Intl.DateTimeFormat(ctx.locale, { month: 'long', year: 'numeric' }),
    [ctx.locale],
  );

  const canPrev = ctx.displayYear - 1 >= ctx.min.year;
  const canNext = ctx.displayYear + 1 <= ctx.max.year;
  const inBounds = (v: MonthValue) => compareMonth(v, ctx.min) >= 0 && compareMonth(v, ctx.max) <= 0;

  const selectedMonth = ctx.mode === 'single' ? ctx.value : ctx.value?.from;
  const firstInBounds = Array.from({ length: 12 }, (_, month) => month).find((month) =>
    inBounds({ year: ctx.displayYear, month }),
  );
  const tabbableMonth =
    selectedMonth && selectedMonth.year === ctx.displayYear && inBounds(selectedMonth)
      ? selectedMonth.month
      : today.year === ctx.displayYear && inBounds(today)
        ? today.month
        : (firstInBounds ?? 0);

  const gridRef = React.useRef<HTMLDivElement>(null);
  const focusCell = (year: number, month: number) => {
    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-month-key="${year * 12 + month}"]`);
    el?.focus();
  };

  const handleKey = (e: React.KeyboardEvent, year: number, month: number) => {
    const forward = getComputedStyle(e.currentTarget).direction === 'rtl' ? -1 : 1;
    const delta = (
      {
        ArrowLeft: -forward,
        ArrowRight: forward,
        ArrowUp: -4,
        ArrowDown: 4,
        Home: -(month % 4),
        End: 3 - (month % 4),
        PageUp: -12,
        PageDown: 12,
      } as Record<string, number>
    )[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    const key = year * 12 + month + delta;
    const nextYear = Math.floor(key / 12);
    const nextMonth = key - nextYear * 12;
    // Past the first/last allowed month: stay put rather than wrap within the same year.
    if (!inBounds({ year: nextYear, month: nextMonth })) return;
    if (nextYear !== ctx.displayYear) {
      ctx.setDisplayYear(nextYear);
      requestAnimationFrame(() => focusCell(nextYear, nextMonth));
    } else {
      focusCell(nextYear, nextMonth);
    }
  };

  const navButton = (step: -1 | 1) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={step < 0 ? 'Previous year' : 'Next year'}
      disabled={step < 0 ? !canPrev : !canNext}
      onClick={() => ctx.setDisplayYear(ctx.displayYear + step)}
      className="size-7"
    >
      {step < 0 ? (
        <ChevronLeft className="size-3.5 rtl:rotate-180" />
      ) : (
        <ChevronRight className="size-3.5 rtl:rotate-180" />
      )}
    </Button>
  );

  return (
    <PopoverContent align="start" data-slot="month-picker-content" className={cn('w-64 p-3', className)} {...props}>
      <div data-slot="month-picker-header" className="mb-2 flex items-center justify-between">
        {navButton(-1)}
        <span data-slot="month-picker-caption" className="text-xs text-muted-foreground uppercase tabular-nums">
          {ctx.displayYear}
        </span>
        {navButton(1)}
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-label={`Months in ${ctx.displayYear}`}
        data-slot="month-picker-grid"
        className="grid gap-1"
      >
        {Array.from({ length: 3 }, (_, row) => (
          <div key={row} role="row" className="grid grid-cols-4 gap-1">
            {labelsShort.slice(row * 4, row * 4 + 4).map((label, col) => {
              const month = row * 4 + col;
              const v: MonthValue = { year: ctx.displayYear, month };
              const selected = ctx.mode === 'single' ? monthEq(ctx.value, v) : isEndpoint(v, ctx.value);
              const inRange = ctx.mode === 'range' ? isInRange(v, ctx.value) : false;
              const isToday = monthEq(today, v);

              return (
                <button
                  key={month}
                  type="button"
                  role="gridcell"
                  data-month-key={month + ctx.displayYear * 12}
                  data-slot="month-picker-cell"
                  disabled={!inBounds(v)}
                  aria-selected={selected || inRange}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={yearMonthFmt.format(new Date(ctx.displayYear, month, 1))}
                  onClick={() => ctx.setValue(v)}
                  onKeyDown={(e) => handleKey(e, ctx.displayYear, month)}
                  tabIndex={month === tabbableMonth ? 0 : -1}
                  className={cn(
                    'relative h-9 rounded-sm text-xs tabular-nums transition-colors outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:opacity-30 disabled:hover:bg-transparent',
                    inRange && 'bg-primary/15 text-foreground',
                    selected && 'bg-primary text-primary-foreground hover:bg-primary',
                    !selected && isToday && 'ring-1 ring-primary/60 ring-inset',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </PopoverContent>
  );
};

export { MonthPicker, MonthPickerTrigger, MonthPickerContent };
