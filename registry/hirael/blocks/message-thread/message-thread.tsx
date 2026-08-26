"use client";

import * as React from "react";
import {
  ArrowDown,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/registry/hirael/components/copy-button";
import { Button } from "@/registry/hirael/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/hirael/ui/collapsible";

export type MessageRole = "user" | "assistant" | "system";
export type MessageToolCallStatus = "running" | "done" | "error";

interface MessageThreadContextValue {
  atBottom: boolean;
  scrollToBottom: () => void;}

const MessageThreadContext =
  React.createContext<MessageThreadContextValue | null>(null);

const useMessageThread = () => {
  const context = React.useContext(MessageThreadContext);
  if (!context) {
    throw new Error(
      "MessageThread parts must be rendered inside <MessageThread>.",
    );
  }
  return context;
};

const prefersReducedMotion = () => {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

interface MessageThreadProps extends React.ComponentProps<"div"> {
  /** Keep the newest message in view while content streams in. */
  follow?: boolean;
  /** How close to the bottom (px) still counts as "at the bottom". */
  threshold?: number;}

const MessageThread = ({
  follow = true,
  threshold = 48,
  className,
  children,
  ...props
}: MessageThreadProps) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const pinnedRef = React.useRef(true);
  const autoScrollingRef = React.useRef(false);
  const [atBottom, setAtBottom] = React.useState(true);

  const scrollToBottom = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    pinnedRef.current = true;
    autoScrollingRef.current = true;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const onScroll = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const pinned = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    // While a programmatic smooth scroll is in flight, ignore the
    // intermediate positions so the pill doesn't flicker.
    if (autoScrollingRef.current) {
      if (!pinned) return;
      autoScrollingRef.current = false;
    }
    pinnedRef.current = pinned;
    setAtBottom(pinned);
  }, [threshold]);

  // Streaming children grow without re-rendering this container, so watch
  // the content box instead of relying on a render.
  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || !follow) return;
    viewport.scrollTop = viewport.scrollHeight;
    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) viewport.scrollTop = viewport.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [follow]);

  const context = React.useMemo(
    () => ({ atBottom, scrollToBottom }),
    [atBottom, scrollToBottom],
  );

  return (
    <MessageThreadContext.Provider value={context}>
      <div
        ref={viewportRef}
        data-slot="message-thread"
        role="log"
        aria-live="polite"
        onScroll={onScroll}
        className={cn(
          "relative flex flex-col overflow-y-auto overscroll-contain",
          className,
        )}
        {...props}
      >
        <div
          ref={contentRef}
          data-slot="message-thread-content"
          className="flex flex-col gap-6 p-4 sm:p-6"
        >
          {children}
        </div>
      </div>
    </MessageThreadContext.Provider>
  );
};

type MessageThreadScrollButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
>;

/** "Jump to latest" pill. Render it as the last child of the thread. */
const MessageThreadScrollButton = ({
  className,
  children = "Jump to latest",
  ...props
}: MessageThreadScrollButtonProps) => {
  const { atBottom, scrollToBottom } = useMessageThread();
  if (atBottom) return null;

  return (
    <div
      data-slot="message-thread-scroll-button"
      className="sticky bottom-4 z-10 -mt-6 flex h-0 justify-center overflow-visible"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={scrollToBottom}
        className={cn(
          "-translate-y-full rounded-full shadow-md backdrop-blur",
          className,
        )}
        {...props}
      >
        <ArrowDown className="size-3.5" aria-hidden />
        {children}
      </Button>
    </div>
  );
};

const MessageRoleContext = React.createContext<MessageRole>("assistant");

interface MessageProps extends React.ComponentProps<"div"> {
  role?: MessageRole;}

/** User messages sit on the end side, assistant on the start side. */
const Message = ({ role = "assistant", className, ...props }: MessageProps) => {
  return (
    <MessageRoleContext.Provider value={role}>
      <div
        data-slot="message"
        data-role={role}
        className={cn(
          "group/message flex w-full items-start gap-3",
          role === "user" && "flex-row-reverse",
          role === "system" && "justify-center",
          className,
        )}
        {...props}
      />
    </MessageRoleContext.Provider>
  );
};

type MessageBodyProps = React.ComponentProps<"div">;

/** Column next to the avatar: bubble, actions, timestamp, tool calls. */
const MessageBody = ({ className, ...props }: MessageBodyProps) => {
  const role = React.useContext(MessageRoleContext);
  return (
    <div
      data-slot="message-body"
      className={cn(
        "flex min-w-0 flex-col gap-1.5",
        role === "user" && "max-w-[85%] items-end",
        role === "assistant" && "flex-1 items-start",
        role === "system" && "items-center",
        className,
      )}
      {...props}
    />
  );
};

