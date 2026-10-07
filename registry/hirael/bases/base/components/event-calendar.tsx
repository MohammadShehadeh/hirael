'use client';

import * as React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  addDays,
  addMinutes,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  differenceInMinutes,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  type Day,
  max as maxDate,
  min as minDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export type EventCalendarView = 'month' | 'week' | 'day' | 'agenda';

export type EventColor = 'primary' | 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5' | 'destructive';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  /** Shown in the all-day row of the week and day views. */
  allDay?: boolean;
  color?: EventColor;
  /** Second line, like a location. */
  description?: string;
}

export interface EventCalendarLabels {
  today: string;
  previous: string;
  next: string;
  allDay: string;
  more: (count: number) => string;
  noEvents: string;
  views: Record<EventCalendarView, string>;
}

const DEFAULT_LABELS: EventCalendarLabels = {
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  allDay: 'All day',
  more: (count) => `${count} more`,
  noEvents: 'Nothing scheduled',
  views: { month: 'Month', week: 'Week', day: 'Day', agenda: 'Agenda' },
};

const COLOR_CLASS: Record<EventColor, string> = {
  primary: 'border-primary bg-primary/12 hover:bg-primary/20',
  'chart-1': 'border-chart-1 bg-chart-1/15 hover:bg-chart-1/25',
  'chart-2': 'border-chart-2 bg-chart-2/15 hover:bg-chart-2/25',
  'chart-3': 'border-chart-3 bg-chart-3/15 hover:bg-chart-3/25',
  'chart-4': 'border-chart-4 bg-chart-4/15 hover:bg-chart-4/25',
  'chart-5': 'border-chart-5 bg-chart-5/15 hover:bg-chart-5/25',
  destructive: 'border-destructive bg-destructive/12 hover:bg-destructive/20',
};

const DOT_CLASS: Record<EventColor, string> = {
  primary: 'bg-primary',
  'chart-1': 'bg-chart-1',
  'chart-2': 'bg-chart-2',
  'chart-3': 'bg-chart-3',
  'chart-4': 'bg-chart-4',
  'chart-5': 'bg-chart-5',
  destructive: 'bg-destructive',
};

export interface CalendarSlot {
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface CalendarEventTimes {
  start: Date;
  end: Date;
}

/** Minutes a drag or resize snaps to in the week and day views. */
const SNAP_MINUTES = 15;

interface EventCalendarContextValue {
  events: CalendarEvent[];
  view: EventCalendarView;
  setView: (view: EventCalendarView) => void;
  date: Date;
  setDate: (date: Date) => void;
  weekStartsOn: Day;
  locale: string;
  hourHeight: number;
  labels: EventCalendarLabels;
  editable: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (slot: CalendarSlot) => void;
  moveEvent: (event: CalendarEvent, start: Date, end: Date) => void;
}

const EventCalendarContext = React.createContext<EventCalendarContextValue | null>(null);

const useEventCalendar = () => {
  const ctx = React.useContext(EventCalendarContext);
  if (!ctx) {
    throw new Error('EventCalendar compound parts must be used inside <EventCalendar>');
  }

  return ctx;
};

export interface EventCalendarProps extends React.ComponentProps<'div'> {
  events: CalendarEvent[];
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  /** Any day inside the period on screen. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** Called after an event is dragged to a new time or resized. Leave out to make events read-only. */
  onEventChange?: (event: CalendarEvent, change: CalendarEventTimes) => void;
  onEventClick?: (event: CalendarEvent) => void;
  /** Called when an empty day or time slot is clicked, to create an event there. */
  onSlotClick?: (slot: CalendarSlot) => void;
  /** 0 is Sunday. */
  weekStartsOn?: Day;
  /** BCP 47 tag for dates and times. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  /** Pixel height of one hour in the week and day views. */
  hourHeight?: number;
  labels?: Partial<EventCalendarLabels>;
}

const EventCalendar = ({
  events,
  view: viewProp,
  defaultView = 'month',
  onViewChange,
  date: dateProp,
  defaultDate,
  onDateChange,
  onEventChange,
  onEventClick,
  onSlotClick,
  weekStartsOn = 0,
  locale = 'en-US',
  hourHeight = 48,
  labels,
  className,
  children,
  ...props
}: EventCalendarProps) => {
  const [view, setView] = useControllableState({ prop: viewProp, defaultProp: defaultView, onChange: onViewChange });
  // The default is fixed at mount so server and client render the same period.
  const [initialDate] = React.useState(() => defaultDate ?? new Date());
  const [date, setDate] = useControllableState({ prop: dateProp, defaultProp: initialDate, onChange: onDateChange });

  const moveEvent = React.useCallback(
    (event: CalendarEvent, start: Date, end: Date) => {
      if (start.getTime() === event.start.getTime() && end.getTime() === event.end.getTime()) return;
      onEventChange?.(event, { start, end });
    },
    [onEventChange],
  );

  const ctx = React.useMemo<EventCalendarContextValue>(
    () => ({
      events,
      view,
      setView,
      date,
      setDate,
      weekStartsOn,
      locale,
      hourHeight,
      labels: { ...DEFAULT_LABELS, ...labels, views: { ...DEFAULT_LABELS.views, ...labels?.views } },
      editable: Boolean(onEventChange),
      onEventClick,
      onSlotClick,
      moveEvent,
    }),
    [
      events,
      view,
      setView,
      date,
      setDate,
      weekStartsOn,
      locale,
      hourHeight,
      labels,
      onEventChange,
      onEventClick,
      onSlotClick,
      moveEvent,
    ],
  );

  return (
    <EventCalendarContext.Provider value={ctx}>
      <div
        data-slot="event-calendar"
        data-view={view}
        className={cn(
          'flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <EventCalendarToolbar />
            <EventCalendarBody />
          </>
        )}
      </div>
    </EventCalendarContext.Provider>
  );
};

const usePeriodTitle = () => {
  const { view, date, locale, weekStartsOn } = useEventCalendar();
  if (view === 'month') return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  if (view === 'day') return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date);
  const start = view === 'week' ? startOfWeek(date, { weekStartsOn }) : startOfDay(date);
  const end = view === 'week' ? endOfWeek(date, { weekStartsOn }) : addDays(start, AGENDA_DAYS - 1);

  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).formatRange(start, end);
};

