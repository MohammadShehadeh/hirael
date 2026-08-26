"use client";

import * as React from "react";

import { useDemoLocale, useT } from "@/lib/demo-locale";
import { Field, FieldGroup, FieldLabel } from "@/registry/hirael/ui/field";
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  type DateRange,
  type DateRangePreset,
} from "@/registry/hirael/components/date-range-picker";

const daysAgo = (days: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
};

const DateRangePickerDemo = () => {
  const t = useT();
  const locale = useDemoLocale();

  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const print = (r: DateRange | undefined) =>
    r?.from ? `${fmt.format(r.from)} → ${r.to ? fmt.format(r.to) : "…"}` : "-";

  const [basic, setBasic] = React.useState<DateRange | undefined>({
    from: new Date(2026, 5, 1),
    to: new Date(2026, 5, 14),
  });
  const [composed, setComposed] = React.useState<DateRange | undefined>();

  const presets: DateRangePreset[] = [
    {
      label: t({ en: "Last 7 days", ar: "آخر ٧ أيام" }),
      range: () => ({ from: daysAgo(6), to: daysAgo(0) }),
    },
    {
      label: t({ en: "Last 30 days", ar: "آخر ٣٠ يومًا" }),
      range: () => ({ from: daysAgo(29), to: daysAgo(0) }),
    },
  ];

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="drp-basic">
          {t({ en: "Basic", ar: "أساسي" })}
        </FieldLabel>
        <DateRangePicker value={basic} onValueChange={setBasic}>
          <DateRangePickerTrigger id="drp-basic" locale={locale} />
          <DateRangePickerContent locale={locale} />
        </DateRangePicker>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {print(basic)}
        </p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="drp-composed">
          {t({ en: "Composed", ar: "مركّب" })}
        </FieldLabel>
        <DateRangePicker
          value={composed}
          onValueChange={setComposed}
          max={new Date()}
        >
          <DateRangePickerTrigger
            id="drp-composed"
            locale={locale}
            placeholder={t({
              en: "Pick a reporting period",
              ar: "اختر فترة التقرير",
            })}
          />
          <DateRangePickerContent
            locale={locale}
            presets={presets}
            numberOfMonths={1}
          />
        </DateRangePicker>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {print(composed)}
        </p>
      </Field>
    </FieldGroup>
  );
};

export default DateRangePickerDemo;
