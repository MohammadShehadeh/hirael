"use client";

import * as React from "react";
import {
  CloudLightning,
  FilePenLine,
  GitMerge,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: readonly string[];
}

const SERVICES: readonly Service[] = [
  {
    icon: Lightbulb,
    title: "Design system audit",
    description:
      "A read of what you have today: tokens, components, and the gaps between Figma and code.",
    features: [
      "Token inventory",
      "Component coverage map",
      "Prioritized fixes",
    ],
  },
  {
    icon: FilePenLine,
    title: "Component library build",
    description:
      "Accessible, typed components built on shadcn conventions and installed straight into your repo.",
    features: ["Compound APIs", "Light and dark themes", "RTL out of the box"],
  },
  {
    icon: GitMerge,
    title: "Migration support",
    description:
      "Move an existing UI kit onto tokens and primitives without a big-bang rewrite.",
    features: [
      "Incremental adoption",
      "Codemods where they help",
      "Parity checks",
    ],
  },
  {
    icon: CloudLightning,
    title: "Performance pass",
    description:
      "Trim bundle size and render cost across the pages that matter most to your users.",
    features: ["Bundle analysis", "Render profiling", "Lazy-load plan"],
  },
  {
    icon: ShieldCheck,
    title: "Accessibility review",
    description:
      "Keyboard, screen reader, and contrast checks with concrete fixes, not just a report.",
    features: ["WCAG 2.2 AA", "Focus order fixes", "Screen reader scripts"],
  },
  {
    icon: TrendingUp,
    title: "Team enablement",
    description:
      "Docs, workshops, and review habits so the system keeps improving after we leave.",
    features: ["Contribution guide", "Pairing sessions", "Review checklist"],
  },
];

const HEADLINE = "Services that ship with your product";

const glowStyle =
  "pointer-events-none absolute inset-0 motion-safe:animate-pulse";

const Title = () => {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(" ");
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="feature-title"
      className="font-serif text-4xl font-medium leading-[1.04] tracking-tight text-balance sm:text-5xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn(
            "inline-block",
            i < half ? "text-muted-foreground" : "text-foreground",
          )}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 + i * 0.08 }}
        >
          {word}
          {i < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </h2>
  );
};

const Feature04 = () => {
  const reduce = useReducedMotion();

  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div
          data-slot="feature-header"
          className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Badge
              variant="outline"
              className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
            >
              Services
            </Badge>
          </motion.div>
          <Title />
          <motion.p
            data-slot="feature-description"
            className="max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          >
            Pick the engagement that fits. Each one ends with source you own and
            a team that knows how to extend it.
          </motion.p>
        </div>

        <div
          data-slot="feature-grid"
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                data-slot="feature-card"
                className="relative overflow-hidden rounded-lg border border-border bg-card p-5"
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.12 }}
              >
                <div
                  aria-hidden
                  className={cn(
                    glowStyle,
                    "bg-[radial-gradient(260px_220px_at_20%_0%,var(--warm-glow),transparent_50%)]",
                  )}
                />
                <div
                  aria-hidden
                  className={cn(
                    glowStyle,
                    "bg-[radial-gradient(220px_200px_at_90%_20%,var(--warm-glow),transparent_50%)]",
                  )}
                />
                <div
                  data-slot="feature-card-icon"
                  className="relative mb-4 grid place-items-center"
                >
                  <Icon
                    strokeWidth={1}
                    className="size-14 text-foreground/90"
                  />
                </div>
                <div className="relative flex flex-col gap-1.5">
                  <h3 className="font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm text-pretty text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-1 list-disc ps-4 text-sm text-muted-foreground">
                    {service.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Feature04;
