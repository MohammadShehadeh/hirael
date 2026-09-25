'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  type DateRange,
} from '@/registry/hirael/bases/base/components/date-range-picker';

const fmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
const print = (r: DateRange | undefined) =>
  r?.from ? `${fmt.format(r.from)} → ${r.to ? fmt.format(r.to) : '…'}` : '-';

const DateRangePickerBounded = () => {
  const t = useT();
  const [bounded, setBounded] = React.useState<DateRange | undefined>();

  return (
    <Field className="max-w-md gap-2">
      <FieldLabel htmlFor="drp-bounded">{t({ en: 'Booking window', ar: 'نافذة الحجز' })}</FieldLabel>
      <DateRangePicker value={bounded} onValueChange={setBounded}>
        <DateRangePickerTrigger
          id="drp-bounded"
          placeholder={t({
            en: 'Pick weekdays only',
            ar: 'اختر أيام العمل فقط',
          })}
        />
        <DateRangePickerContent
          numberOfMonths={1}
          presets={[]}
          startMonth={new Date(2026, 5)}
          endMonth={new Date(2026, 7)}
          disabled={[{ before: new Date(2026, 5, 1) }, { after: new Date(2026, 7, 31) }, { dayOfWeek: [0, 6] }]}
        />
      </DateRangePicker>
      <p className="text-xs text-muted-foreground uppercase">{print(bounded)}</p>
    </Field>
  );
};

export default DateRangePickerBounded;
