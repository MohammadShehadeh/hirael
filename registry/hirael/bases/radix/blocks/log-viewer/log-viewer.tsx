'use client';

import * as React from 'react';
import { ArrowDownToLine } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Toggle } from '@/registry/hirael/bases/radix/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

const levelText: Record<LogLevel, string> = {
  debug: 'text-muted-foreground',
  info: 'text-info',
  warn: 'text-warning',
  error: 'text-destructive',
  success: 'text-success',
};

const levelLabel: Record<LogLevel, string> = {
  debug: 'DBG',
  info: 'INF',
  warn: 'WRN',
  error: 'ERR',
  success: 'OK ',
};

interface LogViewerProps extends React.ComponentProps<'div'> {
  /** Keep the view pinned to the newest line as content grows (tail -f). */
  follow?: boolean;
}

const LogViewer = ({ follow = true, className, children, ...props }: LogViewerProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const pinnedRef = React.useRef(true);

  const onScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  }, []);

  // Turning follow back on re-pins the view, even if the reader had scrolled up.
  React.useEffect(() => {
    if (follow) pinnedRef.current = true;
  }, [follow]);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !follow || !pinnedRef.current) return;
    el.scrollTop = el.scrollHeight;
  });

  return (
    <div
      ref={ref}
      data-slot="log-viewer"
      onScroll={onScroll}
      className={cn(
        'max-h-72 overflow-auto rounded-lg border border-border bg-card p-3 font-mono text-xs leading-relaxed',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface LogLineProps extends React.ComponentProps<'div'> {
  level?: LogLevel;
  time?: React.ReactNode;
  source?: React.ReactNode;
}

const LogLine = ({ level = 'info', time, source, className, children, ...props }: LogLineProps) => {
  return (
    <div
      data-slot="log-line"
      data-level={level}
      className={cn('flex gap-2 whitespace-pre-wrap break-words px-1 py-0.5', 'hover:bg-muted/50', className)}
      {...props}
    >
      {time ? <span className="shrink-0 text-muted-foreground tabular-nums">{time}</span> : null}
      <span className={cn('shrink-0 select-none font-medium', levelText[level])} aria-label={level}>
        {levelLabel[level]}
      </span>
      {source ? <span className="shrink-0 text-muted-foreground/80">{source}</span> : null}
      <span className="min-w-0 text-foreground">{children}</span>
    </div>
  );
};

export { LogViewer, LogLine };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

interface LogEntry {
  id: number;
  time: string;
  level: LogLevel;
  source: string;
  message: string;
}

const INITIAL_LOGS: Omit<LogEntry, 'id'>[] = [
  { time: '12:04:01', level: 'info', source: '[api]', message: 'listening on :8080' },
  { time: '12:04:01', level: 'debug', source: '[db]', message: 'pool acquired (8 idle, 2 active)' },
  { time: '12:04:02', level: 'success', source: '[api]', message: 'GET /health 200 3ms' },
  { time: '12:04:03', level: 'info', source: '[worker]', message: 'job 4821 started (resize-image)' },
  { time: '12:04:03', level: 'warn', source: '[cache]', message: 'key eviction: memory at 82%' },
  { time: '12:04:04', level: 'info', source: '[api]', message: 'POST /v1/deploy 202 41ms' },
  { time: '12:04:05', level: 'error', source: '[worker]', message: 'job 4821 failed: upstream timeout after 30s' },
  { time: '12:04:05', level: 'warn', source: '[worker]', message: 'retry 1/3 scheduled in 2s' },
  { time: '12:04:07', level: 'success', source: '[worker]', message: 'job 4821 recovered on retry' },
  { time: '12:04:08', level: 'debug', source: '[db]', message: 'slow query 214ms: SELECT * FROM events' },
];

const INCOMING_LOGS: Omit<LogEntry, 'id' | 'time'>[] = [
  { level: 'success', source: '[api]', message: 'GET /v1/projects 200 18ms' },
  { level: 'info', source: '[worker]', message: 'job 4822 started (send-digest)' },
  { level: 'warn', source: '[api]', message: 'rate limit at 90% for key pk_live_7Qx' },
  { level: 'success', source: '[worker]', message: 'job 4822 finished in 1.2s' },
  { level: 'debug', source: '[cache]', message: 'hit ratio 0.94 over last 60s' },
  { level: 'error', source: '[api]', message: 'POST /v1/webhooks 502 upstream closed connection' },
  { level: 'info', source: '[db]', message: 'checkpoint complete (412 buffers)' },
];

const START_SECONDS = 12 * 3600 + 4 * 60 + 8;
const MAX_LINES = 80;

const formatClock = (total: number) =>
  [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

type LogFilter = 'all' | 'info' | 'warn' | 'error';

const FILTERS: { value: LogFilter; label: string; levels: LogLevel[] | null }[] = [
  { value: 'all', label: 'All', levels: null },
  { value: 'info', label: 'Info', levels: ['debug', 'info', 'success'] },
  { value: 'warn', label: 'Warn', levels: ['warn'] },
  { value: 'error', label: 'Error', levels: ['error'] },
];

const matchesFilter = (entry: LogEntry, filter: LogFilter) => {
  const levels = FILTERS.find((option) => option.value === filter)?.levels;
  return !levels || levels.includes(entry.level);
};

const LogViewerBlock = () => {
  const [logs, setLogs] = React.useState<LogEntry[]>(() => INITIAL_LOGS.map((entry, id) => ({ ...entry, id })));
  const [filter, setFilter] = React.useState<LogFilter>('all');
  const [follow, setFollow] = React.useState(true);

  // New lines keep arriving while Follow is on, so the tail has something to follow.
  React.useEffect(() => {
    if (!follow) return;
    const timer = window.setInterval(() => {
      setLogs((current) => {
        const id = (current[current.length - 1]?.id ?? -1) + 1;
        const incoming = INCOMING_LOGS[id % INCOMING_LOGS.length];
        return [...current, { ...incoming, id, time: formatClock(START_SECONDS + id) }].slice(-MAX_LINES);
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [follow]);

  const visible = logs.filter((entry) => matchesFilter(entry, filter));
  const activeLabel = FILTERS.find((option) => option.value === filter)?.label.toLowerCase();

  return (
    <section data-slot="log-viewer-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div data-slot="log-viewer-panel" className={cn(ENTER, 'flex w-full max-w-2xl flex-col gap-3')}>
        <div data-slot="log-viewer-toolbar" className="flex flex-wrap items-center justify-between gap-2">
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            value={filter}
            onValueChange={(value) => {
              if (value) setFilter(value as LogFilter);
            }}
            aria-label="Filter by level"
          >
            {FILTERS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value} className="gap-1.5 px-2.5 text-xs">
                {option.label}
                <span className="tabular-nums text-muted-foreground">
                  {logs.filter((entry) => matchesFilter(entry, option.value)).length}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Toggle
            size="sm"
            variant="outline"
            pressed={follow}
            onPressedChange={setFollow}
            className="gap-1.5 px-2.5 text-xs"
          >
            <ArrowDownToLine aria-hidden className="size-3.5" />
            Follow
            <span
              aria-hidden
              className={cn(
                'size-1.5 rounded-full transition-colors',
                follow ? 'animate-pulse bg-accent-cool motion-reduce:animate-none' : 'bg-muted-foreground/40',
              )}
            />
          </Toggle>
        </div>
        <LogViewer follow={follow} dir="ltr" className="h-72">
          {visible.length ? (
            <div key={filter} className={SWAP}>
              {visible.map((entry) => (
                <LogLine key={entry.id} time={entry.time} level={entry.level} source={entry.source}>
                  {entry.message}
                </LogLine>
              ))}
            </div>
          ) : (
            <p
              key={`${filter}-empty`}
              className={cn(SWAP, 'flex h-full items-center justify-center font-sans text-muted-foreground')}
            >
              No {activeLabel} lines yet.
            </p>
          )}
        </LogViewer>
      </div>
    </section>
  );
};

export default LogViewerBlock;
