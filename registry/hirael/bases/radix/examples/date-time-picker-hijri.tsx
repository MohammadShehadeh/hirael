'use client';

import * as React from 'react';
import { arSA, enUS } from '@daypicker/hijri';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { hijriCalendar } from '@/registry/hirael/lib/hijri-calendar';
import { Field, FieldDescription, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import {
  DateTimePicker,
  DateTimePickerContent,
  DateTimePickerTrigger,
} from '@/registry/hirael/bases/radix/components/date-time-picker';

const gregorian = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', hourCycle: 'h23' });

const DateTimePickerHijri = () => {
  const t = useT();
  const arabic = useDemoLocale() === 'ar';
  const [value, setValue] = React.useState<Date | undefined>(() => new Date(2026, 2, 20, 7, 30));
  const labels = {
    hour: t({ en: 'Hour', ar: 'الساعة' }),
    minute: t({ en: 'Minute', ar: 'الدقيقة' }),
  };

  return (
    <Field className="max-w-xs gap-2">
      <FieldLabel htmlFor="dtp-hijri">{t({ en: 'Meeting', ar: 'الاجتماع' })}</FieldLabel>
      <DateTimePicker
        value={value}
        onValueChange={setValue}
        calendar={hijriCalendar}
        locale={arabic ? 'ar-SA' : 'en-US'}
      >
        <DateTimePickerTrigger
          id="dtp-hijri"
          placeholder={t({ en: 'Pick a date and time', ar: 'اختر التاريخ والوقت' })}
        />
        <DateTimePickerContent timeLabels={labels} locale={arabic ? arSA : enUS} numerals={arabic ? 'arab' : 'latn'} />
      </DateTimePicker>
      <FieldDescription>
        {t({ en: 'Stored as', ar: 'القيمة المحفوظة' })} {value ? gregorian.format(value) : '-'}
      </FieldDescription>
    </Field>
  );
};

export default DateTimePickerHijri;
