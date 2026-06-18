"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: readonly LogLevel[] = ["debug", "info", "warn", "error"];

type LogViewerContextValue = {
  query: string;
  setQuery: (query: string) => void;
  active: Record<LogLevel, boolean>;
  toggleLevel: (level: LogLevel) => void;
  count: number;
  register: (id: string, level: LogLevel, text: string) => void;
  unregister: (id: string) => void;
};

const LogViewerContext = React.createContext<LogViewerContextValue | null>(null);

function useLogViewer() {
  const context = React.useContext(LogViewerContext);
  if (!context) {
    throw new Error("LogViewer parts must be used within <LogViewer>.");
  }
  return context;
}

function lineMatches(
  level: LogLevel,
  text: string,
  query: string,
  active: Record<LogLevel, boolean>,
) {
  if (!active[level]) {
    return false;
  }
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return true;
  }
  return text.toLowerCase().includes(trimmed);
}

type LogViewerProps = React.ComponentProps<"div"> & {
  /** Show the pulsing tailing indicator and "Live" label in the toolbar. */
  live?: boolean;
};

function LogViewer({ live = false, className, children, ...props }: LogViewerProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState<Record<LogLevel, boolean>>({
    debug: true,
    info: true,
    warn: true,
    error: true,
  });

  const linesRef = React.useRef(new Map<string, { level: LogLevel; text: string }>());
  const [count, setCount] = React.useState(0);

  const recount = React.useCallback(() => {
    let next = 0;
    for (const { level, text } of linesRef.current.values()) {
      if (lineMatches(level, text, query, active)) {
        next += 1;
      }
    }
    setCount(next);
  }, [query, active]);

  const register = React.useCallback(
    (id: string, level: LogLevel, text: string) => {
      linesRef.current.set(id, { level, text });
      recount();
    },
    [recount],
  );

  const unregister = React.useCallback(
    (id: string) => {
      linesRef.current.delete(id);
      recount();
    },
    [recount],
  );

  const toggleLevel = React.useCallback((level: LogLevel) => {
    setActive((prev) => ({ ...prev, [level]: !prev[level] }));
  }, []);

  React.useEffect(() => {
    recount();
  }, [recount]);

  const value = React.useMemo<LogViewerContextValue>(
    () => ({ query, setQuery, active, toggleLevel, count, register, unregister }),
    [query, active, toggleLevel, count, register, unregister],
  );

  return (
    <LogViewerContext.Provider value={value}>
      <div
        data-slot="log-viewer"
        data-live={live || undefined}
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-md border border-border bg-card",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </LogViewerContext.Provider>
  );
}

type LogViewerToolbarProps = React.ComponentProps<"div">;

