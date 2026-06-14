"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

import { fadeUp } from "./primitives"

const METRICS = [
  { value: "$2.4B", label: "Total Value Locked" },
  { value: "8.5%", label: "Average Realized Yield" },
  { value: "140K+", label: "Active Participants" },
  { value: "< 2s", label: "Finality Engine" },
]

const CELL_BORDERS = [
  "",
  "border-s border-foreground/10",
  "border-t border-foreground/10 md:border-s md:border-t-0",
  "border-s border-t border-foreground/10 md:border-t-0",
]

export function Metrics() {
  return (
    <section
      data-slot="metrics"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-12"
    >
      <div className="rounded-[1.5rem] border border-foreground/[0.05] bg-foreground/[0.02] p-8 md:rounded-[3rem] md:p-16">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              {...fadeUp(i * 0.08)}
              className={cn("flex flex-col gap-2 p-6", CELL_BORDERS[i])}
            >
              <dt className="font-display text-4xl font-semibold tracking-tight text-foreground tabular-nums md:text-5xl">
                {metric.value}
              </dt>
              <dd className="text-sm text-muted-foreground">{metric.label}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}
