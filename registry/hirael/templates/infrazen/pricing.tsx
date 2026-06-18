"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { Button, reveal } from "./primitives";

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
    name: "Hobby",
    price: "$0",
    unit: "forever",
    caption: "For side projects and prototypes.",
    features: [
      "1 region, automatic HTTPS",
      "100 GB bandwidth included",
      "Preview deploy for every push",
      "Community support",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$20",
    unit: "/ user / month",
    caption: "For teams shipping to production.",
    features: [
      "All 38 regions with autoscaling",
      "Observability and 99.99% SLA",
      "Unlimited preview deploys",
      "Email support, 1 TB bandwidth",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "annual",
    caption: "For scale and compliance needs.",
    features: [
      "Dedicated capacity and custom SLAs",
      "SSO, SAML, and audit logs",
      "Solutions engineering",
      "24/7 support with a named contact",
    ],
    cta: "Contact sales",
  },
];

const COMPARISON: { label: string; values: [string, string, string] }[] = [
  { label: "Regions", values: ["1", "38", "38 + dedicated"] },
  { label: "Bandwidth", values: ["100 GB", "1 TB", "Custom"] },
  { label: "Build minutes", values: ["100 / mo", "6,000 / mo", "Unlimited"] },
  { label: "Team seats", values: ["1", "Unlimited", "Unlimited + SSO"] },
  { label: "Log retention", values: ["24 hours", "30 days", "Custom"] },
  { label: "Uptime SLA", values: ["—", "99.99%", "99.99%+"] },
  { label: "Support", values: ["Community", "Email", "24/7 + TAM"] },
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
          Recommended
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
    <section id="pricing" data-slot="pricing" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal()} className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Pricing that scales with you, not against you.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Start free and upgrade when you ship to production. Usage past your
            plan is billed per-second, with no egress fees and no per-seat
            surprises.
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

        <motion.div
          {...reveal({ y: 24, delay: 0.1 })}
          className="mt-8 overflow-x-auto rounded-2xl border border-border"
        >
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-4 text-start font-medium text-muted-foreground">
                  Compare plans
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan.name}
                    className={cn(
                      "px-5 py-4 text-center font-medium",
                      plan.featured
                        ? "bg-[var(--surface-2)] text-[var(--zen)]"
                        : "text-foreground",
                    )}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border last:border-0"
                >
                  <th
                    scope="row"
                    className="px-5 py-3.5 text-start font-normal text-muted-foreground"
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td
                      key={i}
                      className={cn(
                        "zen-mono px-5 py-3.5 text-center text-xs",
                        i === 1
                          ? "bg-[var(--surface-2)] text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
