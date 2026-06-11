"use client"

import * as React from "react"

/**
 * Client wrapper for statically exported block embeds. Reads the `dir`
 * query param at runtime so the block viewer can preview blocks in RTL.
 */
export function BlockEmbedShell({ children }: { children: React.ReactNode }) {
  const [dir, setDir] = React.useState<"ltr" | "rtl">("ltr")

  React.useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("dir")
    if (param === "rtl") setDir("rtl")
  }, [])

  return (
    <div dir={dir} className="min-h-svh bg-background">
      {children}
    </div>
  )
}
