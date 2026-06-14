"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Boxes, Code, Coins, Scale } from "lucide-react"

import { Eyebrow, fadeUp } from "./primitives"

const PILLARS = [
  {
    icon: Boxes,
    title: "Ecosystem",
    desc: "Vaults, lending markets and NFT collateral, composable from day one.",
  },
  {
    icon: Coins,
    title: "Economics",
    desc: "A fee-sharing model that returns protocol revenue to RIVR stakers.",
  },
  {
    icon: Code,
    title: "Developers",
    desc: "Typed SDKs and webhooks to plug streaming yield into any app.",
  },
  {
    icon: Scale,
    title: "Governance",
    desc: "Vote on listings, parameters and the treasury with locked RIVR.",
  },
]

export function Ecosystem() {
  return (
    <section
      id="ecosystem"
      data-slot="ecosystem"
      className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10 md:pb-28"
    >
      <motion.div {...fadeUp()} className="flex max-w-2xl flex-col gap-4">
        <Eyebrow>The protocol</Eyebrow>
        <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
          One network, four moving parts
        </h2>
      </motion.div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
        {PILLARS.map((pillar, i) => (
          <motion.a
            key={pillar.title}
            href="#"
            {...fadeUp(i * 0.08)}
            className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-7 transition-colors hover:border-foreground/20"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-foreground">
                <pillar.icon className="size-5" />
              </span>
              <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-foreground rtl:-scale-x-100" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {pillar.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {pillar.desc}
            </p>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
