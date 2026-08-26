"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  MoreHorizontal,
  PanelLeft,
  Pencil,
  Plus,
  Search,
  Share2,
  Sparkles,
  Square,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/hirael/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/registry/hirael/ui/sheet";
import { Textarea } from "@/registry/hirael/ui/textarea";

export type AiChatRole = "user" | "assistant";

type SheetSide = "left" | "right";

interface AiChatContextValue {
  mobileOpen: boolean;
  mobileSide: SheetSide;
  openMobile: (side: SheetSide) => void;
  closeMobile: () => void;
}

const AiChatContext = React.createContext<AiChatContextValue | null>(null);

const useAiChat = () => {
  const context = React.useContext(AiChatContext);
  if (!context) {
    throw new Error("AiChat parts must be rendered inside <AiChat>.");
  }
  return context;
};

type AiChatProps = React.ComponentProps<"div">;

const AiChat = ({ className, ...props }: AiChatProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileSide, setMobileSide] = React.useState<SheetSide>("left");

  const context = React.useMemo<AiChatContextValue>(
    () => ({
      mobileOpen,
      mobileSide,
      openMobile: (side) => {
        setMobileSide(side);
        setMobileOpen(true);
      },
      closeMobile: () => setMobileOpen(false),
    }),
    [mobileOpen, mobileSide],
  );

  return (
    <AiChatContext.Provider value={context}>
      <div
        data-slot="ai-chat"
        className={cn(
          "grid h-svh w-full grid-cols-1 bg-background text-foreground lg:grid-cols-[280px_minmax(0,1fr)]",
          className,
        )}
        {...props}
      />
    </AiChatContext.Provider>
  );
};

type AiChatSidebarProps = React.ComponentProps<"aside">;

/** Fixed column on lg and up; a sheet below that, opened by AiChatSidebarTrigger. */
const AiChatSidebar = ({
  className,
  children,
  ...props
}: AiChatSidebarProps) => {
  const { mobileOpen, mobileSide, closeMobile } = useAiChat();

  return (
    <>
      <aside
        data-slot="ai-chat-sidebar"
        className={cn(
          "hidden min-h-0 flex-col border-e border-border bg-card lg:flex",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && closeMobile()}>
        <SheetContent
          side={mobileSide}
          data-slot="ai-chat-sidebar-sheet"
          className="w-80 gap-0 p-0 sm:max-w-80"
        >
          <SheetHeader className="h-12 shrink-0 justify-center border-b border-border py-0">
            <SheetTitle className="text-sm">Conversations</SheetTitle>
            <SheetDescription className="sr-only">
              Start a new chat or pick an earlier one.
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    </>
  );
};

type AiChatSidebarTriggerProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
>;

const AiChatSidebarTrigger = ({
  className,
  children,
  ...props
}: AiChatSidebarTriggerProps) => {
  const { openMobile } = useAiChat();
  return (
    <Button
      type="button"
      data-slot="ai-chat-sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      aria-label="Open conversations"
      onClick={(event) => {
        // Sheet sides are physical, so pick the reading-start edge.
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
        openMobile(rtl ? "right" : "left");
      }}
      className={cn("lg:hidden", className)}
      {...props}
    >
      {children ?? <PanelLeft className="rtl:-scale-x-100" aria-hidden />}
    </Button>
  );
};

type AiChatSidebarHeaderProps = React.ComponentProps<"div">;

const AiChatSidebarHeader = ({
  className,
  ...props
}: AiChatSidebarHeaderProps) => {
  return (
    <div
      data-slot="ai-chat-sidebar-header"
      className={cn(
        "flex shrink-0 flex-col gap-2 border-b border-border p-3",
        className,
      )}
      {...props}
    />
  );
};

type AiChatHistoryProps = React.ComponentProps<"nav">;

const AiChatHistory = ({ className, ...props }: AiChatHistoryProps) => {
  return (
    <nav
      data-slot="ai-chat-history"
      aria-label="Conversation history"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2",
        className,
      )}
      {...props}
    />
  );
};

