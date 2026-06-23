"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/hirael/ui/popover";

export type MonthValue = { year: number; month: number };
export type MonthRange = { from: MonthValue; to?: MonthValue };
export type MonthPickerMode = "single" | "range";

type MonthPickerContextValue =
  | {
      mode: "single";
      value: MonthValue | undefined;
      setValue: (v: MonthValue) => void;
      minYear: number;
      maxYear: number;
      displayYear: number;
      setDisplayYear: (n: number) => void;
      open: boolean;
      setOpen: (open: boolean) => void;
      disabled?: boolean;
    }
  | {
      mode: "range";
      value: MonthRange | undefined;
      setValue: (v: MonthValue) => void;
      minYear: number;
      maxYear: number;
      displayYear: number;
      setDisplayYear: (n: number) => void;
      open: boolean;
      setOpen: (open: boolean) => void;
      disabled?: boolean;
    };

const MonthPickerContext = React.createContext<MonthPickerContextValue | null>(
  null,
);

function useMonthPicker() {
  const ctx = React.useContext(MonthPickerContext);
  if (!ctx) {
    throw new Error(
      "MonthPicker compound components must be used inside <MonthPicker>",
    );
  }
  return ctx;
}

const MONTH_LABELS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_LABELS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthKey(v: MonthValue) {
  return v.year * 12 + v.month;
}

function compareMonth(a: MonthValue, b: MonthValue) {
  return monthKey(a) - monthKey(b);
}

function monthEq(a: MonthValue | undefined, b: MonthValue | undefined) {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month;
}

export type MonthPickerProps =
  | {
      mode?: "single";
      value?: MonthValue;
      defaultValue?: MonthValue;
      onValueChange?: (v: MonthValue) => void;
      minYear?: number;
      maxYear?: number;
      disabled?: boolean;
      open?: boolean;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
      children?: React.ReactNode;
    }
  | {
      mode: "range";
      value?: MonthRange;
      defaultValue?: MonthRange;
      onValueChange?: (range: MonthRange) => void;
      minYear?: number;
      maxYear?: number;
      disabled?: boolean;
      open?: boolean;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
      children?: React.ReactNode;
    };

