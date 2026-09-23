'use client';

import * as React from 'react';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { RelativeTime } from '@/registry/hirael/bases/radix/components/relative-time';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const RelativeTimeDemo = () => {
  const t = useT();
  const locale = useDemoLocale();
  const [notes, setNotes] = React.useState<number[]>([]);

  const events = [
    { label: t({ en: 'Invoice sent', ar: 'أُرسلت الفاتورة' }), date: '2026-09-01T09:30:00Z' },
    { label: t({ en: 'Plan renewed', ar: 'جُدّدت الخطة' }), date: '2026-06-15T12:00:00Z' },
    { label: t({ en: 'Trial ends', ar: 'تنتهي الفترة التجريبية' }), date: '2027-01-10T00:00:00Z' },
  ];

  return (
    <div className="grid w-full max-w-sm gap-4">
      <ul className="divide-y divide-border rounded-md border border-border text-sm">
        {notes.map((date) => (
          <li key={date} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-foreground">{t({ en: 'Note added', ar: 'أُضيفت ملاحظة' })}</span>
            <RelativeTime date={date} locale={locale} className="text-muted-foreground tabular-nums" />
          </li>
        ))}
        {events.map((event) => (
          <li key={event.date} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-foreground">{event.label}</span>
            <RelativeTime date={event.date} locale={locale} className="text-muted-foreground" />
          </li>
        ))}
      </ul>
      <Button variant="outline" size="sm" className="w-fit" onClick={() => setNotes((prev) => [Date.now(), ...prev])}>
        {t({ en: 'Add a note', ar: 'أضف ملاحظة' })}
      </Button>
    </div>
  );
};

export default RelativeTimeDemo;