const step = (view: EventCalendarView, date: Date, direction: 1 | -1) => {
  if (view === 'month') return addMonths(date, direction);
  if (view === 'week') return addWeeks(date, direction);
  if (view === 'agenda') return addDays(date, direction * AGENDA_DAYS);

  return addDays(date, direction);
};

/** Period title, previous / today / next, and the view switcher. */
const EventCalendarToolbar = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { view, setView, date, setDate, labels } = useEventCalendar();
  const title = usePeriodTitle();

  return (
    <div
      data-slot="event-calendar-toolbar"
      className={cn('flex flex-wrap items-center gap-2 border-b border-border p-3', className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        <Button type="button" variant="outline" size="sm" onClick={() => setDate(new Date())}>
          {labels.today}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={labels.previous}
          onClick={() => setDate(step(view, date, -1))}
        >
          <ChevronLeft className="rtl:rotate-180" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={labels.next}
          onClick={() => setDate(step(view, date, 1))}
        >
          <ChevronRight className="rtl:rotate-180" />
        </Button>
      </div>
      <h2 aria-live="polite" data-slot="event-calendar-title" className="me-auto text-base font-semibold">
        {title}
      </h2>
      {children}
      <Tabs value={view} onValueChange={(next) => setView(next as EventCalendarView)}>
        <TabsList>
          {(['month', 'week', 'day', 'agenda'] as const).map((v) => (
            <TabsTrigger key={v} value={v}>
              {labels.views[v]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

const EventCalendarBody = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { view, moveEvent, editable } = useEventCalendar();
  const [dragging, setDragging] = React.useState<CalendarEvent | null>(null);
  // A small travel before a drag starts keeps plain clicks working on the events.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragStart = ({ active }: DragStartEvent) => {
    setDragging((active.data.current as EventDragData).event);
  };

  const handleDragEnd = ({ active, over, delta }: DragEndEvent) => {
    setDragging(null);
    const { event, day, hourHeight } = active.data.current as EventDragData;
    const target = over?.data.current as { day: Date; timed: boolean } | undefined;
    if (!target) return;
    const duration = differenceInMinutes(event.end, event.start);
    // Measured from the day that was grabbed, which is not the start day for a chip on a later day of a long event.
    const days = differenceInCalendarDays(target.day, day);

    if (!target.timed || event.allDay || !hourHeight) {
      moveEvent(event, addDays(event.start, days), addDays(event.end, days));

      return;
    }
    const minutes = Math.round(((delta.y / hourHeight) * 60) / SNAP_MINUTES) * SNAP_MINUTES;
    const start = addMinutes(addDays(event.start, days), minutes);
    moveEvent(event, start, addMinutes(start, duration));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragging(null)}
    >
      <div data-slot="event-calendar-body" className={cn('flex min-h-0 flex-1 flex-col', className)} {...props}>
        {view === 'month' && <MonthView />}
        {(view === 'week' || view === 'day') && <TimeGridView days={view === 'week' ? 7 : 1} />}
        {view === 'agenda' && <AgendaView />}
      </div>
      {editable && (
        <DragOverlay dropAnimation={null}>
          {dragging && (
            <div
              className={cn(
                'rounded-sm border-s-2 px-1.5 py-0.5 text-xs font-medium shadow-lg backdrop-blur-sm',
                COLOR_CLASS[dragging.color ?? 'primary'],
              )}
            >
              {dragging.title}
            </div>
          )}
        </DragOverlay>
      )}
    </DndContext>
  );
};

const eventsOnDay = (events: CalendarEvent[], day: Date) =>
  events
    .filter((e) => e.start < endOfDay(day) && e.end > startOfDay(day))
    .sort((a, b) => Number(Boolean(b.allDay)) - Number(Boolean(a.allDay)) || a.start.getTime() - b.start.getTime());

const useTimeFormat = () => {
  const { locale } = useEventCalendar();

  return React.useMemo(() => new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }), [locale]);
};

interface EventDragData {
  event: CalendarEvent;
  day: Date;
  hourHeight?: number;
}

interface EventChipProps {
  event: CalendarEvent;
  /** The day cell the chip sits in. An event spanning several days renders one chip per day. */
  day: Date;
  /** Pixel height of an hour when the chip sits on a time grid, for turning drag distance into minutes. */
  hourHeight?: number;
  /** `pill` is one line for month cells, `block` stacks title and time, `compact` fits a short event on a time grid. */
  variant: 'pill' | 'block' | 'compact';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const EventChip = ({ event, day, hourHeight, variant, className, style, children }: EventChipProps) => {
  const { editable, onEventClick } = useEventCalendar();
  const timeFormat = useTimeFormat();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${event.id}-${day.toISOString()}`,
    data: { event, day, hourHeight } satisfies EventDragData,
    disabled: !editable,
  });
  const color = event.color ?? 'primary';

  return (
    <div
      ref={setNodeRef}
      data-slot="event-calendar-event"
      data-dragging={isDragging || undefined}
      style={style}
      className={cn('group/event data-dragging:opacity-40', className)}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={() => onEventClick?.(event)}
        className={cn(
          'flex size-full min-w-0 rounded-sm border-s-2 text-start text-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          editable && 'cursor-grab active:cursor-grabbing',
          variant === 'block'
            ? 'flex-col overflow-hidden px-1.5 py-1'
            : 'items-center gap-1 overflow-hidden px-1.5 py-0.5',
          variant === 'compact' && 'text-[11px] leading-none',
          COLOR_CLASS[color],
        )}
      >
        {variant === 'compact' ? (
          <>
            <span className="truncate font-medium">{event.title}</span>
            <span dir="auto" className="shrink-0 text-muted-foreground tabular-nums">
              {timeFormat.format(event.start)}
            </span>
          </>
        ) : variant === 'pill' ? (
          <>
            {!event.allDay && (
              <span dir="auto" className="shrink-0 text-muted-foreground tabular-nums">
                {timeFormat.format(event.start)}
              </span>
            )}
            <span className="truncate font-medium">{event.title}</span>
          </>
        ) : (
          <>
            <span className="truncate font-medium">{event.title}</span>
            <span dir="auto" className="truncate text-muted-foreground tabular-nums">
              {timeFormat.formatRange(event.start, event.end)}
            </span>
            {event.description && <span className="truncate text-muted-foreground">{event.description}</span>}
          </>
        )}
      </button>
      {children}
    </div>
  );
};

const MAX_PER_DAY = 3;

const MonthView = () => {
  const { date, weekStartsOn, events, locale, labels, setDate, setView, onSlotClick } = useEventCalendar();
  const first = startOfWeek(startOfMonth(date), { weekStartsOn });
  const last = endOfWeek(endOfMonth(date), { weekStartsOn });
  const days = Array.from({ length: differenceInCalendarDays(last, first) + 1 }, (_, i) => addDays(first, i));
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const dayNumber = new Intl.DateTimeFormat(locale, { day: 'numeric' });

  return (
    <div data-slot="event-calendar-month" className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-7 border-b border-border">
        {days.slice(0, 7).map((day) => (
          <div key={day.toISOString()} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {weekday.format(day)}
          </div>
        ))}
      </div>
      <div className="grid flex-1 auto-rows-[minmax(6.5rem,1fr)] grid-cols-7">
        {days.map((day) => {
          const dayEvents = eventsOnDay(events, day);
          const hidden = dayEvents.length - MAX_PER_DAY;

          return (
            <DayCell
              key={day.toISOString()}
              day={day}
              timed={false}
              className="border-e border-b border-border [&:nth-child(7n)]:border-e-0"
            >
              <div
                data-slot="event-calendar-day"
                data-outside={!isSameMonth(day, date) || undefined}
                data-today={isToday(day) || undefined}
                onClick={(event) => {
                  if (event.target !== event.currentTarget) return;
                  onSlotClick?.({ start: startOfDay(day), end: endOfDay(day), allDay: true });
                }}
                className="flex h-full min-w-0 flex-col gap-0.5 p-1 data-outside:bg-muted/40"
              >
                <button
                  type="button"
                  onClick={() => {
                    setDate(day);
                    setView('day');
                  }}
                  className={cn(
                    'mb-0.5 inline-flex size-6 items-center justify-center self-start rounded-full text-xs tabular-nums outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50',
                    !isSameMonth(day, date) && 'text-muted-foreground',
                    isToday(day) && 'bg-primary font-semibold text-primary-foreground hover:bg-primary',
                  )}
                >
                  {dayNumber.format(day)}
                </button>
                {dayEvents.slice(0, hidden > 0 ? MAX_PER_DAY - 1 : MAX_PER_DAY).map((event) => (
                  <EventChip key={event.id} event={event} day={day} variant="pill" />
                ))}
                {hidden > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDate(day);
                      setView('day');
                    }}
                    className="rounded-sm px-1.5 text-start text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {labels.more(hidden + 1)}
                  </button>
                )}
              </div>
            </DayCell>
          );
        })}
      </div>
    </div>
  );
};

interface DayCellProps {
  day: Date;
  /** Drops here keep the time of day and move by the drag distance. */
  timed: boolean;
  className?: string;
  children: React.ReactNode;
}

const DayCell = ({ day, timed, className, children }: DayCellProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${timed ? 'time' : 'day'}-${day.toISOString()}`,
    data: { day, timed },
  });

  return (
    <div ref={setNodeRef} data-over={isOver || undefined} className={cn('min-w-0 data-over:bg-accent/60', className)}>
      {children}
    </div>
  );
};

interface PlacedEvent {
  event: CalendarEvent;
  column: number;
  columns: number;
}

// Overlapping events share the width: each cluster of overlaps is split into as many columns as it needs.
const layoutDay = (events: CalendarEvent[]): PlacedEvent[] => {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime());
  const placed: PlacedEvent[] = [];
  let cluster: PlacedEvent[] = [];
  let columnsEnd: Date[] = [];
  let clusterEnd = 0;
  const flush = () => {
    for (const p of cluster) p.columns = columnsEnd.length;
    cluster = [];
    columnsEnd = [];
  };
  for (const event of sorted) {
    if (event.start.getTime() >= clusterEnd) flush();
    let column = columnsEnd.findIndex((end) => end <= event.start);
    if (column === -1) {
      column = columnsEnd.length;
      columnsEnd.push(event.end);
    } else columnsEnd[column] = event.end;
    const p = { event, column, columns: 1 };
    cluster.push(p);
    placed.push(p);
    clusterEnd = Math.max(clusterEnd, event.end.getTime());
  }
  flush();

  return placed;
};

