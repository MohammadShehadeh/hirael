'use client';

import * as React from 'react';
import {
  Archive,
  ChevronLeft,
  Inbox,
  Search,
  Send,
  SendHorizonal,
  Settings,
  Star,
  Trash2,
  Undo2,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/hirael/bases/radix/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/radix/ui/input-group';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/radix/ui/tabs';
import { Textarea } from '@/registry/hirael/bases/radix/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/hirael/bases/radix/ui/tooltip';

interface Message {
  id: string;
  from: string;
  initials: string;
  time: string;
  body: string;
}

interface Conversation {
  id: string;
  sender: string;
  initials: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
  thread: readonly Message[];
}

const CONVERSATIONS: readonly Conversation[] = [
  {
    id: 'design-review',
    sender: 'Maya Renner',
    initials: 'MR',
    email: 'maya@plinth.dev',
    subject: 'Design review · pricing page',
    preview: 'Left comments on the tier cards, the middle one still',
    time: '9:41',
    unread: true,
    thread: [
      {
        id: 'design-review-1',
        from: 'Maya Renner',
        initials: 'MR',
        time: 'Today · 9:41',
        body: "Left comments on the tier cards. The middle one still reads as selected even when it isn't. Can we tone the border down a step?",
      },
      {
        id: 'design-review-2',
        from: 'Maya Renner',
        initials: 'MR',
        time: 'Today · 9:44',
        body: "Also flagged the annual toggle. It works, it just doesn't look like it does anything until you spot the price change.",
      },
    ],
  },
  {
    id: 'invoice-april',
    sender: 'Billing · Northbeam',
    initials: 'NB',
    email: 'billing@northbeam.io',
    subject: 'Invoice #2204 is ready',
    preview: 'Your April invoice for $1,188.00 is attached and due',
    time: '8:17',
    unread: true,
    thread: [
      {
        id: 'invoice-april-1',
        from: 'Billing · Northbeam',
        initials: 'NB',
        time: 'Today · 8:17',
        body: 'Your April invoice for $1,188.00 is attached and due on May 14. No action needed if auto-pay is enabled.',
      },
    ],
  },
  {
    id: 'launch-checklist',
    sender: 'Jules Tanaka',
    initials: 'JT',
    email: 'jules@quantfold.com',
    subject: 'Launch checklist: two items left',
    preview: 'Status page and the rollback runbook. Everything else',
    time: 'Yesterday',
    thread: [
      {
        id: 'launch-checklist-1',
        from: 'Jules Tanaka',
        initials: 'JT',
        time: 'Yesterday · 17:02',
        body: 'Status page and the rollback runbook. Everything else on the checklist is green; staging soak finished clean overnight.',
      },
      {
        id: 'launch-checklist-2',
        from: 'You',
        initials: 'YO',
        time: 'Yesterday · 17:20',
        body: "Runbook draft is in the shared folder. I'll take the status page tomorrow morning.",
      },
    ],
  },
  {
    id: 'support-export',
    sender: 'Adaeze Okafor',
    initials: 'AO',
    email: 'adaeze@stackline.co',
    subject: 'Re: CSV export drops timezone',
    preview: 'Confirmed on our side; exports created after the fix',
    time: 'Yesterday',
    thread: [
      {
        id: 'support-export-1',
        from: 'Adaeze Okafor',
        initials: 'AO',
        time: 'Yesterday · 14:33',
        body: 'Confirmed on our side; exports created after the fix carry the offset correctly. Thanks for turning that around quickly.',
      },
    ],
  },
  {
    id: 'onboarding-feedback',
    sender: 'Soren Kim',
    initials: 'SK',
    email: 'soren@driftwork.com',
    subject: 'Onboarding feedback from the pilot team',
    preview: 'Three of five finished setup without docs. The two who',
    time: 'Mon',
    unread: true,
    thread: [
      {
        id: 'onboarding-feedback-1',
        from: 'Soren Kim',
        initials: 'SK',
        time: 'Monday · 11:08',
        body: 'Three of five finished setup without docs. The two who stalled both hit the same step: connecting the first data source.',
      },
    ],
  },
  {
    id: 'offsite-dates',
    sender: 'Lena Voss',
    initials: 'LV',
    email: 'lena@helioslab.dev',
    subject: 'Offsite dates: last call',
    preview: 'Locking the venue Friday. If the second week of June',
    time: 'Mon',
    thread: [
      {
        id: 'offsite-dates-1',
        from: 'Lena Voss',
        initials: 'LV',
        time: 'Monday · 9:30',
        body: "Locking the venue Friday. If the second week of June doesn't work for anyone, speak now.",
      },
    ],
  },
  {
    id: 'security-rotation',
    sender: 'Security bot',
    initials: 'SB',
    email: 'noreply@plinth.dev',
    subject: 'API key rotation completed',
    preview: 'Production keys rotated on schedule. 2 services picked',
    time: 'Sun',
    thread: [
      {
        id: 'security-rotation-1',
        from: 'Security bot',
        initials: 'SB',
        time: 'Sunday · 03:00',
        body: 'Production keys rotated on schedule. 2 services picked up the new credentials automatically; none required manual restarts.',
      },
    ],
  },
];

const RAIL: { icon: LucideIcon; label: string; current?: boolean }[] = [
  { icon: Inbox, label: 'Inbox', current: true },
  { icon: Send, label: 'Sent' },
  { icon: Archive, label: 'Archive' },
  { icon: Trash2, label: 'Trash' },
];

interface Removal {
  id: string;
  kind: 'archived' | 'deleted';
}

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  );
};

