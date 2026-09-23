'use client';

import * as React from 'react';
import { Check, CreditCard, GitPullRequest, Inbox, UserPlus, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/registry/hirael/bases/base/ui/empty';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

type NotificationsProps = React.ComponentProps<'div'>;

const Notifications = ({ className, ...props }: NotificationsProps) => {
  return (
    <div
      data-slot="notifications"
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  );
};

type NotificationsHeaderProps = React.ComponentProps<'div'>;

const NotificationsHeader = ({ className, ...props }: NotificationsHeaderProps) => {
  return (
    <div
      data-slot="notifications-header"
      className={cn('flex items-center justify-between gap-2 border-b border-border px-4 py-3', className)}
      {...props}
    />
  );
};

type NotificationsTitleProps = React.ComponentProps<'h3'>;

const NotificationsTitle = ({ className, ...props }: NotificationsTitleProps) => {
  return (
    <h3 data-slot="notifications-title" className={cn('text-sm font-medium text-foreground', className)} {...props} />
  );
};

type NotificationsListProps = React.ComponentProps<'ul'>;

const NotificationsList = ({ className, ...props }: NotificationsListProps) => {
  return <ul data-slot="notifications-list" className={cn('divide-y divide-border', className)} {...props} />;
};

interface NotificationItemProps extends React.ComponentProps<'li'> {
  unread?: boolean;
}

const NotificationItem = ({ unread, className, children, ...props }: NotificationItemProps) => {
  return (
    <li
      data-slot="notification-item"
      data-unread={unread ? '' : undefined}
      className={cn(
        'relative flex gap-3 py-3 ps-7 pe-4 transition-colors hover:bg-accent/60 data-[unread]:bg-accent/30',
        className,
      )}
      {...props}
    >
      {unread ? <span aria-hidden className="absolute start-3 top-4 size-1.5 rounded-full bg-primary" /> : null}
      {children}
    </li>
  );
};

type NotificationMediaProps = React.ComponentProps<'span'>;

const NotificationMedia = ({ className, ...props }: NotificationMediaProps) => {
  return (
    <span
      data-slot="notification-media"
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-[11px] font-medium text-muted-foreground [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
};

type NotificationContentProps = React.ComponentProps<'div'>;

const NotificationContent = ({ className, ...props }: NotificationContentProps) => {
  return (
    <div
      data-slot="notification-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    />
  );
};

type NotificationTitleProps = React.ComponentProps<'p'>;

const NotificationTitle = ({ className, ...props }: NotificationTitleProps) => {
  return <p data-slot="notification-title" className={cn('text-sm text-foreground', className)} {...props} />;
};

type NotificationDescriptionProps = React.ComponentProps<'p'>;

const NotificationDescription = ({ className, ...props }: NotificationDescriptionProps) => {
  return (
    <p
      data-slot="notification-description"
      className={cn('text-xs leading-relaxed text-muted-foreground', className)}
      {...props}
    />
  );
};

type NotificationTimeProps = React.ComponentProps<'time'>;

const NotificationTime = ({ className, ...props }: NotificationTimeProps) => {
  return (
    <time
      data-slot="notification-time"
      className={cn('shrink-0 text-xs text-muted-foreground uppercase', className)}
      {...props}
    />
  );
};

export {
  Notifications,
  NotificationsHeader,
  NotificationsTitle,
  NotificationsList,
  NotificationItem,
  NotificationMedia,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationTime,
};

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

type NotificationFilter = 'all' | 'unread';

interface NotificationEntry {
  id: string;
  icon: React.ComponentType;
  title: React.ReactNode;
  label: string;
  description: React.ReactNode;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: NotificationEntry[] = [
  {
    id: 'review',
    icon: GitPullRequest,
    title: (
      <>
        <span className="font-medium">Lena Park</span> requested your review
      </>
    ),
    label: 'Lena Park requested your review',
    description: (
      <span className="flex flex-wrap gap-x-2">
        <span>feat/billing-flow</span>
        <span className="text-border" aria-hidden>
          |
        </span>
        <span>2 files changed</span>
      </span>
    ),
    time: '2m',
    unread: true,
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Payment received',
    label: 'Payment received',
    description: 'Invoice #3812 was paid in full.',
    time: '1h',
    unread: true,
  },
  {
    id: 'joined',
    icon: UserPlus,
    title: 'Theo Adams joined',
    label: 'Theo Adams joined',
    description: 'Accepted your invite to the workspace.',
    time: '3h',
    unread: false,
  },
];

const NotificationsBlock = () => {
  const [items, setItems] = React.useState(NOTIFICATIONS);
  const [filter, setFilter] = React.useState<NotificationFilter>('all');

  const unreadCount = items.filter((item) => item.unread).length;
  const visible = filter === 'unread' ? items.filter((item) => item.unread) : items;

  const markRead = (id: string) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  const dismiss = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  return (
    <section data-slot="notifications-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <Notifications className={cn(ENTER, 'w-full max-w-sm')}>
        <NotificationsHeader>
          <NotificationsTitle>Notifications</NotificationsTitle>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="-me-2"
            disabled={unreadCount === 0}
            onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))}
          >
            Mark all read
          </Button>
        </NotificationsHeader>

        <div data-slot="notifications-filter" className="border-b border-border px-4 py-2">
          <ToggleGroup
            size="sm"
            value={[filter]}
            onValueChange={([value]) => {
              if (value) setFilter(value as NotificationFilter);
            }}
            aria-label="Filter notifications"
          >
            <ToggleGroupItem value="all" className="h-7">
              All
              <span className="text-muted-foreground tabular-nums">{items.length}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="unread" className="h-7">
              Unread
              <span className="text-muted-foreground tabular-nums">{unreadCount}</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {visible.length === 0 ? (
          <Empty key={`empty-${filter}`} className={SWAP}>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Inbox />
              </EmptyMedia>
              <EmptyTitle>You&apos;re all caught up</EmptyTitle>
              <EmptyDescription>
                {filter === 'unread' && items.length > 0
                  ? 'Nothing unread. Switch to All to see earlier updates.'
                  : 'New reviews, payments and invites will show up here.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <NotificationsList key={filter} className={SWAP}>
            {visible.map((item) => {
              const Icon = item.icon;

              return (
                <NotificationItem key={item.id} unread={item.unread} className="group/notification">
                  <NotificationMedia>
                    <Icon />
                  </NotificationMedia>
                  <NotificationContent>
                    <NotificationTitle>{item.title}</NotificationTitle>
                    <NotificationDescription>{item.description}</NotificationDescription>
                  </NotificationContent>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <NotificationTime>{item.time}</NotificationTime>
                    <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-focus-within/notification:opacity-100 group-hover/notification:opacity-100 [@media(hover:none)]:opacity-100">
                      {item.unread ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Mark "${item.label}" as read`}
                          onClick={() => markRead(item.id)}
                        >
                          <Check />
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Dismiss "${item.label}"`}
                        onClick={() => dismiss(item.id)}
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                </NotificationItem>
              );
            })}
          </NotificationsList>
        )}
      </Notifications>
    </section>
  );
};

export default NotificationsBlock;
