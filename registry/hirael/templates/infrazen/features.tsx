"use client";

import {
  Cpu,
  Database,
  Gauge,
  Globe,
  ShieldCheck,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import { reveal, SectionLabel } from "./primitives";

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
  spec: string;
};

const FEATURES: Feature[] = [
  {
    icon: Cpu,
    title: "Permissionless compute",
    body: "Run containers and VMs across thousands of independent operators. No accounts to approve, no region waitlists.",
    spec: "OCI images · autoscaling · spot + on-demand",
  },
  {
    icon: ShieldCheck,
    title: "Verifiable settlement",
    body: "Every unit of usage is metered and settled on-chain, so your bill is auditable from request to receipt.",
    spec: "on-chain receipts · per-second metering",
  },
  {
    icon: Globe,
    title: "Global edge network",
    body: "Requests route to the healthy operator closest to each user, and reroute the moment one degrades.",
    spec: "38 regions · p50 < 40ms",
  },
  {
    icon: Gauge,
    title: "Programmable SLAs",
    body: "Encode uptime and latency guarantees as contracts that pay out automatically when they are missed.",
    spec: "smart-contract SLAs · auto refunds",
  },
  {
    icon: Database,
    title: "Object and block storage",
    body: "Durable, replicated storage addressed by content hash, with an API your existing tools already speak.",
    spec: "11 nines durability · S3-compatible",
  },
  {
    icon: Terminal,
    title: "Open SDKs and CLI",
    body: "Ship with the tools you already use. A Terraform provider, typed SDKs, and a one-command deploy.",
    spec: "Terraform · TypeScript · Go · CLI",
  },
];

export function Features() {
  return (
    <section
      id="features"
      data-slot="features"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <motion.div {...reveal()} className="max-w-2xl">
        <SectionLabel>Capabilities</SectionLabel>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Infrastructure primitives that do real work.
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Each piece is built for production: precise enough for the engineers
          who run it, clear enough for whoever signs off on it.
        </p>
      </motion.div>

      <motion.div
        {...reveal({ y: 24, delay: 0.05 })}
        className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map(({ icon: Icon, title, body, spec }) => (
          <div
            key={title}
            className="group flex flex-col bg-card p-7 transition-colors hover:bg-[var(--surface-2)]"
          >
            <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-[var(--zen)] transition-colors group-hover:border-[var(--zen-line)]">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-medium text-foreground">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {body}
            </p>
            <p className="zen-mono mt-5 border-t border-border pt-4 text-xs text-muted-foreground/80">
              {spec}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