interface AiChatHistoryGroupProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
}

const AiChatHistoryGroup = ({
  label,
  className,
  children,
  ...props
}: AiChatHistoryGroupProps) => {
  return (
    <div
      data-slot="ai-chat-history-group"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <span className="px-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
};

interface AiChatHistoryItemProps extends React.ComponentProps<"button"> {
  active?: boolean;
}

const AiChatHistoryItem = ({
  active = false,
  className,
  children,
  ...props
}: AiChatHistoryItemProps) => {
  return (
    <li data-slot="ai-chat-history-item">
      <button
        type="button"
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex w-full items-center rounded-md px-2 py-1.5 text-start text-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-accent aria-[current=true]:text-foreground",
          className,
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
      </button>
    </li>
  );
};

type AiChatMainProps = React.ComponentProps<"div">;

const AiChatMain = ({ className, ...props }: AiChatMainProps) => {
  return (
    <div
      data-slot="ai-chat-main"
      className={cn("flex min-h-0 min-w-0 flex-col", className)}
      {...props}
    />
  );
};

type AiChatHeaderProps = React.ComponentProps<"header">;

const AiChatHeader = ({ className, ...props }: AiChatHeaderProps) => {
  return (
    <header
      data-slot="ai-chat-header"
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4",
        className,
      )}
      {...props}
    />
  );
};

interface AiChatSuggestionsProps extends React.ComponentProps<"div"> {
  label?: React.ReactNode;
}

