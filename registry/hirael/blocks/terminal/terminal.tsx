"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TerminalProps = React.ComponentProps<"div">;

function Terminal({ className, ...props }: TerminalProps) {
  return (
    <div
      data-slot="terminal"
      dir="ltr"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

type TerminalHeaderProps = React.ComponentProps<"div">;

function TerminalHeader({
  className,
  children,
  ...props
}: TerminalHeaderProps) {
  return (
    <div
      data-slot="terminal-header"
      className={cn(
        "flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2",
        className,
      )}
      {...props}
    >
      <span className="flex gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-warning/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
      </span>
      {children ? (
        <span className="ms-1 truncate font-mono text-xs text-muted-foreground">
          {children}
        </span>
      ) : null}
    </div>
  );
}

type TerminalBodyProps = React.ComponentProps<"div"> & {
  /** Stay pinned to the newest line as content grows. */
  follow?: boolean;
};

function TerminalBody({
  follow = true,
  className,
  children,
  ...props
}: TerminalBodyProps) {
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
      data-slot="terminal-body"
      onScroll={onScroll}
      className={cn(
        "max-h-80 overflow-auto p-3 font-mono text-xs leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type TerminalLineProps = React.ComponentProps<"div">;

function TerminalLine({ className, ...props }: TerminalLineProps) {
  return (
    <div
      data-slot="terminal-line"
      className={cn(
        "whitespace-pre-wrap break-words text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type TerminalPromptProps = React.ComponentProps<"span"> & {
  symbol?: React.ReactNode;
};

function TerminalPrompt({
  symbol = "❯",
  className,
  children,
  ...props
}: TerminalPromptProps) {
  return (
    <span
      data-slot="terminal-prompt"
      className={cn("select-none text-success", className)}
      {...props}
    >
      {children ? <span className="text-info">{children} </span> : null}
      {symbol}{" "}
    </span>
  );
}

type TerminalInputProps = Omit<
  React.ComponentProps<"input">,
  "onSubmit" | "value" | "defaultValue"
> & {
  onSubmit?: (command: string) => void;
  symbol?: React.ReactNode;
  user?: React.ReactNode;
};

function TerminalInput({
  onSubmit,
  symbol,
  user,
  className,
  disabled,
  ...props
}: TerminalInputProps) {
  const [value, setValue] = React.useState("");
  const historyRef = React.useRef<string[]>([]);
  const cursorRef = React.useRef(-1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const history = historyRef.current;
    if (event.key === "Enter") {
      const command = value.trim();
      if (command) {
        history.push(command);
        cursorRef.current = history.length;
        onSubmit?.(command);
      }
      setValue("");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      cursorRef.current = Math.max(0, cursorRef.current - 1);
      setValue(history[cursorRef.current] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!history.length) return;
      cursorRef.current = Math.min(history.length, cursorRef.current + 1);
      setValue(history[cursorRef.current] ?? "");
    }
  };

  return (
    <div
      data-slot="terminal-input"
      className={cn("flex items-center", className)}
    >
      <TerminalPrompt symbol={symbol}>{user}</TerminalPrompt>
      <input
        type="text"
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        disabled={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground caret-success outline-none placeholder:text-muted-foreground"
        {...props}
      />
    </div>
  );
}

export {
  Terminal,
  TerminalHeader,
  TerminalBody,
  TerminalLine,
  TerminalPrompt,
  TerminalInput,
};

type TerminalEntry = { kind: "command" | "output" | "error"; text: string };

const TERMINAL_USER = "deploy@edge";

export default function TerminalBlock() {
  const [entries, setEntries] = React.useState<TerminalEntry[]>([
    { kind: "output", text: "hirael cloud shell — type `help` to start" },
  ]);

  function run(command: string) {
    const next: TerminalEntry[] = [{ kind: "command", text: command }];
    const [name, ...args] = command.split(/\s+/);

    switch (name) {
      case "help":
        next.push({
          kind: "output",
          text: "commands: help  ls  status  whoami  echo  clear",
        });
        break;
      case "ls":
        next.push({
          kind: "output",
          text: "services/  infra/  README.md  deploy.sh",
        });
        break;
      case "status":
        next.push({
          kind: "output",
          text: "api  ok    worker  ok    db  degraded",
        });
        break;
      case "whoami":
        next.push({ kind: "output", text: TERMINAL_USER });
        break;
      case "echo":
        next.push({ kind: "output", text: args.join(" ") });
        break;
      case "clear":
        setEntries([]);
        return;
      default:
        next.push({ kind: "error", text: `command not found: ${name}` });
    }

    setEntries((prev) => [...prev, ...next]);
  }

  return (
    <section
      data-slot="terminal-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="w-full max-w-2xl">
        <Terminal>
          <TerminalHeader>{TERMINAL_USER}: ~/app</TerminalHeader>
          <TerminalBody>
            {entries.map((entry, i) => {
              if (entry.kind === "command") {
                return (
                  <TerminalLine key={i}>
                    <TerminalPrompt>{TERMINAL_USER}</TerminalPrompt>
                    {entry.text}
                  </TerminalLine>
                );
              }
              return (
                <TerminalLine
                  key={i}
                  className={
                    entry.kind === "error"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }
                >
                  {entry.text}
                </TerminalLine>
              );
            })}
            <TerminalInput
              user={TERMINAL_USER}
              onSubmit={run}
              aria-label="Terminal command"
            />
          </TerminalBody>
        </Terminal>
      </div>
    </section>
  );
}
