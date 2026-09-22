'use client';

import * as React from 'react';
import { BellRing, CornerDownLeft, UserRoundCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const FEATURES = [
  {
    value: 'assign',
    title: 'One owner per conversation',
    summary: 'Hand a thread to a teammate and the whole inbox can see who has it.',
    label: 'Open conversations',
  },
  {
    value: 'replies',
    title: 'Reuse the answer that worked',
    summary: 'Saved replies arrive as a draft you can edit, not as canned text.',
    label: 'Saved replies',
  },
  {
    value: 'snooze',
    title: 'Clear what can wait',
    summary: 'Snoozed threads leave the list and come back at the top when they are due.',
    label: 'Snooze until',
  },
] as const;

const CONVERSATIONS = [
  { subject: 'Refund for a duplicate charge', from: 'Nadia Rahman', owner: 'AM', state: 'Replying', live: true },
  { subject: 'SSO setup for 40 seats', from: 'Tomas Lang', owner: 'JP', state: 'Waiting', live: false },
  { subject: 'Export times out on large reports', from: 'Grace Okafor', owner: 'RK', state: 'Open', live: false },
  { subject: 'Invoice address change', from: 'Leo Marchetti', owner: 'AM', state: 'Open', live: false },
];

const AssignPanel = () => {
  return (
    <div className="flex flex-1 flex-col">
      <ul className="flex flex-col">
        {CONVERSATIONS.map((conversation, index) => (
          <li
            key={conversation.subject}
            style={stagger(index)}
            className={cn(
              SWAP,
              'flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted/50',
              index === 0 && 'bg-muted/40',
            )}
          >
            <Avatar className="size-8 shrink-0">
              <AvatarFallback>{conversation.owner}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{conversation.subject}</p>
              <p className="truncate text-xs text-muted-foreground">{conversation.from}</p>
            </div>
            <span
              className={cn(
                'hidden shrink-0 text-xs sm:inline',
                conversation.live ? 'text-accent-cool' : 'text-muted-foreground',
              )}
            >
              {conversation.state}
            </span>
          </li>
        ))}
      </ul>
      <p
        style={stagger(CONVERSATIONS.length)}
        className={cn(SWAP, 'mt-auto flex items-center gap-2 px-3 pt-5 text-xs text-muted-foreground')}
      >
        <UserRoundCheck aria-hidden className="size-3.5 shrink-0" />
        Four open, every one of them owned.
      </p>
    </div>
  );
};

const REPLIES = [
  { shortcut: '/refund', title: 'Refund approved' },
  { shortcut: '/sso', title: 'SSO checklist' },
  { shortcut: '/export', title: 'Export is still running' },
];

const RepliesPanel = () => {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <ul className="flex flex-col">
        {REPLIES.map((reply, index) => (
          <li
            key={reply.shortcut}
            style={stagger(index)}
            className={cn(
              SWAP,
              'flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted/50',
              index === 0 && 'bg-muted/40',
            )}
          >
            <span className="w-16 shrink-0 text-xs text-muted-foreground">{reply.shortcut}</span>
            <span className="flex-1 truncate text-sm font-medium">{reply.title}</span>
            {index === 0 && (
              <span className="flex shrink-0 items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <CornerDownLeft aria-hidden className="size-3 rtl:rotate-180" />
                Insert
              </span>
            )}
          </li>
        ))}
      </ul>
      <div
        style={stagger(REPLIES.length)}
        className={cn(SWAP, 'mt-auto rounded-md border border-border bg-background/60 p-4')}
      >
        <p className="text-xs uppercase text-muted-foreground">Draft to Nadia</p>
        <p className="mt-2 text-sm leading-relaxed">
          Hi Nadia, the duplicate charge of $49.00 is on its way back to the card ending 4412. Most banks show it within
          five working days
          <span aria-hidden className="ms-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-foreground" />
        </p>
      </div>
    </div>
  );
};

const SNOOZE_OPTIONS = [
  { label: 'Later today', when: '17:00', chosen: false },
  { label: 'Tomorrow morning', when: 'Tue, 09:00', chosen: true },
  { label: 'Next week', when: 'Mon, 09:00', chosen: false },
];

