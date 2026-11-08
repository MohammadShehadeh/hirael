'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { DatePicker, DatePickerContent, DatePickerTrigger } from '@/registry/hirael/bases/base/components/date-picker';

const fmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

const DatePickerDemo = () => {
  const t = useT();
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 5, 12));

  return (
    <Field className="max-w-xs gap-2">
      <FieldLabel htmlFor="dp-due">{t({ en: 'Due date', ar: 'تاريخ الاستحقاق' })}</FieldLabel>
      <DatePicker value={date} onValueChange={setDate}>
        <DatePickerTrigger id="dp-due" placeholder={t({ en: 'Pick a date', ar: 'اختر تاريخًا' })} />
        <DatePickerContent />
      </DatePicker>
      <p className="text-xs text-muted-foreground uppercase">{date ? fmt.format(date) : '-'}</p>
    </Field>
  );
};

export default DatePickerDemo;
