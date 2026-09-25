'use client';

import * as React from 'react';
import { ArrowDown, Hash, MessageSquareText, Pin, PinOff, SendHorizontal, SmilePlus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { Toggle } from '@/registry/hirael/bases/base/ui/toggle';
import {
  MentionInput,
  MentionInputList,
  MentionInputTextarea,
  useMentionInput,
  type MentionItem,
} from '@/registry/hirael/bases/base/components/mention-input';

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

  // Reactions and replies grow the content without scrolling it, so follow the box size.
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
          className="flex min-h-full shrink-0 flex-col justify-end py-3"
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
    <div data-slot="chat-thread-jump" className="sticky bottom-2 z-10 flex h-0 justify-center overflow-visible">
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
      className={cn('flex items-center gap-3 px-4 py-2 text-[11px] text-muted-foreground uppercase', className)}
      {...props}
    >
      <span aria-hidden className="h-px flex-1 bg-border" />
      <span>{children}</span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
};

type ChannelHeaderProps = React.ComponentProps<'div'>;

const ChannelHeader = ({ className, ...props }: ChannelHeaderProps) => {
  return (
    <div
      data-slot="channel-header"
      className={cn('flex h-14 shrink-0 items-center gap-3 border-b border-border px-4', className)}
      {...props}
    />
  );
};

interface ChannelPinnedBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  author: string;
  text: string;
  onJump?: () => void;
  onUnpin?: () => void;
}

const ChannelPinnedBar = ({ author, text, onJump, onUnpin, className, ...props }: ChannelPinnedBarProps) => {
  return (
    <div
      data-slot="channel-pinned-bar"
      className={cn('flex shrink-0 items-center gap-1 border-b border-border bg-muted/40 py-1 ps-4 pe-2', className)}
      {...props}
    >
      <button
        type="button"
        onClick={onJump}
        className="flex min-w-0 flex-1 items-center gap-2.5 py-1 text-start text-xs outline-none focus-visible:underline"
      >
        <Pin aria-hidden className="size-3.5 shrink-0 text-primary" />
        <span className="shrink-0 font-medium text-foreground">{author}</span>
        <span className="truncate text-muted-foreground">{text}</span>
      </button>
      {onUnpin ? (
        <Button type="button" variant="ghost" size="icon-xs" aria-label="Unpin message" onClick={onUnpin}>
          <X aria-hidden />
        </Button>
      ) : null}
    </div>
  );
};

interface ChannelMessageProps extends React.ComponentProps<'div'> {
  /** Follows a message from the same author, so the name and avatar are skipped. */
  continued?: boolean;
  /** Draws attention to the row, for example after jumping to it. */
  highlighted?: boolean;
  /** Keeps the toolbar visible without hover, for touch screens. */
  active?: boolean;
}

const ChannelMessage = ({
  continued = false,
  highlighted = false,
  active = false,
  className,
  ...props
}: ChannelMessageProps) => {
  return (
    <div
      data-slot="channel-message"
      data-continued={continued || undefined}
      data-highlighted={highlighted || undefined}
      data-active={active || undefined}
      className={cn(
        'group/message relative flex gap-3 px-4 transition-colors duration-300 hover:bg-muted/40 data-[active]:bg-muted/40 data-[highlighted]:bg-primary/10',
        continued ? 'py-0.5' : 'mt-2 pt-1.5 pb-0.5',
        className,
      )}
      {...props}
    />
  );
};

interface ChannelMessageGutterProps extends React.ComponentProps<'div'> {
  /** Shown on hover beside continued messages. */
  time?: string;
}

const ChannelMessageGutter = ({ time, className, children, ...props }: ChannelMessageGutterProps) => {
  return (
    <div data-slot="channel-message-gutter" className={cn('flex w-8 shrink-0 justify-center', className)} {...props}>
      {children ??
        (time ? (
          <time className="pt-0.5 text-[10px] text-muted-foreground tabular-nums opacity-0 group-hover/message:opacity-100 group-data-[active]/message:opacity-100">
            {time}
          </time>
        ) : null)}
    </div>
  );
};

