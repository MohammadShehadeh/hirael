'use client';

import * as React from 'react';

import { Calendar } from '@/registry/hirael/bases/base/ui/calendar';
import { useT } from '@/lib/demo-locale';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { DatePicker, DatePickerContent, DatePickerTrigger } from '@/registry/hirael/bases/base/components/date-picker';

const DatePickerDemo = () => {
  const t = useT();
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 5, 12));
  const [inline, setInline] = React.useState<Date | undefined>(new Date(2026, 5, 8));
  const [bounded, setBounded] = React.useState<Date | undefined>();

  const fmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
  const print = (d: Date | undefined) => (d ? fmt.format(d) : '-');

  return (
    <FieldGroup className="max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Popover', ar: 'منبثق' })}</p>
        <Field className="gap-2">
          <FieldLabel htmlFor="dp-due">{t({ en: 'Due date', ar: 'تاريخ الاستحقاق' })}</FieldLabel>
          <DatePicker value={date} onValueChange={setDate}>
            <DatePickerTrigger id="dp-due" placeholder={t({ en: 'Pick a date', ar: 'اختر تاريخًا' })} />
            <DatePickerContent />
          </DatePicker>
          <p className="text-xs text-muted-foreground uppercase">{print(date)}</p>
        </Field>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Inline calendar', ar: 'تقويم مضمّن' })}</p>
        <div className="w-fit rounded-md border border-border">
          <Calendar mode="single" selected={inline} onSelect={setInline} defaultMonth={inline} />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({
            en: 'Bounded, weekends disabled',
            ar: 'محدود، عطلة نهاية الأسبوع معطّلة',
          })}
        </p>
        <Field className="gap-2">
          <FieldLabel htmlFor="dp-delivery">{t({ en: 'Delivery date', ar: 'تاريخ التسليم' })}</FieldLabel>
          <DatePicker value={bounded} onValueChange={setBounded}>
            <DatePickerTrigger id="dp-delivery" placeholder={t({ en: 'Pick a weekday', ar: 'اختر يوم عمل' })} />
            <DatePickerContent
              startMonth={new Date(2026, 5)}
              endMonth={new Date(2026, 7)}
              disabled={[{ before: new Date(2026, 5, 1) }, { after: new Date(2026, 7, 31) }, { dayOfWeek: [0, 6] }]}
            />
          </DatePicker>
          <p className="text-xs text-muted-foreground uppercase">{print(bounded)}</p>
        </Field>
      </div>
    </FieldGroup>
  );
};

export default DatePickerDemo;
