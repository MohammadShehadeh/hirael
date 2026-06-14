"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

import {
  MODE_STORAGE_KEY,
  STORAGE_KEY,
  type Theme,
  type ThemeMode,
  type ThemeTokens,
} from "@/lib/theme";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: Theme;
  setTokens: (mode: ThemeMode, tokens: ThemeTokens) => void;
  mergeTheme: (partial: Partial<Theme>) => void;
  reset: () => void;
};

const EMPTY_THEME: Theme = { light: {}, dark: {} };

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

// Owns the live token-editor overrides and bridges next-themes' light/dark
// mode into the context shape the showcase already consumes. next-themes
// handles the `.light` / `.dark` class on <html>, persistence, and the
// pre-paint mode script; this layer only manages the custom CSS variables.
function TokenProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, theme: activeMode, setTheme } = useNextTheme();
  // Falls back to dark to match the SSR default before next-themes mounts.
  const mode: ThemeMode =
    (resolvedTheme ?? activeMode) === "light" ? "light" : "dark";

  const [theme, setThemeState] = React.useState<Theme>(EMPTY_THEME);

  // Apply tokens for the active mode. Clearing a token requires removeProperty.
  const appliedKeysRef = React.useRef<Set<string>>(new Set());
  React.useEffect(() => {
    const html = document.documentElement;
    const active = mode === "light" ? theme.light : theme.dark;
    const next = new Set<string>();
    for (const [k, v] of Object.entries(active)) {
      html.style.setProperty(`--${k}`, v);
      next.add(k);
    }
    // Remove anything previously applied that's now gone.
    for (const k of appliedKeysRef.current) {
      if (!next.has(k)) html.style.removeProperty(`--${k}`);
    }
    appliedKeysRef.current = next;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      // ignore
    }
  }, [mode, theme]);

  const setMode = React.useCallback((m: ThemeMode) => setTheme(m), [setTheme]);

  const setTokens = React.useCallback(
    (target: ThemeMode, tokens: ThemeTokens) => {
      setThemeState((prev) => ({ ...prev, [target]: tokens }));
    },
    [],
  );

  const mergeTheme = React.useCallback((partial: Partial<Theme>) => {
    setThemeState((prev) => ({
      light: { ...prev.light, ...(partial.light ?? {}) },
      dark: { ...prev.dark, ...(partial.dark ?? {}) },
    }));
  }, []);

  const reset = React.useCallback(() => setThemeState(EMPTY_THEME), []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ mode, setMode, theme, setTokens, mergeTheme, reset }),
    [mode, setMode, theme, setTokens, mergeTheme, reset],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // `.dark` mirrors the standard shadcn convention so registry components
  // authored with `dark:` variants resolve here exactly as in a consumer app;
  // `.light` carries this site's token overrides. enableSystem is off — the
  // showcase defaults to dark and the toggle is explicit.
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      themes={["light", "dark"]}
      enableSystem={false}
      storageKey={MODE_STORAGE_KEY}
      disableTransitionOnChange
    >
      <TokenProvider>{children}</TokenProvider>
    </NextThemesProvider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
