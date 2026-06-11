"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { BlockViewer } from "@/components/showcase/block-viewer"
import { CodeBlock, type CodeBlockTab } from "@/components/showcase/code-block"
import { DirectionToggle } from "@/components/showcase/direction-toggle"
import { InstallBlock } from "@/components/showcase/install-block"
import { RegistryDemo } from "@/registry/hirael/registry-demos"
import type { RegistryEntryMeta } from "@/registry/hirael/registry-meta"

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
  const [rtl, setRtl] = React.useState(false)

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
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          {entry.title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {entry.description}
        </p>
        <InstallBlock name={entry.name} className="mt-1" />
      </header>

        <>
          <div
            role="tablist"
            aria-label="View"
            className="inline-flex w-fit items-center gap-0.5 rounded-md border border-border/70 bg-card/30 p-1 backdrop-blur-md"
            onKeyDown={(e) => {
              if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key))
                return
              e.preventDefault()
              const order = tabs.map(([k]) => k)
              const i = order.indexOf(tab)
              const next =
                e.key === "Home"
                  ? order[0]
                  : e.key === "End"
                    ? order[order.length - 1]
                    : order[
                        (i + (e.key === "ArrowRight" ? 1 : -1) + order.length) %
                          order.length
                      ]
              setTab(next)
              e.currentTarget
                .querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)
                ?.focus()
            }}
          >
            {tabs.map(([k, label]) => {
              const active = tab === k
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  id={`cmp-tab-${k}`}
                  aria-selected={active}
                  aria-controls="cmp-tabpanel"
                  tabIndex={active ? 0 : -1}
                  data-tab={k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "relative rounded-sm px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-cool",
                    active
                      ? "bg-background text-foreground shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--foreground)_10%,transparent),0_1px_0_0_color-mix(in_oklch,var(--background)_60%,transparent)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id="cmp-tabpanel"
            aria-labelledby={`cmp-tab-${tab}`}
            tabIndex={0}
            className="focus-visible:outline-none"
          >
            {tab === "preview" &&
              (isBlock ? (
                <BlockViewer name={entry.name} title={entry.title} />
              ) : (
                <div className="relative rounded-sm border border-border bg-card/40">
                  <DirectionToggle
                    rtl={rtl}
                    onToggle={setRtl}
                    className="absolute right-3 top-3 z-10"
                  />
                  <div
                    dir={rtl ? "rtl" : undefined}
                    className="flex min-h-[360px] items-center justify-center p-6 sm:min-h-[420px] sm:p-8 md:p-10"
                  >
                    <RegistryDemo name={entry.name} />
                  </div>
                </div>
              ))}

            {tab === "usage" && demoSource && (
              <CodeBlock
                tabs={[
                  {
                    label: `${entry.name}.demo.tsx`,
                    code: demoSource.code,
                    html: demoSource.html,
                  },
                ]}
              />
            )}

            {tab === "code" && codeTabs.length > 0 && (
              <CodeBlock tabs={codeTabs} layout={isBlock ? "tree" : "tabs"} />
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
          </div>
        </>
    </div>
  )
}
