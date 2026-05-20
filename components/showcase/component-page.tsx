"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CodeBlock, type CodeBlockTab } from "@/components/showcase/code-block"
import { InstallBlock } from "@/components/showcase/install-block"
import type { RegistryEntryMeta } from "@/registry/sabk/registry-meta"

type Tab = "preview" | "code" | "install"

export type SourceFile = {
  code: string
  html: string
  lang: string
}

export function ComponentPage({
  entry,
  source,
}: {
  entry: RegistryEntryMeta
  /** Pre-highlighted source files keyed by repo-relative path. */
  source: Record<string, SourceFile>
}) {
  const [tab, setTab] = React.useState<Tab>("preview")

  const codeTabs: CodeBlockTab[] = React.useMemo(
    () =>
      (entry.sourceFiles ?? [])
        .map((f) => {
          const file = source[f]
          if (!file) return null
          return { label: f, code: file.code, html: file.html }
        })
        .filter((t): t is CodeBlockTab => t !== null),
    [entry.sourceFiles, source]
  )

  const Demo = entry.Demo
  const isBlock = entry.category === "blocks"

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-8 px-6 py-10 md:px-10",
        isBlock ? "max-w-6xl" : "max-w-4xl"
      )}
    >
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
            isBlock ? (
              <div className="overflow-hidden rounded-sm border-2 border-border bg-background">
                <div className="flex items-center justify-between gap-3 border-b-2 border-border bg-card/50 px-4 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    full-width preview
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-forge" />
                    rendered in-page
                  </span>
                </div>
                <div className="relative">
                  <Demo />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-sm border-2 border-border bg-card/40 p-10">
                <Demo />
              </div>
            )
          )}

          {tab === "code" && codeTabs.length > 0 && (
            <CodeBlock tabs={codeTabs} />
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
