'use client';

import * as React from 'react';

import { useT, type Localized } from '@/lib/demo-locale';
import {
  CalendarHeatmap,
  CalendarHeatmapLegend,
  type CalendarHeatmapDatum,
} from '@/registry/hirael/bases/radix/components/calendar-heatmap';

const generateActivity = (seed: number, days: number): CalendarHeatmapDatum[] => {
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296;
  };
  const today = new Date();

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1 - i));
    const roll = next();
    const value = roll < 0.3 ? 0 : Math.floor(next() * 14);

    return { date, value };
  });
};

const CUSTOM_SCALE = ['bg-muted', 'bg-chart-2/25', 'bg-chart-2/50', 'bg-chart-2/75', 'bg-chart-2'];

const customScale = (level: number) => CUSTOM_SCALE[Math.min(level, CUSTOM_SCALE.length - 1)];

const shortDate: Localized<Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  ar: new Intl.DateTimeFormat('ar', { month: 'short', day: 'numeric', year: 'numeric' }),
};

const mediumDate: Localized<Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }),
  ar: new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }),
};

const CalendarHeatmapDemo = () => {
  const t = useT();
  const yearData = generateActivity(42, 366);
  const halfYearData = generateActivity(7, 184);
  const [selected, setSelected] = React.useState<string | null>(null);

  const locale = t({ en: 'en-US', ar: 'ar' });
  const lessLabel = t({ en: 'Less', ar: 'أقل' });
  const moreLabel = t({ en: 'More', ar: 'أكثر' });

  const formatTooltip = (date: Date, value: number) => {
    const formatted = t(shortDate).format(date);

    return t({
      en: `${value} contribution${value === 1 ? '' : 's'} on ${formatted}`,
      ar: `${value} مساهمة في ${formatted}`,
    });
  };

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="text-xs text-muted-foreground uppercase">
          {t({
            en: 'Commit activity, 12 months',
            ar: 'نشاط الالتزامات، 12 شهرًا',
          })}
        </p>
        <div className="grid gap-2 overflow-x-auto pb-1">
          <CalendarHeatmap data={yearData} locale={locale} tooltipFormatter={formatTooltip} />
          <CalendarHeatmapLegend lessLabel={lessLabel} moreLabel={moreLabel} />
        </div>
      </div>

      <div className="grid gap-3">
        <p className="text-xs text-muted-foreground uppercase">
          {t({
            en: 'Compact',
            ar: 'مدمج',
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
              const formatted = t(mediumDate).format(date);
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
                en: 'Select a day to inspect it.',
                ar: 'اختر يومًا لمعاينته.',
              })}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Custom scale', ar: 'تدرّج مخصّص' })}</p>
        <div className="grid gap-2 overflow-x-auto pb-1">
          <CalendarHeatmap
            data={halfYearData}
            months={6}
            locale={locale}
            tooltipFormatter={formatTooltip}
            classForLevel={customScale}
          />
          <CalendarHeatmapLegend classForLevel={customScale} lessLabel={lessLabel} moreLabel={moreLabel} />
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatmapDemo;
