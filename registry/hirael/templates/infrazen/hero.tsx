"use client";

import { motion } from "framer-motion";

import { Button, reveal, StatusPill } from "./primitives";

const METRICS = [
  { value: "12,840", label: "active nodes" },
  { value: "38", label: "regions" },
  { value: "99.98%", label: "network uptime" },
  { value: "$0.011", label: "per vCPU-hour" },
];

export function Hero() {
  return (
    <section
      id="top"
      data-slot="hero"
      className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-40"
    >
      <div
        aria-hidden
        className="zen-grid zen-grid-fade pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="zen-glow pointer-events-none absolute inset-x-0 top-0 h-[480px]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div {...reveal({ y: 12 })}>
          <StatusPill />
        </motion.div>

        <motion.h1
          {...reveal({ y: 18, delay: 0.05 })}
          className="mt-6 text-balance font-semibold leading-[1.05] tracking-tight text-foreground"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4.25rem)" }}
        >
          Cloud infrastructure, run by a network. Not a company.
        </motion.h1>

        <motion.p
          {...reveal({ y: 18, delay: 0.12 })}
          className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Infrazen is a permissionless protocol for compute, storage, and
          bandwidth. Independent operators run the hardware, smart contracts
          handle settlement, and your apps get cloud-grade infrastructure with
          no single point of control.
        </motion.p>

        <motion.div
          {...reveal({ y: 18, delay: 0.18 })}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button href="#pricing" withArrow>
            Start building
          </Button>
          <Button href="#" variant="ghost">
            Read the docs
          </Button>
        </motion.div>

        <motion.p
          {...reveal({ y: 12, delay: 0.24 })}
          className="zen-mono mt-4 text-xs text-muted-foreground"
        >
          Free to start. No credit card. Settle on-chain when you scale.
        </motion.p>
      </div>

      <motion.dl
        {...reveal({ y: 24, delay: 0.3 })}
        className="relative mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4"
      >
        {METRICS.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col items-center bg-card px-4 py-6 text-center"
          >
            <dt className="zen-mono text-2xl font-semibold text-foreground sm:text-3xl">
              {metric.value}
            </dt>
            <dd className="mt-1 text-xs text-muted-foreground">
              {metric.label}
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
