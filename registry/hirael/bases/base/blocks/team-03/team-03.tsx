'use client';

import * as React from 'react';
import { CalendarPlus, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/hirael/bases/base/ui/avatar';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/hirael/bases/base/ui/tooltip';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'support', label: 'Support' },
] as const;

type Department = (typeof DEPARTMENTS)[number]['value'];
type Filter = Department | 'all';
type Sort = 'time' | 'name';

interface Member {
  name: string;
  role: string;
  department: Department;
  city: string;
  timeZone: string;
  email: string;
  avatar?: string;
}

// Placeholder photos served from hirael.com. Swap them for your own assets, or
// add the host to `images.remotePatterns` in next.config to keep them.
const MEMBERS: readonly Member[] = [
  {
    name: 'Inês Carvalho',
    role: 'Staff engineer',
    department: 'engineering',
    city: 'Lisbon',
    timeZone: 'Europe/Lisbon',
    email: 'ines@example.com',
    avatar: '/media/blocks/team-03/avatar-2.jpg',
  },
  {
    name: 'Daniel Okoth',
    role: 'Backend engineer',
    department: 'engineering',
    city: 'Nairobi',
    timeZone: 'Africa/Nairobi',
    email: 'daniel@example.com',
  },
  {
    name: 'Priya Raman',
    role: 'Platform engineer',
    department: 'engineering',
    city: 'Singapore',
    timeZone: 'Asia/Singapore',
    email: 'priya@example.com',
  },
  {
    name: 'Jonas Weber',
    role: 'Frontend engineer',
    department: 'engineering',
    city: 'Berlin',
    timeZone: 'Europe/Berlin',
    email: 'jonas@example.com',
    avatar: '/media/blocks/team-03/avatar-1.jpg',
  },
  {
    name: 'Omar Haddad',
    role: 'Design lead',
    department: 'design',
    city: 'Dubai',
    timeZone: 'Asia/Dubai',
    email: 'omar@example.com',
    avatar: '/media/blocks/team-03/avatar-3.jpg',
  },
  {
    name: 'Maya Chen',
    role: 'Product designer',
    department: 'design',
    city: 'Toronto',
    timeZone: 'America/Toronto',
    email: 'maya@example.com',
  },
  {
    name: 'Lena Fischer',
    role: 'Brand designer',
    department: 'design',
    city: 'Berlin',
    timeZone: 'Europe/Berlin',
    email: 'lena@example.com',
  },
  {
    name: 'Hannah Kelly',
    role: 'Support lead',
    department: 'support',
    city: 'Toronto',
    timeZone: 'America/Toronto',
    email: 'hannah@example.com',
    avatar: '/media/blocks/team-03/avatar-4.jpg',
  },
  {
    name: 'Amara Njeri',
    role: 'Support specialist',
    department: 'support',
    city: 'Nairobi',
    timeZone: 'Africa/Nairobi',
    email: 'amara@example.com',
  },
  {
    name: 'Wei Ling Tan',
    role: 'Support specialist',
    department: 'support',
    city: 'Singapore',
    timeZone: 'Asia/Singapore',
    email: 'weiling@example.com',
  },
];

const WORK_START = 9;
const WORK_END = 18;
const MINUTE = 60_000;

// A fixed instant keeps the server render and first client render ordered the same.
const REFERENCE_TIME = Date.UTC(2026, 0, 15, 12, 0);

const subscribeToMinutes = (onTick: () => void) => {
  let interval: ReturnType<typeof setInterval> | undefined;
  const timeout = setTimeout(
    () => {
      onTick();
      interval = setInterval(onTick, MINUTE);
    },
    MINUTE - (Date.now() % MINUTE),
  );
  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
};

const getCurrentMinute = () => Math.floor(Date.now() / MINUTE) * MINUTE;

const getServerMinute = () => null;

const readLocalTime = (timeZone: string, time: number) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
    timeZoneName: 'shortOffset',
  }).formatToParts(time);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  const offsetLabel = part('timeZoneName');
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(offsetLabel);
  const offsetMinutes = match ? (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] ?? 0)) : 0;
  const hour = Number(part('hour'));
  const weekday = part('weekday');
  return {
    clock: `${part('hour')}:${part('minute')}`,
    offsetLabel,
    offsetMinutes,
    weekend: weekday === 'Sat' || weekday === 'Sun',
    working: hour >= WORK_START && hour < WORK_END,
    beforeStart: hour < WORK_START,
    weekday,
  };
};

