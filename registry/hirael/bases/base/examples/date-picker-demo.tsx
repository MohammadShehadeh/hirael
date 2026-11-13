'use client';

import * as React from 'react';

import { ar } from 'react-day-picker/locale';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { Field, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { DatePicker, DatePickerContent, DatePickerTrigger } from '@/registry/hirael/bases/base/components/date-picker';

const DatePickerDemo = () => {
  const t = useT();
  const arabic = useDemoLocale() === 'ar';
  const calendarLocale = arabic ? ar : undefined;
  const fmt = new Intl.DateTimeFormat(arabic ? 'ar' : 'en', { dateStyle: 'medium' });
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 5, 12));

  return (
    <Field className="max-w-xs gap-2">
      <FieldLabel htmlFor="dp-due">{t({ en: 'Due date', ar: 'تاريخ الاستحقاق' })}</FieldLabel>
      <DatePicker value={date} onValueChange={setDate} locale={arabic ? 'ar' : 'en-US'}>
        <DatePickerTrigger id="dp-due" placeholder={t({ en: 'Pick a date', ar: 'اختر تاريخًا' })} />
        <DatePickerContent locale={calendarLocale} />
      </DatePicker>
      <p className="text-xs text-muted-foreground uppercase">{date ? fmt.format(date) : '-'}</p>
    </Field>
  );
};

export default DatePickerDemo;
