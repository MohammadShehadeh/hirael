"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/segmented-control";
import { CopyButton } from "@/registry/hirael/components/copy-button";
import {
  PACKAGE_MANAGERS,
  type PackageManager,
  getShadcnAddCommand,
  usePackageManager,
} from "@/lib/package-managers";
import { SITE } from "@/lib/site";

/**
 * Two layouts of the same three parts (command line, package-manager picker,
 * copy). "default" stacks a control bar over the command for the detail page;
 * "inline" folds everything into one row for list contexts, where each block
 * gets its own install line under the live preview.
 */
const installBlockVariants = cva(
  "overflow-hidden rounded-md border border-border bg-card",
  {
    variants: {
      variant: {
        default: "flex flex-col",
        inline: "flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const controlsVariants = cva("flex items-center gap-1", {
  variants: {
    variant: {
      default: "order-first justify-between border-b border-border px-1 py-1",
      inline: "ms-auto shrink-0",
    },
  },
  defaultVariants: { variant: "default" },
});

const commandVariants = cva("flex min-w-0 items-center gap-2.5", {
  variants: {
    variant: {
      default: "px-3 py-2.5",
      inline: "flex-1 basis-64",
    },
  },
  defaultVariants: { variant: "default" },
});

interface InstallBlockProps extends VariantProps<typeof installBlockVariants> {
  name: string;
  className?: string;
}

export const InstallBlock = ({
  name,
  className,
  variant,
}: InstallBlockProps) => {
  const [pm, setPm] = usePackageManager();
  const origin = React.useSyncExternalStore(
    subscribeNoop,
    getClientOrigin,
    getServerOrigin,
  );

  const url = `${origin}/r/${name}.json`;
  const command = getShadcnAddCommand(pm, url);

  return (
    <div className={cn(installBlockVariants({ variant }), className)}>
      <div className={commandVariants({ variant })}>
        <span
          aria-hidden
          className="select-none font-mono text-xs text-muted-foreground"
        >
          $
        </span>
        <CommandLine command={command} />
      </div>

      <div className={controlsVariants({ variant })}>
        <SegmentedControl
          role="radio"
          ariaLabel="Package manager"
          value={pm}
          onValueChange={(v) => setPm(v as PackageManager)}
          items={PACKAGE_MANAGERS.map((p) => ({ value: p, label: p }))}
        />
        <CopyButton
          value={command}
          size="sm"
          aria-label="Copy install command"
        />
      </div>
    </div>
  );
};

// The registry origin: the configured base URL, else wherever the page is
// served from (so a local `pnpm dev` shows a local install command). Read
// through useSyncExternalStore so the static HTML carries the canonical
// origin and the client swaps in its own on hydration without a mismatch.
const subscribeNoop = () => () => {};
const getServerOrigin = () => SITE.registry.origin;
const getClientOrigin = () =>
  process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;

// VSCode dark-plus / light-plus token colors, applied semantically so the
// install command reads like editor-highlighted shell (bash itself has nothing
// to colorize in a bare command, so we classify the tokens ourselves).
const TOKEN_CLASS = {
  runner: "text-[#795e26] dark:text-[#dcdcaa]", // npx / pnpm / yarn / bunx
  verb: "text-[#0000ff] dark:text-[#569cd6]", // dlx / add
  flag: "text-[#0070c1] dark:text-[#9cdcfe]", // --bun
  pkg: "text-[#267f99] dark:text-[#4ec9b0]", // shadcn@latest
  url: "text-[#a31515] dark:text-[#ce9178]", // registry URL
  plain: "text-muted-foreground",
} as const;

const classifyToken = (
  token: string,
  index: number,
): keyof typeof TOKEN_CLASS => {
  if (index === 0) return "runner";
  if (/^https?:\/\//.test(token)) return "url";
  if (token.startsWith("-")) return "flag";
  if (token === "dlx" || token === "add") return "verb";
  if (token.includes("shadcn")) return "pkg";
  return "plain";
};

const CommandLine = ({ command }: { command: string }) => {
  const tokens = command.split(" ");
  return (
    <code
      dir="ltr"
      className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs"
    >
      {tokens.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && " "}
          <span className={TOKEN_CLASS[classifyToken(t, i)]}>{t}</span>
        </React.Fragment>
      ))}
    </code>
  );
};
