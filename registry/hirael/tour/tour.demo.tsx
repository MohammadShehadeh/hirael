"use client"

import * as React from "react"

import { Badge } from "@/registry/hirael/ui/badge"
import { Button } from "@/registry/hirael/ui/button"
import { Tour, TourTrigger, type TourStep } from "@/registry/hirael/ui/tour"

const steps: TourStep[] = [
  {
    target: "#tour-demo-profile",
    title: "Your profile",
    description:
      "Update your display name and avatar. Changes are visible to your whole team.",
    side: "bottom",
  },
  {
    target: "#tour-demo-notifications",
    title: "Notifications",
    description: "Choose how noisy we are. Digest mode batches everything.",
    side: "left",
  },
  {
    target: "#tour-demo-api-keys",
    title: "API keys",
    description: "Create scoped keys for CI and local development.",
    side: "right",
  },
  {
    target: "#tour-demo-danger",
    title: "Danger zone",
    description: "Deleting the workspace is permanent. No undo, no backups.",
    side: "top",
  },
]

export default function TourDemo() {
  const [completed, setCompleted] = React.useState(false)

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Spotlight tour · 4 steps
        </p>
        <Tour steps={steps} onFinish={() => setCompleted(true)}>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <TourTrigger variant="outline" size="sm">
                Start tour
              </TourTrigger>
              {completed && <Badge variant="outline">Tour completed</Badge>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                id="tour-demo-profile"
                className="rounded-md border border-border bg-card p-4 sm:col-span-2"
              >
                <p className="text-sm font-medium">Profile</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mohammad Shehadeh · mohammad@hirael.com
                </p>
                <Button variant="secondary" size="sm" className="mt-3">
                  Edit profile
                </Button>
              </div>
              <div
                id="tour-demo-notifications"
                className="rounded-md border border-border bg-card p-4"
              >
                <p className="text-sm font-medium">Notifications</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Weekly digest · mentions only
                </p>
              </div>
              <div
                id="tour-demo-api-keys"
                className="rounded-md border border-border bg-card p-4"
              >
                <p className="text-sm font-medium">API keys</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  hr_live_••••••••3f2a
                </p>
              </div>
              <div
                id="tour-demo-danger"
                className="rounded-md border border-destructive/40 bg-card p-4 sm:col-span-2"
              >
                <p className="text-sm font-medium text-destructive">
                  Danger zone
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Delete this workspace and all of its data.
                </p>
              </div>
            </div>
          </div>
        </Tour>
      </div>
    </div>
  )
}
