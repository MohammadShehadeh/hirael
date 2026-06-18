"use client";

import * as React from "react";
import { Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { reveal } from "./primitives";

/* ---- mini product screens (no stock imagery) -------------------------- */

const BARS = [40, 55, 38, 62, 48, 70, 52, 80, 60, 74, 58, 88];

function MetricsScreen() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {[
          ["1.84M", "requests / min"],
          ["38ms", "p50 latency"],
        ].map(([v, l]) => (
          <div key={l} className="bg-card px-3 py-2">
            <div className="zen-mono text-base font-semibold text-foreground">
              {v}
            </div>
            <div className="zen-mono text-[10px] text-muted-foreground">
              {l}
            </div>
          </div>
        ))}
      </div>
      <div className="flex h-20 items-end gap-1" aria-hidden>
        {BARS.map((b, i) => (
          <span
            key={i}
            style={{ height: `${b}%` }}
            className={cn(
              "flex-1 rounded-sm",
              i === BARS.length - 1 ? "bg-[var(--zen)]" : "bg-white/12",
            )}
          />
        ))}
      </div>
    </div>
  );
}

const ACTIVE = new Set([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31]);

function RegionsScreen() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="zen-mono text-xs text-foreground">
          38 / 38 healthy
        </span>
        <span className="zen-mono inline-flex items-center gap-1.5 text-[10px] text-[var(--zen)]">
          <span className="size-1.5 rounded-full bg-[var(--zen)]" />
          live
        </span>
      </div>
      <div className="grid grid-cols-11 gap-1.5" aria-hidden>
        {Array.from({ length: 33 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "size-1.5 rounded-full",
              ACTIVE.has(i) ? "bg-[var(--zen)]" : "bg-white/10",
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["iad", "fra", "sin", "gru", "hnd"].map((r) => (
          <span
            key={r}
            className="zen-mono rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

const LOGS = [
  { lvl: "INFO", msg: "deploy a1f9c2e promoted to production" },
  { lvl: "INFO", msg: "routing 100% traffic across 38 regions" },
  { lvl: "OK", msg: "health checks passed in iad, fra, sin" },
  { lvl: "WARN", msg: "cold start in gru took 412ms" },
  { lvl: "INFO", msg: "image built in 2.1s, 84MB" },
  { lvl: "INFO", msg: "push received on refs/heads/main" },
];

function LogsScreen() {
  return (
    <div className="flex flex-col gap-1.5">
      {LOGS.map((log, i) => (
        <div key={i} className="zen-mono flex items-start gap-2 text-[11px]">
          <span
            className={cn(
              "shrink-0",
              log.lvl === "WARN"
                ? "text-amber-400/90"
                : log.lvl === "OK"
                  ? "text-[var(--zen)]"
                  : "text-muted-foreground/70",
            )}
          >
            {log.lvl.padEnd(4, " ")}
          </span>
          <span className="text-muted-foreground">{log.msg}</span>
        </div>
      ))}
    </div>
  );
}

const DEPLOYS = [
  ["a1f9c2e", "main", "Ready"],
  ["7b3d018", "main", "Ready"],
  ["c44e9af", "feat/cache", "Building"],
  ["e90b7d1", "main", "Ready"],
];

function DeploymentsScreen() {
  return (
    <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border">
      {DEPLOYS.map(([hash, branch, state]) => (
        <div key={hash} className="flex items-center gap-2.5 bg-card px-3 py-2">
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              state === "Ready" ? "bg-[var(--zen)]" : "bg-amber-400/80",
            )}
          />
          <span className="zen-mono text-xs text-foreground">{hash}</span>
          <span className="zen-mono truncate text-[11px] text-muted-foreground">
            {branch}
          </span>
          <span
            className={cn(
              "zen-mono ms-auto text-[11px]",
              state === "Ready" ? "text-[var(--zen)]" : "text-amber-400/90",
            )}
          >
            {state}
          </span>
        </div>
      ))}
    </div>
  );
}

const KEYS = [
  ["prod-deploy", "deploy:write", "2m ago"],
  ["ci-runner", "build:write", "1h ago"],
  ["readonly", "metrics:read", "3h ago"],
];

function AccessScreen() {
  return (
    <div className="flex flex-col gap-2">
      {KEYS.map(([name, scope, used]) => (
        <div
          key={name}
          className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
        >
          <div className="flex flex-col">
            <span className="zen-mono text-xs text-foreground">{name}</span>
            <span className="zen-mono text-[10px] text-muted-foreground">
              {scope}
            </span>
          </div>
          <span className="zen-mono text-[10px] text-muted-foreground">
            {used}
          </span>
        </div>
      ))}
    </div>
  );
}

type Screen = {
  id: string;
  title: string;
  caption: string;
  body: React.ReactNode;
};

const SCREENS: Screen[] = [
  {
    id: "metrics",
    title: "Metrics",
    caption: "Requests, latency, and errors for every deploy, in real time.",
    body: <MetricsScreen />,
  },
  {
    id: "regions",
    title: "Regions",
    caption: "Health and traffic across all 38 regions at a glance.",
    body: <RegionsScreen />,
  },
  {
    id: "logs",
    title: "Live logs",
    caption: "Streaming, structured logs from build through rollout.",
    body: <LogsScreen />,
  },
  {
    id: "deployments",
    title: "Deployments",
    caption: "Every release, its commit, and one-click rollback.",
    body: <DeploymentsScreen />,
  },
  {
    id: "access",
    title: "Access",
    caption: "Scoped API keys and audit trails for the whole team.",
    body: <AccessScreen />,
  },
];

/* ---- frame + masonry + modal ----------------------------------------- */

function Chrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
      <span className="size-2 rounded-full bg-white/15" />
      <span className="size-2 rounded-full bg-white/15" />
      <span className="size-2 rounded-full bg-white/15" />
      <span className="zen-mono ms-1.5 text-[11px] text-muted-foreground">
        {title}
      </span>
    </div>
  );
}

export function Gallery() {
  const [active, setActive] = React.useState<number | null>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const current = active === null ? null : SCREENS[active];

  return (
    <section
      id="gallery"
      data-slot="gallery"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <motion.div {...reveal()} className="max-w-2xl">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          A console you will actually want to live in.
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Metrics, logs, regions, and rollouts in one place. Click any panel to
          take a closer look.
        </p>
      </motion.div>

      <motion.div
        {...reveal({ y: 24, delay: 0.05 })}
        className="mt-12 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3"
      >
        {SCREENS.map((screen, i) => (
          <button
            key={screen.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Open ${screen.title} preview`}
            className="zen-lift group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-border bg-card text-start hover:border-[var(--zen-line)]"
          >
            <Chrome title={`infrazen.app / ${screen.id}`} />
            <div className="relative p-4">
              {screen.body}
              <span className="zen-mono absolute end-3 top-3 inline-flex items-center gap-1 rounded-md border border-border bg-background/80 px-1.5 py-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                <Maximize2 className="size-3" />
                View
              </span>
            </div>
            <div className="border-t border-border px-4 py-3">
              <span className="text-sm font-medium text-foreground">
                {screen.title}
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {screen.caption}
              </p>
            </div>
          </button>
        ))}
      </motion.div>

      <AnimatePresence>
        {current ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setActive(null)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${current.title} preview`}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="zen-ring relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Chrome title={`infrazen.app / ${current.id}`} />
              <button
                ref={closeRef}
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close preview"
                className="absolute end-3 top-2.5 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
              <div className="p-6">{current.body}</div>
              <div className="border-t border-border px-6 py-4">
                <span className="text-sm font-medium text-foreground">
                  {current.title}
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {current.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
