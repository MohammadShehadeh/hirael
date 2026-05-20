"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import {
  YearPicker,
  type YearRange,
} from "@/registry/sabk/year-picker/year-picker"

export default function YearPickerDemo() {
  const [year, setYear] = React.useState<number | undefined>(2026)
  const [range, setRange] = React.useState<YearRange | undefined>({
    from: 2021,
    to: 2026,
  })

  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label>Founded</Label>
        <YearPicker
          value={year}
          onChange={(v) => setYear(v as number)}
          minYear={1970}
          maxYear={2035}
          placeholder="Year"
        />
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          value = {year ?? "—"}
        </p>
      </div>

      <div className="grid gap-2">
        <Label>Range (compound)</Label>
        <YearPicker.Root
          mode="range"
          value={range}
          onValueChange={setRange}
          minYear={2000}
          maxYear={2030}
        >
          <YearPicker.Trigger placeholder="Pick a range" />
          <YearPicker.Content />
        </YearPicker.Root>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {range?.from ?? "—"} → {range?.to ?? "…"}
        </p>
      </div>
    </div>
  )
}
