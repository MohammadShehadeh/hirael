"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { reveal, SectionLabel } from "./primitives";

const CENTRALIZED = [
  "Lock-in by design: your stack only runs on their hardware",
  "Opaque egress fees you find on the invoice",
  "One provider outage takes your app down with it",
  "Accounts suspended with little warning or recourse",
  "You rent capacity entirely on their terms",
];

const INFRAZEN = [
  "Portable workloads that run across any operator",
  "Transparent on-chain pricing, zero egress fees",
  "No single operator can take your service offline",
  "Permissionless access that can't be revoked",
  "Guarantees encoded in contracts you control",
];

const STATS = [
  { value: "$0", label: "egress fees" },
  { value: "40%", label: "lower data-transfer cost" },
  { value: "100%", label: "portable workloads" },
];

function Column({
  heading,
  caption,
  items,
  positive,
}: {
  heading: string;
  caption: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col p-7 sm:p-9",
        positive ? "bg-[var(--surface-2)]" : "bg-card",
      )}
    >
      {positive ? (
        <span aria-hidden className="mb-6 h-px w-full bg-[var(--zen-line)]" />
      ) : (
        <span aria-hidden className="mb-6 h-px w-full bg-border" />
      )}
      <h3
        className={cn(
          "text-lg font-medium",
          positive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {heading}
      </h3>
      <p className="zen-mono mt-1 text-xs text-muted-foreground">{caption}</p>
      <ul className="mt-6 flex flex-col gap-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                positive
                  ? "bg-[var(--zen-soft)] text-[var(--zen)]"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              {positive ? (
                <Check className="size-3.5" strokeWidth={2.5} />
              ) : (
                <X className="size-3.5" strokeWidth={2.5} />
              )}
            </span>
            <span
              className={positive ? "text-foreground" : "text-muted-foreground"}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Advantage() {
  return (
    <section
      id="why"
      data-slot="advantage"
      className="border-t border-border px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal()} className="max-w-2xl">
          <SectionLabel>Why Infrazen</SectionLabel>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The cloud you don&apos;t have to trust.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Centralized providers ask you to bet your product on their goodwill.
            Infrazen replaces that trust with code, markets, and a network no
            one party controls.
          </p>
        </motion.div>

        <motion.div
          {...reveal({ y: 24, delay: 0.05 })}
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2"
        >
          <Column
            heading="Centralized cloud"
            caption="the status quo"
            items={CENTRALIZED}
          />
          <Column
            heading="Infrazen"
            caption="the protocol"
            items={INFRAZEN}
            positive
          />
        </motion.div>

        <motion.dl
          {...reveal({ y: 20, delay: 0.1 })}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card px-6 py-5"
            >
              <dt className="zen-mono text-3xl font-semibold text-[var(--zen)]">
                {stat.value}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
