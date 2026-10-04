'use client';

import * as React from 'react';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { EventCalendar, type CalendarEvent } from '@/registry/hirael/bases/radix/components/event-calendar';

// Fixed dates, so the prerendered page and the browser show the same month.
const at = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute);

const TEXT: Record<string, { en: string; ar: string }> = {
  'Design review': { en: 'Design review', ar: 'مراجعة التصميم' },
  'Release 7.4': { en: 'Release 7.4', ar: 'إصدار 7.4' },
  Standup: { en: 'Standup', ar: 'اجتماع يومي' },
  'Customer call': { en: 'Customer call', ar: 'مكالمة عميل' },
  'Pairing: filters': { en: 'Pairing: filters', ar: 'عمل ثنائي: التصفية' },
  Offsite: { en: 'Offsite', ar: 'لقاء خارجي' },
  Interview: { en: 'Interview', ar: 'مقابلة' },
  Planning: { en: 'Planning', ar: 'تخطيط' },
  'Lunch & learn': { en: 'Lunch & learn', ar: 'غداء وتعلّم' },
  Retro: { en: 'Retro', ar: 'مراجعة الفترة' },
  'Demo day': { en: 'Demo day', ar: 'يوم العرض' },
  '1:1': { en: '1:1', ar: 'لقاء فردي' },
  'Room 2': { en: 'Room 2', ar: 'القاعة 2' },
  Zoom: { en: 'Zoom', ar: 'زووم' },
  Amman: { en: 'Amman', ar: 'عمّان' },
};

const EventCalendarDemo = () => {
  const t = useT();
  const locale = useDemoLocale() === 'ar' ? 'ar' : 'en-US';
  const [selected, setSelected] = React.useState<CalendarEvent | null>(null);
  const [events, setEvents] = React.useState<CalendarEvent[]>(() => [
    {
      id: '1',
      title: 'Design review',
      start: at(12, 10),
      end: at(12, 11, 30),
      color: 'chart-1',
      description: 'Room 2',
    },
    { id: '2', title: 'Release 7.4', start: at(14, 0), end: at(14, 23, 59), allDay: true, color: 'chart-2' },
    { id: '3', title: 'Standup', start: at(13, 9, 30), end: at(13, 9, 45), color: 'chart-3' },
    { id: '4', title: 'Standup', start: at(14, 9, 30), end: at(14, 9, 45), color: 'chart-3' },
    { id: '5', title: 'Customer call', start: at(14, 13), end: at(14, 14), color: 'chart-4', description: 'Zoom' },
    { id: '6', title: 'Pairing: filters', start: at(14, 13, 30), end: at(14, 15), color: 'chart-1' },
    {
      id: '7',
      title: 'Offsite',
      start: at(20, 0),
      end: at(22, 23, 59),
      allDay: true,
      color: 'chart-5',
      description: 'Amman',
    },
    { id: '8', title: 'Interview', start: at(15, 16), end: at(15, 17), color: 'destructive' },
    { id: '9', title: 'Planning', start: at(16, 11), end: at(16, 12), color: 'primary' },
    { id: '10', title: 'Lunch & learn', start: at(16, 12, 30), end: at(16, 13, 30), color: 'chart-2' },
    { id: '11', title: 'Retro', start: at(16, 15), end: at(16, 16), color: 'chart-3' },
    { id: '12', title: 'Demo day', start: at(9, 14), end: at(9, 16), color: 'chart-4' },
    { id: '13', title: '1:1', start: at(27, 10), end: at(27, 10, 30), color: 'chart-1' },
  ]);

  const translate = (text: string) => (TEXT[text] ? t(TEXT[text]) : text);
  const shown = events.map((event) => ({
    ...event,
    title: translate(event.title),
    description: event.description && translate(event.description),
  }));

  return (
    <div className="grid w-full max-w-5xl gap-3">
      <EventCalendar
        events={shown}
        defaultDate={at(14, 9)}
        defaultView="week"
        weekStartsOn={locale === 'ar' ? 6 : 0}
        locale={locale}
        onEventChange={(event, { start, end }) =>
          setEvents((list) => list.map((e) => (e.id === event.id ? { ...e, start, end } : e)))
        }
        onEventClick={(event) => setSelected(event)}
        onSlotClick={({ start, end, allDay }) =>
          setEvents((list) => [
            ...list,
            { id: String(list.length + 100), title: t({ en: 'New event', ar: 'حدث جديد' }), start, end, allDay },
          ])
        }
        labels={{
          today: t({ en: 'Today', ar: 'اليوم' }),
          previous: t({ en: 'Previous', ar: 'السابق' }),
          next: t({ en: 'Next', ar: 'التالي' }),
          allDay: t({ en: 'All day', ar: 'طوال اليوم' }),
          noEvents: t({ en: 'Nothing scheduled', ar: 'لا شيء مجدول' }),
          more: (count) => t({ en: `${count} more`, ar: `${count} أخرى` }),
          views: {
            month: t({ en: 'Month', ar: 'شهر' }),
            week: t({ en: 'Week', ar: 'أسبوع' }),
            day: t({ en: 'Day', ar: 'يوم' }),
            agenda: t({ en: 'Agenda', ar: 'جدول' }),
          },
        }}
        className="h-[38rem]"
      />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {selected
          ? t({ en: `Selected: ${selected.title}`, ar: `المحدد: ${selected.title}` })
          : t({
              en: 'Drag an event to move it, drag its bottom edge to resize, or click an empty slot to add one.',
              ar: 'اسحب الحدث لنقله، واسحب حافته السفلية لتغيير مدته، أو انقر على خانة فارغة لإضافة حدث.',
            })}
      </p>
    </div>
  );
};

export default EventCalendarDemo;
