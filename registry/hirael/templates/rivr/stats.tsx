"use client"

import { motion } from "framer-motion"

import { fadeUp } from "./primitives"

const STATS = [
  { value: "$1.2B", label: "Total value locked" },
  { value: "8.4%", label: "Average APY" },
  { value: "5.2K", label: "Active yielders" },
  { value: "40+", label: "Live vaults" },
]

export function Stats() {
  return (
    <section
      data-slot="stats"
      className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10 md:pb-28"
    >
      <motion.dl
        {...fadeUp()}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 bg-card p-7 md:p-8">
            <dt className="font-display text-4xl font-semibold tracking-tight text-foreground tabular-nums md:text-5xl">
              {stat.value}
            </dt>
            <dd className="text-sm text-muted-foreground">{stat.label}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  )
}
