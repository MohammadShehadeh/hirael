'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';

export interface YearRange {
  from: number;
  to?: number;
}
export type YearPickerMode = 'single' | 'range';

interface YearPickerSharedContext {
  setValue: (year: number) => void;
  minYear: number;
  maxYear: number;
  decadeStart: number;
  setDecadeStart: (n: number) => void;
  disabled?: boolean;
}

type YearPickerContextValue =
  | (YearPickerSharedContext & { mode: 'single'; value: number | undefined })
  | (YearPickerSharedContext & { mode: 'range'; value: YearRange | undefined });

const YearPickerContext = React.createContext<YearPickerContextValue | null>(null);

const useYearPicker = () => {
  const ctx = React.useContext(YearPickerContext);
  if (!ctx) {
    throw new Error('YearPicker compound components must be used inside <YearPicker>');
  }

  return ctx;
};

const YEARS_PER_VIEW = 12;
// Each view is a decade plus one year either side, so paging steps a decade and views stay aligned.
const YEARS_PER_PAGE = 10;

const viewStartFor = (year: number) => year - (year % 10) - 1;

interface YearPickerSharedProps {
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/** `null` and `undefined` both mean no selection; `value={null}` stays controlled. */
export type YearPickerProps =
  | (YearPickerSharedProps & {
      mode?: 'single';
      value?: number | null;
      defaultValue?: number | null;
      onValueChange?: (year: number) => void;
    })
  | (YearPickerSharedProps & {
      mode: 'range';
      value?: YearRange | null;
      defaultValue?: YearRange | null;
      onValueChange?: (range: YearRange) => void;
    });

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
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
  } = props as {
    value?: number | YearRange | null;
    defaultValue?: number | YearRange | null;
    onValueChange?: (v: number | YearRange) => void;
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

  const [internal, setInternal] = React.useState(defaultValue ?? undefined);
  const value = valueProp !== undefined ? (valueProp ?? undefined) : internal;
  const anchorOf = (v: number | YearRange | null | undefined) =>
    typeof v === 'object' && v ? v.from : (v ?? undefined);
  const anchorYear = anchorOf(value) ?? new Date().getFullYear();
  const [decadeStart, setDecadeStart] = React.useState<number>(viewStartFor(anchorYear));

  const controlledAnchorYear = anchorOf(valueProp);
  const [prevControlledAnchorYear, setPrevControlledAnchorYear] = React.useState(controlledAnchorYear);
  if (controlledAnchorYear !== prevControlledAnchorYear) {
    setPrevControlledAnchorYear(controlledAnchorYear);
    if (controlledAnchorYear !== undefined) setDecadeStart(viewStartFor(controlledAnchorYear));
  }

  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setDecadeStart(viewStartFor(anchorYear));
  }

  const setValue = React.useCallback(
    (year: number) => {
      const current = value as YearRange | undefined;
      const next: number | YearRange =
        mode === 'single'
          ? year
          : !current || current.to !== undefined
            ? { from: year }
            : year < current.from
              ? { from: year, to: current.from }
              : { from: current.from, to: year };
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
      if (mode === 'single' || (next as YearRange).to !== undefined) setOpen(false);
    },
    [mode, value, valueProp, onValueChange, setOpen],
  );

  const ctx = React.useMemo(
    () =>
      ({ mode, value, setValue, minYear, maxYear, decadeStart, setDecadeStart, disabled }) as YearPickerContextValue,
    [mode, value, setValue, minYear, maxYear, decadeStart, setDecadeStart, disabled],
  );

  return (
    <YearPickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </YearPickerContext.Provider>
  );
};

