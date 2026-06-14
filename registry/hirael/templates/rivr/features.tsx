"use client"

import { motion } from "framer-motion"
import { Droplet, Layers, TrendingUp } from "lucide-react"

import { Eyebrow, fadeUp } from "./primitives"

const FEATURES = [
  {
    icon: Layers,
    title: "Smart Vaults",
    desc: "Automated strategies route idle assets into the highest-yielding venues, rebalanced every block.",
  },
  {
    icon: Droplet,
    title: "Instant Liquidity",
    desc: "Unlock cash from staked positions and NFTs without unwinding what you hold.",
  },
  {
    icon: TrendingUp,
    title: "Yield Streams",
    desc: "Rewards accrue continuously and stay claimable, with no lockups or waiting periods.",
  },
]

export function Features() {
  return (
    <section
      data-slot="features"
      className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10 md:py-28"
    >
      <motion.div {...fadeUp()} className="flex max-w-2xl flex-col gap-4">
        <Eyebrow>Why RIVR</Eyebrow>
        <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
          Built for capital that never sits still
        </h2>
        <p className="text-base text-muted-foreground sm:text-lg">
          Stake, borrow against, and stream yield from a single position. RIVR
          keeps your assets liquid while they work.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            {...fadeUp(i * 0.1)}
            className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-7"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <feature.icon className="size-6" />
            </span>
            <h3 className="text-lg font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
