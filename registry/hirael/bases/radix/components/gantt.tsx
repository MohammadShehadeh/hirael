'use client';

import * as React from 'react';
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  max as maxDate,
  min as minDate,
  startOfDay,
} from 'date-fns';

import { cn } from '@/lib/utils';

export type GanttZoom = 'day' | 'week' | 'month';

export type GanttColor = 'primary' | 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5';

export interface GanttTask {
  id: string;
  name: string;
  /** First day of the task. */
  start: Date;
  /** Last day of the task, inclusive. */
  end: Date;
  /** Share done, 0 to 100, drawn as a darker fill. */
  progress?: number;
  color?: GanttColor;
  /** Second line in the task list, like an owner. */
  description?: string;
}

export interface GanttRange {
  start: Date;
  end: Date;
}

const BAR_CLASS: Record<GanttColor, { bar: string; fill: string }> = {
  primary: { bar: 'bg-primary/25 border-primary', fill: 'bg-primary' },
  'chart-1': { bar: 'bg-chart-1/25 border-chart-1', fill: 'bg-chart-1' },
  'chart-2': { bar: 'bg-chart-2/25 border-chart-2', fill: 'bg-chart-2' },
  'chart-3': { bar: 'bg-chart-3/25 border-chart-3', fill: 'bg-chart-3' },
  'chart-4': { bar: 'bg-chart-4/25 border-chart-4', fill: 'bg-chart-4' },
  'chart-5': { bar: 'bg-chart-5/25 border-chart-5', fill: 'bg-chart-5' },
};

/** Pixels per day at each zoom level. */
const DAY_WIDTH: Record<GanttZoom, number> = { day: 44, week: 20, month: 7 };

interface GanttContextValue {
  tasks: GanttTask[];
  from: Date;
  days: Date[];
  dayWidth: number;
  zoom: GanttZoom;
  rowHeight: number;
  locale: string;
  editable: boolean;
  today: Date | null;
  changeTask: (task: GanttTask, change: GanttRange) => void;
  onTaskClick?: (task: GanttTask) => void;
}

const GanttContext = React.createContext<GanttContextValue | null>(null);

const useGantt = () => {
  const ctx = React.useContext(GanttContext);
  if (!ctx) {
    throw new Error('Gantt compound parts must be used inside <Gantt>');
  }

  return ctx;
};

const noopSubscribe = () => () => {};

export interface GanttProps extends React.ComponentProps<'div'> {
  tasks: GanttTask[];
  /** `day` shows every date, `week` and `month` squeeze more time into view. */
  zoom?: GanttZoom;
  /** First day on the timeline. Defaults to three days before the earliest task. */
  from?: Date;
  /** Last day on the timeline. Defaults to a week after the latest task. */
  to?: Date;
  /** Called after a bar is dragged or its end is resized. Leave out to make the chart read-only. */
  onTaskChange?: (task: GanttTask, change: GanttRange) => void;
  onTaskClick?: (task: GanttTask) => void;
  /** Pixel height of a row. */
  rowHeight?: number;
  /** BCP 47 tag for month and day labels. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
}

const Gantt = ({
  tasks,
  zoom = 'day',
  from: fromProp,
  to: toProp,
  onTaskChange,
  onTaskClick,
  rowHeight = 44,
  locale = 'en-US',
  className,
  children,
  ...props
}: GanttProps) => {
  // Today is only known in the browser, so the server render has no today line.
  const mounted = React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const from = startOfDay(fromProp ?? addDays(tasks.length ? minDate(tasks.map((t) => t.start)) : new Date(), -3));
  const to = startOfDay(toProp ?? addDays(tasks.length ? maxDate(tasks.map((t) => t.end)) : from, 7));
  const fromKey = from.getTime();
  const toKey = to.getTime();
  const days = React.useMemo(
    () => eachDayOfInterval({ start: new Date(fromKey), end: new Date(Math.max(fromKey, toKey)) }),
    [fromKey, toKey],
  );

  const changeTask = React.useCallback(
    (task: GanttTask, change: GanttRange) => {
      if (change.start.getTime() === task.start.getTime() && change.end.getTime() === task.end.getTime()) return;
      onTaskChange?.(task, change);
    },
    [onTaskChange],
  );

  const ctx = React.useMemo<GanttContextValue>(
    () => ({
      tasks,
      from: new Date(fromKey),
      days,
      dayWidth: DAY_WIDTH[zoom],
      zoom,
      rowHeight,
      locale,
      editable: Boolean(onTaskChange),
      today: mounted ? startOfDay(new Date()) : null,
      changeTask,
      onTaskClick,
    }),
    [tasks, fromKey, days, zoom, rowHeight, locale, onTaskChange, mounted, changeTask, onTaskClick],
  );

  return (
    <GanttContext.Provider value={ctx}>
      <div
        data-slot="gantt"
        data-zoom={zoom}
        className={cn('flex overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)}
        {...props}
      >
        {children ?? (
          <>
            <GanttTaskList />
            <GanttTimeline />
          </>
        )}
      </div>
    </GanttContext.Provider>
  );
};

export interface GanttTaskListProps extends React.ComponentProps<'div'> {
  /** Heading above the task names. */
  heading?: React.ReactNode;
}

