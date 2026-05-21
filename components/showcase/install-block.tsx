"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/showcase/copy-button"
import {
  PACKAGE_MANAGERS,
  getShadcnAddCommand,
  usePackageManager,
} from "@/lib/package-managers"
import { SITE } from "@/lib/site"

export function InstallBlock({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const [pm, setPm] = usePackageManager()
  const [origin, setOrigin] = React.useState("")

  React.useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin)
  }, [])

  const url = `${origin || SITE.registry.origin}/r/${name}.json`
  const command = getShadcnAddCommand(pm, url)

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-1 py-1">
        <div
          role="radiogroup"
          aria-label="Package manager"
          className="flex items-center gap-0.5"
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
            e.preventDefault()
            const dir = e.key === "ArrowRight" ? 1 : -1
            const i = PACKAGE_MANAGERS.indexOf(pm)
            const next =
              PACKAGE_MANAGERS[
                (i + dir + PACKAGE_MANAGERS.length) % PACKAGE_MANAGERS.length
              ]
            setPm(next)
            // Move focus to the newly selected tab so screen readers announce it.
            const el = e.currentTarget.querySelector<HTMLButtonElement>(
              `[data-pm="${next}"]`
            )
            el?.focus()
          }}
        >
          {PACKAGE_MANAGERS.map((p) => {
            const active = p === pm
            return (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                data-pm={p}
                onClick={() => setPm(p)}
                className={cn(
                  "rounded-sm px-2.5 py-1 font-mono text-[11px] tracking-tight transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            )
          })}
        </div>
        <CopyButton text={command} label="Copy install command" className="mr-0.5" />
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
  )
}

function CommandLine({ command }: { command: string }) {
  const tokens = command.split(" ")
  return (
    <code className="no-scrollbar min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">
      {tokens.map((t, i) => {
        const emphasis = t === "shadcn@latest" || /^https?:\/\//.test(t)
        return (
          <React.Fragment key={i}>
            {i > 0 && " "}
            <span
              className={emphasis ? "text-foreground" : "text-muted-foreground"}
            >
              {t}
            </span>
          </React.Fragment>
        )
      })}
    </code>
  )
}
