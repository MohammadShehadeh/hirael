"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TerminalEntry = {
  id: string
  node: React.ReactNode
}

type TerminalContextValue = {
  entries: TerminalEntry[]
  pushLine: (node: React.ReactNode) => void
  clear: () => void
  history: string[]
  pushHistory: (command: string) => void
}

const TerminalContext = React.createContext<TerminalContextValue | null>(null)

function useTerminal() {
  const context = React.useContext(TerminalContext)
  if (!context) {
    throw new Error("Terminal parts must be used within <Terminal>.")
  }
  return context
}

type TerminalProps = React.ComponentProps<"div">

function Terminal({ className, children, ...props }: TerminalProps) {
  const [entries, setEntries] = React.useState<TerminalEntry[]>([])
  const [history, setHistory] = React.useState<string[]>([])
  const counter = React.useRef(0)

  const pushLine = React.useCallback((node: React.ReactNode) => {
    counter.current += 1
    setEntries((prev) => [...prev, { id: `line-${counter.current}`, node }])
  }, [])

  const clear = React.useCallback(() => {
    setEntries([])
  }, [])

  const pushHistory = React.useCallback((command: string) => {
    setHistory((prev) => [...prev, command])
  }, [])

  const value = React.useMemo<TerminalContextValue>(
    () => ({ entries, pushLine, clear, history, pushHistory }),
    [entries, pushLine, clear, history, pushHistory],
  )

  return (
    <TerminalContext.Provider value={value}>
      <div
        data-slot="terminal"
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TerminalContext.Provider>
  )
}

type TerminalHeaderProps = React.ComponentProps<"div"> & {
  /** Title shown beside the window dots. */
  title?: string
}

function TerminalHeader({
  title,
  className,
  children,
  ...props
}: TerminalHeaderProps) {
  return (
    <div
      data-slot="terminal-header"
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 border-b border-border bg-muted/40 ps-3 pe-3",
        className,
      )}
      {...props}
    >
      <span
        data-slot="terminal-dots"
        aria-hidden
        className="flex items-center gap-1.5"
      >
        <span className="size-3 rounded-full bg-muted-foreground/40" />
        <span className="size-3 rounded-full bg-muted-foreground/40" />
        <span className="size-3 rounded-full bg-muted-foreground/40" />
      </span>
      {title ? (
        <span
          data-slot="terminal-title"
          className="ms-1 truncate font-mono text-xs text-muted-foreground"
        >
          {title}
        </span>
      ) : null}
      {children}
    </div>
  )
}

type TerminalBodyProps = React.ComponentProps<"div">

function TerminalBody({ className, children, ...props }: TerminalBodyProps) {
  const { entries } = useTerminal()
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [entries])

  const seeded: React.ReactNode[] = []
  const trailing: React.ReactNode[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TerminalInput) {
      trailing.push(child)
    } else {
      seeded.push(child)
    }
  })

  return (
    <div
      ref={ref}
      data-slot="terminal-body"
      dir="ltr"
      className={cn(
        "max-h-80 min-h-0 flex-1 space-y-1 overflow-auto bg-card px-3 py-2.5 font-mono text-[13px] leading-relaxed text-foreground",
        className,
      )}
      {...props}
    >
      {seeded}
      {entries.map((entry) => (
        <React.Fragment key={entry.id}>{entry.node}</React.Fragment>
      ))}
      {trailing}
    </div>
  )
}

type TerminalLineProps = React.ComponentProps<"div">

function TerminalLine({ className, ...props }: TerminalLineProps) {
  return (
    <div
      data-slot="terminal-line"
      className={cn("flex items-baseline gap-2", className)}
      {...props}
    />
  )
}

type TerminalPromptProps = React.ComponentProps<"span"> & {
  /** Prompt symbol or user@host:path label. Defaults to "$". */
  symbol?: React.ReactNode
}

