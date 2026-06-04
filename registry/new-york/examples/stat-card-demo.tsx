"use client"

import {
  StatCard,
  StatCardDelta,
  StatCardLabel,
  StatCardValue,
} from "@/registry/new-york/ui/stat-card"

export default function StatCardDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          3-up grid
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard>
            <StatCardLabel>Active users</StatCardLabel>
            <StatCardValue>12,481</StatCardValue>
            <StatCardDelta trend="up">+12.4%</StatCardDelta>
          </StatCard>
          <StatCard>
            <StatCardLabel>Bounce rate</StatCardLabel>
            <StatCardValue>38.2%</StatCardValue>
            <StatCardDelta trend="down">-2.1%</StatCardDelta>
          </StatCard>
          <StatCard>
            <StatCardLabel>Avg. session</StatCardLabel>
            <StatCardValue>4m 12s</StatCardValue>
            <div className="flex items-center gap-2">
              <StatCardDelta trend="flat">0.0%</StatCardDelta>
              <span className="text-[11px] text-muted-foreground">
                vs last 7 days
              </span>
            </div>
          </StatCard>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Custom layout
        </p>
        <StatCard className="max-w-xs">
          <div className="flex items-center justify-between">
            <StatCardLabel>Monthly recurring revenue</StatCardLabel>
            <StatCardDelta trend="up">+8.7%</StatCardDelta>
          </div>
          <StatCardValue>
            <span className="font-mono text-muted-foreground">$</span>
            48,250
          </StatCardValue>
          <p className="text-[11px] text-muted-foreground">
            Target $52,000 · 92.8% to goal
          </p>
        </StatCard>
      </div>
    </div>
  )
}
