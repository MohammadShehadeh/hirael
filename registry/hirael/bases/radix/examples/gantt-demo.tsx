'use client';

import * as React from 'react';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/radix/ui/tabs';
import {
  Gantt,
  GanttTaskList,
  GanttTimeline,
  type GanttTask,
  type GanttZoom,
} from '@/registry/hirael/bases/radix/components/gantt';

const day = (month: number, date: number) => new Date(2026, month, date);

const GanttDemo = () => {
  const t = useT();
  const locale = useDemoLocale() === 'ar' ? 'ar' : 'en-US';
  const [zoom, setZoom] = React.useState<GanttZoom>('day');
  const [tasks, setTasks] = React.useState<GanttTask[]>(() => [
    { id: 'research', name: 'Research', start: day(8, 28), end: day(9, 2), progress: 100, color: 'chart-1' },
    { id: 'design', name: 'Design', start: day(9, 1), end: day(9, 9), progress: 80, color: 'chart-2' },
    { id: 'build', name: 'Build', start: day(9, 7), end: day(9, 21), progress: 35, color: 'chart-3' },
    { id: 'docs', name: 'Docs', start: day(9, 15), end: day(9, 22), progress: 10, color: 'chart-4' },
    { id: 'qa', name: 'QA', start: day(9, 19), end: day(9, 26), color: 'chart-5' },
    { id: 'launch', name: 'Launch', start: day(9, 27), end: day(9, 28), color: 'primary' },
  ]);

  const names: Record<string, { name: { en: string; ar: string }; owner: { en: string; ar: string } }> = {
    research: { name: { en: 'Research', ar: 'البحث' }, owner: { en: 'Sara', ar: 'سارة' } },
    design: { name: { en: 'Design', ar: 'التصميم' }, owner: { en: 'Omar', ar: 'عمر' } },
    build: { name: { en: 'Build', ar: 'التطوير' }, owner: { en: 'Mohammad', ar: 'محمد' } },
    docs: { name: { en: 'Docs', ar: 'التوثيق' }, owner: { en: 'Sara', ar: 'سارة' } },
    qa: { name: { en: 'QA', ar: 'الاختبار' }, owner: { en: 'Omar', ar: 'عمر' } },
    launch: { name: { en: 'Launch', ar: 'الإطلاق' }, owner: { en: 'Team', ar: 'الفريق' } },
  };
  const shown = tasks.map((task) => ({
    ...task,
    name: t(names[task.id].name),
    description: t(names[task.id].owner),
  }));

  return (
    <div className="grid w-full max-w-4xl gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{t({ en: 'Release 7.4', ar: 'الإصدار 7.4' })}</p>
        <Tabs value={zoom} onValueChange={(value) => setZoom(value as GanttZoom)}>
          <TabsList>
            <TabsTrigger value="day">{t({ en: 'Days', ar: 'أيام' })}</TabsTrigger>
            <TabsTrigger value="week">{t({ en: 'Weeks', ar: 'أسابيع' })}</TabsTrigger>
            <TabsTrigger value="month">{t({ en: 'Months', ar: 'أشهر' })}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Gantt
        tasks={shown}
        zoom={zoom}
        locale={locale}
        from={day(8, 25)}
        to={day(10, 8)}
        onTaskChange={(task, { start, end }) =>
          setTasks((list) => list.map((item) => (item.id === task.id ? { ...item, start, end } : item)))
        }
      >
        <GanttTaskList heading={t({ en: 'Task', ar: 'المهمة' })} />
        <GanttTimeline />
      </Gantt>
      <p className="text-xs text-muted-foreground">
        {t({
          en: 'Drag a bar to move it, drag its end to change its length, or focus it and use the arrow keys.',
          ar: 'اسحب الشريط لنقله، أو اسحب نهايته لتغيير مدته، أو ركّز عليه واستخدم الأسهم.',
        })}
      </p>
    </div>
  );
};

export default GanttDemo;
