"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/hirael/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/hirael/ui/popover"
import { Separator } from "@/registry/hirael/ui/separator"

export type DateRange = { from?: Date; to?: Date }
export type DateRangePreset = {
  label: string
  range: () => { from: Date; to: Date }
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function sameDay(a: Date | undefined, b: Date | undefined) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

function addMonthsClamped(d: Date, n: number) {
  const y = d.getFullYear()
  const m = d.getMonth() + n
  const last = new Date(y, m + 1, 0).getDate()
  return new Date(y, m, Math.min(d.getDate(), last))
}

function monthIndex(d: Date) {
  return d.getFullYear() * 12 + d.getMonth()
}

function monthCells(month: Date, weekStartsOn: 0 | 1) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const lead = (first.getDay() - weekStartsOn + 7) % 7
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let day = 1; day <= count; day++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: "Today",
    range: () => {
      const t = startOfDay(new Date())
      return { from: t, to: t }
    },
  },
  {
    label: "Last 7 days",
    range: () => {
      const t = startOfDay(new Date())
      return { from: addDays(t, -6), to: t }
    },
  },
  {
    label: "Last 14 days",
    range: () => {
      const t = startOfDay(new Date())
      return { from: addDays(t, -13), to: t }
    },
  },
  {
    label: "Last 30 days",
    range: () => {
      const t = startOfDay(new Date())
      return { from: addDays(t, -29), to: t }
    },
  },
  {
    label: "This month",
    range: () => {
      const t = new Date()
      return {
        from: new Date(t.getFullYear(), t.getMonth(), 1),
        to: new Date(t.getFullYear(), t.getMonth() + 1, 0),
      }
    },
  },
  {
    label: "Last month",
    range: () => {
      const t = new Date()
      return {
        from: new Date(t.getFullYear(), t.getMonth() - 1, 1),
        to: new Date(t.getFullYear(), t.getMonth(), 0),
      }
    },
  },
]

export type DateRangeCalendarProps = {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  min?: Date
  max?: Date
  disabledDate?: (d: Date) => boolean
  locale?: string
  weekStartsOn?: 0 | 1
  numberOfMonths?: 1 | 2
  className?: string
}