type MessageAvatarProps = React.ComponentProps<"span">;

/** Initials as children; the assistant falls back to a spark icon. */
const MessageAvatar = ({ className, children, ...props }: MessageAvatarProps) => {
  const role = React.useContext(MessageRoleContext);
  return (
    <span
      data-slot="message-avatar"
      aria-hidden
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium select-none",
        role === "assistant"
          ? "border border-border bg-card text-foreground"
          : "bg-muted text-foreground",
        className,
      )}
      {...props}
    >
      {children ??
        (role === "assistant" ? <Sparkles className="size-3.5" /> : null)}
    </span>
  );
};

type MessageContentProps = React.ComponentProps<"div">;

const MessageContent = ({ className, ...props }: MessageContentProps) => {
  const role = React.useContext(MessageRoleContext);
  return (
    <div
      data-slot="message-content"
      className={cn(
        "text-sm leading-relaxed break-words text-foreground [&_p+p]:mt-3",
        role === "user" && "rounded-2xl rounded-ee-sm bg-muted px-4 py-2.5",
        role === "assistant" && "bg-transparent py-1",
        role === "system" &&
          "rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
};

interface MessageActionsProps extends React.ComponentProps<"div"> {
  /** Skip the hover reveal and keep the row visible. */
  alwaysVisible?: boolean;}

const MessageActions = ({
  alwaysVisible = false,
  className,
  ...props
}: MessageActionsProps) => {
  return (
    <div
      data-slot="message-actions"
      role="toolbar"
      aria-label="Message actions"
      className={cn(
        "flex items-center gap-0.5 transition-opacity duration-150 motion-reduce:transition-none",
        !alwaysVisible &&
          "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100 has-[[aria-pressed=true]]:opacity-100 has-[[data-state=copied]]:opacity-100 pointer-coarse:opacity-100",
        className,
      )}
      {...props}
    />
  );
};

interface MessageActionProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
  label: string;
  pressed?: boolean;}

const MessageAction = ({
  label,
  pressed,
  className,
  children,
  ...props
}: MessageActionProps) => {
  return (
    <Button
      type="button"
      data-slot="message-action"
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={cn(
        "size-7 text-muted-foreground hover:text-foreground aria-pressed:bg-accent aria-pressed:text-foreground [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

type MessageTimestampProps = React.ComponentProps<"time">;

const MessageTimestamp = ({ className, ...props }: MessageTimestampProps) => {
  return (
    <time
      data-slot="message-timestamp"
      className={cn(
        "px-1 font-mono text-[10px] text-muted-foreground tabular-nums",
        className,
      )}
      {...props}
    />
  );
};

const toPretty = (value: unknown) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const TOOL_STATUS: Record<
  MessageToolCallStatus,
  { dot: string; label: string }
> = {
  running: {
    dot: "bg-accent-cool animate-pulse motion-reduce:animate-none",
    label: "running",
  },
  done: { dot: "bg-success", label: "done" },
  error: { dot: "bg-destructive", label: "failed" },
};

const ToolSection = ({ label, children }: { label: string; children: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      <pre
        dir="ltr"
        className="overflow-x-auto rounded-md bg-muted/40 p-2 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap text-foreground"
      >
        {children}
      </pre>
    </div>
  );
};

interface MessageToolCallProps extends Omit<
  React.ComponentProps<typeof Collapsible>,
  "children"
> {
  name: string;
  status?: MessageToolCallStatus;
  /** Objects are pretty-printed as JSON, strings are shown as-is. */
  args?: unknown;
  result?: unknown;
  children?: React.ReactNode;}

const MessageToolCall = ({
  name,
  status = "done",
  args,
  result,
  className,
  children,
  ...props
}: MessageToolCallProps) => {
  const tone = TOOL_STATUS[status];
  return (
    <Collapsible
      data-slot="message-tool-call"
      data-status={status}
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-md border border-border bg-card",
        className,
      )}
      {...props}
    >
      <CollapsibleTrigger className="group/tool flex w-full items-center gap-2 px-3 py-2 text-start font-mono text-xs outline-none hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
        <span
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-full", tone.dot)}
        />
        <span className="truncate text-foreground">{name}</span>
        <span className="ms-auto shrink-0 text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
          {tone.label}
        </span>
        <ChevronDown
          className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/tool:rotate-180 motion-reduce:transition-none"
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border">
        <div className="flex flex-col gap-3 p-3">
          {args !== undefined ? (
            <ToolSection label="Arguments">{toPretty(args)}</ToolSection>
          ) : null}
          {result !== undefined ? (
            <ToolSection label="Result">{toPretty(result)}</ToolSection>
          ) : null}
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface MessageReasoningProps extends Omit<
  React.ComponentProps<typeof Collapsible>,
  "children"
> {
  /** Seconds spent thinking; renders "Thought for 4s". */
  duration?: number;
  /** Still going: the label pulses and reads "Thinking". */
  isThinking?: boolean;
  label?: React.ReactNode;
  children?: React.ReactNode;}

const MessageReasoning = ({
  duration,
  isThinking = false,
  label,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: MessageReasoningProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const text =
    label ??
    (isThinking
      ? "Thinking"
      : duration != null
        ? `Thought for ${duration}s`
        : "Reasoning");

  return (
    <Collapsible
      data-slot="message-reasoning"
      data-thinking={isThinking || undefined}
      open={open}
      onOpenChange={(next) => {
        setInternalOpen(next);
        onOpenChange?.(next);
      }}
      className={cn("flex w-full max-w-xl flex-col", className)}
      {...props}
    >
      <CollapsibleTrigger className="inline-flex w-fit items-center gap-1.5 rounded-md py-1 pe-2 ps-1 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 transition-transform motion-reduce:transition-none",
            open ? "rotate-90" : "rtl:rotate-180",
          )}
          aria-hidden
        />
        <span
          className={cn(
            isThinking && "animate-pulse motion-reduce:animate-none",
          )}
        >
          {text}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ms-2.5 border-s-2 border-border py-1 ps-3 text-sm leading-relaxed text-muted-foreground [&_p+p]:mt-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

type MessageStreamingCursorProps = React.ComponentProps<"span">;

/** Blinking block cursor to append while text is still arriving. */
const MessageStreamingCursor = ({
  className,
  style,
  ...props
}: MessageStreamingCursorProps) => {
  return (
    <span
      data-slot="message-streaming-cursor"
      aria-hidden
      className={cn(
        "ms-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] rounded-[1px] bg-foreground align-baseline animate-pulse motion-reduce:animate-none",
        className,
      )}
      style={{ animationDuration: "1s", ...style }}
      {...props}
    />
  );
};

interface MessageTypingProps extends React.ComponentProps<"div"> {
  label?: string;}

const MessageTyping = ({
  label = "Assistant is typing",
  className,
  ...props
}: MessageTypingProps) => {
  return (
    <div
      data-slot="message-typing"
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-1 py-2.5", className)}
      {...props}
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          aria-hidden
          className="size-1.5 rounded-full bg-muted-foreground animate-bounce motion-reduce:animate-none"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
};

interface MessageSourcesProps extends React.ComponentProps<"div"> {
  label?: React.ReactNode;}

const MessageSources = ({
  label = "Sources",
  className,
  children,
  ...props
}: MessageSourcesProps) => {
  return (
    <div
      data-slot="message-sources"
      className={cn(
        "flex flex-wrap items-center gap-1.5 [counter-reset:source]",
        className,
      )}
      {...props}
    >
      {label ? (
        <span className="me-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
};

type MessageSourceProps = React.ComponentProps<"a">;

/** Numbered citation chip; numbering is automatic within MessageSources. */
const MessageSource = ({ className, children, ...props }: MessageSourceProps) => {
  return (
    <a
      data-slot="message-source"
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card py-0.5 pe-2.5 ps-1 text-xs text-foreground transition-colors [counter-increment:source] hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] tabular-nums before:content-[counter(source)]"
      />
      <span className="truncate">{children}</span>
    </a>
  );
};

export {
  MessageThread,
  MessageThreadScrollButton,
  Message,
  MessageBody,
  MessageAvatar,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageTimestamp,
  MessageToolCall,
  MessageReasoning,
  MessageStreamingCursor,
  MessageTyping,
  MessageSources,
  MessageSource,
  useMessageThread,
};

const FIRST_ANSWER = [
  "p95 went from about 180ms to 340ms, and the step change lines up with Tuesday's 14:10 UTC deploy, which added the events join to the list endpoint.",
  "The query plan shows a sequential scan on events. There is no index on (account_id, created_at). Adding one should bring p95 back down without a rollback.",
];

const STREAMED_ANSWER = [
  "Here is a draft you can paste into #incidents:",
  "Heads up: API p95 latency has been elevated since Tuesday's 14:10 UTC deploy, around 340ms instead of 180ms. Root cause is a sequential scan on the new events join in the list endpoint. We are adding an index on events (account_id, created_at) and expect p95 to recover within the hour. No errors, only slower responses.",
  "Want me to open the migration PR as well?",
].join("\n\n");

type Feedback = "up" | "down" | null;

const FeedbackActions = ({
  copyText,
  onRegenerate,
}: {
  copyText: string;
  onRegenerate?: () => void;
}) => {
  const [feedback, setFeedback] = React.useState<Feedback>(null);
  return (
    <MessageActions>
      <CopyButton value={copyText} size="sm" />
      <MessageAction
        label="Good response"
        pressed={feedback === "up"}
        onClick={() => setFeedback((f) => (f === "up" ? null : "up"))}
      >
        <ThumbsUp aria-hidden />
      </MessageAction>
      <MessageAction
        label="Bad response"
        pressed={feedback === "down"}
        onClick={() => setFeedback((f) => (f === "down" ? null : "down"))}
      >
        <ThumbsDown aria-hidden />
      </MessageAction>
      {onRegenerate ? (
        <MessageAction label="Regenerate" onClick={onRegenerate}>
          <RefreshCw aria-hidden />
        </MessageAction>
      ) : null}
    </MessageActions>
  );
};

/** Reveals `text` word by word on mount; remount (change the key) to replay. */
const StreamedMessage = ({
  text,
  onReplay,
}: {
  text: string;
  onReplay: () => void;
}) => {
  const tokens = text.match(/\S+\s*/g) ?? [];
  const [count, setCount] = React.useState(0);
  const done = count >= tokens.length;

  React.useEffect(() => {
    if (done) return;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => setCount((c) => c + 1), 55);
    }, 600);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [done]);

  const visible = tokens.slice(0, count).join("");
  const paragraphs = visible.split("\n\n");

  return (
    <Message role="assistant">
      <MessageAvatar />
      <MessageBody>
        {count === 0 ? (
          <MessageTyping />
        ) : (
          <MessageContent aria-busy={!done}>
            {paragraphs.map((paragraph, i) => (
              <p key={i}>
                {paragraph}
                {!done && i === paragraphs.length - 1 ? (
                  <MessageStreamingCursor />
                ) : null}
              </p>
            ))}
          </MessageContent>
        )}
        {done ? (
          <>
            <FeedbackActions copyText={text} onRegenerate={onReplay} />
            <MessageTimestamp dateTime="2026-08-25T10:44:00Z">
              10:44
            </MessageTimestamp>
          </>
        ) : null}
      </MessageBody>
    </Message>
  );
};

const MessageThreadBlock = () => {
  const [run, setRun] = React.useState(0);
  const replay = () => setRun((r) => r + 1);

  return (
    <section
      data-slot="message-thread-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2">
          <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            latency regression · plinth-2-pro
          </span>
          <Button variant="outline" size="xs" onClick={replay}>
            <RefreshCw aria-hidden />
            Replay
          </Button>
        </div>

        <MessageThread className="h-[520px]">
          <Message role="system">
            <MessageBody>
              <MessageContent>
                Conversation started · Plinth 2 Pro
              </MessageContent>
            </MessageBody>
          </Message>

          <Message role="user">
            <MessageAvatar>MS</MessageAvatar>
            <MessageBody>
              <MessageContent>
                Our API p95 latency has been climbing since Tuesday. Any idea
                what changed?
              </MessageContent>
              <MessageTimestamp dateTime="2026-08-25T10:41:00Z">
                10:41
              </MessageTimestamp>
            </MessageBody>
          </Message>

          <Message role="assistant">
            <MessageAvatar />
            <MessageBody className="gap-2">
              <MessageReasoning duration={4}>
                <p>
                  The user is asking about a latency regression. Pull the last
                  seven days of p95 for the api service and compare it with the
                  deploy history before guessing at a cause.
                </p>
              </MessageReasoning>
              <MessageToolCall
                name="query_metrics"
                status="done"
                args={{
                  service: "api",
                  metric: "p95_latency_ms",
                  window: "7d",
                }}
                result={{
                  before_ms: 182,
                  after_ms: 341,
                  change: "+87%",
                  first_seen: "2026-08-19T14:10:00Z",
                }}
              />
              <MessageContent>
                {FIRST_ANSWER.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </MessageContent>
              <MessageSources>
                <MessageSource href="#">Grafana · api p95, 7d</MessageSource>
                <MessageSource href="#">Deploy #4821 diff</MessageSource>
                <MessageSource href="#">
                  Runbook · latency regressions
                </MessageSource>
              </MessageSources>
              <FeedbackActions copyText={FIRST_ANSWER.join("\n\n")} />
              <MessageTimestamp dateTime="2026-08-25T10:42:00Z">
                10:42
              </MessageTimestamp>
            </MessageBody>
          </Message>

          <Message role="user">
            <MessageAvatar>MS</MessageAvatar>
            <MessageBody>
              <MessageContent>
                Draft a short update for the incident channel.
              </MessageContent>
              <MessageTimestamp dateTime="2026-08-25T10:43:00Z">
                10:43
              </MessageTimestamp>
            </MessageBody>
          </Message>

          <StreamedMessage key={run} text={STREAMED_ANSWER} onReplay={replay} />

          <MessageThreadScrollButton />
        </MessageThread>
      </div>
    </section>
  );
};

export default MessageThreadBlock;
