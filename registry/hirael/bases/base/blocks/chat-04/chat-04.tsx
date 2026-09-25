'use client';

import * as React from 'react';
import {
  ArrowDown,
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Lock,
  MessageSquareQuote,
  RotateCcw,
  SendHorizontal,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/base/ui/dropdown-menu';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/registry/hirael/bases/base/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/registry/hirael/bases/base/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/registry/hirael/bases/base/ui/item';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

export type ChatMessageStatus = 'sent' | 'delivered' | 'read';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-250 ${EASE} fill-mode-both motion-reduce:animate-none`;

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

  // Status changes and replies grow the content without scrolling it, so follow the box size.
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
  /** Sent by your team: the group sits on the end side. */
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
      className={cn('flex max-w-[80%] min-w-0 flex-col gap-0.5', own ? 'items-end' : 'items-start', className)}
      {...props}
    />
  );
};

type ChatMessageSenderProps = React.ComponentProps<'span'>;

const ChatMessageSender = ({ className, ...props }: ChatMessageSenderProps) => {
  return (
    <span
      data-slot="chat-message-sender"
      className={cn('flex items-center gap-1 px-1 pb-0.5 text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  );
};

interface ChatBubbleProps extends React.ComponentProps<'div'> {
  /** An internal note: only your team sees it. */
  note?: boolean;
}

/** Corners next to a neighbouring bubble in the same group tighten, so a run reads as one block. */
const ChatBubble = ({ note = false, className, ...props }: ChatBubbleProps) => {
  const own = React.useContext(ChatMessageGroupContext);

  return (
    <div
      data-slot="chat-bubble"
      data-note={note || undefined}
      className={cn(
        'max-w-full rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap',
        note
          ? 'border border-dashed border-warning/60 bg-warning/10 text-foreground'
          : own
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
        own
          ? '[&:has(+[data-slot=chat-bubble])]:rounded-ee-md [[data-slot=chat-bubble]+&]:rounded-se-md'
          : '[&:has(+[data-slot=chat-bubble])]:rounded-es-md [[data-slot=chat-bubble]+&]:rounded-ss-md',
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
  /** Delivery state of a reply your team sent. */
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

type InboxEventProps = React.ComponentProps<'p'>;

const InboxEvent = ({ className, ...props }: InboxEventProps) => {
  return (
    <p data-slot="inbox-event" className={cn('px-4 text-center text-xs text-muted-foreground', className)} {...props} />
  );
};

interface ChatComposerContextValue {
  value: string;
  setValue: (next: string) => void;
  canSend: boolean;
  send: () => void;
  insertText: (text: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
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
  /** Writing an internal note; sets `data-note` on the form. */
  note?: boolean;
}

/** A form around an InputGroup: compose the input and addons inside it. */
const ChatComposer = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSend,
  note = false,
  className,
  children,
  ...props
}: ChatComposerProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0;

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

  const insertText = React.useCallback(
    (text: string) => {
      const el = inputRef.current;
      const start = el?.selectionStart ?? value.length;
      const end = el?.selectionEnd ?? value.length;
      setValue(value.slice(0, start) + text + value.slice(end));
      requestAnimationFrame(() => {
        el?.focus();
        el?.setSelectionRange(start + text.length, start + text.length);
      });
    },
    [value, setValue],
  );

  const context = React.useMemo(
    () => ({ value, setValue, canSend, send, insertText, inputRef }),
    [value, setValue, canSend, send, insertText],
  );

  return (
    <ChatComposerContext.Provider value={context}>
      <form
        data-slot="chat-composer"
        data-note={note || undefined}
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
  'value' | 'defaultValue' | 'onChange'
>;

/** Enter sends, Shift+Enter adds a line. */
const ChatComposerInput = ({ className, onKeyDown, ...props }: ChatComposerInputProps) => {
  const { value, setValue, send, inputRef } = useChatComposer();

  return (
    <InputGroupTextarea
      ref={inputRef}
      name="message"
      aria-label="Message"
      {...props}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
          event.preventDefault();
          send();
        }
      }}
      className={cn('max-h-40', className)}
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
      size="sm"
      disabled={!canSend}
      {...props}
    >
      {children ?? (
        <>
          Send
          <SendHorizontal aria-hidden className="rtl:rotate-180" />
        </>
      )}
    </InputGroupButton>
  );
};

interface InboxListItemProps extends Omit<React.ComponentProps<'a'>, 'children'> {
  name: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
  active?: boolean;
  /** Initials of the teammate who owns it; omit when unassigned. */
  assignee?: string;
  /** Extra line, such as when a snooze ends. */
  note?: string;
}

/** A link, so a real app can point `href` at the conversation's route. */
const InboxListItem = ({
  name,
  subject,
  preview,
  time,
  unread = false,
  active = false,
  assignee,
  note,
  ...props
}: InboxListItemProps) => {
  return (
    <Item
      size="sm"
      variant={active ? 'muted' : 'default'}
      render={
        <a
          data-slot="inbox-list-item"
          data-unread={unread || undefined}
          aria-current={active ? 'page' : undefined}
          {...props}
        />
      }
    >
      <ItemContent className="min-w-0">
        <ItemTitle className="w-full min-w-0">
          {unread ? <span aria-hidden className="size-2 shrink-0 rounded-full bg-primary" /> : null}
          <span className={cn('truncate', unread && 'font-semibold')}>{name}</span>
          {unread ? <span className="sr-only">, unread</span> : null}
        </ItemTitle>
        <ItemDescription>
          <span className={cn('block truncate', unread && 'text-foreground')}>{subject}</span>
          <span className="block truncate">{preview}</span>
        </ItemDescription>
        {note ? (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock aria-hidden className="size-3.5" />
            {note}
          </span>
        ) : null}
      </ItemContent>
      <ItemActions className="flex-col items-end justify-between self-stretch">
        <span className="text-xs text-muted-foreground tabular-nums">{time}</span>
        {assignee ? (
          <Avatar size="sm">
            <AvatarFallback>{assignee}</AvatarFallback>
          </Avatar>
        ) : null}
      </ItemActions>
    </Item>
  );
};

export {
  InboxListItem,
  InboxEvent,
  ChatThread,
  ChatThreadJump,
  ChatDaySeparator,
  ChatMessageGroup,
  ChatMessageStack,
  ChatMessageSender,
  ChatBubble,
  ChatMessageMeta,
  ChatComposer,
  ChatComposerInput,
  ChatComposerSend,
  useChatThread,
  useChatComposer,
};

type Status = 'open' | 'snoozed' | 'closed';
type Assignee = 'me' | 'ana' | 'tom';
type AssigneeFilter = 'all' | Assignee | 'unassigned';
type Mode = 'reply' | 'note';

const TEAM: Record<Assignee, { name: string; initials: string }> = {
  me: { name: 'Sam Rivera', initials: 'SR' },
  ana: { name: 'Ana Lima', initials: 'AL' },
  tom: { name: 'Tom Becker', initials: 'TB' },
};

const FILTERS: { value: AssigneeFilter; label: string }[] = [
  { value: 'all', label: 'Everyone' },
  { value: 'me', label: 'Assigned to me' },
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'ana', label: 'Ana Lima' },
  { value: 'tom', label: 'Tom Becker' },
];

const TABS: { value: Status; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'snoozed', label: 'Snoozed' },
  { value: 'closed', label: 'Closed' },
];

const SNOOZE_OPTIONS = [
  { label: 'Later today', until: 'Today 17:00' },
  { label: 'Tomorrow', until: 'Tomorrow 09:00' },
  { label: 'Next week', until: 'Monday 09:00' },
];

const SAVED_REPLIES = [
  {
    title: 'Looking into it',
    body: 'Hi {first_name}, thanks for flagging this. I am looking into it now and will update you within the hour.',
  },
  {
    title: 'Need more details',
    body: 'Hi {first_name}, could you send a screenshot and roughly when it happened? That helps us find it in our logs.',
  },
  {
    title: 'Fixed, please confirm',
    body: 'Hi {first_name}, we have shipped a fix. Could you try again and let me know if it works on your side?',
  },
  {
    title: 'Closing follow-up',
    body: 'Glad that is sorted, {first_name}. I will close this conversation, but reply any time and it reopens.',
  },
];

interface Entry {
  id: string;
  kind: 'customer' | 'reply' | 'note' | 'event';
  author?: Assignee;
  text: string;
  day: string;
  time: string;
  status?: ChatMessageStatus;
}

interface Customer {
  name: string;
  email: string;
  company: string;
  plan: string;
  since: string;
}

interface Conversation {
  id: string;
  customer: Customer;
  subject: string;
  status: Status;
  assignee?: Assignee;
  unread: boolean;
  snoozedUntil?: string;
  entries: Entry[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'vat',
    customer: {
      name: 'Olivia Grant',
      email: 'olivia@brightpath.io',
      company: 'Brightpath',
      plan: 'Business, 24 seats',
      since: 'March 2024',
    },
    subject: 'Invoice shows the old VAT number',
    status: 'open',
    assignee: 'me',
    unread: false,
    entries: [
      {
        id: 'v1',
        kind: 'customer',
        text: 'Hi, our August invoice shows our old VAT number. We changed it in settings two weeks ago.',
        day: 'Yesterday',
        time: '15:20',
      },
      {
        id: 'v2',
        kind: 'customer',
        text: 'Can you reissue it? Our accountant needs it by Friday.',
        day: 'Yesterday',
        time: '15:21',
      },
      {
        id: 'v3',
        kind: 'note',
        author: 'ana',
        text: 'Billing sync ran before her change. Reissuing needs a finance approval, ask Marta.',
        day: 'Yesterday',
        time: '15:40',
      },
      { id: 'v4', kind: 'event', text: 'Ana Lima assigned this to you', day: 'Yesterday', time: '15:41' },
      {
        id: 'v5',
        kind: 'reply',
        author: 'me',
        text: 'Thanks Olivia. Finance is reissuing it with the new VAT number, you will have it by tomorrow.',
        day: 'Today',
        time: '09:05',
        status: 'read',
      },
      {
        id: 'v6',
        kind: 'customer',
        text: 'Great, thank you. Will it keep the same invoice number?',
        day: 'Today',
        time: '10:12',
      },
    ],
  },
  {
    id: 'sso',
    customer: {
      name: 'Marcus Lee',
      email: 'marcus@fernway.co',
      company: 'Fernway',
      plan: 'Business, 60 seats',
      since: 'June 2023',
    },
    subject: 'SSO login loops back to sign in',
    status: 'open',
    unread: true,
    entries: [
      {
        id: 's1',
        kind: 'customer',
        text: 'Since this morning, signing in with Okta sends us straight back to the login page. The whole team is locked out.',
        day: 'Today',
        time: '08:47',
      },
      { id: 's2', kind: 'customer', text: 'Workspace is fernway, Business plan.', day: 'Today', time: '08:48' },
    ],
  },
  {
    id: 'annual',
    customer: {
      name: 'Priya Shah',
      email: 'priya@loomhq.com',
      company: 'Loom HQ',
      plan: 'Team, 8 seats',
      since: 'January 2025',
    },
    subject: 'Switching to annual billing mid-cycle',
    status: 'open',
    assignee: 'tom',
    unread: true,
    entries: [
      {
        id: 'a1',
        kind: 'customer',
        text: 'Can we move to annual billing now, or do we have to wait for the month to end?',
        day: 'Monday',
        time: '11:02',
      },
      {
        id: 'a2',
        kind: 'reply',
        author: 'tom',
        text: 'You can switch today. We credit the unused part of this month against the annual invoice.',
        day: 'Monday',
        time: '11:30',
        status: 'read',
      },
      { id: 'a3', kind: 'customer', text: 'Perfect, please go ahead.', day: 'Today', time: '07:55' },
    ],
  },
  {
    id: 'webhooks',
    customer: {
      name: 'Diego Ramos',
      email: 'diego@parcelhub.mx',
      company: 'Parcelhub',
      plan: 'Business, 15 seats',
      since: 'October 2024',
    },
    subject: 'Webhook deliveries failing with 410',
    status: 'open',
    assignee: 'me',
    unread: false,
    entries: [
      {
        id: 'w1',
        kind: 'customer',
        text: 'All webhook deliveries fail with 410 since Sunday. Our endpoint is up and answers with 200.',
        day: 'Monday',
        time: '16:14',
      },
      {
        id: 'w2',
        kind: 'reply',
        author: 'me',
        text: 'Hi Diego, a 410 means the endpoint was marked as gone. Could you check if the URL changed on Sunday?',
        day: 'Monday',
        time: '16:40',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'export',
    customer: {
      name: 'Jonas Keller',
      email: 'jonas@keller.studio',
      company: 'Keller Studio',
      plan: 'Team, 5 seats',
      since: 'May 2025',
    },
    subject: 'CSV export is missing the tags column',
    status: 'snoozed',
    snoozedUntil: 'Friday 09:00',
    assignee: 'me',
    unread: false,
    entries: [
      {
        id: 'e1',
        kind: 'customer',
        text: 'The CSV export no longer includes tags. We use it for our weekly report.',
        day: 'Yesterday',
        time: '09:10',
      },
      {
        id: 'e2',
        kind: 'reply',
        author: 'me',
        text: 'Thanks Jonas, we found it. The fix ships Friday morning and I will confirm here.',
        day: 'Yesterday',
        time: '10:02',
        status: 'read',
      },
      { id: 'e3', kind: 'event', text: 'You snoozed this until Friday 09:00', day: 'Yesterday', time: '10:03' },
    ],
  },
  {
    id: 'seats',
    customer: {
      name: 'Emma Wilson',
      email: 'emma@northdesk.com',
      company: 'Northdesk',
      plan: 'Business, 32 seats',
      since: 'August 2022',
    },
    subject: 'Add two seats to our plan',
    status: 'closed',
    assignee: 'ana',
    unread: false,
    entries: [
      { id: 'n1', kind: 'customer', text: 'Please add two seats, we hired two people.', day: 'Sep 18', time: '13:00' },
      {
        id: 'n2',
        kind: 'reply',
        author: 'ana',
        text: 'Done, you now have 32 seats. The prorated charge is on your next invoice.',
        day: 'Sep 18',
        time: '13:12',
        status: 'read',
      },
      { id: 'n3', kind: 'event', text: 'Ana Lima closed this', day: 'Sep 18', time: '13:12' },
    ],
  },
];

const clock = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date());

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
};

const authorName = (author: Assignee | undefined) => (author === 'me' ? 'You' : author ? TEAM[author].name : '');

type Row =
  | { type: 'day'; key: string; label: string }
  | { type: 'event'; key: string; entry: Entry }
  | { type: 'group'; key: string; kind: Entry['kind']; author?: Assignee; entries: Entry[] };

const buildRows = (entries: readonly Entry[]): Row[] => {
  const rows: Row[] = [];
  let day: string | undefined;
  for (const entry of entries) {
    if (entry.day !== day) {
      rows.push({ type: 'day', key: `day-${entry.day}`, label: entry.day });
      day = entry.day;
    }
    if (entry.kind === 'event') {
      rows.push({ type: 'event', key: entry.id, entry });
      continue;
    }
    const last = rows[rows.length - 1];
    const previous = last.type === 'group' ? last.entries[last.entries.length - 1] : undefined;
    if (
      last.type === 'group' &&
      previous &&
      last.kind === entry.kind &&
      last.author === entry.author &&
      toMinutes(entry.time) - toMinutes(previous.time) <= 10
    ) {
      last.entries.push(entry);
    } else {
      rows.push({ type: 'group', key: entry.id, kind: entry.kind, author: entry.author, entries: [entry] });
    }
  }

  return rows;
};

const listTime = (conversation: Conversation) => {
  const last = conversation.entries.filter((entry) => entry.kind !== 'event').at(-1) ?? conversation.entries[0];

  return last.day === 'Today' ? last.time : last.day;
};

const listPreview = (conversation: Conversation) => {
  const last = conversation.entries.filter((entry) => entry.kind !== 'event').at(-1);
  if (!last) return '';
  if (last.kind === 'note') return `Note: ${last.text}`;
  if (last.kind === 'reply') return `${authorName(last.author)}: ${last.text}`;

  return last.text;
};

interface SavedRepliesMenuProps {
  firstName: string;
}

const SavedRepliesMenu = ({ firstName }: SavedRepliesMenuProps) => {
  const { insertText } = useChatComposer();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<InputGroupButton size="sm" />}>
        <MessageSquareQuote aria-hidden />
        Saved replies
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-72">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Insert a saved reply</DropdownMenuLabel>
          {SAVED_REPLIES.map((reply) => (
            <DropdownMenuItem
              key={reply.title}
              onClick={() => insertText(reply.body.replaceAll('{first_name}', firstName))}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{reply.title}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">
                  {reply.body.replaceAll('{first_name}', firstName)}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface Notice {
  key: string;
  text: string;
  conversationId: string;
  previous: Pick<Conversation, 'status' | 'snoozedUntil'>;
  eventId: string;
}

const Chat04 = () => {
  const [conversations, setConversations] = React.useState(CONVERSATIONS);
  const [tab, setTab] = React.useState<Status>('open');
  const [filter, setFilter] = React.useState<AssigneeFilter>('all');
  const [activeId, setActiveId] = React.useState<string>('vat');
  const [view, setView] = React.useState<'list' | 'conversation'>('list');
  const [mode, setMode] = React.useState<Mode>('reply');
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  const [notice, setNotice] = React.useState<Notice | null>(null);
  const timersRef = React.useRef(new Set<number>());
  const counterRef = React.useRef(0);

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

  const nextId = () => {
    counterRef.current += 1;

    return `entry-${counterRef.current}`;
  };

  const update = (id: string, change: (conversation: Conversation) => Conversation) =>
    setConversations((current) =>
      current.map((conversation) => (conversation.id === id ? change(conversation) : conversation)),
    );

  const matchesFilter = (conversation: Conversation) => {
    if (filter === 'all') return true;
    if (filter === 'unassigned') return !conversation.assignee;

    return conversation.assignee === filter;
  };

  const filtered = conversations.filter(matchesFilter);
  const counts = Object.fromEntries(
    TABS.map((item) => [item.value, filtered.filter((conversation) => conversation.status === item.value).length]),
  ) as Record<Status, number>;
  const visible = filtered.filter((conversation) => conversation.status === tab);
  const active = conversations.find((conversation) => conversation.id === activeId);
  const filterLabel = FILTERS.find((item) => item.value === filter)?.label ?? 'Everyone';

  const open = (id: string) => {
    setActiveId(id);
    setView('conversation');
    update(id, (conversation) => ({ ...conversation, unread: false }));
  };

  const moveTo = (conversation: Conversation, status: Status, event: string, snoozedUntil?: string) => {
    const next = visible.find((item) => item.id !== conversation.id);
    const eventId = nextId();
    update(conversation.id, (current) => ({
      ...current,
      status,
      snoozedUntil,
      entries: [...current.entries, { id: eventId, kind: 'event', text: event, day: 'Today', time: clock() }],
    }));
    if (status === tab) return;
    if (next) {
      setActiveId(next.id);
      update(next.id, (current) => ({ ...current, unread: false }));
    }
    // On phones the list is where the undo notice shows, so go back to it.
    setView('list');
    if (status === 'open') return;
    const key = eventId;
    setNotice({
      key,
      text: `${status === 'closed' ? 'Closed' : 'Snoozed'} ${conversation.customer.name}`,
      conversationId: conversation.id,
      previous: { status: conversation.status, snoozedUntil: conversation.snoozedUntil },
      eventId,
    });
    schedule(() => setNotice((current) => (current?.key === key ? null : current)), 6000);
  };

  const undo = () => {
    if (!notice) return;
    update(notice.conversationId, (current) => ({
      ...current,
      ...notice.previous,
      entries: current.entries.filter((entry) => entry.id !== notice.eventId),
    }));
    setActiveId(notice.conversationId);
    setNotice(null);
  };

  const send = (text: string) => {
    if (!active) return;
    const id = nextId();
    const note = mode === 'note';
    update(active.id, (current) => ({
      ...current,
      assignee: current.assignee ?? 'me',
      entries: [
        ...current.entries,
        ...(current.assignee
          ? []
          : [
              {
                id: nextId(),
                kind: 'event' as const,
                text: 'You assigned this to yourself',
                day: 'Today',
                time: clock(),
              },
            ]),
        {
          id,
          kind: note ? 'note' : 'reply',
          author: 'me',
          text,
          day: 'Today',
          time: clock(),
          status: note ? undefined : 'sent',
        },
      ],
    }));
    if (note) return;
    const conversationId = active.id;
    const setStatus = (status: ChatMessageStatus) =>
      update(conversationId, (current) => ({
        ...current,
        entries: current.entries.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
      }));
    schedule(() => setStatus('delivered'), 700);
    schedule(() => setStatus('read'), 2600);
  };

  const rows = active ? buildRows(active.entries) : [];
  const latest = active?.entries.at(-1);
  const lastReplyId = active?.entries.filter((entry) => entry.kind === 'reply').at(-1)?.id;
  const firstName = active?.customer.name.split(' ')[0] ?? '';

  return (
    <section data-slot="chat-04" className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div
          data-slot="chat-04-frame"
          className={cn(
            ENTER,
            'grid h-[680px] grid-cols-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_240px]',
          )}
        >
          <aside
            data-slot="chat-04-list"
            className={cn('min-h-0 flex-col border-border md:flex md:border-e', view === 'list' ? 'flex' : 'hidden')}
          >
            <div className="flex flex-col gap-2 border-b border-border px-4 pt-3">
              <div className="flex h-8 items-center justify-between gap-2">
                <h2 className="text-base font-semibold">Inbox</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button type="button" variant="outline" size="sm" aria-label={`Assignee: ${filterLabel}`} />
                    }
                  >
                    {filterLabel}
                    <ChevronDown aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Assignee</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={filter}
                        onValueChange={(value) => setFilter(value as AssigneeFilter)}
                      >
                        {FILTERS.map((item) => (
                          <DropdownMenuRadioItem key={item.value} value={item.value}>
                            {item.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Tabs value={tab} onValueChange={(value) => setTab(value as Status)}>
                <TabsList variant="line" className="w-full justify-start">
                  {TABS.map((item) => (
                    <TabsTrigger key={item.value} value={item.value} className="flex-none">
                      {item.label}
                      <span className="text-xs text-muted-foreground tabular-nums">{counts[item.value]}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {visible.length === 0 ? (
                <Empty key={`${tab}-${filter}`} className={SWAP}>
                  <EmptyHeader>
                    <EmptyTitle>
                      {tab === 'open' ? 'Inbox zero' : tab === 'snoozed' ? 'Nothing snoozed' : 'Nothing closed'}
                    </EmptyTitle>
                    <EmptyDescription>
                      {filter === 'all'
                        ? 'New conversations land in Open.'
                        : `No ${tab} conversations for ${filterLabel.toLowerCase()}.`}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ItemGroup key={`${tab}-${filter}`} aria-label={`${tab} conversations`} className={SWAP}>
                  {visible.map((conversation) => (
                    <InboxListItem
                      key={conversation.id}
                      name={conversation.customer.name}
                      subject={conversation.subject}
                      preview={
                        drafts[conversation.id]?.trim()
                          ? `Draft: ${drafts[conversation.id].trim()}`
                          : listPreview(conversation)
                      }
                      time={listTime(conversation)}
                      unread={conversation.unread}
                      active={conversation.id === activeId}
                      assignee={conversation.assignee ? TEAM[conversation.assignee].initials : undefined}
                      note={conversation.status === 'snoozed' ? `Until ${conversation.snoozedUntil}` : undefined}
                      href={`#${conversation.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        open(conversation.id);
                      }}
                    />
                  ))}
                </ItemGroup>
              )}
            </div>
            <div role="status" aria-live="polite" className="shrink-0">
              {notice ? (
                <div
                  key={notice.key}
                  data-slot="inbox-undo"
                  className={cn(SWAP, 'flex items-center gap-2 border-t border-border py-2 ps-4 pe-2 text-sm')}
                >
                  <span className="min-w-0 flex-1 truncate">{notice.text}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={undo}>
                    Undo
                  </Button>
                </div>
              ) : null}
            </div>
          </aside>

          {active ? (
            <div
              data-slot="chat-04-conversation"
              className={cn('min-h-0 min-w-0 flex-col md:flex', view === 'conversation' ? 'flex' : 'hidden')}
            >
              <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 sm:px-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Back to inbox"
                  onClick={() => setView('list')}
                  className="-ms-1 md:hidden"
                >
                  <ArrowLeft aria-hidden className="rtl:rotate-180" />
                </Button>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="truncate text-sm font-semibold">{active.customer.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{active.subject}</p>
                </div>
                {active.status === 'open' ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button type="button" variant="outline" size="sm" />}>
                        <Clock aria-hidden />
                        <span className="hidden sm:inline">Snooze</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Snooze until</DropdownMenuLabel>
                          {SNOOZE_OPTIONS.map((option) => (
                            <DropdownMenuItem
                              key={option.label}
                              onClick={() =>
                                moveTo(active, 'snoozed', `You snoozed this until ${option.until}`, option.until)
                              }
                            >
                              {option.label}
                              <span className="ms-auto text-xs text-muted-foreground tabular-nums">{option.until}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button type="button" size="sm" onClick={() => moveTo(active, 'closed', 'You closed this')}>
                      <Check aria-hidden />
                      Close
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveTo(active, 'open', 'You reopened this')}
                  >
                    <RotateCcw aria-hidden />
                    Reopen
                  </Button>
                )}
              </div>

              <ChatThread
                key={active.id}
                latestId={latest?.id}
                latestFromSelf={latest?.author === 'me' || latest?.kind === 'event'}
              >
                {rows.map((row) => {
                  if (row.type === 'day') return <ChatDaySeparator key={row.key}>{row.label}</ChatDaySeparator>;
                  if (row.type === 'event') {
                    return (
                      <InboxEvent key={row.key} className={SWAP}>
                        {row.entry.text} <span className="tabular-nums">{row.entry.time}</span>
                      </InboxEvent>
                    );
                  }
                  const own = row.kind !== 'customer';
                  const last = row.entries[row.entries.length - 1];

                  return (
                    <ChatMessageGroup key={row.key} own={own}>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {own && row.author
                            ? TEAM[row.author].initials
                            : active.customer.name
                                .split(' ')
                                .map((part) => part[0])
                                .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <ChatMessageStack>
                        {row.kind === 'note' ? (
                          <ChatMessageSender>
                            <Lock aria-hidden className="size-3" />
                            Internal note, {authorName(row.author)}
                          </ChatMessageSender>
                        ) : own ? (
                          <ChatMessageSender>{authorName(row.author)}</ChatMessageSender>
                        ) : null}
                        {row.entries.map((entry) => (
                          <ChatBubble key={entry.id} note={entry.kind === 'note'} title={entry.time} className={SWAP}>
                            {entry.text}
                          </ChatBubble>
                        ))}
                        <ChatMessageMeta
                          time={last.time}
                          status={last.kind === 'reply' && last.id === lastReplyId ? last.status : undefined}
                        />
                      </ChatMessageStack>
                    </ChatMessageGroup>
                  );
                })}
                <ChatThreadJump />
              </ChatThread>

              <div className="shrink-0 border-t border-border p-3">
                <ChatComposer
                  note={mode === 'note'}
                  value={drafts[active.id] ?? ''}
                  onValueChange={(value) => setDrafts((current) => ({ ...current, [active.id]: value }))}
                  onSend={send}
                >
                  <InputGroupAddon align="block-start">
                    <ToggleGroup
                      size="sm"
                      value={[mode]}
                      onValueChange={([next]) => {
                        if (next) setMode(next as Mode);
                      }}
                      aria-label="Message type"
                    >
                      <ToggleGroupItem value="reply">Reply</ToggleGroupItem>
                      <ToggleGroupItem value="note">
                        <Lock aria-hidden />
                        Note
                      </ToggleGroupItem>
                    </ToggleGroup>
                    {mode === 'note' ? (
                      <span className="inline-flex min-w-0 items-center gap-1.5 rounded-sm bg-warning/15 px-2 py-1 text-xs font-normal text-foreground">
                        <Lock aria-hidden className="size-3" />
                        <span className="truncate">Only your team sees notes</span>
                      </span>
                    ) : (
                      <span className="min-w-0 truncate text-xs font-normal">Replying to {active.customer.email}</span>
                    )}
                  </InputGroupAddon>
                  <ChatComposerInput
                    aria-label={mode === 'note' ? 'Internal note' : 'Reply'}
                    placeholder={mode === 'note' ? 'Add a note for your team' : `Reply to ${firstName}`}
                  />
                  <InputGroupAddon align="block-end">
                    <SavedRepliesMenu firstName={firstName} />
                    <span className="ms-auto hidden text-xs font-normal sm:inline">Shift+Enter for a new line</span>
                    <ChatComposerSend className="max-sm:ms-auto">
                      {mode === 'note' ? 'Add note' : 'Send'}
                      <SendHorizontal aria-hidden className="rtl:rotate-180" />
                    </ChatComposerSend>
                  </InputGroupAddon>
                </ChatComposer>
              </div>
            </div>
          ) : null}

          {active ? (
            <aside
              data-slot="chat-04-customer"
              aria-label="Customer details"
              className="hidden min-h-0 flex-col gap-5 overflow-y-auto border-s border-border p-4 xl:flex"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase">Customer</span>
                <span className="text-sm font-medium">{active.customer.name}</span>
                <span className="truncate text-xs text-muted-foreground">{active.customer.email}</span>
              </div>
              <dl className="flex flex-col gap-3 text-sm">
                {[
                  ['Company', active.customer.company],
                  ['Plan', active.customer.plan],
                  ['Customer since', active.customer.since],
                  ['Assignee', active.assignee ? TEAM[active.assignee].name : 'Unassigned'],
                  [
                    'Status',
                    active.status === 'snoozed'
                      ? `Snoozed until ${active.snoozedUntil}`
                      : active.status === 'open'
                        ? 'Open'
                        : 'Closed',
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5 border-t border-border pt-3">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Chat04;