const statusFor = (local: ReturnType<typeof readLocalTime>) => {
  if (local.weekend) return { online: false, label: 'Offline, back Mon 09:00' };
  if (local.working) return { online: true, label: 'Online now' };
  if (!local.beforeStart && local.weekday === 'Fri') return { online: false, label: 'Offline, back Mon 09:00' };
  return { online: false, label: 'Offline, back 09:00' };
};

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const Team03 = () => {
  const [filter, setFilter] = React.useState<Filter>('all');
  const [sort, setSort] = React.useState<Sort>('time');
  const now = React.useSyncExternalStore(subscribeToMinutes, getCurrentMinute, getServerMinute);

  const sortTime = now ?? REFERENCE_TIME;
  const sorted = [...MEMBERS].sort((a, b) =>
    sort === 'name'
      ? a.name.localeCompare(b.name)
      : readLocalTime(a.timeZone, sortTime).offsetMinutes - readLocalTime(b.timeZone, sortTime).offsetMinutes ||
        a.name.localeCompare(b.name),
  );

  const visibleGroups = DEPARTMENTS.map((department, index) => ({
    ...department,
    index,
    members: sorted.filter((member) => member.department === department.value),
  })).filter((group) => filter === 'all' || group.value === filter);

  const groups = visibleGroups.map((group, position) => ({
    ...group,
    firstSlot: visibleGroups.slice(0, position).reduce((slots, previous) => slots + previous.members.length + 1, 0),
  }));

  const filters = [
    { value: 'all', label: 'Everyone', count: MEMBERS.length },
    ...DEPARTMENTS.map((department) => ({
      value: department.value,
      label: department.label,
      count: MEMBERS.filter((member) => member.department === department.value).length,
    })),
  ];

  return (
    <section data-slot="team-directory" className="bg-background py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:gap-14 md:px-10">
        <div data-slot="team-directory-header" className="flex flex-col gap-8">
          <div className="flex max-w-xl flex-col gap-4">
            <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Team directory</span>
            <h2
              style={stagger(1, 80)}
              className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
            >
              Ten people, six cities
            </h2>
            <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
              Check someone&apos;s local time before you message them. Anyone between 09:00 and 18:00 on a weekday is
              marked online.
            </p>
          </div>

          <div
            style={stagger(3, 80)}
            className={cn(
              ENTER,
              'flex flex-col-reverse gap-4 border-b border-border sm:flex-row sm:items-end sm:justify-between',
            )}
          >
            <ToggleGroup
              spacing={1}
              aria-label="Filter by department"
              value={[filter]}
              onValueChange={([next]) => next && setFilter(next as Filter)}
              className="-mb-px flex-wrap"
            >
              {filters.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value} className="h-10">
                  {option.label}
                  <span className="text-xs font-normal tabular-nums text-muted-foreground">{option.count}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="flex items-center gap-3 pb-3">
              <span id="team-03-sort" className="text-xs uppercase text-muted-foreground">
                Sort
              </span>
              <ToggleGroup
                variant="outline"
                size="sm"
                aria-labelledby="team-03-sort"
                value={[sort]}
                onValueChange={([next]) => next && setSort(next as Sort)}
              >
                <ToggleGroupItem value="time">Local time</ToggleGroupItem>
                <ToggleGroupItem value="name">A to Z</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        <TooltipProvider>
          <div data-slot="team-directory-groups" className="flex flex-col gap-12">
            {groups.map((group) => (
              <div key={group.value} data-slot="team-directory-group" className="flex flex-col">
                <div
                  key={`${filter}-${group.value}`}
                  style={stagger(group.firstSlot, 50, 300)}
                  className={cn(ENTER, 'flex items-baseline gap-3 border-b border-border pb-3')}
                >
                  <span dir="ltr" className="text-xs tabular-nums text-muted-foreground">
                    {formatIndex(group.index)}
                    <span className="mx-1.5 text-border">|</span>
                    {formatIndex(DEPARTMENTS.length - 1)}
                  </span>
                  <h3 className="text-sm font-medium">{group.label}</h3>
                  <span className="ms-auto text-xs tabular-nums text-muted-foreground">
                    {group.members.length} people
                  </span>
                </div>

                <ul className="flex flex-col">
                  {group.members.map((member, memberIndex) => {
                    const local = now === null ? null : readLocalTime(member.timeZone, now);
                    const status = local ? statusFor(local) : null;
                    return (
                      <li
                        key={`${filter}-${sort}-${member.email}`}
                        data-slot="team-directory-member"
                        style={stagger(group.firstSlot + memberIndex + 1, 50, 300)}
                        className={cn(
                          ENTER,
                          'group/row flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border/60 py-4 transition-colors duration-150 hover:bg-muted/30',
                          'md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-6 md:px-3',
                        )}
                      >
                        <div className="order-1 flex min-w-0 flex-1 items-center gap-3 md:order-none">
                          <Avatar className="size-10">
                            {member.avatar && <AvatarImage src={member.avatar} alt="" className="object-cover" />}
                            <AvatarFallback>{initials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{member.name}</p>
                            <p className="truncate text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>

                        <div className="order-3 flex basis-full items-start justify-between gap-4 ps-13 md:contents">
                          <div className="flex flex-col md:order-none">
                            <span className="text-sm">{member.city}</span>
                            <span dir="ltr" className="min-h-4 text-start text-xs tabular-nums text-muted-foreground">
                              {local?.offsetLabel}
                            </span>
                          </div>
                          <div className="flex flex-col items-end md:items-start">
                            {local && status ? (
                              <>
                                <time dir="ltr" className="text-sm font-medium tabular-nums">
                                  {local.clock}
                                </time>
                                <span
                                  className={cn(
                                    'text-xs',
                                    status.online ? 'text-accent-cool' : 'text-muted-foreground',
                                  )}
                                >
                                  {status.label}
                                </span>
                              </>
                            ) : (
                              <>
                                <span aria-hidden className="my-0.5 h-4 w-11 rounded bg-muted" />
                                <span aria-hidden className="mt-1 h-3 w-20 rounded bg-muted" />
                              </>
                            )}
                          </div>
                        </div>

                        <div className="order-2 flex shrink-0 gap-1 md:order-none md:opacity-0 md:transition-opacity md:duration-150 md:group-focus-within/row:opacity-100 md:group-hover/row:opacity-100">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  nativeButton={false}
                                  render={<a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} />}
                                />
                              }
                            >
                              <Mail />
                            </TooltipTrigger>
                            <TooltipContent>Email</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label={`Book time with ${member.name}`}
                                />
                              }
                            >
                              <CalendarPlus />
                            </TooltipTrigger>
                            <TooltipContent>Book time</TooltipContent>
                          </Tooltip>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
};

export default Team03;
