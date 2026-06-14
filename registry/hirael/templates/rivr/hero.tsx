"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react"

import { Navbar } from "./navbar"
import { PillButton } from "./primitives"

const IMAGE_URL =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"

function HeroBadge() {
  return (
    <motion.div
      data-slot="hero-badge"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-white/40 bg-card/60 px-4 py-2 backdrop-blur-md"
    >
      <Sparkles className="size-4 text-foreground/80" />
      <span className="text-sm font-medium text-foreground">Fluid Staking</span>
    </motion.div>
  )
}

function BottomLeftCard() {
  return (
    <motion.div
      data-slot="hero-stat"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="absolute bottom-28 end-4 start-auto flex w-fit min-w-[150px] flex-col gap-2 rounded-[1.5rem] border border-white/40 bg-card/40 p-4 backdrop-blur-xl md:bottom-6 md:end-auto md:start-6 lg:bottom-10 lg:min-w-[180px] lg:gap-3 lg:rounded-[2rem] lg:p-5 lg:start-10"
    >
      <div className="flex flex-col">
        <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          5.2K
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs">
          Active Yielders
        </span>
      </div>

      <a
        href="#"
        className="flex w-fit items-center gap-2 self-start rounded-full bg-card py-1.5 pe-5 ps-1.5 transition-colors hover:bg-card/80"
      >
        <span className="flex items-center justify-center rounded-full bg-foreground/10 p-1">
          <ArrowUpRight className="size-4 text-foreground rtl:-scale-x-100" />
        </span>
        <span className="text-sm font-medium text-foreground">Join Discord</span>
      </a>
    </motion.div>
  )
}

function BottomRightCorner() {
  return (
    <motion.div
      data-slot="hero-docs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="absolute bottom-0 end-0 flex items-center gap-3 rounded-ss-[1.5rem] bg-card p-3 ps-8 pt-5 sm:gap-4 sm:rounded-ss-[2rem] sm:p-4 sm:ps-10 sm:pt-6 md:gap-6 md:rounded-ss-[3.5rem] md:p-6 md:ps-14 md:pt-8"
    >
      <div className="pointer-events-none absolute -top-[1.5rem] end-0 size-[1.5rem] text-card sm:-top-[2rem] sm:size-[2rem] md:-top-[3.5rem] md:size-[3.5rem]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rtl:-scale-x-100"
        >
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="currentColor" />
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-0 -start-[1.5rem] size-[1.5rem] text-card sm:-start-[2rem] sm:size-[2rem] md:-start-[3.5rem] md:size-[3.5rem]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rtl:-scale-x-100"
        >
          <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="currentColor" />
        </svg>
      </div>

      <div className="flex size-10 items-center justify-center rounded-full border border-border bg-foreground/5 md:size-14">
        <ArrowUpRight className="size-5 text-foreground/80 md:size-6 rtl:-scale-x-100" />
      </div>

      <div className="flex flex-col">
        <span className="text-base font-medium text-foreground md:text-xl">
          Documentation
        </span>
        <a
          href="#"
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="text-xs font-normal md:text-[15px]">Library</span>
          <ChevronRight className="size-3 md:size-4 rtl:rotate-180" />
        </a>
      </div>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section
      id="home"
      data-slot="hero"
      className="flex h-svh min-h-[620px] w-full items-center justify-center bg-background p-3 md:p-5"
    >
      <div className="group relative flex h-full w-full max-w-[1536px] flex-col items-center overflow-hidden rounded-[1.5rem] md:rounded-[3rem]">
        <div
          aria-hidden
          style={{ backgroundImage: `url("${IMAGE_URL}")` }}
          className="absolute inset-0 z-0 bg-cover bg-no-repeat [background-position:65%] lg:[background-position:center]"
        />
        <div
          aria-hidden
          className="absolute inset-0 z-[1] bg-gradient-to-b from-background/75 via-background/15 to-background/45"
        />

        <div className="relative z-10 flex size-full flex-col items-center">
          <Navbar />

          <div className="flex w-full max-w-4xl flex-col items-center px-6 pt-8 text-center md:pt-12">
            <HeroBadge />

            <motion.h1
              data-slot="hero-title"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="font-display mb-4 text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-[80px]"
            >
              Fluid Asset Streams
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg"
            >
              Access Smart Vaults, stake RIVR and NFTs, and turn rigid holdings
              into liquid cash, instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3"
            >
              <PillButton label="Open App" />
              <PillButton label="Read Docs" variant="outline" />
            </motion.div>
          </div>

          <BottomLeftCard />
          <BottomRightCorner />
        </div>
      </div>
    </section>
  )
}
