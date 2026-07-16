"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type LogLevel = "debug" | "info" | "warn" | "error" | "success";

const levelText: Record<LogLevel, string> = {
  debug: "text-muted-foreground",
  info: "text-info",
  warn: "text-warning",
  error: "text-destructive",
  success: "text-success",
};

const levelLabel: Record<LogLevel, string> = {
  debug: "DBG",
  info: "INF",
  warn: "WRN",
  error: "ERR",
  success: "OK ",
};

type LogViewerProps = React.ComponentProps<"div"> & {
  /** Keep the view pinned to the newest line as content grows (tail -f). */
  follow?: boolean;
};

function LogViewer({
  follow = true,
  className,
  children,
  ...props
}: LogViewerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const pinnedRef = React.useRef(true);

  const onScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  }, []);

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
        "max-h-72 overflow-auto rounded-lg border border-border bg-card p-3 font-mono text-xs leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type LogLineProps = React.ComponentProps<"div"> & {
  level?: LogLevel;
  time?: React.ReactNode;
  source?: React.ReactNode;
};

function LogLine({
  level = "info",
  time,
  source,
  className,
  children,
  ...props
}: LogLineProps) {
  return (
    <div
      data-slot="log-line"
      data-level={level}
      className={cn(
        "flex gap-2 whitespace-pre-wrap break-words px-1 py-0.5",
        "hover:bg-muted/50",
        className,
      )}
      {...props}
    >
      {time ? (
        <span className="shrink-0 text-muted-foreground tabular-nums">
          {time}
        </span>
      ) : null}
      <span
        className={cn("shrink-0 select-none font-medium", levelText[level])}
        aria-label={level}
      >
        {levelLabel[level]}
      </span>
      {source ? (
        <span className="shrink-0 text-muted-foreground/80">{source}</span>
      ) : null}
      <span className="min-w-0 text-foreground">{children}</span>
    </div>
  );
}

export { LogViewer, LogLine };
