"use client";

import * as React from "react";
import { GitBranch } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/registry/hirael/ui/button";

export default function Cta06() {
  return (
    <section data-slot="cta" className="bg-background px-4 py-12 md:px-6">
      <div className="mx-auto w-full max-w-6xl rounded-xl border border-border bg-muted/20 p-2">
        <div className="relative min-h-72 w-full overflow-hidden rounded-lg border border-border bg-card sm:h-80">
          <div
            aria-hidden
            data-slot="cta-surface"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(120% 120% at 0% 0%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 55%), radial-gradient(100% 100% at 100% 100%, color-mix(in oklch, var(--foreground) 8%, transparent), transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, color-mix(in oklch, var(--foreground) 6%, transparent) 0 1px, transparent 1px 14px)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col items-start justify-between px-4 pt-6 pb-4 sm:justify-center md:px-8">
            <div className="flex flex-col items-start">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <span className="size-1 rounded-full bg-foreground" />
                Get started
              </span>
              <h2 className="mt-3 max-w-lg text-balance text-start font-serif text-3xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Ship faster without{" "}
                <span className="italic">fighting your tools.</span>
              </h2>
              <p className="mt-3 max-w-xl text-start text-sm text-muted-foreground sm:text-base">
                Connect your account, get instant insights, and start building
                in minutes.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              className="mt-6 flex w-full flex-wrap items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="w-full rounded-md px-6 sm:w-auto"
              >
                <a href="#">
                  <GitBranch className="size-4" />
                  Get started
                </a>
              </Button>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Free to try
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
