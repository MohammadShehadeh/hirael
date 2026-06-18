"use client";

import {
  Activity,
  Boxes,
  ChevronRight,
  Database,
  GitBranch,
  KeyRound,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { CornerTicks, Logo, reveal } from "./primitives";

const SOURCES: { icon: LucideIcon; label: string }[] = [
  { icon: GitBranch, label: "Git repository" },
  { icon: Workflow, label: "CI pipeline" },
  { icon: Boxes, label: "Container image" },
];

const CONNECTED: { icon: LucideIcon; label: string }[] = [
  { icon: Database, label: "Postgres / Redis" },
  { icon: Server, label: "Object storage" },
  { icon: Activity, label: "Observability" },
  { icon: KeyRound, label: "Auth / secrets" },
];

const GROUPS = [
  {
    label: "Frameworks",
    items: ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt"],
  },
  {
    label: "Data",
    items: ["Postgres", "Redis", "MongoDB", "ClickHouse", "Kafka"],
  },
  {
    label: "Tooling",
    items: ["GitHub", "Terraform", "Datadog", "Sentry", "Slack"],
  },
];

function Node({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="zen-mono truncate text-xs text-foreground">{label}</span>
    </div>
  );
}

function Connector() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center text-muted-foreground"
    >
      <span className="zen-diagonal h-px w-10 lg:w-8" />
      <ChevronRight className="size-4 rotate-90 lg:rotate-0 rtl:-scale-x-100" />
    </div>
  );
}

function CodeCard() {
  return (
    <div className="zen-ring overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="zen-mono ms-2 text-[11px] text-muted-foreground">
          terminal
        </span>
      </div>
      <pre className="zen-mono overflow-x-auto p-4 text-xs leading-relaxed">
        <code>
          <span className="text-[var(--zen)]">$</span> infrazen deploy{"\n"}
          <span className="text-[var(--zen)]">✓</span> building image
          {"        "}
          <span className="text-muted-foreground">2.1s</span>
          {"\n"}
          <span className="text-[var(--zen)]">✓</span> pushing to 38 regions{" "}
          <span className="text-muted-foreground">4.7s</span>
          {"\n"}
          <span className="text-[var(--zen)]">✓</span> live at{" "}
          <span className="text-foreground">app.infrazen.dev</span>
        </code>
      </pre>
    </div>
  );
}

export function Integrations() {
  return (
    <section
      id="integrations"
      data-slot="integrations"
      className="px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal()} className="max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Fits the stack you already have.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Infrazen sits between your code and the services it depends on.
            Connect a repo, point it at your data, and ship. Everything is
            API-first, so anything you can click you can also script.
          </p>
        </motion.div>

        {/* architecture flow */}
        <motion.div
          {...reveal({ y: 24, delay: 0.05 })}
          className="relative mt-12 overflow-hidden rounded-2xl border border-border p-6 sm:p-10"
        >
          <div
            aria-hidden
            className="zen-dots zen-fade-edges pointer-events-none absolute inset-0 opacity-50"
          />
          <div className="relative grid items-center gap-4 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
            <div className="flex flex-col gap-3">
              <span className="zen-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Your code
              </span>
              {SOURCES.map((node) => (
                <Node key={node.label} {...node} />
              ))}
            </div>

            <Connector />

            <div className="relative flex flex-col items-center gap-2 rounded-xl border border-[var(--zen-line)] bg-[var(--surface-2)] px-6 py-8 text-center">
              <CornerTicks />
              <Logo className="size-8" />
              <span className="mt-1 text-base font-medium text-foreground">
                Infrazen
              </span>
              <span className="zen-mono inline-flex items-center gap-1.5 text-[11px] text-[var(--zen)]">
                <span className="zen-pulse size-1.5 rounded-full bg-[var(--zen)]" />
                edge runtime · 38 regions
              </span>
            </div>

            <Connector />

            <div className="flex flex-col gap-3">
              <span className="zen-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Connected services
              </span>
              {CONNECTED.map((node) => (
                <Node key={node.label} {...node} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* API-first + integrations grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <motion.div
            {...reveal({ y: 20 })}
            className="flex flex-col justify-center rounded-2xl border border-border bg-card p-7"
          >
            <h3 className="text-lg font-medium text-foreground">
              Built for developers, all the way down.
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>Typed SDKs for TypeScript, Go, and Python</li>
              <li>REST and gRPC APIs with full OpenAPI specs</li>
              <li>First-class Terraform provider and GitHub Action</li>
              <li>Webhooks and an event stream for every deploy</li>
            </ul>
          </motion.div>
          <motion.div {...reveal({ y: 20, delay: 0.05 })}>
            <CodeCard />
          </motion.div>
        </div>

        <motion.div
          {...reveal({ y: 20, delay: 0.1 })}
          className="mt-10 grid gap-8 sm:grid-cols-3"
        >
          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className="zen-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {group.label}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((name) => (
                  <span
                    key={name}
                    className={cn(
                      "rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground",
                      "transition-colors hover:border-[var(--zen-line)] hover:text-foreground",
                    )}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
