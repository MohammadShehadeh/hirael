"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type AnnouncementBarProps = React.ComponentProps<"div"> &
  VariantProps<typeof announcementBarVariants> & {
    dismissible?: boolean;
    /** Controlled-open. If provided, internal state is bypassed. */
    open?: boolean;
    /** Fires when the user dismisses via the close button. */
    onDismiss?: () => void;
    /** localStorage key. When set, the dismissed state is persisted across reloads. */
    storageKey?: string;
  };

const announcementBarVariants = cva(
  "relative isolate flex w-full items-center justify-center gap-3 border-b px-4 py-2 text-sm",
  {
    variants: {
      tone: {
        default: "border-border bg-card text-card-foreground",
        primary: "border-foreground/15 bg-foreground text-background",
        muted: "border-border bg-muted text-foreground",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

const noopUnsubscribe = () => () => {};

// Server render returns false (visible by default) so the SSR HTML and the
// hydration pass agree without warnings. Once hydration is committed, the
// real storage value is read — returning users see the bar hide.
function useStoredDismiss(storageKey?: string) {
  const subscribe = React.useCallback(
    (cb: () => void) => {
      if (!storageKey || typeof window === "undefined")
        return noopUnsubscribe();
      const handler = (e: StorageEvent) => {
        if (e.key === storageKey) cb();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    [storageKey],
  );
  const getSnapshot = React.useCallback(() => {
    if (!storageKey || typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(storageKey) === "1";
    } catch {
      return false;
    }
  }, [storageKey]);
  const getServerSnapshot = React.useCallback(() => false, []);
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function AnnouncementBar({
  className,
  tone = "default",
  dismissible = false,
  open,
  onDismiss,
  storageKey,
  children,
  ...props
}: AnnouncementBarProps) {
  const storedDismissed = useStoredDismiss(storageKey);
  const [localDismissed, setLocalDismissed] = React.useState(false);

  const isControlled = open !== undefined;
  const dismissed = isControlled ? !open : storedDismissed || localDismissed;

  if (dismissed) return null;

  const handleDismiss = () => {
    if (!isControlled) setLocalDismissed(true);
    if (storageKey && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(storageKey, "1");
      } catch {}
    }
    onDismiss?.();
  };

  const isPrimary = tone === "primary";

  return (
    <div
      role="region"
      aria-label="Site announcement"
      data-slot="announcement-bar"
      data-tone={tone}
      className={cn(announcementBarVariants({ tone }), className)}
      {...props}
    >
      <div className="flex flex-1 items-center justify-center gap-2 text-center">
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className={cn(
            "absolute end-2 inline-flex size-7 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isPrimary
              ? "text-background/70 hover:bg-background/10 hover:text-background"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

type AnnouncementBarBadgeProps = React.ComponentProps<"span">;

function AnnouncementBarBadge({
  className,
  ...props
}: AnnouncementBarBadgeProps) {
  return (
    <span
      data-slot="announcement-bar-badge"
      className={cn(
        "inline-flex items-center rounded-sm border border-current/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] opacity-80",
        className,
      )}
      {...props}
    />
  );
}

type AnnouncementBarLinkProps = React.ComponentProps<"a">;

function AnnouncementBarLink({
  className,
  ...props
}: AnnouncementBarLinkProps) {
  return (
    <a
      data-slot="announcement-bar-link"
      className={cn(
        "inline-flex items-center gap-1 underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

export { AnnouncementBar, AnnouncementBarBadge, AnnouncementBarLink };
