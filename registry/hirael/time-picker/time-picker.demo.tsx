"use client"

import * as React from "react"

import { Label } from "@/registry/hirael/ui/label"
import {
  TimePicker,
  TimePickerContent,
  TimePickerTrigger,
  type TimeValue,
} from "@/registry/hirael/ui/time-picker"

export default function TimePickerDemo() {
  const [t24, setT24] = React.useState<TimeValue>({ hour: 14, minute: 30 })
  const [t12, setT12] = React.useState<TimeValue>({
    hour: 9,
    minute: 15,
    second: 0,
  })

  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label>Meeting time (24h)</Label>
        <TimePicker
          value={t24}
          onValueChange={setT24}
          format="24h"
          minuteStep={5}
        >
          <TimePickerTrigger />
          <TimePickerContent />
        </TimePicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {`${t24.hour}:${t24.minute.toString().padStart(2, "0")}`}
        </p>
      </div>

      <div className="grid gap-2">
        <Label>Reminder (12h · seconds)</Label>
        <TimePicker
          value={t12}
          onValueChange={setT12}
          format="12h"
          showSeconds
          secondStep={15}
        >
          <TimePickerTrigger />
          <TimePickerContent />
        </TimePicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {`${t12.hour}:${t12.minute.toString().padStart(2, "0")}:${(t12.second ?? 0)
            .toString()
            .padStart(2, "0")}`}
        </p>
      </div>
    </div>
  )
}
