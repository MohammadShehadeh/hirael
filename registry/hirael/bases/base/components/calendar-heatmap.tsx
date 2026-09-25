'use client';

import * as React from 'react';
import { addDays, addMonths, startOfDay } from 'date-fns';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/hirael/bases/base/ui/tooltip';

const CELL_SIZES = { sm: 10, md: 12, lg: 16 } as const;

const DEFAULT_LEVEL_CLASSES = ['bg-muted', 'bg-primary/25', 'bg-primary/50', 'bg-primary/75', 'bg-primary'];

const defaultClassForLevel = (level: number, levels: number) => {
  if (level <= 0 || levels <= 1) return DEFAULT_LEVEL_CLASSES[0];
  const index = Math.max(1, Math.round((level / (levels - 1)) * 4));

  return DEFAULT_LEVEL_CLASSES[Math.min(index, 4)];
};

const toLocalDate = (input: Date | string): Date => {
  if (input instanceof Date) return startOfDay(input);
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  return startOfDay(new Date(input));
};

const dayKey = (date: Date): number => {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
};

const fromDayKey = (key: number): Date => {
  return new Date(Math.floor(key / 10000), (Math.floor(key / 100) % 100) - 1, key % 100);
};

// "Today" is read on the client only: a prerendered page would otherwise freeze the build date into the HTML.
const subscribeNever = () => () => {};
const getTodayKey = () => dayKey(new Date());
const getServerTodayKey = () => null;

interface CalendarHeatmapCell {
  date: Date;
  value: number;
  level: number;
  inRange: boolean;
}

type CalendarHeatmapCellSize = 'sm' | 'md' | 'lg' | number;

const resolveCellSize = (cellSize: CalendarHeatmapCellSize): number => {
  return typeof cellSize === 'number' ? cellSize : CELL_SIZES[cellSize];
};

interface CalendarHeatmapDatum {
  date: Date | string;
  value: number;
}

interface CalendarHeatmapProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  data: CalendarHeatmapDatum[];
  endDate?: Date;
  startDate?: Date;
  months?: number;
  weekStartsOn?: 0 | 1;
  levels?: number;
  thresholds?: number[];
  classForLevel?: (level: number) => string;
  cellSize?: CalendarHeatmapCellSize;
  gap?: number;
  /** Defaults to `en-US` so server and client render the same labels. */
  locale?: string;
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  tooltipFormatter?: (date: Date, value: number) => React.ReactNode;
  onSelectDay?: (date: Date, value: number) => void;
}

