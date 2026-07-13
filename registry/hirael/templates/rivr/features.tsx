"use client";

import { motion } from "motion/react";
import { Activity, ArrowUpRight, Layers, ShieldCheck } from "lucide-react";

import { fadeUp, PillButton } from "./primitives";

const CARD_BASE =
  "group relative overflow-hidden rounded-[1.5rem] bg-card p-7 transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:rounded-[2rem]";

const ICON_CHIP =
  "flex size-12 items-center justify-center rounded-2xl bg-secondary text-foreground";

export function Features() {
  return (
    <section
      data-slot="features"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-12"
    >
      <motion.div
        {...fadeUp()}
        className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-12"
      >
        <h2 className="font-display max-w-2xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
          Architected for high-performance DeFi
        </h2>
        <PillButton
          label="Start Staking"
          variant="outline"
          className="shrink-0"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-5">
        <motion.div
          {...fadeUp(0.05)}
          className={`${CARD_BASE} flex min-h-[28rem] flex-col justify-between md:row-span-2 md:p-9`}
        >
          <Layers className="pointer-events-none absolute -bottom-10 -end-10 size-72 text-foreground opacity-[0.02] transition-transform duration-500 group-hover:scale-110" />
          <span className={`relative ${ICON_CHIP}`}>
            <Layers className="size-6" />
          </span>
          <div className="relative">
            <h3 className="text-2xl font-semibold leading-snug text-foreground md:text-3xl">
              Unlock the liquidity of your staked assets
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Borrow against staked positions and NFTs without unwinding them.
              Your collateral keeps earning while the cash is in your hands.
            </p>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className={`${CARD_BASE} flex min-h-[13rem] flex-col justify-between md:col-span-2 md:p-9`}
        >
          <Activity className="pointer-events-none absolute -bottom-8 -end-6 size-60 text-foreground opacity-[0.02] transition-transform duration-500 group-hover:scale-110" />
          <span className={`relative ${ICON_CHIP}`}>
            <Activity className="size-6" />
          </span>
          <div className="relative">
            <h3 className="text-xl font-semibold text-foreground md:text-2xl">
              Real-time Yields
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Rewards accrue every block and stay claimable. Watch positions
              compound live, with no lockups or waiting periods.
            </p>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.15)}
          className={`${CARD_BASE} flex flex-col justify-between`}
        >
          <span className={ICON_CHIP}>
            <ShieldCheck className="size-6" />
          </span>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-foreground">
              Bank-grade
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Smart contracts audited by leading firms, with on-chain proofs you
              can verify yourself.
            </p>
            <a
              href="#"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              View Audits
              <ArrowUpRight className="size-4 rtl:-scale-x-100" />
            </a>
          </div>
        </motion.div>

        <motion.a
          href="#"
          {...fadeUp(0.2)}
          className={`${CARD_BASE} flex flex-col items-center justify-center gap-5 text-center`}
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-foreground transition-transform duration-300 group-hover:scale-110">
            <ArrowUpRight className="size-7 rtl:-scale-x-100" />
          </span>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Cross-Chain
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Move liquidity across networks.
            </p>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
