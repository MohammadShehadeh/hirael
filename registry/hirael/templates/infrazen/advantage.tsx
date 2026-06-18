"use client";

import { Check, Minus, X } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { reveal } from "./primitives";

type Level = "full" | "partial" | "none";

const COLUMNS = ["Infrazen", "Legacy cloud", "Self-managed"] as const;

const ROWS: { capability: string; cells: [Level, Level, Level] }[] = [
  {
    capability: "Global multi-region deploys",
    cells: ["full", "partial", "none"],
  },
  { capability: "Automatic scaling", cells: ["full", "partial", "none"] },
  { capability: "Zero-downtime releases", cells: ["full", "partial", "none"] },
  { capability: "Observability included", cells: ["full", "partial", "none"] },
  {
    capability: "Managed security and certs",
    cells: ["full", "full", "partial"],
  },
  {
    capability: "Predictable, flat pricing",
    cells: ["full", "none", "partial"],
  },
  { capability: "Platform-managed on-call", cells: ["full", "none", "none"] },
];

const DIFFERENTIATORS = [
  { value: "< 5 min", label: "from git push to live in every region" },
  { value: "1 platform", label: "instead of stitching five separate tools" },
  { value: "$0", label: "surprise egress or per-seat add-on fees" },
];

function Cell({ level }: { level: Level }) {
  if (level === "full")
    return (
      <Check className="mx-auto size-4 text-[var(--zen)]" strokeWidth={2.5} />
    );
  if (level === "partial")
    return <Minus className="mx-auto size-4 text-muted-foreground" />;
  return <X className="mx-auto size-4 text-muted-foreground/40" />;
}

export function Advantage() {
  return (
    <section id="why" data-slot="advantage" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal()} className="max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The same uptime, a fraction of the work.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Teams come to Infrazen from raw cloud and from racks they manage
            themselves. Here is what changes when the platform owns the
            undifferentiated work.
          </p>
        </motion.div>

        <motion.div
          {...reveal({ y: 24, delay: 0.05 })}
          className="mt-12 overflow-x-auto rounded-2xl border border-border"
        >
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-4 text-start font-medium text-muted-foreground">
                  Capability
                </th>
                {COLUMNS.map((col, i) => (
                  <th
                    key={col}
                    className={cn(
                      "px-5 py-4 text-center font-medium",
                      i === 0
                        ? "bg-[var(--surface-2)] text-[var(--zen)]"
                        : "text-muted-foreground",
                    )}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.capability}
                  className="border-b border-border last:border-0"
                >
                  <th
                    scope="row"
                    className="px-5 py-3.5 text-start font-normal text-foreground"
                  >
                    {row.capability}
                  </th>
                  {row.cells.map((level, i) => (
                    <td
                      key={COLUMNS[i]}
                      className={cn(
                        "px-5 py-3.5",
                        i === 0 && "bg-[var(--surface-2)]",
                      )}
                    >
                      <Cell level={level} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.dl
          {...reveal({ y: 20, delay: 0.1 })}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {DIFFERENTIATORS.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-card px-6 py-5"
            >
              <dt className="zen-mono text-2xl font-semibold text-[var(--zen)]">
                {item.value}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {item.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
