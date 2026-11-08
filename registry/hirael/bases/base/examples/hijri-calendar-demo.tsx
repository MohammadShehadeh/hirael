'use client';

import * as React from 'react';
import { arSA, enUS } from '@daypicker/hijri';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { hijriCalendar } from '@/registry/hirael/lib/hijri-calendar';
import { Calendar } from '@/registry/hirael/bases/base/ui/calendar';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { DatePicker, DatePickerContent, DatePickerTrigger } from '@/registry/hirael/bases/base/components/date-picker';
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  type DateRange,
  type DateRangePreset,
} from '@/registry/hirael/bases/base/components/date-range-picker';

const HijriCalendarDemo = () => {
  const t = useT();
  const arabic = useDemoLocale() === 'ar';
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 2, 20));
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 1, 18),
    to: new Date(2026, 2, 19),
  });
  const [inline, setInline] = React.useState<Date | undefined>(new Date(2026, 2, 20));

  const locale = arabic ? 'ar-SA' : 'en-US';
  const calendarLocale = arabic ? arSA : enUS;
  const numerals = arabic ? 'arab' : 'latn';
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
    <FieldGroup className="max-w-2xl gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="hijri-date">{t({ en: 'Date', ar: 'التاريخ' })}</FieldLabel>
        <DatePicker value={date} onValueChange={setDate} calendar={hijriCalendar} locale={locale}>
          <DatePickerTrigger id="hijri-date" placeholder={t({ en: 'Pick a date', ar: 'اختر تاريخًا' })} />
          <DatePickerContent locale={calendarLocale} numerals={numerals} />
        </DatePicker>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="hijri-range">{t({ en: 'Date range', ar: 'نطاق التاريخ' })}</FieldLabel>
        <DateRangePicker value={range} onValueChange={setRange} calendar={hijriCalendar} locale={locale}>
          <DateRangePickerTrigger
            id="hijri-range"
            placeholder={t({ en: 'Pick a date range', ar: 'اختر نطاقًا زمنيًا' })}
          />
          <DateRangePickerContent presets={presets} numberOfMonths={1} locale={calendarLocale} numerals={numerals} />
        </DateRangePicker>
      </Field>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Inline calendar', ar: 'تقويم مضمّن' })}</p>
        <div className="w-fit rounded-md border border-border">
          <Calendar
            {...hijriCalendar.props}
            mode="single"
            captionLayout="dropdown"
            selected={inline}
            onSelect={setInline}
            defaultMonth={inline}
            locale={calendarLocale}
            numerals={numerals}
          />
        </div>
      </div>
    </FieldGroup>
  );
};

export default HijriCalendarDemo;