const CalendarHeatmap = ({
  data,
  endDate,
  startDate,
  months = 12,
  weekStartsOn = 0,
  levels = 5,
  thresholds,
  classForLevel,
  cellSize = 'md',
  gap = 3,
  locale = 'en-US',
  showMonthLabels = true,
  showWeekdayLabels = true,
  tooltipFormatter,
  onSelectDay,
  className,
  ...props
}: CalendarHeatmapProps) => {
  const size = resolveCellSize(cellSize);
  const todayKey = React.useSyncExternalStore(subscribeNever, getTodayKey, getServerTodayKey);

  const { cells, weekCount, monthLabels, weekdayLabels } = React.useMemo(() => {
    const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });

    const weekdays = Array.from({ length: 7 }, (_, row) => {
      const day = (weekStartsOn + row) % 7;

      return {
        label: dayFormatter.format(new Date(2024, 0, 7 + day)),
        visible: day === 1 || day === 3 || day === 5,
      };
    });

    const rangeEnd = endDate ? toLocalDate(endDate) : todayKey === null ? null : fromDayKey(todayKey);
    if (!rangeEnd) {
      return { cells: [] as CalendarHeatmapCell[], weekCount: 0, monthLabels: [], weekdayLabels: weekdays };
    }
    const rangeStart = startDate ? toLocalDate(startDate) : addDays(addMonths(rangeEnd, -months), 1);

    const values = new Map<number, number>();
    for (const datum of data) {
      const key = dayKey(toLocalDate(datum.date));
      values.set(key, (values.get(key) ?? 0) + datum.value);
    }

    const leading = (rangeStart.getDay() - weekStartsOn + 7) % 7;
    const gridStart = addDays(rangeStart, -leading);
    const totalDays = Math.round((rangeEnd.getTime() - gridStart.getTime()) / 86400000) + 1;
    const weeks = Math.ceil(totalDays / 7);

    let max = 0;
    for (let i = 0; i < weeks * 7; i++) {
      const date = addDays(gridStart, i);
      if (date < rangeStart || date > rangeEnd) continue;
      max = Math.max(max, values.get(dayKey(date)) ?? 0);
    }
    if (max <= 0) max = 1;

    const cuts =
      thresholds ??
      Array.from({ length: Math.max(levels - 1, 0) }, (_, i) => (max * (i + 1)) / Math.max(levels - 1, 1));

    const levelFor = (value: number) => {
      if (value <= 0) return 0;
      let level = 0;
      for (const cut of cuts) {
        if (value >= cut) level += 1;
      }

      return Math.min(level, levels - 1);
    };

    const grid: CalendarHeatmapCell[] = [];
    for (let i = 0; i < weeks * 7; i++) {
      const date = addDays(gridStart, i);
      const inRange = date >= rangeStart && date <= rangeEnd;
      const value = inRange ? (values.get(dayKey(date)) ?? 0) : 0;
      grid.push({ date, value, level: inRange ? levelFor(value) : 0, inRange });
    }

    const candidates: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    for (let i = 0; i < grid.length; i++) {
      const cell = grid[i];
      if (!cell.inRange) continue;
      const month = cell.date.getMonth();
      if (month !== lastMonth) {
        lastMonth = month;
        candidates.push({
          weekIndex: Math.floor(i / 7),
          label: monthFormatter.format(cell.date),
        });
      }
    }
    const labels = candidates.filter((candidate, i) => {
      const next = candidates[i + 1];

      return !next || next.weekIndex - candidate.weekIndex >= 3;
    });

    return {
      cells: grid,
      weekCount: weeks,
      monthLabels: labels,
      weekdayLabels: weekdays,
    };
  }, [data, endDate, startDate, months, weekStartsOn, levels, thresholds, locale, todayKey]);

  const resolveLevelClass = classForLevel ?? ((level: number) => defaultClassForLevel(level, levels));

  const defaultFormatter = React.useMemo(() => {
    const dateFormat = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' });
    const numberFormat = new Intl.NumberFormat(locale);

    return (date: Date, value: number) => `${dateFormat.format(date)}: ${numberFormat.format(value)}`;
  }, [locale]);

  const cellRefs = React.useRef(new Map<number, HTMLButtonElement | null>());
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const activeCell = activeIndex !== null && cells[activeIndex]?.inRange ? cells[activeIndex] : null;

  const handleGridPointerOver = (event: React.PointerEvent<HTMLDivElement>) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-index]');
    setActiveIndex(cell ? Number(cell.dataset.index) : null);
  };

  const defaultTabbableIndex = React.useMemo(() => {
    const todayIndex = cells.findIndex((cell) => cell.inRange && dayKey(cell.date) === todayKey);
    if (todayIndex !== -1) return todayIndex;
    for (let i = cells.length - 1; i >= 0; i--) {
      if (cells[i].inRange) return i;
    }

    return -1;
  }, [cells, todayKey]);

  const tabbableIndex = focusedIndex !== null && cells[focusedIndex]?.inRange ? focusedIndex : defaultTabbableIndex;

  const handleCellKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    let target: number;
    switch (event.key) {
      case 'ArrowUp':
        target = index - 1;
        break;
      case 'ArrowDown':
        target = index + 1;
        break;
      case 'ArrowLeft':
        target = index + (rtl ? 7 : -7);
        break;
      case 'ArrowRight':
        target = index + (rtl ? -7 : 7);
        break;
      case 'Home':
        target = index - (index % 7);
        while (target < index && !cells[target]?.inRange) target += 1;
        break;
      case 'End':
        target = index - (index % 7) + 6;
        while (target > index && !cells[target]?.inRange) target -= 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (target < 0 || target >= cells.length || !cells[target].inRange) return;
    setFocusedIndex(target);
    cellRefs.current.get(target)?.focus();
  };

  return (
    <div data-slot="calendar-heatmap" className={cn('w-fit', className)} {...props}>
      <TooltipProvider delay={0}>
        <div className="flex flex-col" style={{ gap }}>
          {showMonthLabels && (
            <div className="flex" style={{ gap }}>
              {showWeekdayLabels && <div aria-hidden className="w-8 shrink-0" />}
              <div
                data-slot="calendar-heatmap-months"
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${weekCount}, ${size}px)`,
                  columnGap: gap,
                }}
              >
                {monthLabels.map((month) => (
                  <span
                    key={month.weekIndex}
                    data-slot="calendar-heatmap-month-label"
                    className="text-xs whitespace-nowrap text-muted-foreground uppercase"
                    style={{ gridColumnStart: month.weekIndex + 1, gridRow: 1 }}
                  >
                    {month.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex" style={{ gap }}>
            {showWeekdayLabels && (
              <div
                data-slot="calendar-heatmap-weekdays"
                className="grid w-8 shrink-0"
                style={{
                  gridTemplateRows: `repeat(7, ${size}px)`,
                  rowGap: gap,
                }}
              >
                {weekdayLabels.map((weekday, row) => (
                  <span
                    key={row}
                    data-slot="calendar-heatmap-weekday-label"
                    className={cn(
                      'flex items-center text-[10px] leading-none text-muted-foreground',
                      !weekday.visible && 'invisible',
                    )}
                  >
                    {weekday.label}
                  </span>
                ))}
              </div>
            )}
            <div className="relative" onPointerOver={handleGridPointerOver} onPointerLeave={() => setActiveIndex(null)}>
              <div
                data-slot="calendar-heatmap-grid"
                className="grid grid-flow-col"
                style={{
                  gridTemplateRows: `repeat(7, ${size}px)`,
                  gridTemplateColumns: `repeat(${weekCount}, ${size}px)`,
                  gap,
                }}
              >
                {cells.map((cell, index) => {
                  if (!cell.inRange) {
                    return (
                      <div
                        key={cell.date.getTime()}
                        data-slot="calendar-heatmap-cell"
                        aria-hidden
                        className="invisible"
                      />
                    );
                  }
                  const tooltip = tooltipFormatter?.(cell.date, cell.value);
                  const label = typeof tooltip === 'string' ? tooltip : defaultFormatter(cell.date, cell.value);
                  const cellClassName = cn(
                    'rounded-[2px]',
                    resolveLevelClass(cell.level),
                    onSelectDay &&
                      'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                  );

                  return onSelectDay ? (
                    <button
                      key={cell.date.getTime()}
                      type="button"
                      ref={(el) => {
                        cellRefs.current.set(index, el);
                      }}
                      data-slot="calendar-heatmap-cell"
                      data-level={cell.level}
                      data-index={index}
                      aria-label={label}
                      tabIndex={index === tabbableIndex ? 0 : -1}
                      className={cellClassName}
                      onFocus={() => {
                        setFocusedIndex(index);
                        setActiveIndex(index);
                      }}
                      onBlur={() => setActiveIndex(null)}
                      onKeyDown={(event) => handleCellKeyDown(event, index)}
                      onClick={() => onSelectDay(cell.date, cell.value)}
                    />
                  ) : (
                    <div
                      key={cell.date.getTime()}
                      role="img"
                      data-slot="calendar-heatmap-cell"
                      data-level={cell.level}
                      data-index={index}
                      aria-label={label}
                      className={cellClassName}
                    />
                  );
                })}
              </div>
              <Tooltip open={activeCell !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
                <TooltipTrigger
                  key={activeIndex ?? 'none'}
                  render={
                    <span
                      aria-hidden
                      data-slot="calendar-heatmap-tooltip-anchor"
                      className="pointer-events-none absolute"
                      style={
                        activeIndex === null
                          ? { top: 0, insetInlineStart: 0, width: 0, height: 0 }
                          : {
                              top: (activeIndex % 7) * (size + gap),
                              insetInlineStart: Math.floor(activeIndex / 7) * (size + gap),
                              width: size,
                              height: size,
                            }
                      }
                    />
                  }
                />
                <TooltipContent>
                  {activeCell && (tooltipFormatter ?? defaultFormatter)(activeCell.date, activeCell.value)}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

interface CalendarHeatmapLegendProps extends React.ComponentProps<'div'> {
  levels?: number;
  classForLevel?: (level: number) => string;
  cellSize?: CalendarHeatmapCellSize;
  gap?: number;
  lessLabel?: React.ReactNode;
  moreLabel?: React.ReactNode;
}

const CalendarHeatmapLegend = ({
  levels = 5,
  classForLevel,
  cellSize = 'md',
  gap = 3,
  lessLabel = 'Less',
  moreLabel = 'More',
  className,
  ...props
}: CalendarHeatmapLegendProps) => {
  const size = resolveCellSize(cellSize);
  const resolveLevelClass = classForLevel ?? ((level: number) => defaultClassForLevel(level, levels));

  return (
    <div
      data-slot="calendar-heatmap-legend"
      className={cn('flex w-fit items-center gap-1.5 text-[10px] text-muted-foreground', className)}
      {...props}
    >
      <span data-slot="calendar-heatmap-legend-label">{lessLabel}</span>
      <div className="flex" style={{ gap }}>
        {Array.from({ length: levels }, (_, level) => (
          <span
            key={level}
            data-slot="calendar-heatmap-legend-swatch"
            data-level={level}
            className={cn('rounded-[2px]', resolveLevelClass(level))}
            style={{ width: size, height: size }}
          />
        ))}
      </div>
      <span data-slot="calendar-heatmap-legend-label">{moreLabel}</span>
    </div>
  );
};

export { CalendarHeatmap, CalendarHeatmapLegend };
export type { CalendarHeatmapDatum };
