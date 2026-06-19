"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  CalendarHeatmap,
  CalendarHeatmapLegend,
  type CalendarHeatmapDatum,
} from "@/registry/hirael/ui/calendar-heatmap";

function generateActivity(seed: number, days: number): CalendarHeatmapDatum[] {
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (days - 1 - i),
    );
    const roll = next();
    const value = roll < 0.3 ? 0 : Math.floor(next() * 14);
    return { date, value };
  });
}

const customScale = (level: number) => {
  const scale = [
    "bg-muted",
    "bg-emerald-200 dark:bg-emerald-900",
    "bg-emerald-400 dark:bg-emerald-700",
    "bg-emerald-500 dark:bg-emerald-500",
    "bg-emerald-700 dark:bg-emerald-300",
  ];
  return scale[Math.min(level, scale.length - 1)];
};

export default function CalendarHeatmapDemo() {
  const t = useT();
  const yearData = generateActivity(42, 366);
  const halfYearData = generateActivity(7, 184);
  const [selected, setSelected] = React.useState<string | null>(null);

  const locale = t({ en: "en-US", ar: "ar" });
  const lessLabel = t({ en: "Less", ar: "أقل" });
  const moreLabel = t({ en: "More", ar: "أكثر" });

  const formatTooltip = (date: Date, value: number) => {
    const formatted = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
    return t({
      en: `${value} contribution${value === 1 ? "" : "s"} · ${formatted}`,
      ar: `${value} مساهمة · ${formatted}`,
    });
  };

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Commit activity · 12 months",
            ar: "نشاط الالتزامات · 12 شهرًا",
          })}
        </p>
        <div className="grid gap-2 overflow-x-auto pb-1">
          <CalendarHeatmap
            data={yearData}
            locale={locale}
            tooltipFormatter={formatTooltip}
          />
          <CalendarHeatmapLegend lessLabel={lessLabel} moreLabel={moreLabel} />
        </div>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Compact · 6 months · week starts Monday",
            ar: "مدمج · 6 أشهر · يبدأ الأسبوع الإثنين",
          })}
        </p>
        <div className="grid gap-2 overflow-x-auto pb-1">
          <CalendarHeatmap
            data={halfYearData}
            months={6}
            weekStartsOn={1}
            cellSize="sm"
            gap={2}
            locale={locale}
            tooltipFormatter={formatTooltip}
            onSelectDay={(date, value) => {
              const formatted = new Intl.DateTimeFormat(locale, {
                dateStyle: "medium",
              }).format(date);
              setSelected(
                t({
                  en: `${value} commits on ${formatted}`,
                  ar: `${value} التزامًا في ${formatted}`,
                }),
              );
            }}
          />
          <p className="text-xs text-muted-foreground">
            {selected ??
              t({
                en: "Select a day to inspect it.",
                ar: "اختر يومًا لمعاينته.",
              })}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Custom scale", ar: "تدرّج مخصّص" })}
        </p>
        <div className="grid gap-2 overflow-x-auto pb-1">
          <CalendarHeatmap
            data={halfYearData}
            months={6}
            locale={locale}
            tooltipFormatter={formatTooltip}
            classForLevel={customScale}
          />
          <CalendarHeatmapLegend
            classForLevel={customScale}
            lessLabel={lessLabel}
            moreLabel={moreLabel}
          />
        </div>
      </div>
    </div>
  );
}
