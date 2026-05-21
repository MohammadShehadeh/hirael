"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/showcase/theme-provider"

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const isLight = mode === "light"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setMode(isLight ? "dark" : "light")}
      className={cn(
        "relative inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <Sun
        className={cn(
          "size-3.5 transition-all duration-200",
          mounted && isLight
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      />
      <Moon
        className={cn(
          "absolute size-3.5 transition-all duration-200",
          mounted && !isLight
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  )
}
