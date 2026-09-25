'use client';

import * as React from 'react';
import {
  ArrowDown,
  ArrowLeft,
  Check,
  CheckCheck,
  FileText,
  ImageIcon,
  Paperclip,
  Search,
  SendHorizontal,
  SmilePlus,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/registry/hirael/bases/radix/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from '@/registry/hirael/bases/radix/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/registry/hirael/bases/radix/ui/item';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { EmojiPicker, EmojiPickerList, EmojiPickerSearch } from '@/registry/hirael/bases/radix/components/emoji-picker';

export type ChatMessageStatus = 'sent' | 'delivered' | 'read';
export type ChatAttachmentKind = 'image' | 'file';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-1 duration-250 ${EASE} fill-mode-both motion-reduce:animate-none`;

const prefersReducedMotion = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface ChatAvatarProps extends React.ComponentProps<'span'> {
  initials: string;
  /** Shows a presence dot on the end side. */
  online?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const ChatAvatar = ({ initials, online = false, size = 'default', className, ...props }: ChatAvatarProps) => {
  return (
    <span data-slot="chat-avatar" className={cn('relative inline-flex shrink-0', className)} {...props}>
      <Avatar size={size}>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {online ? (
        <span
          data-slot="chat-avatar-presence"
          aria-hidden
          className="absolute end-0 bottom-0 size-2.5 rounded-full bg-success ring-2 ring-card"
        />
      ) : null}
    </span>
  );
};

interface ChatListItemProps extends Omit<React.ComponentProps<'a'>, 'children'> {
  name: string;
  preview: React.ReactNode;
  /** Time for today, a day label for anything older. */
  time: string;
  unread?: number;
  active?: boolean;
  avatar?: React.ReactNode;
}

/** A link, so a real app can point `href` at the conversation's route. */
const ChatListItem = ({ name, preview, time, unread = 0, active = false, avatar, ...props }: ChatListItemProps) => {
  const hasUnread = unread > 0;

  return (
    <Item asChild size="sm" variant={active ? 'muted' : 'default'}>
      <a
        data-slot="chat-list-item"
        data-active={active || undefined}
        data-unread={hasUnread || undefined}
        aria-current={active ? 'page' : undefined}
        {...props}
      >
        {avatar ? <ItemMedia>{avatar}</ItemMedia> : null}
        <ItemContent className="min-w-0">
          <ItemTitle className="w-full min-w-0">
            <span className={cn('truncate', hasUnread && 'font-semibold')}>{name}</span>
          </ItemTitle>
          <ItemDescription>
            <span className={cn('block truncate', hasUnread && 'text-foreground')}>{preview}</span>
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex-col items-end self-start">
          <span
            className={cn('text-xs tabular-nums', hasUnread ? 'font-medium text-primary' : 'text-muted-foreground')}
          >
            {time}
          </span>
          {hasUnread ? (
            <Badge data-slot="chat-list-item-unread">
              <span className="tabular-nums">{unread}</span>
              <span className="sr-only"> unread</span>
            </Badge>
          ) : null}
        </ItemActions>
      </a>
    </Item>
  );
};

type ChatHeaderProps = React.ComponentProps<'div'>;

const ChatHeader = ({ className, ...props }: ChatHeaderProps) => {
  return (
    <div
      data-slot="chat-header"
      className={cn('flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-4', className)}
      {...props}
    />
  );
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

/** Render it as the last child of the thread. */
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
      className={cn('px-1 pb-0.5 text-xs font-medium text-muted-foreground', className)}
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
        'flex max-w-full flex-col gap-2 rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap',
        own
          ? 'bg-primary text-primary-foreground [&:has(+[data-slot=chat-bubble])]:rounded-ee-md [[data-slot=chat-bubble]+&]:rounded-se-md'
          : 'bg-muted text-foreground [&:has(+[data-slot=chat-bubble])]:rounded-es-md [[data-slot=chat-bubble]+&]:rounded-ss-md',
        className,
      )}
      {...props}
    />
  );
};

interface ChatBubbleAttachmentProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  size: number;
  kind?: ChatAttachmentKind;
}

const ChatBubbleAttachment = ({ name, size, kind = 'file', className, ...props }: ChatBubbleAttachmentProps) => {
  const own = React.useContext(ChatMessageGroupContext);
  const Icon = kind === 'image' ? ImageIcon : FileText;

  return (
    <div
      data-slot="chat-bubble-attachment"
      className={cn(
        'flex min-w-0 items-center gap-2.5 rounded-lg px-2.5 py-2 whitespace-normal',
        own ? 'bg-primary-foreground/15' : 'bg-background',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className="size-4 shrink-0" />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className={cn('text-xs tabular-nums', own ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
          {formatBytes(size)}
        </span>
      </span>
    </div>
  );
};

const STATUS_LABEL: Record<ChatMessageStatus, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
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
  /** Announced to screen readers, e.g. "Maya is typing". */
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
  insertText: (text: string) => void;
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
  /** Allow sending with no text, for example when a file is attached. */
  allowEmpty?: boolean;
  disabled?: boolean;
}

/** A form around an InputGroup: compose the input and addons inside it. */
const ChatComposer = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSend,
  allowEmpty = false,
  disabled = false,
  className,
  children,
  ...props
}: ChatComposerProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const canSend = !disabled && (value.trim().length > 0 || allowEmpty);

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
    () => ({ value, setValue, canSend, send, insertText, inputRef, disabled }),
    [value, setValue, canSend, send, insertText, disabled],
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
      className={cn('max-h-36', className)}
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

interface ChatComposerAttachmentProps extends Omit<React.ComponentProps<typeof Badge>, 'children'> {
  name: string;
  size: number;
  kind?: ChatAttachmentKind;
  onRemove?: () => void;
}

const ChatComposerAttachment = ({ name, size, kind = 'file', onRemove, ...props }: ChatComposerAttachmentProps) => {
  const Icon = kind === 'image' ? ImageIcon : FileText;

  return (
    <Badge data-slot="chat-composer-attachment" variant="outline" className="max-w-full" {...props}>
      <Icon aria-hidden />
      <span className="max-w-40 truncate">{name}</span>
      <span className="font-normal text-muted-foreground tabular-nums">{formatBytes(size)}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
          className="-me-1 rounded-full p-0.5 text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden className="size-3" />
        </button>
      ) : null}
    </Badge>
  );
};

export {
  ChatAvatar,
  ChatListItem,
  ChatHeader,
  ChatThread,
  ChatThreadJump,
  ChatDaySeparator,
  ChatMessageGroup,
  ChatMessageStack,
  ChatMessageSender,
  ChatBubble,
  ChatBubbleAttachment,
  ChatMessageMeta,
  ChatTyping,
  ChatComposer,
  ChatComposerInput,
  ChatComposerSend,
  ChatComposerAttachment,
  useChatThread,
  useChatComposer,
};

const ME = 'me';

interface Person {
  name: string;
  initials: string;
  online: boolean;
  lastSeen?: string;
}

const PEOPLE: Record<string, Person> = {
  maya: { name: 'Maya Chen', initials: 'MC', online: true },
  omar: { name: 'Omar Haddad', initials: 'OH', online: true },
  priya: { name: 'Priya Nair', initials: 'PN', online: false, lastSeen: 'Last seen 2 hours ago' },
  jonas: { name: 'Jonas Weber', initials: 'JW', online: true },
  leo: { name: 'Leo Martins', initials: 'LM', online: false, lastSeen: 'Last seen today at 08:16' },
  daniel: { name: 'Daniel Okafor', initials: 'DO', online: false, lastSeen: 'Last seen yesterday' },
};

interface Attachment {
  id: string;
  name: string;
  size: number;
  kind: ChatAttachmentKind;
}

interface Message {
  id: string;
  from: string;
  text: string;
  /** Day label used for separators, e.g. "Today". */
  day: string;
  /** 24-hour clock, e.g. "09:14". */
  time: string;
  status?: ChatMessageStatus;
  attachments?: Attachment[];
}

interface Conversation {
  id: string;
  /** Group chats have a title; direct chats take the other person's name. */
  title?: string;
  initials?: string;
  members: string[];
  unread: number;
  messages: Message[];
  /** Scripted answers, used one per message you send. */
  replies: { from: string; text: string }[];
  typing?: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'crew',
    title: 'Climbing crew',
    initials: 'CC',
    members: ['jonas', 'leo', 'priya'],
    unread: 0,
    messages: [
      {
        id: 'c1',
        from: 'jonas',
        text: 'Saturday session still on? The new routes go up Friday night.',
        day: 'Today',
        time: '08:02',
      },
      { id: 'c2', from: 'leo', text: "I'm in. Can someone bring the spare chalk bag?", day: 'Today', time: '08:15' },
      { id: 'c3', from: ME, text: 'I have it. 10:00 at the gym?', day: 'Today', time: '08:40', status: 'read' },
      { id: 'c4', from: 'jonas', text: '10:00 works.', day: 'Today', time: '11:26' },
      { id: 'c5', from: 'jonas', text: 'I also booked the auto-belay lane for 11.', day: 'Today', time: '11:27' },
      { id: 'c6', from: 'priya', text: 'Count me in, I will be there around 10:30.', day: 'Today', time: '11:50' },
    ],
    replies: [
      { from: 'jonas', text: 'Perfect, see you all there.' },
      { from: 'jonas', text: 'Bring tape too, the new crimps are sharp.' },
    ],
  },
  {
    id: 'maya',
    members: ['maya'],
    unread: 2,
    messages: [
      {
        id: 'm1',
        from: 'maya',
        text: 'Did you see the flight prices for Lisbon? They dropped again.',
        day: 'Yesterday',
        time: '21:04',
      },
      {
        id: 'm2',
        from: 'maya',
        text: 'There is a direct one on Oct 17, back on the 21st.',
        day: 'Yesterday',
        time: '21:05',
      },
      {
        id: 'm3',
        from: ME,
        text: 'Just checked. 142 each way, lowest I have seen.',
        day: 'Yesterday',
        time: '21:30',
        status: 'read',
      },
      {
        id: 'm4',
        from: ME,
        text: 'Want me to book both seats tonight?',
        day: 'Yesterday',
        time: '21:31',
        status: 'read',
      },
      {
        id: 'm5',
        from: 'maya',
        text: 'Give me until tomorrow, I need to confirm the Friday off.',
        day: 'Yesterday',
        time: '21:45',
      },
      { id: 'm6', from: 'maya', text: 'Got it approved. Friday is off.', day: 'Today', time: '09:12' },
      {
        id: 'm7',
        from: 'maya',
        text: 'Book the 07:40 one if it is still there.\nWindow seat for me please.',
        day: 'Today',
        time: '09:13',
      },
    ],
    replies: [
      { from: 'maya', text: 'Thank you. I will send you my half tonight.' },
      { from: 'maya', text: 'Also found a flat in Alfama, sending the link later.' },
    ],
  },
  {
    id: 'omar',
    members: ['omar'],
    unread: 0,
    messages: [
      {
        id: 'o1',
        from: 'omar',
        text: 'Hey, do you still have my 35mm lens? No rush, just checking.',
        day: 'Monday',
        time: '18:20',
      },
      {
        id: 'o2',
        from: ME,
        text: 'Yes, it is in my bag. Coffee on Thursday and I will bring it?',
        day: 'Monday',
        time: '18:52',
        status: 'read',
      },
      { id: 'o3', from: 'omar', text: 'Deal. The place by the station?', day: 'Monday', time: '18:53' },
      { id: 'o4', from: ME, text: 'See you at 8:30.', day: 'Monday', time: '18:55', status: 'read' },
    ],
    replies: [{ from: 'omar', text: 'Sounds good. I owe you a croissant.' }],
  },
  {
    id: 'priya',
    members: ['priya'],
    unread: 0,
    messages: [
      {
        id: 'p1',
        from: 'priya',
        text: 'Final slides for Thursday are attached.',
        day: 'Sep 18',
        time: '15:10',
        attachments: [{ id: 'p1a', name: 'q3-review-final.pdf', size: 2_516_582, kind: 'file' }],
      },
      {
        id: 'p2',
        from: ME,
        text: 'Thanks, they look great. I will take the roadmap section.',
        day: 'Sep 18',
        time: '15:32',
        status: 'read',
      },
    ],
    replies: [],
  },
  {
    id: 'daniel',
    members: ['daniel'],
    unread: 1,
    messages: [
      {
        id: 'd1',
        from: ME,
        text: 'Daniel, meet Lena. She is hiring a backend lead and I think you two should talk.',
        day: 'Sep 15',
        time: '10:02',
        status: 'read',
      },
      {
        id: 'd2',
        from: 'daniel',
        text: 'Thanks for the intro. I will reach out to her today.',
        day: 'Sep 15',
        time: '10:40',
      },
    ],
    replies: [],
  },
];

const GROUP_GAP_MINUTES = 10;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
};

type ThreadRow =
  { type: 'day'; key: string; label: string } | { type: 'group'; key: string; from: string; messages: Message[] };

const groupMessages = (messages: readonly Message[]): ThreadRow[] => {
  const rows: ThreadRow[] = [];
  let day: string | undefined;
  for (const message of messages) {
    if (message.day !== day) {
      rows.push({ type: 'day', key: `day-${message.day}`, label: message.day });
      day = message.day;
    }
    const last = rows[rows.length - 1];
    const previous = last.type === 'group' ? last.messages[last.messages.length - 1] : undefined;
    if (
      last.type === 'group' &&
      previous &&
      last.from === message.from &&
      toMinutes(message.time) - toMinutes(previous.time) <= GROUP_GAP_MINUTES
    ) {
      last.messages.push(message);
    } else {
      rows.push({ type: 'group', key: message.id, from: message.from, messages: [message] });
    }
  }

  return rows;
};

const clock = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date());

const conversationName = (conversation: Conversation) => conversation.title ?? PEOPLE[conversation.members[0]].name;

const conversationInitials = (conversation: Conversation) =>
  conversation.initials ?? PEOPLE[conversation.members[0]].initials;

const isGroup = (conversation: Conversation) => conversation.members.length > 1;

const isOnline = (conversation: Conversation) => !isGroup(conversation) && PEOPLE[conversation.members[0]].online;

const conversationStatus = (conversation: Conversation) => {
  if (conversation.typing) {
    return isGroup(conversation) ? `${PEOPLE[conversation.typing].name.split(' ')[0]} is typing` : 'Typing';
  }
  if (isGroup(conversation)) {
    const online = conversation.members.filter((id) => PEOPLE[id].online).length;

    return `${conversation.members.length + 1} members, ${online} online`;
  }
  const person = PEOPLE[conversation.members[0]];

  return person.online ? 'Online' : (person.lastSeen ?? 'Offline');
};

const previewOf = (conversation: Conversation, draft: string | undefined) => {
  if (draft?.trim()) return `Draft: ${draft.trim()}`;
  const last = conversation.messages[conversation.messages.length - 1];
  const body = last.text || (last.attachments?.length ? last.attachments.map((file) => file.name).join(', ') : '');
  if (last.from === ME) return `You: ${body}`;

  return isGroup(conversation) ? `${PEOPLE[last.from].name.split(' ')[0]}: ${body}` : body;
};

const ComposerEmoji = () => {
  const { insertText, inputRef } = useChatComposer();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <InputGroupButton size="icon-sm" aria-label="Add emoji">
          <SmilePlus aria-hidden />
        </InputGroupButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className="w-auto p-0"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <EmojiPicker
          onEmojiSelect={(emoji) => {
            insertText(emoji);
            setOpen(false);
          }}
        >
          <EmojiPickerSearch placeholder="Search emoji" />
          <EmojiPickerList className="h-48" />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};

const Chat01 = () => {
  const [conversations, setConversations] = React.useState(CONVERSATIONS);
  const [activeId, setActiveId] = React.useState(CONVERSATIONS[0].id);
  const [view, setView] = React.useState<'list' | 'thread'>('list');
  const [query, setQuery] = React.useState('');
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const activeIdRef = React.useRef(activeId);
  const timersRef = React.useRef(new Set<number>());
  const pendingReplyRef = React.useRef(new Set<string>());
  const counterRef = React.useRef(0);
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

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

  const nextId = (prefix: string) => {
    counterRef.current += 1;

    return `${prefix}-${counterRef.current}`;
  };

  const updateConversation = (id: string, change: (conversation: Conversation) => Conversation) => {
    setConversations((current) =>
      current.map((conversation) => (conversation.id === id ? change(conversation) : conversation)),
    );
  };

  const moveToTop = (id: string) => {
    setConversations((current) => {
      const target = current.find((conversation) => conversation.id === id);

      return target ? [target, ...current.filter((conversation) => conversation.id !== id)] : current;
    });
  };

  const active = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0];

  const open = (id: string) => {
    setActiveId(id);
    setView('thread');
    setAttachments([]);
    updateConversation(id, (conversation) => ({ ...conversation, unread: 0 }));
  };

  const send = (text: string) => {
    const conversation = active;
    const id = nextId(conversation.id);
    const message: Message = {
      id,
      from: ME,
      text,
      day: 'Today',
      time: clock(),
      status: 'sent',
      attachments: attachments.length ? attachments : undefined,
    };
    updateConversation(conversation.id, (current) => ({ ...current, messages: [...current.messages, message] }));
    moveToTop(conversation.id);
    setAttachments([]);

    const setStatus = (status: ChatMessageStatus) =>
      updateConversation(conversation.id, (current) => ({
        ...current,
        messages: current.messages.map((item) =>
          item.from === ME && item.status && item.status !== 'read' ? { ...item, status } : item,
        ),
      }));

    schedule(() => setStatus('delivered'), 600);

    const reply = conversation.replies[0];
    const reader = reply?.from ?? conversation.members[0];
    if (!PEOPLE[reader].online) return;
    schedule(() => setStatus('read'), 1500);
    if (!reply || pendingReplyRef.current.has(conversation.id)) return;

    pendingReplyRef.current.add(conversation.id);
    schedule(() => updateConversation(conversation.id, (current) => ({ ...current, typing: reply.from })), 2300);
    schedule(() => {
      pendingReplyRef.current.delete(conversation.id);
      updateConversation(conversation.id, (current) => ({
        ...current,
        typing: undefined,
        replies: current.replies.slice(1),
        unread: activeIdRef.current === current.id ? 0 : current.unread + 1,
        messages: [
          ...current.messages,
          { id: nextId(current.id), from: reply.from, text: reply.text, day: 'Today', time: clock() },
        ],
      }));
      moveToTop(conversation.id);
    }, 4600);
  };

  const addFiles = (files: File[]) => {
    setAttachments((current) => [
      ...current,
      ...files.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        size: file.size,
        kind: file.type.startsWith('image/') ? ('image' as const) : ('file' as const),
      })),
    ]);
  };

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? conversations.filter(
        (conversation) =>
          conversationName(conversation).toLowerCase().includes(needle) ||
          conversation.messages.some((message) => message.text.toLowerCase().includes(needle)),
      )
    : conversations;
  const totalUnread = conversations.reduce((sum, conversation) => sum + conversation.unread, 0);

  const rows = groupMessages(active.messages);
  const latest = active.messages[active.messages.length - 1];
  const lastOwnId = [...active.messages].reverse().find((message) => message.from === ME)?.id;
  const firstName = conversationName(active).split(' ')[0];

  return (
    <section data-slot="chat-01" className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div
          data-slot="chat-01-frame"
          className={cn(
            ENTER,
            'grid h-[640px] grid-cols-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground md:grid-cols-[300px_minmax(0,1fr)]',
          )}
        >
          <aside
            data-slot="chat-01-sidebar"
            className={cn('min-h-0 flex-col border-border md:flex md:border-e', view === 'list' ? 'flex' : 'hidden')}
          >
            <div className="flex flex-col gap-3 border-b border-border p-3">
              <div className="flex h-8 items-baseline justify-between gap-2 px-1">
                <h2 className="text-base font-semibold">Messages</h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {totalUnread > 0 ? `${totalUnread} unread` : 'All read'}
                </span>
              </div>
              <InputGroup>
                <InputGroupAddon>
                  <Search aria-hidden />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                  aria-label="Search conversations"
                />
              </InputGroup>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {visible.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No matches</EmptyTitle>
                    <EmptyDescription>No names or messages contain &ldquo;{query.trim()}&rdquo;.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ItemGroup aria-label="Conversations">
                  {visible.map((conversation) => {
                    const last = conversation.messages[conversation.messages.length - 1];

                    return (
                      <ChatListItem
                        key={conversation.id}
                        name={conversationName(conversation)}
                        time={last.day === 'Today' ? last.time : last.day}
                        preview={conversation.typing ? 'Typing' : previewOf(conversation, drafts[conversation.id])}
                        unread={conversation.unread}
                        active={conversation.id === activeId}
                        href={`#${conversation.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          open(conversation.id);
                        }}
                        avatar={
                          <ChatAvatar initials={conversationInitials(conversation)} online={isOnline(conversation)} />
                        }
                      />
                    );
                  })}
                </ItemGroup>
              )}
            </div>
          </aside>

          <div
            data-slot="chat-01-conversation"
            className={cn('min-h-0 min-w-0 flex-col md:flex', view === 'thread' ? 'flex' : 'hidden')}
          >
            <ChatHeader>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Back to conversations"
                onClick={() => setView('list')}
                className="-ms-1 md:hidden"
              >
                <ArrowLeft aria-hidden className="rtl:rotate-180" />
              </Button>
              <ChatAvatar initials={conversationInitials(active)} online={isOnline(active)} />
              <div className="flex min-w-0 flex-col">
                <h3 className="truncate text-sm font-semibold">{conversationName(active)}</h3>
                <p className="truncate text-xs text-muted-foreground">{conversationStatus(active)}</p>
              </div>
            </ChatHeader>

            <ChatThread key={active.id} latestId={latest.id} latestFromSelf={latest.from === ME}>
              {rows.map((row) => {
                if (row.type === 'day') {
                  return <ChatDaySeparator key={row.key}>{row.label}</ChatDaySeparator>;
                }
                const own = row.from === ME;
                const person = PEOPLE[row.from];
                const last = row.messages[row.messages.length - 1];

                return (
                  <ChatMessageGroup key={row.key} own={own}>
                    {!own && isGroup(active) ? <ChatAvatar size="sm" initials={person.initials} /> : null}
                    <ChatMessageStack>
                      {!own && isGroup(active) ? <ChatMessageSender>{person.name}</ChatMessageSender> : null}
                      {row.messages.map((message) => (
                        <ChatBubble key={message.id} title={message.time} className={SWAP}>
                          {message.attachments?.map((file) => (
                            <ChatBubbleAttachment key={file.id} name={file.name} size={file.size} kind={file.kind} />
                          ))}
                          {message.text ? <span>{message.text}</span> : null}
                        </ChatBubble>
                      ))}
                      <ChatMessageMeta
                        time={last.time}
                        status={own && last.id === lastOwnId ? last.status : undefined}
                      />
                    </ChatMessageStack>
                  </ChatMessageGroup>
                );
              })}
              {active.typing ? (
                <ChatMessageGroup className={SWAP}>
                  {isGroup(active) ? <ChatAvatar size="sm" initials={PEOPLE[active.typing].initials} /> : null}
                  <ChatMessageStack>
                    <ChatTyping label={`${PEOPLE[active.typing].name} is typing`} />
                  </ChatMessageStack>
                </ChatMessageGroup>
              ) : null}
              <ChatThreadJump />
            </ChatThread>

            <div className="shrink-0 border-t border-border p-3">
              <ChatComposer
                value={drafts[active.id] ?? ''}
                onValueChange={(value) => setDrafts((current) => ({ ...current, [active.id]: value }))}
                onSend={send}
                allowEmpty={attachments.length > 0}
              >
                {attachments.length > 0 ? (
                  <InputGroupAddon align="block-start" className="flex-wrap">
                    {attachments.map((file) => (
                      <ChatComposerAttachment
                        key={file.id}
                        name={file.name}
                        size={file.size}
                        kind={file.kind}
                        onRemove={() => setAttachments((current) => current.filter((item) => item.id !== file.id))}
                      />
                    ))}
                  </InputGroupAddon>
                ) : null}
                <ChatComposerInput placeholder={`Message ${isGroup(active) ? conversationName(active) : firstName}`} />
                <InputGroupAddon align="block-end">
                  <InputGroupButton size="icon-sm" aria-label="Attach files" onClick={() => fileRef.current?.click()}>
                    <Paperclip aria-hidden />
                  </InputGroupButton>
                  <ComposerEmoji />
                  <span className="ms-auto hidden text-xs font-normal sm:inline">Shift+Enter for a new line</span>
                  <ChatComposerSend className="max-sm:ms-auto" />
                </InputGroupAddon>
              </ChatComposer>
              <input
                ref={fileRef}
                type="file"
                multiple
                tabIndex={-1}
                aria-hidden
                className="sr-only"
                onChange={(event) => {
                  addFiles(Array.from(event.target.files ?? []));
                  event.target.value = '';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat01;
