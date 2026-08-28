'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import {
  MonthPicker,
  MonthPickerContent,
  MonthPickerTrigger,
  type MonthRange,
  type MonthValue,
} from '@/registry/hirael/bases/radix/components/month-picker';

const MonthPickerDemo = () => {
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
    <FieldGroup className="grid max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <Field className="gap-2">
        <FieldLabel htmlFor="mp-launch">{t({ en: 'Launch month', ar: 'شهر الإطلاق' })}</FieldLabel>
        <MonthPicker value={month} onValueChange={setMonth} minYear={2020} maxYear={2030}>
          <MonthPickerTrigger id="mp-launch" placeholder={t({ en: 'Pick a month', ar: 'اختر شهرًا' })} />
          <MonthPickerContent />
        </MonthPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {month ? `${month.month + 1}/${month.year}` : '-'}
        </p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="mp-quarter">{t({ en: 'Quarter range', ar: 'نطاق ربع السنة' })}</FieldLabel>
        <MonthPicker mode="range" value={range} onValueChange={setRange} minYear={2024} maxYear={2028}>
          <MonthPickerTrigger id="mp-quarter" placeholder={t({ en: 'Pick a range', ar: 'اختر نطاقًا' })} />
          <MonthPickerContent />
        </MonthPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {range
            ? `${range.from.month + 1}/${range.from.year} → ${
                range.to ? `${range.to.month + 1}/${range.to.year}` : '…'
              }`
            : '-'}
        </p>
      </Field>
    </FieldGroup>
  );
};

export default MonthPickerDemo;
