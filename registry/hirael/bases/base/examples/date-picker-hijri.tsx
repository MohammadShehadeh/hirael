'use client';

import * as React from 'react';
import { arSA, enUS } from '@daypicker/hijri';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { hijriCalendar } from '@/registry/hirael/lib/hijri-calendar';
import { Field, FieldDescription, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { DatePicker, DatePickerContent, DatePickerTrigger } from '@/registry/hirael/bases/base/components/date-picker';

const gregorian = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

const DatePickerHijri = () => {
  const t = useT();
  const arabic = useDemoLocale() === 'ar';
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 2, 20));

  return (
    <Field className="max-w-xs gap-2">
      <FieldLabel htmlFor="dp-hijri">{t({ en: 'Date', ar: 'التاريخ' })}</FieldLabel>
      <DatePicker value={date} onValueChange={setDate} calendar={hijriCalendar} locale={arabic ? 'ar-SA' : 'en-US'}>
        <DatePickerTrigger id="dp-hijri" placeholder={t({ en: 'Pick a date', ar: 'اختر تاريخًا' })} />
        <DatePickerContent locale={arabic ? arSA : enUS} numerals={arabic ? 'arab' : 'latn'} />
      </DatePicker>
      <FieldDescription>
        {t({ en: 'Stored as', ar: 'القيمة المحفوظة' })} {date ? gregorian.format(date) : '-'}
      </FieldDescription>
    </Field>
  );
};

export default DatePickerHijri;
