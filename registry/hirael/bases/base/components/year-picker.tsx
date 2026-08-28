'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';

export interface YearRange {
  from: number;
  to?: number;
}
export type YearPickerMode = 'single' | 'range';

type YearPickerContextValue =
  | {
      mode: 'single';
      value: number | undefined;
      setValue: (year: number) => void;
      minYear: number;
      maxYear: number;
      decadeStart: number;
      setDecadeStart: (n: number) => void;
      open: boolean;
      setOpen: (open: boolean) => void;
      disabled?: boolean;
    }
  | {
      mode: 'range';
      value: YearRange | undefined;
      setValue: (year: number) => void;
      minYear: number;
      maxYear: number;
      decadeStart: number;
      setDecadeStart: (n: number) => void;
      open: boolean;
      setOpen: (open: boolean) => void;
      disabled?: boolean;
    };

const YearPickerContext = React.createContext<YearPickerContextValue | null>(null);

const useYearPicker = () => {
  const ctx = React.useContext(YearPickerContext);
  if (!ctx) {
    throw new Error('YearPicker compound components must be used inside <YearPicker>');
  }
  return ctx;
};

const YEARS_PER_VIEW = 12;

const viewStartFor = (year: number) => {
  const base = year - (year % 10);
  return base - 1;
};

export type YearPickerProps =
  | {
      mode?: 'single';
      value?: number;
      defaultValue?: number;
      onValueChange?: (year: number) => void;
      minYear?: number;
      maxYear?: number;
      disabled?: boolean;
      open?: boolean;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
      children?: React.ReactNode;
    }
  | {
      mode: 'range';
      value?: YearRange;
      defaultValue?: YearRange;
      onValueChange?: (range: YearRange) => void;
      minYear?: number;
      maxYear?: number;
      disabled?: boolean;
      open?: boolean;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
      children?: React.ReactNode;
    };

const YearPicker = (props: YearPickerProps) => {
  const {
    minYear = 1900,
    maxYear = 2100,
    disabled,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    children,
  } = props;
  const mode = props.mode ?? 'single';

  const singleValueProp =
    mode === 'single' ? (props as Extract<YearPickerProps, { mode?: 'single' }>).value : undefined;
  const singleDefaultValue =
    mode === 'single' ? (props as Extract<YearPickerProps, { mode?: 'single' }>).defaultValue : undefined;
  const singleOnValueChange =
    mode === 'single' ? (props as Extract<YearPickerProps, { mode?: 'single' }>).onValueChange : undefined;
  const rangeValueProp = mode === 'range' ? (props as Extract<YearPickerProps, { mode: 'range' }>).value : undefined;
  const rangeDefaultValue =
    mode === 'range' ? (props as Extract<YearPickerProps, { mode: 'range' }>).defaultValue : undefined;
  const rangeOnValueChange =
    mode === 'range' ? (props as Extract<YearPickerProps, { mode: 'range' }>).onValueChange : undefined;

  const [openInternal, setOpenInternal] = React.useState(defaultOpen);
  const open = openProp !== undefined ? openProp : openInternal;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInternal(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const [singleInternal, setSingleInternal] = React.useState<number | undefined>(singleDefaultValue);
  const [rangeInternal, setRangeInternal] = React.useState<YearRange | undefined>(rangeDefaultValue);

  const singleValue = mode === 'single' ? (singleValueProp ?? singleInternal) : undefined;
  const rangeValue = mode === 'range' ? (rangeValueProp ?? rangeInternal) : undefined;

  const anchorYear = (mode === 'single' ? singleValue : rangeValue?.from) ?? new Date().getFullYear();
  const [decadeStart, setDecadeStart] = React.useState<number>(viewStartFor(anchorYear));

  const controlledAnchorYear = mode === 'single' ? singleValueProp : rangeValueProp?.from;
  const [prevControlledAnchorYear, setPrevControlledAnchorYear] = React.useState(controlledAnchorYear);
  if (controlledAnchorYear !== prevControlledAnchorYear) {
    setPrevControlledAnchorYear(controlledAnchorYear);
    if (controlledAnchorYear !== undefined) {
      setDecadeStart(viewStartFor(controlledAnchorYear));
    }
  }

  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setDecadeStart(viewStartFor(anchorYear));
  }

  const setValueSingle = React.useCallback(
    (year: number) => {
      if (singleValueProp === undefined) setSingleInternal(year);
      singleOnValueChange?.(year);
      setOpen(false);
    },
    [singleValueProp, singleOnValueChange, setOpen],
  );

  const setValueRange = React.useCallback(
    (year: number) => {
      const current = rangeValueProp ?? rangeInternal;
      let next: YearRange;
      if (!current || (current.from && current.to)) {
        next = { from: year };
      } else if (year < current.from) {
        next = { from: year, to: current.from };
      } else {
        next = { from: current.from, to: year };
      }
      if (rangeValueProp === undefined) setRangeInternal(next);
      rangeOnValueChange?.(next);
      if (next.to !== undefined) setOpen(false);
    },
    [rangeValueProp, rangeOnValueChange, rangeInternal, setOpen],
  );

  const ctx = React.useMemo<YearPickerContextValue>(() => {
    if (mode === 'single') {
      return {
        mode: 'single',
        value: singleValue,
        setValue: setValueSingle,
        minYear,
        maxYear,
        decadeStart,
        setDecadeStart,
        open,
        setOpen,
        disabled,
      };
    }
    return {
      mode: 'range',
      value: rangeValue,
      setValue: setValueRange,
      minYear,
      maxYear,
      decadeStart,
      setDecadeStart,
      open,
      setOpen,
      disabled,
    };
  }, [
    mode,
    singleValue,
    rangeValue,
    setValueSingle,
    setValueRange,
    minYear,
    maxYear,
    decadeStart,
    open,
    setOpen,
    disabled,
  ]);

  return (
    <YearPickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </YearPickerContext.Provider>
  );
};

