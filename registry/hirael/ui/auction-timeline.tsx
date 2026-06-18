"use client";

import * as React from "react";
import { Check, Clock, Gavel, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";

type AuctionContextValue = {
  endsAt?: number;
  now: number;
};

const AuctionContext = React.createContext<AuctionContextValue | null>(null);

function useAuctionContext() {
  const ctx = React.useContext(AuctionContext);
  if (!ctx) {
    throw new Error(
      "AuctionTimeline compound parts must be used inside <AuctionTimeline>",
    );
  }
  return ctx;
}

const toTimestamp = (value: Date | string | number) =>
  value instanceof Date ? value.getTime() : new Date(value).getTime();

const useReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
};

export type AuctionTimelineProps = React.ComponentProps<"div"> & {
  /** When the auction closes. Read by `AuctionCountdown` to drive the live clock. */
  endsAt?: Date | string | number;
};

function AuctionTimeline({
  endsAt,
  className,
  children,
  ...props
}: AuctionTimelineProps) {
  const endsAtMs = endsAt === undefined ? undefined : toTimestamp(endsAt);
  const [now, setNow] = React.useState<number>(() =>
    endsAtMs === undefined ? 0 : endsAtMs,
  );
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (endsAtMs === undefined) return;
    setNow(Date.now());
    if (Date.now() >= endsAtMs) return;
    const id = setInterval(() => {
      const next = Date.now();
      setNow(next);
      if (next >= endsAtMs) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [endsAtMs, reduceMotion]);

  const value = React.useMemo<AuctionContextValue>(
    () => ({ endsAt: endsAtMs, now }),
    [endsAtMs, now],
  );

  return (
    <AuctionContext.Provider value={value}>
      <div
        data-slot="auction-timeline"
        className={cn(
          "flex flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AuctionContext.Provider>
  );
}

type AuctionHeaderProps = React.ComponentProps<"div">;

function AuctionHeader({ className, ...props }: AuctionHeaderProps) {
  return (
    <div
      data-slot="auction-header"
      className={cn(
        "flex flex-wrap items-start justify-between gap-3",
        className,
      )}
      {...props}
    />
  );
}

export type AuctionBidProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The current leading bid, already formatted (e.g. "$2,450"). */
  amount: React.ReactNode;
  /** Number of bids placed so far. */
  bids?: number;
  /** Label above the amount. */
  label?: React.ReactNode;
};

function AuctionBid({
  amount,
  bids,
  label = "Current bid",
  className,
  ...props
}: AuctionBidProps) {
  return (
    <div
      data-slot="auction-bid"
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    >
      <span
        data-slot="auction-bid-label"
        className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
      >
        {label}
      </span>
      <span
        data-slot="auction-bid-amount"
        className="text-2xl font-semibold leading-none tracking-tight text-foreground"
        style={{ color: "var(--accent-cool)" }}
      >
        {amount}
      </span>
      {bids !== undefined ? (
        <span
          data-slot="auction-bid-count"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Gavel aria-hidden className="size-3" />
          {bids} {bids === 1 ? "bid" : "bids"}
        </span>
      ) : null}
    </div>
  );
}

export type AuctionStatusState = "live" | "closing" | "closed";

const statusContent: Record<
  AuctionStatusState,
  { label: string; live: boolean }
> = {
  live: { label: "Live", live: true },
  closing: { label: "Closing soon", live: true },
  closed: { label: "Closed", live: false },
};

export type AuctionStatusProps = Omit<
  React.ComponentProps<"span">,
  "children"
> & {
  /** Current lifecycle of the auction. `live` and `closing` read as active. */
  state: AuctionStatusState;
  children?: React.ReactNode;
};

function AuctionStatus({
  state,
  className,
  children,
  ...props
}: AuctionStatusProps) {
  const { label, live } = statusContent[state];
  return (
    <Badge
      data-slot="auction-status"
      data-state={state}
      variant="outline"
      className={cn("gap-1.5", className)}
      {...props}
    >
      {live ? (
        <span aria-hidden className="state-dot" />
      ) : (
        <Check aria-hidden className="size-3 text-muted-foreground" />
      )}
      {children ?? label}
    </Badge>
  );
}

const formatRemaining = (ms: number) => {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  if (days > 0) {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export type AuctionCountdownProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Shown once the countdown reaches zero. */
  endedLabel?: React.ReactNode;
};

function AuctionCountdown({
  endedLabel = "Bidding closed",
  className,
  ...props
}: AuctionCountdownProps) {
  const { endsAt, now } = useAuctionContext();
  const mounted = now > 0;
  const remaining = endsAt === undefined ? 0 : Math.max(endsAt - now, 0);
  const ended = endsAt !== undefined && mounted && remaining <= 0;

  return (
    <div
      data-slot="auction-countdown"
      role="timer"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2",
        className,
      )}
      {...props}
    >
      <Clock aria-hidden className="size-4 text-muted-foreground" />
      {ended ? (
        <span
          data-slot="auction-countdown-ended"
          className="text-sm font-medium text-muted-foreground"
        >
          {endedLabel}
        </span>
      ) : (
        <>
          <span
            data-slot="auction-countdown-label"
            className="text-xs text-muted-foreground"
          >
            Ends in
          </span>
          <span
            data-slot="auction-countdown-value"
            className="ms-auto font-mono text-sm font-medium tabular-nums text-foreground"
          >
            {mounted && endsAt !== undefined ? formatRemaining(remaining) : "--:--:--"}
          </span>
        </>
      )}
    </div>
  );
}

type AuctionHistoryProps = React.ComponentProps<"ol">;

function AuctionHistory({ className, ...props }: AuctionHistoryProps) {
  return (
    <ol
      data-slot="auction-history"
      className={cn("relative flex flex-col", className)}
      {...props}
    />
  );
}

export type AuctionBidRowProps = Omit<React.ComponentProps<"li">, "children"> & {
  /** Name of the bidder. */
  bidder: React.ReactNode;
  /** Bid amount, already formatted. */
  amount: React.ReactNode;
  /** When the bid was placed. */
  time: React.ReactNode;
  /** Marks this as the current leading bid. */
  leading?: boolean;
};

function AuctionBidRow({
  bidder,
  amount,
  time,
  leading = false,
  className,
  ...props
}: AuctionBidRowProps) {
  return (
    <li
      data-slot="auction-bid-row"
      data-leading={leading || undefined}
      className={cn(
        "group relative flex items-center gap-3 ps-6 pb-4 last:pb-0",
        "before:absolute before:start-[3px] before:top-5 before:bottom-0 before:w-px before:bg-border",
        "last:before:hidden",
        className,
      )}
      {...props}
    >
      <span
        data-slot="auction-bid-marker"
        aria-hidden
        className={cn(
          "absolute start-0 top-1.5 z-10 inline-flex size-[7px] rounded-full ring-2 ring-card",
          leading ? "state-dot" : "bg-muted-foreground",
        )}
      />
      <div
        data-slot="auction-bid-row-main"
        className="flex min-w-0 flex-1 flex-col gap-0.5"
      >
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <span className="truncate">{bidder}</span>
          {leading ? (
            <span
              data-slot="auction-bid-leading"
              className="inline-flex items-center gap-1 text-[11px] font-medium"
              style={{ color: "var(--accent-cool)" }}
            >
              <TrendingUp aria-hidden className="size-3" />
              Leading
            </span>
          ) : null}
        </span>
        <time
          data-slot="auction-bid-time"
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
        >
          {time}
        </time>
      </div>
      <span
        data-slot="auction-bid-row-amount"
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          leading ? "" : "text-muted-foreground",
        )}
        style={leading ? { color: "var(--accent-cool)" } : undefined}
      >
        {amount}
      </span>
    </li>
  );
}

export type AuctionWinnerProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Name of the winning bidder. */
  winner: React.ReactNode;
  /** Winning amount, already formatted. */
  amount: React.ReactNode;
  /** Label above the winner. */
  label?: React.ReactNode;
};

function AuctionWinner({
  winner,
  amount,
  label = "Winner",
  className,
  ...props
}: AuctionWinnerProps) {
  return (
    <div
      data-slot="auction-winner"
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground [&_svg]:size-3.5"
        >
          <Check />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </span>
          <span className="truncate text-sm font-medium text-foreground">
            {winner}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
        {amount}
      </span>
    </div>
  );
}

export {
  AuctionTimeline,
  AuctionHeader,
  AuctionBid,
  AuctionCountdown,
  AuctionStatus,
  AuctionHistory,
  AuctionBidRow,
  AuctionWinner,
};