const AiChatSuggestions = ({
  label,
  className,
  children,
  ...props
}: AiChatSuggestionsProps) => {
  return (
    <div
      data-slot="ai-chat-suggestions"
      className={cn("flex flex-col items-center gap-3", className)}
      {...props}
    >
      {label ? (
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </span>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  );
};

type AiChatSuggestionProps = React.ComponentProps<"button">;

const AiChatSuggestion = ({
  className,
  children,
  ...props
}: AiChatSuggestionProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="ai-chat-suggestion"
      className={cn("rounded-full", className)}
      {...props}
    >
      {children}
    </Button>
  );
};

const prefersReducedMotion = () => {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

type AiChatMessagesProps = React.ComponentProps<"div">;

/** Scrolls to the newest message while streaming unless the reader scrolled up. */
const AiChatMessages = ({
  className,
  children,
  ...props
}: AiChatMessagesProps) => {
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
    const pinned = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    if (autoScrollingRef.current) {
      if (!pinned) return;
      autoScrollingRef.current = false;
    }
    pinnedRef.current = pinned;
    setAtBottom(pinned);
  }, []);

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) viewport.scrollTop = viewport.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={viewportRef}
      data-slot="ai-chat-messages"
      role="log"
      aria-live="polite"
      onScroll={onScroll}
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain",
        className,
      )}
      {...props}
    >
      <div
        ref={contentRef}
        className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6"
      >
        {children}
        {!atBottom ? (
          <div className="sticky bottom-4 z-10 -mt-6 flex h-0 justify-center overflow-visible">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={scrollToBottom}
              className="-translate-y-full rounded-full shadow-md backdrop-blur"
            >
              <ArrowDown className="size-3.5" aria-hidden />
              Jump to latest
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface AiChatMessageProps extends React.ComponentProps<"div"> {
  role: AiChatRole;
  /** Initials for the user avatar. */
  initials?: string;
  /** Text is still arriving: appends a cursor. */
  streaming?: boolean;
  /** Waiting for the first token: shows the typing dots instead of a bubble. */
  pending?: boolean;
}

const AiChatMessage = ({
  role,
  initials = "ME",
  streaming = false,
  pending = false,
  className,
  children,
  ...props
}: AiChatMessageProps) => {
  const isUser = role === "user";
  return (
    <div
      data-slot="ai-chat-message"
      data-role={role}
      className={cn(
        "flex w-full items-start gap-3",
        isUser && "flex-row-reverse",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium select-none",
          isUser
            ? "bg-muted text-foreground"
            : "border border-border bg-card text-foreground",
        )}
      >
        {isUser ? initials : <Sparkles className="size-3.5" />}
      </span>
      {pending ? (
        <div
          role="status"
          aria-label="Assistant is typing"
          className="inline-flex items-center gap-1 py-2.5"
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
      ) : (
        <div
          aria-busy={streaming || undefined}
          className={cn(
            "min-w-0 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground",
            isUser
              ? "max-w-[85%] rounded-2xl rounded-ee-sm bg-muted px-4 py-2.5"
              : "flex-1 py-1",
          )}
        >
          {children}
          {streaming ? (
            <span
              aria-hidden
              className="ms-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] rounded-[1px] bg-foreground align-baseline animate-pulse motion-reduce:animate-none"
              style={{ animationDuration: "1s" }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

interface AiChatComposerProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "defaultValue" | "value"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  isStreaming?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  hint?: React.ReactNode;
  maxRows?: number;
}

/** Pinned composer: Enter sends, Shift+Enter breaks the line, Stop while streaming. */
const AiChatComposer = ({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  isStreaming = false,
  onStop,
  disabled = false,
  placeholder = "Message the assistant",
  hint = "Enter to send · Shift+Enter for a new line",
  maxRows = 6,
  className,
  ...props
}: AiChatComposerProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const canSubmit = !disabled && value.trim().length > 0;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const submit = () => {
    if (isStreaming || !canSubmit) return;
    onSubmit?.(value.trim());
    if (!isControlled) setInternalValue("");
  };

  React.useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const styles = getComputedStyle(el);
    const lineHeight = parseFloat(styles.lineHeight) || 24;
    const padding =
      (parseFloat(styles.paddingTop) || 0) +
      (parseFloat(styles.paddingBottom) || 0);
    const max = lineHeight * maxRows + padding;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }, [value, maxRows]);

  return (
    <div
      data-slot="ai-chat-composer"
      className={cn(
        "shrink-0 border-t border-border bg-background p-3 sm:p-4",
        className,
      )}
    >
      <form
        data-streaming={isStreaming || undefined}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-xl border border-input bg-card p-2 shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 motion-reduce:transition-none"
        {...props}
      >
        <Textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Message"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              submit();
            }
          }}
          className="min-h-0 resize-none rounded-none border-0 bg-transparent px-2 py-1.5 text-sm leading-6 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center gap-2">
          {hint ? (
            <p className="me-auto px-1 font-mono text-[10px] text-muted-foreground">
              {hint}
            </p>
          ) : null}
          {isStreaming ? (
            <Button
              type="button"
              size="icon-sm"
              aria-label="Stop generating"
              onClick={onStop}
              className="ms-auto rounded-full"
            >
              <Square className="size-3 fill-current" aria-hidden />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon-sm"
              aria-label="Send message"
              disabled={!canSubmit}
              className="ms-auto rounded-full"
            >
              <ArrowUp aria-hidden />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export {
  AiChat,
  AiChatSidebar,
  AiChatSidebarTrigger,
  AiChatSidebarHeader,
  AiChatHistory,
  AiChatHistoryGroup,
  AiChatHistoryItem,
  AiChatMain,
  AiChatHeader,
  AiChatSuggestions,
  AiChatSuggestion,
  AiChatMessages,
  AiChatMessage,
  AiChatComposer,
  useAiChat,
};

interface HistoryEntry {
  id: string;
  title: string;
}
interface HistoryGroup {
  label: string;
  items: HistoryEntry[];
}

const HISTORY: readonly HistoryGroup[] = [
  {
    label: "Today",
    items: [
      { id: "c1", title: "Latency regression since Tuesday" },
      { id: "c2", title: "Rewrite the onboarding email" },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { id: "c3", title: "Postgres index for the events table" },
      { id: "c4", title: "Q3 roadmap summary for the board" },
    ],
  },
  {
    label: "Last 7 days",
    items: [
      { id: "c5", title: "Cron job retries and backoff" },
      { id: "c6", title: "Terraform module review" },
      { id: "c7", title: "How JWT rotation should work" },
    ],
  },
];

const SUGGESTIONS = [
  "Summarize the last deploy's changes",
  "Write a runbook for a failed migration",
  "Explain this error: ECONNRESET",
  "Draft release notes for v2.4",
] as const;

const REPLIES: Record<string, string> = {
  [SUGGESTIONS[0]]:
    "Deploy #4821 touched three things: the list endpoint now joins events for the new activity column, the worker retries upstream timeouts three times with backoff, and the cache eviction threshold moved from 90% to 80% memory.\n\nThe events join is the one to watch. It runs without an index and is the likely cause of the p95 climb.",
  [SUGGESTIONS[1]]:
    "Runbook: failed migration\n\n1. Stop the deploy. Do not retry the migration blindly; a second run can double-apply partial steps.\n2. Check which step failed with the migration table and the worker logs.\n3. If the failed step is idempotent, rerun it alone. If not, roll back to the previous snapshot.\n4. Confirm the schema matches the app version that is live, then resume the deploy.\n5. Write down what failed and why in the incident channel before closing.",
  [SUGGESTIONS[2]]:
    "ECONNRESET means the other side closed the TCP connection while you were still using it. Common causes: a keep-alive socket reused after the server dropped it, a load balancer idle timeout shorter than your client's, or the upstream process crashing mid-response.\n\nStart by comparing the client keep-alive timeout with the server's. If the server closes at 5s and the client reuses sockets for 10s, you will see exactly this.",
  [SUGGESTIONS[3]]:
    "v2.4\n\nNew: activity column on the accounts list, scheduled exports to S3, and a dark mode toggle in settings.\n\nImproved: list endpoints respond about 40% faster after the events index. Search now matches on plan and status.\n\nFixed: OTP inputs no longer lose focus on paste. Billing emails go out once, not twice.",
};

const replyFor = (prompt: string) => {
  return (
    REPLIES[prompt] ??
    `Here is a first pass on "${prompt}".\n\nThis is a canned reply in the preview, but the streaming, Stop, and scroll behavior are the real thing. Wire onSubmit to your model and stream tokens into the last assistant message.`
  );
};

interface ChatMessage {
  id: string;
  role: AiChatRole;
  text: string;
}

const AiChat01 = () => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [streamingId, setStreamingId] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>("c1");
  const timers = React.useRef<{ timeout?: number; interval?: number }>({});
  const sequence = React.useRef(0);

  React.useEffect(() => {
    const pending = timers.current;
    return () => {
      window.clearTimeout(pending.timeout);
      window.clearInterval(pending.interval);
    };
  }, []);

  const stop = () => {
    window.clearTimeout(timers.current.timeout);
    window.clearInterval(timers.current.interval);
    setStreamingId(null);
  };

  const send = (text: string) => {
    const prompt = text.trim();
    if (!prompt || streamingId) return;
    sequence.current += 1;
    const stamp = sequence.current;
    const replyId = `a-${stamp}`;
    setMessages((prev) => [
      ...prev,
      { id: `u-${stamp}`, role: "user", text: prompt },
      { id: replyId, role: "assistant", text: "" },
    ]);
    setDraft("");
    setActiveId(null);
    setStreamingId(replyId);

    const tokens = replyFor(prompt).match(/\S+\s*/g) ?? [];
    let shown = 0;
    timers.current.timeout = window.setTimeout(() => {
      timers.current.interval = window.setInterval(() => {
        shown += 1;
        const slice = tokens.slice(0, shown).join("");
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, text: slice } : m)),
        );
        if (shown >= tokens.length) {
          window.clearInterval(timers.current.interval);
          setStreamingId(null);
        }
      }, 45);
    }, 600);
  };

  const newChat = () => {
    stop();
    setMessages([]);
    setDraft("");
    setActiveId(null);
  };

  const q = query.trim().toLowerCase();
  const visibleHistory = HISTORY.map((group) => ({
    ...group,
    items: q
      ? group.items.filter((item) => item.title.toLowerCase().includes(q))
      : group.items,
  })).filter((group) => group.items.length > 0);

  const firstPrompt = messages.find((m) => m.role === "user")?.text;
  const title =
    firstPrompt ??
    HISTORY.flatMap((g) => g.items).find((i) => i.id === activeId)?.title ??
    "New chat";

  return (
    <section
      data-slot="ai-chat-01-block"
      className="min-h-svh w-full bg-background"
    >
      <AiChat>
        <AiChatSidebar>
          <AiChatSidebarHeader>
            <Button variant="outline" size="sm" onClick={newChat}>
              <Plus aria-hidden />
              New chat
            </Button>
            <InputGroup className="h-8">
              <InputGroupAddon align="inline-start">
                <Search className="size-3.5" aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search chats"
                aria-label="Search chats"
                className="text-sm"
              />
            </InputGroup>
          </AiChatSidebarHeader>
          <AiChatHistory>
            {visibleHistory.length === 0 ? (
              <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                No chats match &ldquo;{query.trim()}&rdquo;.
              </p>
            ) : (
              visibleHistory.map((group) => (
                <AiChatHistoryGroup key={group.label} label={group.label}>
                  {group.items.map((item) => (
                    <AiChatHistoryItem
                      key={item.id}
                      active={item.id === activeId && messages.length === 0}
                      onClick={() => {
                        newChat();
                        setActiveId(item.id);
                      }}
                    >
                      {item.title}
                    </AiChatHistoryItem>
                  ))}
                </AiChatHistoryGroup>
              ))
            )}
          </AiChatHistory>
        </AiChatSidebar>

        <AiChatMain>
          <AiChatHeader>
            <AiChatSidebarTrigger className="-ms-1" />
            <h1 className="min-w-0 flex-1 truncate text-sm font-medium">
              {title}
            </h1>
            <Badge
              variant="outline"
              className="hidden font-mono sm:inline-flex"
            >
              plinth-2-pro
            </Badge>
            <Button variant="ghost" size="icon-sm" aria-label="Share chat">
              <Share2 aria-hidden />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="More actions"
                >
                  <MoreHorizontal aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Pencil />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download />
                  Export as Markdown
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={newChat}>
                  <Trash2 />
                  Delete chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </AiChatHeader>

          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
                  plinth-2-pro
                </span>
                <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                  What are you working on?
                </h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Ask a question, paste an error, or start from one of these.
                </p>
              </div>
              <AiChatSuggestions>
                {SUGGESTIONS.map((suggestion) => (
                  <AiChatSuggestion
                    key={suggestion}
                    onClick={() => send(suggestion)}
                  >
                    {suggestion}
                  </AiChatSuggestion>
                ))}
              </AiChatSuggestions>
            </div>
          ) : (
            <AiChatMessages>
              {messages.map((message) => (
                <AiChatMessage
                  key={message.id}
                  role={message.role}
                  initials="MS"
                  pending={message.id === streamingId && message.text === ""}
                  streaming={message.id === streamingId && message.text !== ""}
                >
                  {message.text}
                </AiChatMessage>
              ))}
            </AiChatMessages>
          )}

          <AiChatComposer
            value={draft}
            onValueChange={setDraft}
            onSubmit={send}
            isStreaming={streamingId !== null}
            onStop={stop}
            placeholder="Ask about the last deploy, or paste an error"
          />
        </AiChatMain>
      </AiChat>
    </section>
  );
};

export default AiChat01;
