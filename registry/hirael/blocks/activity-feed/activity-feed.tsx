"use client";

import * as React from "react";
import { GitMerge, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";

type ActivityFeedProps = React.ComponentProps<"ul">;

const ActivityFeed = ({ className, ...props }: ActivityFeedProps) => {
  return (
    <ul
      data-slot="activity-feed"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
};

type ActivityFeedItemProps = React.ComponentProps<"li">;

const ActivityFeedItem = ({ className, ...props }: ActivityFeedItemProps) => {
  return (
    <li
      data-slot="activity-feed-item"
      className={cn(
        "group relative flex gap-3 pb-5 last:pb-0",
        "before:absolute before:start-[15px] before:top-9 before:bottom-0 before:w-px before:bg-border",
        "last:before:hidden",
        className,
      )}
      {...props}
    />
  );
};

interface ActivityFeedAvatarProps extends React.ComponentProps<"span"> {
  src?: string;
  alt?: string;}

const ActivityFeedAvatar = ({
  src,
  alt,
  className,
  children,
  ...props
}: ActivityFeedAvatarProps) => {
  return (
    <span
      data-slot="activity-feed-avatar"
      className={cn(
        "relative z-10 inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-[11px] font-medium text-muted-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        children
      )}
    </span>
  );
};

type ActivityFeedContentProps = React.ComponentProps<"div">;

const ActivityFeedContent = ({
  className,
  ...props
}: ActivityFeedContentProps) => {
  return (
    <div
      data-slot="activity-feed-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-1 pt-1", className)}
      {...props}
    />
  );
};

type ActivityFeedHeaderProps = React.ComponentProps<"div">;

const ActivityFeedHeader = ({ className, ...props }: ActivityFeedHeaderProps) => {
  return (
    <div
      data-slot="activity-feed-header"
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm leading-snug",
        className,
      )}
      {...props}
    />
  );
};

type ActivityFeedActorProps = React.ComponentProps<"span">;

const ActivityFeedActor = ({ className, ...props }: ActivityFeedActorProps) => {
  return (
    <span
      data-slot="activity-feed-actor"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
};

type ActivityFeedActionProps = React.ComponentProps<"span">;

const ActivityFeedAction = ({ className, ...props }: ActivityFeedActionProps) => {
  return (
    <span
      data-slot="activity-feed-action"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
};

type ActivityFeedTimeProps = React.ComponentProps<"time">;

const ActivityFeedTime = ({ className, ...props }: ActivityFeedTimeProps) => {
  return (
    <time
      data-slot="activity-feed-time"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

type ActivityFeedBodyProps = React.ComponentProps<"div">;

const ActivityFeedBody = ({ className, ...props }: ActivityFeedBodyProps) => {
  return (
    <div
      data-slot="activity-feed-body"
      className={cn(
        "mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
};

type ActivityFeedDividerProps = React.ComponentProps<"li">;

const ActivityFeedDivider = ({
  className,
  children,
  ...props
}: ActivityFeedDividerProps) => {
  return (
    <li
      data-slot="activity-feed-divider"
      className={cn("flex items-center gap-3 pb-5", className)}
      {...props}
    >
      {children ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {children}
        </span>
      ) : null}
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

const ActivityFeedBlock = () => {
  return (
    <section
      data-slot="activity-feed-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="grid w-full max-w-xl gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Team activity
        </p>
        <ActivityFeed>
          <ActivityFeedDivider>Today</ActivityFeedDivider>
          <ActivityFeedItem>
            <ActivityFeedAvatar>
              <GitMerge className="text-foreground" />
            </ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>Lena Park</ActivityFeedActor>
                <ActivityFeedAction>
                  merged <span className="font-mono">feat/billing</span> into
                  main
                </ActivityFeedAction>
                <ActivityFeedTime className="ms-auto">14:20</ActivityFeedTime>
              </ActivityFeedHeader>
            </ActivityFeedContent>
          </ActivityFeedItem>
          <ActivityFeedItem>
            <ActivityFeedAvatar>MS</ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>Mara Singh</ActivityFeedActor>
                <ActivityFeedAction>commented on PR #1284</ActivityFeedAction>
                <ActivityFeedTime className="ms-auto">13:58</ActivityFeedTime>
              </ActivityFeedHeader>
              <ActivityFeedBody>
                Looks good. Can we add a test for the proration edge case before
                this ships?
              </ActivityFeedBody>
            </ActivityFeedContent>
          </ActivityFeedItem>
          <ActivityFeedDivider>Yesterday</ActivityFeedDivider>
          <ActivityFeedItem>
            <ActivityFeedAvatar>
              <UserPlus className="text-foreground" />
            </ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>Theo Adams</ActivityFeedActor>
                <ActivityFeedAction>joined the workspace</ActivityFeedAction>
                <ActivityFeedTime className="ms-auto">17:02</ActivityFeedTime>
              </ActivityFeedHeader>
            </ActivityFeedContent>
          </ActivityFeedItem>
        </ActivityFeed>
      </div>
    </section>
  );
};

export default ActivityFeedBlock;
