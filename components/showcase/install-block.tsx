"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

export function InstallBlock({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const [origin, setOrigin] = React.useState<string>("")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(
        process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin
      )
    }
  }, [])

  const base = origin || "https://sabk.dev"
  const command = `npx shadcn@latest add ${base}/r/${name}.json`

  const onCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-sm border border-border bg-card px-3 py-2",
        className
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground shrink-0">
        $
      </span>
      <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
        <span className="text-muted-foreground">npx</span>{" "}
        <span className="text-foreground">shadcn@latest</span>{" "}
        <span className="text-muted-foreground">add</span>{" "}
        <span className="text-foreground">{base}/r/{name}.json</span>
      </code>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy install command"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-sm border border-transparent text-muted-foreground transition-colors hover:border-border hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5 text-foreground" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  )
}
