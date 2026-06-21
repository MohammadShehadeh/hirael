"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

export type CopyButtonProps = Omit<React.ComponentProps<"button">, "value"> & {
  /** Text written to the clipboard on click. */
  value: string;
  variant?: "ghost" | "outline";
  size?: "sm" | "md";
  /** How long the copied state stays, in ms. */
  timeout?: number;
  onCopy?: (value: string) => void;
};

async function writeClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts where the async clipboard API is absent.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function CopyButton({
  value,
  variant = "ghost",
  size = "md",
  timeout = 1500,
  onCopy,
  className,
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await writeClipboard(value);
      setCopied(true);
      onCopy?.(value);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
    } catch {
      setCopied(false);
    }
  };

  const hasLabel = children != null;

  return (
    <button
      type="button"
      data-slot="copy-button"
      data-state={copied ? "copied" : "idle"}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "ghost" &&
          "text-muted-foreground hover:bg-accent hover:text-foreground",
        variant === "outline" &&
          "border border-border bg-transparent text-foreground hover:bg-accent",
        hasLabel
          ? "h-8 px-2.5"
          : size === "sm"
            ? "size-7 [&_svg]:size-3.5"
            : "size-8 [&_svg]:size-4",
        hasLabel && (size === "sm" ? "[&_svg]:size-3.5" : "[&_svg]:size-4"),
        className,
      )}
      {...props}
    >
      <span className="relative inline-flex items-center justify-center">
        <Check
          aria-hidden
          className={cn(
            "transition-all duration-150",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
        <Copy
          aria-hidden
          className={cn(
            "absolute transition-all duration-150",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        />
      </span>
      {hasLabel && <span>{copied ? "Copied" : children}</span>}
    </button>
  );
}

export { CopyButton };
