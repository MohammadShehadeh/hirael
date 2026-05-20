"use client"

import {
  StatCard,
  StatCardDelta,
  StatCardLabel,
  StatCardRoot,
  StatCardValue,
} from "@/registry/sabk/stat-card/stat-card"

export default function StatCardDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Single-prop API · 3-up grid
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Active users"
            value="12,481"
            delta={{ value: "+12.4%", trend: "up" }}
          />
          <StatCard
            label="Bounce rate"
            value="38.2%"
            delta={{ value: "-2.1%", trend: "down" }}
          />
          <StatCard
            label="Avg. session"
            value="4m 12s"
            delta={{ value: "0.0%", trend: "flat" }}
            hint="vs last 7 days"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Compound API · custom layout
        </p>
        <StatCardRoot className="max-w-xs">
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
        </StatCardRoot>
      </div>
    </div>
  )
}
