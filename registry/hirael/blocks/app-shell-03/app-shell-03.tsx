"use client"

import * as React from "react"
import {
  Archive,
  Inbox,
  Search,
  Send,
  SendHorizonal,
  Settings,
  Star,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/registry/hirael/ui/badge"
import { Button } from "@/registry/hirael/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group"
import { Separator } from "@/registry/hirael/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/registry/hirael/ui/tabs"
import { Textarea } from "@/registry/hirael/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/hirael/ui/tooltip"
import { cn } from "@/lib/utils"

type Message = { from: string; initials: string; time: string; body: string }

type Conversation = {
  id: string
  sender: string
  initials: string
  email: string
  subject: string
  preview: string
  time: string
  unread?: boolean
  thread: readonly Message[]
}

const CONVERSATIONS: readonly Conversation[] = [
  {
    id: "design-review",
    sender: "Maya Renner",
    initials: "MR",
    email: "maya@plinth.dev",
    subject: "Design review · pricing page",
    preview: "Left comments on the tier cards — the middle one still",
    time: "9:41",
    unread: true,
    thread: [
      {
        from: "Maya Renner",
        initials: "MR",
        time: "Today · 9:41",
        body: "Left comments on the tier cards — the middle one still reads as selected even when it isn't. Can we tone the border down a step?",
      },
      {
        from: "Maya Renner",
        initials: "MR",
        time: "Today · 9:44",
        body: "Also flagged the annual toggle. It works, it just doesn't look like it does anything until you spot the price change.",
      },
    ],
  },
  {
    id: "invoice-april",
    sender: "Billing · Northbeam",
    initials: "NB",
    email: "billing@northbeam.io",
    subject: "Invoice #2204 is ready",
    preview: "Your April invoice for $1,188.00 is attached and due",
    time: "8:17",
    unread: true,
    thread: [
      {
        from: "Billing · Northbeam",
        initials: "NB",
        time: "Today · 8:17",
        body: "Your April invoice for $1,188.00 is attached and due on May 14. No action needed if auto-pay is enabled.",
      },
    ],
  },
  {
    id: "launch-checklist",
    sender: "Jules Tanaka",
    initials: "JT",
    email: "jules@quantfold.com",
    subject: "Launch checklist — two items left",
    preview: "Status page and the rollback runbook. Everything else",
    time: "Yesterday",
    thread: [
      {
        from: "Jules Tanaka",
        initials: "JT",
        time: "Yesterday · 17:02",
        body: "Status page and the rollback runbook. Everything else on the checklist is green — staging soak finished clean overnight.",
      },
      {
        from: "You",
        initials: "YO",
        time: "Yesterday · 17:20",
        body: "Runbook draft is in the shared folder. I'll take the status page tomorrow morning.",
      },
    ],
  },
  {
    id: "support-export",
    sender: "Adaeze Okafor",
    initials: "AO",
    email: "adaeze@stackline.co",
    subject: "Re: CSV export drops timezone",
    preview: "Confirmed on our side — exports created after the fix",
    time: "Yesterday",
    thread: [
      {
        from: "Adaeze Okafor",
        initials: "AO",
        time: "Yesterday · 14:33",
        body: "Confirmed on our side — exports created after the fix carry the offset correctly. Thanks for turning that around quickly.",
      },
    ],
  },
  {
    id: "onboarding-feedback",
    sender: "Soren Kim",
    initials: "SK",
    email: "soren@driftwork.com",
    subject: "Onboarding feedback from the pilot team",
    preview: "Three of five finished setup without docs. The two who",
    time: "Mon",
    unread: true,
    thread: [
      {
        from: "Soren Kim",
        initials: "SK",
        time: "Monday · 11:08",
        body: "Three of five finished setup without docs. The two who stalled both hit the same step: connecting the first data source.",
      },
    ],
  },
  {
    id: "offsite-dates",
    sender: "Lena Voss",
    initials: "LV",
    email: "lena@helioslab.dev",
    subject: "Offsite dates — last call",
    preview: "Locking the venue Friday. If the second week of June",
    time: "Mon",
    thread: [
      {
        from: "Lena Voss",
        initials: "LV",
        time: "Monday · 9:30",
        body: "Locking the venue Friday. If the second week of June doesn't work for anyone, speak now.",
      },
    ],
  },
  {
    id: "security-rotation",
    sender: "Security bot",
    initials: "SB",
    email: "noreply@plinth.dev",
    subject: "API key rotation completed",
    preview: "Production keys rotated on schedule. 2 services picked",
    time: "Sun",
    thread: [
      {
        from: "Security bot",
        initials: "SB",
        time: "Sunday · 03:00",
        body: "Production keys rotated on schedule. 2 services picked up the new credentials automatically; none required manual restarts.",
      },
    ],
  },
]

const RAIL: { icon: LucideIcon; label: string; current?: boolean }[] = [
  { icon: Inbox, label: "Inbox", current: true },
  { icon: Send, label: "Sent" },
  { icon: Archive, label: "Archive" },
  { icon: Trash2, label: "Trash" },
]

export default function AppShell03() {
  const [selectedId, setSelectedId] = React.useState(CONVERSATIONS[0].id)
  const [readIds, setReadIds] = React.useState<readonly string[]>([])
  const [starred, setStarred] = React.useState<readonly string[]>([
    "launch-checklist",
  ])
  const [replies, setReplies] = React.useState<Record<string, Message[]>>({})
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  const [draft, setDraft] = React.useState("")

  const isUnread = (c: Conversation) => !!c.unread && !readIds.includes(c.id)
  const unreadCount = CONVERSATIONS.filter(isUnread).length

  const normalized = query.trim().toLowerCase()
  const visible = CONVERSATIONS.filter((c) => {
    if (filter === "unread" && !isUnread(c)) return false
    if (!normalized) return true
    return (
      c.sender.toLowerCase().includes(normalized) ||
      c.subject.toLowerCase().includes(normalized)
    )
  })

  const selected =
    CONVERSATIONS.find((c) => c.id === selectedId) ?? CONVERSATIONS[0]
  const thread = [...selected.thread, ...(replies[selected.id] ?? [])]
  const isStarred = starred.includes(selected.id)

  const openConversation = (id: string) => {
    setSelectedId(id)
    setDraft("")
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const toggleStar = () =>
    setStarred((prev) =>
      prev.includes(selected.id)
        ? prev.filter((s) => s !== selected.id)
        : [...prev, selected.id]
    )

  const sendReply = () => {
    const body = draft.trim()
    if (!body) return
    setReplies((prev) => ({
      ...prev,
      [selected.id]: [
        ...(prev[selected.id] ?? []),
        { from: "You", initials: "YO", time: "Just now", body },
      ],
    }))
    setDraft("")
  }

  return (
    <div className="flex min-h-[640px] bg-background">
      <aside
        aria-label="Mailboxes"
        className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-border py-3"
      >
        <span
          role="img"
          aria-label="Hirael"
          className="mb-2 flex size-8 items-center justify-center rounded-md bg-foreground font-mono text-sm font-semibold text-background"
        >
          ◆
        </span>
        {RAIL.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={item.label}
                aria-current={item.current ? "page" : undefined}
                className={cn(
                  "relative inline-flex size-9 items-center justify-center rounded-md transition-colors",
                  item.current
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.current && unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-foreground" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
        <div className="mt-auto flex flex-col items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Settings"
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Settings className="size-4" />
              </button>
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
        className="hidden w-80 shrink-0 flex-col border-r border-border md:flex"
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
              <Search className="size-3.5" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mail…"
              aria-label="Search mail"
              className="text-sm"
            />
          </InputGroup>
          <div className="flex items-center justify-between gap-2">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as "all" | "unread")}
              className="w-fit"
            >
              <TabsList className="h-7">
                <TabsTrigger
                  value="all"
                  className="px-2 font-mono text-[10px] uppercase tracking-[0.08em]"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="px-2 font-mono text-[10px] uppercase tracking-[0.08em]"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
              {visible.length} of {CONVERSATIONS.length}
            </span>
          </div>
        </div>
        <Separator />
        <ul className="flex-1 overflow-y-auto">
          {visible.map((c) => {
            const active = c.id === selected.id
            const unread = isUnread(c)
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => openConversation(c.id)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex w-full flex-col gap-0.5 border-b border-border px-4 py-3 text-left transition-colors",
                    active ? "bg-accent/70" : "hover:bg-accent/40"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {unread && (
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full bg-foreground"
                      />
                    )}
                    <span
                      className={cn(
                        "truncate text-sm",
                        unread ? "font-semibold" : "font-medium"
                      )}
                    >
                      {c.sender}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
                      {c.time}
                    </span>
                  </span>
                  <span className="truncate text-xs text-foreground">
                    {c.subject}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {c.preview}…
                  </span>
                </button>
              </li>
            )
          })}
          {visible.length === 0 && (
            <li className="px-4 py-10 text-center text-xs text-muted-foreground">
              No conversations match &ldquo;{query.trim()}&rdquo;
            </li>
          )}
        </ul>
      </section>

      <section aria-label="Conversation" className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
          <h2 className="truncate text-sm font-medium tracking-[-0.01em]">
            {selected.subject}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={toggleStar}
              aria-pressed={isStarred}
              aria-label={isStarred ? "Unstar conversation" : "Star conversation"}
            >
              <Star
                className={cn("size-4", isStarred && "fill-current")}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Archive conversation"
            >
              <Archive className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Delete conversation"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium">
            {selected.initials}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{selected.sender}</span>
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {selected.email} · to you
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
          {thread.map((m, i) => (
            <div
              key={`${m.from}-${i}`}
              className={cn(
                "flex max-w-xl flex-col gap-2 rounded-md border border-border p-4",
                m.from === "You" ? "self-end bg-accent/50" : "bg-card/40"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium">
                  {m.initials}
                </span>
                <span className="text-xs font-medium">{m.from}</span>
                <span className="ml-auto font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
                  {m.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{m.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border p-4 sm:px-6">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendReply()
              }
            }}
            placeholder={`Reply to ${selected.sender}…`}
            aria-label={`Reply to ${selected.sender}`}
            className="min-h-20 resize-none"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Enter to send · shift+enter for a new line
            </span>
            <Button size="sm" onClick={sendReply} disabled={!draft.trim()}>
              Send
              <SendHorizonal className="size-3.5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
