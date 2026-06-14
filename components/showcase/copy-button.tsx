"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  className,
  label = "Copy",
  size = "sm",
}: {
  text: string;
  className?: string;
  label?: string;
  size?: "sm" | "md";
}) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be blocked; silently noop
    }
  };

  const dims = size === "md" ? "size-8" : "size-7";
  const iconDims = size === "md" ? "size-4" : "size-3.5";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? `${label}: copied` : label}
      aria-live="polite"
      data-copied={copied || undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        dims,
        className,
      )}
    >
      <Copy
        className={cn(
          iconDims,
          "transition-all duration-150 ease-out",
          copied && "scale-50 opacity-0",
        )}
        aria-hidden
      />
      <Check
        className={cn(
          iconDims,
          "absolute text-foreground transition-all duration-150 ease-out",
          !copied && "scale-50 opacity-0",
        )}
        aria-hidden
      />
    </button>
  );
}
