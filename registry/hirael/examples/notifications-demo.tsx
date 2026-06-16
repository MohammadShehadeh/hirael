"use client";

import { CreditCard, GitPullRequest, UserPlus } from "lucide-react";

import {
  NotificationContent,
  NotificationDescription,
  NotificationItem,
  NotificationMedia,
  NotificationTime,
  NotificationTitle,
  Notifications,
  NotificationsHeader,
  NotificationsList,
  NotificationsTitle,
} from "@/registry/hirael/ui/notifications";

export default function NotificationsDemo() {
  return (
    <Notifications className="w-full max-w-sm">
      <NotificationsHeader>
        <NotificationsTitle>Notifications</NotificationsTitle>
        <button
          type="button"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Mark all read
        </button>
      </NotificationsHeader>
      <NotificationsList>
        <NotificationItem unread>
          <NotificationMedia>
            <GitPullRequest />
          </NotificationMedia>
          <NotificationContent>
            <NotificationTitle>
              <span className="font-medium">Lena Park</span> requested your
              review
            </NotificationTitle>
            <NotificationDescription>
              feat/billing-flow · 2 files changed
            </NotificationDescription>
          </NotificationContent>
          <NotificationTime>2m</NotificationTime>
        </NotificationItem>

        <NotificationItem unread>
          <NotificationMedia>
            <CreditCard />
          </NotificationMedia>
          <NotificationContent>
            <NotificationTitle>Payment received</NotificationTitle>
            <NotificationDescription>
              Invoice #3812 was paid in full.
            </NotificationDescription>
          </NotificationContent>
          <NotificationTime>1h</NotificationTime>
        </NotificationItem>

        <NotificationItem>
          <NotificationMedia>
            <UserPlus />
          </NotificationMedia>
          <NotificationContent>
            <NotificationTitle>Theo Adams joined</NotificationTitle>
            <NotificationDescription>
              Accepted your invite to the workspace.
            </NotificationDescription>
          </NotificationContent>
          <NotificationTime>3h</NotificationTime>
        </NotificationItem>
      </NotificationsList>
    </Notifications>
  );
}