const formatYearValue = (ctx: YearPickerContextValue, placeholder: string) => {
  if (ctx.value === undefined) return placeholder;
  if (ctx.mode === 'single') return String(ctx.value);

  return `${ctx.value.from} – ${ctx.value.to ?? '…'}`;
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
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={ctx.disabled}
        data-slot="year-picker-trigger"
        className={cn(
          'inline-flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm tabular-nums transition-colors outline-none',
          'hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring',
          empty && 'text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children ?? formatYearValue(ctx, placeholder)}
      </button>
    </PopoverTrigger>
  );
};

const isInRange = (year: number, range: YearRange | undefined) =>
  !!range && range.to !== undefined && year > range.from && year < range.to;

const isEndpoint = (year: number, range: YearRange | undefined) =>
  !!range && (year === range.from || year === range.to);

const YearPickerContent = ({ className, ...props }: React.ComponentProps<typeof PopoverContent>) => {
  const ctx = useYearPicker();
  const years = Array.from({ length: YEARS_PER_VIEW }, (_, i) => ctx.decadeStart + i);
  const today = new Date().getFullYear();

  // Page only while the neighbouring view still holds a selectable year.
  const canPrev = ctx.decadeStart > ctx.minYear;
  const canNext = ctx.decadeStart + YEARS_PER_VIEW <= ctx.maxYear;

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
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-year="${year}"]`)?.focus();
  };

  const handleKey = (e: React.KeyboardEvent, year: number) => {
    const forward = getComputedStyle(e.currentTarget).direction === 'rtl' ? -1 : 1;
    const column = (year - ctx.decadeStart) % 4;
    const delta = (
      { ArrowLeft: -forward, ArrowRight: forward, ArrowUp: -4, ArrowDown: 4, Home: -column, End: 3 - column } as Record<
        string,
        number
      >
    )[e.key];
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      const up = e.key === 'PageUp';
      // Same step as the header buttons; at the edge, stay on this view and move to its last selectable year.
      const pageable = up ? canPrev : canNext;
      const start = pageable ? ctx.decadeStart + (up ? -YEARS_PER_PAGE : YEARS_PER_PAGE) : ctx.decadeStart;
      const lo = Math.max(ctx.minYear, start);
      const hi = Math.min(ctx.maxYear, start + YEARS_PER_VIEW - 1);
      const target = Math.max(lo, Math.min(hi, year + (up ? -YEARS_PER_PAGE : YEARS_PER_PAGE)));
      if (start === ctx.decadeStart) {
        focusYear(target);

        return;
      }
      ctx.setDecadeStart(start);
      // The focused cell unmounts with the old view; refocus once the new one renders.
      requestAnimationFrame(() => focusYear(target));

      return;
    }
    if (delta === undefined) return;
    e.preventDefault();
    const next = Math.max(ctx.minYear, Math.min(ctx.maxYear, year + delta));
    if (next < ctx.decadeStart || next >= ctx.decadeStart + YEARS_PER_VIEW) {
      ctx.setDecadeStart(viewStartFor(next));
      requestAnimationFrame(() => focusYear(next));
    } else {
      focusYear(next);
    }
  };

  const navButton = (step: -1 | 1) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={step < 0 ? 'Previous years' : 'Next years'}
      disabled={step < 0 ? !canPrev : !canNext}
      onClick={() => ctx.setDecadeStart(ctx.decadeStart + step * YEARS_PER_PAGE)}
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
    <PopoverContent align="start" data-slot="year-picker-content" className={cn('w-64 p-3', className)} {...props}>
      <div data-slot="year-picker-header" className="mb-2 flex items-center justify-between">
        {navButton(-1)}
        <span data-slot="year-picker-caption" className="text-xs text-muted-foreground uppercase tabular-nums">
          {years[0]} – {years[years.length - 1]}
        </span>
        {navButton(1)}
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
                    'relative h-9 rounded-sm text-xs tabular-nums transition-colors outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:opacity-30 disabled:hover:bg-transparent',
                    inRange && 'bg-primary/15 text-foreground',
                    selected && 'bg-primary text-primary-foreground hover:bg-primary',
                    !selected && isToday && 'ring-1 ring-primary/60 ring-inset',
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
