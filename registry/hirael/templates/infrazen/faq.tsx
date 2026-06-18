"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { reveal, SectionLabel } from "./primitives";

const FAQS = [
  {
    q: "Do I need crypto to use Infrazen?",
    a: "No. Pay with a card and settlement happens under the hood. If you would rather pay on-chain, connect a wallet and you are set.",
  },
  {
    q: "Is it as reliable as AWS or GCP?",
    a: "Workloads run across many operators at once, so no single failure takes you down. SLAs are enforced by contract and pay out automatically if uptime slips.",
  },
  {
    q: "Where does my data live, and can operators see it?",
    a: "Storage is encrypted and addressed by content hash. For sensitive workloads, confidential compute keeps data encrypted even while it runs.",
  },
  {
    q: "How is pricing calculated?",
    a: "Per-second metering for compute and storage, with an on-chain receipt for every charge. No egress fees and no surprise line items.",
  },
  {
    q: "What happens if an operator goes offline?",
    a: "The network reschedules your workload onto a healthy operator automatically, and the missed SLA is refunded without a support ticket.",
  },
  {
    q: "How do I migrate off a centralized cloud?",
    a: "Point your existing tooling at our S3-compatible API and Terraform provider. Most teams move a first service in an afternoon.",
  },
];

function Item({
  q,
  a,
  open,
  onToggle,
}: {
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
        className="flex w-full items-center justify-between gap-4 py-5 text-start"
      >
        <span className="text-base font-medium text-foreground">{q}</span>
        <Plus
          className={cn(
            "size-5 shrink-0 text-[var(--zen)] transition-transform duration-300",
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
    <section
      id="faq"
      data-slot="faq"
      className="border-t border-border px-4 py-24 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div {...reveal()}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Questions worth asking.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            The honest answers to what teams ask before they move real traffic
            onto a decentralized network.
          </p>
        </motion.div>

        <motion.div {...reveal({ y: 24, delay: 0.05 })}>
          {FAQS.map((faq, i) => (
            <Item
              key={faq.q}
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
