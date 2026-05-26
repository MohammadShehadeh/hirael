"use client"

import { ArrowRight, Sparkles } from "lucide-react"

import {
  AnnouncementBar,
  AnnouncementBarBadge,
  AnnouncementBarLink,
} from "@/registry/msh-ui/ui/announcement-bar"

export default function AnnouncementBarDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-6">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Default · dismissible
        </p>
        <AnnouncementBar dismissible className="rounded-md border">
          <AnnouncementBarBadge>new</AnnouncementBarBadge>
          <span className="text-foreground">
            v1.4 ships with a new combobox primitive.
          </span>
          <AnnouncementBarLink href="#">
            Read the post
            <ArrowRight className="size-3" />
          </AnnouncementBarLink>
        </AnnouncementBar>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Primary
        </p>
        <AnnouncementBar tone="primary" className="rounded-md border">
          <Sparkles className="size-3.5" />
          <span>Early-access pricing ends Friday.</span>
          <AnnouncementBarLink href="#">
            Claim 50% off
            <ArrowRight className="size-3" />
          </AnnouncementBarLink>
        </AnnouncementBar>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Muted · simple
        </p>
        <AnnouncementBar tone="muted" className="rounded-md">
          <span className="text-muted-foreground">
            Scheduled maintenance on May 28, 02:00 UTC · ~15 min downtime.
          </span>
        </AnnouncementBar>
      </div>
    </div>
  )
}
