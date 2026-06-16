"use client";

import * as React from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";

type ApiKeysProps = React.ComponentProps<"div">;

function ApiKeys({ className, ...props }: ApiKeysProps) {
  return (
    <div
      data-slot="api-keys"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

type ApiKeysHeaderProps = React.ComponentProps<"div">;

function ApiKeysHeader({ className, ...props }: ApiKeysHeaderProps) {
  return (
    <div
      data-slot="api-keys-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

type ApiKeysTitleProps = React.ComponentProps<"h3">;

function ApiKeysTitle({ className, ...props }: ApiKeysTitleProps) {
  return (
    <h3
      data-slot="api-keys-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

type ApiKeysListProps = React.ComponentProps<"ul">;

function ApiKeysList({ className, ...props }: ApiKeysListProps) {
  return (
    <ul
      data-slot="api-keys-list"
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  );
}

type ApiKeyItemProps = React.ComponentProps<"li">;

function ApiKeyItem({ className, ...props }: ApiKeyItemProps) {
  return (
    <li
      data-slot="api-key-item"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

type ApiKeyNameProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
};

function ApiKeyName({ label, className, children, ...props }: ApiKeyNameProps) {
  return (
    <div
      data-slot="api-key-name"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    >
      <span className="truncate text-sm font-medium text-foreground">
        {label}
      </span>
      {children ? (
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {children}
        </span>
      ) : null}
    </div>
  );
}

type ApiKeyValueProps = Omit<React.ComponentProps<"div">, "children"> & {
  value: string;
  /** Whether the key starts revealed. */
  defaultRevealed?: boolean;
};

function ApiKeyValue({
  value,
  defaultRevealed = false,
  className,
  ...props
}: ApiKeyValueProps) {
  const [revealed, setRevealed] = React.useState(defaultRevealed);
  const [copied, setCopied] = React.useState(false);

  const masked = `${value.slice(0, 3)}${"•".repeat(8)}${value.slice(-4)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      data-slot="api-key-value"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-background py-0.5 pe-0.5 ps-2",
        className,
      )}
      {...props}
    >
      <code className="truncate font-mono text-xs text-foreground">
        {revealed ? value : masked}
      </code>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={revealed ? "Hide key" : "Reveal key"}
        aria-pressed={revealed}
        onClick={() => setRevealed((value) => !value)}
        className="size-6 rounded text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
      >
        {revealed ? <EyeOff /> : <Eye />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Copy key"
        onClick={copy}
        className="size-6 rounded text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
      >
        {copied ? <Check className="text-success" /> : <Copy />}
      </Button>
    </div>
  );
}

type ApiKeyMetaProps = React.ComponentProps<"span">;

function ApiKeyMeta({ className, ...props }: ApiKeyMetaProps) {
  return (
    <span
      data-slot="api-key-meta"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  ApiKeys,
  ApiKeysHeader,
  ApiKeysTitle,
  ApiKeysList,
  ApiKeyItem,
  ApiKeyName,
  ApiKeyValue,
  ApiKeyMeta,
};
