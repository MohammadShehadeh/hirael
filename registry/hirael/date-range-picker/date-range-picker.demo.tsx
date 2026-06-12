"use client"

import * as React from "react"

import { Label } from "@/registry/hirael/ui/label"
import {
  DateRangeCalendar,
  DateRangePicker,
  type DateRange,
} from "@/registry/hirael/ui/date-range-picker"

export default function DateRangePickerDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 5, 1),
    to: new Date(2026, 5, 14),
  })
  const [bounded, setBounded] = React.useState<DateRange | undefined>()

  const fmt = new Intl.DateTimeFormat("en", { dateStyle: "medium" })
  const print = (r: DateRange | undefined) =>
    r?.from
      ? `${fmt.format(r.from)} → ${r.to ? fmt.format(r.to) : "…"}`
      : "-"

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Popover with presets
        </p>
        <Label>Reporting period</Label>
        <DateRangePicker value={range} onValueChange={setRange} />
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {print(range)}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Inline calendar
        </p>
        <DateRangeCalendar
          defaultValue={{
            from: new Date(2026, 5, 8),
            to: new Date(2026, 6, 3),
          }}
        />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Bounded, weekends disabled
        </p>
        <Label>Booking window</Label>
        <DateRangePicker
          value={bounded}
          onValueChange={setBounded}
          numberOfMonths={1}
          showPresets={false}
          min={new Date(2026, 5, 1)}
          max={new Date(2026, 7, 31)}
          disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
          placeholder="Pick weekdays only"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {print(bounded)}
        </p>
      </div>
    </div>
  )
}
