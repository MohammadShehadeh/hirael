'use client';

import * as React from 'react';

import { Calendar } from '@/registry/hirael/bases/radix/ui/calendar';

const DatePickerInline = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 5, 8));

  return (
    <div className="w-fit rounded-md border border-border">
      <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
    </div>
  );
};

export default DatePickerInline;
