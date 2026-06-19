"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  MonthPicker,
  MonthPickerContent,
  MonthPickerTrigger,
  type MonthRange,
  type MonthValue,
} from "@/registry/hirael/ui/month-picker";

export default function MonthPickerDemo() {
  const t = useT();
  const [month, setMonth] = React.useState<MonthValue | undefined>({
    year: 2026,
    month: 4,
  });
  const [range, setRange] = React.useState<MonthRange | undefined>({
    from: { year: 2026, month: 0 },
    to: { year: 2026, month: 5 },
  });

  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label>{t({ en: "Launch month", ar: "شهر الإطلاق" })}</Label>
        <MonthPicker
          value={month}
          onValueChange={setMonth}
          minYear={2020}
          maxYear={2030}
        >
          <MonthPickerTrigger
            placeholder={t({ en: "Pick a month", ar: "اختر شهرًا" })}
          />
          <MonthPickerContent />
        </MonthPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {month ? `${month.month + 1}/${month.year}` : "-"}
        </p>
      </div>

      <div className="grid gap-2">
        <Label>{t({ en: "Quarter range", ar: "نطاق ربع السنة" })}</Label>
        <MonthPicker
          mode="range"
          value={range}
          onValueChange={setRange}
          minYear={2024}
          maxYear={2028}
        >
          <MonthPickerTrigger
            placeholder={t({ en: "Pick a range", ar: "اختر نطاقًا" })}
          />
          <MonthPickerContent />
        </MonthPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {range
            ? `${range.from.month + 1}/${range.from.year} → ${
                range.to ? `${range.to.month + 1}/${range.to.year}` : "…"
              }`
            : "-"}
        </p>
      </div>
    </div>
  );
}
