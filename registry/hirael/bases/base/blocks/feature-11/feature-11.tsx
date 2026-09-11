'use client';

import * as React from 'react';
import { Clock, Reply, UserRoundCheck } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

const FEATURES = [
  {
    value: 'assign',
    icon: UserRoundCheck,
    title: 'One owner per conversation',
    summary: 'Hand a thread to a teammate and the whole inbox can see who has it.',
  },
  {
    value: 'replies',
    icon: Reply,
    title: 'Reuse the answer that worked',
    summary: 'Saved replies arrive as a draft you can edit, not as canned text.',
  },
  {
    value: 'snooze',
    icon: Clock,
    title: 'Clear what can wait',
    summary: 'Snoozed threads leave the list and come back at the top when they are due.',
  },
] as const;

const CONVERSATIONS = [
  { subject: 'Refund for a duplicate charge', from: 'Nadia Rahman', owner: 'AM', state: 'Replying' },
  { subject: 'SSO setup for 40 seats', from: 'Tomas Lang', owner: 'JP', state: 'Waiting on customer' },
  { subject: 'Export times out on large reports', from: 'Grace Okafor', owner: 'RK', state: 'Open' },
];

const AssignPanel = () => {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {CONVERSATIONS.map((conversation) => (
        <li key={conversation.subject} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="text-[11px] font-medium">{conversation.owner}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{conversation.subject}</p>
            <p className="truncate text-xs text-muted-foreground">{conversation.from}</p>
          </div>
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{conversation.state}</span>
        </li>
      ))}
    </ul>
  );
};

const REPLIES = [
  {
    shortcut: '/refund',
    title: 'Refund approved',
    body: 'Confirms the amount, the card it returns to, and how long the bank usually takes.',
  },
  {
    shortcut: '/sso',
    title: 'SSO checklist',
    body: 'The four values you need from an identity provider, in the order the setup screen asks for them.',
  },
  {
    shortcut: '/export',
    title: 'Export is still running',
    body: 'Explains why a large report takes longer and promises a link when the file is ready.',
  },
];

const RepliesPanel = () => {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {REPLIES.map((reply) => (
        <li key={reply.shortcut} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
          <div className="flex items-baseline gap-2">
            <code className="font-mono text-xs text-muted-foreground">{reply.shortcut}</code>
            <span className="text-sm font-medium">{reply.title}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{reply.body}</p>
        </li>
      ))}
    </ul>
  );
};

const SNOOZE_OPTIONS = [
  { label: 'Later today', when: '17:00', chosen: false },
  { label: 'Tomorrow morning', when: 'Tue, 09:00', chosen: true },
  { label: 'Next week', when: 'Mon, 09:00', chosen: false },
];

const SnoozePanel = () => {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y divide-border">
        {SNOOZE_OPTIONS.map((option) => (
          <li key={option.label} className="flex items-center gap-3 py-3 first:pt-0">
            <span
              aria-hidden
              className={
                option.chosen
                  ? 'size-2.5 shrink-0 rounded-full bg-warm'
                  : 'size-2.5 shrink-0 rounded-full border border-border'
              }
            />
            <span className={option.chosen ? 'flex-1 text-sm font-medium' : 'flex-1 text-sm text-muted-foreground'}>
              {option.label}
            </span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{option.when}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Tomorrow morning puts this thread back at the top of the inbox at 09:00, still assigned to whoever owns it.
      </p>
    </div>
  );
};

const PANELS: Record<(typeof FEATURES)[number]['value'], React.ComponentType> = {
  assign: AssignPanel,
  replies: RepliesPanel,
  snooze: SnoozePanel,
};

const Feature11 = () => {
  return (
    <section data-slot="feature" className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:gap-14 md:px-10">
        <div data-slot="feature-header" className="flex max-w-xl flex-col gap-4">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Keep the queue moving</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            A shared inbox has three jobs: show who owns a conversation, make a good answer easy to send again, and take
            everything that can wait off the screen.
          </p>
        </div>

        <Tabs
          defaultValue={FEATURES[0].value}
          orientation="vertical"
          className="flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-12"
        >
          <TabsList variant="line" className="w-full gap-1">
            {FEATURES.map((feature) => (
              <TabsTrigger
                key={feature.value}
                value={feature.value}
                className="h-auto w-full flex-col items-start gap-1.5 whitespace-normal px-4 py-3 text-start group-data-[orientation=vertical]/tabs:after:-start-1 group-data-[orientation=vertical]/tabs:after:end-auto"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <feature.icon aria-hidden />
                  {feature.title}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">{feature.summary}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {FEATURES.map((feature) => {
            const Panel = PANELS[feature.value];
            return (
              <TabsContent
                key={feature.value}
                value={feature.value}
                className="min-h-60 rounded-md border border-border bg-card/40 p-5 sm:p-6"
              >
                <Panel />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default Feature11;
