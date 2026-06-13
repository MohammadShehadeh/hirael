"use client"

import { TiltCard } from "@/registry/hirael/ui/tilt-card"

export default function TiltCardDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <TiltCard glare className="w-64">
        <div className="flex flex-col gap-6 p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Virtual
            </span>
            <span className="size-6 rounded-full bg-foreground/10" />
          </div>
          <div className="font-mono text-lg tracking-[0.12em] text-foreground">
            •••• 8021
          </div>
          <div className="flex items-end justify-between">
            <span className="text-sm font-medium text-foreground">
              A. Khoury
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              09 / 28
            </span>
          </div>
        </div>
      </TiltCard>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Point at the card to tilt
      </p>
    </div>
  )
}