const SnoozePanel = () => {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <ul className="flex flex-col">
        {SNOOZE_OPTIONS.map((option, index) => (
          <li
            key={option.label}
            style={stagger(index)}
            className={cn(
              SWAP,
              'flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted/50',
              option.chosen && 'bg-muted/40',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'grid size-4 shrink-0 place-items-center rounded-full border',
                option.chosen ? 'border-warm' : 'border-border',
              )}
            >
              {option.chosen && <span className="size-2 rounded-full bg-warm" />}
            </span>
            <span className={cn('flex-1 text-sm', option.chosen ? 'font-medium' : 'text-muted-foreground')}>
              {option.label}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{option.when}</span>
          </li>
        ))}
      </ul>
      <p
        style={stagger(SNOOZE_OPTIONS.length)}
        className={cn(SWAP, 'mt-auto flex gap-2 px-3 text-xs leading-relaxed text-muted-foreground')}
      >
        <BellRing aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        Back at the top of the inbox on Tuesday at 09:00, still assigned to whoever owns it.
      </p>
    </div>
  );
};

const PANELS: Record<(typeof FEATURES)[number]['value'], React.ComponentType> = {
  assign: AssignPanel,
  replies: RepliesPanel,
  snooze: SnoozePanel,
};

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const Feature11 = () => {
  return (
    <section data-slot="feature" className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:gap-16 md:px-10">
        <div data-slot="feature-header" className="flex max-w-xl flex-col gap-4">
          <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Shared inbox</span>
          <h2
            style={stagger(1, 80)}
            className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
          >
            Keep the queue moving
          </h2>
          <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
            A shared inbox has three jobs: show who owns a conversation, make a good answer easy to send again, and take
            everything that can wait off the screen.
          </p>
        </div>

        <Tabs
          defaultValue={FEATURES[0].value}
          orientation="vertical"
          className="flex-col lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-stretch"
        >
          <TabsList variant="line" className="w-full">
            {FEATURES.map((feature, index) => (
              <TabsTrigger
                key={feature.value}
                value={feature.value}
                style={stagger(index, 80, 240)}
                className={cn(
                  ENTER,
                  'group/trigger h-auto w-full items-start whitespace-normal text-start after:hidden',
                )}
              >
                <span aria-hidden className="absolute inset-y-0 start-0 w-px bg-border" />
                <span
                  aria-hidden
                  className="absolute inset-y-0 start-0 w-0.5 origin-top scale-y-0 bg-foreground transition-transform duration-300 ease-out group-data-active/trigger:scale-y-100 motion-reduce:transition-none"
                />
                <span className="flex min-w-0 flex-1 items-start gap-4 px-3 py-3">
                  <span className="pt-px text-xs tabular-nums text-muted-foreground transition-colors group-data-active/trigger:text-warm">
                    {formatIndex(index)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-medium">{feature.title}</span>
                    <span className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-data-active/trigger:grid-rows-[1fr] group-data-active/trigger:opacity-100 motion-reduce:transition-none">
                      <span className="overflow-hidden">
                        <span className="block pt-1.5 text-sm font-normal leading-relaxed text-muted-foreground">
                          {feature.summary}
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            data-slot="feature-preview"
            style={stagger(0, 0, 400)}
            className={cn(
              ENTER,
              'relative mt-6 flex min-h-80 flex-col overflow-hidden rounded-xl lg:ms-12 lg:mt-0 border border-border bg-card/40 shadow-sm lg:min-h-96',
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-warm/40 to-transparent"
            />
            {FEATURES.map((feature, index) => {
              const Panel = PANELS[feature.value];
              return (
                <TabsContent key={feature.value} value={feature.value} className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <span className={cn(SWAP, 'text-xs uppercase text-muted-foreground')}>{feature.label}</span>
                    <span dir="ltr" className="text-xs tabular-nums text-muted-foreground">
                      {formatIndex(index)}
                      <span className="mx-1.5 text-border">|</span>
                      {formatIndex(FEATURES.length - 1)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <Panel />
                  </div>
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Feature11;
