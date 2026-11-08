'use client';

import * as React from 'react';
import { arSA, enUS } from '@daypicker/hijri';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { hijriCalendar } from '@/registry/hirael/lib/hijri-calendar';
import { Field, FieldDescription, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  type DateRange,
  type DateRangePreset,
} from '@/registry/hirael/bases/base/components/date-range-picker';

const gregorian = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

const DateRangePickerHijri = () => {
  const t = useT();
  const arabic = useDemoLocale() === 'ar';
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 1, 18),
    to: new Date(2026, 2, 19),
  });
  const presets: DateRangePreset[] = [
    {
      label: t({ en: 'This month', ar: 'هذا الشهر' }),
      range: (dateLib) => {
        const from = dateLib.startOfMonth(new Date());

        return { from, to: dateLib.startOfDay(dateLib.endOfMonth(from)) };
      },
    },
    {
      label: t({ en: 'Last month', ar: 'الشهر الماضي' }),
      range: (dateLib) => {
        const from = dateLib.startOfMonth(dateLib.addMonths(new Date(), -1));

        return { from, to: dateLib.startOfDay(dateLib.endOfMonth(from)) };
      },
    },
  ];

  return (
    <Field className="max-w-sm gap-2">
      <FieldLabel htmlFor="drp-hijri">{t({ en: 'Date range', ar: 'نطاق التاريخ' })}</FieldLabel>
      <DateRangePicker
        value={range}
        onValueChange={setRange}
        calendar={hijriCalendar}
        locale={arabic ? 'ar-SA' : 'en-US'}
      >
        <DateRangePickerTrigger id="drp-hijri" placeholder={t({ en: 'Pick a date range', ar: 'اختر نطاقًا زمنيًا' })} />
        <DateRangePickerContent
          presets={presets}
          numberOfMonths={1}
          locale={arabic ? arSA : enUS}
          numerals={arabic ? 'arab' : 'latn'}
        />
      </DateRangePicker>
      <FieldDescription>
        {t({ en: 'Stored as', ar: 'القيمة المحفوظة' })}{' '}
        {range?.from ? `${gregorian.format(range.from)} – ${range.to ? gregorian.format(range.to) : '…'}` : '-'}
      </FieldDescription>
    </Field>
  );
};

export default DateRangePickerHijri;
