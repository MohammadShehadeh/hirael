'use client';

import * as React from 'react';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  TimeSlotPicker,
  TimeSlotPickerCalendar,
  TimeSlotPickerSlots,
  type TimeSlot,
} from '@/registry/hirael/bases/base/components/time-slot-picker';

// Weekdays from 9:00 to 16:30 in 30-minute slots, with a fixed pattern already booked.
const getSlots = (day: Date): TimeSlot[] => {
  const weekday = day.getDay();
  if (weekday === 0 || weekday === 6) return [];

  return Array.from({ length: 16 }, (_, i) => {
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9 + Math.floor(i / 2), (i % 2) * 30);

    return { start, unavailable: (day.getDate() * 7 + i * 3) % 5 === 0 };
  });
};

const TimeSlotPickerDemo = () => {
  const t = useT();
  const locale = useDemoLocale() === 'ar' ? 'ar' : 'en-US';
  const [slot, setSlot] = React.useState<Date | undefined>();
  const booked = slot
    ? new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(slot)
    : null;

  return (
    <div className="grid w-full max-w-2xl gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div>
        <p className="font-medium">{t({ en: '30 minute intro call', ar: 'مكالمة تعارف لمدة 30 دقيقة' })}</p>
        <p className="text-sm text-muted-foreground">
          {t({ en: 'Times shown in your time zone', ar: 'الأوقات بتوقيتك المحلي' })}
        </p>
      </div>
      <TimeSlotPicker
        getSlots={getSlots}
        value={slot}
        onValueChange={setSlot}
        defaultDay={new Date(2026, 9, 14)}
        locale={locale}
      >
        <div className="w-fit rounded-md border border-border">
          <TimeSlotPickerCalendar startMonth={new Date(2026, 9)} disabled={{ before: new Date(2026, 9, 5) }} />
        </div>
        <TimeSlotPickerSlots
          label={t({ en: 'Available times', ar: 'الأوقات المتاحة' })}
          placeholder={t({ en: 'Pick a day to see times', ar: 'اختر يومًا لرؤية الأوقات' })}
        />
      </TimeSlotPicker>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {booked ?? t({ en: 'No time picked yet', ar: 'لم تختر وقتًا بعد' })}
        </p>
        <Button type="button" disabled={!slot}>
          {t({ en: 'Confirm', ar: 'تأكيد' })}
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotPickerDemo;
