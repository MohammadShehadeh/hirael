"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/hirael/ui/tooltip";

const CELL_SIZES = { sm: 10, md: 12, lg: 16 } as const;

const DEFAULT_LEVEL_CLASSES = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-primary",
];

function defaultClassForLevel(level: number, levels: number) {
  if (level <= 0 || levels <= 1) return DEFAULT_LEVEL_CLASSES[0];
  const index = Math.max(1, Math.round((level / (levels - 1)) * 4));
  return DEFAULT_LEVEL_CLASSES[Math.min(index, 4)];
}

function toLocalDate(input: Date | string): Date {
  if (input instanceof Date) {
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  const parsed = new Date(input);
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function dayKey(date: Date): number {
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
}

function resolveCellSize(cellSize: "sm" | "md" | "lg" | number): number {
  return typeof cellSize === "number" ? cellSize : CELL_SIZES[cellSize];
}

type CalendarHeatmapDatum = {
  date: Date | string;
  value: number;
};

type CalendarHeatmapProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  data: CalendarHeatmapDatum[];
  endDate?: Date;
  startDate?: Date;
  months?: number;
  weekStartsOn?: 0 | 1;
  levels?: number;
  thresholds?: number[];
  classForLevel?: (level: number) => string;
  cellSize?: "sm" | "md" | "lg" | number;
  gap?: number;
  locale?: string;
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  tooltipFormatter?: (date: Date, value: number) => React.ReactNode;
  onSelectDay?: (date: Date, value: number) => void;
};

function CalendarHeatmap({
  data,
  endDate,
  startDate,
  months = 12,
  weekStartsOn = 0,
  levels = 5,
  thresholds,
  classForLevel,
  cellSize = "md",
  gap = 3,
  locale,
  showMonthLabels = true,
  showWeekdayLabels = true,
  tooltipFormatter,
  onSelectDay,
  className,
  ...props
}: CalendarHeatmapProps) {
  const size = resolveCellSize(cellSize);
  const today = React.useMemo(() => toLocalDate(new Date()), []);

  const { cells, weekCount, monthLabels, weekdayLabels } = React.useMemo(() => {
    const rangeEnd = endDate ? toLocalDate(endDate) : today;
    const rangeStart = startDate
      ? toLocalDate(startDate)
      : new Date(
          rangeEnd.getFullYear(),
          rangeEnd.getMonth() - months,
          rangeEnd.getDate() + 1,
        );

    const values = new Map<number, number>();
    for (const datum of data) {
      const key = dayKey(toLocalDate(datum.date));
      values.set(key, (values.get(key) ?? 0) + datum.value);
    }

    const leading = (rangeStart.getDay() - weekStartsOn + 7) % 7;
    const gridStart = addDays(rangeStart, -leading);
    const totalDays =
      Math.round((rangeEnd.getTime() - gridStart.getTime()) / 86400000) + 1;
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
      Array.from(
        { length: Math.max(levels - 1, 0) },
        (_, i) => (max * (i + 1)) / Math.max(levels - 1, 1),
      );

    const levelFor = (value: number) => {
      if (value <= 0) return 0;
      let level = 0;
      for (const cut of cuts) {
        if (value >= cut) level += 1;
      }
      return Math.min(level, levels - 1);
    };

    const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: "short" });

    const grid: {
      date: Date;
      value: number;
      level: number;
      inRange: boolean;
    }[] = [];
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

    const weekdays = Array.from({ length: 7 }, (_, row) => {
      const day = (weekStartsOn + row) % 7;
      return {
        label: dayFormatter.format(new Date(2024, 0, 7 + day)),
        visible: day === 1 || day === 3 || day === 5,
      };
    });

    return {
      cells: grid,
      weekCount: weeks,
      monthLabels: labels,
      weekdayLabels: weekdays,
    };
  }, [
    data,
    endDate,
    startDate,
    months,
    weekStartsOn,
    levels,
    thresholds,
    locale,
    today,
  ]);

  const resolveLevelClass =
    classForLevel ?? ((level: number) => defaultClassForLevel(level, levels));

  const defaultFormatter = React.useCallback(
    (date: Date, value: number) => {
      const formatted = new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
      return `${value} contribution${value === 1 ? "" : "s"} · ${formatted}`;
    },
    [locale],
  );

  const formatTooltip = tooltipFormatter ?? defaultFormatter;

  return (
    <div
      data-slot="calendar-heatmap"
      className={cn("w-fit", className)}
      {...props}
    >
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <div className="flex flex-col" style={{ gap }}>
          {showMonthLabels && (
            <div className="flex" style={{ gap }}>
              {showWeekdayLabels && (
                <div aria-hidden className="w-8 shrink-0" />
              )}
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
                    className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
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
                      "flex items-center text-[10px] leading-none text-muted-foreground",
                      !weekday.visible && "invisible",
                    )}
                  >
                    {weekday.label}
                  </span>
                ))}
              </div>
            )}
            <div
              data-slot="calendar-heatmap-grid"
              className="grid grid-flow-col"
              style={{
                gridTemplateRows: `repeat(7, ${size}px)`,
                gridTemplateColumns: `repeat(${weekCount}, ${size}px)`,
                gap,
              }}
            >
              {cells.map((cell) => {
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
                const label = defaultFormatter(cell.date, cell.value);
                const cellClassName = cn(
                  "rounded-[2px]",
                  resolveLevelClass(cell.level),
                  onSelectDay &&
                    "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                );
                return (
                  <Tooltip key={cell.date.getTime()}>
                    <TooltipTrigger asChild>
                      {onSelectDay ? (
                        <button
                          type="button"
                          data-slot="calendar-heatmap-cell"
                          data-level={cell.level}
                          aria-label={label}
                          className={cellClassName}
                          onClick={() => onSelectDay(cell.date, cell.value)}
                        />
                      ) : (
                        <div
                          data-slot="calendar-heatmap-cell"
                          data-level={cell.level}
                          aria-label={label}
                          className={cellClassName}
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {formatTooltip(cell.date, cell.value)}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}

type CalendarHeatmapLegendProps = React.ComponentProps<"div"> & {
  levels?: number;
  classForLevel?: (level: number) => string;
  cellSize?: "sm" | "md" | "lg" | number;
  gap?: number;
  lessLabel?: React.ReactNode;
  moreLabel?: React.ReactNode;
};

function CalendarHeatmapLegend({
  levels = 5,
  classForLevel,
  cellSize = "md",
  gap = 3,
  lessLabel = "Less",
  moreLabel = "More",
  className,
  ...props
}: CalendarHeatmapLegendProps) {
  const size = resolveCellSize(cellSize);
  const resolveLevelClass =
    classForLevel ?? ((level: number) => defaultClassForLevel(level, levels));

  return (
    <div
      data-slot="calendar-heatmap-legend"
      className={cn(
        "flex w-fit items-center gap-1.5 text-[10px] text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span data-slot="calendar-heatmap-legend-label">{lessLabel}</span>
      <div className="flex" style={{ gap }}>
        {Array.from({ length: levels }, (_, level) => (
          <span
            key={level}
            data-slot="calendar-heatmap-legend-swatch"
            data-level={level}
            className={cn("rounded-[2px]", resolveLevelClass(level))}
            style={{ width: size, height: size }}
          />
        ))}
      </div>
      <span data-slot="calendar-heatmap-legend-label">{moreLabel}</span>
    </div>
  );
}

export { CalendarHeatmap, CalendarHeatmapLegend };
export type { CalendarHeatmapDatum };
