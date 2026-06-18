"use client";

import { motion } from "framer-motion";

import { reveal } from "./primitives";

const TEAMS = [
  "Helios",
  "Ledgerworks",
  "Northwind",
  "Arclayer",
  "Voltpath",
  "Meridian",
];

export function Trusted() {
  return (
    <section
      data-slot="trusted"
      className="border-y border-border px-4 py-10 sm:px-6"
    >
      <motion.div
        {...reveal({ y: 12 })}
        className="mx-auto flex max-w-5xl flex-col items-center gap-6"
      >
        <p className="zen-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Powering infrastructure for onchain teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {TEAMS.map((team) => (
            <span
              key={team}
              className="text-lg font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {team}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
