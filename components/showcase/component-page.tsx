"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { BlockViewer } from "@/components/showcase/block-viewer"
import { CodeBlock, type CodeBlockTab } from "@/components/showcase/code-block"
import { InstallBlock } from "@/components/showcase/install-block"
import type { RegistryEntryMeta } from "@/registry/new-york/registry-meta"

type Tab = "preview" | "usage" | "code" | "install"

export type SourceFile = {
  code: string
  html: string
  lang: string
}

export function ComponentPage({
  entry,
  source,
  demoSource,
}: {
  entry: RegistryEntryMeta
  /** Pre-highlighted source files keyed by repo-relative path. */
  source: Record<string, SourceFile>
  /** Pre-highlighted demo source — shows how to use the component. */
  demoSource?: SourceFile | null
}) {
  const [tab, setTab] = React.useState<Tab>("preview")

  const isBlock = entry.category === "blocks"

  const codeTabs: CodeBlockTab[] = React.useMemo(
    () =>
      (entry.sourceFiles ?? [])
        .map((f, i) => {
          const file = source[f]
          if (!file) return null
          const label = isBlock ? entry.installTargets?.[i] ?? f : f
          return { label, code: file.code, html: file.html }
        })
        .filter((t): t is CodeBlockTab => t !== null),
    [entry.sourceFiles, entry.installTargets, source, isBlock]
  )

  const Demo = entry.Demo
  const showUsageTab = !isBlock && !!demoSource

  const tabs = React.useMemo<Array<[Tab, string]>>(() => {
    const list: Array<[Tab, string]> = [["preview", "Preview"]]
    if (showUsageTab) list.push(["usage", "Usage"])
    list.push(["code", "Code"], ["install", "Install"])
    return list
  }, [showUsageTab])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:px-10">
      <header className="flex flex-col gap-3 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {entry.category}
          </span>
          {entry.blockKind && (
            <>
              <span className="font-mono text-[10px] text-muted-foreground">
                ·
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
                {entry.blockKind}
              </span>
            </>
          )}
          {entry.status === "planned" && (
            <span className="rounded-sm border border-border px-1.5 py-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              planned
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          {entry.title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {entry.description}
        </p>
        <InstallBlock name={entry.name} className="mt-1" />
      </header>

      {entry.status === "planned" ? (
        <div className="rounded-sm border border-dashed border-border bg-card/40 px-6 py-12 text-center">
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
          <div
            role="tablist"
            aria-label="View"
            className="-mx-4 flex items-center gap-0 overflow-x-auto overflow-y-hidden border-b border-border px-4 sm:mx-0 sm:px-0"
          >
            {tabs.map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={cn(
                  "relative -mb-[2px] shrink-0 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:text-foreground",
                  tab === k
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
                {tab === k && (
                  <span className="absolute inset-x-0 -bottom-[2px] h-[2px] bg-foreground" />
                )}
              </button>
            ))}
          </div>

          {tab === "preview" &&
            Demo &&
            (isBlock ? (
              <BlockViewer name={entry.name} title={entry.title} />
            ) : (
              <div className="flex min-h-[360px] items-center justify-center rounded-sm border border-border bg-card/40 p-6 sm:min-h-[420px] sm:p-8 md:p-10">
                <Demo />
              </div>
            ))}

          {tab === "usage" && demoSource && (
            <CodeBlock
              tabs={[
                {
                  label: `${entry.name}-demo.tsx`,
                  code: demoSource.code,
                  html: demoSource.html,
                },
              ]}
            />
          )}

          {tab === "code" && codeTabs.length > 0 && (
            <CodeBlock
              tabs={codeTabs}
              layout={isBlock ? "tree" : "tabs"}
            />
          )}

          {tab === "install" && (
            <div className="grid gap-4">
              <InstallBlock name={entry.name} />
              <div className="rounded-sm border border-border bg-card p-4">
                <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  shadcn dependencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(entry.registryDependencies ?? []).map((d) => (
                    <span
                      key={d}
                      className="rounded-sm border border-border px-1.5 py-0 font-mono text-[10px] uppercase tracking-[0.06em]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              {entry.dependencies?.length ? (
                <div className="rounded-sm border border-border bg-card p-4">
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    npm dependencies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.dependencies.map((d) => (
                      <span
                        key={d}
                        className="rounded-sm border border-border px-1.5 py-0 font-mono text-[10px] uppercase tracking-[0.06em]"
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