/** Task names down the start edge, lined up with their bars. */
const GanttTaskList = ({ heading = 'Task', className, ...props }: GanttTaskListProps) => {
  const { tasks, rowHeight, onTaskClick } = useGantt();

  return (
    <div
      data-slot="gantt-task-list"
      className={cn('w-44 shrink-0 border-e border-border sm:w-56', className)}
      {...props}
    >
      <div className="flex h-14 items-end border-b border-border px-3 pb-2 text-xs font-medium text-muted-foreground">
        {heading}
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border-b border-border last:border-b-0" style={{ height: rowHeight }}>
            <button
              type="button"
              onClick={() => onTaskClick?.(task)}
              className="flex size-full flex-col justify-center px-3 text-start outline-none hover:bg-muted/50 focus-visible:bg-muted/50"
            >
              <span className="truncate text-sm font-medium">{task.name}</span>
              {task.description && <span className="truncate text-xs text-muted-foreground">{task.description}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** The scrolling timeline: month and day headings, a today line and one bar per task. */
const GanttTimeline = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { tasks, days, dayWidth, zoom, rowHeight, locale, today, from } = useGantt();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const width = days.length * dayWidth;
  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const dayFormat = new Intl.DateTimeFormat(locale, { day: 'numeric' });
  const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });

  const months: { label: string; span: number }[] = [];
  for (const day of days) {
    const label = monthFormat.format(day);
    if (months.at(-1)?.label === label) months[months.length - 1].span += 1;
    else months.push({ label, span: 1 });
  }

  // Day view names every day; week view marks each Monday; month view leaves the row to the month names.
  const dayLabel = (day: Date) => {
    if (zoom === 'day') return `${weekdayFormat.format(day)} ${dayFormat.format(day)}`;
    if (zoom === 'week' && day.getDay() === 1) return dayFormat.format(day);

    return '';
  };

  const todayOffset = today ? differenceInCalendarDays(today, from) : -1;

  // Bring today into view once it is known.
  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || todayOffset < 0 || todayOffset >= days.length) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    const target = Math.max(0, todayOffset * dayWidth - el.clientWidth / 3);
    el.scrollLeft = rtl ? -target : target;
  }, [todayOffset, dayWidth, days.length]);

  return (
    <div
      ref={scrollRef}
      data-slot="gantt-timeline"
      className={cn('relative min-w-0 flex-1 overflow-x-auto', className)}
      {...props}
    >
      <div style={{ width }} className="relative">
        <div className="flex h-7 border-b border-border">
          {months.map((month) => (
            <div
              key={month.label}
              className="shrink-0 truncate border-e border-border px-2 py-1.5 text-xs font-medium"
              style={{ width: month.span * dayWidth }}
            >
              {month.label}
            </div>
          ))}
        </div>
        <div className="flex h-7 border-b border-border">
          {days.map((day) => (
            <div
              key={day.getTime()}
              data-weekend={day.getDay() === 0 || day.getDay() === 6 || undefined}
              className="flex shrink-0 items-center justify-center text-[10px] text-muted-foreground tabular-nums data-weekend:bg-muted/40"
              style={{ width: dayWidth }}
            >
              {dayLabel(day)}
            </div>
          ))}
        </div>
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute inset-0 flex">
            {days.map((day) => (
              <div
                key={day.getTime()}
                data-weekend={day.getDay() === 0 || day.getDay() === 6 || undefined}
                className={cn(
                  'h-full shrink-0 data-weekend:bg-muted/40',
                  zoom === 'day' && 'border-e border-border/50',
                )}
                style={{ width: dayWidth }}
              />
            ))}
          </div>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="relative border-b border-border last:border-b-0"
              style={{ height: rowHeight }}
            >
              <GanttBar task={task} />
            </div>
          ))}
          {todayOffset >= 0 && todayOffset < days.length && (
            <div
              aria-hidden
              data-slot="gantt-today"
              className="pointer-events-none absolute inset-y-0 w-px bg-destructive"
              style={{ insetInlineStart: todayOffset * dayWidth + dayWidth / 2 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/** `move` shifts the whole bar, `resize` drags its end. */
type DragMode = 'move' | 'resize';

interface GanttBarProps {
  task: GanttTask;
}

const GanttBar = ({ task }: GanttBarProps) => {
  const { from, dayWidth, rowHeight, editable, changeTask, onTaskClick, locale } = useGantt();
  const [preview, setPreview] = React.useState<GanttRange | null>(null);
  const moved = React.useRef(false);
  const shown = preview ?? task;
  const offset = differenceInCalendarDays(shown.start, from);
  const length = differenceInCalendarDays(shown.end, shown.start) + 1;
  const color = BAR_CLASS[task.color ?? 'primary'];
  const rangeFormat = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' });

  const drag = (event: React.PointerEvent<HTMLElement>, mode: DragMode) => {
    if (!editable || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const originX = event.clientX;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    let next: GanttRange = { start: task.start, end: task.end };
    moved.current = false;
    const onMove = (move: PointerEvent) => {
      const dx = (move.clientX - originX) * (rtl ? -1 : 1);
      const daysMoved = Math.round(dx / dayWidth);
      if (Math.abs(dx) > 3) moved.current = true;
      next =
        mode === 'move'
          ? { start: addDays(task.start, daysMoved), end: addDays(task.end, daysMoved) }
          : { start: task.start, end: maxDate([task.start, addDays(task.end, daysMoved)]) };
      setPreview(next);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setPreview(null);
      changeTask(task, next);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const nudge = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!editable) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    const step = event.key === forward ? 1 : event.key === backward ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    // Shift + arrow changes the length, a plain arrow moves the whole task.
    changeTask(
      task,
      event.shiftKey
        ? { start: task.start, end: maxDate([task.start, addDays(task.end, step)]) }
        : { start: addDays(task.start, step), end: addDays(task.end, step) },
    );
  };

  return (
    <div
      data-slot="gantt-bar"
      className="group/bar absolute top-1/2 -translate-y-1/2"
      style={{
        insetInlineStart: offset * dayWidth + 2,
        width: Math.max(length * dayWidth - 4, 8),
        height: Math.min(28, rowHeight - 12),
      }}
    >
      <button
        type="button"
        aria-label={`${task.name}, ${rangeFormat.formatRange(shown.start, shown.end)}`}
        onPointerDown={(event) => drag(event, 'move')}
        onClick={() => {
          if (!moved.current) onTaskClick?.(task);
        }}
        onKeyDown={nudge}
        className={cn(
          'relative flex size-full items-center overflow-hidden rounded-md border-s-2 text-start text-xs font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          editable && 'cursor-grab touch-none active:cursor-grabbing',
          color.bar,
        )}
      >
        {task.progress !== undefined && (
          <span
            aria-hidden
            className={cn('absolute inset-y-0 start-0 opacity-40', color.fill)}
            style={{ width: `${Math.min(100, Math.max(0, task.progress))}%` }}
          />
        )}
        <span className="relative truncate px-2">{task.name}</span>
      </button>
      {editable && (
        <span
          aria-hidden
          onPointerDown={(event) => drag(event, 'resize')}
          className="absolute inset-y-0 -end-1 w-2.5 cursor-ew-resize touch-none rounded-e-md opacity-0 group-hover/bar:opacity-100 after:absolute after:inset-y-1.5 after:start-1 after:w-0.5 after:rounded-full after:bg-foreground/40"
        />
      )}
    </div>
  );
};

export { Gantt, GanttTaskList, GanttTimeline, useGantt };
