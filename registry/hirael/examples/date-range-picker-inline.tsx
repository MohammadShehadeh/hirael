"use client";

import { DateRangeCalendar } from "@/registry/hirael/ui/date-range-picker";

export default function DateRangePickerInline() {
  return (
    <DateRangeCalendar
      defaultValue={{ from: new Date(2026, 5, 8), to: new Date(2026, 6, 3) }}
    />
  );
}