function TerminalPrompt({
  symbol = "$",
  className,
  children,
  ...props
}: TerminalPromptProps) {
  return (
    <span
      data-slot="terminal-prompt"
      aria-hidden
      className={cn("shrink-0 select-none font-medium text-primary", className)}
      {...props}
    >
      {children ?? symbol}
    </span>
  )
}

type TerminalOutputTone = "default" | "error" | "muted"

const OUTPUT_TONE: Record<TerminalOutputTone, string> = {
  default: "text-foreground",
  error: "text-destructive",
  muted: "text-muted-foreground",
}

type TerminalOutputProps = React.ComponentProps<"div"> & {
  /** Color treatment for the output text. */
  tone?: TerminalOutputTone
}

function TerminalOutput({
  tone = "default",
  className,
  ...props
}: TerminalOutputProps) {
  return (
    <div
      data-slot="terminal-output"
      data-tone={tone}
      className={cn(
        "whitespace-pre-wrap break-words",
        OUTPUT_TONE[tone],
        className,
      )}
      {...props}
    />
  )
}

type TerminalInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "prefix"
> & {
  /** Prompt symbol shown before the editable line. Defaults to "$". */
  prompt?: React.ReactNode
  /**
   * Runs the entered command and returns the output to append below it.
   * Return a string or node to echo as output, or nothing to echo only the
   * command. The component handles the echo, Up/Down history, and clearing
   * the field.
   */
  onCommand?: (input: string) => React.ReactNode | string | void
}

function TerminalInput({
  prompt = "$",
  onCommand,
  className,
  disabled,
  onKeyDown,
  ...props
}: TerminalInputProps) {
  const { pushLine, history, pushHistory } = useTerminal()
  const [value, setValue] = React.useState("")
  const [cursor, setCursor] = React.useState<number | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const run = () => {
    const command = value
    pushLine(
      <TerminalLine data-slot="terminal-echo">
        <TerminalPrompt symbol={prompt} />
        <span className="min-w-0 flex-1 break-words">{command}</span>
      </TerminalLine>,
    )

    if (command.trim()) {
      pushHistory(command)
    }

    const output = onCommand?.(command)
    if (output != null && output !== "") {
      pushLine(<TerminalOutput>{output}</TerminalOutput>)
    }

    setValue("")
    setCursor(null)
  }

  const recall = (next: number | null) => {
    if (history.length === 0) return
    setCursor(next)
    setValue(next == null ? "" : (history[next] ?? ""))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === "Enter") {
      event.preventDefault()
      run()
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      const next = cursor == null ? history.length - 1 : Math.max(0, cursor - 1)
      recall(next)
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (cursor == null) return
      const next = cursor + 1
      recall(next >= history.length ? null : next)
    }
  }

  return (
    <TerminalLine
      data-slot="terminal-input"
      className={cn("group relative", className)}
      onClick={() => inputRef.current?.focus()}
    >
      <TerminalPrompt symbol={prompt} />
      <span className="relative min-w-0 flex-1">
        <input
          ref={inputRef}
          data-slot="terminal-input-field"
          type="text"
          value={value}
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label="Terminal input"
          onChange={(event) => {
            setValue(event.target.value)
            setCursor(null)
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent font-mono text-[13px] text-foreground caret-transparent outline-none placeholder:text-muted-foreground disabled:opacity-50"
          {...props}
        />
        {!disabled ? (
          <span
            aria-hidden
            data-slot="terminal-caret"
            style={{ insetInlineStart: `${value.length}ch` }}
            className="pointer-events-none absolute top-1/2 h-[1.1em] w-[2px] -translate-y-1/2 animate-caret-blink bg-foreground opacity-0 duration-1000 group-focus-within:opacity-100 motion-reduce:animate-none motion-reduce:group-focus-within:opacity-100"
          />
        ) : null}
      </span>
    </TerminalLine>
  )
}

export {
  Terminal,
  TerminalHeader,
  TerminalBody,
  TerminalLine,
  TerminalPrompt,
  TerminalOutput,
  TerminalInput,
  useTerminal,
}