const AppShell03 = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(CONVERSATIONS[0].id);
  const [readIds, setReadIds] = React.useState<readonly string[]>([]);
  const [starred, setStarred] = React.useState<readonly string[]>(['launch-checklist']);
  const [removedIds, setRemovedIds] = React.useState<readonly string[]>([]);
  const [lastRemoval, setLastRemoval] = React.useState<Removal | null>(null);
  const [replies, setReplies] = React.useState<Record<string, Message[]>>({});
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');
  const [draft, setDraft] = React.useState('');
  // On phones the list and the reading pane share the viewport, so only one
  // of them is on screen at a time.
  const [mobilePane, setMobilePane] = React.useState<'list' | 'thread'>('list');

  const optionRefs = React.useRef(new Map<string, HTMLLIElement>());

  const isUnread = React.useCallback((c: Conversation) => !!c.unread && !readIds.includes(c.id), [readIds]);

  const inbox = React.useMemo(() => CONVERSATIONS.filter((c) => !removedIds.includes(c.id)), [removedIds]);

  const unreadCount = inbox.filter(isUnread).length;

  const visible = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return inbox.filter((c) => {
      if (filter === 'unread' && !isUnread(c)) return false;
      if (!normalized) return true;
      return c.sender.toLowerCase().includes(normalized) || c.subject.toLowerCase().includes(normalized);
    });
  }, [inbox, filter, query, isUnread]);

  const selected = inbox.find((c) => c.id === selectedId) ?? null;
  const thread = selected ? [...selected.thread, ...(replies[selected.id] ?? [])] : [];
  const isStarred = selected ? starred.includes(selected.id) : false;

  const openConversation = React.useCallback((id: string) => {
    setSelectedId(id);
    setDraft('');
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  /** Arrow keys walk the list the way every mail client does. */
  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key) || visible.length === 0) return;
    event.preventDefault();

    const current = visible.findIndex((c) => c.id === selectedId);
    const last = visible.length - 1;
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? last
          : event.key === 'ArrowDown'
            ? Math.min(last, current < 0 ? 0 : current + 1)
            : Math.max(0, current < 0 ? 0 : current - 1);

    const target = visible[next];
    openConversation(target.id);
    optionRefs.current.get(target.id)?.focus();
  };

  const toggleStar = () => {
    if (!selected) return;
    setStarred((prev) => (prev.includes(selected.id) ? prev.filter((s) => s !== selected.id) : [...prev, selected.id]));
  };

  /** Removing selects the neighbour below, then above, so focus never dies. */
  const remove = (kind: Removal['kind']) => {
    if (!selected) return;
    const index = visible.findIndex((c) => c.id === selected.id);
    const neighbour = visible[index + 1] ?? visible[index - 1] ?? null;

    setRemovedIds((prev) => [...prev, selected.id]);
    setLastRemoval({ id: selected.id, kind });
    setSelectedId(neighbour?.id ?? null);
    setDraft('');
    if (!neighbour) setMobilePane('list');
  };

  const undoRemoval = () => {
    if (!lastRemoval) return;
    setRemovedIds((prev) => prev.filter((id) => id !== lastRemoval.id));
    setSelectedId(lastRemoval.id);
    setLastRemoval(null);
  };

  const sendReply = () => {
    const body = draft.trim();
    if (!body || !selected) return;
    const existing = replies[selected.id] ?? [];
    setReplies((prev) => ({
      ...prev,
      [selected.id]: [
        ...existing,
        {
          id: `${selected.id}-reply-${existing.length + 1}`,
          from: 'You',
          initials: 'YO',
          time: 'Just now',
          body,
        },
      ],
    }));
    setDraft('');
  };

  return (
    <div className="flex min-h-[640px] bg-background">
      <aside
        aria-label="Mailboxes"
        className="flex w-14 shrink-0 flex-col items-center gap-1 border-e border-border py-3"
      >
        <span
          role="img"
          aria-label="Hirael"
          className="mb-2 flex size-8 items-center justify-center rounded-md bg-foreground text-background"
        >
          <BrandMark className="size-5" />
        </span>
        {RAIL.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={item.current && unreadCount > 0 ? `${item.label} · ${unreadCount} unread` : item.label}
                aria-current={item.current ? 'page' : undefined}
                className={cn('relative', item.current ? 'bg-accent text-foreground' : 'text-muted-foreground')}
              >
                <item.icon className="size-4" aria-hidden />
                {item.current && unreadCount > 0 && (
                  <span aria-hidden className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
        <div className="mt-auto flex flex-col items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Settings" className="text-muted-foreground">
                <Settings className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
          <span className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card font-mono text-[11px] font-medium">
            MS
          </span>
        </div>
      </aside>

      <section
        aria-label="Conversations"
        className={cn(
          // Full width next to the rail on phones, a fixed column from md up.
          'min-w-0 flex-1 flex-col border-e border-border md:flex md:w-80 md:flex-none',
          mobilePane === 'thread' ? 'hidden' : 'flex',
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-4">
          <h2 className="text-sm font-medium tracking-[-0.01em]">Inbox</h2>
          <Badge variant="outline" className="font-mono text-[10px] tabular-nums">
            {unreadCount} unread
          </Badge>
        </div>
        <div className="flex flex-col gap-2.5 px-4 pb-3">
          <InputGroup className="h-8">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && query) {
                  e.preventDefault();
                  setQuery('');
                }
              }}
              placeholder="Search mail…"
              aria-label="Search mail"
              className="text-sm"
            />
          </InputGroup>
          <div className="flex items-center justify-between gap-2">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="w-fit">
              <TabsList className="h-7">
                <TabsTrigger value="all" className="px-2 font-mono text-[10px] uppercase tracking-[0.08em]">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="px-2 font-mono text-[10px] uppercase tracking-[0.08em]">
                  Unread
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <span
              dir="ltr"
              aria-live="polite"
              className="font-mono text-[10px] uppercase tracking-[0.08em] tabular-nums text-muted-foreground"
            >
              {visible.length} of {inbox.length}
            </span>
          </div>
        </div>
        <Separator />

        {lastRemoval && (
          <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2">
            <span className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              conversation {lastRemoval.kind}
            </span>
            <Button variant="ghost" size="sm" className="h-6 shrink-0 px-2" onClick={undoRemoval}>
              <Undo2 className="size-3 rtl:rotate-180" aria-hidden />
              Undo
            </Button>
          </div>
        )}

        {visible.length === 0 ? (
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Inbox />
              </EmptyMedia>
              <EmptyTitle>{query.trim() ? 'No conversations match' : 'Inbox zero'}</EmptyTitle>
              <EmptyDescription>
                {query.trim()
                  ? `Nothing matches “${query.trim()}”.`
                  : filter === 'unread'
                    ? 'Everything here has been read.'
                    : 'Nothing left in this view.'}
              </EmptyDescription>
            </EmptyHeader>
            {query.trim() && (
              <EmptyContent>
                <Button variant="outline" size="sm" onClick={() => setQuery('')}>
                  Clear search
                </Button>
              </EmptyContent>
            )}
          </Empty>
        ) : (
          <ul
            role="listbox"
            aria-label="Conversations"
            aria-orientation="vertical"
            onKeyDown={onListKeyDown}
            className="flex-1 overflow-y-auto"
          >
            {visible.map((c) => {
              const active = c.id === selectedId;
              const unread = isUnread(c);
              return (
                <li
                  key={c.id}
                  ref={(node) => {
                    if (node) optionRefs.current.set(c.id, node);
                    else optionRefs.current.delete(c.id);
                  }}
                  role="option"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => {
                    openConversation(c.id);
                    setMobilePane('thread');
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    openConversation(c.id);
                    setMobilePane('thread');
                  }}
                  className={cn(
                    'flex cursor-pointer flex-col gap-0.5 border-b border-border px-4 py-3 text-start transition-colors outline-none',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                    active ? 'bg-accent/70' : 'hover:bg-accent/40',
                  )}
                >
                  <span className="flex items-center gap-2">
                    {unread && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-foreground" />}
                    <span className={cn('truncate text-sm', unread ? 'font-semibold' : 'font-medium')}>
                      {c.sender}
                      {unread && <span className="sr-only"> (unread)</span>}
                    </span>
                    <span className="ms-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] tabular-nums text-muted-foreground">
                      {c.time}
                    </span>
                  </span>
                  <span className="truncate text-xs text-foreground">{c.subject}</span>
                  <span className="truncate text-xs text-muted-foreground">{c.preview}…</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section
        aria-label="Conversation"
        className={cn('min-w-0 flex-1 flex-col md:flex', mobilePane === 'list' ? 'hidden' : 'flex')}
      >
        {selected ? (
          <>
            <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 md:hidden"
                  onClick={() => setMobilePane('list')}
                  aria-label="Back to conversations"
                >
                  <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
                </Button>
                <h2 className="truncate text-sm font-medium tracking-[-0.01em]">{selected.subject}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={toggleStar}
                  aria-pressed={isStarred}
                  aria-label={isStarred ? 'Unstar conversation' : 'Star conversation'}
                >
                  <Star className={cn('size-4', isStarred && 'fill-current')} aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => remove('archived')}
                  aria-label="Archive conversation"
                >
                  <Archive className="size-4" aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => remove('deleted')}
                  aria-label="Delete conversation"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
              <span
                aria-hidden
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium"
              >
                {selected.initials}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{selected.sender}</span>
                <span className="truncate font-mono text-[11px] text-muted-foreground">{selected.email} · to you</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
              {thread.map((m) => (
                <article
                  key={m.id}
                  className={cn(
                    'flex max-w-xl flex-col gap-2 rounded-md border border-border p-4',
                    m.from === 'You' ? 'self-end bg-accent/50' : 'bg-card/40',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-flex size-6 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium"
                    >
                      {m.initials}
                    </span>
                    <span className="text-xs font-medium">{m.from}</span>
                    <span className="ms-auto font-mono text-[10px] uppercase tracking-[0.08em] tabular-nums text-muted-foreground">
                      {m.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.body}</p>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-2 border-t border-border p-4 sm:px-6">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  // Enter writes a new line in a mail composer; ⌘/Ctrl sends.
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                placeholder={`Reply to ${selected.sender}…`}
                aria-label={`Reply to ${selected.sender}`}
                aria-keyshortcuts="Meta+Enter Control+Enter"
                className="min-h-20 resize-none"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  ⌘ + enter to send
                </span>
                <Button size="sm" onClick={sendReply} disabled={!draft.trim()}>
                  Send
                  <SendHorizonal className="size-3.5 rtl:rotate-180" aria-hidden />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Empty className="flex-1 border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Inbox />
              </EmptyMedia>
              <EmptyTitle>Nothing selected</EmptyTitle>
              <EmptyDescription>Pick a conversation from the list to read it here.</EmptyDescription>
            </EmptyHeader>
            {lastRemoval && (
              <EmptyContent>
                <Button variant="outline" size="sm" onClick={undoRemoval}>
                  <Undo2 className="size-3.5 rtl:rotate-180" aria-hidden />
                  Undo {lastRemoval.kind === 'archived' ? 'archive' : 'delete'}
                </Button>
              </EmptyContent>
            )}
          </Empty>
        )}
      </section>
    </div>
  );
};

export default AppShell03;
