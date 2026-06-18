"use client";

import { motion } from "framer-motion";

import { reveal } from "./primitives";

const TEAMS = [
  "Helios",
  "Northwind",
  "Arclayer",
  "Voltpath",
  "Meridian",
  "Cobalt",
  "Lumen",
];

const METRICS = [
  { value: "4,200+", label: "engineering teams" },
  { value: "120B", label: "requests / month" },
  { value: "38", label: "global regions" },
  { value: "99.99%", label: "measured uptime" },
];

export function Trusted() {
  return (
    <section
      data-slot="trusted"
      className="border-y border-border px-4 py-12 sm:px-6"
    >
      <motion.div
        {...reveal({ y: 12 })}
        className="mx-auto flex max-w-6xl flex-col items-center gap-8"
      >
        <p className="zen-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Trusted by engineering teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {TEAMS.map((team) => (
            <span
              key={team}
              className="text-lg font-medium text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {team}
            </span>
          ))}
        </div>

        <dl className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
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
        </dl>
      </motion.div>
    </section>
  );
}
