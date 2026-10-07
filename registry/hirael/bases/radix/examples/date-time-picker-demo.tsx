'use client';

import * as React from 'react';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import {
  DateTimePicker,
  DateTimePickerContent,
  DateTimePickerTrigger,
} from '@/registry/hirael/bases/radix/components/date-time-picker';

const DateTimePickerDemo = () => {
  const t = useT();
  const locale = useDemoLocale() === 'ar' ? 'ar' : 'en-US';
  const [meeting, setMeeting] = React.useState<Date | undefined>(() => new Date(2026, 9, 14, 14, 30));
  const [reminder, setReminder] = React.useState<Date | undefined>();
  const labels = {
    hour: t({ en: 'Hour', ar: 'الساعة' }),
    minute: t({ en: 'Minute', ar: 'الدقيقة' }),
    meridiem: t({ en: 'AM or PM', ar: 'صباحًا أو مساءً' }),
    am: t({ en: 'AM', ar: 'ص' }),
    pm: t({ en: 'PM', ar: 'م' }),
  };

  return (
    <div className="grid w-full max-w-xs gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: '24-hour clock', ar: 'نظام 24 ساعة' })}</p>
        <DateTimePicker value={meeting} onValueChange={setMeeting} locale={locale}>
          <DateTimePickerTrigger placeholder={t({ en: 'Pick a date and time', ar: 'اختر التاريخ والوقت' })} />
          <DateTimePickerContent timeLabels={labels} />
        </DateTimePicker>
      </div>
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: '12-hour, 15-minute steps', ar: 'نظام 12 ساعة، كل 15 دقيقة' })}
        </p>
        <DateTimePicker value={reminder} onValueChange={setReminder} format="12h" minuteStep={15} locale={locale}>
          <DateTimePickerTrigger placeholder={t({ en: 'Set a reminder', ar: 'اضبط تذكيرًا' })} />
          <DateTimePickerContent timeLabels={labels} disabled={{ before: new Date() }} />
        </DateTimePicker>
      </div>
    </div>
  );
};

export default DateTimePickerDemo;
