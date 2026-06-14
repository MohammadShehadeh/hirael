"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

// The palette (cmdk + Radix dialog) is loaded on first open, so it never
// ships to visitors who don't search.
const CommandPalette = dynamic(
  () =>
    import("@/components/showcase/command-palette").then(
      (m) => m.CommandPalette,
    ),
  { ssr: false },
);

/**
 * ⌘K trigger. Lightweight on its own — owns the button, the keyboard
 * shortcut, and open state; mounts the heavy palette only once opened.
 */
export function CommandMenu({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [armed, setArmed] = React.useState(false);
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    setIsMac(
      typeof navigator !== "undefined" &&
        /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent),
    );
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (open) setArmed(true);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search components and blocks"
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <Search className="size-3.5 shrink-0" />
        <span className="hidden text-[13px] tracking-tight sm:inline">
          Search…
        </span>
        <kbd className="ml-2 hidden h-5 select-none items-center rounded-sm border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
          {isMac ? "⌘" : "Ctrl "}K
        </kbd>
      </button>

      {armed && <CommandPalette open={open} onOpenChange={setOpen} />}
    </>
  );
}
