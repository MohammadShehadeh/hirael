"use client"

import * as React from "react"

import { Label } from "@/registry/hirael/ui/label"
import {
  DateCalendar,
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from "@/registry/hirael/ui/date-picker"

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 5, 12))
  const [bounded, setBounded] = React.useState<Date | null>(null)

  const fmt = new Intl.DateTimeFormat("en", { dateStyle: "medium" })
  const print = (d: Date | null) => (d ? fmt.format(d) : "-")

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Popover
        </p>
        <Label>Due date</Label>
        <DatePicker value={date} onValueChange={setDate}>
          <DatePickerTrigger placeholder="Pick a date" />
          <DatePickerContent />
        </DatePicker>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {print(date)}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Inline calendar
        </p>
        <DateCalendar defaultValue={new Date(2026, 5, 8)} />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Bounded, weekends disabled
        </p>
        <Label>Delivery date</Label>
        <DatePicker
          value={bounded}
          onValueChange={setBounded}
          min={new Date(2026, 5, 1)}
          max={new Date(2026, 7, 31)}
        >
          <DatePickerTrigger placeholder="Pick a weekday" />
          <DatePickerContent
            disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
          />
        </DatePicker>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {print(bounded)}
        </p>
      </div>
    </div>
  )
}
