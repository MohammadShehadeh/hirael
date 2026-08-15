"use client";

import * as React from "react";

import { useDemoLocale, useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  type DateRange,
  type DateRangePreset,
} from "@/registry/hirael/components/date-range-picker";

function daysAgo(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
}

export default function DateRangePickerDemo() {
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
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label>{t({ en: "Basic", ar: "أساسي" })}</Label>
        <DateRangePicker value={basic} onValueChange={setBasic}>
          <DateRangePickerTrigger locale={locale} />
          <DateRangePickerContent locale={locale} />
        </DateRangePicker>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {print(basic)}
        </p>
      </div>

      <div className="grid gap-2">
        <Label>{t({ en: "Composed", ar: "مركّب" })}</Label>
        <DateRangePicker
          value={composed}
          onValueChange={setComposed}
          max={new Date()}
        >
          <DateRangePickerTrigger
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
      </div>
    </div>
  );
}
