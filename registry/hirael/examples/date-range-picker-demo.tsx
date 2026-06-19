"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  type DateRange,
} from "@/registry/hirael/ui/date-range-picker";

const fmt = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const print = (r: DateRange | undefined) =>
  r?.from ? `${fmt.format(r.from)} → ${r.to ? fmt.format(r.to) : "…"}` : "-";

export default function DateRangePickerDemo() {
  const t = useT();
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 5, 1),
    to: new Date(2026, 5, 14),
  });

  return (
    <div className="grid w-full max-w-md gap-2">
      <Label>{t({ en: "Reporting period", ar: "فترة التقرير" })}</Label>
      <DateRangePicker value={range} onValueChange={setRange}>
        <DateRangePickerTrigger />
        <DateRangePickerContent />
      </DateRangePicker>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {print(range)}
      </p>
    </div>
  );
}
