'use client';

import * as React from 'react';
import { ar } from 'react-day-picker/locale';

import type { DateRange } from '@/registry/hirael/bases/radix/components/date-range-picker';
import { useDemoLocale } from '@/lib/demo-locale';
import { Calendar } from '@/registry/hirael/bases/radix/ui/calendar';

const DateRangePickerInline = () => {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 5, 8),
    to: new Date(2026, 6, 3),
  });

  const arabic = useDemoLocale() === 'ar';

  return (
    <div className="w-fit rounded-md border border-border">
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        defaultMonth={range?.from}
        locale={arabic ? ar : undefined}
      />
    </div>
  );
};

export default DateRangePickerInline;
