"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  YearPicker,
  YearPickerContent,
  YearPickerTrigger,
  type YearRange,
} from "@/registry/hirael/ui/year-picker";

export default function YearPickerDemo() {
  const t = useT();

  const [year, setYear] = React.useState<number | undefined>(2026);
  const [range, setRange] = React.useState<YearRange | undefined>({
    from: 2021,
    to: 2026,
  });

  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label>{t({ en: "Founded", ar: "تأسست" })}</Label>
        <YearPicker
          value={year}
          onValueChange={setYear}
          minYear={1970}
          maxYear={2035}
        >
          <YearPickerTrigger placeholder={t({ en: "Year", ar: "السنة" })} />
          <YearPickerContent />
        </YearPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          value = {year ?? "-"}
        </p>
      </div>

      <div className="grid gap-2">
        <Label>{t({ en: "Range", ar: "النطاق" })}</Label>
        <YearPicker
          mode="range"
          value={range}
          onValueChange={setRange}
          minYear={2000}
          maxYear={2030}
        >
          <YearPickerTrigger
            placeholder={t({ en: "Pick a range", ar: "اختر نطاقًا" })}
          />
          <YearPickerContent />
        </YearPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {range?.from ?? "-"} → {range?.to ?? "…"}
        </p>
      </div>
    </div>
  );
}
