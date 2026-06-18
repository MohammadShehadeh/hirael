"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { reveal } from "./primitives";

const FAQS = [
  {
    tag: "Implementation",
    q: "How long does it take to deploy something?",
    a: "Connect a repository and your first deploy is live in under five minutes. There is no infrastructure to provision and nothing to configure to get going.",
  },
  {
    tag: "Technical",
    q: "What runtimes and frameworks do you support?",
    a: "Any container image, plus first-class support for Next.js, Remix, Astro, SvelteKit, and Nuxt. Bring a Dockerfile or let us detect your framework automatically.",
  },
  {
    tag: "Security",
    q: "How do you handle security and compliance?",
    a: "Workloads are isolated, secrets are encrypted at rest, and TLS is automatic. We are SOC 2 Type II and ISO 27001 certified, with audit logs on every paid plan.",
  },
  {
    tag: "Reliability",
    q: "What is your uptime, really?",
    a: "We have measured 99.99% over the past year. Traffic fails over between regions automatically, and Pro and Enterprise plans carry a contractual SLA.",
  },
  {
    tag: "Pricing",
    q: "Will my bill surprise me?",
    a: "No egress fees and no per-seat add-ons. Usage past your plan is metered per-second and shown live in the dashboard, so there is nothing waiting for you at month end.",
  },
  {
    tag: "Implementation",
    q: "Can I migrate from another platform?",
    a: "Yes. Most teams move a first service in an afternoon using our CLI, Terraform provider, and step-by-step migration guides.",
  },
  {
    tag: "Security",
    q: "Who can access our deployments?",
    a: "Role-based access, scoped API keys, and SSO or SAML on Enterprise. Every action is recorded in an exportable audit log.",
  },
];

function Item({
  tag,
  q,
  a,
  open,
  onToggle,
}: {
  tag: string;
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 py-5 text-start"
      >
        <span className="flex flex-col gap-1.5">
          <span className="zen-mono text-[10px] uppercase tracking-[0.2em] text-[var(--zen)]">
            {tag}
          </span>
          <span className="text-base font-medium text-foreground">{q}</span>
        </span>
        <Plus
          className={cn(
            "mt-0.5 size-5 shrink-0 text-[var(--zen)] transition-transform duration-300",
            open && "rotate-45",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open
            ? "grid-rows-[1fr] pb-5 opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = React.useState<number>(0);

  return (
    <section id="faq" data-slot="faq" className="px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div {...reveal()}>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Answers before you ask.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            The questions teams raise in security review, in procurement, and
            right before they migrate.
          </p>
        </motion.div>

        <motion.div {...reveal({ y: 24, delay: 0.05 })}>
          {FAQS.map((faq, i) => (
            <Item
              key={faq.q}
              tag={faq.tag}
              q={faq.q}
              a={faq.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
