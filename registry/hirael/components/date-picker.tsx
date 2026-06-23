"use client";

import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/hirael/ui/popover";
import {
  clampDate,
  gridKeyToDate,
  monthCells,
  monthIndex,
  sameDay,
  startOfDay,
} from "@/registry/hirael/components/calendar-utils";

export type DateCalendarProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  disabledDate?: (d: Date) => boolean;
  locale?: string;
  weekStartsOn?: 0 | 1;
  className?: string;
};

function DateCalendar({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  disabledDate,
  locale,
  weekStartsOn = 1,
  className,
}: DateCalendarProps) {
  const [internal, setInternal] = React.useState<Date | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;
  const today = startOfDay(new Date());

  const [viewMonth, setViewMonth] = React.useState<Date>(() => {
    const anchor = value ?? today;
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });

  const setValue = React.useCallback(
    (next: Date | null) => {
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

  const selected = value ? startOfDay(value) : null;

  const isMonthVisible = (d: Date) => monthIndex(d) === monthIndex(viewMonth);

  const canPrev =
    !min ||
    new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0).getTime() >=
      startOfDay(min).getTime();
  const canNext =
    !max ||
    new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1).getTime() <=
      startOfDay(max).getTime();

  const stepMonth = (n: number) =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1),
    );

  const rootRef = React.useRef<HTMLDivElement>(null);
  const focusDay = (d: Date) => {
    const doFocus = () => {
      rootRef.current
        ?.querySelector<HTMLButtonElement>(`[data-day="${d.getTime()}"]`)
        ?.focus();
    };
    if (!isMonthVisible(d)) {
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      requestAnimationFrame(doFocus);
    } else {
      doFocus();
    }
  };

  const handleKey = (e: React.KeyboardEvent, d: Date) => {
    const forward =
      getComputedStyle(e.currentTarget).direction === "rtl" ? -1 : 1;
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
    month: "long",
    year: "numeric",
  });
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const dayLabelFmt = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(2021, 7, 1 + ((weekStartsOn + i) % 7))),
  );

  const tabbable =
    selected && isMonthVisible(selected)
      ? selected
      : isMonthVisible(today)
        ? today
        : viewMonth;

  return (
    <div
      ref={rootRef}
      data-slot="date-picker-calendar"
      className={cn("w-60", className)}
    >
      <div
        data-slot="date-picker-calendar-header"
        className="mb-2 flex items-center justify-between"
      >
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
        <span className="font-mono text-[11px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
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
        className="grid grid-cols-7 gap-y-0.5"
      >
        {weekdays.map((label, i) => (
          <span
            key={i}
            data-slot="date-picker-calendar-weekday"
            className="flex h-7 items-center justify-center font-mono text-[10px] uppercase text-muted-foreground"
          >
            {label}
          </span>
        ))}
        {monthCells(viewMonth, weekStartsOn).map((d, i) => {
          if (!d) {
            return <span key={i} aria-hidden className="size-8" />;
          }
          const isSelected = sameDay(d, selected);
          const isToday = sameDay(d, today);
          const out = isDayDisabled(d);
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              data-day={d.getTime()}
              data-slot="date-picker-calendar-day"
              disabled={out}
              aria-selected={isSelected}
              aria-label={dayLabelFmt.format(d)}
              onClick={() => setValue(d)}
              onKeyDown={(e) => handleKey(e, d)}
              tabIndex={sameDay(d, tabbable) ? 0 : -1}
              className={cn(
                "relative size-8 rounded-sm font-mono text-xs tabular-nums outline-none transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-30 disabled:hover:bg-transparent",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary",
                !isSelected && isToday && "ring-1 ring-inset ring-primary/60",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type DatePickerContextValue = {
  value: Date | null;
  setValue: (date: Date | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
};

const DatePickerContext = React.createContext<DatePickerContextValue | null>(
  null,
);

function useDatePicker() {
  const ctx = React.useContext(DatePickerContext);
  if (!ctx) {
    throw new Error(
      "DatePicker compound components must be used inside <DatePicker>",
    );
  }
  return ctx;
}

export type DatePickerProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  children?: React.ReactNode;
};

function DatePicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  min,
  max,
  disabled,
  children,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = React.useState<Date | null>(
    defaultValue,
  );
  const value = valueProp !== undefined ? valueProp : internalValue;
  const setValue = React.useCallback(
    (next: Date | null) => {
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

  const ctx = React.useMemo<DatePickerContextValue>(
    () => ({ value, setValue, open, setOpen, min, max, disabled }),
    [value, setValue, open, setOpen, min, max, disabled],
  );

  return (
    <DatePickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </DatePickerContext.Provider>
  );
}

function DatePickerTrigger({
  placeholder = "Pick a date",
  locale,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  placeholder?: string;
  locale?: string;
  children?: React.ReactNode;
}) {
  const ctx = useDatePicker();
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={ctx.disabled}
        data-slot="date-picker-trigger"
        data-state={ctx.open ? "open" : "closed"}
        className={cn(
          "inline-flex h-9 w-full items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm font-mono tabular-nums outline-none transition-colors",
          "hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring",
          !ctx.value && "text-muted-foreground font-sans",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate">
          {children ?? (ctx.value ? fmt.format(ctx.value) : placeholder)}
        </span>
      </button>
    </PopoverTrigger>
  );
}

function DatePickerContent({
  locale,
  weekStartsOn,
  disabledDate,
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent> & {
  locale?: string;
  weekStartsOn?: 0 | 1;
  disabledDate?: (d: Date) => boolean;
}) {
  const ctx = useDatePicker();
  return (
    <PopoverContent
      align="start"
      data-slot="date-picker-content"
      className={cn("w-auto p-3", className)}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <DateCalendar
          value={ctx.value}
          onValueChange={(d) => {
            ctx.setValue(d);
            ctx.setOpen(false);
          }}
          min={ctx.min}
          max={ctx.max}
          disabledDate={disabledDate}
          locale={locale}
          weekStartsOn={weekStartsOn}
        />
        {ctx.value && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-slot="date-picker-clear"
              onClick={() => ctx.setValue(null)}
              className="h-7 gap-1 px-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
            >
              <X className="size-3" />
              Clear
            </Button>
          </div>
        )}
      </div>
    </PopoverContent>
  );
}

export { DatePicker, DatePickerTrigger, DatePickerContent, DateCalendar };
