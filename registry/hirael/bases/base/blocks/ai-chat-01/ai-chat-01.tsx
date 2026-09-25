'use client';

import * as React from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  MoreHorizontal,
  PanelLeft,
  Pencil,
  Plus,
  Search,
  Share2,
  Sparkles,
  Square,
  Trash2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/registry/hirael/bases/base/ui/alert-dialog';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/base/ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/registry/hirael/bases/base/ui/sheet';

export type AiChatRole = 'user' | 'assistant';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

type SheetSide = 'left' | 'right';

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
    throw new Error('AiChat parts must be rendered inside <AiChat>.');
  }

  return context;
};

type AiChatProps = React.ComponentProps<'div'>;

const AiChat = ({ className, ...props }: AiChatProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileSide, setMobileSide] = React.useState<SheetSide>('left');

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
          'grid h-svh w-full grid-cols-1 bg-background text-foreground lg:grid-cols-[280px_minmax(0,1fr)]',
          className,
        )}
        {...props}
      />
    </AiChatContext.Provider>
  );
};

type AiChatSidebarProps = React.ComponentProps<'aside'>;

const AiChatSidebar = ({ className, children, ...props }: AiChatSidebarProps) => {
  const { mobileOpen, mobileSide, closeMobile } = useAiChat();

  return (
    <>
      <aside
        data-slot="ai-chat-sidebar"
        className={cn('hidden min-h-0 flex-col border-e border-border bg-card lg:flex', className)}
        {...props}
      >
        {children}
      </aside>
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && closeMobile()}>
        <SheetContent side={mobileSide} data-slot="ai-chat-sidebar-sheet" className="w-80 sm:max-w-80">
          <div className="shrink-0 border-b border-border">
            <SheetHeader>
              <SheetTitle>Conversations</SheetTitle>
              <SheetDescription className="sr-only">Start a new chat or pick an earlier one.</SheetDescription>
            </SheetHeader>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    </>
  );
};

type AiChatSidebarTriggerProps = Omit<React.ComponentProps<typeof Button>, 'onClick'>;

const AiChatSidebarTrigger = ({ className, children, ...props }: AiChatSidebarTriggerProps) => {
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
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        openMobile(rtl ? 'right' : 'left');
      }}
      className={cn('lg:hidden', className)}
      {...props}
    >
      {children ?? <PanelLeft className="rtl:-scale-x-100" aria-hidden />}
    </Button>
  );
};

type AiChatSidebarHeaderProps = React.ComponentProps<'div'>;

const AiChatSidebarHeader = ({ className, ...props }: AiChatSidebarHeaderProps) => {
  return (
    <div
      data-slot="ai-chat-sidebar-header"
      className={cn('flex shrink-0 flex-col gap-2 border-b border-border p-3', className)}
      {...props}
    />
  );
};

type AiChatHistoryProps = React.ComponentProps<'nav'>;

const AiChatHistory = ({ className, ...props }: AiChatHistoryProps) => {
  return (
    <nav
      data-slot="ai-chat-history"
      aria-label="Conversation history"
      className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2', className)}
      {...props}
    />
  );
};

interface AiChatHistoryGroupProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
}

