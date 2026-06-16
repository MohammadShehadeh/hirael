"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/showcase/segmented-control";
import { CopyButton } from "@/registry/hirael/ui/copy-button";
import {
  PACKAGE_MANAGERS,
  type PackageManager,
  getShadcnAddCommand,
  usePackageManager,
} from "@/lib/package-managers";
import { SITE } from "@/lib/site";

export function InstallBlock({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const [pm, setPm] = usePackageManager();
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin);
  }, []);

  const url = `${origin || SITE.registry.origin}/r/${name}.json`;
  const command = getShadcnAddCommand(pm, url);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-1 py-1">
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
          className="mr-0.5"
        />
      </div>

      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span
          aria-hidden
          className="select-none font-mono text-xs text-muted-foreground"
        >
          $
        </span>
        <CommandLine command={command} />
      </div>
    </div>
  );
}

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

function classifyToken(token: string, index: number): keyof typeof TOKEN_CLASS {
  if (index === 0) return "runner";
  if (/^https?:\/\//.test(token)) return "url";
  if (token.startsWith("-")) return "flag";
  if (token === "dlx" || token === "add") return "verb";
  if (token.includes("shadcn")) return "pkg";
  return "plain";
}

function CommandLine({ command }: { command: string }) {
  const tokens = command.split(" ");
  return (
    <code className="no-scrollbar min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">
      {tokens.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && " "}
          <span className={TOKEN_CLASS[classifyToken(t, i)]}>{t}</span>
        </React.Fragment>
      ))}
    </code>
  );
}
