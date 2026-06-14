"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { fadeUp, RivrMark } from "./primitives"

export function Cta() {
  return (
    <section
      data-slot="cta"
      className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10 md:pb-28"
    >
      <motion.div
        {...fadeUp()}
        className="relative overflow-hidden rounded-[2rem] bg-foreground px-8 py-16 text-background md:px-16 md:py-24"
      >
        <RivrMark className="pointer-events-none absolute -end-12 -top-12 size-64 text-background/[0.06]" />

        <div className="relative flex max-w-2xl flex-col items-start gap-6">
          <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Put your idle capital to work
          </h2>
          <p className="text-base text-background/70 sm:text-lg">
            Open the app and stake in minutes, or talk to the team about
            integrating streaming yield into your product.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="group inline-flex items-center gap-2.5 rounded-full bg-background py-1.5 pe-1.5 ps-5 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
            >
              <span>Open App</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-foreground/10">
                <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </span>
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-full border border-background/25 px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-background/10"
            >
              Book a demo
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
