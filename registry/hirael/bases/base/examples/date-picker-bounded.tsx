'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { DatePicker, DatePickerContent, DatePickerTrigger } from '@/registry/hirael/bases/base/components/date-picker';

const fmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

const DatePickerBounded = () => {
  const t = useT();
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <Field className="max-w-xs gap-2">
      <FieldLabel htmlFor="dp-delivery">{t({ en: 'Delivery date', ar: 'تاريخ التسليم' })}</FieldLabel>
      <DatePicker value={date} onValueChange={setDate}>
        <DatePickerTrigger id="dp-delivery" placeholder={t({ en: 'Pick a weekday', ar: 'اختر يوم عمل' })} />
        <DatePickerContent
          startMonth={new Date(2026, 5)}
          endMonth={new Date(2026, 7)}
          disabled={[{ before: new Date(2026, 5, 1) }, { after: new Date(2026, 7, 31) }, { dayOfWeek: [0, 6] }]}
        />
      </DatePicker>
      <p className="text-xs text-muted-foreground uppercase">{date ? fmt.format(date) : '-'}</p>
    </Field>
  );
};

export default DatePickerBounded;
