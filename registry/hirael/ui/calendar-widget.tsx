"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function sameDay(a: Date, b: Date) {
  return toKey(a) === toKey(b)
}

type CalendarWidgetProps = React.ComponentProps<"div"> & {
  /** Month shown first. Defaults to today. */
  defaultMonth?: Date
  /** Reference "today" for the highlighted cell. */
  today?: Date
  /** Dates that should show an event dot. */
  events?: (Date | string)[]
  /** Pre-selected date. */
  defaultSelected?: Date | null
  /** Called when a day is picked. */
  onSelect?: (date: Date) => void
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1
}

function CalendarWidget({
  defaultMonth,
  today = new Date(),
  events = [],
  defaultSelected = null,
  onSelect,
  weekStartsOn = 1,
  className,
  children,
  ...props
}: CalendarWidgetProps) {
  const [month, setMonth] = React.useState(
    () => defaultMonth ?? new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [selected, setSelected] = React.useState<Date | null>(defaultSelected)

  const eventKeys = React.useMemo(
    () => new Set(events.map((e) => toKey(typeof e === "string" ? new Date(e) : e))),
    [events]
  )

  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstOfMonth = new Date(year, monthIndex, 1)
  const startOffset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7
  const gridStart = new Date(year, monthIndex, 1 - startOffset)
  const days = Array.from(
    { length: 42 },
    (_, i) =>
      new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
  )

  const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: "narrow" })
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(2024, 0, 7 + ((weekStartsOn + i) % 7)))
  )
  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(firstOfMonth)

  const goToMonth = (delta: number) => {
    setMonth(new Date(year, monthIndex + delta, 1))
  }

  const pick = (day: Date) => {
    setSelected(day)
    onSelect?.(day)
  }

  return (
    <div
      data-slot="calendar-widget"
      className={cn(
        "flex w-full max-w-xs flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          data-slot="calendar-widget-label"
          className="text-sm font-medium text-foreground"
          suppressHydrationWarning
        >
          {monthLabel}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => goToMonth(-1)}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => goToMonth(1)}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {weekdays.map((label, i) => (
          <div
            key={i}
            className="pb-1 text-center font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground"
            suppressHydrationWarning
          >
            {label}
          </div>
        ))}
        {days.map((day) => {
          const outside = day.getMonth() !== monthIndex
          const isToday = sameDay(day, today)
          const isSelected = selected ? sameDay(day, selected) : false
          const hasEvent = eventKeys.has(toKey(day))
          return (
            <button
              key={toKey(day)}
              type="button"
              onClick={() => pick(day)}
              data-outside={outside ? "" : undefined}
              data-today={isToday ? "" : undefined}
              data-selected={isSelected ? "" : undefined}
              aria-pressed={isSelected}
              className={cn(
                "group relative mx-auto inline-flex size-8 items-center justify-center rounded-md text-sm tabular-nums transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                outside ? "text-muted-foreground/50" : "text-foreground",
                "data-[today]:font-semibold data-[today]:ring-1 data-[today]:ring-border",
                "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:ring-0 data-[selected]:hover:bg-primary/90"
              )}
            >
              {day.getDate()}
              {hasEvent ? (
                <span
                  aria-hidden
                  className="absolute bottom-1 size-1 rounded-full bg-accent-cool group-data-[selected]:bg-primary-foreground"
                />
              ) : null}
            </button>
          )
        })}
      </div>

      {children}
    </div>
  )
}

export { CalendarWidget }
