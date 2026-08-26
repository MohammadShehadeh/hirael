"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Field, FieldLabel } from "@/registry/hirael/ui/field";
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  type DateRange,
} from "@/registry/hirael/components/date-range-picker";

const fmt = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const print = (r: DateRange | undefined) =>
  r?.from ? `${fmt.format(r.from)} → ${r.to ? fmt.format(r.to) : "…"}` : "-";

const DateRangePickerBounded = () => {
  const t = useT();
  const [bounded, setBounded] = React.useState<DateRange | undefined>();

  return (
    <Field className="max-w-md gap-2">
      <FieldLabel htmlFor="drp-bounded">
        {t({ en: "Booking window", ar: "نافذة الحجز" })}
      </FieldLabel>
      <DateRangePicker
        value={bounded}
        onValueChange={setBounded}
        min={new Date(2026, 5, 1)}
        max={new Date(2026, 7, 31)}
      >
        <DateRangePickerTrigger
          id="drp-bounded"
          placeholder={t({
            en: "Pick weekdays only",
            ar: "اختر أيام العمل فقط",
          })}
        />
        <DateRangePickerContent
          numberOfMonths={1}
          showPresets={false}
          disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
        />
      </DateRangePicker>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {print(bounded)}
      </p>
    </Field>
  );
};

export default DateRangePickerBounded;