function DateRangeCalendar({
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
}: DateRangeCalendarProps) {
  const [internal, setInternal] = React.useState<DateRange | undefined>(
    defaultValue
  )
  const range = valueProp ?? internal
  const today = startOfDay(new Date())

  const [viewMonth, setViewMonth] = React.useState<Date>(() => {
    const anchor = range?.from ?? today
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  })
  const [hovered, setHovered] = React.useState<Date | null>(null)

  const pending = !!range?.from && !range?.to

  const setRange = React.useCallback(
    (next: DateRange | undefined) => {
      if (valueProp === undefined) setInternal(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const isDayDisabled = React.useCallback(
    (d: Date) => {
      if (min && d.getTime() < startOfDay(min).getTime()) return true
      if (max && d.getTime() > startOfDay(max).getTime()) return true
      return disabledDate ? disabledDate(d) : false
    },
    [min, max, disabledDate]
  )

  const selectDay = (d: Date) => {
    if (!range?.from || range.to) {
      setRange({ from: d })
      return
    }
    setHovered(null)
    if (d.getTime() < startOfDay(range.from).getTime()) {
      setRange({ from: d, to: startOfDay(range.from) })
    } else {
      setRange({ from: startOfDay(range.from), to: d })
    }
  }

  const fromDay = range?.from ? startOfDay(range.from) : undefined
  const toDay = range?.to ? startOfDay(range.to) : undefined
  const previewing = pending && !!hovered && !!fromDay
  const lo = previewing
    ? hovered.getTime() < fromDay.getTime()
      ? hovered
      : fromDay
    : fromDay
  const hi = previewing
    ? hovered.getTime() < fromDay.getTime()
      ? fromDay
      : hovered
    : toDay
  const hasSpan = !!lo && !!hi && !sameDay(lo, hi)

  const months = Array.from({ length: numberOfMonths }, (_, i) =>
    new Date(viewMonth.getFullYear(), viewMonth.getMonth() + i, 1)
  )

  const isMonthVisible = (d: Date) => {
    const k = monthIndex(d)
    const v = monthIndex(viewMonth)
    return k >= v && k < v + numberOfMonths
  }

  const canPrev =
    !min ||
    new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0).getTime() >=
      startOfDay(min).getTime()
  const canNext =
    !max ||
    new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + numberOfMonths,
      1
    ).getTime() <= startOfDay(max).getTime()

  const stepMonth = (n: number) =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1)
    )

  const rootRef = React.useRef<HTMLDivElement>(null)
  const focusDay = (d: Date) => {
    const doFocus = () => {
      rootRef.current
        ?.querySelector<HTMLButtonElement>(`[data-day="${d.getTime()}"]`)
        ?.focus()
    }
    if (!isMonthVisible(d)) {
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1))
      requestAnimationFrame(doFocus)
    } else {
      doFocus()
    }
  }

  const handleKey = (e: React.KeyboardEvent, d: Date) => {
    const forward =
      getComputedStyle(e.currentTarget).direction === "rtl" ? -1 : 1
    const dow = (d.getDay() - weekStartsOn + 7) % 7
    let next: Date
    switch (e.key) {
      case "ArrowLeft":
        next = addDays(d, -forward)
        break
      case "ArrowRight":
        next = addDays(d, forward)
        break
      case "ArrowUp":
        next = addDays(d, -7)
        break
      case "ArrowDown":
        next = addDays(d, 7)
        break
      case "Home":
        next = addDays(d, -dow)
        break
      case "End":
        next = addDays(d, 6 - dow)
        break
      case "PageUp":
        next = addMonthsClamped(d, e.shiftKey ? -12 : -1)
        break
      case "PageDown":
        next = addMonthsClamped(d, e.shiftKey ? 12 : 1)
        break
      default:
        return
    }
    e.preventDefault()
    if (min && next.getTime() < startOfDay(min).getTime()) {
      next = startOfDay(min)
    }
    if (max && next.getTime() > startOfDay(max).getTime()) {
      next = startOfDay(max)
    }
    focusDay(next)
  }

  const monthFmt = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  })
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const dayLabelFmt = new Intl.DateTimeFormat(locale, { dateStyle: "full" })
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(2021, 7, 1 + ((weekStartsOn + i) % 7)))
  )

  const tabbable =
    range?.from && isMonthVisible(range.from)
      ? startOfDay(range.from)
      : isMonthVisible(today)
        ? today
        : viewMonth

  return (
    <div
      ref={rootRef}
      data-slot="date-range-calendar"
      className={cn("flex gap-4", className)}
    >
      {months.map((month, mi) => {
        const last = mi === numberOfMonths - 1
        return (
          <div
            key={monthIndex(month)}
            data-slot="date-range-calendar-month"
            className={cn("w-60", mi > 0 && "max-sm:hidden")}
          >
            <div
              data-slot="date-range-calendar-header"
              className="mb-2 flex items-center justify-between"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Previous month"
                disabled={!canPrev}
                onClick={() => stepMonth(-1)}
                className={cn("size-7", mi > 0 && "invisible")}
              >
                <ChevronLeft className="size-3.5 rtl:rotate-180" />
              </Button>
              <span className="font-mono text-[11px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
                {monthFmt.format(month)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next month"
                disabled={!canNext}
                onClick={() => stepMonth(1)}
                className={cn(
                  "size-7",
                  !last && numberOfMonths === 2 && "sm:invisible"
                )}
              >
                <ChevronRight className="size-3.5 rtl:rotate-180" />
              </Button>
            </div>
            <div
              role="grid"
              aria-label={monthFmt.format(month)}
              data-slot="date-range-calendar-grid"
              className="grid grid-cols-7 gap-y-0.5"
              onMouseLeave={() => setHovered(null)}
            >
              {weekdays.map((label, i) => (
                <span
                  key={i}
                  data-slot="date-range-calendar-weekday"
                  className="flex h-7 items-center justify-center font-mono text-[10px] uppercase text-muted-foreground"
                >
                  {label}
                </span>
              ))}
              {monthCells(month, weekStartsOn).map((d, i) => {
                if (!d) {
                  return <span key={i} aria-hidden className="size-8" />
                }
                const t = d.getTime()
                const isLo = !!lo && sameDay(d, lo)
                const isHi = !!hi && sameDay(d, hi)
                const isBetween =
                  !!lo && !!hi && t > lo.getTime() && t < hi.getTime()
                const isAnchor =
                  sameDay(d, range?.from) || sameDay(d, range?.to)
                const isToday = sameDay(d, today)
                const out = isDayDisabled(d)
                return (
                  <button
                    key={i}
                    type="button"
                    role="gridcell"
                    data-day={t}
                    data-slot="date-range-calendar-day"
                    disabled={out}
                    aria-selected={isAnchor || isBetween}
                    aria-label={dayLabelFmt.format(d)}
                    onClick={() => selectDay(d)}
                    onKeyDown={(e) => handleKey(e, d)}
                    onMouseEnter={() => pending && setHovered(d)}
                    onFocus={() => pending && setHovered(d)}
                    tabIndex={sameDay(d, tabbable) ? 0 : -1}
                    className={cn(
                      "relative size-8 rounded-sm font-mono text-xs tabular-nums outline-none transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      "disabled:opacity-30 disabled:hover:bg-transparent",
                      isBetween &&
                        "rounded-none bg-accent text-accent-foreground",
                      (isLo || isHi) &&
                        !isAnchor &&
                        "bg-accent text-accent-foreground",
                      isAnchor &&
                        "bg-primary text-primary-foreground hover:bg-primary",
                      isLo && hasSpan && "rounded-e-none",
                      isHi && hasSpan && "rounded-s-none",
                      !isAnchor && isToday && "ring-1 ring-inset ring-primary/60"
                    )}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export type DateRangePickerProps = Omit<DateRangeCalendarProps, "className"> & {
  presets?: DateRangePreset[]
  showPresets?: boolean
  placeholder?: string
  disabled?: boolean
  align?: React.ComponentProps<typeof PopoverContent>["align"]
  className?: string
}

function DateRangePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  presets = DEFAULT_PRESETS,
  showPresets = true,
  placeholder = "Pick a date range",
  disabled,
  align = "start",
  locale,
  className,
  ...calendarProps
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internal, setInternal] = React.useState<DateRange | undefined>(
    defaultValue
  )
  const range = valueProp ?? internal

  const setRange = (next: DateRange | undefined) => {
    if (valueProp === undefined) setInternal(next)
    onValueChange?.(next)
  }

  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" })
  const label = range?.from
    ? range.to
      ? `${fmt.format(range.from)} – ${fmt.format(range.to)}`
      : `${fmt.format(range.from)} – …`
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-slot="date-range-picker-trigger"
          data-state={open ? "open" : "closed"}
          className={cn(
            "inline-flex h-9 w-full items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm font-mono tabular-nums outline-none transition-colors",
            "hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring",
            !range?.from && "text-muted-foreground font-sans",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        data-slot="date-range-picker-content"
        className="w-auto p-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {showPresets && presets.length > 0 && (
            <>
              <div
                data-slot="date-range-picker-presets"
                className="flex flex-row flex-wrap gap-0.5 sm:w-32 sm:flex-col"
              >
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    data-slot="date-range-picker-preset"
                    onClick={() => {
                      const next = preset.range()
                      setRange({
                        from: startOfDay(next.from),
                        to: startOfDay(next.to),
                      })
                      setOpen(false)
                    }}
                    className={cn(
                      "rounded-sm px-2 py-1.5 text-start text-xs outline-none transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <Separator
                orientation="vertical"
                className="max-sm:hidden h-auto"
              />
              <Separator className="sm:hidden" />
            </>
          )}
          <div className="flex flex-col gap-2">
            <DateRangeCalendar
              value={range ?? {}}
              onValueChange={setRange}
              locale={locale}
              {...calendarProps}
            />
            {range?.from && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  data-slot="date-range-picker-clear"
                  onClick={() => setRange(undefined)}
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
    </Popover>
  )
}

export { DateRangePicker, DateRangeCalendar }
