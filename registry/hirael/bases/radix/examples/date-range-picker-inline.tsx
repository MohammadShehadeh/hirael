'use client';

import { DateRangeCalendar } from '@/registry/hirael/bases/radix/components/date-range-picker';

const DateRangePickerInline = () => {
  return <DateRangeCalendar defaultValue={{ from: new Date(2026, 5, 8), to: new Date(2026, 6, 3) }} />;
};

export default DateRangePickerInline;
