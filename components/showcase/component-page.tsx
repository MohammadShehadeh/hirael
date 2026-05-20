"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { InstallBlock } from "@/components/showcase/install-block"
import type { RegistryEntryMeta } from "@/registry/sabk/registry-meta"

type Tab = "preview" | "code" | "install"

export function ComponentPage({
  entry,
  source,
}: {
  entry: RegistryEntryMeta
  /** Pre-loaded file contents (path → string) for the Code tab. */
  source: Record<string, string>
}) {
  const [tab, setTab] = React.useState<Tab>("preview")
  const [activeFile, setActiveFile] = React.useState<string | undefined>(
    entry.sourceFiles?.[0]
  )

  const Demo = entry.Demo

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 md:px-10">
      <header className="flex flex-col gap-3 border-b-2 border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {entry.category}
          </span>
          {entry.status === "planned" && (
            <span className="rounded-sm border-2 border-border px-1.5 py-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              planned
            </span>
          )}
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.035em]">
          {entry.title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {entry.description}
        </p>
        <InstallBlock name={entry.name} className="mt-1" />
      </header>

      {entry.status === "planned" ? (
        <div className="rounded-sm border-2 border-dashed border-border bg-card/40 px-6 py-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Declared in <code>registry.json</code> · implementation pending
          </p>
          <p className="mt-3 text-sm text-foreground">
            This component is part of Phase&nbsp;1 and will land soon.
            The registry entry, dependency list, and install URL are
            already wired up.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1 border-b-2 border-border">
            {(
              [
                ["preview", "Preview"],
                ["code", "Code"],
                ["install", "Install"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={cn(
                  "relative -mb-[2px] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors",
                  tab === k
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
                {tab === k && (
                  <span className="absolute inset-x-0 -bottom-[2px] h-[2px] bg-forge" />
                )}
              </button>
            ))}
          </div>

          {tab === "preview" && Demo && (
            <div className="flex min-h-[420px] items-center justify-center rounded-sm border-2 border-border bg-card/40 p-10">
              <Demo />
            </div>
          )}

          {tab === "code" && entry.sourceFiles && (
            <div className="overflow-hidden rounded-sm border-2 border-border">
              <div className="flex items-center gap-2 border-b-2 border-border bg-card px-3 py-1.5">
                {entry.sourceFiles.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveFile(f)}
                    className={cn(
                      "rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
                      activeFile === f
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.split("/").slice(-1)[0]}
                  </button>
                ))}
              </div>
              <pre className="max-h-[640px] overflow-auto bg-card p-4 text-xs leading-relaxed">
                <code className="font-mono">
                  {activeFile ? (source[activeFile] ?? "// (missing)") : ""}
                </code>
              </pre>
            </div>
          )}

          {tab === "install" && (
            <div className="grid gap-4">
              <InstallBlock name={entry.name} />
              <div className="rounded-sm border-2 border-border bg-card p-4">
                <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  shadcn dependencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(entry.registryDependencies ?? []).map((d) => (
                    <span
                      key={d}
                      className="rounded-sm border-2 border-border px-1.5 py-0 font-mono text-[10px] uppercase tracking-[0.06em]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              {entry.dependencies?.length ? (
                <div className="rounded-sm border-2 border-border bg-card p-4">
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    npm dependencies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.dependencies.map((d) => (
                      <span
                        key={d}
                        className="rounded-sm border-2 border-border px-1.5 py-0 font-mono text-[10px] uppercase tracking-[0.06em]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  )
}
