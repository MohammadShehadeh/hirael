'use client';

import * as React from 'react';
import { CreditCard, GitPullRequest, UserPlus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

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
        'relative flex gap-3 py-3 pe-4 ps-7 transition-colors hover:bg-accent/60 data-[unread]:bg-accent/30',
        className,
      )}
      {...props}
    >
      {unread ? <span aria-hidden className="absolute start-3 top-4 size-1.5 rounded-full bg-accent-cool" /> : null}
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
      className={cn('shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground', className)}
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

const NotificationsBlock = () => {
  return (
    <section data-slot="notifications-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <Notifications className="w-full max-w-sm">
        <NotificationsHeader>
          <NotificationsTitle>Notifications</NotificationsTitle>
          <Button type="button" variant="ghost" size="xs" className="-me-2 text-muted-foreground">
            Mark all read
          </Button>
        </NotificationsHeader>
        <NotificationsList>
          <NotificationItem unread>
            <NotificationMedia>
              <GitPullRequest />
            </NotificationMedia>
            <NotificationContent>
              <NotificationTitle>
                <span className="font-medium">Lena Park</span> requested your review
              </NotificationTitle>
              <NotificationDescription>feat/billing-flow · 2 files changed</NotificationDescription>
            </NotificationContent>
            <NotificationTime>2m</NotificationTime>
          </NotificationItem>

          <NotificationItem unread>
            <NotificationMedia>
              <CreditCard />
            </NotificationMedia>
            <NotificationContent>
              <NotificationTitle>Payment received</NotificationTitle>
              <NotificationDescription>Invoice #3812 was paid in full.</NotificationDescription>
            </NotificationContent>
            <NotificationTime>1h</NotificationTime>
          </NotificationItem>

          <NotificationItem>
            <NotificationMedia>
              <UserPlus />
            </NotificationMedia>
            <NotificationContent>
              <NotificationTitle>Theo Adams joined</NotificationTitle>
              <NotificationDescription>Accepted your invite to the workspace.</NotificationDescription>
            </NotificationContent>
            <NotificationTime>3h</NotificationTime>
          </NotificationItem>
        </NotificationsList>
      </Notifications>
    </section>
  );
};

export default NotificationsBlock;
