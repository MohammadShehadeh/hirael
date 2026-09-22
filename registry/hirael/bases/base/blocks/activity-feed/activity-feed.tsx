'use client';

import * as React from 'react';
import { GitMerge, UserPlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

type ActivityFeedProps = React.ComponentProps<'ul'>;

const ActivityFeed = ({ className, ...props }: ActivityFeedProps) => {
  return <ul data-slot="activity-feed" className={cn('flex flex-col', className)} {...props} />;
};

type ActivityFeedItemProps = React.ComponentProps<'li'>;

const ActivityFeedItem = ({ className, ...props }: ActivityFeedItemProps) => {
  return (
    <li
      data-slot="activity-feed-item"
      className={cn(
        'group relative flex gap-3 pb-5 last:pb-0',
        'before:absolute before:start-[15px] before:top-9 before:bottom-0 before:w-px before:bg-border',
        'last:before:hidden',
        className,
      )}
      {...props}
    />
  );
};

interface ActivityFeedAvatarProps extends React.ComponentProps<'span'> {
  src?: string;
  alt?: string;
}

const ActivityFeedAvatar = ({ src, alt, className, children, ...props }: ActivityFeedAvatarProps) => {
  return (
    <span
      data-slot="activity-feed-avatar"
      className={cn(
        'relative z-10 inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-[11px] font-medium text-muted-foreground [&_svg]:size-4',
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ''} loading="lazy" className="size-full object-cover" />
      ) : (
        children
      )}
    </span>
  );
};

type ActivityFeedContentProps = React.ComponentProps<'div'>;

const ActivityFeedContent = ({ className, ...props }: ActivityFeedContentProps) => {
  return (
    <div
      data-slot="activity-feed-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-1 pt-1', className)}
      {...props}
    />
  );
};

type ActivityFeedHeaderProps = React.ComponentProps<'div'>;

const ActivityFeedHeader = ({ className, ...props }: ActivityFeedHeaderProps) => {
  return (
    <div
      data-slot="activity-feed-header"
      className={cn('flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm leading-snug', className)}
      {...props}
    />
  );
};

type ActivityFeedActorProps = React.ComponentProps<'span'>;

const ActivityFeedActor = ({ className, ...props }: ActivityFeedActorProps) => {
  return <span data-slot="activity-feed-actor" className={cn('font-medium text-foreground', className)} {...props} />;
};

type ActivityFeedActionProps = React.ComponentProps<'span'>;

const ActivityFeedAction = ({ className, ...props }: ActivityFeedActionProps) => {
  return <span data-slot="activity-feed-action" className={cn('text-muted-foreground', className)} {...props} />;
};

type ActivityFeedTimeProps = React.ComponentProps<'time'>;

const ActivityFeedTime = ({ className, ...props }: ActivityFeedTimeProps) => {
  return (
    <time
      data-slot="activity-feed-time"
      className={cn('text-xs uppercase text-muted-foreground', className)}
      {...props}
    />
  );
};

type ActivityFeedBodyProps = React.ComponentProps<'div'>;

const ActivityFeedBody = ({ className, ...props }: ActivityFeedBodyProps) => {
  return (
    <div
      data-slot="activity-feed-body"
      className={cn('mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground', className)}
      {...props}
    />
  );
};

type ActivityFeedDividerProps = React.ComponentProps<'li'>;

const ActivityFeedDivider = ({ className, children, ...props }: ActivityFeedDividerProps) => {
  return (
    <li data-slot="activity-feed-divider" className={cn('flex items-center gap-3 pb-5', className)} {...props}>
      {children ? <span className="text-xs uppercase text-muted-foreground">{children}</span> : null}
      <span aria-hidden className="h-px flex-1 bg-border" />
    </li>
  );
};

export {
  ActivityFeed,
  ActivityFeedItem,
  ActivityFeedAvatar,
  ActivityFeedContent,
  ActivityFeedHeader,
  ActivityFeedActor,
  ActivityFeedAction,
  ActivityFeedTime,
  ActivityFeedBody,
  ActivityFeedDivider,
};

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