function LogViewerToolbar({ className, children, ...props }: LogViewerToolbarProps) {
  return (
    <div
      data-slot="log-viewer-toolbar"
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-3 py-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type LogViewerSearchProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "value" | "onChange"
> & {
  /** Placeholder for the search field. */
  placeholder?: string;
};

function LogViewerSearch({
  className,
  placeholder = "Search logs",
  ...props
}: LogViewerSearchProps) {
  const { query, setQuery } = useLogViewer();

  return (
    <InputGroup
      data-slot="log-viewer-search"
      className={cn("h-8 min-w-44 flex-1", className)}
    >
      <InputGroupAddon>
        <Search aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label="Search logs"
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        {...props}
      />
      {query ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <X aria-hidden />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

const LEVEL_LABEL: Record<LogLevel, string> = {
  debug: "Debug",
  info: "Info",
  warn: "Warn",
  error: "Error",
};

const levelChipVariants = cva(
  "h-7 rounded-full px-2.5 font-mono text-[11px] uppercase tracking-[0.08em] data-[on=false]:opacity-50",
  {
    variants: {
      level: {
        debug: "data-[on=true]:text-muted-foreground",
        info: "data-[on=true]:text-foreground",
        warn: "data-[on=true]:text-warning",
        error: "data-[on=true]:text-destructive",
      },
    },
    defaultVariants: {
      level: "info",
    },
  },
);

type LogViewerLevelFilterProps = React.ComponentProps<"div"> & {
  /** Levels to expose as toggle chips. Defaults to all four. */
  levels?: readonly LogLevel[];
};

function LogViewerLevelFilter({
  levels = LEVELS,
  className,
  ...props
}: LogViewerLevelFilterProps) {
  const { active, toggleLevel } = useLogViewer();

  return (
    <div
      data-slot="log-viewer-level-filter"
      role="group"
      aria-label="Filter by level"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {levels.map((level) => {
        const on = active[level];
        return (
          <Button
            key={level}
            type="button"
            variant="ghost"
            size="sm"
            role="switch"
            aria-checked={on}
            data-level={level}
            data-on={on}
            onClick={() => toggleLevel(level)}
            className={cn(levelChipVariants({ level }))}
          >
            {LEVEL_LABEL[level]}
          </Button>
        );
      })}
    </div>
  );
}

type LogViewerCountProps = React.ComponentProps<"span">;

function LogViewerCount({ className, children, ...props }: LogViewerCountProps) {
  const { count } = useLogViewer();

  return (
    <span
      data-slot="log-viewer-count"
      className={cn(
        "ms-auto shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? `${count} ${count === 1 ? "line" : "lines"}`}
    </span>
  );
}

type LogViewerLiveProps = React.ComponentProps<"span"> & {
  /** Label shown next to the pulsing dot. */
  label?: string;
};

function LogViewerLive({
  className,
  label = "Live",
  children,
  ...props
}: LogViewerLiveProps) {
  return (
    <span
      data-slot="log-viewer-live"
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span className="state-dot" aria-hidden />
      {children ?? label}
    </span>
  );
}

type LogViewerBodyProps = React.ComponentProps<"div"> & {
  /** Wrap long lines instead of scrolling them horizontally. */
  wrap?: boolean;
};

function LogViewerBody({
  wrap = false,
  className,
  children,
  ...props
}: LogViewerBodyProps) {
  return (
    <div
      data-slot="log-viewer-body"
      data-wrap={wrap || undefined}
      role="log"
      aria-live="polite"
      className={cn(
        "max-h-80 min-h-0 overflow-auto bg-card py-1.5 font-mono text-[12px] leading-relaxed",
        wrap ? "[&_[data-slot=log-line]]:whitespace-pre-wrap" : "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function highlight(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return text;
  }
  const lower = text.toLowerCase();
  const needle = trimmed.toLowerCase();
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let found = lower.indexOf(needle, cursor);
  let key = 0;

  while (found !== -1) {
    if (found > cursor) {
      parts.push(text.slice(cursor, found));
    }
    parts.push(
      <mark
        key={key++}
        data-slot="log-line-match"
        className="rounded-[2px] bg-primary/20 text-foreground"
      >
        {text.slice(found, found + needle.length)}
      </mark>,
    );
    cursor = found + needle.length;
    found = lower.indexOf(needle, cursor);
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

const logLineVariants = cva("shrink-0", {
  variants: {
    level: {
      debug: "text-muted-foreground",
      info: "text-muted-foreground",
      warn: "text-warning",
      error: "text-destructive",
    },
  },
  defaultVariants: {
    level: "info",
  },
});

type LogLineProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Severity of this line. Drives its level tag and message color. */
  level: LogLevel;
  /** Timestamp shown before the message, e.g. "12:04:31". */
  time?: string;
  children: string;
};

function LogLine({
  level,
  time,
  className,
  children,
  ...props
}: LogLineProps) {
  const { query, active, register, unregister } = useLogViewer();
  const id = React.useId();

  const text = children;

  React.useEffect(() => {
    register(id, level, text);
    return () => unregister(id);
  }, [id, level, text, register, unregister]);

  if (!lineMatches(level, text, query, active)) {
    return null;
  }

  return (
    <div
      data-slot="log-line"
      data-level={level}
      className={cn(
        "flex items-baseline gap-2.5 px-3 py-0.5 hover:bg-accent/40",
        className,
      )}
      {...props}
    >
      {time ? (
        <time
          data-slot="log-line-time"
          className="shrink-0 text-muted-foreground/70 tabular-nums"
        >
          {time}
        </time>
      ) : null}
      <span
        data-slot="log-line-level"
        className={cn(
          logLineVariants({ level }),
          "w-12 uppercase tracking-[0.06em]",
        )}
      >
        {level}
      </span>
      <span data-slot="log-line-message" className="min-w-0 text-foreground">
        {highlight(text, query)}
      </span>
    </div>
  );
}

export {
  LogViewer,
  LogViewerToolbar,
  LogViewerSearch,
  LogViewerLevelFilter,
  LogViewerCount,
  LogViewerLive,
  LogViewerBody,
  LogLine,
};
