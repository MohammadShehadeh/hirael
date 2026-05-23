"use client"

import { Check, GitBranch, GitCommit, Rocket } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/msh-ui/timeline/timeline"

export default function TimelineDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Activity feed
        </p>
        <Timeline>
          <TimelineItem>
            <TimelineDot tone="success" />
            <TimelineContent>
              <TimelineTime>Today · 14:02</TimelineTime>
              <TimelineTitle>Deployment shipped to production</TimelineTitle>
              <TimelineDescription>
                Build <code className="font-mono">b-29f1</code> passed all gates.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot />
            <TimelineContent>
              <TimelineTime>Today · 13:48</TimelineTime>
              <TimelineTitle>PR #1284 merged</TimelineTitle>
              <TimelineDescription>
                <span className="font-medium text-foreground">monica</span>{" "}
                merged <span className="font-mono">feat/billing-flow</span> into{" "}
                <span className="font-mono">main</span>.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="warning" />
            <TimelineContent>
              <TimelineTime>Today · 11:12</TimelineTime>
              <TimelineTitle>Slow query detected</TimelineTitle>
              <TimelineDescription>
                <code className="font-mono">/api/reports</code> averaged 2.4s
                over the last 15 min.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="muted" />
            <TimelineContent>
              <TimelineTime>Yesterday · 17:30</TimelineTime>
              <TimelineTitle>Release notes drafted</TimelineTitle>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          With icons
        </p>
        <Timeline>
          <TimelineItem>
            <TimelineDot>
              <Rocket className="text-foreground" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>v1.4 released</TimelineTitle>
              <TimelineDescription>
                New billing flow, faster cold start.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot>
              <Check className="text-foreground" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>QA sign-off</TimelineTitle>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot>
              <GitBranch className="text-foreground" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>Branch cut · release/1.4</TimelineTitle>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot>
              <GitCommit className="text-foreground" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>First commit</TimelineTitle>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  )
}