const AiChatHistoryGroup = ({ label, className, children, ...props }: AiChatHistoryGroupProps) => {
  return (
    <div data-slot="ai-chat-history-group" className={cn('flex flex-col gap-1', className)} {...props}>
      <span className="px-2 text-xs text-muted-foreground uppercase">{label}</span>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
};

interface AiChatHistoryItemProps extends React.ComponentProps<'button'> {
  active?: boolean;
}

const AiChatHistoryItem = ({ active = false, className, children, ...props }: AiChatHistoryItemProps) => {
  return (
    <li data-slot="ai-chat-history-item">
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        className={cn(
          'flex w-full items-center rounded-md px-2 py-1.5 text-start text-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-accent aria-[current=true]:text-foreground',
          className,
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
      </button>
    </li>
  );
};

type AiChatMainProps = React.ComponentProps<'div'>;

const AiChatMain = ({ className, ...props }: AiChatMainProps) => {
  return <div data-slot="ai-chat-main" className={cn('flex min-h-0 min-w-0 flex-col', className)} {...props} />;
};

type AiChatHeaderProps = React.ComponentProps<'header'>;

const AiChatHeader = ({ className, ...props }: AiChatHeaderProps) => {
  return (
    <header
      data-slot="ai-chat-header"
      className={cn(
        'flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4',
        className,
      )}
      {...props}
    />
  );
};

interface AiChatSuggestionsProps extends React.ComponentProps<'div'> {
  label?: React.ReactNode;
}

const AiChatSuggestions = ({ label, className, children, ...props }: AiChatSuggestionsProps) => {
  return (
    <div data-slot="ai-chat-suggestions" className={cn('flex flex-col items-center gap-3', className)} {...props}>
      {label ? <span className="text-xs text-muted-foreground uppercase">{label}</span> : null}
      <div className="flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  );
};

type AiChatSuggestionProps = React.ComponentProps<'button'>;

const AiChatSuggestion = ({ className, children, ...props }: AiChatSuggestionProps) => {
  return (
    <Button type="button" variant="outline" size="sm" data-slot="ai-chat-suggestion" className={className} {...props}>
      {children}
    </Button>
  );
};

const prefersReducedMotion = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

type AiChatMessagesProps = React.ComponentProps<'div'>;

const AiChatMessages = ({ className, children, ...props }: AiChatMessagesProps) => {
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
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
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
      className={cn('relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain', className)}
      {...props}
    >
      <div ref={contentRef} className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
        {children}
        {!atBottom ? (
          <div className="sticky bottom-4 z-10 -mt-6 flex h-0 justify-center overflow-visible">
            <Button type="button" variant="outline" size="sm" onClick={scrollToBottom} className="-translate-y-full">
              <ArrowDown className="size-3.5" aria-hidden />
              Jump to latest
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface AiChatMessageProps extends React.ComponentProps<'div'> {
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
  initials = 'ME',
  streaming = false,
  pending = false,
  className,
  children,
  ...props
}: AiChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div
      data-slot="ai-chat-message"
      data-role={role}
      className={cn(SWAP, 'flex w-full items-start gap-3', isUser && 'flex-row-reverse', className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium select-none',
          isUser ? 'bg-muted text-foreground' : 'border border-border bg-card text-foreground',
        )}
      >
        {isUser ? initials : <Sparkles className="size-3.5" />}
      </span>
      {pending ? (
        <div role="status" aria-label="Assistant is typing" className="inline-flex items-center gap-1 py-2.5">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              aria-hidden
              className="size-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      ) : (
        <div
          aria-busy={streaming || undefined}
          className={cn(
            'min-w-0 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground',
            isUser ? 'max-w-[85%] rounded-2xl rounded-ee-sm bg-muted px-4 py-2.5' : 'flex-1 py-1',
          )}
        >
          {children}
          {streaming ? (
            <span
              aria-hidden
              className="ms-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-pulse rounded-[1px] bg-foreground align-baseline motion-reduce:animate-none"
              style={{ animationDuration: '1s' }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

interface AiChatComposerProps extends Omit<React.ComponentProps<'form'>, 'onSubmit' | 'defaultValue' | 'value'> {
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

const AiChatComposer = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  isStreaming = false,
  onStop,
  disabled = false,
  placeholder = 'Message the assistant',
  hint = (
    <>
      <span>Enter to send</span>
      <span>Shift+Enter for a new line</span>
    </>
  ),
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
    if (!isControlled) setInternalValue('');
  };

  React.useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const styles = getComputedStyle(el);
    const lineHeight = parseFloat(styles.lineHeight) || 24;
    const padding = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    const max = lineHeight * maxRows + padding;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }, [value, maxRows]);

  return (
    <div
      data-slot="ai-chat-composer"
      className={cn('shrink-0 border-t border-border bg-background p-3 sm:p-4', className)}
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
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Message"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
          className="min-h-0 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-6 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex items-center gap-2">
          {hint ? (
            <p className="me-auto flex flex-wrap gap-x-3 px-1 text-[11px] text-muted-foreground">{hint}</p>
          ) : null}
          {isStreaming ? (
            <Button type="button" size="icon-sm" aria-label="Stop generating" onClick={onStop} className="ms-auto">
              <Square className="size-3 fill-current" aria-hidden />
            </Button>
          ) : (
            <Button type="submit" size="icon-sm" aria-label="Send message" disabled={!canSubmit} className="ms-auto">
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
    label: 'Today',
    items: [
      { id: 'c1', title: 'Latency regression since Tuesday' },
      { id: 'c2', title: 'Rewrite the onboarding email' },
    ],
  },
  {
    label: 'Yesterday',
    items: [{ id: 'c3', title: 'Postgres index for the events table' }],
  },
  {
    label: 'Last 7 days',
    items: [{ id: 'c4', title: 'Cron job retries and backoff' }],
  },
];

const PAST_CONVERSATIONS: Record<string, readonly ChatMessage[]> = {
  c1: [
    {
      id: 'c1-1',
      role: 'user',
      text: "p95 on /api/accounts went from 180ms to 620ms after Tuesday's deploy. Where do I start?",
    },
    {
      id: 'c1-2',
      role: 'assistant',
      text: 'Start with what that deploy changed on the path. Deploy #4821 added a join on events for the activity column, and events has no index on account_id.\n\nRun EXPLAIN ANALYZE on the list query for a real account. If it shows a sequential scan on events, add an index on (account_id, created_at) and p95 should drop back under 200ms.',
    },
    { id: 'c1-3', role: 'user', text: 'Sequential scan confirmed, 1.2M rows. The index is building now.' },
    {
      id: 'c1-4',
      role: 'assistant',
      text: 'Good. Build it with CREATE INDEX CONCURRENTLY so writes keep flowing, then watch p95 for 15 minutes after it finishes. If it stays above 250ms, look at the worker retries next; they changed in the same deploy.',
    },
  ],
  c2: [
    {
      id: 'c2-1',
      role: 'user',
      text: "Rewrite this so it sounds less like a sales pitch: 'Welcome aboard! Unlock the full power of your workspace today.'",
    },
    {
      id: 'c2-2',
      role: 'assistant',
      text: 'Welcome to your workspace.\n\nThree things are worth doing first: invite the people you work with, connect the repository you deploy from, and choose who gets paged when a deploy fails. Each takes about a minute.\n\nIf something looks wrong, reply to this email and a person will answer.',
    },
  ],
  c3: [
    {
      id: 'c3-1',
      role: 'user',
      text: 'Which index should the events table have? We filter by account_id and sort by created_at, newest first.',
    },
    {
      id: 'c3-2',
      role: 'assistant',
      text: 'A composite index on (account_id, created_at DESC). Postgres can then read the newest rows for one account straight from the index, with no sort step.\n\nIf most queries also filter by type, put it in the middle: (account_id, type, created_at DESC).',
    },
  ],
  c4: [
    { id: 'c4-1', role: 'user', text: 'How many times should a nightly cron job retry before it pages someone?' },
    {
      id: 'c4-2',
      role: 'assistant',
      text: 'Three retries with exponential backoff (1, 4, then 16 minutes) covers most transient failures, like a database failover or a rate limit. Page after the third failure, not the first, and put the last error in the alert so whoever is on call does not have to dig for it.',
    },
  ],
};

const SUGGESTIONS = [
  "Summarize the last deploy's changes",
  'Write a runbook for a failed migration',
  'Explain this error: ECONNRESET',
  'Draft release notes for v2.4',
] as const;

const REPLIES: Record<string, string> = {
  [SUGGESTIONS[0]]:
    'Deploy #4821 touched three things: the list endpoint now joins events for the new activity column, the worker retries upstream timeouts three times with backoff, and the cache eviction threshold moved from 90% to 80% memory.\n\nThe events join is the one to watch. It runs without an index and is the likely cause of the p95 climb.',
  [SUGGESTIONS[1]]:
    'Runbook: failed migration\n\n1. Stop the deploy. Do not retry the migration blindly; a second run can double-apply partial steps.\n2. Check which step failed with the migration table and the worker logs.\n3. If the failed step is idempotent, rerun it alone. If not, roll back to the previous snapshot.\n4. Confirm the schema matches the app version that is live, then resume the deploy.\n5. Write down what failed and why in the incident channel before closing.',
  [SUGGESTIONS[2]]:
    "ECONNRESET means the other side closed the TCP connection while you were still using it. Common causes: a keep-alive socket reused after the server dropped it, a load balancer idle timeout shorter than your client's, or the upstream process crashing mid-response.\n\nStart by comparing the client keep-alive timeout with the server's. If the server closes at 5s and the client reuses sockets for 10s, you will see exactly this.",
  [SUGGESTIONS[3]]:
    'v2.4\n\nNew: activity column on the accounts list, scheduled exports to S3, and a dark mode toggle in settings.\n\nImproved: list endpoints respond about 40% faster after the events index. Search now matches on plan and status.\n\nFixed: OTP inputs no longer lose focus on paste. Billing emails go out once, not twice.',
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
  const [draft, setDraft] = React.useState('');
  const [streamingId, setStreamingId] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [titles, setTitles] = React.useState<Record<string, string>>({});
  const [deletedIds, setDeletedIds] = React.useState<string[]>([]);
  const [renaming, setRenaming] = React.useState(false);
  const [titleDraft, setTitleDraft] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const timers = React.useRef<{ timeout?: number; interval?: number; copied?: number }>({});
  const sequence = React.useRef(0);
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const renameRequested = React.useRef(false);
  const renameCancelled = React.useRef(false);

  React.useEffect(() => {
    const pending = timers.current;

    return () => {
      window.clearTimeout(pending.timeout);
      window.clearInterval(pending.interval);
      window.clearTimeout(pending.copied);
    };
  }, []);

  React.useEffect(() => {
    if (renaming) renameInputRef.current?.select();
  }, [renaming]);

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
      { id: `u-${stamp}`, role: 'user', text: prompt },
      { id: replyId, role: 'assistant', text: '' },
    ]);
    setDraft('');
    setStreamingId(replyId);

    const tokens = replyFor(prompt).match(/\S+\s*/g) ?? [];
    let shown = 0;
    timers.current.timeout = window.setTimeout(() => {
      timers.current.interval = window.setInterval(() => {
        shown += 1;
        const slice = tokens.slice(0, shown).join('');
        setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, text: slice } : m)));
        if (shown >= tokens.length) {
          window.clearInterval(timers.current.interval);
          setStreamingId(null);
        }
      }, 45);
    }, 600);
  };

  const openChat = (id: string | null) => {
    stop();
    setMessages(id ? [...(PAST_CONVERSATIONS[id] ?? [])] : []);
    setDraft('');
    setActiveId(id);
    setRenaming(false);
    setCopied(false);
    setTitles((prev) => {
      const next = { ...prev };
      delete next.draft;

      return next;
    });
  };

  const deleteChat = () => {
    if (activeId) setDeletedIds((prev) => [...prev, activeId]);
    openChat(null);
  };

  const shareChat = async () => {
    try {
      await navigator.clipboard.writeText(`https://chat.hirael.com/share/${activeId ?? 'draft'}`);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timers.current.copied);
    timers.current.copied = window.setTimeout(() => setCopied(false), 2000);
  };

  const titleKey = activeId ?? 'draft';

  const titleOf = (item: HistoryEntry) => titles[item.id] ?? item.title;

  const q = query.trim().toLowerCase();
  const visibleHistory = HISTORY.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !deletedIds.includes(item.id) && (!q || titleOf(item).toLowerCase().includes(q)),
    ),
  })).filter((group) => group.items.length > 0);

  const activeEntry = HISTORY.flatMap((g) => g.items).find((i) => i.id === activeId);
  const firstPrompt = messages.find((m) => m.role === 'user')?.text;
  const title = titles[titleKey] ?? (activeEntry ? activeEntry.title : firstPrompt) ?? 'New chat';

  const startRename = () => {
    renameRequested.current = true;
    renameCancelled.current = false;
    setTitleDraft(title);
    setRenaming(true);
  };

  const commitRename = () => {
    if (renameCancelled.current) {
      renameCancelled.current = false;

      return;
    }
    const next = titleDraft.trim();
    if (next) setTitles((prev) => ({ ...prev, [titleKey]: next }));
    setRenaming(false);
  };

  return (
    <section data-slot="ai-chat-01-block" className="min-h-svh w-full bg-background">
      <AiChat>
        <AiChatSidebar>
          <AiChatSidebarHeader>
            <Button variant="outline" size="sm" onClick={() => openChat(null)}>
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
                    <AiChatHistoryItem key={item.id} active={item.id === activeId} onClick={() => openChat(item.id)}>
                      {titleOf(item)}
                    </AiChatHistoryItem>
                  ))}
                </AiChatHistoryGroup>
              ))
            )}
          </AiChatHistory>
        </AiChatSidebar>

        <AiChatMain className={ENTER}>
          <AiChatHeader>
            <AiChatSidebarTrigger className="-ms-1" />
            {renaming ? (
              <form
                className="min-w-0 flex-1"
                onSubmit={(event) => {
                  event.preventDefault();
                  commitRename();
                }}
              >
                <InputGroup className="h-8 max-w-sm">
                  <InputGroupInput
                    ref={renameInputRef}
                    value={titleDraft}
                    onChange={(event) => setTitleDraft(event.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(event) => {
                      if (event.key !== 'Escape') return;
                      renameCancelled.current = true;
                      setRenaming(false);
                    }}
                    aria-label="Chat title"
                  />
                </InputGroup>
              </form>
            ) : (
              <h1 key={title} className={cn(SWAP, 'min-w-0 flex-1 truncate text-sm font-medium')}>
                {title}
              </h1>
            )}
            <Badge variant="outline" className="hidden sm:inline-flex">
              hirael-2-pro
            </Badge>
            <Button variant="ghost" size="sm" aria-label={copied ? 'Link copied' : 'Share chat'} onClick={shareChat}>
              {copied ? <Check aria-hidden /> : <Share2 aria-hidden />}
              {copied ? <span className={cn(SWAP, 'text-xs')}>Copied</span> : null}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="More actions" />}>
                <MoreHorizontal aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48"
                finalFocus={() => {
                  if (!renameRequested.current) return true;
                  renameRequested.current = false;

                  return renameInputRef.current ?? false;
                }}
              >
                <DropdownMenuItem onClick={startRename}>
                  <Pencil />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 />
                  Delete chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogContent data-slot="ai-chat-delete-dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    &ldquo;{title}&rdquo; and its messages are removed for good.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep chat</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      setDeleteOpen(false);
                      deleteChat();
                    }}
                  >
                    Delete chat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </AiChatHeader>

          {messages.length === 0 ? (
            <div
              key={activeId ?? 'new'}
              className={cn(SWAP, 'flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center')}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase">hirael-2-pro</span>
                <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">What are you working on?</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Ask a question, paste an error, or start from one of these.
                </p>
              </div>
              <AiChatSuggestions>
                {SUGGESTIONS.map((suggestion) => (
                  <AiChatSuggestion key={suggestion} onClick={() => send(suggestion)}>
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
                  pending={message.id === streamingId && message.text === ''}
                  streaming={message.id === streamingId && message.text !== ''}
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