const formatYearValue = (ctx: YearPickerContextValue, placeholder: string) => {
  if (ctx.mode === 'single') return ctx.value ? String(ctx.value) : placeholder;
  if (!ctx.value) return placeholder;
  if (ctx.value.to === undefined) return `${ctx.value.from} – …`;
  return `${ctx.value.from} – ${ctx.value.to}`;
};

const YearPickerTrigger = ({
  placeholder = 'Pick a year',
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'button'>, 'children'> & {
  placeholder?: string;
  children?: React.ReactNode;
}) => {
  const ctx = useYearPicker();
  const empty = ctx.value === undefined;
  return (
    <PopoverTrigger
      render={
        <button
          type="button"
          disabled={ctx.disabled}
          data-slot="year-picker-trigger"
          data-state={ctx.open ? 'open' : 'closed'}
          className={cn(
            'inline-flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm font-mono tabular-nums outline-none transition-colors',
            'hover:border-ring/60 focus-visible:border-ring data-open:border-ring',
            empty && 'text-muted-foreground font-sans',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
      }
    >
      {children ?? formatYearValue(ctx, placeholder)}
    </PopoverTrigger>
  );
};

const isInRange = (year: number, range: YearRange | undefined) => {
  if (!range || range.to === undefined) return false;
  return year > range.from && year < range.to;
};

const isEndpoint = (year: number, range: YearRange | undefined) => {
  if (!range) return false;
  return year === range.from || year === range.to;
};

const YearPickerContent = ({ className, ...props }: React.ComponentProps<typeof PopoverContent>) => {
  const ctx = useYearPicker();
  const years = Array.from({ length: YEARS_PER_VIEW }, (_, i) => ctx.decadeStart + i);
  const today = new Date().getFullYear();

  const canPrev = ctx.decadeStart - YEARS_PER_VIEW >= ctx.minYear - 1;
  const canNext = ctx.decadeStart + YEARS_PER_VIEW <= ctx.maxYear + 1;

  const inBounds = (year: number) => year >= ctx.minYear && year <= ctx.maxYear;
  const selectedYear = ctx.mode === 'single' ? ctx.value : ctx.value?.from;
  const tabbableYear =
    selectedYear !== undefined && years.includes(selectedYear)
      ? selectedYear
      : years.includes(today) && inBounds(today)
        ? today
        : (years.find(inBounds) ?? years[0]);

  const gridRef = React.useRef<HTMLDivElement>(null);
  const focusYear = (year: number) => {
    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-year="${year}"]`);
    el?.focus();
  };

  const handleKey = (e: React.KeyboardEvent, year: number) => {
    const forward = getComputedStyle(e.currentTarget).direction === 'rtl' ? -1 : 1;
    let next = year;
    switch (e.key) {
      case 'ArrowLeft':
        next = year - forward;
        break;
      case 'ArrowRight':
        next = year + forward;
        break;
      case 'ArrowUp':
        next = year - 4;
        break;
      case 'ArrowDown':
        next = year + 4;
        break;
      case 'Home':
        next = year - ((year - ctx.decadeStart) % 4);
        break;
      case 'End':
        next = year + (3 - ((year - ctx.decadeStart) % 4));
        break;
      case 'PageUp':
        ctx.setDecadeStart(ctx.decadeStart - YEARS_PER_VIEW);
        return;
      case 'PageDown':
        ctx.setDecadeStart(ctx.decadeStart + YEARS_PER_VIEW);
        return;
      default:
        return;
    }
    e.preventDefault();
    next = Math.max(ctx.minYear, Math.min(ctx.maxYear, next));
    if (next < ctx.decadeStart || next >= ctx.decadeStart + YEARS_PER_VIEW) {
      ctx.setDecadeStart(viewStartFor(next));
      requestAnimationFrame(() => focusYear(next));
    } else {
      focusYear(next);
    }
  };

  return (
    <PopoverContent align="start" data-slot="year-picker-content" className={cn('w-64 p-3', className)} {...props}>
      <div data-slot="year-picker-header" className="mb-2 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous years"
          disabled={!canPrev}
          onClick={() => ctx.setDecadeStart(ctx.decadeStart - YEARS_PER_VIEW)}
          className="size-7"
        >
          <ChevronLeft className="size-3.5 rtl:rotate-180" />
        </Button>
        <span
          data-slot="year-picker-caption"
          className="font-mono text-[11px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground"
        >
          {years[0]} – {years[years.length - 1]}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next years"
          disabled={!canNext}
          onClick={() => ctx.setDecadeStart(ctx.decadeStart + YEARS_PER_VIEW)}
          className="size-7"
        >
          <ChevronRight className="size-3.5 rtl:rotate-180" />
        </Button>
      </div>
      <div ref={gridRef} role="grid" aria-label="Years" data-slot="year-picker-grid" className="grid gap-1">
        {Array.from({ length: YEARS_PER_VIEW / 4 }, (_, row) => (
          <div key={row} role="row" className="grid grid-cols-4 gap-1">
            {years.slice(row * 4, row * 4 + 4).map((year) => {
              const out = !inBounds(year);
              const selected = ctx.mode === 'single' ? ctx.value === year : isEndpoint(year, ctx.value);
              const inRange = ctx.mode === 'range' ? isInRange(year, ctx.value) : false;
              const isToday = year === today;
              return (
                <button
                  key={year}
                  type="button"
                  role="gridcell"
                  data-year={year}
                  data-slot="year-picker-cell"
                  disabled={out}
                  aria-selected={selected || inRange}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => ctx.setValue(year)}
                  onKeyDown={(e) => handleKey(e, year)}
                  tabIndex={year === tabbableYear ? 0 : -1}
                  className={cn(
                    'relative h-9 rounded-sm font-mono text-xs tabular-nums outline-none transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:opacity-30 disabled:hover:bg-transparent',
                    inRange && 'bg-primary/15 text-foreground',
                    selected && 'bg-primary text-primary-foreground hover:bg-primary',
                    !selected && isToday && 'ring-1 ring-inset ring-primary/60',
                  )}
                >
                  {year}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </PopoverContent>
  );
};

export { YearPicker, YearPickerTrigger, YearPickerContent };
