"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Field, FieldGroup, FieldLabel } from "@/registry/hirael/ui/field";
import {
  DateCalendar,
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from "@/registry/hirael/components/date-picker";

const DatePickerDemo = () => {
  const t = useT();
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 5, 12));
  const [bounded, setBounded] = React.useState<Date | null>(null);

  const fmt = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
  const print = (d: Date | null) => (d ? fmt.format(d) : "-");

  return (
    <FieldGroup className="max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Popover", ar: "منبثق" })}
        </p>
        <Field className="gap-2">
          <FieldLabel htmlFor="dp-due">
            {t({ en: "Due date", ar: "تاريخ الاستحقاق" })}
          </FieldLabel>
          <DatePicker value={date} onValueChange={setDate}>
            <DatePickerTrigger
              id="dp-due"
              placeholder={t({ en: "Pick a date", ar: "اختر تاريخًا" })}
            />
            <DatePickerContent />
          </DatePicker>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            {print(date)}
          </p>
        </Field>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Inline calendar", ar: "تقويم مضمّن" })}
        </p>
        <DateCalendar defaultValue={new Date(2026, 5, 8)} />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Bounded, weekends disabled",
            ar: "محدود، عطلة نهاية الأسبوع معطّلة",
          })}
        </p>
        <Field className="gap-2">
          <FieldLabel htmlFor="dp-delivery">
            {t({ en: "Delivery date", ar: "تاريخ التسليم" })}
          </FieldLabel>
          <DatePicker
            value={bounded}
            onValueChange={setBounded}
            min={new Date(2026, 5, 1)}
            max={new Date(2026, 7, 31)}
          >
            <DatePickerTrigger
              id="dp-delivery"
              placeholder={t({ en: "Pick a weekday", ar: "اختر يوم عمل" })}
            />
            <DatePickerContent
              disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
            />
          </DatePicker>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            {print(bounded)}
          </p>
        </Field>
      </div>
    </FieldGroup>
  );
};

export default DatePickerDemo;
