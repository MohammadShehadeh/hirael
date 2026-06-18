"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { Button, reveal, SectionLabel } from "./primitives";

type Plan = {
  name: string;
  price: string;
  unit: string;
  caption: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Builder",
    price: "$0",
    unit: "+ usage",
    caption: "For prototypes and weekend builds.",
    features: [
      "Pay-as-you-go compute and storage",
      "On-chain usage receipts",
      "Community support",
      "1 project",
    ],
    cta: "Start free",
  },
  {
    name: "Scale",
    price: "$49",
    unit: "/ mo + usage",
    caption: "For production workloads that grow.",
    features: [
      "Autoscaling across 38 regions",
      "Programmable SLAs with auto refunds",
      "Priority support, 99.98% uptime",
      "Unlimited projects and members",
    ],
    cta: "Start building",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "annual",
    caption: "For teams running at real scale.",
    features: [
      "Dedicated operator pools",
      "Custom SLAs and settlement terms",
      "SSO, audit log exports",
      "Solutions engineering",
    ],
    cta: "Talk to us",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-7",
        plan.featured
          ? "zen-featured border-[var(--zen-line)]"
          : "border-border",
      )}
    >
      {plan.featured ? (
        <span className="zen-mono absolute -top-3 start-7 rounded-full bg-[var(--zen)] px-3 py-1 text-xs font-medium text-primary-foreground">
          Most popular
        </span>
      ) : null}

      <h3 className="text-base font-medium text-foreground">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.caption}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="zen-mono text-4xl font-semibold text-foreground">
          {plan.price}
        </span>
        <span className="zen-mono text-sm text-muted-foreground">
          {plan.unit}
        </span>
      </div>

      <Button
        href="#"
        variant={plan.featured ? "primary" : "ghost"}
        className="mt-6 w-full"
      >
        {plan.cta}
      </Button>

      <ul className="mt-7 flex flex-col gap-3 border-t border-border pt-7">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check
              className="mt-0.5 size-4 shrink-0 text-[var(--zen)]"
              strokeWidth={2.5}
            />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      data-slot="pricing"
      className="border-t border-border px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
          <SectionLabel className="justify-center">Pricing</SectionLabel>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Priced like a meter, not a mystery.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Start free and pay for what you use. Every charge is metered
            per-second and settled on-chain, so the invoice always matches the
            usage.
          </p>
        </motion.div>

        <motion.div
          {...reveal({ y: 24, delay: 0.05 })}
          className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </motion.div>

        <motion.p
          {...reveal({ y: 12, delay: 0.1 })}
          className="zen-mono mt-8 text-center text-xs text-muted-foreground"
        >
          $0.011 / vCPU-hour · $0.018 / GB-month storage · $0 egress · cancel
          anytime
        </motion.p>
      </div>
    </section>
  );
}
