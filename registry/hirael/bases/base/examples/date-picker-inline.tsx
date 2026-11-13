'use client';

import * as React from 'react';
import { ar } from 'react-day-picker/locale';

import { useDemoLocale } from '@/lib/demo-locale';
import { Calendar } from '@/registry/hirael/bases/base/ui/calendar';

const DatePickerInline = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 5, 8));

  const arabic = useDemoLocale() === 'ar';

  return (
    <div className="w-fit rounded-md border border-border">
      <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} locale={arabic ? ar : undefined} />
    </div>
  );
};

export default DatePickerInline;
