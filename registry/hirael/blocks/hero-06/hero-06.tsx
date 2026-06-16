"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Boxes,
  Code2,
  Database,
  Layers,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/hirael/ui/tooltip";

const STATS = [
  { value: "7+", label: "Years building" },
  { value: "50+", label: "Projects shipped" },
  { value: "∞", label: "Cups of coffee" },
] as const;

const STACK = [
  { name: "Framework", icon: Layers },
  { name: "Components", icon: Boxes },
  { name: "Types", icon: Code2 },
  { name: "Data", icon: Database },
] as const;

function GeometricAccent() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay: number) =>
    reduceMotion
      ? { initial: false as const }
      : {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 1, delay },
        };

  return (
    <div
      data-slot="hero-accent"
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        {...reveal(0.4)}
        className="absolute -top-20 start-[-5rem] size-80"
      >
        <div className="absolute inset-0 rotate-45 border border-primary/10" />
        <div className="absolute inset-4 rotate-45 border border-primary/[0.08]" />
        <div className="absolute inset-8 rotate-45 border border-primary/5" />
      </motion.div>

      <motion.div
        {...reveal(0.6)}
        className="absolute -bottom-20 end-[-5rem] size-80"
      >
        <div className="absolute inset-0 rotate-12 border border-primary/10" />
        <div className="absolute inset-4 rotate-12 border border-primary/[0.08]" />
        <div className="absolute inset-8 rotate-12 border border-primary/5" />
      </motion.div>
    </div>
  );
}

export default function Hero06() {
  return (
    <section
      data-slot="hero"
      className="relative isolate overflow-hidden bg-background px-6 py-20 text-center text-foreground md:px-10 md:py-28"
    >
      <GeometricAccent />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6">
        <Badge
          variant="secondary"
          className="gap-2 rounded-full font-mono text-[11px] font-normal"
          asChild
        >
          <a href="#">
            <span className="relative flex size-2">
              <span
                className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
                style={{ background: "var(--accent-cool)" }}
              />
              <span
                className="relative inline-flex size-2 rounded-full"
                style={{ background: "var(--accent-cool)" }}
              />
            </span>
            Available for work
          </a>
        </Badge>

        <div className="space-y-4">
          <h1 className="mx-auto max-w-3xl text-balance font-serif text-4xl font-medium leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
            Frontend engineer where{" "}
            <span className="italic text-primary">craft meets code</span> at
            scale.
          </h1>
          <p className="mx-auto max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Engineering rigor, a designer’s eye, and an unhealthy attention to
            the details.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-10">
          {STATS.map((stat, index) => (
            <React.Fragment key={stat.label}>
              {index > 0 ? (
                <div
                  aria-hidden
                  className="h-12 w-px shrink-0 bg-gradient-to-b from-transparent via-border to-transparent"
                />
              ) : null}
              <div data-slot="hero-stat" className="text-center">
                <span className="block font-serif text-2xl font-semibold text-primary md:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="group w-full rounded-full sm:w-auto"
          >
            <a href="#">
              View experience
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group w-full rounded-full sm:w-auto"
          >
            <a href="#">
              View projects
              <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
            </a>
          </Button>
        </div>

        <div className="mt-6 w-full max-w-2xl space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Core stack & expertise
          </p>
          <div className="flex items-center gap-4">
            <div
              aria-hidden
              className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-border md:block"
            />
            <div className="flex flex-1 flex-wrap items-center justify-center gap-5 md:flex-none">
              {STACK.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger
                    aria-label={item.name}
                    className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <item.icon className="size-6" aria-hidden />
                  </TooltipTrigger>
                  <TooltipContent>{item.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <div
              aria-hidden
              className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-border md:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
