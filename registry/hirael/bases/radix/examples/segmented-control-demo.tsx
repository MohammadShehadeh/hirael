'use client';

import * as React from 'react';
import { CalendarDays, ChartGantt, Columns3, List } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useT } from '@/lib/demo-locale';
import { SegmentedControl, SegmentedControlItem } from '@/registry/hirael/bases/radix/components/segmented-control';

type View = 'list' | 'board' | 'calendar';
type Status = 'todo' | 'doing' | 'done';
type Billing = 'monthly' | 'yearly';

const isView = (value: string): value is View => ['list', 'board', 'calendar'].includes(value);

const SegmentedControlDemo = () => {
  const t = useT();
  const [view, setView] = React.useState<View>('board');
  const [billing, setBilling] = React.useState<Billing>('yearly');

  const statuses: { id: Status; label: string }[] = [
    { id: 'todo', label: t({ en: 'To do', ar: 'للتنفيذ' }) },
    { id: 'doing', label: t({ en: 'In progress', ar: 'قيد التنفيذ' }) },
    { id: 'done', label: t({ en: 'Done', ar: 'منجز' }) },
  ];

  const days = [
    t({ en: 'Mon', ar: 'الإثنين' }),
    t({ en: 'Tue', ar: 'الثلاثاء' }),
    t({ en: 'Wed', ar: 'الأربعاء' }),
    t({ en: 'Thu', ar: 'الخميس' }),
    t({ en: 'Fri', ar: 'الجمعة' }),
  ];

  const tasks: { title: string; status: Status; day: number }[] = [
    { title: t({ en: 'Write release notes', ar: 'كتابة ملاحظات الإصدار' }), status: 'doing', day: 1 },
    { title: t({ en: 'Fix login redirect', ar: 'إصلاح إعادة توجيه الدخول' }), status: 'todo', day: 3 },
    { title: t({ en: 'Review pricing page', ar: 'مراجعة صفحة الأسعار' }), status: 'done', day: 0 },
    { title: t({ en: 'Plan Q4 roadmap', ar: 'تخطيط خارطة الربع الرابع' }), status: 'todo', day: 4 },
  ];

  const statusLabel = (status: Status) => statuses.find((s) => s.id === status)?.label;

  const monthly = billing === 'monthly';

  return (
    <div className="grid w-full max-w-md gap-10">
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Sprint 14', ar: 'السباق 14' })}</p>
          <SegmentedControl
            size="sm"
            value={view}
            onValueChange={(next) => isView(next) && setView(next)}
            aria-label={t({ en: 'View', ar: 'طريقة العرض' })}
          >
            <SegmentedControlItem value="list">
              <List />
              {t({ en: 'List', ar: 'قائمة' })}
            </SegmentedControlItem>
            <SegmentedControlItem value="board">
              <Columns3 />
              {t({ en: 'Board', ar: 'لوحة' })}
            </SegmentedControlItem>
            <SegmentedControlItem value="calendar">
              <CalendarDays />
              {t({ en: 'Calendar', ar: 'تقويم' })}
            </SegmentedControlItem>
            <SegmentedControlItem value="timeline" disabled aria-label={t({ en: 'Timeline', ar: 'الخط الزمني' })}>
              <ChartGantt />
            </SegmentedControlItem>
          </SegmentedControl>
        </div>

        <div className="h-44 overflow-hidden rounded-lg border p-3 text-xs">
          {view === 'list' && (
            <ul className="grid divide-y">
              {tasks.map((task) => (
                <li key={task.title} className="flex items-center justify-between gap-3 py-2 first:pt-0">
                  <span className="truncate">{task.title}</span>
                  <span className="shrink-0 text-muted-foreground">{statusLabel(task.status)}</span>
                </li>
              ))}
            </ul>
          )}

          {view === 'board' && (
            <div className="grid h-full grid-cols-3 gap-2">
              {statuses.map((status) => (
                <div key={status.id} className="flex min-w-0 flex-col gap-1.5 rounded-md bg-muted/50 p-1.5">
                  <span className="px-0.5 text-muted-foreground">{status.label}</span>
                  {tasks
                    .filter((task) => task.status === status.id)
                    .map((task) => (
                      <span key={task.title} className="rounded-sm border bg-background px-1.5 py-1 leading-snug">
                        {task.title}
                      </span>
                    ))}
                </div>
              ))}
            </div>
          )}

          {view === 'calendar' && (
            <div className="grid h-full grid-cols-5 gap-px overflow-hidden rounded-md border bg-border">
              {days.map((day, i) => (
                <div key={day} className="flex min-w-0 flex-col gap-1 bg-background p-1.5">
                  <span className="truncate text-muted-foreground">{day}</span>
                  {tasks
                    .filter((task) => task.day === i)
                    .map((task) => (
                      <span
                        key={task.title}
                        className={cn(
                          'rounded-sm px-1 py-0.5 leading-snug',
                          task.status === 'done' ? 'bg-muted text-muted-foreground line-through' : 'bg-primary/10',
                        )}
                      >
                        {task.title}
                      </span>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border p-4">
        <SegmentedControl
          fullWidth
          value={billing}
          onValueChange={(next) => setBilling(next === 'monthly' ? 'monthly' : 'yearly')}
          aria-label={t({ en: 'Billing period', ar: 'فترة الفوترة' })}
        >
          <SegmentedControlItem value="monthly">{t({ en: 'Monthly', ar: 'شهري' })}</SegmentedControlItem>
          <SegmentedControlItem value="yearly">{t({ en: 'Yearly', ar: 'سنوي' })}</SegmentedControlItem>
        </SegmentedControl>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tabular-nums">{monthly ? '$12' : '$120'}</span>
          <span className="text-sm text-muted-foreground">
            {monthly ? t({ en: 'per month', ar: 'شهريًا' }) : t({ en: 'per year', ar: 'سنويًا' })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {monthly
            ? t({ en: 'Cancel any time.', ar: 'ألغِ في أي وقت.' })
            : t({ en: 'Two months free compared to monthly.', ar: 'شهران مجانًا مقارنة بالدفع الشهري.' })}
        </p>
      </div>
    </div>
  );
};

export default SegmentedControlDemo;