type ActivityType = 'code' | 'comment' | 'member';
type ActivityFilter = 'all' | ActivityType;

interface ActivityEvent {
  id: string;
  day: string;
  type: ActivityType;
  actor: string;
  initials: string;
  action: string;
  time: string;
  body?: string;
}

const ACTIVITY: ActivityEvent[] = [
  {
    id: 'merge-billing',
    day: 'Today',
    type: 'code',
    actor: 'Lena Park',
    initials: 'LP',
    action: 'merged feat/billing into main',
    time: '14:20',
  },
  {
    id: 'comment-1284',
    day: 'Today',
    type: 'comment',
    actor: 'Mara Singh',
    initials: 'MS',
    action: 'commented on PR #1284',
    time: '13:58',
    body: 'Looks good. Can we add a test for the proration edge case before this ships?',
  },
  {
    id: 'push-invoices',
    day: 'Today',
    type: 'code',
    actor: 'Omar Haddad',
    initials: 'OH',
    action: 'pushed 3 commits to fix/invoice-pdf',
    time: '11:12',
  },
  {
    id: 'join-theo',
    day: 'Yesterday',
    type: 'member',
    actor: 'Theo Adams',
    initials: 'TA',
    action: 'joined the workspace',
    time: '17:02',
  },
  {
    id: 'comment-1279',
    day: 'Yesterday',
    type: 'comment',
    actor: 'Lena Park',
    initials: 'LP',
    action: 'commented on PR #1279',
    time: '09:41',
    body: 'Rebased on main. The flaky checkout test passes locally now.',
  },
];

const FILTERS: { value: ActivityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'code', label: 'Code' },
  { value: 'comment', label: 'Comments' },
  { value: 'member', label: 'Members' },
];

const EVENT_ICON: Partial<Record<ActivityType, typeof GitMerge>> = {
  code: GitMerge,
  member: UserPlus,
};

const ActivityFeedBlock = () => {
  const [filter, setFilter] = React.useState<ActivityFilter>('all');
  const events = ACTIVITY.filter((event) => filter === 'all' || event.type === filter);
  const days = [...new Set(events.map((event) => event.day))];

  return (
    <section data-slot="activity-feed-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className={cn(ENTER, 'grid w-full max-w-xl gap-4')}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase text-muted-foreground">Team activity</p>
          <ToggleGroup
            size="sm"
            variant="outline"
            value={[filter]}
            onValueChange={([value]) => {
              if (value) setFilter(value as ActivityFilter);
            }}
            aria-label="Filter by type"
          >
            {FILTERS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value} className="px-2.5 text-xs">
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        {events.length ? (
          <ActivityFeed key={filter} className={SWAP}>
            {days.map((day) => (
              <React.Fragment key={day}>
                <ActivityFeedDivider>{day}</ActivityFeedDivider>
                {events
                  .filter((event) => event.day === day)
                  .map((event) => {
                    const Icon = EVENT_ICON[event.type];
                    return (
                      <ActivityFeedItem key={event.id}>
                        <ActivityFeedAvatar>
                          {Icon ? <Icon aria-hidden className="text-foreground" /> : event.initials}
                        </ActivityFeedAvatar>
                        <ActivityFeedContent>
                          <ActivityFeedHeader>
                            <ActivityFeedActor>{event.actor}</ActivityFeedActor>
                            <ActivityFeedAction>{event.action}</ActivityFeedAction>
                            <ActivityFeedTime className="ms-auto tabular-nums">{event.time}</ActivityFeedTime>
                          </ActivityFeedHeader>
                          {event.body ? <ActivityFeedBody>{event.body}</ActivityFeedBody> : null}
                        </ActivityFeedContent>
                      </ActivityFeedItem>
                    );
                  })}
              </React.Fragment>
            ))}
          </ActivityFeed>
        ) : (
          <p
            key={`${filter}-empty`}
            className={cn(
              SWAP,
              'rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground',
            )}
          >
            Nothing of this type in the last two days.
          </p>
        )}
      </div>
    </section>
  );
};

export default ActivityFeedBlock;