function MonthPicker(props: MonthPickerProps) {
  const {
    minYear = 1900,
    maxYear = 2100,
    disabled,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    children,
  } = props;
  const mode = props.mode ?? "single";

  const singleValueProp =
    mode === "single"
      ? (props as Extract<MonthPickerProps, { mode?: "single" }>).value
      : undefined;
  const singleDefaultValue =
    mode === "single"
      ? (props as Extract<MonthPickerProps, { mode?: "single" }>).defaultValue
      : undefined;
  const singleOnValueChange =
    mode === "single"
      ? (props as Extract<MonthPickerProps, { mode?: "single" }>).onValueChange
      : undefined;
  const rangeValueProp =
    mode === "range"
      ? (props as Extract<MonthPickerProps, { mode: "range" }>).value
      : undefined;
  const rangeDefaultValue =
    mode === "range"
      ? (props as Extract<MonthPickerProps, { mode: "range" }>).defaultValue
      : undefined;
  const rangeOnValueChange =
    mode === "range"
      ? (props as Extract<MonthPickerProps, { mode: "range" }>).onValueChange
      : undefined;

  const [openInternal, setOpenInternal] = React.useState(defaultOpen);
  const open = openProp ?? openInternal;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInternal(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const [singleInternal, setSingleInternal] = React.useState<
    MonthValue | undefined
  >(singleDefaultValue);
  const [rangeInternal, setRangeInternal] = React.useState<
    MonthRange | undefined
  >(rangeDefaultValue);

  const singleValue =
    mode === "single" ? (singleValueProp ?? singleInternal) : undefined;
  const rangeValue =
    mode === "range" ? (rangeValueProp ?? rangeInternal) : undefined;

  const anchor =
    (mode === "single" ? singleValue : rangeValue?.from) ??
    (() => {
      const d = new Date();
      return { year: d.getFullYear(), month: d.getMonth() };
    })();

  const [displayYear, setDisplayYear] = React.useState<number>(anchor.year);

  const setValueSingle = React.useCallback(
    (v: MonthValue) => {
      if (singleValueProp === undefined) setSingleInternal(v);
      singleOnValueChange?.(v);
      setOpen(false);
    },
    [singleValueProp, singleOnValueChange, setOpen],
  );

  const setValueRange = React.useCallback(
    (v: MonthValue) => {
      const current = rangeValueProp ?? rangeInternal;
      let next: MonthRange;
      if (!current || (current.from && current.to)) {
        next = { from: v };
      } else if (compareMonth(v, current.from) < 0) {
        next = { from: v, to: current.from };
      } else {
        next = { from: current.from, to: v };
      }
      if (rangeValueProp === undefined) setRangeInternal(next);
      rangeOnValueChange?.(next);
      if (next.to !== undefined) setOpen(false);
    },
    [rangeValueProp, rangeOnValueChange, rangeInternal, setOpen],
  );

  const ctx = React.useMemo<MonthPickerContextValue>(() => {
    if (mode === "single") {
      return {
        mode: "single",
        value: singleValue,
        setValue: setValueSingle,
        minYear,
        maxYear,
        displayYear,
        setDisplayYear,
        open,
        setOpen,
        disabled,
      };
    }
    return {
      mode: "range",
      value: rangeValue,
      setValue: setValueRange,
      minYear,
      maxYear,
      displayYear,
      setDisplayYear,
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
    displayYear,
    open,
    setOpen,
    disabled,
  ]);

  return (
    <MonthPickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </MonthPickerContext.Provider>
  );
}

function formatMonthValue(
  ctx: MonthPickerContextValue,
  placeholder: string,
): string {
  if (ctx.mode === "single") {
    if (!ctx.value) return placeholder;
    return `${MONTH_LABELS_SHORT[ctx.value.month]} ${ctx.value.year}`;
  }
  if (!ctx.value) return placeholder;
  const fromStr = `${MONTH_LABELS_SHORT[ctx.value.from.month]} ${ctx.value.from.year}`;
  if (!ctx.value.to) return `${fromStr} – …`;
  const toStr = `${MONTH_LABELS_SHORT[ctx.value.to.month]} ${ctx.value.to.year}`;
  return `${fromStr} – ${toStr}`;
}

function MonthPickerTrigger({
  placeholder = "Pick a month",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  placeholder?: string;
  children?: React.ReactNode;
}) {
  const ctx = useMonthPicker();
  const empty = ctx.value === undefined;
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={ctx.disabled}
        data-slot="month-picker-trigger"
        data-state={ctx.open ? "open" : "closed"}
        className={cn(
          "inline-flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm font-mono tabular-nums outline-none transition-colors",
          "hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring",
          empty && "text-muted-foreground font-sans",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children ?? formatMonthValue(ctx, placeholder)}
      </button>
    </PopoverTrigger>
  );
}

function isInRange(v: MonthValue, range: MonthRange | undefined) {
  if (!range || range.to === undefined) return false;
  return compareMonth(v, range.from) > 0 && compareMonth(v, range.to) < 0;
}

function isEndpoint(v: MonthValue, range: MonthRange | undefined) {
  if (!range) return false;
  return monthEq(v, range.from) || monthEq(v, range.to);
}

function MonthPickerContent({
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const ctx = useMonthPicker();
  const today = (() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  })();

  const canPrev = ctx.displayYear - 1 >= ctx.minYear;
  const canNext = ctx.displayYear + 1 <= ctx.maxYear;

  const gridRef = React.useRef<HTMLDivElement>(null);
  const focusCell = (year: number, month: number) => {
    const el = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-month-key="${year * 12 + month}"]`,
    );
    el?.focus();
  };

  const handleKey = (e: React.KeyboardEvent, year: number, month: number) => {
    const forward =
      getComputedStyle(e.currentTarget).direction === "rtl" ? -1 : 1;
    let nextYear = year;
    let nextMonth = month;
    switch (e.key) {
      case "ArrowLeft":
        nextMonth = month - forward;
        break;
      case "ArrowRight":
        nextMonth = month + forward;
        break;
      case "ArrowUp":
        nextMonth = month - 4;
        break;
      case "ArrowDown":
        nextMonth = month + 4;
        break;
      case "PageUp":
        ctx.setDisplayYear(Math.max(ctx.minYear, year - 1));
        return;
      case "PageDown":
        ctx.setDisplayYear(Math.min(ctx.maxYear, year + 1));
        return;
      default:
        return;
    }
    e.preventDefault();
    while (nextMonth < 0) {
      nextMonth += 12;
      nextYear -= 1;
    }
    while (nextMonth > 11) {
      nextMonth -= 12;
      nextYear += 1;
    }
    nextYear = Math.max(ctx.minYear, Math.min(ctx.maxYear, nextYear));
    if (nextYear !== ctx.displayYear) {
      ctx.setDisplayYear(nextYear);
      requestAnimationFrame(() => focusCell(nextYear, nextMonth));
    } else {
      focusCell(nextYear, nextMonth);
    }
  };

  return (
    <PopoverContent
      align="start"
      data-slot="month-picker-content"
      className={cn("w-64 p-3", className)}
      {...props}
    >
      <div className="mb-2 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous year"
          disabled={!canPrev}
          onClick={() => ctx.setDisplayYear(ctx.displayYear - 1)}
          className="size-7"
        >
          <ChevronLeft className="size-3.5 rtl:rotate-180" />
        </Button>
        <span className="font-mono text-[11px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
          {ctx.displayYear}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next year"
          disabled={!canNext}
          onClick={() => ctx.setDisplayYear(ctx.displayYear + 1)}
          className="size-7"
        >
          <ChevronRight className="size-3.5 rtl:rotate-180" />
        </Button>
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-label={`Months in ${ctx.displayYear}`}
        className="grid grid-cols-4 gap-1"
      >
        {MONTH_LABELS_SHORT.map((label, month) => {
          const v: MonthValue = { year: ctx.displayYear, month };
          const out =
            ctx.displayYear < ctx.minYear || ctx.displayYear > ctx.maxYear;
          const selected =
            ctx.mode === "single"
              ? monthEq(ctx.value, v)
              : isEndpoint(v, ctx.value);
          const inRange =
            ctx.mode === "range" ? isInRange(v, ctx.value) : false;
          const isToday = monthEq(today, v);
          return (
            <button
              key={month}
              type="button"
              role="gridcell"
              data-month-key={month + ctx.displayYear * 12}
              disabled={out}
              aria-selected={selected || inRange}
              aria-label={`${MONTH_LABELS_LONG[month]} ${ctx.displayYear}`}
              onClick={() => ctx.setValue(v)}
              onKeyDown={(e) => handleKey(e, ctx.displayYear, month)}
              tabIndex={selected || (isToday && !selected) ? 0 : -1}
              className={cn(
                "relative h-9 rounded-sm font-mono text-xs tabular-nums outline-none transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-30 disabled:hover:bg-transparent",
                inRange && "bg-primary/15 text-foreground",
                selected &&
                  "bg-primary text-primary-foreground hover:bg-primary",
                !selected && isToday && "ring-1 ring-inset ring-primary/60",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </PopoverContent>
  );
}

export { MonthPicker, MonthPickerTrigger, MonthPickerContent };
