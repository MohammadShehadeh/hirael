"use client"

import * as React from "react"

import { AnimatedNumber } from "@/registry/hirael/ui/animated-number"

export default function AnimatedNumberDemo() {
  const [revenue, setRevenue] = React.useState(48250)
  const [users, setUsers] = React.useState(12481)

  const shuffle = () => {
    setRevenue(Math.round(20000 + Math.random() * 80000))
    setUsers(Math.round(2000 + Math.random() * 40000))
  }

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Metric cards · live values
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Revenue
            </p>
            <AnimatedNumber
              value={revenue}
              prefix="$"
              className="mt-1 block text-2xl font-semibold tracking-tight"
            />
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Active users
            </p>
            <AnimatedNumber
              value={users}
              className="mt-1 block text-2xl font-semibold tracking-tight"
            />
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Conversion
            </p>
            <AnimatedNumber
              value={3.2}
              decimals={1}
              suffix="%"
              className="mt-1 block text-2xl font-semibold tracking-tight"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={shuffle}
          className="mt-1 w-fit rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Randomize
        </button>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Compact notation
        </p>
        <AnimatedNumber
          value={1284000}
          duration={1200}
          format={{ notation: "compact", maximumFractionDigits: 1 }}
          className="text-3xl font-semibold tracking-tight"
        />
      </div>
    </div>
  )
}
