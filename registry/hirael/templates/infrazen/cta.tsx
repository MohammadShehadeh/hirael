"use client";

import { motion } from "framer-motion";

import { Button, reveal } from "./primitives";

export function Cta() {
  return (
    <section data-slot="cta" className="px-4 py-24 sm:px-6">
      <motion.div
        {...reveal({ y: 24 })}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12 sm:py-20"
      >
        <div
          aria-hidden
          className="zen-glow pointer-events-none absolute inset-x-0 top-0 h-64"
        />
        <div
          aria-hidden
          className="zen-grid zen-grid-fade pointer-events-none absolute inset-0 opacity-60"
        />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Ship your first deployment in minutes.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg">
            Spin up infrastructure on a network that can&apos;t lock you in,
            price-gouge you, or switch you off.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#" withArrow>
              Start building
            </Button>
            <Button href="#" variant="ghost">
              Read the docs
            </Button>
          </div>
          <p className="zen-mono mt-5 text-xs text-muted-foreground">
            Free tier, no credit card required.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
