'use client';

import * as React from 'react';
import { ArrowDown, Check, CheckCheck, ChevronDown, MessageCircle, SendHorizontal, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  InputGroupAddon,
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from '@/registry/hirael/bases/radix/ui/input-group';
import { Rating } from '@/registry/hirael/bases/radix/components/rating';

export type ChatMessageStatus = 'sent' | 'delivered' | 'read';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-250 ${EASE} fill-mode-both motion-reduce:animate-none`;
const POP = `animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ${EASE} fill-mode-both motion-reduce:animate-none ltr:origin-bottom-right rtl:origin-bottom-left`;

const stagger = (index: number, step = 80): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

const prefersReducedMotion = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface ChatThreadContextValue {
  atBottom: boolean;
  unseen: boolean;
  scrollToBottom: () => void;
}

const ChatThreadContext = React.createContext<ChatThreadContextValue | null>(null);

const useChatThread = () => {
  const context = React.useContext(ChatThreadContext);
  if (!context) {
    throw new Error('ChatThread parts must be rendered inside <ChatThread>.');
  }

  return context;
};

interface ChatThreadProps extends React.ComponentProps<'div'> {
  /** Id of the newest message. When it changes while the reader is scrolled up, the thread stays put and flags new messages. */
  latestId?: string;
  /** The newest message is the reader's own, so the thread always jumps to it. */
  latestFromSelf?: boolean;
  /** How close to the bottom (px) still counts as the bottom. */
  threshold?: number;
}

const ChatThread = ({
  latestId,
  latestFromSelf = false,
  threshold = 48,
  className,
  children,
  ...props
}: ChatThreadProps) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const pinnedRef = React.useRef(true);
  const autoScrollingRef = React.useRef(false);
  const [atBottom, setAtBottom] = React.useState(true);
  const [unseen, setUnseen] = React.useState(false);
  const [lastSeenId, setLastSeenId] = React.useState(latestId);

  if (latestId !== lastSeenId) {
    setLastSeenId(latestId);
    if (!atBottom && !latestFromSelf) setUnseen(true);
  }

  const scrollToBottom = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    pinnedRef.current = true;
    // Already at the bottom means no scroll event will come to clear the flag.
    autoScrollingRef.current = el.scrollHeight - el.scrollTop - el.clientHeight > 1;
    el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  const onScroll = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const pinned = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    // Intermediate positions of a smooth scroll would flash the pill on and off.
    if (autoScrollingRef.current) {
      if (!pinned) return;
      autoScrollingRef.current = false;
    }
    pinnedRef.current = pinned;
    setAtBottom(pinned);
    if (pinned) setUnseen(false);
  }, [threshold]);

  // Typing indicators and replies grow the content without scrolling it, so follow the box size.
  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    viewport.scrollTop = viewport.scrollHeight;
    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) viewport.scrollTop = viewport.scrollHeight;
    });
    observer.observe(content);

    return () => observer.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    if (latestFromSelf) scrollToBottom();
  }, [latestId, latestFromSelf, scrollToBottom]);

  const context = React.useMemo(() => ({ atBottom, unseen, scrollToBottom }), [atBottom, unseen, scrollToBottom]);

  return (
    <ChatThreadContext.Provider value={context}>
      <div
        ref={viewportRef}
        data-slot="chat-thread"
        role="log"
        aria-live="polite"
        onScroll={onScroll}
        className={cn('relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain', className)}
        {...props}
      >
        <div
          ref={contentRef}
          data-slot="chat-thread-content"
          className="flex min-h-full shrink-0 flex-col justify-end gap-3 p-3 sm:p-4"
        >
          {children}
        </div>
      </div>
    </ChatThreadContext.Provider>
  );
};

interface ChatThreadJumpProps extends Omit<React.ComponentProps<typeof Button>, 'onClick' | 'children'> {
  label?: string;
  /** Shown instead of `label` when messages arrived while the reader was scrolled up. */
  newLabel?: string;
}

const ChatThreadJump = ({ label = 'Jump to latest', newLabel = 'New messages', ...props }: ChatThreadJumpProps) => {
  const { atBottom, unseen, scrollToBottom } = useChatThread();
  if (atBottom) return null;

  return (
    <div data-slot="chat-thread-jump" className="sticky bottom-2 z-10 -mt-3 flex h-0 justify-center overflow-visible">
      <Button
        type="button"
        variant={unseen ? 'default' : 'outline'}
        size="sm"
        onClick={scrollToBottom}
        className={cn(SWAP, '-translate-y-full')}
        {...props}
      >
        <ArrowDown aria-hidden />
        {unseen ? newLabel : label}
      </Button>
    </div>
  );
};

type ChatDaySeparatorProps = React.ComponentProps<'div'>;

const ChatDaySeparator = ({ className, children, ...props }: ChatDaySeparatorProps) => {
  return (
    <div
      data-slot="chat-day-separator"
      className={cn('flex items-center gap-3 py-1 text-[11px] text-muted-foreground uppercase', className)}
      {...props}
    >
      <span aria-hidden className="h-px flex-1 bg-border" />
      <span>{children}</span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
};

const ChatMessageGroupContext = React.createContext(false);

interface ChatMessageGroupProps extends React.ComponentProps<'div'> {
  /** Sent by the reader: the group sits on the end side. */
  own?: boolean;
}

const ChatMessageGroup = ({ own = false, className, ...props }: ChatMessageGroupProps) => {
  return (
    <ChatMessageGroupContext.Provider value={own}>
      <div
        data-slot="chat-message-group"
        data-own={own || undefined}
        className={cn('flex w-full items-start gap-2', own && 'flex-row-reverse', className)}
        {...props}
      />
    </ChatMessageGroupContext.Provider>
  );
};

type ChatMessageStackProps = React.ComponentProps<'div'>;

const ChatMessageStack = ({ className, ...props }: ChatMessageStackProps) => {
  const own = React.useContext(ChatMessageGroupContext);

  return (
    <div
      data-slot="chat-message-stack"
      className={cn('flex max-w-[85%] min-w-0 flex-col gap-0.5', own ? 'items-end' : 'items-start', className)}
      {...props}
    />
  );
};

type ChatBubbleProps = React.ComponentProps<'div'>;

/** Corners next to a neighbouring bubble in the same group tighten, so a run reads as one block. */
const ChatBubble = ({ className, ...props }: ChatBubbleProps) => {
  const own = React.useContext(ChatMessageGroupContext);

  return (
    <div
      data-slot="chat-bubble"
      className={cn(
        'max-w-full rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap',
        own
          ? 'bg-primary text-primary-foreground [&:has(+[data-slot=chat-bubble])]:rounded-ee-md [[data-slot=chat-bubble]+&]:rounded-se-md'
          : 'bg-muted text-foreground [&:has(+[data-slot=chat-bubble])]:rounded-es-md [[data-slot=chat-bubble]+&]:rounded-ss-md',
        className,
      )}
      {...props}
    />
  );
};

const STATUS_LABEL: Record<ChatMessageStatus, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Seen',
};

interface ChatMessageMetaProps extends React.ComponentProps<'div'> {
  time: string;
  /** Delivery state of the reader's own message. */
  status?: ChatMessageStatus;
}

const ChatMessageMeta = ({ time, status, className, ...props }: ChatMessageMetaProps) => {
  const StatusIcon = status === 'sent' ? Check : CheckCheck;

  return (
    <div
      data-slot="chat-message-meta"
      className={cn('flex items-center gap-1.5 px-1 pt-0.5 text-[11px] text-muted-foreground tabular-nums', className)}
      {...props}
    >
      <time>{time}</time>
      {status ? (
        <span
          data-slot="chat-message-status"
          data-status={status}
          className={cn('inline-flex items-center gap-1', status === 'read' && 'text-primary')}
        >
          <StatusIcon aria-hidden className="size-3.5" />
          {STATUS_LABEL[status]}
        </span>
      ) : null}
    </div>
  );
};

interface ChatTypingProps extends React.ComponentProps<'div'> {
  /** Announced to screen readers, e.g. "Nadia is typing". */
  label?: string;
}

const ChatTyping = ({ label = 'Typing', className, ...props }: ChatTypingProps) => {
  return (
    <div
      data-slot="chat-typing"
      role="status"
      aria-label={label}
      className={cn('inline-flex w-fit items-center gap-1 rounded-2xl bg-muted px-3.5 py-3', className)}
      {...props}
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          aria-hidden
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
};

interface ChatComposerContextValue {
  value: string;
  setValue: (next: string) => void;
  canSend: boolean;
  send: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled: boolean;
}

const ChatComposerContext = React.createContext<ChatComposerContextValue | null>(null);

const useChatComposer = () => {
  const context = React.useContext(ChatComposerContext);
  if (!context) {
    throw new Error('ChatComposer parts must be rendered inside <ChatComposer>.');
  }

  return context;
};

interface ChatComposerProps extends Omit<React.ComponentProps<'form'>, 'onSubmit' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Receives the trimmed text; the input clears afterwards. */
  onSend?: (text: string) => void;
  disabled?: boolean;
}

/** A form around an InputGroup: compose the input and addons inside it. */
const ChatComposer = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSend,
  disabled = false,
  className,
  children,
  ...props
}: ChatComposerProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const canSend = !disabled && value.trim().length > 0;

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const send = React.useCallback(() => {
    if (!canSend) return;
    onSend?.(value.trim());
    setValue('');
    inputRef.current?.focus();
  }, [canSend, onSend, value, setValue]);

  const context = React.useMemo(
    () => ({ value, setValue, canSend, send, inputRef, disabled }),
    [value, setValue, canSend, send, disabled],
  );

  return (
    <ChatComposerContext.Provider value={context}>
      <form
        data-slot="chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className={cn('w-full', className)}
        {...props}
      >
        <InputGroup>{children}</InputGroup>
      </form>
    </ChatComposerContext.Provider>
  );
};

type ChatComposerInputProps = Omit<
  React.ComponentProps<typeof InputGroupTextarea>,
  'value' | 'defaultValue' | 'onChange' | 'disabled'
>;

/** Enter sends, Shift+Enter adds a line. */
const ChatComposerInput = ({ className, onKeyDown, ...props }: ChatComposerInputProps) => {
  const { value, setValue, send, inputRef, disabled } = useChatComposer();

  return (
    <InputGroupTextarea
      ref={inputRef}
      rows={1}
      name="message"
      aria-label="Message"
      {...props}
      value={value}
      disabled={disabled}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
          event.preventDefault();
          send();
        }
      }}
      className={cn('max-h-32', className)}
    />
  );
};

type ChatComposerSendProps = Omit<React.ComponentProps<typeof InputGroupButton>, 'type'>;

const ChatComposerSend = ({ children, ...props }: ChatComposerSendProps) => {
  const { canSend } = useChatComposer();

  return (
    <InputGroupButton
      type="submit"
      data-slot="chat-composer-send"
      variant="default"
      size="icon-sm"
      aria-label="Send message"
      disabled={!canSend}
      {...props}
    >
      {children ?? <SendHorizontal aria-hidden className="rtl:rotate-180" />}
    </InputGroupButton>
  );
};

interface SupportWidgetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  panelId: string;
}

const SupportWidgetContext = React.createContext<SupportWidgetContextValue | null>(null);

const useSupportWidget = () => {
  const context = React.useContext(SupportWidgetContext);
  if (!context) {
    throw new Error('SupportWidget parts must be rendered inside <SupportWidget>.');
  }

  return context;
};

interface SupportWidgetProps extends React.ComponentProps<'div'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Positions itself absolutely, so give the parent `position: relative`. */
const SupportWidget = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: SupportWidgetProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const panelId = React.useId();

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const context = React.useMemo(() => ({ open, setOpen, panelId }), [open, setOpen, panelId]);

  return (
    <SupportWidgetContext.Provider value={context}>
      <div
        data-slot="support-widget"
        data-open={open || undefined}
        className={cn('pointer-events-none absolute inset-0 z-20', className)}
        {...props}
      />
    </SupportWidgetContext.Provider>
  );
};

interface SupportWidgetLauncherProps extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  /** Unread replies shown on the launcher while the panel is closed. */
  unread?: number;
  label?: string;
}

const SupportWidgetLauncher = ({
  unread = 0,
  label = 'Chat with support',
  onClick,
  ...props
}: SupportWidgetLauncherProps) => {
  const { open, setOpen, panelId } = useSupportWidget();

  return (
    <div
      data-slot="support-widget-launcher"
      className="pointer-events-auto absolute end-4 bottom-4 rounded-md shadow-sm sm:end-6 sm:bottom-6"
    >
      <Button
        type="button"
        size="icon-lg"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? 'Close support chat' : label}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setOpen(!open);
        }}
        className="size-12"
        {...props}
      >
        <span
          key={open ? 'close' : 'open'}
          className="animate-in duration-200 zoom-in-75 fade-in motion-reduce:animate-none"
        >
          {open ? <ChevronDown aria-hidden className="size-5" /> : <MessageCircle aria-hidden className="size-5" />}
        </span>
      </Button>
      {!open && unread > 0 ? (
        <Badge data-slot="support-widget-unread" variant="destructive" className="absolute -end-2 -top-2">
          <span className="tabular-nums">{unread}</span>
          <span className="sr-only"> unread</span>
        </Badge>
      ) : null}
    </div>
  );
};

type SupportWidgetTeaserProps = React.ComponentProps<'div'>;

/** A short greeting beside the closed launcher; clicking it opens the panel. */
const SupportWidgetTeaser = ({ className, children, ...props }: SupportWidgetTeaserProps) => {
  const { open, setOpen } = useSupportWidget();
  const [dismissed, setDismissed] = React.useState(false);
  if (open || dismissed) return null;

  return (
    <div
      data-slot="support-widget-teaser"
      className={cn(
        POP,
        'pointer-events-auto absolute end-4 bottom-20 flex w-64 items-start gap-1 rounded-lg border border-border bg-popover py-1 ps-3 pe-1 text-sm text-popover-foreground shadow-sm sm:end-6 sm:bottom-22',
        className,
      )}
      {...props}
    >
      <button type="button" onClick={() => setOpen(true)} className="flex-1 py-2 text-start outline-none">
        {children}
      </button>
      <Button type="button" variant="ghost" size="icon-xs" aria-label="Dismiss" onClick={() => setDismissed(true)}>
        <X aria-hidden />
      </Button>
    </div>
  );
};

type SupportWidgetPanelProps = React.ComponentProps<'div'>;

const SupportWidgetPanel = ({ className, onKeyDown, ...props }: SupportWidgetPanelProps) => {
  const { open, setOpen, panelId } = useSupportWidget();
  if (!open) return null;

  return (
    <div
      id={panelId}
      role="dialog"
      aria-label="Support chat"
      data-slot="support-widget-panel"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== 'Escape') return;
        event.stopPropagation();
        setOpen(false);
      }}
      className={cn(
        POP,
        'pointer-events-auto absolute inset-x-4 top-4 bottom-20 flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm sm:inset-x-auto sm:end-6 sm:top-auto sm:bottom-22 sm:h-[540px] sm:max-h-[calc(100%-7rem)] sm:w-[380px]',
        className,
      )}
      {...props}
    />
  );
};

type SupportWidgetHeaderProps = React.ComponentProps<'div'>;

const SupportWidgetHeader = ({ className, ...props }: SupportWidgetHeaderProps) => {
  return (
    <div
      data-slot="support-widget-header"
      className={cn('flex shrink-0 items-center gap-3 border-b border-border px-4 py-3', className)}
      {...props}
    />
  );
};

type SupportQuickRepliesProps = React.ComponentProps<'div'>;

const SupportQuickReplies = ({ className, ...props }: SupportQuickRepliesProps) => {
  return (
    <div
      data-slot="support-quick-replies"
      role="group"
      aria-label="Suggested replies"
      className={cn('flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-3', className)}
      {...props}
    />
  );
};

type SupportQuickReplyProps = Omit<React.ComponentProps<typeof Button>, 'type'>;

const SupportQuickReply = (props: SupportQuickReplyProps) => {
  return <Button type="button" data-slot="support-quick-reply" variant="outline" size="sm" {...props} />;
};

export {
  SupportWidget,
  SupportWidgetLauncher,
  SupportWidgetTeaser,
  SupportWidgetPanel,
  SupportWidgetHeader,
  SupportQuickReplies,
  SupportQuickReply,
  useSupportWidget,
};

const AGENT = { name: 'Nadia Karim', firstName: 'Nadia', initials: 'NK' };

type Topic = 'track' | 'address' | 'pause' | 'damaged' | 'done';

const TOPICS: { id: Topic; label: string }[] = [
  { id: 'track', label: 'Track my order' },
  { id: 'address', label: 'Change delivery address' },
  { id: 'pause', label: 'Pause my subscription' },
  { id: 'damaged', label: 'My bag arrived damaged' },
];

const DONE: { id: Topic; label: string } = { id: 'done', label: 'That is all, thanks' };

const ORDER_PATTERN = /\bHR-?(\d{4,6})\b/i;

interface Reply {
  topic?: Topic;
  text: string[];
  awaitOrder?: boolean;
  end?: boolean;
}

const answer = (input: string, awaitingOrder: boolean): Reply => {
  const text = input.toLowerCase();
  const order = input.match(ORDER_PATTERN);
  if (order) {
    const number = `HR-${order[1]}`;

    return {
      topic: 'track',
      text: [
        `Found it. ${number} left our roastery yesterday and is with DHL now.`,
        'It should arrive Thursday before 18:00. You will get a text an hour before the driver gets to you.',
      ],
    };
  }
  if (awaitingOrder) {
    return {
      awaitOrder: true,
      text: ['I could not find an order number in that. It looks like HR-20931 and it is in your confirmation email.'],
    };
  }
  if (/track|where|status|arriv|shipp/.test(text)) {
    return {
      topic: 'track',
      awaitOrder: true,
      text: ['Happy to check. What is your order number? It starts with HR, like HR-20931.'],
    };
  }
  if (/address|move|moving|redirect/.test(text)) {
    return {
      topic: 'address',
      text: [
        'You can change it any time before the order ships: Account, then Subscriptions, then Delivery.',
        'If it has already shipped, send me the new address and I will ask the courier to redirect it.',
      ],
    };
  }
  if (/pause|skip|cancel|subscription|holiday/.test(text)) {
    return {
      topic: 'pause',
      text: [
        'Go to Account, then Subscriptions, and press Pause. You can skip up to three deliveries.',
        'Nothing is charged while it is paused, and we email you a week before it starts again.',
      ],
    };
  }
  if (/damag|broken|torn|leak|refund|return|wrong/.test(text)) {
    return {
      topic: 'damaged',
      text: [
        'Sorry about that. Send a photo of the bag to support@hirael.com with your order number.',
        'We will send a fresh bag the same day, or refund it if you prefer.',
      ],
    };
  }
  if (/human|person|real|someone|agent/.test(text)) {
    return { text: ['You are talking to one. I am Nadia and I am here until 18:00 CET. What can I help with?'] };
  }
  if (/thank|that is all|that's all|thats all|bye|all good|perfect/.test(text)) {
    return { topic: 'done', end: true, text: ['Glad I could help. Enjoy the coffee.'] };
  }

  return { text: ['I am not sure I follow. I can help with orders, deliveries, subscriptions and damaged bags.'] };
};

interface Message {
  id: string;
  from: 'agent' | 'me';
  text: string;
  time: string;
  status?: ChatMessageStatus;
}

type Stage = 'chatting' | 'rating' | 'rated';

const clock = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date());

// The automatic greeting has no timestamp: it isn't a message anyone sent at a moment in time.
const GREETING: Message[] = [
  { id: 'g1', from: 'agent', text: `Hi, I am ${AGENT.firstName} from Hirael.`, time: '' },
  { id: 'g2', from: 'agent', text: 'Ask me about an order, a delivery or your subscription.', time: '' },
];

const groupRuns = (messages: readonly Message[]) => {
  const runs: Message[][] = [];
  for (const message of messages) {
    const last = runs[runs.length - 1];
    if (last && last[0].from === message.from) last.push(message);
    else runs.push([message]);
  }

  return runs;
};

const ARTICLES = [
  { title: 'When will my order arrive?', meta: 'Deliveries' },
  { title: 'Pause, skip or cancel a subscription', meta: 'Subscriptions' },
  { title: 'Grind sizes for every brew method', meta: 'Brewing' },
  { title: 'Returning a damaged or wrong bag', meta: 'Returns' },
];

const Chat02 = () => {
  const [open, setOpen] = React.useState(true);
  const [focusInput, setFocusInput] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(GREETING);
  const [unread, setUnread] = React.useState(0);
  const [typing, setTyping] = React.useState(false);
  const [stage, setStage] = React.useState<Stage>('chatting');
  const [rating, setRating] = React.useState(0);
  const [used, setUsed] = React.useState<Topic[]>([]);
  const [awaitingOrder, setAwaitingOrder] = React.useState(false);
  const timersRef = React.useRef(new Set<number>());
  const queueRef = React.useRef<string[]>([]);
  const busyRef = React.useRef(false);
  const openRef = React.useRef(open);
  const awaitingRef = React.useRef(awaitingOrder);

  React.useEffect(() => {
    openRef.current = open;
    awaitingRef.current = awaitingOrder;
  }, [open, awaitingOrder]);

  React.useEffect(() => {
    const timers = timersRef.current;

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
  };

  const pushAgent = (text: string) => {
    setMessages((current) => [...current, { id: `a-${current.length}`, from: 'agent', text, time: clock() }]);
    if (!openRef.current) setUnread((count) => count + 1);
  };

  const processNext = () => {
    const input = queueRef.current.shift();
    if (input === undefined) {
      busyRef.current = false;

      return;
    }
    busyRef.current = true;
    const reply = answer(input, awaitingRef.current);

    schedule(() => {
      setMessages((current) =>
        current.map((message) => (message.from === 'me' ? { ...message, status: 'read' } : message)),
      );
      setTyping(true);
    }, 700);

    let delay = 700;
    reply.text.forEach((line, index) => {
      delay += Math.min(2400, 900 + line.length * 18);
      const isLast = index === reply.text.length - 1;
      schedule(() => {
        pushAgent(line);
        if (!isLast) return;
        setTyping(false);
        awaitingRef.current = Boolean(reply.awaitOrder);
        setAwaitingOrder(Boolean(reply.awaitOrder));
        const topic = reply.topic;
        if (topic) setUsed((current) => (current.includes(topic) ? current : [...current, topic]));
        if (reply.end) {
          queueRef.current = [];
          schedule(() => setStage('rating'), 700);
          busyRef.current = false;

          return;
        }
        processNext();
      }, delay);
    });
  };

  const send = (text: string) => {
    if (stage !== 'chatting') return;
    const id = `u-${messages.length}`;
    setMessages((current) => [...current, { id, from: 'me', text, time: clock(), status: 'sent' }]);
    schedule(
      () =>
        setMessages((current) =>
          current.map((message) =>
            message.id === id && message.status === 'sent' ? { ...message, status: 'delivered' } : message,
          ),
        ),
      400,
    );
    queueRef.current.push(text);
    if (!busyRef.current) processNext();
  };

  const stopAgent = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current.clear();
    queueRef.current = [];
    busyRef.current = false;
    setTyping(false);
  };

  const endChat = () => {
    stopAgent();
    setStage('rating');
  };

  const restart = () => {
    stopAgent();
    awaitingRef.current = false;
    setMessages(GREETING);
    setStage('chatting');
    setRating(0);
    setUsed([]);
    setAwaitingOrder(false);
  };

  const suggestions = awaitingOrder
    ? [{ id: 'track' as Topic, label: 'HR-20931' }]
    : [...TOPICS.filter((topic) => !used.includes(topic.id)), ...(used.length > 0 ? [DONE] : [])];

  const runs = groupRuns(messages);
  const latest = messages[messages.length - 1];
  const lastOwnId = [...messages].reverse().find((message) => message.from === 'me')?.id;

  return (
    <section
      data-slot="chat-02"
      aria-labelledby="chat-02-heading"
      className="relative min-h-[720px] overflow-hidden bg-background"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:py-24">
        <header className="flex max-w-xl flex-col gap-3">
          <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>Help center</span>
          <h2
            id="chat-02-heading"
            style={stagger(1)}
            className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
          >
            How can we help?
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            Answers to the questions we get most. For anything about a specific order, open the chat and we will look it
            up.
          </p>
        </header>
        <ul
          style={stagger(3)}
          className={cn(ENTER, 'flex max-w-xl flex-col divide-y divide-border border-y border-border')}
        >
          {ARTICLES.map((article) => (
            <li key={article.title}>
              <a
                href="#"
                className="flex items-baseline justify-between gap-4 py-4 text-sm outline-none hover:text-foreground/80 focus-visible:underline"
              >
                <span className="font-medium">{article.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{article.meta}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <SupportWidget
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          setFocusInput(next);
          if (next) setUnread(0);
        }}
      >
        <SupportWidgetTeaser>
          <span className="block font-medium">Questions about an order?</span>
          <span className="block text-xs text-muted-foreground">Nadia is online and usually replies in 2 minutes.</span>
        </SupportWidgetTeaser>

        <SupportWidgetPanel>
          <SupportWidgetHeader>
            <span className="relative inline-flex shrink-0">
              <Avatar>
                <AvatarFallback>{AGENT.initials}</AvatarFallback>
              </Avatar>
              <span aria-hidden className="absolute end-0 bottom-0 size-2.5 rounded-full bg-success ring-2 ring-card" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="truncate text-sm font-semibold">{AGENT.name}</h3>
              <p className="truncate text-xs text-muted-foreground">
                {typing ? 'Typing' : 'Usually replies in 2 minutes'}
              </p>
            </div>
            {stage === 'chatting' && messages.some((message) => message.from === 'me') ? (
              <Button type="button" variant="ghost" size="xs" onClick={endChat}>
                End chat
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Minimize chat"
              onClick={() => setOpen(false)}
              className="-me-1.5"
            >
              <X aria-hidden />
            </Button>
          </SupportWidgetHeader>

          <ChatThread latestId={latest.id} latestFromSelf={latest.from === 'me'}>
            <ChatDaySeparator>Today</ChatDaySeparator>
            {runs.map((run) => {
              const own = run[0].from === 'me';
              const last = run[run.length - 1];

              return (
                <ChatMessageGroup key={run[0].id} own={own}>
                  {!own ? (
                    <Avatar size="sm">
                      <AvatarFallback>{AGENT.initials}</AvatarFallback>
                    </Avatar>
                  ) : null}
                  <ChatMessageStack>
                    {run.map((message) => (
                      <ChatBubble key={message.id} title={message.time || undefined} className={SWAP}>
                        {message.text}
                      </ChatBubble>
                    ))}
                    {last.time ? (
                      <ChatMessageMeta
                        time={last.time}
                        status={own && last.id === lastOwnId ? last.status : undefined}
                      />
                    ) : null}
                  </ChatMessageStack>
                </ChatMessageGroup>
              );
            })}
            {typing ? (
              <ChatMessageGroup className={SWAP}>
                <Avatar size="sm">
                  <AvatarFallback>{AGENT.initials}</AvatarFallback>
                </Avatar>
                <ChatMessageStack>
                  <ChatTyping label={`${AGENT.firstName} is typing`} />
                </ChatMessageStack>
              </ChatMessageGroup>
            ) : null}
            {stage !== 'chatting' ? <ChatDaySeparator className={SWAP}>Chat ended</ChatDaySeparator> : null}
            {stage !== 'chatting' ? (
              <div
                data-slot="support-rating"
                role="group"
                aria-label="Rate this chat"
                className={cn(SWAP, 'flex flex-col items-center gap-3 px-2 pb-2 text-center')}
              >
                {stage === 'rating' ? (
                  <>
                    <p className="text-sm font-medium">How was your chat with {AGENT.firstName}?</p>
                    <Rating
                      size="lg"
                      value={rating}
                      onValueChange={(value) => {
                        setRating(value);
                        setStage('rated');
                      }}
                      aria-label="Rate this chat"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your rating goes to {AGENT.firstName}&apos;s team lead.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Thanks for rating this chat <span className="tabular-nums">{rating}</span> out of 5.
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {rating <= 2
                        ? 'Sorry it missed. A team lead will read the chat and email you today.'
                        : 'We will send a copy of this chat to your email.'}
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={restart}>
                      Start a new chat
                    </Button>
                  </>
                )}
              </div>
            ) : null}
            <ChatThreadJump />
          </ChatThread>

          <div className="flex shrink-0 flex-col gap-2 border-t border-border pt-3">
            {stage === 'chatting' && suggestions.length > 0 ? (
              <SupportQuickReplies key={suggestions.map((item) => item.label).join('|')} className={SWAP}>
                {suggestions.map((item) => (
                  <SupportQuickReply key={item.label} onClick={() => send(item.label)}>
                    {item.label}
                  </SupportQuickReply>
                ))}
              </SupportQuickReplies>
            ) : null}
            <div className="px-3 pb-3">
              <ChatComposer onSend={send} disabled={stage !== 'chatting'}>
                <ChatComposerInput
                  autoFocus={focusInput}
                  placeholder={stage === 'chatting' ? 'Write a message' : 'This chat has ended'}
                />
                <InputGroupAddon align="inline-end">
                  <ChatComposerSend />
                </InputGroupAddon>
              </ChatComposer>
            </div>
          </div>
        </SupportWidgetPanel>

        <SupportWidgetLauncher unread={unread} />
      </SupportWidget>
    </section>
  );
};

export default Chat02;
