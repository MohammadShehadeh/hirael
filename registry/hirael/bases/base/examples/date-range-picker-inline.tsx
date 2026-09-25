'use client';

import * as React from 'react';

import type { DateRange } from '@/registry/hirael/bases/base/components/date-range-picker';
import { Calendar } from '@/registry/hirael/bases/base/ui/calendar';

const DateRangePickerInline = () => {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 5, 8),
    to: new Date(2026, 6, 3),
  });

  return (
    <div className="w-fit rounded-md border border-border">
      <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} defaultMonth={range?.from} />
    </div>
  );
};

export default DateRangePickerInline;
