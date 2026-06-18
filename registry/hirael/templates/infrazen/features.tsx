"use client";

import {
  Activity,
  Gauge,
  GitBranch,
  Globe,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { reveal } from "./primitives";

type Feature = {
  icon: LucideIcon;
  title: string;
  problem: string;
  solution: string;
  outcome: string;
  featured?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: Globe,
    title: "Global edge network",
    problem: "Users far from your origin wait on every single request.",
    solution:
      "Run in 38 regions and serve each request from the nearest healthy node, with automatic failover.",
    outcome: "p50 latency under 40ms worldwide",
    featured: true,
  },
  {
    icon: Gauge,
    title: "Autoscaling",
    problem: "Traffic spikes either page you at 3am or fall over.",
    solution: "Capacity tracks demand automatically, up and back down.",
    outcome: "Zero manual scaling events",
  },
  {
    icon: GitBranch,
    title: "Zero-downtime deploys",
    problem: "Releases mean maintenance windows and held breath.",
    solution: "Atomic rollouts with instant, one-click rollback.",
    outcome: "Ship 40 times a day, safely",
  },
  {
    icon: Activity,
    title: "Observability built in",
    problem: "Metrics, logs, and traces live in three other tools.",
    solution: "Requests, latency, and errors in one view, per deploy.",
    outcome: "Detect regressions in seconds",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    problem: "TLS, secrets, and isolation are easy to get wrong.",
    solution: "Managed certificates, encrypted secrets, isolated workloads.",
    outcome: "SOC 2 Type II and ISO 27001",
  },
];

// Fixed active cells for the lead card's region grid; deterministic per build.
const ACTIVE_REGIONS = new Set([2, 5, 9, 14, 18, 21, 27, 33, 38, 41]);

function RegionDots() {
  return (
    <div className="mt-6 grid grid-cols-12 gap-1.5" aria-hidden>
      {Array.from({ length: 48 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full",
            ACTIVE_REGIONS.has(i) ? "bg-[var(--zen)]" : "bg-white/10",
          )}
        />
      ))}
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const { icon: Icon, title, problem, solution, outcome, featured } = feature;
  return (
    <div
      className={cn(
        "group flex flex-col bg-card p-7 transition-colors hover:bg-[var(--surface-2)]",
        featured && "sm:col-span-2 lg:col-span-2",
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-[var(--zen)] transition-colors group-hover:border-[var(--zen-line)]">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-medium text-foreground">{title}</h3>

      <div className="mt-3 space-y-1.5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {problem}
        </p>
        <p className="border-s-2 border-[var(--zen-line)] ps-3 text-sm leading-relaxed text-foreground">
          {solution}
        </p>
      </div>

      {featured ? <RegionDots /> : null}

      <p className="zen-mono mt-6 inline-flex w-fit items-center gap-1.5 border-t border-border pt-4 text-xs text-[var(--zen)]">
        <span className="size-1 rounded-full bg-[var(--zen)]" />
        {outcome}
      </p>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="features"
      data-slot="features"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <motion.div {...reveal()} className="max-w-2xl">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need to run in production. Nothing you don&apos;t.
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Each capability removes a class of work you would otherwise own:
          stated as the problem it kills, what we do about it, and the result
          you can measure.
        </p>
      </motion.div>

      <motion.div
        {...reveal({ y: 24, delay: 0.05 })}
        className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </motion.div>
    </section>
  );
}
