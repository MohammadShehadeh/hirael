'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import {
  YearPicker,
  YearPickerContent,
  YearPickerTrigger,
  type YearRange,
} from '@/registry/hirael/bases/radix/components/year-picker';

const YearPickerDemo = () => {
  const t = useT();

  const [year, setYear] = React.useState<number | undefined>(2026);
  const [range, setRange] = React.useState<YearRange | undefined>({
    from: 2021,
    to: 2026,
  });

  return (
    <FieldGroup className="grid max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <Field className="gap-2">
        <FieldLabel htmlFor="yp-founded">{t({ en: 'Founded', ar: 'تأسست' })}</FieldLabel>
        <YearPicker value={year} onValueChange={setYear} minYear={1970} maxYear={2035}>
          <YearPickerTrigger id="yp-founded" placeholder={t({ en: 'Year', ar: 'السنة' })} />
          <YearPickerContent />
        </YearPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">value = {year ?? '-'}</p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="yp-range">{t({ en: 'Range', ar: 'النطاق' })}</FieldLabel>
        <YearPicker mode="range" value={range} onValueChange={setRange} minYear={2000} maxYear={2030}>
          <YearPickerTrigger id="yp-range" placeholder={t({ en: 'Pick a range', ar: 'اختر نطاقًا' })} />
          <YearPickerContent />
        </YearPicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {range?.from ?? '-'} → {range?.to ?? '…'}
        </p>
      </Field>
    </FieldGroup>
  );
};

export default YearPickerDemo;