type ChannelMessageBodyProps = React.ComponentProps<'div'>;

const ChannelMessageBody = ({ className, ...props }: ChannelMessageBodyProps) => {
  return (
    <div data-slot="channel-message-body" className={cn('flex min-w-0 flex-1 flex-col gap-1', className)} {...props} />
  );
};

interface ChannelMessageAuthorProps extends React.ComponentProps<'div'> {
  name: string;
  time: string;
}

const ChannelMessageAuthor = ({ name, time, className, ...props }: ChannelMessageAuthorProps) => {
  return (
    <div data-slot="channel-message-author" className={cn('flex items-baseline gap-2', className)} {...props}>
      <span className="text-sm font-semibold text-foreground">{name}</span>
      <time className="text-[11px] text-muted-foreground tabular-nums">{time}</time>
    </div>
  );
};

type ChannelMessageTextProps = React.ComponentProps<'div'>;

const ChannelMessageText = ({ className, ...props }: ChannelMessageTextProps) => {
  return (
    <div
      data-slot="channel-message-text"
      className={cn('text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground', className)}
      {...props}
    />
  );
};

type ChannelMessageToolbarProps = React.ComponentProps<'div'>;

const ChannelMessageToolbar = ({ className, ...props }: ChannelMessageToolbarProps) => {
  return (
    <div
      data-slot="channel-message-toolbar"
      role="toolbar"
      aria-label="Message actions"
      className={cn(
        'pointer-events-none absolute end-3 -top-3 z-10 flex items-center gap-0.5 rounded-md border border-border bg-popover p-0.5 text-popover-foreground opacity-0 shadow-sm transition-opacity duration-150 group-focus-within/message:pointer-events-auto group-focus-within/message:opacity-100 group-hover/message:pointer-events-auto group-hover/message:opacity-100 group-data-[active]/message:pointer-events-auto group-data-[active]/message:opacity-100 has-data-popup-open:pointer-events-auto has-data-popup-open:opacity-100 motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  );
};

type ChannelReactionsProps = React.ComponentProps<'div'>;

const ChannelReactions = ({ className, ...props }: ChannelReactionsProps) => {
  return (
    <div
      data-slot="channel-reactions"
      role="group"
      aria-label="Reactions"
      className={cn('flex flex-wrap items-center gap-1 pt-0.5', className)}
      {...props}
    />
  );
};

interface ChannelReactionProps extends Omit<React.ComponentProps<typeof Toggle>, 'children'> {
  emoji: string;
  count: number;
}

/** Pressed when the reader has reacted with this emoji. */
const ChannelReaction = ({ emoji, count, ...props }: ChannelReactionProps) => {
  return (
    <Toggle data-slot="channel-reaction" variant="outline" size="sm" {...props}>
      <span aria-hidden>{emoji}</span>
      <span key={count} className="animate-in text-xs tabular-nums duration-200 fade-in motion-reduce:animate-none">
        {count}
      </span>
    </Toggle>
  );
};

interface ChannelThreadSummaryProps extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  count: number;
  lastReply: string;
}

const ChannelThreadSummary = ({ count, lastReply, className, ...props }: ChannelThreadSummaryProps) => {
  return (
    <Button
      type="button"
      data-slot="channel-thread-summary"
      variant="ghost"
      size="sm"
      className={cn('-ms-2 w-fit', className)}
      {...props}
    >
      <span className="text-primary tabular-nums">
        {count} {count === 1 ? 'reply' : 'replies'}
      </span>
      <span className="hidden font-normal text-muted-foreground sm:inline">Last reply {lastReply}</span>
    </Button>
  );
};

type ChannelThreadPanelProps = React.ComponentProps<'aside'>;

const ChannelThreadPanel = ({ className, ...props }: ChannelThreadPanelProps) => {
  return (
    <aside
      data-slot="channel-thread-panel"
      aria-label="Thread"
      className={cn(
        'absolute inset-0 z-20 flex min-h-0 flex-col bg-card lg:static lg:z-auto lg:border-s lg:border-border',
        className,
      )}
      {...props}
    />
  );
};

export {
  ChannelHeader,
  ChannelPinnedBar,
  ChannelMessage,
  ChannelMessageGutter,
  ChannelMessageBody,
  ChannelMessageAuthor,
  ChannelMessageText,
  ChannelMessageToolbar,
  ChannelReactions,
  ChannelReaction,
  ChannelThreadSummary,
  ChannelThreadPanel,
  ChatThread,
  ChatThreadJump,
  ChatDaySeparator,
};

const ME = 'sam';

interface Member {
  name: string;
  initials: string;
  role: string;
}

const MEMBERS: Record<string, Member> = {
  sam: { name: 'Sam Rivera', initials: 'SR', role: 'Content design' },
  ines: { name: 'Ines Duarte', initials: 'ID', role: 'Product design' },
  kofi: { name: 'Kofi Mensah', initials: 'KM', role: 'Frontend' },
  hana: { name: 'Hana Sato', initials: 'HS', role: 'Product' },
  rafael: { name: 'Rafael Ortiz', initials: 'RO', role: 'Backend' },
};

const MENTIONS: MentionItem[] = Object.entries(MEMBERS)
  .filter(([id]) => id !== ME)
  .map(([id, member]) => ({ id, label: id, description: `${member.name}, ${member.role}` }));

const QUICK_REACTIONS = ['👍', '🎉', '👀'];
const MORE_REACTIONS = ['👍', '❤️', '😂', '🎉', '👀', '✅', '🙏', '🔥'];

interface Reaction {
  emoji: string;
  users: string[];
}

interface Reply {
  id: string;
  author: string;
  text: string;
  day: string;
  time: string;
}

interface Message extends Reply {
  reactions: Reaction[];
  replies: Reply[];
}

const MESSAGES: Message[] = [
  {
    id: 'm1',
    author: 'hana',
    text: 'Reminder: design freeze for the billing redesign is Thursday. Anything not in Figma by then moves to the next cycle.',
    day: 'Yesterday',
    time: '16:02',
    reactions: [{ emoji: '👍', users: ['kofi', 'rafael', 'ines'] }],
    replies: [],
  },
  {
    id: 'm2',
    author: 'ines',
    text: 'New invoice list is up for review. The status column is now a row of filter chips above the table.',
    day: 'Yesterday',
    time: '16:40',
    reactions: [{ emoji: '👀', users: ['hana', 'sam'] }],
    replies: [
      {
        id: 'm2r1',
        author: 'kofi',
        text: 'Chips are nice. Do we keep the old column on mobile?',
        day: 'Yesterday',
        time: '16:52',
      },
      {
        id: 'm2r2',
        author: 'ines',
        text: 'No, mobile gets the chips too. They scroll sideways.',
        day: 'Yesterday',
        time: '17:03',
      },
      {
        id: 'm2r3',
        author: 'sam',
        text: 'Works for me. I will update the empty state copy to match.',
        day: 'Yesterday',
        time: '17:10',
      },
    ],
  },
  {
    id: 'm3',
    author: 'ines',
    text: 'Frames are on page 3 of the billing file.',
    day: 'Yesterday',
    time: '16:41',
    reactions: [],
    replies: [],
  },
  {
    id: 'm4',
    author: 'kofi',
    text: 'Shipped the date range picker to staging. @ines can you check the right-to-left layout before I merge?',
    day: 'Today',
    time: '09:18',
    reactions: [{ emoji: '✅', users: ['ines'] }],
    replies: [
      {
        id: 'm4r1',
        author: 'ines',
        text: 'Looks right. The chevrons flip and the presets stay on the end side.',
        day: 'Today',
        time: '09:31',
      },
      { id: 'm4r2', author: 'kofi', text: 'Great, merging after lunch.', day: 'Today', time: '09:33' },
    ],
  },
  {
    id: 'm5',
    author: 'rafael',
    text: 'Heads up: the invoices endpoint now returns a status label, so the UI no longer maps codes itself.',
    day: 'Today',
    time: '10:05',
    reactions: [{ emoji: '🎉', users: ['kofi', 'sam'] }],
    replies: [],
  },
  {
    id: 'm6',
    author: 'rafael',
    text: 'Live on staging since 10:02.',
    day: 'Today',
    time: '10:06',
    reactions: [],
    replies: [],
  },
  {
    id: 'm7',
    author: 'hana',
    text: 'Can we do a 20 minute crit at 14:00 for the empty states? @sam you had the new copy.',
    day: 'Today',
    time: '11:42',
    reactions: [{ emoji: '👍', users: ['kofi', 'ines'] }],
    replies: [],
  },
];

const INCOMING: Omit<Message, 'time'> = {
  id: 'incoming-1',
  author: 'rafael',
  text: 'Staging is green again, all checks passed.',
  day: 'Today',
  reactions: [],
  replies: [],
};

const ACKNOWLEDGE: Record<string, string> = {
  ines: 'On it, I will look after the crit.',
  kofi: 'Seen, I will pick it up this afternoon.',
  hana: 'Thanks, adding it to the agenda.',
  rafael: 'Got it, will check and report back.',
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
};

const clock = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date());

const firstName = (id: string) => (id === ME ? 'You' : MEMBERS[id].name.split(' ')[0]);

const mentionsIn = (text: string) =>
  Array.from(text.matchAll(/@([a-z]+)/gi), (match) => match[1].toLowerCase()).filter((id) => id !== ME && MEMBERS[id]);

const renderText = (text: string) =>
  text.split(/(@[a-z]+)/gi).map((part, index) => {
    const id = part.startsWith('@') ? part.slice(1).toLowerCase() : '';
    if (!MEMBERS[id]) return part;

    return (
      <span
        key={index}
        data-slot="channel-mention"
        className={cn('rounded-sm px-0.5 font-medium text-primary', id === ME && 'bg-primary/15')}
      >
        {part}
      </span>
    );
  });

const whoReacted = (users: string[]) => {
  const names = users.map(firstName);
  if (names.length <= 1) return names.join('');

  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
};

interface ReactionPickerProps {
  label: string;
  onPick: (emoji: string) => void;
  children: React.ReactElement;
}

const ReactionPicker = ({ label, onPick, children }: ReactionPickerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={children} />
      <PopoverContent align="end" className="w-auto p-1" aria-label={label}>
        <div className="grid grid-cols-4 gap-0.5">
          {MORE_REACTIONS.map((emoji) => (
            <Button
              key={emoji}
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`React with ${emoji}`}
              onClick={() => {
                onPick(emoji);
                setOpen(false);
              }}
            >
              <span aria-hidden className="text-base">
                {emoji}
              </span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ComposerTextareaProps extends React.ComponentProps<typeof MentionInputTextarea> {
  onSend: () => void;
}

/** Enter sends unless the mention list is open, where it picks the highlighted person. */
const ComposerTextarea = ({ onSend, ...props }: ComposerTextareaProps) => {
  const { open, filteredItems } = useMentionInput();

  return (
    <MentionInputTextarea
      {...props}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
        if (open && filteredItems.length > 0) return;
        event.preventDefault();
        onSend();
      }}
    />
  );
};

interface ChannelComposerProps {
  placeholder: string;
  label: string;
  onSend: (text: string) => void;
  autoFocus?: boolean;
}

const ChannelComposer = ({ placeholder, label, onSend, autoFocus }: ChannelComposerProps) => {
  const [value, setValue] = React.useState('');
  const canSend = value.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <form
      data-slot="channel-composer"
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
      className="flex flex-col gap-1.5 border-t border-border p-3"
    >
      <div className="flex items-end gap-2">
        <MentionInput
          value={value}
          onValueChange={setValue}
          items={MENTIONS}
          placeholder={placeholder}
          maxRows={5}
          listLabel="Mention someone"
          emptyMessage="Nobody by that name in this channel."
          className="min-w-0 flex-1"
        >
          <ComposerTextarea onSend={send} aria-label={label} autoFocus={autoFocus} />
          <MentionInputList />
        </MentionInput>
        <Button type="submit" size="icon" aria-label="Send" disabled={!canSend}>
          <SendHorizontal aria-hidden className="rtl:rotate-180" />
        </Button>
      </div>
      <p className="px-0.5 text-[11px] text-muted-foreground">
        Enter to send, Shift+Enter for a new line, @ to mention
      </p>
    </form>
  );
};

type Row =
  { type: 'day'; key: string; label: string } | { type: 'message'; key: string; message: Message; continued: boolean };

const buildRows = (messages: readonly Message[]): Row[] => {
  const rows: Row[] = [];
  let previous: Message | undefined;
  for (const message of messages) {
    if (message.day !== previous?.day) {
      rows.push({ type: 'day', key: `day-${message.day}`, label: message.day });
    }
    const continued =
      previous !== undefined &&
      previous.day === message.day &&
      previous.author === message.author &&
      previous.replies.length === 0 &&
      toMinutes(message.time) - toMinutes(previous.time) <= 10;
    rows.push({ type: 'message', key: message.id, message, continued });
    previous = message;
  }

  return rows;
};

const Chat03 = () => {
  const baseId = React.useId();
  const [messages, setMessages] = React.useState(MESSAGES);
  const [pinnedId, setPinnedId] = React.useState<string | null>('m1');
  const [threadId, setThreadId] = React.useState<string | null>(null);
  const [activeRow, setActiveRow] = React.useState<string | null>(null);
  const [highlighted, setHighlighted] = React.useState<string | null>(null);
  const timersRef = React.useRef(new Set<number>());
  const counterRef = React.useRef(0);

  const schedule = React.useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
  }, []);

  React.useEffect(() => {
    const timers = timersRef.current;
    // One message from a teammate arrives while you read, so the "New messages" pill has something to announce.
    schedule(() => setMessages((current) => [...current, { ...INCOMING, time: clock() }]), 25000);

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [schedule]);

  const nextId = (prefix: string) => {
    counterRef.current += 1;

    return `${prefix}-${counterRef.current}`;
  };

  const update = (id: string, change: (message: Message) => Message) =>
    setMessages((current) => current.map((message) => (message.id === id ? change(message) : message)));

  const toggleReaction = (id: string, emoji: string, user = ME) =>
    update(id, (message) => {
      const existing = message.reactions.find((reaction) => reaction.emoji === emoji);
      if (!existing) return { ...message, reactions: [...message.reactions, { emoji, users: [user] }] };
      const users = existing.users.includes(user)
        ? existing.users.filter((item) => item !== user)
        : [...existing.users, user];

      return {
        ...message,
        reactions: message.reactions
          .map((reaction) => (reaction.emoji === emoji ? { ...reaction, users } : reaction))
          .filter((reaction) => reaction.users.length > 0),
      };
    });

  const addReaction = (id: string, emoji: string) => {
    const message = messages.find((item) => item.id === id);
    const mine = message?.reactions.find((reaction) => reaction.emoji === emoji)?.users.includes(ME);
    if (!mine) toggleReaction(id, emoji);
  };

  const acknowledge = (parentId: string, text: string) => {
    const [mentioned] = mentionsIn(text);
    if (!mentioned) return;
    schedule(() => toggleReaction(parentId, '👀', mentioned), 1500);
    schedule(
      () =>
        update(parentId, (message) => ({
          ...message,
          replies: [
            ...message.replies,
            { id: nextId('ack'), author: mentioned, text: ACKNOWLEDGE[mentioned], day: 'Today', time: clock() },
          ],
        })),
      4200,
    );
  };

  const postToChannel = (text: string) => {
    const id = nextId('post');
    setMessages((current) => [
      ...current,
      { id, author: ME, text, day: 'Today', time: clock(), reactions: [], replies: [] },
    ]);
    acknowledge(id, text);
  };

  const postReply = (parentId: string, text: string) => {
    update(parentId, (message) => ({
      ...message,
      replies: [...message.replies, { id: nextId('reply'), author: ME, text, day: 'Today', time: clock() }],
    }));
    acknowledge(parentId, text);
  };

  const jumpTo = (id: string) => {
    document
      .getElementById(`${baseId}-${id}`)
      ?.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    setHighlighted(id);
    schedule(() => setHighlighted((current) => (current === id ? null : current)), 1600);
  };

  const rows = buildRows(messages);
  const latest = messages[messages.length - 1];
  const pinned = messages.find((message) => message.id === pinnedId);
  const thread = messages.find((message) => message.id === threadId);
  const latestReply = thread?.replies[thread.replies.length - 1];

  const renderReactions = (message: Message) =>
    message.reactions.length > 0 ? (
      <ChannelReactions>
        {message.reactions.map((reaction) => {
          const reacted = reaction.users.includes(ME);

          return (
            <ChannelReaction
              key={reaction.emoji}
              emoji={reaction.emoji}
              count={reaction.users.length}
              pressed={reacted}
              onPressedChange={() => toggleReaction(message.id, reaction.emoji)}
              title={`${whoReacted(reaction.users)} reacted with ${reaction.emoji}`}
              aria-label={`${reaction.emoji} ${reaction.users.length}, ${reacted ? 'remove your reaction' : 'add your reaction'}`}
            />
          );
        })}
        <ReactionPicker label="Add reaction" onPick={(emoji) => addReaction(message.id, emoji)}>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Add reaction">
            <SmilePlus aria-hidden />
          </Button>
        </ReactionPicker>
      </ChannelReactions>
    ) : null;

  return (
    <section data-slot="chat-03" className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div
          data-slot="chat-03-frame"
          className={cn(
            ENTER,
            'relative grid h-[680px] grid-cols-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground',
            thread ? 'lg:grid-cols-[minmax(0,1fr)_360px]' : undefined,
          )}
        >
          <div data-slot="chat-03-channel" className="flex min-h-0 min-w-0 flex-col">
            <ChannelHeader>
              <Hash aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-1 flex-col">
                <h2 className="truncate text-sm font-semibold">design-review</h2>
                <p className="truncate text-xs text-muted-foreground">
                  Crits, handoffs and release checks for the web app
                </p>
              </div>
              <span className="hidden shrink-0 text-xs text-muted-foreground tabular-nums sm:inline">12 members</span>
            </ChannelHeader>

            {pinned ? (
              <ChannelPinnedBar
                key={pinned.id}
                className={SWAP}
                author={MEMBERS[pinned.author].name}
                text={pinned.text}
                onJump={() => jumpTo(pinned.id)}
                onUnpin={() => setPinnedId(null)}
              />
            ) : null}

            <ChatThread latestId={latest.id} latestFromSelf={latest.author === ME}>
              {rows.map((row) => {
                if (row.type === 'day') {
                  return <ChatDaySeparator key={row.key}>{row.label}</ChatDaySeparator>;
                }
                const { message, continued } = row;
                const author = MEMBERS[message.author];
                const lastReply = message.replies[message.replies.length - 1];
                const isPinned = message.id === pinnedId;

                return (
                  <ChannelMessage
                    key={row.key}
                    id={`${baseId}-${message.id}`}
                    continued={continued}
                    highlighted={highlighted === message.id}
                    active={activeRow === message.id || threadId === message.id}
                    onClick={() => setActiveRow(message.id)}
                    className={SWAP}
                  >
                    {continued ? (
                      <ChannelMessageGutter time={message.time} />
                    ) : (
                      <ChannelMessageGutter>
                        <Avatar>
                          <AvatarFallback>{author.initials}</AvatarFallback>
                        </Avatar>
                      </ChannelMessageGutter>
                    )}
                    <ChannelMessageBody>
                      {!continued ? <ChannelMessageAuthor name={author.name} time={message.time} /> : null}
                      <ChannelMessageText>
                        {renderText(message.text)}
                        {isPinned ? <span className="sr-only"> (pinned)</span> : null}
                      </ChannelMessageText>
                      {renderReactions(message)}
                      {lastReply ? (
                        <ChannelThreadSummary
                          count={message.replies.length}
                          lastReply={
                            lastReply.day === 'Today' ? `today at ${lastReply.time}` : lastReply.day.toLowerCase()
                          }
                          onClick={() => setThreadId(message.id)}
                        />
                      ) : null}
                    </ChannelMessageBody>
                    <ChannelMessageToolbar>
                      {QUICK_REACTIONS.map((emoji) => (
                        <Button
                          key={emoji}
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`React with ${emoji}`}
                          onClick={() => addReaction(message.id, emoji)}
                        >
                          <span aria-hidden className="text-sm">
                            {emoji}
                          </span>
                        </Button>
                      ))}
                      <ReactionPicker label="More reactions" onPick={(emoji) => addReaction(message.id, emoji)}>
                        <Button type="button" variant="ghost" size="icon-xs" aria-label="More reactions">
                          <SmilePlus aria-hidden />
                        </Button>
                      </ReactionPicker>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Reply in thread"
                        onClick={() => setThreadId(message.id)}
                      >
                        <MessageSquareText aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={isPinned ? 'Unpin message' : 'Pin message'}
                        aria-pressed={isPinned}
                        onClick={() => setPinnedId(isPinned ? null : message.id)}
                      >
                        {isPinned ? <PinOff aria-hidden /> : <Pin aria-hidden />}
                      </Button>
                    </ChannelMessageToolbar>
                  </ChannelMessage>
                );
              })}
              <ChatThreadJump />
            </ChatThread>

            <ChannelComposer
              placeholder="Message #design-review"
              label="Message #design-review"
              onSend={postToChannel}
            />
          </div>

          {thread ? (
            <ChannelThreadPanel key={thread.id} className={SWAP}>
              <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="text-sm font-semibold">Thread</h3>
                  <p className="truncate text-xs text-muted-foreground">#design-review</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close thread"
                  onClick={() => setThreadId(null)}
                  className="-me-1.5"
                >
                  <X aria-hidden />
                </Button>
              </div>

              <ChatThread
                latestId={latestReply?.id ?? thread.id}
                latestFromSelf={(latestReply?.author ?? thread.author) === ME}
              >
                <ChannelMessage>
                  <ChannelMessageGutter>
                    <Avatar>
                      <AvatarFallback>{MEMBERS[thread.author].initials}</AvatarFallback>
                    </Avatar>
                  </ChannelMessageGutter>
                  <ChannelMessageBody>
                    <ChannelMessageAuthor name={MEMBERS[thread.author].name} time={thread.time} />
                    <ChannelMessageText>{renderText(thread.text)}</ChannelMessageText>
                    {renderReactions(thread)}
                  </ChannelMessageBody>
                </ChannelMessage>
                <ChatDaySeparator>
                  <span className="tabular-nums">{thread.replies.length}</span>{' '}
                  {thread.replies.length === 1 ? 'reply' : 'replies'}
                </ChatDaySeparator>
                {thread.replies.map((reply, index) => {
                  const previous = thread.replies[index - 1];
                  const continued =
                    previous?.author === reply.author &&
                    previous.day === reply.day &&
                    toMinutes(reply.time) - toMinutes(previous.time) <= 10;

                  return (
                    <ChannelMessage key={reply.id} continued={continued} className={SWAP}>
                      {continued ? (
                        <ChannelMessageGutter time={reply.time} />
                      ) : (
                        <ChannelMessageGutter>
                          <Avatar>
                            <AvatarFallback>{MEMBERS[reply.author].initials}</AvatarFallback>
                          </Avatar>
                        </ChannelMessageGutter>
                      )}
                      <ChannelMessageBody>
                        {!continued ? (
                          <ChannelMessageAuthor
                            name={MEMBERS[reply.author].name}
                            time={reply.day === 'Today' ? reply.time : `${reply.day}, ${reply.time}`}
                          />
                        ) : null}
                        <ChannelMessageText>{renderText(reply.text)}</ChannelMessageText>
                      </ChannelMessageBody>
                    </ChannelMessage>
                  );
                })}
                <ChatThreadJump />
              </ChatThread>

              <ChannelComposer
                placeholder="Reply in thread"
                label="Reply in thread"
                onSend={(text) => postReply(thread.id, text)}
                autoFocus
              />
            </ChannelThreadPanel>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Chat03;
