"use client";

import * as React from "react";
import { Check, Inbox, SkipForward, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { KbdDisplay, KbdGroup } from "@/registry/hirael/ui/kbd";

type ReviewDecision = "approve" | "reject" | "skip";

type ReviewQueueItemData = {
  id: string;
};

type ReviewQueueContextValue = {
  total: number;
  index: number;
  remaining: number;
  current: ReviewQueueItemData | null;
  isDone: boolean;
  decide: (decision: ReviewDecision) => void;
};

const ReviewQueueContext =
  React.createContext<ReviewQueueContextValue | null>(null);

function useReviewQueue() {
  const ctx = React.useContext(ReviewQueueContext);
  if (!ctx) {
    throw new Error("Review queue parts must be used inside <ReviewQueue>");
  }
  return ctx;
}

type ReviewQueueProps<TItem extends ReviewQueueItemData> =
  React.ComponentProps<"div"> & {
    /** The items waiting for a decision, in queue order. */
    items: readonly TItem[];
    /** Called when the focused item is approved, rejected, or skipped. */
    onDecision?: (id: string, decision: ReviewDecision) => void;
  };

function ReviewQueue<TItem extends ReviewQueueItemData>({
  items,
  onDecision,
  className,
  children,
  onKeyDown,
  ...props
}: ReviewQueueProps<TItem>) {
  const [index, setIndex] = React.useState(0);

  const total = items.length;
  const isDone = index >= total;
  const current = isDone ? null : items[index];

  const decide = React.useCallback(
    (decision: ReviewDecision) => {
      setIndex((prev) => {
        if (prev >= items.length) return prev;
        onDecision?.(items[prev].id, decision);
        return prev + 1;
      });
    },
    [items, onDecision],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isDone) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement;
      if (
        target.isContentEditable ||
        target.closest("input, textarea, select")
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "a") {
        event.preventDefault();
        decide("approve");
      } else if (key === "r") {
        event.preventDefault();
        decide("reject");
      } else if (
        key === "s" ||
        key === "j" ||
        key === "k" ||
        key === "arrowright" ||
        key === "arrowleft"
      ) {
        event.preventDefault();
        decide("skip");
      }
    },
    [decide, isDone, onKeyDown],
  );

  const value = React.useMemo<ReviewQueueContextValue>(
    () => ({
      total,
      index: Math.min(index, total),
      remaining: Math.max(total - index, 0),
      current,
      isDone,
      decide,
    }),
    [total, index, current, isDone, decide],
  );

  return (
    <ReviewQueueContext.Provider value={value}>
      <div
        data-slot="review-queue"
        role="group"
        aria-label="Review queue"
        tabIndex={isDone ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ReviewQueueContext.Provider>
  );
}

type ReviewQueueItemProps<TItem extends ReviewQueueItemData> = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Render the focused item. Not called while the queue is empty. */
  children: (item: TItem) => React.ReactNode;
};

function ReviewQueueItem<TItem extends ReviewQueueItemData>({
  className,
  children,
  ...props
}: ReviewQueueItemProps<TItem>) {
  const { current } = useReviewQueue();

  if (!current) return null;

  return (
    <div
      data-slot="review-queue-item"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-background p-4",
        className,
      )}
      {...props}
    >
      {children(current as TItem)}
    </div>
  );
}

type ReviewQueueProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Render custom progress copy. Receives the 1-based position and total. */
  children?: (position: number, total: number) => React.ReactNode;
};

function ReviewQueueProgress({
  className,
  children,
  ...props
}: ReviewQueueProgressProps) {
  const { index, total } = useReviewQueue();
  const position = Math.min(index + 1, total);
  const pct = total === 0 ? 0 : Math.round((index / total) * 100);

  return (
    <div
      data-slot="review-queue-progress"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span data-slot="review-queue-progress-label">
          {children ? (
            children(position, total)
          ) : (
            <>
              Item {position} of {total}
            </>
          )}
        </span>
        <span
          data-slot="review-queue-progress-value"
          className="font-mono tabular-nums"
        >
          {pct}%
        </span>
      </div>
      <div
        data-slot="review-queue-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          data-slot="review-queue-progress-fill"
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ inlineSize: `${pct}%` }}
        />
      </div>
    </div>
  );
}

type ReviewQueueActionsProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Label for the approve button. Defaults to "Approve". */
  approveLabel?: React.ReactNode;
  /** Label for the reject button. Defaults to "Reject". */
  rejectLabel?: React.ReactNode;
  /** Label for the skip button. Defaults to "Skip". */
  skipLabel?: React.ReactNode;
};

function ReviewQueueActions({
  approveLabel = "Approve",
  rejectLabel = "Reject",
  skipLabel = "Skip",
  className,
  ...props
}: ReviewQueueActionsProps) {
  const { decide, isDone } = useReviewQueue();

  return (
    <div
      data-slot="review-queue-actions"
      role="group"
      aria-label="Review actions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      <Button
        data-slot="review-queue-approve"
        type="button"
        variant="default"
        aria-keyshortcuts="A"
        onClick={() => decide("approve")}
        disabled={isDone}
        className="flex-1"
      >
        <Check aria-hidden />
        {approveLabel}
        <KbdDisplay className="ms-auto bg-primary-foreground/15 text-primary-foreground">
          A
        </KbdDisplay>
      </Button>
      <Button
        data-slot="review-queue-reject"
        type="button"
        variant="destructive"
        aria-keyshortcuts="R"
        onClick={() => decide("reject")}
        disabled={isDone}
        className="flex-1"
      >
        <X aria-hidden />
        {rejectLabel}
        <KbdDisplay className="ms-auto bg-white/15 text-white">R</KbdDisplay>
      </Button>
      <Button
        data-slot="review-queue-skip"
        type="button"
        variant="outline"
        aria-keyshortcuts="S"
        onClick={() => decide("skip")}
        disabled={isDone}
      >
        <SkipForward aria-hidden className="rtl:rotate-180" />
        {skipLabel}
        <KbdGroup className="ms-1">
          <KbdDisplay>S</KbdDisplay>
        </KbdGroup>
      </Button>
    </div>
  );
}

type ReviewQueueEmptyProps = React.ComponentProps<"div"> & {
  /** Hide the empty state while items remain. Defaults to true. */
  whenDone?: boolean;
};

function ReviewQueueEmpty({
  whenDone = true,
  className,
  children,
  ...props
}: ReviewQueueEmptyProps) {
  const { isDone, total } = useReviewQueue();

  if (whenDone && !isDone) return null;

  return (
    <div
      data-slot="review-queue-empty"
      role="status"
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-background px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <span
            aria-hidden
            data-slot="review-queue-empty-icon"
            className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5"
          >
            <Inbox />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">Queue cleared</p>
            <p className="text-sm text-muted-foreground">
              {total === 0
                ? "Nothing to review right now."
                : `You reviewed all ${total} items.`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

type ReviewQueueRemainingProps = Omit<
  React.ComponentProps<typeof Badge>,
  "children"
> & {
  /** Render custom copy. Receives the number of items still to review. */
  children?: (remaining: number) => React.ReactNode;
};

function ReviewQueueRemaining({
  className,
  children,
  variant = "secondary",
  ...props
}: ReviewQueueRemainingProps) {
  const { remaining } = useReviewQueue();

  return (
    <Badge
      data-slot="review-queue-remaining"
      variant={variant}
      className={cn("tabular-nums", className)}
      {...props}
    >
      {children ? children(remaining) : `${remaining} left`}
    </Badge>
  );
}

export {
  ReviewQueue,
  ReviewQueueItem,
  ReviewQueueProgress,
  ReviewQueueActions,
  ReviewQueueEmpty,
  ReviewQueueRemaining,
};
