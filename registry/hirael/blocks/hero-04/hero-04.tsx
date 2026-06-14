"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react"

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzzbokvigwjottwixh07lwa1p/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4"

const NAV_ITEMS: { label: string; hasDropdown?: boolean }[] = [
  { label: "Ecosystem" },
  { label: "Economics", hasDropdown: true },
  { label: "Developers" },
  { label: "Governance", hasDropdown: true },
]

function Navbar() {
  return (
    <nav
      data-slot="hero-nav"
      className="relative z-10 flex w-full items-center justify-between px-6 py-6 md:px-10"
    >
      <div className="hidden flex-1 md:block" />

      <ul className="hidden items-center gap-8 text-sm font-normal text-[#2D2D2D] md:flex">
        {NAV_ITEMS.map((item) => (
          <li
            key={item.label}
            className="group flex cursor-pointer items-center gap-1 transition-opacity hover:opacity-70"
          >
            {item.label}
            {item.hasDropdown && (
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            )}
          </li>
        ))}
      </ul>

      <div className="md:hidden">
        <span className="text-xl tracking-tighter text-[#1E325A]/90">RIVR</span>
      </div>

      <div className="flex flex-1 justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2 rounded-full bg-[#1E325A]/80 py-1.5 pe-4 ps-2 text-white transition-colors hover:bg-[#1E325A] md:gap-3 md:py-2 md:pe-6"
        >
          <span className="flex items-center justify-center rounded-full bg-white/20 p-1 md:p-1.5">
            <ArrowUpRight className="size-4 text-white md:size-5 rtl:-scale-x-100" />
          </span>
          <span className="text-xs font-normal md:text-sm">Book Demo</span>
        </motion.button>
      </div>
    </nav>
  )
}

function HeroBadge({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      data-slot="hero-badge"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/60 px-4 py-2 backdrop-blur-md"
    >
      <Sparkles className="size-4 text-[#1E325A]/80" />
      <span className="text-[14px] font-normal text-[#1E325A]/90">
        Fluid Staking
      </span>
    </motion.div>
  )
}

function BottomLeftCard({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      data-slot="hero-stat"
      initial={reduce ? false : { x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute bottom-28 end-4 start-auto flex w-fit min-w-[140px] flex-col gap-2 rounded-[1.2rem] bg-white/30 p-3 backdrop-blur-xl md:bottom-6 md:end-auto md:min-w-[150px] md:start-6 md:rounded-[1.5rem] md:p-4 lg:bottom-10 lg:min-w-[180px] lg:gap-3 lg:rounded-[2.2rem] lg:p-5 lg:start-10"
    >
      <div className="flex flex-col">
        <span className="text-2xl font-normal tracking-tight text-[#1E325A]/90 md:text-3xl">
          5.2K
        </span>
        <span className="text-[10px] font-normal uppercase tracking-wider text-[#1E325A]/60 md:text-[12px]">
          Active Yielders
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group flex items-center gap-2 self-start rounded-full bg-white py-1.5 pe-5 ps-1.5 transition-colors hover:bg-white/90"
      >
        <span className="flex items-center justify-center rounded-full bg-[#1E325A]/10 p-1">
          <ArrowUpRight className="size-4 text-[#1E325A]/90 rtl:-scale-x-100" />
        </span>
        <span className="text-[14px] font-normal text-[#1E325A]/90">
          Join Discord
        </span>
      </motion.button>
    </motion.div>
  )
}

function BottomRightCorner({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      data-slot="hero-docs"
      initial={reduce ? false : { y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute bottom-0 end-0 flex items-center gap-3 rounded-ss-[1.5rem] bg-background p-3 ps-8 pt-5 sm:gap-4 sm:rounded-ss-[2rem] sm:p-4 sm:ps-10 sm:pt-6 md:gap-6 md:rounded-ss-[3.5rem] md:p-6 md:ps-14 md:pt-8"
    >
      <div className="pointer-events-none absolute -top-[1.5rem] end-0 size-[1.5rem] text-background sm:-top-[2rem] sm:size-[2rem] md:-top-[3.5rem] md:size-[3.5rem]">
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

      <div className="pointer-events-none absolute bottom-0 -start-[1.5rem] size-[1.5rem] text-background sm:-start-[2rem] sm:size-[2rem] md:-start-[3.5rem] md:size-[3.5rem]">
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

      <div className="flex size-10 items-center justify-center rounded-full border border-border bg-foreground/[0.05] md:size-14">
        <ArrowUpRight className="size-5 text-foreground/80 md:size-6 rtl:-scale-x-100" />
      </div>

      <div className="flex flex-col">
        <span className="text-[16px] font-normal text-foreground md:text-[20px]">
          Documentation
        </span>
        <div className="flex cursor-pointer items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
          <span className="text-[12px] font-normal md:text-[15px]">Library</span>
          <ChevronRight className="size-3 md:size-4 rtl:rotate-180" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero04() {
  const reduce = useReducedMotion()

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-3 md:p-5">
      <section
        data-slot="hero"
        className="group relative flex h-full w-full max-w-[1536px] flex-col items-center overflow-hidden rounded-[1.5rem] bg-white/10 md:rounded-[3rem]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          src={VIDEO_URL}
          className="absolute inset-0 z-0 size-full object-cover object-[65%] lg:object-center"
        />

        <div className="relative z-10 flex size-full flex-col items-center">
          <Navbar />

          <div className="flex w-full max-w-4xl flex-col items-center px-6 pt-8 text-center">
            <HeroBadge reduce={reduce} />

            <motion.h1
              data-slot="hero-title"
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-2 text-4xl font-normal leading-[1.05] tracking-tight text-[#5E6470] sm:text-5xl md:text-6xl lg:text-[80px]"
            >
              Fluid Asset Streams
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-xl text-sm font-normal leading-relaxed text-[#5E6470] opacity-80 sm:text-base md:text-lg"
            >
              Access Smart Vaults, stake RIVR, NFTs, transform rigid holdings
              into liquid cash instantly.
            </motion.p>
          </div>

          <BottomLeftCard reduce={reduce} />
          <BottomRightCorner reduce={reduce} />
        </div>
      </section>
    </div>
  )
}
