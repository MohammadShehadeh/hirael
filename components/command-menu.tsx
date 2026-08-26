"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { KbdDisplay } from "@/registry/hirael/components/kbd";
import { Button } from "@/registry/hirael/ui/button";

// The palette (cmdk + Radix dialog) is loaded on first open, so it never
// ships to visitors who don't search.
const CommandPalette = dynamic(
  () => import("@/components/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);

/**
 * ⌘K trigger. Lightweight on its own — owns the button, the keyboard
 * shortcut, and open state; mounts the heavy palette only once opened.
 */
export const CommandMenu = ({ className }: { className?: string }) => {
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
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label="Search components and blocks"
        className={cn("sm:w-auto sm:px-2.5", className)}
      >
        <Search className="size-3.5 shrink-0" />
        <span className="hidden text-[13px] tracking-tight sm:inline">
          Search…
        </span>
        <KbdDisplay className="ms-2 hidden border border-border bg-background px-1.5 font-mono text-[10px] sm:inline-flex">
          {isMac ? "⌘" : "Ctrl "}K
        </KbdDisplay>
      </Button>

      {armed && <CommandPalette open={open} onOpenChange={setOpen} />}
    </>
  );
};
