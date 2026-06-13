"use client"

import { GitMerge, MessageSquare, UserPlus } from "lucide-react"

import {
  ActivityFeed,
  ActivityFeedAction,
  ActivityFeedActor,
  ActivityFeedAvatar,
  ActivityFeedBody,
  ActivityFeedContent,
  ActivityFeedDivider,
  ActivityFeedHeader,
  ActivityFeedItem,
  ActivityFeedTime,
} from "@/registry/hirael/ui/activity-feed"

export default function ActivityFeedDemo() {
  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-3">
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
                Looks good. Can we add a test for the proration edge case
                before this ships?
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

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Compact
        </p>
        <ActivityFeed>
          <ActivityFeedItem>
            <ActivityFeedAvatar>
              <MessageSquare className="text-foreground" />
            </ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>Support</ActivityFeedActor>
                <ActivityFeedAction>replied to ticket 4821</ActivityFeedAction>
              </ActivityFeedHeader>
              <ActivityFeedTime>2 hours ago</ActivityFeedTime>
            </ActivityFeedContent>
          </ActivityFeedItem>
          <ActivityFeedItem>
            <ActivityFeedAvatar>AK</ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>Aria Kettle</ActivityFeedActor>
                <ActivityFeedAction>closed ticket 4820</ActivityFeedAction>
              </ActivityFeedHeader>
              <ActivityFeedTime>4 hours ago</ActivityFeedTime>
            </ActivityFeedContent>
          </ActivityFeedItem>
        </ActivityFeed>
      </div>
    </div>
  )
}
