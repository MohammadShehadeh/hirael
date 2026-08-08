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
} from "@/lib/theme";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: Theme;
  mergeTheme: (partial: Partial<Theme>) => void;
  reset: () => void;
};

const EMPTY_THEME: Theme = { light: {}, dark: {} };

// Read the persisted token overrides synchronously so the editor state, the
// applied CSS variables, and the pre-paint script agree on the very first
// render. Without this the provider would mount empty and immediately write
// EMPTY_THEME back to storage, wiping a saved theme — and the framed `/embed/*`
// block previews (which re-run the same pre-paint script from the root layout)
// would load against the default palette instead of the active theme.
function readPersistedTheme(): Theme {
  if (typeof window === "undefined") return EMPTY_THEME;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_THEME;
    const parsed = JSON.parse(raw) as Partial<Theme>;
    return { light: parsed.light ?? {}, dark: parsed.dark ?? {} };
  } catch {
    return EMPTY_THEME;
  }
}

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

  const [theme, setThemeState] = React.useState<Theme>(readPersistedTheme);

  // Keep already-mounted documents in sync when another same-origin document
  // changes the theme. The theme sheet lives in the global nav, so a user can
  // re-skin while a block's `/embed/*` preview iframe is already on screen;
  // next-themes mirrors the light/dark mode across frames itself, this carries
  // the custom token overrides the same way. `storage` only fires in *other*
  // documents, so the writer never hears its own change.
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      const next = readPersistedTheme();
      setThemeState((prev) =>
        JSON.stringify(next) === JSON.stringify(prev) ? prev : next,
      );
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Apply tokens for the active mode. Clearing a token requires removeProperty.
  // This stays synchronous on every change so the live preview tracks the hue
  // slider in real time. Setting a handful of custom properties on <html> is
  // cheap; the page repaint the browser does off the back of it is rAF-batched.
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
  }, [mode, theme]);

  // Persistence is debounced so dragging the hue slider doesn't run a
  // JSON.stringify + synchronous localStorage write on every pointer-move tick.
  // It also drives the cross-frame `storage` sync, which doesn't need to be
  // frame-accurate. Mode isn't a dependency — the full theme is persisted.
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
      } catch {
        // ignore
      }
    }, 200);
    return () => window.clearTimeout(id);
  }, [theme]);

  const setMode = React.useCallback((m: ThemeMode) => setTheme(m), [setTheme]);

  const mergeTheme = React.useCallback((partial: Partial<Theme>) => {
    setThemeState((prev) => ({
      light: { ...prev.light, ...(partial.light ?? {}) },
      dark: { ...prev.dark, ...(partial.dark ?? {}) },
    }));
  }, []);

  const reset = React.useCallback(() => setThemeState(EMPTY_THEME), []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ mode, setMode, theme, mergeTheme, reset }),
    [mode, setMode, theme, mergeTheme, reset],
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
