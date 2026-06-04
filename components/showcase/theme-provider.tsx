"use client"

import * as React from "react"

import {
  MODE_STORAGE_KEY,
  STORAGE_KEY,
  type Theme,
  type ThemeMode,
  type ThemeTokens,
} from "@/lib/theme"

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  theme: Theme
  setTokens: (mode: ThemeMode, tokens: ThemeTokens) => void
  mergeTheme: (partial: Partial<Theme>) => void
  reset: () => void
}

const EMPTY_THEME: Theme = { light: {}, dark: {} }

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Mode is read synchronously after mount; the pre-hydration script handles
  // the first paint, so this just brings React state in sync.
  const [mode, setModeState] = React.useState<ThemeMode>("light")
  const [theme, setTheme] = React.useState<Theme>(EMPTY_THEME)

  // Sync from storage once on mount.
  React.useEffect(() => {
    try {
      const storedMode = localStorage.getItem(MODE_STORAGE_KEY)
      if (storedMode === "light" || storedMode === "dark") {
        setModeState(storedMode)
      } else if (document.documentElement.classList.contains("dark")) {
        setModeState("dark")
      }
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Theme
        setTheme({
          light: parsed.light ?? {},
          dark: parsed.dark ?? {},
        })
      }
    } catch {
      // ignore
    }
  }, [])

  // Apply mode class.
  React.useEffect(() => {
    const html = document.documentElement
    if (mode === "dark") html.classList.add("dark")
    else html.classList.remove("dark")
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode)
    } catch {
      // ignore
    }
  }, [mode])

  // Apply tokens for the active mode. Clearing a token requires removeProperty.
  const appliedKeysRef = React.useRef<Set<string>>(new Set())
  React.useEffect(() => {
    const html = document.documentElement
    const active = mode === "light" ? theme.light : theme.dark
    const next = new Set<string>()
    for (const [k, v] of Object.entries(active)) {
      html.style.setProperty(`--${k}`, v)
      next.add(k)
    }
    // Remove anything previously applied that's now gone.
    for (const k of appliedKeysRef.current) {
      if (!next.has(k)) html.style.removeProperty(`--${k}`)
    }
    appliedKeysRef.current = next
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
    } catch {
      // ignore
    }
  }, [mode, theme])

  const setMode = React.useCallback((m: ThemeMode) => setModeState(m), [])

  const setTokens = React.useCallback(
    (target: ThemeMode, tokens: ThemeTokens) => {
      setTheme((prev) => ({ ...prev, [target]: tokens }))
    },
    []
  )

  const mergeTheme = React.useCallback((partial: Partial<Theme>) => {
    setTheme((prev) => ({
      light: { ...prev.light, ...(partial.light ?? {}) },
      dark: { ...prev.dark, ...(partial.dark ?? {}) },
    }))
  }, [])

  const reset = React.useCallback(() => {
    setTheme(EMPTY_THEME)
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ mode, setMode, theme, setTokens, mergeTheme, reset }),
    [mode, setMode, theme, setTokens, mergeTheme, reset]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>")
  return ctx
}