// The header rows reserve the same scrollbar space as the scrolling grid, so their columns line up.
const GUTTER = 'overflow-y-hidden [scrollbar-gutter:stable]';

interface TimeGridViewProps {
  days: 1 | 7;
}

const TimeGridView = ({ days: count }: TimeGridViewProps) => {
  const { date, weekStartsOn, events, locale, hourHeight, labels, onSlotClick, setDate, setView } = useEventCalendar();
  const first = count === 7 ? startOfWeek(date, { weekStartsOn }) : startOfDay(date);
  const days = Array.from({ length: count }, (_, i) => addDays(first, i));
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const dayNumber = new Intl.DateTimeFormat(locale, { day: 'numeric' });
  const hourLabel = new Intl.DateTimeFormat(locale, { hour: 'numeric' });
  const allDayEvents = days.map((day) => eventsOnDay(events, day).filter((e) => e.allDay));
  const hasAllDay = allDayEvents.some((list) => list.length > 0);

  // Open on the working day, not midnight.
  React.useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: hourHeight * 7.5 });
  }, [hourHeight, count]);

  const columns = `3.5rem repeat(${count}, minmax(0, 1fr))`;

  return (
    <div data-slot="event-calendar-time-grid" className="flex min-h-0 flex-1 flex-col">
      <div className={cn('grid border-b border-border', GUTTER)} style={{ gridTemplateColumns: columns }}>
        <div />
        {days.map((day) => (
          <button
            key={day.toISOString()}
            type="button"
            disabled={count === 1}
            onClick={() => {
              setDate(day);
              setView('day');
            }}
            className="flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 enabled:hover:text-foreground"
          >
            {weekday.format(day)}
            <span
              className={cn(
                'inline-flex size-6 items-center justify-center rounded-full text-sm text-foreground tabular-nums',
                isToday(day) && 'bg-primary font-semibold text-primary-foreground',
              )}
            >
              {dayNumber.format(day)}
            </span>
          </button>
        ))}
      </div>
      {hasAllDay && (
        <div className={cn('grid border-b border-border', GUTTER)} style={{ gridTemplateColumns: columns }}>
          <div className="px-1 py-1.5 text-end text-[10px] text-muted-foreground">{labels.allDay}</div>
          {days.map((day, i) => (
            <DayCell key={day.toISOString()} day={day} timed={false}>
              <div className="flex h-full flex-col gap-0.5 border-s border-border p-0.5">
                {allDayEvents[i].map((event) => (
                  <EventChip key={event.id} event={event} day={day} variant="pill" />
                ))}
              </div>
            </DayCell>
          ))}
        </div>
      )}
      <div
        ref={scrollRef}
        className={cn('relative min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto')}
        style={{ maxHeight: hourHeight * 12 }}
      >
        <div className="grid" style={{ gridTemplateColumns: columns, height: hourHeight * 24 }}>
          <div className="relative">
            {Array.from({ length: 23 }, (_, h) => (
              <span
                key={h}
                dir="auto"
                className="absolute end-2 -translate-y-1/2 text-[10px] text-muted-foreground tabular-nums"
                style={{ top: (h + 1) * hourHeight }}
              >
                {hourLabel.format(new Date(2026, 0, 1, h + 1))}
              </span>
            ))}
          </div>
          {days.map((day) => (
            <TimeColumn key={day.toISOString()} day={day} onSlotClick={onSlotClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TimeColumnProps {
  day: Date;
  onSlotClick?: (slot: CalendarSlot) => void;
}

const TimeColumn = ({ day, onSlotClick }: TimeColumnProps) => {
  const { events, hourHeight } = useEventCalendar();
  const timed = eventsOnDay(events, day).filter((e) => !e.allDay);
  const placed = layoutDay(timed);
  const now = useNow();
  const dayStart = startOfDay(day);

  return (
    <DayCell day={day} timed>
      <div
        data-slot="event-calendar-column"
        className="relative h-full border-s border-border"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${hourHeight - 1}px, var(--border) ${hourHeight - 1}px, var(--border) ${hourHeight}px)`,
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget || !onSlotClick) return;
          const y = event.clientY - event.currentTarget.getBoundingClientRect().top;
          const minutes = Math.floor(((y / hourHeight) * 60) / 30) * 30;
          const start = addMinutes(dayStart, minutes);
          onSlotClick({ start, end: addMinutes(start, 60), allDay: false });
        }}
      >
        {placed.map(({ event, column, columns }) => {
          const start = maxDate([event.start, dayStart]);
          const end = minDate([event.end, endOfDay(day)]);
          const top = (differenceInMinutes(start, dayStart) / 60) * hourHeight;
          const height = Math.max((differenceInMinutes(end, start) / 60) * hourHeight, hourHeight / 3);

          return (
            <TimedEvent
              key={event.id}
              event={event}
              day={day}
              style={{
                top,
                height,
                insetInlineStart: `calc(${(column / columns) * 100}% + 2px)`,
                width: `calc(${100 / columns}% - 4px)`,
              }}
            />
          );
        })}
        {now && isSameDay(now, day) && (
          <div
            aria-hidden
            data-slot="event-calendar-now"
            className="pointer-events-none absolute inset-x-0 z-10 h-px bg-destructive before:absolute before:-start-1 before:-top-1 before:size-2 before:rounded-full before:bg-destructive"
            style={{ top: (differenceInMinutes(now, dayStart) / 60) * hourHeight }}
          />
        )}
      </div>
    </DayCell>
  );
};

const subscribeToMinutes = (onStoreChange: () => void) => {
  const id = window.setInterval(onStoreChange, 15_000);

  return () => window.clearInterval(id);
};
const currentMinute = () => Math.floor(Date.now() / 60_000);

// The current time is only read in the browser, so the server and hydration render draw no line.
const useNow = () => {
  const minute = React.useSyncExternalStore(subscribeToMinutes, currentMinute, () => null);

  return minute === null ? null : new Date(minute * 60_000);
};

interface TimedEventProps {
  event: CalendarEvent;
  day: Date;
  style: React.CSSProperties;
}

const TimedEvent = ({ event, day, style }: TimedEventProps) => {
  const { hourHeight, editable, moveEvent } = useEventCalendar();
  const [resizeEnd, setResizeEnd] = React.useState<Date | null>(null);

  const startResize = (pointer: React.PointerEvent<HTMLSpanElement>) => {
    pointer.stopPropagation();
    pointer.preventDefault();
    const originY = pointer.clientY;
    let end = event.end;
    const onMove = (move: PointerEvent) => {
      const minutes = Math.round((((move.clientY - originY) / hourHeight) * 60) / SNAP_MINUTES) * SNAP_MINUTES;
      end = maxDate([addMinutes(event.end, minutes), addMinutes(event.start, SNAP_MINUTES)]);
      setResizeEnd(end);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setResizeEnd(null);
      moveEvent(event, event.start, end);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const shown = resizeEnd ? { ...event, end: resizeEnd } : event;
  const height = resizeEnd
    ? Math.max((differenceInMinutes(resizeEnd, event.start) / 60) * hourHeight, hourHeight / 4)
    : style.height;

  return (
    <EventChip
      event={shown}
      day={day}
      hourHeight={hourHeight}
      variant={typeof height === 'number' && height < hourHeight * 0.75 ? 'compact' : 'block'}
      className="absolute"
      style={{ ...style, height }}
    >
      {editable && (
        <span
          aria-hidden
          onPointerDown={startResize}
          className="absolute inset-x-1 bottom-0 h-2 cursor-ns-resize rounded-full opacity-0 group-hover/event:opacity-100 after:absolute after:inset-x-1/3 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-foreground/40"
        />
      )}
    </EventChip>
  );
};

const AGENDA_DAYS = 14;

const AgendaView = () => {
  const { date, events, locale, labels, onEventClick } = useEventCalendar();
  const timeFormat = useTimeFormat();
  const dayFormat = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' });
  const days = Array.from({ length: AGENDA_DAYS }, (_, i) => addDays(startOfDay(date), i))
    .map((day) => ({ day, items: eventsOnDay(events, day) }))
    .filter(({ items }) => items.length > 0);

  if (days.length === 0) {
    return <p className="p-10 text-center text-sm text-muted-foreground">{labels.noEvents}</p>;
  }

  return (
    <div data-slot="event-calendar-agenda" className="min-h-0 flex-1 overflow-y-auto">
      {days.map(({ day, items }) => (
        <section key={day.toISOString()} className="border-b border-border last:border-b-0">
          <h3
            className={cn(
              'sticky top-0 bg-card px-4 py-2 text-xs font-medium text-muted-foreground',
              isToday(day) && 'text-primary',
            )}
          >
            {dayFormat.format(day)}
          </h3>
          <ul className="px-2 pb-2">
            {items.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onEventClick?.(event)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-start text-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span
                    aria-hidden
                    className={cn('size-2 shrink-0 rounded-full', DOT_CLASS[event.color ?? 'primary'])}
                  />
                  <span dir="auto" className="w-28 shrink-0 text-start text-xs text-muted-foreground tabular-nums">
                    {event.allDay ? labels.allDay : timeFormat.formatRange(event.start, event.end)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{event.title}</span>
                  {event.description && (
                    <span className="hidden truncate text-xs text-muted-foreground sm:block">{event.description}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export { EventCalendar, EventCalendarToolbar, EventCalendarBody, useEventCalendar };
