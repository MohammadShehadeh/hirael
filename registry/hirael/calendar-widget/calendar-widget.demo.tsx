"use client"

import { CalendarWidget } from "@/registry/hirael/ui/calendar-widget"

export default function CalendarWidgetDemo() {
  const today = new Date(2026, 5, 13)
  return (
    <div className="flex w-full max-w-xl justify-center">
      <CalendarWidget
        defaultMonth={new Date(2026, 5, 1)}
        today={today}
        defaultSelected={today}
        events={["2026-06-04", "2026-06-13", "2026-06-21", "2026-06-26"]}
      >
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-accent-cool" />
            4 events
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            June
          </span>
        </div>
      </CalendarWidget>
    </div>
  )
}
