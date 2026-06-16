"use client";

import * as React from "react";

import { CountdownTimer } from "@/registry/hirael/ui/countdown-timer";

export default function CountdownTimerDemo() {
  const [launchTarget] = React.useState(
    () => Date.now() + (3 * 86400 + 7 * 3600 + 24 * 60 + 30) * 1000,
  );
  const [saleTarget] = React.useState(
    () => Date.now() + (5 * 3600 + 32 * 60 + 10) * 1000,
  );
  const [shortTarget, setShortTarget] = React.useState(
    () => Date.now() + 10_000,
  );
  const [completedAt, setCompletedAt] = React.useState<string | null>(null);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Boxed · product launch
        </p>
        <CountdownTimer target={launchTarget} />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Inline · hideZeroDays
        </p>
        <CountdownTimer variant="inline" hideZeroDays target={saleTarget} />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Minimal · inside a sentence
        </p>
        <div className="text-sm text-muted-foreground">
          Early-bird pricing ends in{" "}
          <CountdownTimer
            variant="minimal"
            target={launchTarget}
            className="align-baseline font-medium text-foreground"
          />{" "}
          Lock in your seat now.
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          onComplete · 10 second countdown
        </p>
        <CountdownTimer
          variant="inline"
          hideZeroDays
          target={shortTarget}
          onComplete={() => setCompletedAt(new Date().toLocaleTimeString())}
          completeContent={
            <span className="text-xl font-semibold text-primary">
              We&apos;re live!
            </span>
          }
        />
        {completedAt ? (
          <p className="text-xs text-muted-foreground">
            onComplete fired at {completedAt}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setCompletedAt(null);
            setShortTarget(Date.now() + 10_000);
          }}
          className="mt-1 w-fit rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
