"use client";

import { motion } from "framer-motion";

import { reveal, SectionLabel } from "./primitives";

type Group = { label: string; items: string[] };

const GROUPS: Group[] = [
  {
    label: "Settlement layers",
    items: ["Ethereum", "Base", "Arbitrum", "Optimism", "Solana"],
  },
  {
    label: "DevOps tooling",
    items: ["Terraform", "Docker", "Kubernetes", "Pulumi", "GitHub Actions"],
  },
  {
    label: "Data and wallets",
    items: ["Postgres", "Redis", "IPFS", "WalletConnect", "Prometheus"],
  },
];

function Tile({ name }: { name: string }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-[var(--zen-line)]">
      <span className="zen-mono flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium text-[var(--zen)]">
        {name.slice(0, 2)}
      </span>
      <span className="truncate text-sm font-medium text-foreground">
        {name}
      </span>
    </div>
  );
}

export function Integrations() {
  return (
    <section
      id="integrations"
      data-slot="integrations"
      className="border-t border-border px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal()} className="max-w-2xl">
          <SectionLabel>Ecosystem</SectionLabel>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Plugs into the stack you already run.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Settle on the chain you prefer, deploy with the tools you know, and
            connect the data your app depends on. No rewrite required.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-col gap-10">
          {GROUPS.map((group, i) => (
            <motion.div
              key={group.label}
              {...reveal({ y: 20, delay: i * 0.05 })}
            >
              <p className="zen-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {group.label}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {group.items.map((name) => (
                  <Tile key={name} name={name} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
